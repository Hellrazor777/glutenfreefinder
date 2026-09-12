import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';

// Point the API at a throwaway database before importing the app.
const tmp = mkdtempSync(join(tmpdir(), 'gff-test-'));
process.env.GFF_DB_PATH = join(tmp, 'test.db');

const { createApp } = await import('../src/server.js');

let server;
let base;

before(async () => {
  const app = createApp();
  await new Promise((r) => {
    server = app.listen(0, '127.0.0.1', r);
  });
  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;
});

after(() => {
  server?.close();
  rmSync(tmp, { recursive: true, force: true });
});

test('health starts empty', async () => {
  const res = await fetch(`${base}/api/health`);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.total, 0);
});

test('create + fetch a place', async () => {
  const res = await fetch(`${base}/api/places`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Sweet Freedom Bakery', city: 'Philadelphia', cuisine: 'Bakery', dedicatedGf: true, rating: 4.8 })
  });
  assert.equal(res.status, 201);
  const place = await res.json();
  assert.ok(place.id);
  assert.equal(place.dedicatedGf, true);

  const list = await (await fetch(`${base}/api/places?q=freedom`)).json();
  assert.equal(list.count, 1);
  assert.equal(list.places[0].name, 'Sweet Freedom Bakery');
});

test('missing name is rejected', async () => {
  const res = await fetch(`${base}/api/places`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ city: 'Nowhere' })
  });
  assert.equal(res.status, 400);
});

test('ingest upserts idempotently by source + externalId', async () => {
  const payload = [
    { name: 'GF Pizza Co', city: 'Austin', cuisine: 'Pizza', source: 'seed', externalId: 'gfp-1', rating: 4.5 },
    { name: 'GF Pizza Co', city: 'Austin', cuisine: 'Pizza', source: 'seed', externalId: 'gfp-1', rating: 4.7 }
  ];
  const first = await (await fetch(`${base}/api/ingest`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })).json();
  assert.equal(first.ingested, 2);

  const list = await (await fetch(`${base}/api/places?city=Austin`)).json();
  assert.equal(list.count, 1, 'duplicate externalId should collapse to one row');
  assert.equal(list.places[0].rating, 4.7, 'later ingest updates rating');
});
