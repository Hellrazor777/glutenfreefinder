import express from 'express';
import cors from 'cors';
import {
  listPlaces,
  getPlace,
  createPlace,
  ingestPlaces,
  stats,
  meta,
  ValidationError
} from './db.js';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: meta.dbPath, ...stats() });
  });

  app.get('/api/places', (req, res) => {
    const { q, city, dedicated, limit } = req.query;
    const places = listPlaces({
      q: q?.toString(),
      city: city?.toString(),
      dedicatedOnly: dedicated === 'true' || dedicated === '1',
      limit
    });
    res.json({ count: places.length, places });
  });

  app.get('/api/places/:id', (req, res) => {
    const place = getPlace(Number(req.params.id));
    if (!place) return res.status(404).json({ error: 'not found' });
    res.json(place);
  });

  app.post('/api/places', (req, res) => {
    try {
      const place = createPlace(req.body);
      res.status(201).json(place);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      throw err;
    }
  });

  // Bulk upsert endpoint used by the collector service.
  app.post('/api/ingest', (req, res) => {
    const items = Array.isArray(req.body) ? req.body : req.body?.places;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'expected an array of places or { places: [...] }' });
    }
    try {
      const ingested = ingestPlaces(items);
      res.json({ ingested, ...stats() });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      throw err;
    }
  });

  return app;
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const app = createApp();
  app.listen(PORT, HOST, () => {
    console.log(`[api] GlutenFreeFinder API listening on http://${HOST}:${PORT}`);
    console.log(`[api] database: ${meta.dbPath}`);
  });
}
