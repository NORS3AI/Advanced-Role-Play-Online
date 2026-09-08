# Advanced Role Play Online (ARPO)

> An online roleplaying application built for players who want an easy way to
> configure and explain their characters. Think **TRP3-style profiles, made
> easy** — built with **World of Warcraft** in mind, and designed to expand to
> other games, stories, and worlds.

**🌐 Live app:** <https://nors3ai.github.io/Advanced-Role-Play-Online/>

> **Note:** the URL is case-sensitive — the path must match the repository name
> exactly (`Advanced-Role-Play-Online`).

---

## About

**ARPO** brings the experience of Total RP 3 (TRP3) character profiles online
and makes them simple to build and share. Instead of scattering notes across
documents and chat logs, players get one place to define who their character
is, how they look, and the story that drives them.

The first target is **World of Warcraft** roleplay, but the character model is
generic so it can grow to other games, tabletop settings, and original worlds.

## Features

- **Landing page** with a quick choice: **Create a Character** or **Manage
  Characters**.
- **Create / edit** a character with a friendly, TRP3-inspired form:
  - **Identity** — title, name, nickname, full title, accent color
  - **Characteristics** — race, class, age, pronouns, height, weight, eyes,
    alignment, birthplace, residence
  - **About** — quote, physical description, personality, history
  - **Currently** — in-character / out-of-character status and current activity
- **Manage Characters** — a gallery of everything you've created, each with a
  **⋯ menu** to:
  - **Edit** the character
  - **Delete** the character
  - **Save as PNG**, **PDF**, or **Word document** (a formatted character sheet)

## How it works

ARPO is a static site hosted on **GitHub Pages**, so there's no server and no
login. Your characters are saved **privately in your browser** (via
`localStorage`) — they stay on the device/browser you created them on.

> Cross-device sync and shareable public profiles are a natural next step and
> would require adding a backend.

## Project structure

```
docs/                     ← GitHub Pages site root (served from main/docs)
├── index.html            ← landing page (logo, title, two buttons)
├── create.html           ← create / edit a character
├── manage.html           ← manage characters (gallery + ⋯ export menu)
├── .nojekyll             ← serve files as-is (no Jekyll processing)
└── assets/
    ├── css/styles.css     ← design system + character-sheet styles
    ├── js/store.js        ← character storage (localStorage) + helpers
    ├── js/export.js       ← PNG / PDF / Word export + sheet rendering
    └── img/logo.svg       ← ARPO emblem
```

Exports use [html2canvas](https://github.com/niklasvh/html2canvas) (PNG/PDF) and
[jsPDF](https://github.com/parallax/jsPDF) (PDF), loaded from a CDN; Word export
is generated as a Word-compatible `.doc` with no extra dependency.

## Running locally

Because the pages use relative asset paths, just serve the `docs/` folder with
any static server, for example:

```bash
cd docs
python3 -m http.server 8000
# then open http://localhost:8000
```

## GitHub Pages setup

Published from the [`docs/`](docs/) folder on the `main` branch:
**Settings → Pages → Deploy from a branch → `main` / `/docs`**.

## Contributing

Contributions, ideas, and feedback are welcome. Open an
[issue](https://github.com/NORS3AI/Advanced-Role-Play-Online/issues) to start a
discussion or propose a change.

## License

No license has been chosen yet. Until a license is added, all rights are
reserved by the project owner.
