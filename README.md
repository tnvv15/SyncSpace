# 🌾 PaperCraft Studio — Local-First CRDT Collaborative Canvas

An artisanal, local-first collaborative canvas and workspace built with **React**, **TypeScript**, **Tailwind CSS**, **Yjs CRDT**, **y-indexeddb**, and **y-websocket**.

Designed with the tactile atmosphere of a creative printmaking workshop: unbleached craft parchment, risograph inks, washi tape, stamps, and vintage fountain pen multiplayer presence.

---

## ✨ Features

- **🏛️ 100% Local-First & Offline Ready:** Backed by `y-indexeddb` with zero data loss, instant optimistic writes, and seamless recovery upon page reload.
- **⚡ Real-Time CRDT Sync:** Backed by `Y.Doc` and `y-websocket` (pointing to `ws://localhost:1234`) with graceful fallback to local cache when offline.
- **📜 Tactile Paper Craft Aesthetic:**
  - Unbleached parchment background with organic dot grid and grain overlay.
  - Paper cards with subtle irregular rotations and physical tactile drop shadows.
  - Multi-hue washi tape strips, staples, and brass paperclips.
  - Bold Risograph ink palettes (Sunflower, Coral, Sage Olive, French Blue, Lavender, Kraft).
  - Rubber stamp seals (*APPROVED*, *DRAFT*, *URGENT*, *IDEA*, *COMPLETED*).
  - Kraft cutout shapes (Polaroids, circular badges, section banners, luggage tags).
- **✒️ Multiplayer Presence (Awareness):**
  - Vintage fountain pen cursors with colored ink tips and hand-stamped peer tags.
  - Peer avatar badges and customizable artisan nickname / ink color.
- **🗺️ Infinite Canvas & Minimap:**
  - Smooth pan (Space / Middle Mouse / 2-finger scroll) and zoom (10% - 300%).
  - Floating minimap with click-to-navigate viewport.
- **🚪 Room Switcher & Multi-Tab Tester:**
  - Dynamic `roomId` support via URL (`?room=...`).
  - One-click "Test Live Sync (Open New Tab)" button to instantly test peer sync locally.
- **💾 Export to JSON:** Export full studio board state to formatted JSON.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run the Yjs relay (a separate process)
```bash
npm run yjs
```
It listens on `ws://localhost:1234`. The Express API remains on port 5000.

---

## PostgreSQL configuration

Prisma and the Express backend read their PostgreSQL connection from the
backend-only `DATABASE_URL` environment variable. The database host is not
hardcoded in application code.

### Shared database for two PCs

After you obtain a shared PostgreSQL database, create a private `.env` file on
**each** PC (it is gitignored) using the exact same shared connection string:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Replace the placeholders with the connection details supplied by the database
host. Do not put this value in `VITE_*` variables, frontend code, Git, or a
committed `.env` file. `npm run server` loads this private `.env` for the
Express backend. Apply the existing migrations to a new shared database once:

```bash
npx prisma migrate deploy
```

Run this against the shared database only after checking that `DATABASE_URL`
points to it. It applies the tracked migrations without resetting or deleting
database data. The current migrations already create users, password reset
tokens, and documents; no new migration is needed for a host-only change.

To verify the setup, register on one PC, then sign in with that same account
on the other PC. A document created by that account should appear in its
document list on both PCs. Documents remain owner-protected: a different user
account will receive access denied unless document-sharing behavior is added
separately. Yjs canvas content uses its existing WebSocket relay and is outside
this PostgreSQL configuration; a relay at `localhost` is only local to one PC.

### Local Docker fallback

`docker-compose.yml` remains available for private local development and keeps
its existing `postgres_data` volume. To use it, keep Docker running and use a
private `.env` containing a local URL that matches its `POSTGRES_*` values:

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=syncspace
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/syncspace?schema=public"
```

Do not run `docker compose down -v` when preserving local data.

---

## 👥 Real-Time Peer Sync Testing

### Testing with Multi-Tabs (Default)
1. Start `npm run dev` and open `http://localhost:5173`.
2. Click the Room Switcher in the top left and click **"Test Live Sync (Open New Tab)"** or duplicate the tab.
3. Move notes, type text, or move your mouse — see Yjs CRDT synchronization and fountain pen cursors live!

### Optional: Running a Local Y-Websocket Server
To sync across different devices or separate browser instances:
```bash
npm run yjs
```
This runs a local Yjs WebSocket relay on port `1234`. The app connects automatically to `ws://localhost:1234`!

Each PostgreSQL canvas UUID maps to one isolated Yjs room named
`syncspace:<document-id>`. Canvas elements are held in the Yjs
`canvas-elements` map and mirrored into React for rendering. The same Y.Doc is
persisted in IndexedDB, so local edits survive reloads and merge when the relay
reconnects. The development relay deliberately has no room authorization;
sharing and access control must be added before production use.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `V` | Pointer / Select Tool |
| `Space` or `H` | Pan Canvas |
| `N` | Create Sticky Note |
| `T` | Create Index Card / Text Block |
| `+` / `-` | Zoom In / Out |
| `0` | Reset Zoom to 100% |
| `Del` / `Backspace` | Discard Selected Card |
| `?` | Open Studio Guide |
