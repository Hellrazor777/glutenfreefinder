# Gluten Free Finder

Expo Router app for [www.glutenfreefinder.online](https://www.glutenfreefinder.online) with PostHog product analytics.

This GitHub repository previously contained only a README. The live site is an Expo web export on Railway. This project is a buildable Expo Router app with the official `posthog-react-native` SDK wired for unique visitors and pageviews.

## PostHog

The SDK initializes on app start via `PostHogProvider` in [`src/app/_layout.tsx`](src/app/_layout.tsx). Expo Router pathname changes capture both `$screen` and `$pageview` (Web Analytics uses `$pageview` for unique visitors). Touch/click autocapture is on; session replay is off.

Credentials are the client project token (safe in the browser):

| Source | Variables |
| --- | --- |
| `EXPO_PUBLIC_POSTHOG_KEY` / `EXPO_PUBLIC_POSTHOG_HOST` | Optional overrides |
| `app.json` `expo.extra` | `posthogKey`, `posthogHost` |
| Code fallbacks | Same production project values |

No new Railway env vars are required. Copy [`.env.example`](.env.example) to `.env` only if you want to override locally.

## Scripts

```bash
npm install
npx expo start --web
npm run build          # expo export -p web → dist/
npm run start:prod     # serve the static export
```

## Verify analytics

1. Run `npx expo start --web` or deploy the static export.
2. Open the app and navigate Home → About.
3. In [PostHog Activity](https://us.posthog.com/project/605487/activity/explore) confirm `$pageview` / `$screen` events with `$pathname` `/` and `/about`.
