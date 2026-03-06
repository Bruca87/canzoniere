# SOP — Webapp Canzoniere

## Obiettivo
Webapp statica single-page che carica `data/songs.json` e permette di sfogliare i testi.

## Viste

### Vista indice
- Mostra lista di tutti i titoli
- Campo di ricerca in alto con autocomplete sui titoli
- Click su titolo → vista canzone

### Vista canzone
- Mostra titolo + testo completo
- Bottone "Indietro" → torna all'indice (preserva eventuale ricerca attiva)
- Testo scorrevole

## Navigazione (hash-based)
- `#/` o `#` → indice
- `#/canzone/slug` → testo della canzone

Navigazione via `window.location.hash` — funziona su GitHub Pages senza server.

## Ricerca e autocomplete
- Filtro real-time sul campo titolo mentre si digita
- Mostra dropdown con suggerimenti (max 8 risultati)
- Click su suggerimento o Enter → naviga alla canzone
- Escape → chiude autocomplete

## Casi limite
- Canzone non trovata (slug inesistente) → reindirizza all'indice
- JSON non caricabile → messaggio di errore visibile
- Lista vuota → messaggio "Nessun risultato"

## Logica dati (app.js)
1. `fetch('data/songs.json')` al caricamento
2. Indice in memoria come array `songs[]`
3. Ricerca: `songs.filter(s => s.title.toLowerCase().includes(query))`
4. Render: manipolazione DOM diretta, no virtual DOM

## Formattazione testo (ritornello in grassetto)
Il campo `lyrics` usa marcatori `**...**` per le righe di ritornello.
Il renderer le converte in `<strong>` nel DOM:
- Riga normale → testo semplice
- Riga `**testo**` → `<strong>testo</strong>`
- Riga vuota → separatore di strofa

L'estrazione dal PDF usa il font `Lexend-Bold` per rilevare le righe di ritornello.
