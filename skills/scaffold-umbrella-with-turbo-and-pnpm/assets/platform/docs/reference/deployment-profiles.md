# Deployment profiles

| Profile | Use |
| --- | --- |
| `local-only` | Host `pnpm` / native binaries. No container publish. |
| `container` | Docker Compose or a single service image. Non-root, `start` not `dev`. |
| `static` | `DEPLOYMENT_MODE=static-export` (Next) or a Vite/Angular static build behind CloudFront/S3. No Route Handlers. |
| `node-server` | Long-running Node (`next start`, Express BFF). |
| `mobile` | Expo / Capacitor. Signing stays outside the repo. |
| `desktop` | Tauri / Electron. Signing is external. |

Pick one profile per leaf in `scaffold.manifest.yaml`. Do not mix `static` and `node-server` in the same Next image.
