/* Canzoniere — 10 Parole
   Logica: caricamento dati, ricerca, autocomplete, navigazione hash-based */

(function () {
  "use strict";

  // ─── Stato ──────────────────────────────────────────────────────────────────

  let songs = [];
  let activeAutocompleteIndex = -1;

  // ─── Elementi DOM ────────────────────────────────────────────────────────────

  const viewIndex = document.getElementById("view-index");
  const viewSong = document.getElementById("view-song");
  const songList = document.getElementById("song-list");
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  const autocompleteList = document.getElementById("autocomplete-list");
  const noResults = document.getElementById("no-results");
  const backBtn = document.getElementById("back-btn");
  const songTitle = document.getElementById("song-title");
  const songLyrics = document.getElementById("song-lyrics");
  const header = document.querySelector(".header");

  // ─── Caricamento dati ────────────────────────────────────────────────────────

  async function loadSongs() {
    try {
      const res = await fetch("data/songs.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      songs = data.songs;
      renderSongList(songs);
      router();
    } catch (err) {
      songList.innerHTML = `<li style="color:#c00;padding:16px 0">Errore nel caricamento dei canti. (${err.message})</li>`;
    }
  }

  // ─── Render lista ────────────────────────────────────────────────────────────

  function renderSongList(list) {
    songList.innerHTML = "";
    noResults.hidden = list.length > 0;

    list.forEach((song) => {
      const li = document.createElement("li");
      li.dataset.slug = song.slug;

      const numSpan = document.createElement("span");
      numSpan.className = "song-number";
      numSpan.textContent = song.id;

      const nameSpan = document.createElement("span");
      nameSpan.className = "song-name";
      nameSpan.textContent = song.title;

      li.appendChild(numSpan);
      li.appendChild(nameSpan);
      li.addEventListener("click", () => navigateTo(song.slug));
      songList.appendChild(li);
    });
  }

  // ─── Ricerca ─────────────────────────────────────────────────────────────────

  function filterSongs(query) {
    if (!query) return songs;
    const q = query.toLowerCase();
    return songs.filter((s) => s.title.toLowerCase().includes(q));
  }

  function onSearchInput() {
    const query = searchInput.value.trim();
    searchClear.hidden = query.length === 0;
    activeAutocompleteIndex = -1;

    if (query.length === 0) {
      renderSongList(songs);
      hideAutocomplete();
      return;
    }

    const results = filterSongs(query);
    renderSongList(results);
    renderAutocomplete(results, query);
  }

  // ─── Autocomplete ────────────────────────────────────────────────────────────

  function renderAutocomplete(results, query) {
    const max = 8;
    const items = results.slice(0, max);

    if (items.length === 0) {
      hideAutocomplete();
      return;
    }

    autocompleteList.innerHTML = "";
    const q = query.toLowerCase();

    items.forEach((song, idx) => {
      const li = document.createElement("li");
      li.role = "option";
      li.dataset.idx = idx;

      // Evidenzia la parte che corrisponde alla query
      const title = song.title;
      const matchStart = title.toLowerCase().indexOf(q);
      if (matchStart >= 0) {
        li.innerHTML =
          escapeHtml(title.slice(0, matchStart)) +
          "<mark>" + escapeHtml(title.slice(matchStart, matchStart + q.length)) + "</mark>" +
          escapeHtml(title.slice(matchStart + q.length));
      } else {
        li.textContent = title;
      }

      li.addEventListener("mousedown", (e) => {
        e.preventDefault(); // evita blur prima del click
        navigateTo(song.slug);
        hideAutocomplete();
      });

      autocompleteList.appendChild(li);
    });

    autocompleteList.hidden = false;
  }

  function hideAutocomplete() {
    autocompleteList.hidden = true;
    autocompleteList.innerHTML = "";
    activeAutocompleteIndex = -1;
  }

  function moveAutocomplete(direction) {
    const items = autocompleteList.querySelectorAll("li");
    if (items.length === 0) return;

    items[activeAutocompleteIndex]?.classList.remove("active");
    activeAutocompleteIndex = Math.max(
      -1,
      Math.min(items.length - 1, activeAutocompleteIndex + direction)
    );
    items[activeAutocompleteIndex]?.classList.add("active");
    items[activeAutocompleteIndex]?.scrollIntoView({ block: "nearest" });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ─── Navigazione hash-based ──────────────────────────────────────────────────

  function navigateTo(slug) {
    window.location.hash = "/canzone/" + slug;
  }

  function router() {
    const hash = window.location.hash;

    if (hash.startsWith("#/canzone/")) {
      const slug = hash.slice("#/canzone/".length);
      const song = songs.find((s) => s.slug === slug);

      if (song) {
        showSong(song);
      } else {
        // Slug non trovato: torna all'indice
        window.location.hash = "";
      }
    } else {
      showIndex();
    }
  }

  function showIndex() {
    viewSong.hidden = true;
    viewIndex.hidden = false;
    searchInput.focus();
    window.scrollTo(0, 0);
  }

  function renderLyrics(lyrics) {
    songLyrics.innerHTML = "";
    const lines = lyrics.split("\n");
    lines.forEach((line, i) => {
      if (line === "") {
        songLyrics.appendChild(document.createElement("br"));
      } else {
        const match = line.match(/^\*\*(.+)\*\*$/);
        const el = document.createElement("span");
        if (match) {
          const strong = document.createElement("strong");
          strong.textContent = match[1];
          el.appendChild(strong);
        } else {
          el.textContent = line;
        }
        songLyrics.appendChild(el);
        if (i < lines.length - 1) {
          songLyrics.appendChild(document.createTextNode("\n"));
        }
      }
    });
  }

  function showSong(song) {
    viewIndex.hidden = true;
    viewSong.hidden = false;
    songTitle.textContent = song.title;
    renderLyrics(song.lyrics);
    window.scrollTo(0, 0);
  }

  // ─── Header scroll shadow ─────────────────────────────────────────────────────

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }
  }

  // ─── Event listeners ─────────────────────────────────────────────────────────

  searchInput.addEventListener("input", onSearchInput);

  searchInput.addEventListener("keydown", (e) => {
    if (autocompleteList.hidden) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveAutocomplete(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveAutocomplete(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const items = autocompleteList.querySelectorAll("li");
      if (activeAutocompleteIndex >= 0 && items[activeAutocompleteIndex]) {
        items[activeAutocompleteIndex].dispatchEvent(new Event("mousedown"));
      }
    } else if (e.key === "Escape") {
      hideAutocomplete();
    }
  });

  searchInput.addEventListener("blur", () => {
    // Ritardo per permettere il click sull'autocomplete
    setTimeout(hideAutocomplete, 150);
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchClear.hidden = true;
    renderSongList(songs);
    hideAutocomplete();
    searchInput.focus();
  });

  backBtn.addEventListener("click", () => {
    window.location.hash = "";
  });

  window.addEventListener("hashchange", router);
  window.addEventListener("scroll", onScroll, { passive: true });

  // ─── Init ────────────────────────────────────────────────────────────────────

  loadSongs();
})();
