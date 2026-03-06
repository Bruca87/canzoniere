"""
Estrae i testi delle canzoni dal PDF e genera data/songs.json.

Struttura PDF:
- Pagina 1: Titolo
- Pagina 2: Indice
- Pagine 3+: Canzoni nel formato "N. TITOLO\ntesto..."
  (alcune canzoni possono continuare nella pagina successiva)
"""

import json
import re
import unicodedata
import pdfplumber
from pathlib import Path

PDF_PATH = Path(__file__).parent.parent / ".tmp" / "canti.pdf"
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "songs.json"


def make_slug(title: str) -> str:
    normalized = unicodedata.normalize("NFKD", title)
    ascii_title = normalized.encode("ascii", "ignore").decode("ascii")
    slug = ascii_title.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def extract_songs(pdf_path: Path) -> list[dict]:
    songs = []
    current_song = None

    with pdfplumber.open(pdf_path) as pdf:
        # Salta pagina 1 (titolo) e pagina 2 (indice)
        for page in pdf.pages[2:]:
            text = page.extract_text()
            if not text:
                continue

            lines = text.strip().split("\n")
            first_line = lines[0].strip()

            # Controlla se la prima riga e un'intestazione di canzone: "N. TITOLO"
            match = re.match(r"^(\d+)\.\s+(.+)$", first_line)

            if match:
                # Salva la canzone precedente
                if current_song:
                    current_song["lyrics"] = current_song["lyrics"].strip()
                    songs.append(current_song)

                song_num = int(match.group(1))
                title = match.group(2).strip().title()
                raw_title = match.group(2).strip()
                lyrics = "\n".join(lines[1:]).strip()

                current_song = {
                    "id": song_num,
                    "title": title,
                    "slug": make_slug(raw_title),
                    "lyrics": lyrics,
                }
            else:
                # Continuazione della canzone precedente
                if current_song:
                    current_song["lyrics"] += "\n" + text.strip()

    # Aggiungi l'ultima canzone
    if current_song:
        current_song["lyrics"] = current_song["lyrics"].strip()
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
