# Regola: Data-First

Non modificare `js/app.js` o `index.html` per adattarsi a una struttura dati diversa da quella in `docs/schema.md`.

Se lo schema deve cambiare:
1. Aggiorna `docs/schema.md`
2. Aggiorna `data/songs.json`
3. Poi aggiorna il codice

Il codice segue i dati, non il contrario.
