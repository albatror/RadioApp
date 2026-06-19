# Architecture — EthnAfrika RadioApp

## Overview

EthnAfrika is a Progressive Web App (PWA) built with React 19 + TypeScript, bundled by Vite 6. It acts as a live-streaming radio interface for the AzuraCast-powered station at `ethnafrika.org`, displaying real-time now-playing data, song history, and the upcoming track.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI framework | React | ^19.2.0 |
| Language | TypeScript | ~5.8.2 |
| Build tool | Vite | ^6.2.0 |
| React plugin | @vitejs/plugin-react | ^5.0.0 |
| Testing | Playwright | ^1.59.1 |
| PWA | Web App Manifest | — |
| Audio | Web Audio API (native) | — |
| Styling | Plain CSS (`index.css`) | — |

---

## Directory Structure

```
RadioApp-main/
├── index.html              # Entry HTML — importmap, PWA manifest link
├── index.tsx               # React root mount point
├── index.css               # Global stylesheet (single file)
├── package.json            # NPM manifest
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite build config
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/              # PWA icons (192×192, 512×512)
├── src/
│   ├── App.tsx             # Root component — state, audio engine, layout
│   ├── types.ts            # TypeScript interfaces for AzuraCast API
│   ├── constants.ts        # Empty placeholder
│   ├── metadata.json       # App description (unused at runtime)
│   └── components/
│       ├── Hero.tsx        # Main player card (art, controls, progress)
│       ├── History.tsx     # Recently played tracks list
│       ├── UpNext.tsx      # Upcoming track card
│       ├── Visualizer.tsx  # Canvas-free audio waveform (rAF + DOM refs)
│       ├── Sidebar.tsx     # Desktop sidebar (logo, QR, copyright)
│       ├── TopBar.tsx      # Desktop top bar (lang, theme, action buttons)
│       └── Icons.tsx       # SVG icon factory + named exports
├── verification/
│   └── verify_ui.spec.ts   # Playwright screenshot tests
└── test-results/           # Playwright output (failed screenshots)
```

---

## Component Tree

```
App (state hub)
├── [mobile path]
│   ├── mobile-header (logo + lang + theme toggle)
│   ├── Hero         (player card)
│   ├── UpNext       (next track)
│   ├── History      (recent tracks)
│   └── footer-strip (QR + socials + copyright)
└── [desktop path]
    ├── Sidebar      (logo, QR, copyright)
    └── main
        ├── TopBar   (lang, theme, action icons)
        ├── Hero     (player card)
        └── columns
            ├── History
            └── UpNext
```

---

## Data Flow

```
AzuraCast REST API (polling every 10s)
        │
        ▼
   App.tsx (useState: nowPlayingData)
        │
        ├──► Hero        ← nowPlaying, elapsed, playing, liked, analyser
        ├──► History     ← history[], isSongLiked, toggleLike
        ├──► UpNext      ← playing_next
        └──► Sidebar     ← listeners count
```

All state lives in `App.tsx`. Components are purely presentational — they receive props and emit callbacks.

---

## Audio Architecture

```
<audio> element (ref: audioRef)
        │
        └──► AudioContext (lazy-init on first play)
                 │
                 └──► MediaElementSourceNode
                              │
                              └──► AnalyserNode ──► speakers (destination)
                                        │
                                        └──► Visualizer (rAF loop reads frequency data)
```

- `AudioContext` is created lazily on first user interaction (browser autoplay policy compliance).
- `webkitAudioContext` fallback is included for Safari.
- Stream URL is cache-busted on every play with `?t=Date.now()`.
- Auto-reconnect on error with a 2-second debounce via `setTimeout`.

---

## Responsive Layout Strategy

`useIsMobile()` hook polls `window.innerWidth < 760px` on resize and returns a boolean. `App.tsx` renders entirely different JSX trees for mobile and desktop — no CSS-only breakpoints for structural changes.

---

## PWA Configuration

- `public/manifest.json`: standalone display, amber theme color (#FBBF24), 192×192 and 512×512 icons.
- No service worker registered — the app is not offline-capable despite having a manifest.
- `crossOrigin="anonymous"` on `<audio>` enables Web Audio API capture.

---

## Known Architectural Concerns

1. **Dual React loading**: `index.html` loads React via CDN importmap (`aistudiocdn.com`) while `package.json` bundles React via npm. This creates a runtime conflict.
2. **All state in App.tsx**: No context, no zustand, no reducer. Acceptable at current scale; will not scale past 3–4 more features.
3. **Single CSS file**: `index.css` contains all styles — no CSS modules, no scoping. Naming collisions will grow.
4. **No service worker**: PWA manifest exists but the app cannot work offline.
5. **Empty `constants.ts`**: All magic values are inlined in `App.tsx`.
