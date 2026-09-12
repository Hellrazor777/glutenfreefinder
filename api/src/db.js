import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The database lives outside of source control under api/data.
const DB_PATH = process.env.GFF_DB_PATH
  ? resolve(process.env.GFF_DB_PATH)
  : resolve(__dirname, '..', 'data', 'gff.db');

mkdirSync(dirname(DB_PATH), { recursive: true });

const isFresh = !existsSync(DB_PATH);
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    cuisine TEXT NOT NULL DEFAULT 'Other',
    address TEXT,
    dedicated_gf INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'manual',
    external_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (source, external_id)
  );

  CREATE INDEX IF NOT EXISTS idx_places_city ON places (city);
  CREATE INDEX IF NOT EXISTS idx_places_name ON places (name);
`);

export function listPlaces({ q, city, dedicatedOnly, limit = 100 } = {}) {
  const clauses = [];
  const params = {};

  if (q) {
    clauses.push('(name LIKE @like OR cuisine LIKE @like OR city LIKE @like)');
    params.like = `%${q}%`;
  }
  if (city) {
    clauses.push('city = @city COLLATE NOCASE');
    params.city = city;
  }
  if (dedicatedOnly) {
    clauses.push('dedicated_gf = 1');
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  params.limit = Math.min(Number(limit) || 100, 500);

  const rows = db
    .prepare(
      `SELECT * FROM places ${where} ORDER BY dedicated_gf DESC, rating DESC, name ASC LIMIT @limit`
    )
    .all(params);
  return rows.map(deserialize);
}

export function getPlace(id) {
  const row = db.prepare('SELECT * FROM places WHERE id = ?').get(id);
  return row ? deserialize(row) : null;
}

export function createPlace(input) {
  const place = normalize(input);
  const stmt = db.prepare(`
    INSERT INTO places (name, city, country, cuisine, address, dedicated_gf, rating, source, external_id)
    VALUES (@name, @city, @country, @cuisine, @address, @dedicated_gf, @rating, @source, @external_id)
    ON CONFLICT (source, external_id) DO UPDATE SET
      name = excluded.name,
      city = excluded.city,
      country = excluded.country,
      cuisine = excluded.cuisine,
      address = excluded.address,
      dedicated_gf = excluded.dedicated_gf,
      rating = excluded.rating,
      updated_at = datetime('now')
    RETURNING id
  `);
  const { id } = stmt.get(place);
  return getPlace(id);
}

export function ingestPlaces(items) {
  const insertMany = db.transaction((rows) => {
    let count = 0;
    for (const row of rows) {
      createPlace(row);
      count += 1;
    }
    return count;
  });
  return insertMany(items);
}

export function stats() {
  const total = db.prepare('SELECT COUNT(*) AS n FROM places').get().n;
  const dedicated = db.prepare('SELECT COUNT(*) AS n FROM places WHERE dedicated_gf = 1').get().n;
  const cities = db.prepare('SELECT COUNT(DISTINCT city) AS n FROM places').get().n;
  return { total, dedicated, cities };
}

function normalize(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('body must be an object');
  }
  const name = String(input.name ?? '').trim();
  const city = String(input.city ?? '').trim();
  if (!name) throw new ValidationError('name is required');
  if (!city) throw new ValidationError('city is required');

  return {
    name,
    city,
    country: String(input.country ?? 'US').trim() || 'US',
    cuisine: String(input.cuisine ?? 'Other').trim() || 'Other',
    address: input.address ? String(input.address).trim() : null,
    dedicated_gf: input.dedicated_gf || input.dedicatedGf ? 1 : 0,
    rating: clampRating(input.rating),
    source: String(input.source ?? 'manual').trim() || 'manual',
    external_id: input.external_id ?? input.externalId ?? null
  };
}

function clampRating(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n * 10) / 10));
}

function deserialize(row) {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    country: row.country,
    cuisine: row.cuisine,
    address: row.address,
    dedicatedGf: Boolean(row.dedicated_gf),
    rating: row.rating,
    source: row.source,
    externalId: row.external_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class ValidationError extends Error {}

export const meta = { dbPath: DB_PATH, seededEmpty: isFresh };
export default db;
