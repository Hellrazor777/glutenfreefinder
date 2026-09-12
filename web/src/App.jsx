import React, { useEffect, useState, useCallback } from 'react';
import { fetchHealth, fetchPlaces, createPlace } from './api.js';

const EMPTY_FORM = { name: '', city: '', cuisine: '', address: '', rating: '4.5', dedicatedGf: true };

export default function App() {
  const [places, setPlaces] = useState([]);
  const [health, setHealth] = useState(null);
  const [query, setQuery] = useState('');
  const [dedicatedOnly, setDedicatedOnly] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [placesRes, healthRes] = await Promise.all([
        fetchPlaces({ q: query, dedicatedOnly }),
        fetchHealth()
      ]);
      setPlaces(placesRes.places);
      setHealth(healthRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, dedicatedOnly]);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await createPlace({ ...form, rating: Number(form.rating) });
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>🌾 GlutenFreeFinder</h1>
        <p>Discover gluten-free friendly places to eat.</p>
        {health && (
          <div className="stats">
            <span><strong>{health.total}</strong> places</span>
            <span><strong>{health.dedicated}</strong> dedicated GF</span>
            <span><strong>{health.cities}</strong> cities</span>
          </div>
        )}
      </header>

      <section className="controls">
        <input
          className="search"
          placeholder="Search by name, cuisine, or city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="toggle">
          <input type="checkbox" checked={dedicatedOnly} onChange={(e) => setDedicatedOnly(e.target.checked)} />
          Dedicated GF only
        </label>
      </section>

      {error && <div className="error">⚠ {error}</div>}

      <main className="grid">
        <section className="results">
          <h2>{loading ? 'Loading…' : `${places.length} result${places.length === 1 ? '' : 's'}`}</h2>
          <ul className="cards">
            {places.map((p) => (
              <li key={p.id} className="card">
                <div className="card-head">
                  <h3>{p.name}</h3>
                  <span className="rating">★ {p.rating.toFixed(1)}</span>
                </div>
                <p className="meta">{p.cuisine} · {p.city}, {p.country}</p>
                {p.address && <p className="address">{p.address}</p>}
                {p.dedicatedGf && <span className="badge">100% Gluten-Free</span>}
              </li>
            ))}
            {!loading && places.length === 0 && <li className="empty">No places match your search yet.</li>}
          </ul>
        </section>

        <aside className="add">
          <h2>Add a place</h2>
          <form onSubmit={onSubmit}>
            <label>Name<input required value={form.name} onChange={set('name')} /></label>
            <label>City<input required value={form.city} onChange={set('city')} /></label>
            <label>Cuisine<input value={form.cuisine} onChange={set('cuisine')} placeholder="Bakery, Italian…" /></label>
            <label>Address<input value={form.address} onChange={set('address')} /></label>
            <label>Rating
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
            </label>
            <label className="toggle">
              <input type="checkbox" checked={form.dedicatedGf} onChange={set('dedicatedGf')} />
              Dedicated gluten-free kitchen
            </label>
            <button type="submit">Add place</button>
          </form>
        </aside>
      </main>
    </div>
  );
}
