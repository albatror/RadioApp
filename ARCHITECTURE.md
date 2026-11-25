# Architecture — EthnAfrika RadioApp

## Overview

PWA built with React 19 + TypeScript, bundled by Vite 6. Live-radio interface for the AzuraCast station at `ethnafrika.org`: now playing, history, next track.

## Tech Stack

React 19, TypeScript 5.8 (strict), Vite 6, ESLint 9, Playwright (e2e), `@fontsource` (self-hosted fonts), plain CSS (`index.css`).

## Directory Structure

```
├── index.html / index.tsx / index.css   # entry (fonts + css imported from index.tsx)
├── playwright.config.ts · eslint.config.js · tsconfig.json · vite.config.ts
├── public/                              # manifest.json, icons, images/, sw.js
├── tests/app.spec.ts                    # e2e (API + stream mocked)
├── .github/workflows/ci.yml             # typecheck, lint, tests, audit
└── src/
    ├── App.tsx                          # composition + layout only
    ├── constants.ts · types.ts · utils.ts · i18n.ts
    ├── hooks/
    │   ├── useRadioPlayer.ts            # <audio> lifecycle, backoff, volume, analyser, Media Session
    │   ├── useNowPlaying.ts             # polling, timeout/abort, validation, visibility-aware
    │   ├── useLikedSongs.ts             # localStorage, 24h TTL, cross-tab sync
    │   ├── usePersistentState.ts        # theme / language
    │   └── useIsMobile.ts               # matchMedia(max-width: 760px)
    └── components/
        Hero · ProgressBar · Visualizer · History · UpNext · Sidebar · TopBar · Controls · ErrorBoundary · Icons
```

## Data flow

```
AzuraCast API ──(10 s, paused when tab hidden)──► useNowPlaying ─► data + receivedAt
<audio> events ─────────────────────────────────► useRadioPlayer ─► status, analyser, volume
                                                        │
App.tsx ──► Hero (ProgressBar ticks itself every 1 s from receivedAt) · History · UpNext
```

Playback `status` (`idle | loading | playing | paused | error`) is derived from real media events, never set optimistically.

## Audio

`<audio crossOrigin="anonymous">` → `MediaElementSource` → `AnalyserNode` → destination. The context is created on the first user gesture. On pause the stream `src` is removed so the live stream stops buffering. Errors trigger reconnection with exponential backoff (2 s → 30 s, 8 attempts). The stream and API send permissive CORS headers (verified), which Web Audio capture requires.

## Responsive

`useIsMobile` mirrors the CSS breakpoint (760 px); App renders a mobile or a desktop tree around the same `Hero`.

## Offline / service worker

`public/sw.js` is registered in production builds only. It caches the app shell: navigation is network-first with the cached `/` as offline fallback, `/assets/*` (fingerprinted) is cache-first, other same-origin files are stale-while-revalidate. It ignores every cross-origin request and every Range request, so the live stream and the now-playing API always go to the network (offline, the UI shows the usual connection error). `vite.config.ts` replaces `__BUILD_ID__` in `dist/sw.js` at build time so each deploy uses a new cache and old ones are deleted on activate.

Images (logo, QR) live in `public/images/`.

## Known limitations

- The radio itself needs a connection: only the interface works offline.
- Not yet tested on iOS Safari with Web Audio capture.
