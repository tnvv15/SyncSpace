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

---

## 👥 Real-Time Peer Sync Testing

### Testing with Multi-Tabs (Default)
1. Start `npm run dev` and open `http://localhost:5173`.
2. Click the Room Switcher in the top left and click **"Test Live Sync (Open New Tab)"** or duplicate the tab.
3. Move notes, type text, or move your mouse — see Yjs CRDT synchronization and fountain pen cursors live!

### Optional: Running a Local Y-Websocket Server
To sync across different devices or separate browser instances:
```bash
npx y-websocket
```
This runs a local Yjs WebSocket relay on port `1234`. The app connects automatically to `ws://localhost:1234`!

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
