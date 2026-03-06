# Findings — decisioni e vincoli

## Decisioni architetturali

- **Webapp statica** scelta su backend: canzoniere personale, nessun utente esterno, aggiornamenti rari
- **Vanilla JS** su framework: zero dipendenze, massima portabilita, file apribile anche localmente
- **JSON come database**: modificabile a mano, versionabile con git, nessun setup richiesto
- **GitHub Pages** come hosting: gratuito, aggiornamento con git push

## Fonte dati

- PDF originale: `https://ugc.production.linktr.ee/230ff81f-e2e9-4c7e-be78-13c88bf0d64c_Canti-10-Parole.pdf`
- Estrazione via Python (`pdfplumber`)
- Risultato: `data/songs.json`

## Vincoli

- Ricerca: solo per titolo (non full-text sui testi)
- Per ora solo testo; campo `chords` previsto per future versioni
- Aggiunta nuove canzoni: modifica manuale di `songs.json`
- Lingua interfaccia: italiano

## Stato connessioni
- N/A — nessun servizio esterno
