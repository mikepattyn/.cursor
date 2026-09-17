# Next.js example-app

`deploymentMode` must be `static-export` or `node-server`. Set `DEPLOYMENT_MODE` accordingly.

- `node-server` (default): `next start` on `:4200`. `src/app/api/calculator/value/route.ts` proxies to `BFF_URL` (default `http://localhost:3000`).
- `static-export`: `output: 'export'`. Do not deploy the route handler; persist through the Vite/SPA same-origin `/api` proxy instead, or a separately hosted BFF.

Static export cannot serve Route Handlers. Choose one mode in the scaffold manifest and do not mix them in a single image.
