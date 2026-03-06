# Canzoniere — 10 Parole

Webapp statica per sfogliare testi di canzoni: indice con ricerca, visualizzazione testo, navigazione.

## Stack
- HTML/CSS/JS vanilla (nessun framework, nessuna dipendenza)
- Python 3 (solo per estrazione PDF e generazione dati)
- Hosting: GitHub Pages

## Schema dati

Vedi `docs/schema.md` per il dettaglio completo.

File centrale: `data/songs.json`
```json
{
  "songs": [
    { "id": 1, "title": "Titolo", "slug": "titolo", "lyrics": "Testo...\n" }
  ]
}
```
Campo futuro previsto: `chords` (tab accordi) — aggiungibile senza breaking changes.

## Mappa cartelle

```
data/           songs.json — unica fonte di verita
css/            style.css
js/             app.js
tools/          script Python (estrazione PDF, utilita)
tools/verify/   script di verifica connessioni/dati
tools/tests/    test per ogni script
architecture/   SOP tecniche in Markdown
docs/           task_plan, findings, progress, schema
.claude/        skills e rules per Claude Code
.tmp/           file temporanei (gitignored)
```

## Principi operativi

- **Data-first**: nessuna modifica al codice senza schema aggiornato in `docs/schema.md`
- **SOP-before-code**: se la logica cambia, aggiorna `architecture/*.md` prima del codice
- **Script deterministici**: business logic in `tools/*.py`, mai nell'output LLM
- **Self-repair**: stack trace → fix → test → documenta in `architecture/*.md`

## File di riferimento

IMPORTANT: leggi `docs/task_plan.md` per lo stato corrente del progetto.
IMPORTANT: leggi `docs/schema.md` prima di toccare `data/songs.json` o `js/app.js`.
- `docs/findings.md` — decisioni e vincoli
- `docs/progress.md` — log operativo
- `architecture/webapp.md` — logica della webapp
