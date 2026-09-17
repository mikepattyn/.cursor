# Expo multiplatform (preview)

Tradeoffs versus the web `example-app`:

- One TypeScript Calculator + HTTP client, three shells (iOS, Android, web). Persist still goes through the BFF; native builds need a reachable `EXPO_PUBLIC_API_BASE_URL`, not same-origin `/api`.
- EAS Build/Submit credentials stay outside the repo. Copy `eas.json.example` → `eas.json` locally. Do not commit Apple/Google signing secrets.
- Expo Router / Metro do not replace Turbo for the JS workspace. Keep this app a leaf package; do not wrap native projects as npm packages.
- Web in Expo is a preview, not a substitute for the Vite/Angular `example-app` on `:4200`.
