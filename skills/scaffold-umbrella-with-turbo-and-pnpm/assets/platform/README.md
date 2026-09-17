# Umbrella

Private Turborepo + pnpm platform. JavaScript leaves are workspace packages. Native services stay on their own toolchains and are dispatched from `scaffold.manifest.yaml`.

## First run

```bash
corepack enable
pnpm install
node scripts/repo.mjs check
node scripts/repo.mjs dev:web
```

Persist path (when the topology includes a BFF and service):

```bash
node scripts/repo.mjs dev:full
```

Open http://localhost:4200/. Arithmetic works without backends. Reload persistence needs Compose.

## Map

| Path | Role |
|------|------|
| [CONTEXT-MAP.md](CONTEXT-MAP.md) | Repository index |
| [docs/tutorial/get-started.md](docs/tutorial/get-started.md) | First local run |
| [docs/reference/repository-layout.md](docs/reference/repository-layout.md) | Paths and names |
| [packages/contracts/openapi/calculator-api/openapi.yaml](packages/contracts/openapi/calculator-api/openapi.yaml) | Persist contract |
| [scaffold.manifest.yaml](scaffold.manifest.yaml) | Selected templates and commands |
| [docs/reference/toolchains.md](docs/reference/toolchains.md) | Pinned toolchains |
| [docs/reference/release-policy.md](docs/reference/release-policy.md) | Private by default; publishable opt-in |
| [docs/reference/deployment-profiles.md](docs/reference/deployment-profiles.md) | local / container / static / server / mobile / desktop |
| [docs/how-to/add-template.md](docs/how-to/add-template.md) | How to extend the catalog |

## Commands

| Command | What it runs |
|---------|----------------|
| `node scripts/repo.mjs check` | JS Turbo check plus any `native:` entries |
| `node scripts/repo.mjs test` | Workspace tests |
| `node scripts/repo.mjs dev:web` | Example web app only |
| `node scripts/repo.mjs dev:full` | Compose for every selected runtime |
| `pnpm exec turbo run typecheck` | TypeScript leaves |
| `pnpm exec turbo run format:check` | Non-mutating format gate |

CDK synth needs a local copy of `infra/cdk/Constants.Deployment.ts` (from `.example`). Use `AWS_PROFILE` or SSO. Do not put access keys in that file.
