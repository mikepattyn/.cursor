# Umbrella

Private Turborepo + pnpm platform for the Learn classroom stack: Angular 22 in front, one .NET 10 API behind it. JavaScript leaves are workspace packages. The API stays on NuGet and is dispatched from `scaffold.manifest.yaml`.

Next lessons: [learn.mikepattyn.nl](https://learn.mikepattyn.nl) — sit `Mikepattyn.Email` next to `Mikepattyn.Contact.Api`.

## First run

```bash
corepack enable
pnpm install
node scripts/repo.mjs check
node scripts/repo.mjs dev:web
```

Persist path (Angular + API + SQLite volume):

```bash
node scripts/repo.mjs dev:full
```

Open http://localhost:4200/. Arithmetic works without the API. Reload persistence needs Compose or a local `dotnet run`.

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
| [docs/reference/deployment-profiles.md](docs/reference/deployment-profiles.md) | local / container / static |

## Commands

| Command | What it runs |
|---------|----------------|
| `node scripts/repo.mjs check` | JS Turbo check plus `dotnet test` |
| `node scripts/repo.mjs test` | Workspace tests |
| `node scripts/repo.mjs dev:web` | Angular app only |
| `node scripts/repo.mjs dev:full` | Compose for Angular + API |
| `pnpm exec turbo run typecheck` | TypeScript leaves |
| `pnpm exec turbo run format:check` | Non-mutating format gate |

CDK synth needs a local copy of `infra/cdk/Constants.Deployment.ts` (from `.example`). Use `AWS_PROFILE` or SSO. Do not put access keys in that file.
