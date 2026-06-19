# Context — EthnAfrika RadioApp

## Project Identity

| Field | Value |
|-------|-------|
| Project name | EthnAfrika Music Player |
| Package name | `ethnafrika-music-player` |
| Version | 0.0.0 |
| Repository | `RadioApp-main` (local, branch: `main`) |
| Live station | https://ethnafrika.org |
| API endpoint | https://ethnafrika.org/api/nowplaying/ethnafrika |
| Stream URL | https://ethnafrika.org/listen/ethnafrika/radio.mp3 |

## Purpose

EthnAfrika is a web radio player PWA for the EthnAfrika.org station, a platform celebrating Afro-descendant sounds and cultures. The app provides a real-time listening experience: it streams the live broadcast, shows the currently playing track with artwork and progress, displays the last 6 songs played, and previews the upcoming track.

## Target Audience

- Music listeners interested in African and Afro-descendant culture
- Desktop and mobile users (bilingual: English and French)
- Intended to be installable as a PWA on mobile

## Business Context

- The station runs on **AzuraCast** — a self-hosted web radio management suite
- All media metadata (title, artist, genre, album art) comes from the AzuraCast REST API
- Audio stream is a standard MP3 live stream
- Social presence: Facebook, Instagram, Twitter/X, YouTube (links currently placeholder)

## Technical Decisions

### Why React 19?
Latest stable React. The project was scaffolded for Google AI Studio and uses the most current stack.

### Why Vite 6?
Fast HMR, ESM-native, minimal config. Standard choice for React projects in 2025.

### Why no state management library?
Project scope is small — a single radio station, no routing, no server state beyond one API endpoint. `useState` in `App.tsx` is sufficient.

### Why plain CSS?
Single-purpose UI, no design system requirement. One `index.css` is acceptable at this scale but will need refactoring if the project grows.

### Why Playwright for tests?
Visual regression testing was the initial goal — capturing screenshots to verify themes. Unit testing with Vitest has not been added.

### Liked songs with 24-hour TTL
Songs liked by the user expire from `localStorage` after 24 hours. This is a deliberate UX choice, likely to avoid stale like data accumulating.

## Current State (2026-06-19)

- **Working tree dirty**: `src/App.tsx` and `src/components/Sidebar.tsx` have uncommitted modifications
- **Tests failing**: Both Playwright tests failed in last run (screenshots exist in `test-results/`)
- **Swarm initialized**: Ruflo swarm `swarm-1781853196283-iqow0d` active (hierarchical topology)

## External Dependencies

| Resource | URL | Risk |
|----------|-----|------|
| Logo image | `i.ibb.co/YBntfXQm/...` | Third-party image CDN — could vanish |
| QR code image | `i.ibb.co/1fZZDz24/...` | Third-party image CDN — could vanish |
| React CDN | `aistudiocdn.com` (importmap) | External CDN — supply chain risk |
| AzuraCast API | `ethnafrika.org/api/...` | Production endpoint hardcoded |
| Audio stream | `ethnafrika.org/listen/...` | Production stream hardcoded |

## Constraints

- No backend — purely a frontend client
- No authentication required
- Audio streaming requires user gesture (browser autoplay policy)
- Web Audio API required for visualizer (gracefully degrades with sine fallback)
- `crossOrigin="anonymous"` required on `<audio>` for CORS-enabled Web Audio capture

## Team & Git History

- 2 commits on `main`:
  - `28c2fd2` — "Initial commit"
  - `10c6507` — "Delete" (removed content, purpose unclear)
- Git user: `X0r3`
- No CI/CD, no branch protection, no code review process documented

## Files to Gitignore (Currently Tracked)

- `ruvector.db` — binary vector database, should not be in version control
- `test-results/` — already partially tracked (error screenshots + last-run.json)
