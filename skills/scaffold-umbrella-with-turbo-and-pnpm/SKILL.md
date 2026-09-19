---
name: scaffold-umbrella-with-turbo-and-pnpm
description: >-
  Scaffolds the Learn classroom stack: an Angular 22 app, a .NET 10 API,
  Turborepo + pnpm, CONTEXT-MAP.md, research-backed ADRs, Diátaxis docs,
  project Agent Skills, Docker Compose, and TypeScript CDK (import-only
  DNS/TLS). Use only when the user explicitly invokes this skill
  (/scaffold-umbrella-with-turbo-and-pnpm or
  @scaffold-umbrella-with-turbo-and-pnpm), or when starting the First
  contact email path on learn.mikepattyn.nl.
disable-model-invocation: true
---

# Scaffold umbrella (Angular + .NET)

Explicit-invocation only. Do not apply from ambient chat about monorepos, CDK, or frameworks.

This is the stack taught on [learn.mikepattyn.nl](https://learn.mikepattyn.nl): Angular in front, one ASP.NET Core API behind it. Later lessons add `Mikepattyn.Email` and `Mikepattyn.Contact.Api` as gitlinked packages. Do not invent a second backend, a BFF, or another frontend.

**Do not run this skill against `/Users/mikepattyn/src/mikepattyn` or `/Users/mikepattyn/src/pattynologies`.** Read those checkouts for shape only.

Copy **shape** only from mikepattyn when it exists: `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, gitignored Deployment constants + `.example`, import-only Route53/ACM, S3+CloudFront. Always install this skill’s [assets/skills/](assets/skills/) into `.cursor/skills/`. Always copy templates from [assets/catalog/templates.yaml](assets/catalog/templates.yaml). Do **not** copy .NET CDK, gitlinks, another checkout’s skills, or real `Constants.Deployment` values.

This skill is orchestration. Template files live under [assets/templates/](assets/templates/). The catalog is fixed: Angular + .NET. Do not add React, Vue, Express, FastAPI, Rust, Go, Python, or mobile lanes.

## Modes

Infer the mode from the invoking message. Do not re-ask if it is already specified.

| Mode | Behavior |
|------|----------|
| `generate` (default) | Create a new empty target and write files |
| `resume` | Continue an interrupted run using `scaffold.manifest.yaml` phases. Do not overwrite user-edited files |
| `validate-only` | Run `node <skill>/scripts/verify-scaffold.mjs <target>` and stop |
| `explain` | Print destinations and commands. Write nothing |

Refuse a non-empty target unless `resume` is selected and `<target>/scaffold.manifest.yaml` exists and matches Angular + .NET.

If the user asks for another frontend or backend language, refuse and say this skill only scaffolds Angular + .NET for the Learn path.

## Progress

```
Progress:
- [ ] 1. Gather inputs
- [ ] 2. Show preview + identifiers
- [ ] 3. Context map (/context-map) — stop until reviewed
- [ ] 4. Install project skills
- [ ] 5. Research + ADR 0001 + ADR 0002 + Diátaxis docs
- [ ] 6. Turbo + pnpm umbrella + platform files
- [ ] 7. Copy Angular + .NET templates
- [ ] 8. Wire example-app / API / Compose
- [ ] 9. TypeScript CDK + ignored Constants.Deployment.ts
- [ ] 10. Write scaffold.manifest.yaml
- [ ] 11. Verify (`scripts/verify-scaffold.mjs`)
```

On resume, skip phases marked `done` in the manifest.

## 1. Gather inputs

Read [assets/catalog/templates.yaml](assets/catalog/templates.yaml). Do **not** ask for topology, frontend, or backend. Those are fixed:

| Role | Id | Path |
|------|----|------|
| App | `angular-app` | `apps/frontend/angular/example-app` |
| UI | `angular-ui` | `packages/frontend/angular/example-calculator` |
| Rules | `typescript-calculator` | `packages/frontend/typescript/example-calculator` |
| Client | `typescript-calculator-client` | `packages/shared/typescript/calculator-client` |
| Contract | `openapi-calculator` | `packages/contracts/openapi/calculator-api` |
| API | `dotnet-api` | `apps/backend/dotnet/example-api` |

Ask only for what is still missing. If the invoking message already chose a value, do not re-prompt that step.

| Input | Default |
|-------|---------|
| Mode | `generate` |
| Target directory | New empty folder **outside** mikepattyn / pattynologies |
| Umbrella name | folder basename |
| Example website domain | `example.com` |
| AWS region | `eu-west-1` |
| Publishable packages | `false` (private, independent versions) |

Do not ask for live AWS secrets. Deployment constants use account + region + imported zone/cert only. Operators authenticate with the AWS default credential chain, an SSO profile locally, or GitHub OIDC in CI.

### Identifiers

Sanitize the umbrella name once and display the derived identifiers before writing files:

| Kind | Rule | Example (`My App`) |
|------|------|--------------------|
| folder | kebab-case, `[a-z0-9-]` | `my-app` |
| npm scope | `@<folder>` | `@my-app` |
| docker project | same as folder | `my-app` |
| .NET namespace | PascalCase | `MyApp` |

Create **only** the destinations above. The .NET API stays **outside** the pnpm graph — do not add a `package.json` that pnpm would install.

## 2. Preview

Before creating files, print:

- stack: Angular 22 + .NET 10 API
- destinations
- ports (`4200` app, `3000` API)
- commands (`dev:web`, `dev:full`)

Wait for confirmation unless the user already said to proceed.

## 3. Context map (`/context-map`)

Read and follow `/context-map`. Greenfield: use **Files to Create**. Include `.cursor/skills/`, both ADRs, the four Diátaxis docs, the six templates, `scaffold.manifest.yaml`, Compose, and platform files.

**Do not proceed with implementation until this map is reviewed.**

## 4. Install project skills

Copy this skill’s [assets/skills/](assets/skills/) shelf into the new umbrella. Copy **full trees**. Do **not** copy this scaffold skill itself.

Required after copy:

- `.cursor/skills/documentation-writer/SKILL.md`
- `.cursor/skills/research/SKILL.md`
- `.cursor/skills/research/agents/openai.yaml`
- `.cursor/skills/research-summarizer/SKILL.md`
- `.cursor/skills/research-summarizer/scripts/`
- `.cursor/skills/research-summarizer/references/`

## 5. ADR + Diátaxis docs

Follow the installed `/research-summarizer` and `/documentation-writer`. Research **Angular 22** and **ASP.NET Core 10** only.

Write `docs/adr/0001-turbo-pnpm-typescript-cdk-umbrella.md` and `docs/adr/0002-angular-dotnet-calculator-sqlite.md` from [reference.md](reference.md). Cite Turbo grouping (`apps/frontend/*/*`, not `apps/**`).

Write the four Diátaxis files using the briefs in [reference.md](reference.md). Do not pause for outline approval. Mention `node scripts/repo.mjs check` and `node scripts/repo.mjs dev:full`.

## 6. Turbo + pnpm umbrella + platform files

```
<umbrella>/
  package.json              # private; packageManager pnpm@9.15.9; turbo scripts
  pnpm-workspace.yaml
  turbo.json
  .gitignore
  .env.example
  README.md
  CONTEXT.md
  CONTEXT-MAP.md
  scaffold.manifest.yaml
  Directory.Build.props
  scripts/repo.mjs
  scripts/lint-openapi.mjs
  scripts/verify-scaffold.mjs
  .cursor/skills/
  docs/
  .github/workflows/
  CODEOWNERS
  renovate.json
  gitleaks.toml
  apps/frontend/angular/example-app
  apps/backend/dotnet/example-api
  packages/
  docker/
  infra/cdk/
```

Copy [assets/platform/](assets/platform/) to the umbrella root (workflows, Renovate, CODEOWNERS, gitleaks, README, docs, `.devcontainer/` as opt-in, `scripts/repo.mjs`). Copy this skill’s `scripts/lint-openapi.mjs` and `scripts/verify-scaffold.mjs` into `<umbrella>/scripts/`. Copy [assets/platform/workspaces/Directory.Build.props](assets/platform/workspaces/Directory.Build.props) to the umbrella root.

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/frontend/*/*"
  - "packages/frontend/*/*"
  - "packages/shared/*/*"
  - "packages/contracts/*/*"
  - "infra/*"
```

Do **not** put a `package.json` on grouping folders. Only leaves are workspace packages. Do not use `apps/**` or `packages/**`. Do not add `apps/backend/**` — the API is NuGet, not pnpm.

Root `package.json`: `"packageManager": "pnpm@9.15.9"`, `engines.node: ">=22"`, pin `turbo` to `2.5.8` (no `^`). Scripts:

```json
{
  "build": "turbo run build",
  "test": "turbo run test",
  "lint": "turbo run lint",
  "typecheck": "turbo run typecheck",
  "format": "turbo run format",
  "format:check": "turbo run format:check",
  "check": "node scripts/repo.mjs check",
  "contract:test": "turbo run test --filter @<umbrella>/calculator-api",
  "dev": "node scripts/repo.mjs dev:web",
  "dev:web": "node scripts/repo.mjs dev:web",
  "dev:full": "node scripts/repo.mjs dev:full"
}
```

`turbo.json` tasks: `build` (`dependsOn: ["^build"]`, outputs `dist/**`, `cdk.out/**`), `test`, `lint`, `typecheck`, `format` (`cache: false`), `format:check`, `dev` (`cache: false`, `persistent: true`).

`.gitignore` must include `node_modules`, `dist`, `.turbo`, `.angular`, `.env`, `.env.*.local`, `infra/cdk/Constants.Deployment.ts`, `**/cdk.out/`, `apps/backend/**/{bin,obj}/`.

`corepack enable` then `pnpm install` at the root. After `ng new`, delete any `package-lock.json` it created and reinstall with pnpm.

Pinned CLI only. Never run an unqualified `@latest`.

```bash
pnpm --package=@angular/cli@22.1.8 dlx ng new example-app --routing --style=scss --skip-tests --skip-git --defaults
```

Run that inside `apps/frontend/angular/` so the app lands at `apps/frontend/angular/example-app`.

## 7. Copy selected templates

Use `node <skill>/scripts/copy-template.mjs <source> <dest>` so `bin/` and `obj/` are never copied.

For each catalog entry:

1. `mkdir -p` the destination parent
2. Copy the `source` tree
3. Replace `@umbrella` / `umbrella` with the npm scope / folder basename
4. Copy OpenAPI + fixtures into `packages/contracts/openapi/calculator-api/` when `openapi-calculator` is selected
5. Run `dotnet restore` in `apps/backend/dotnet/example-api` if the toolchain exists
6. Mark the template phase `done` in the in-progress manifest

Always create all six destinations in the table above.

UI packages consume `@<umbrella>/calculator-client`. They must not hardcode `localhost:3000`. Persist failures stay non-blocking.

After `ng new`, pin UI `peerDependencies` to the app’s Angular versions. Overlay [assets/templates/frontend/angular-app-overlay/](assets/templates/frontend/angular-app-overlay/) (`app.ts` + `proxy.conf.cjs`). In `angular.json`, set `preserveSymlinks: true` on `architect.build.options` and `architect.serve.options`. Point serve at `proxy.conf.cjs`.

`dev` binds **0.0.0.0:4200**. Proxy `/api` → `API_PROXY_TARGET` (host default `http://localhost:3000`; Compose `http://example-api:3000`).

## 8. Wire + quality baseline

The .NET API exposes `GET /healthz`, `GET /readyz`, and `GET|PUT /api/calculator/value`. Split app construction from process startup. Add `.env.example` on every deployable leaf.

Root `.env.example` lists `API_PROXY_TARGET`, `SQLITE_PATH`, `AWS_PROFILE`. Never commit `.env`.

Leave `packages/Mikepattyn.Email` and `packages/Mikepattyn.Contact.Api` **empty** — later Learn lessons gitlink those remotes. Do not vendor them now.

## 9. TypeScript CDK

Templates: [reference.md](reference.md). Web hosting only unless a later deployment profile is explicitly selected.

| File | Git |
|------|-----|
| `infra/cdk/Constants.Deployment.ts` | **ignored** |
| `infra/cdk/Constants.Deployment.ts.example` | committed |

The example file holds `accountId`, `region`, `domainName`, `hostedZoneId`, `certificateArn`. It must **not** contain `accessKey` or `accessKeyId`. CDK `env` uses `accountId` + `region` only. Operators use AWS SSO/profile or OIDC.

Import-only DNS/TLS. Hosting: private S3 + CloudFront OAC + SPA fallback. Do not `cdk deploy` unless asked. CDK does not deploy the .NET API.

Add `lint` and `format:check` scripts to `@<umbrella>/cdk`.

## 10. Docker

Copy [assets/docker/](assets/docker/). Replace `umbrella` / `@umbrella/example-app` with the folder basename and scoped app name. There are no `__FRAMEWORK__` or `__BFF_*` placeholders.

Rules:

- `example-app` build context is the repo root. Image install is pnpm via Corepack `9.15.9`.
- Compose `depends_on` uses `condition: service_healthy`.
- Runtime images run as uid `10001`.
- SQLite is a named volume file, not a database container.

Tell the operator:

```bash
node scripts/repo.mjs dev:full
```

## 11. CONTEXT.md + CONTEXT-MAP.md + README

`CONTEXT.md` glossary: **Platform**, **Application**, **Package**, **InfrastructureConstruct**, **ApplicationStack**, **PlatformDomain**.

`CONTEXT-MAP.md` lists Applications/Packages, Compose ports, ADRs, docs, skills, and `scaffold.manifest.yaml`.

Root `README.md` comes from [assets/platform/README.md](assets/platform/README.md). Link the tutorial, repository map, OpenAPI contract, and `node scripts/repo.mjs` commands. Point at [learn.mikepattyn.nl](https://learn.mikepattyn.nl) for the next lessons.

## 12. Verify

Run:

```bash
node "<skill-dir>/scripts/verify-scaffold.mjs" "<umbrella>"
```

Sanity-check:

- [ ] Context map reviewed before files were written
- [ ] Preview shown; identifiers sanitized
- [ ] Only Angular + .NET destinations exist
- [ ] No `package.json` on grouping folders or on the .NET API
- [ ] No `bin/` / `obj/` copied from assets
- [ ] `Constants.Deployment.ts.example` has no access keys
- [ ] JS packages have `build`, `test`, `lint`, `typecheck`, `format:check`
- [ ] API exposes `/healthz` and `/api/calculator/value`
- [ ] Compose healthchecks filled; no `__` placeholders remain
- [ ] `scaffold.manifest.yaml` lists the six ids and `dotnet test`
- [ ] `pnpm exec turbo run build test lint typecheck` includes the JS leaves
- [ ] `node scripts/verify-scaffold.mjs <umbrella>` exits 0

Commit only when asked. Never push unless asked.

## Additional resources

- Catalog: [assets/catalog/templates.yaml](assets/catalog/templates.yaml)
- Schema: [assets/catalog/schema.json](assets/catalog/schema.json)
- Templates: [assets/templates/](assets/templates/)
- Contracts: [assets/contracts/calculator/](assets/contracts/calculator/)
- Platform files: [assets/platform/](assets/platform/)
- Copy helper: [scripts/copy-template.mjs](scripts/copy-template.mjs)
- Verify: [scripts/verify-scaffold.mjs](scripts/verify-scaffold.mjs)
- CDK / ADR / Diátaxis outlines: [reference.md](reference.md)
