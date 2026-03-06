# Schema dati

## songs.json

```json
{
  "songs": [
    {
      "id": 1,
      "title": "Titolo della canzone",
      "slug": "titolo-della-canzone",
      "lyrics": "Prima strofa riga 1\nRiga 2\n\nRitornello\nRiga 2\n"
    }
  ]
}
```

| Campo  | Tipo    | Obbligatorio | Note |
|--------|---------|--------------|------|
| id     | intero  | si           | progressivo univoco |
| title  | stringa | si           | usato per ricerca e visualizzazione |
| slug   | stringa | si           | URL-safe: lowercase, spazi → trattini |
| lyrics | stringa | si           | `\n` per a capo, `\n\n` per separare strofe |

## Campi futuri (non breaking)

| Campo  | Tipo    | Note |
|--------|---------|------|
| chords | stringa | tab accordi, formato testo |

## Regole di slug

- tutto minuscolo
- spazi e punteggiatura → trattino `-`
- accenti rimossi (à → a, è → e, ecc.)
- no trattini doppi, no trattini iniziali/finali

## Come aggiungere una canzone manualmente

1. Apri `data/songs.json`
2. Aggiungi un oggetto nell'array `songs`
3. Usa `id` progressivo rispetto all'ultimo
4. Genera lo slug dal titolo seguendo le regole sopra
5. Inserisci il testo in `lyrics` usando `\n` per gli a capo
