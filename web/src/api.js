const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    let message = `request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return res.json();
}

export function fetchHealth() {
  return fetch(`${BASE}/health`).then(handle);
}

export function fetchPlaces({ q = '', city = '', dedicatedOnly = false } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (city) params.set('city', city);
  if (dedicatedOnly) params.set('dedicated', 'true');
  const qs = params.toString();
  return fetch(`${BASE}/places${qs ? `?${qs}` : ''}`).then(handle);
}

export function createPlace(place) {
  return fetch(`${BASE}/places`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(place)
  }).then(handle);
}
