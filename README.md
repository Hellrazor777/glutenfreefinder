# GFF

Gluten Free Finder as an **Expo** app (Android, iOS, static web). Domain: [glutenfreefinder.online](https://www.glutenfreefinder.online).

## Run

```bash
npm install
npm test
npm run web          # Expo web (static output in app.json)
npm run export:web   # writes dist/ for glutenfreefinder.online
```

Android cloud build (no Mac):

```bash
npm i -g eas-cli
eas login
eas build --platform android --profile preview
```

Replace `expo.extra.eas.projectId` in `app.json` after `eas init`.

## Six practices on the home screen

1. One heading. First control is the postcode.
2. Geolocation runs only when that field is focused, never on load. A 4-digit postcode unlocks the product combobox.
3. Product picker is a combobox (type or scroll; ARIA on web).
4. Controls are full width, 44px minimum. Find stores is its own row.
5. Postcode uses `inputMode="numeric"`, `pattern="[0-9]{4}"`, `maxLength={4}`, `autoComplete="postal-code"`, `enterKeyHint="search"`, inside a `<form onSubmit>`.
6. Each store row stamps **checked N min ago**. After 120 minutes stock becomes **Unknown**. Woolworths stock and community sightings stay in separate columns.

## Push to GitHub

This agent cannot create `Hellrazor777/gluten-free-finder` (403). After you create the empty repo and grant the Cursor GitHub App access:

```bash
cd /home/ubuntu/gff/gff
git remote add origin https://github.com/Hellrazor777/gluten-free-finder.git
git push -u origin main
```

## Live Woolworths stock

The app does **not** call Woolworths from the browser (CORS + Akamai). The collector in `../gluten-free-finder-collector` must run a real Chrome session, set the fulfilment store, then `GET /apis/ui/Product/6067883` and HMAC-ingest. A residential proxy will not fix a non-browser request. Cloud IPs currently get Akamai **403**. Until a collector run on a real browser session succeeds, every row stays **Unknown** and we do not invent In Stock.

User-Agent includes `contact@glutenfreefinder.online`. The collector backs off on the first error.
