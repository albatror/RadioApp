# EthnAfrika — Web Radio

Progressive Web App (React 19 + TypeScript + Vite) for the live AzuraCast station at `ethnafrika.org`: now playing, recent tracks, next track, bilingual EN/FR, dark/light themes.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Optional configuration (see `.env.example`): `VITE_AZURACAST_API_URL`, `VITE_STREAM_URL`.
Never put secrets in `VITE_*` variables — they end up in the public bundle.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (`dist/`) |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint |
| `npm test` | Playwright end-to-end tests (builds and serves the app; API and stream are mocked). First time: `npx playwright install chromium` |

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests and `npm audit`.

See `ARCHITECTURE.md` for the code layout and `CHANGELOG.md` for history.
