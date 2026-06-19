# Changelog

All notable changes to this project will be documented in this file.

Format: [Semantic Versioning](https://semver.org/) — `[version] YYYY-MM-DD`

---

## [Unreleased]

### Added
- Playwright visual regression tests (desktop + mobile light theme)
- PWA manifest with icons (192×192, 512×512)
- `ruvector.db` — vector database file (should be gitignored)

### Changed
- `src/constants.ts` emptied — constants moved inline to `App.tsx`
- `App.tsx` and `Sidebar.tsx` modified (current working tree changes)

### Known Issues
- Both Playwright tests currently failing (`test-results/.last-run.json` status: failed)
- `ruvector.db` binary committed to repository

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
