# Changelog

All notable changes to this project will be documented in this file.

Format: [Semantic Versioning](https://semver.org/) — `[version] YYYY-MM-DD`

---

## [Unreleased]

### Security
- `npm audit fix`: vite 6.4.1 → 6.4.6 (0 known vulnerabilities); dev server no longer binds `0.0.0.0`

### Added
- Hooks: `useRadioPlayer`, `useNowPlaying`, `useLikedSongs`, `useIsMobile`, `usePersistentState`
- Player state derived from real `<audio>` events (play/pause/waiting/stalled/error), incl. external pauses (media keys, headphones)
- Reconnection with exponential backoff (max 8 attempts, then an error message)
- Media Session API (lock-screen metadata and controls)
- Working volume slider; working Share button (Web Share API, clipboard fallback)
- `ErrorBoundary`, API response validation, request timeout/abort, polling paused on hidden tabs
- Accessibility: focus-visible styles, `aria-pressed`/`aria-live`, localized labels, `<html lang>` follows the language; language persisted and detected from the browser
- Playwright e2e tests with mocked API/stream (8 tests), `playwright.config.ts`, GitHub Actions CI, ESLint
- `@types/react`, `@types/react-dom`; TypeScript `strict` + `noUnusedLocals`
- Self-hosted fonts (`@fontsource`) instead of Google Fonts; meta description, Open Graph, apple-touch-icon

### Changed
- `VITE_AZURACAST_API_URL` / `VITE_STREAM_URL` are now actually read from the environment
- Paused stream is released (no background buffering)
- Progress bar is isolated in its own component, computed from the server timestamp and clamped to the track duration
- Visualizer animates `transform: scaleY` and falls back to the animation when the analyser is silent
- `useIsMobile` uses `matchMedia` (same breakpoint as CSS, no desktop flash on mobile)
- Mobile progress bar was collapsed to zero width — fixed

### Removed
- Inert controls (shuffle/prev/next, cast/notifications/settings, "See all"), unused search/schedule/genre CSS, `src/metadata.json`
- Tracked `test-results/`; the screenshot-only `verification/` spec

---

## [0.0.0] — Initial Release

### Added
- React 19 + TypeScript + Vite 6 project scaffold
- AzuraCast API integration (`/api/nowplaying/ethnafrika`) with 10-second polling
- Live audio streaming via `<audio>` element + Web Audio API
- `App.tsx`: root component with full state management
  - Now-playing data fetch and refresh
  - Play/pause toggle with cache-busting stream URL
  - AudioContext lazy initialization (autoplay policy compliance)
  - Safari `webkitAudioContext` fallback
  - Auto-reconnect on stream error (2s debounce)
  - Liked songs with 24-hour TTL stored in `localStorage`
  - Dark/light theme toggle persisted in `localStorage`
  - Elapsed time counter synced with API
- `Hero.tsx`: main player card with art, song info, progress bar, controls
- `History.tsx`: last 6 played tracks with like buttons and timestamps
- `UpNext.tsx`: upcoming track card with genre pill and share button
- `Visualizer.tsx`: 48-bar audio visualizer using `requestAnimationFrame`
  - Logarithmic frequency bin distribution
  - IntersectionObserver pause when off-screen
  - Visibility API pause when tab hidden
  - Fallback sine-wave animation when no AudioContext
- `Sidebar.tsx`: desktop sidebar with logo, QR code, copyright
- `TopBar.tsx`: desktop top bar with language selector, theme toggle, action icons
- `Icons.tsx`: SVG icon factory with named exports for 14 icons
- `src/types.ts`: TypeScript interfaces for AzuraCast API response
- Bilingual UI (EN / FR) via inline `t(en, fr)` helper
- Responsive layout: mobile (`< 760px`) and desktop views
- `useIsMobile()` hook for viewport detection
- `public/manifest.json`: PWA manifest
- `index.html`: PWA meta tags, importmap for React CDN
- `.gitignore`: standard Node.js ignores

---

## Roadmap (Suggested)

### v0.1.0 — Stability
- [ ] Fix dual React loading (remove CDN importmap or npm deps)
- [ ] Move hardcoded URLs to `.env` variables
- [ ] Fix empty `catch` blocks — add error state and UI feedback
- [ ] Add `LICENSE` file
- [ ] Gitignore `ruvector.db`

### v0.2.0 — Quality
- [ ] Add ESLint + Prettier
- [ ] Remove duplicate `fmtTime` function
- [ ] Type social link URLs
- [ ] Add unit tests (Vitest)
- [ ] Fix failing Playwright tests

### v0.3.0 — Production
- [ ] Add service worker for offline support
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add error boundary components
- [ ] Implement volume slider
- [ ] Enable functional share and cast buttons
