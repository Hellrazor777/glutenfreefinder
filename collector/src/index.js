import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_URL = process.env.GFF_API_URL ?? 'http://localhost:3001';
const SEED_PATH = process.env.GFF_SEED_PATH
  ? resolve(process.env.GFF_SEED_PATH)
  : resolve(__dirname, '..', 'data', 'seed.json');
const INTERVAL_MS = Number(process.env.GFF_COLLECT_INTERVAL_MS ?? 5 * 60 * 1000);
const RUN_ONCE = process.argv.includes('--once') || process.env.GFF_COLLECT_ONCE === 'true';

function log(...args) {
  console.log('[collector]', ...args);
}

async function loadDataset() {
  const raw = await readFile(SEED_PATH, 'utf8');
  const items = JSON.parse(raw);
  // Stamp the origin so the API can upsert by (source, externalId).
  return items.map((item) => ({ ...item, source: 'seed' }));
}

async function waitForApi(retries = 30, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (res.ok) {
        log(`API is reachable at ${API_URL}`);
        return true;
      }
    } catch {
      // API not up yet.
    }
    log(`waiting for API (${attempt}/${retries})...`);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`API never became reachable at ${API_URL}`);
}

async function collectOnce() {
  const dataset = await loadDataset();
  const res = await fetch(`${API_URL}/api/ingest`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dataset)
  });
  if (!res.ok) {
    throw new Error(`ingest failed: ${res.status} ${await res.text()}`);
  }
  const result = await res.json();
  log(`ingested ${result.ingested} venues -> total ${result.total} (${result.dedicated} dedicated GF across ${result.cities} cities)`);
  return result;
}

async function main() {
  log(`starting. api=${API_URL} seed=${SEED_PATH} once=${RUN_ONCE}`);
  await waitForApi();
  await collectOnce();

  if (RUN_ONCE) {
    log('done (run-once mode).');
    return;
  }

  log(`scheduling recurring collection every ${Math.round(INTERVAL_MS / 1000)}s`);
  setInterval(() => {
    collectOnce().catch((err) => log('collection error:', err.message));
  }, INTERVAL_MS);
}

main().catch((err) => {
  console.error('[collector] fatal:', err.message);
  process.exit(1);
});
