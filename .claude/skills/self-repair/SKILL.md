---
name: self-repair
description: Repair loop da usare quando uno script in tools/ produce un errore. Analizza lo stack trace, patcha lo script, testa, documenta.
---

## Quando usare
Errore in `tools/*.py` o comportamento inatteso nell'output JSON.

## Procedura

1. **Leggi** lo stack trace completo. Non fare ipotesi prima di averlo letto.
2. **Individua** il file e la riga incriminata in `tools/`
3. **Correggi** lo script
4. **Testa** con `python tools/tests/test_[script].py`
5. **Documenta** l'apprendimento nel file `.md` corrispondente in `architecture/`

## Regola
Non procedere con il passo successivo finche il test non passa.
Non modificare `data/songs.json` a mano per aggirare un bug — correggi lo script.
