# glutenfreefinder

Discover gluten-free friendly places to eat. A small monorepo with three services:

| Service | Path | Stack | Port |
| --- | --- | --- | --- |
| API | `api/` | Express + SQLite (`better-sqlite3`) | `3001` |
| Collector | `collector/` | Node worker that ingests venues into the API | — |
| Web | `web/` | React + Vite | `5173` |

## How it fits together

```
collector/  --POST /api/ingest-->  api/  <--/api proxy--  web/
 (seed data)                     (SQLite)               (React UI)
```

The **collector** reads a curated dataset (`collector/data/seed.json`), waits for
the API to be healthy, and bulk-upserts venues via `POST /api/ingest`. The **API**
persists them in SQLite and exposes search/create endpoints. The **web** app proxies
`/api` to the API and lets you search and add places.

## Getting started

```bash
npm install            # installs all three workspaces

npm run dev:api        # terminal 1 - API on :3001
npm run start:collector# terminal 2 - seeds the API, then collects on an interval
npm run dev:web        # terminal 3 - web app on :5173
```

Open http://localhost:5173.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Status + counts (`total`, `dedicated`, `cities`) |
| `GET` | `/api/places?q=&city=&dedicated=` | Search places |
| `GET` | `/api/places/:id` | Fetch a single place |
| `POST` | `/api/places` | Add a place |
| `POST` | `/api/ingest` | Bulk upsert (used by the collector) |

## Tests

```bash
npm test               # API integration tests (node:test)
```

## Configuration

| Variable | Default | Used by |
| --- | --- | --- |
| `PORT` | `3001` (api) / `5173` (web) | api, web |
| `GFF_DB_PATH` | `api/data/gff.db` | api |
| `GFF_API_URL` | `http://localhost:3001` | collector, web proxy |
| `GFF_SEED_PATH` | `collector/data/seed.json` | collector |
| `GFF_COLLECT_INTERVAL_MS` | `300000` | collector |
| `GFF_COLLECT_ONCE` / `--once` | off | collector |
