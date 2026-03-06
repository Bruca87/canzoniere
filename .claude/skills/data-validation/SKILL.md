---
name: data-validation
description: Valida che songs.json rispetti lo schema definito in docs/schema.md prima di qualsiasi deploy o modifica alla webapp.
---

## Quando usare
Prima di ogni deploy, dopo ogni modifica a `data/songs.json`.

## Procedura

1. Apri `data/songs.json`
2. Verifica che ogni oggetto abbia: `id` (intero), `title` (stringa non vuota), `slug` (stringa url-safe), `lyrics` (stringa non vuota)
3. Verifica che gli `id` siano unici e progressivi
4. Verifica che gli `slug` siano unici e non contengano spazi o caratteri speciali
5. Segnala qualsiasi anomalia prima di procedere

## Script di validazione
```bash
python tools/verify/validate_songs.py
```
