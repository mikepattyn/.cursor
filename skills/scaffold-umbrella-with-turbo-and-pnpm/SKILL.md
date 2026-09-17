---
name: scaffold-umbrella-with-turbo-and-pnpm
description: >-
  Scaffolds a catalog-driven umbrella repository with Turborepo, pnpm,
  CONTEXT-MAP.md, research-backed ADRs, Diátaxis docs, project Agent Skills,
  selected frontend/backend/multiplatform templates, OpenAPI + TypeScript
  client packages, Docker Compose, and TypeScript CDK (import-only DNS/TLS).
  Use only when the user explicitly invokes this skill
  (/scaffold-umbrella-with-turbo-and-pnpm or
  @scaffold-umbrella-with-turbo-and-pnpm).
disable-model-invocation: true
---

# Scaffold umbrella with Turbo and pnpm

Explicit-invocation only. Do not apply from ambient chat about monorepos, CDK, or frameworks.

**Do not run this skill against `/Users/mikepattyn/src/mikepattyn` or `/Users/mikepattyn/src/pattynologies`.** Read those checkouts for shape only.

Copy **shape** only from mikepattyn when it exists: `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, gitignored Deployment constants + `.example`, import-only Route53/ACM, S3+CloudFront. Always install this skill’s [assets/skills/](assets/skills/) into `.cursor/skills/`. Always copy templates from [assets/catalog/templates.yaml](assets/catalog/templates.yaml). Do **not** copy .NET CDK, gitlinks, another checkout’s skills, or real `Constants.Deployment` values.

This skill is orchestration. Template metadata lives in the catalog. Template files live under [assets/templates/](assets/templates/). Do not invent stacks that are missing from the catalog.

## Modes

Infer the mode from the invoking message. Do not re-ask if it is already specified.

| Mode | Behavior |
|------|----------|
| `generate` (default) | Create a new empty target and write files |
| `resume` | Continue an interrupted run using `scaffold.manifest.yaml` phases. Do not overwrite user-edited files |
| `validate-only` | Run `node <skill>/scripts/verify-scaffold.mjs <target>` and stop |
| `explain` | Print the catalog selection, identifiers, destinations, and commands. Write nothing |

Refuse a non-empty target unless `resume` is selected and `<target>/scaffold.manifest.yaml` exists and matches the requested topology.

## Progress

```
Progress:
- [ ] 1. Gather inputs (topology first)
- [ ] 2. Show preview + identifiers
- [ ] 3. Context map (/context-map) — stop until reviewed
- [ ] 4. Install project skills
- [ ] 5. Research + ADR 0001 + ADR 0002 + Diátaxis docs
- [ ] 6. Turbo + pnpm umbrella + platform files
- [ ] 7. Copy selected catalog templates
- [ ] 8. Wire example-app / clients / Compose
- [ ] 9. TypeScript CDK + ignored Constants.Deployment.ts
- [ ] 10. Write scaffold.manifest.yaml
- [ ] 11. Verify (`scripts/verify-scaffold.mjs`)
```

On resume, skip phases marked `done` in the manifest.

## 1. Gather inputs

Read [assets/catalog/templates.yaml](assets/catalog/templates.yaml) and [assets/catalog/schema.json](assets/catalog/schema.json). Prompt with AskQuestion when available. If the invoking message already chose a value, do not re-prompt that step.

Normalize aliases before asking: `C#` / `.NET` → `dotnet-bff` or `dotnet-api`; `Node` → `express-bff` / `express-api`; `RN` → `expo-app`. Ask only when a choice changes architecture.

1. **Mode**: generate | resume | validate-only | explain
2. **Topology** (required unless already specified):
   - `web-only`
   - `web-bff-service` (recommended quick-start)
   - `direct-api`
   - `worker-queue`
   - `library`
   - `multiplatform`
3. Then ask **only compatible** catalog roles for that topology, batched in one form. Defaults come from `topologies.<id>.recommended`.
4. For `web-bff-service`, required choices are frontend (`react-app` / `angular-app` / `vue-app` / `svelte-app`), BFF (`express-bff` / `fastapi-bff` / `dotnet-bff`), and service (`python-api` / `rust-api` / `go-api` / `express-api` / `dotnet-api`). Preview/recipe IDs stay opt-in.
5. Optional roles (`worker`, `cli`, `design-tokens`, `storybook`, `expo-app`, `tauri-app`, …) are off unless requested.
6. For Next.js or any `node-server` template, require `deploymentMode`: `static-export` or `node-server`. Current CDK is static-only; do not imply SSR is hosted.
7. For any `mobile` or `desktop` template, show the native-toolchain tradeoffs from the catalog `notes` and wait for confirmation. Never generate signing material or store secrets.

| Input | Default |
|-------|---------|
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
| Java package | `com.<folder without dashes>` | `com.myapp` |
| .NET namespace | PascalCase | `MyApp` |
| Rust crate | kebab-case | `my-app` |
| mobile bundle id | `com.<folder>.example` | `com.my-app.example` |

Create **only** the selected catalog destinations. Do not scaffold unused language lanes.

Express / other JS leaves join the pnpm graph. FastAPI, ASP.NET, Python, Rust, Go, JVM, and recipe stacks stay **outside** the pnpm graph — do not add a `package.json` that pnpm would install.

## 2. Preview

Before creating files, print:

- topology and selected template IDs
- destinations
- ports
- commands (`dev:web`, `dev:full`, native tests)
- deployment modes
- native toolchain warnings

Wait for confirmation unless the user already said to proceed.

## 3. Context map (`/context-map`)

Read and follow `/context-map`. Greenfield: use **Files to Create**. Include `.cursor/skills/`, both ADRs, the four Diátaxis docs, selected templates, `scaffold.manifest.yaml`, Compose, and platform files.

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

Follow the installed `/research-summarizer` and `/documentation-writer`. Research **selected** stacks only.

Write `docs/adr/0001-turbo-pnpm-typescript-cdk-umbrella.md` and, when a persist path exists, `docs/adr/0002-bff-calculator-microservice-sqlite.md` from [reference.md](reference.md). Cite Turbo grouping (`apps/frontend/*/*`, not `apps/**`).

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
  scripts/repo.mjs
  scripts/lint-openapi.mjs
  scripts/verify-scaffold.mjs
  .cursor/skills/
  docs/
  .github/workflows/
  CODEOWNERS
  renovate.json
  gitleaks.toml
  apps/ …                   # selected destinations only
  packages/ …
  docker/
  infra/cdk/
```

Copy [assets/platform/](assets/platform/) to the umbrella root (workflows, Renovate, CODEOWNERS, gitleaks, README, docs, `.devcontainer/` as opt-in, `scripts/repo.mjs`). Copy this skill’s `scripts/lint-openapi.mjs` and `scripts/verify-scaffold.mjs` into `<umbrella>/scripts/`. When a native ecosystem is selected, also copy the matching file from [assets/platform/workspaces/](assets/platform/workspaces/) (`Cargo.toml`, `go.work`, uv `pyproject.toml`, or `Directory.Build.props`) to the umbrella root.

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/frontend/*/*"
  - "apps/backend/*/*"
  - "apps/mobile/*/*"
  - "apps/desktop/*/*"
  - "apps/cli/*/*"
  - "packages/frontend/*/*"
  - "packages/backend/*/*"
  - "packages/shared/*/*"
  - "packages/contracts/*/*"
  - "infra/*"
  - "tests/e2e/*"
```

Do **not** put a `package.json` on grouping folders. Only leaves are workspace packages. Do not use `apps/**` or `packages/**`.

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
  "e2e": "turbo run test --filter @<umbrella>/example-app-e2e",
  "dev": "node scripts/repo.mjs dev:web",
  "dev:web": "node scripts/repo.mjs dev:web",
  "dev:full": "node scripts/repo.mjs dev:full"
}
```

`turbo.json` tasks: `build` (`dependsOn: ["^build"]`, outputs `dist/**`, `cdk.out/**`, `.next/**`, `storybook-static/**`), `test`, `lint`, `typecheck`, `format` (`cache: false`), `format:check`, `dev` (`cache: false`, `persistent: true`).

`.gitignore` must include `node_modules`, `dist`, `.turbo`, `.env`, `.env.*.local`, `infra/cdk/Constants.Deployment.ts`, `**/cdk.out/`, `apps/backend/**/{__pycache__,bin,obj,target}/`, signing/credential globs (`*.p12`, `*.mobileprovision`, `*.jks`, `*.pem`).

`corepack enable` then `pnpm install` at the root. After an app CLI, delete any `package-lock.json` it created and reinstall with pnpm.

Pinned CLIs only. Never run an unqualified `@latest`.

| App | Command |
|-----|---------|
| React | `pnpm --package=create-vite@6.0.11 dlx create-vite example-app --template react-ts` |
| Angular | `pnpm --package=@angular/cli@19.2.0 dlx ng new example-app --routing --style=scss --skip-tests --skip-git --defaults` |
| Vue / Svelte | copy the curated app template; do not call an unpinned CLI |

## 7. Copy selected templates

Use `node <skill>/scripts/copy-template.mjs <source> <dest>` so `bin/`, `obj/`, `target/`, and `__pycache__` are never copied.

For each selected catalog entry:

1. `mkdir -p` the destination parent
2. Copy the `source` tree
3. Replace `@umbrella` / `umbrella` with the npm scope / folder basename
4. Copy OpenAPI + fixtures into `packages/contracts/openapi/calculator-api/` when `openapi-calculator` is selected
5. If a lockfile is listed and the toolchain exists, generate it (`uv lock`, `cargo generate-lockfile`, `go mod tidy`, `dotnet restore`)
6. If Java/Kotlin is selected, run `gradle wrapper --gradle-version 8.12.1` in that destination
7. Mark the template phase `done` in the in-progress manifest

Always create, for `web-bff-service`:

| Role | Catalog id | Path |
|------|------------|------|
| Rules | `typescript-calculator` | `packages/frontend/typescript/example-calculator` |
| Client | `typescript-calculator-client` | `packages/shared/typescript/calculator-client` |
| Contract | `openapi-calculator` | `packages/contracts/openapi/calculator-api` |
| UI | `<framework>-ui` | `packages/frontend/<framework>/example-calculator` |
| App | `<framework>-app` | `apps/frontend/<framework>/example-app` |
| BFF | selected | catalog `destination` |
| Service | selected | catalog `destination` |

UI packages consume `@<umbrella>/calculator-client`. They must not hardcode `localhost:3000`. Persist failures stay non-blocking.

After a CLI app exists, pin UI `peerDependencies` to the app’s framework versions. Overlay the files from `*-app-overlay` (React `App.tsx` + `vite.config.ts`; Angular `app.ts` + `proxy.conf.cjs` + `preserveSymlinks`).

`dev` binds **0.0.0.0:4200**. Proxy `/api` → `BFF_PROXY_TARGET` (host default `http://localhost:3000`; Compose `http://example-bff:3000`).

## 8. Wire + quality baseline

Every generated HTTP service exposes `GET /healthz` and `GET /readyz`. Split app construction from process startup. Add `.env.example` on every deployable leaf.

Root `.env.example` lists `BFF_PROXY_TARGET`, `CALCULATOR_URL`, `SQLITE_PATH`, `AWS_PROFILE`. Never commit `.env`.

If Express BFF was chosen, `pnpm install` so the lockfile includes it.

## 9. TypeScript CDK

Templates: [reference.md](reference.md). Web hosting only unless a later deployment profile is explicitly selected.

| File | Git |
|------|-----|
| `infra/cdk/Constants.Deployment.ts` | **ignored** |
| `infra/cdk/Constants.Deployment.ts.example` | committed |

The example file holds `accountId`, `region`, `domainName`, `hostedZoneId`, `certificateArn`. It must **not** contain `accessKey` or `accessKeyId`. CDK `env` uses `accountId` + `region` only. Operators use AWS SSO/profile or OIDC.

Import-only DNS/TLS. Hosting: private S3 + CloudFront OAC + SPA fallback. Do not `cdk deploy` unless asked.

Add `lint` and `format:check` scripts to `@<umbrella>/cdk`.

## 10. Docker

Copy [assets/docker/](assets/docker/). Replace `__FRAMEWORK__`, `__BFF_*`, `__MS_*` from the selected catalog rows (`dockerContext`, `dockerfile`, `healthcheck`).

Rules:

- `example-app` build context is the repo root. Image install is pnpm via Corepack `9.15.9`.
- Compose `depends_on` uses `condition: service_healthy`.
- Express Docker CMD is `start`, not `dev`.
- Runtime images run as uid `10001`.
- SQLite is a named volume file, not a database container.

Tell the operator:

```bash
node scripts/repo.mjs dev:full
```

## 11. CONTEXT.md + CONTEXT-MAP.md + README

`CONTEXT.md` glossary: **Platform**, **Application**, **Package**, **InfrastructureConstruct**, **ApplicationStack**, **PlatformDomain**.

`CONTEXT-MAP.md` lists selected Applications/Packages, Compose ports, ADRs, docs, skills, and `scaffold.manifest.yaml`.

Root `README.md` comes from [assets/platform/README.md](assets/platform/README.md). Link the tutorial, repository map, OpenAPI contract, and `node scripts/repo.mjs` commands.

## 12. Verify

Run:

```bash
node "<skill-dir>/scripts/verify-scaffold.mjs" "<umbrella>"
```

Sanity-check:

- [ ] Context map reviewed before files were written
- [ ] Preview shown; identifiers sanitized
- [ ] Only selected catalog destinations exist
- [ ] No `package.json` on grouping folders
- [ ] No `bin/` / `obj/` / `target/` copied from assets
- [ ] `Constants.Deployment.ts.example` has no access keys
- [ ] Selected JS packages have `build`, `test`, `lint`, `typecheck`, `format:check`
- [ ] Selected HTTP services expose `/healthz`
- [ ] Compose healthchecks filled; no `__` placeholders remain
- [ ] `scaffold.manifest.yaml` lists selected ids, commands, and native entries
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
