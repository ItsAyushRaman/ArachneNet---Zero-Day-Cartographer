# Zero-Day Cartographer — Frontend

Complete running guide for the frontend UI (development, production build, API contract, and troubleshooting).

## Prerequisites
- Node.js 18.x or later (LTS recommended)
- npm 9.x or later (or yarn/pnpm)
- Optional: a running backend service at `http://localhost:8000` to provide live data and generation endpoints

## Quick start (local development)

1. Open a terminal and change to the frontend folder:

```bash
cd "d:/College Projects/H4G/zero-day-cartographer/frontend"
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the app in your browser (Vite will show the URL, typically):

```
http://localhost:5173
```

Notes: If the backend is not running, the frontend will fall back to a local mock dataset (seeded in `src/data/mockThreats.js`) and a mock generate result. This enables offline testing and UI verification.

## Production build

```bash
npm run build
npm run preview
```

The build artifacts are placed in `dist/`. Vite's preview serves the production build locally for verification.

## Environment variables
The frontend uses a base backend URL configured in `src/utils/api.js`. By default it points to `http://localhost:8000`. To use a different backend, set the `VITE_BACKEND_URL` environment variable before running Vite:

```powershell
$env:VITE_BACKEND_URL = "https://api.example.com"
npm run dev
```

Or on Unix/macOS:

```bash
VITE_BACKEND_URL=https://api.example.com npm run dev
```

The code reads `import.meta.env.VITE_BACKEND_URL` inside `src/utils/api.js`.

## API contract (backend expectations)
These are the endpoints and JSON shapes the frontend expects when connecting to a live backend. If you implement the backend, match these shapes to avoid runtime fallbacks.

- GET /api/threats
  - Response: 200 OK
  - Body: JSON array of threat objects
  - Threat object (example):

```json
{
  "id": "threat-123",
  "title": "Unvalidated input in image decoder",
  "severity": "CRITICAL",
  "attack_vector": "network",
  "affected_layer": "kernel",
  "source_name": "ThreatFeed",
  "source_url": "https://threatfeed.example/threat-123",
  "discovered_at": "2026-04-25T12:34:56Z",
  "cve_refs": ["CVE-2026-12345"],
  "description": "A buffer overflow in ...",
  "raw_excerpt": "...code snippet or evidence...",
  "related_ids": ["threat-122","threat-120"]
}
```

- GET /api/threats/{id}
  - Response: 200 OK
  - Body: single threat object (same shape as above)

- POST /api/generate
  - Request body: JSON { "threat_id": "threat-123" }
  - Response: 200 OK
  - Body example:

```json
{
  "middleware_code": "// patch code or configuration",
  "firewall_regex": "^GET \/admin \/.*$",
  "explanation": "This patch sanitizes input by ...",
  "notes": "optional additional guidance"
}
```

- POST /api/refresh
  - Request: triggers a re-scan/refresh of threats (optional)
  - Response: 200 OK with status object

- GET /api/status
  - Response: 200 OK
  - Body example: `{ "threat_count": 42, "sources_count": 3, "last_updated": "2026-05-01T08:00:00Z" }`

Failing to provide these endpoints is handled by the frontend via local mock data and fallback responses.

## Mock fallback
If the backend is unreachable, the frontend will:
- Seed the UI with `src/data/mockThreats.js` to populate the graph and panels immediately.
- Use `createMockGenerateResult()` (same file) to return a plausible generated patch when `POST /api/generate` fails.

To disable the fallback and force real-backend-only behavior, edit `src/hooks/useThreats.js` and `src/hooks/useGenerate.js` to remove or bypass the catch/fallback logic.

## Troubleshooting

- Dev server won't start / Vite errors
  - Ensure Node.js and npm versions meet the prerequisites.
  - Run `npm ci` or `npm install` to ensure all packages are present.

- Backend connection refused / CORS
  - If the frontend logs connection errors, start the backend at `http://localhost:8000` or set `VITE_BACKEND_URL` appropriately.
  - Enable CORS on the backend or proxy requests via a dev proxy.

- Three.js / multiple instance warnings
  - The app uses `three` and `react-force-graph-3d`. If you see warnings about multiple Three.js builds, ensure the backend or other packages don't bundle a separate `three` version.
  - Align `three` versions in your monorepo or enforce a single copy via your package manager's dedupe/hoisting features.

- Large build chunk warnings
  - Vite may warn about large chunks during `npm run build`. Consider dynamic imports (code-splitting) or manualChunks config in `vite.config.js` to split vendor code.

- Vulnerabilities reported by `npm audit`
  - Review and run `npm audit fix` (or `--force` if you accept risk). Prefer upgrading specific dependencies and re-testing.

## Running tests
This project does not include automated unit tests by default. If you add test tooling (Jest / Vitest), add scripts to `package.json` and document them here.

## Docker (optional)
You can serve the production build in a simple static server Docker image. Example steps:

```bash
cd frontend
npm run build
docker build -t zdc-frontend:latest .
docker run -p 8080:80 zdc-frontend:latest
```

Add a Dockerfile that copies `dist/` into a minimal nginx or caddy image and serves it.

## Contributing / Next steps
- If you have a backend, bring it up at `VITE_BACKEND_URL` and the UI will connect automatically.
- Consider addressing the large chunk warnings by splitting heavy dependencies.
- If you want, I can help wire the frontend to your live backend endpoints and remove mocks.

---

Files of interest
- `src/utils/api.js` — axios instance & base URL
- `src/data/mockThreats.js` — offline mock data and mock generator
- `src/hooks/useThreats.js` — data fetching and fallback logic
- `src/hooks/useGenerate.js` — generation flow and fallback
