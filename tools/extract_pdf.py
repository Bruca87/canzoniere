"""
Estrae i testi delle canzoni dal PDF e genera data/songs.json.

Struttura PDF:
- Pagina 1: Titolo
- Pagina 2: Indice
- Pagine 3+: Canzoni nel formato "N. TITOLO\ntesto..."
  (alcune canzoni possono continuare nella pagina successiva)

Formattazione:
- Righe in font Lexend-Bold → ritornello → marcate con **...**
- Righe in font Lexend-Regular → strofa normale
"""

import json
import re
import unicodedata
import pdfplumber
from pathlib import Path

PDF_PATH = Path(__file__).parent.parent / ".tmp" / "canti.pdf"
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "songs.json"

BOLD_FONT = "Bold"  # substring del fontname per rilevare grassetto


def make_slug(title: str) -> str:
    normalized = unicodedata.normalize("NFKD", title)
    ascii_title = normalized.encode("ascii", "ignore").decode("ascii")
    slug = ascii_title.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def extract_lines_with_formatting(page) -> list[tuple[str, bool]]:
    """
    Restituisce lista di (testo_riga, is_bold).
    Raggruppa i caratteri per riga (coordinata y) e determina
    se la riga è prevalentemente in grassetto.
    """
    chars = page.chars
    if not chars:
        return []

    # Raggruppa per coordinata y (arrotondata a 1 decimale)
    lines: dict[float, list] = {}
    for char in chars:
        y = round(char["top"], 0)
        lines.setdefault(y, []).append(char)

    result = []
    for y in sorted(lines.keys()):
        line_chars = sorted(lines[y], key=lambda c: c["x0"])
        text = "".join(c["text"] for c in line_chars).strip()
        if not text:
            continue
        bold_count = sum(1 for c in line_chars if BOLD_FONT in c["fontname"])
        is_bold = bold_count > len(line_chars) * 0.5
        result.append((text, is_bold))

    return result


def format_lyrics(lines: list[tuple[str, bool]]) -> str:
    """
    Converte lista di (testo, is_bold) in stringa con marcatori **...**
    per le righe di ritornello. Inserisce riga vuota tra blocchi diversi.
    """
    output = []
    prev_bold = None

    for text, is_bold in lines:
        # Inserisce separatore quando cambia tipo (strofa ↔ ritornello)
        if prev_bold is not None and is_bold != prev_bold:
            output.append("")
        formatted = f"**{text}**" if is_bold else text
        output.append(formatted)
        prev_bold = is_bold

    return "\n".join(output)


def extract_songs(pdf_path: Path) -> list[dict]:
    songs = []
    current_song = None
    current_lines: list[tuple[str, bool]] = []

    with pdfplumber.open(pdf_path) as pdf:
        # Salta pagina 1 (titolo) e pagina 2 (indice)
        for page in pdf.pages[2:]:
            lines = extract_lines_with_formatting(page)
            if not lines:
                continue

            first_text, first_bold = lines[0]
            match = re.match(r"^(\d+)\.\s*(.+)$", first_text)

            if match:
                # Salva la canzone precedente
                if current_song is not None:
                    current_song["lyrics"] = format_lyrics(current_lines).strip()
                    songs.append(current_song)

                song_num = int(match.group(1))
                raw_title = match.group(2).strip()
                title = raw_title.title()

                current_song = {
                    "id": song_num,
                    "title": title,
                    "slug": make_slug(raw_title),
                    "lyrics": "",
                }
                current_lines = lines[1:]  # escludi la riga del titolo
            else:
                # Continuazione della canzone precedente
                if current_song is not None:
                    if current_lines:
                        current_lines.append(("", False))  # separatore pagina
                    current_lines.extend(lines)

    # Aggiungi l'ultima canzone
    if current_song is not None:
        current_song["lyrics"] = format_lyrics(current_lines).strip()
        songs.append(current_song)

    return songs


def main():
    print(f"Lettura PDF: {PDF_PATH}")
    songs = extract_songs(PDF_PATH)
    print(f"Canzoni estratte: {len(songs)}")

    for song in songs:
        print(f"  {song['id']:2}. {song['title']}")

    output = {"songs": songs}
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    print(f"\nScritto: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
