# Reference templates

Copy these into the new umbrella. Replace placeholders. Never paste real account ids, keys, zone ids, or cert ARNs from another checkout.

**Authoritative template trees live in [assets/templates/](assets/templates/).** This file keeps the persist contract, CDK, ADR outlines, and Diátaxis briefs. Do not hand-author Angular or .NET source when a catalog asset exists.

The stack is fixed: Angular 22 + .NET 10. Replace `@umbrella/…` with `@<umbrella-name>/…`.

Copy trees with `scripts/copy-template.mjs` so `bin/` and `obj/` are never copied.

## Calculator persist contract

The UI instantiates `Calculator` locally. After each successful result it persists one value to the .NET API. On load it reads that value back. Persist failures are non-blocking.

- API (port **3000**):
  - `GET /api/calculator/value` → `{ "value": number | null, "updatedAt": string | null }`
  - `PUT /api/calculator/value` body `{ "value": number }` → `{ "value": number, "updatedAt": string }`
- SQLite file at `SQLITE_PATH` (Compose: `/data/calculator.db`). Not a SQLite server container.

```sql
CREATE TABLE IF NOT EXISTS calculator_value (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value REAL NOT NULL,
  updated_at TEXT NOT NULL
);
```

One row; each PUT upserts `id = 1`.

`example-app` proxies same-origin `/api` to `API_PROXY_TARGET` (host default `http://localhost:3000`; Compose `http://example-api:3000`). The widget must not hardcode `localhost:3000`.

## Angular overlay

After `ng new`, overlay [assets/templates/frontend/angular-app-overlay/](assets/templates/frontend/angular-app-overlay/). In `angular.json`, set `preserveSymlinks: true` on `architect.build.options` and `architect.serve.options`. Point `architect.serve.options.proxyConfig` at `proxy.conf.cjs` (or pass `--proxy-config proxy.conf.cjs` on the `dev` script).

`dev` binds `0.0.0.0:4200`.

## `infra/cdk/Constants.Deployment.ts.example`

```ts
export const Deployment = {
  accountId: "123456789012",
  region: "eu-west-1",
  domainName: "example.com",
  hostedZoneId: "Z1234567890EXAMPLE",
  certificateArn:
    "arn:aws:acm:us-east-1:123456789012:certificate/00000000-0000-0000-0000-000000000000",
} as const;
```

Do **not** put `accessKey` or `accessKeyId` in this file. Operators use the AWS default credential chain, `AWS_PROFILE` / SSO locally, or GitHub OIDC in CI.

`.gitignore` entry:

```
infra/cdk/Constants.Deployment.ts
**/cdk.out/
```

Local setup: copy this file to `Constants.Deployment.ts` and replace placeholders. `accessKeyId` / `accessKey` must not be read by stacks or constructs.

## `infra/cdk/package.json` (workspace package)

```json
{
  "name": "@umbrella/cdk",
  "private": true,
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "lint": "prettier --check .",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "synth": "cdk synth"
  }
}
```

Depend on `aws-cdk-lib`, `constructs`, `aws-cdk`. Dev-depend on `typescript`, `ts-node`. `cdk.json` app: `npx ts-node bin/app.ts`.

## `infra/cdk/bin/app.ts`

```ts
import * as cdk from "aws-cdk-lib";
import { Deployment } from "../Constants.Deployment";
import { WebApplicationStack } from "../lib/web-application-stack";

const app = new cdk.App();

new WebApplicationStack(app, "WebApplicationStack", {
  env: { account: Deployment.accountId, region: Deployment.region },
});
```

## `infra/cdk/lib/web-application-stack.ts`

```ts
import { Stack, type StackProps } from "aws-cdk-lib";
import { type Construct } from "constructs";
import { Deployment } from "../Constants.Deployment";
import { WebApplication } from "./web-application";

export class WebApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new WebApplication(this, "WebApplication", {
      domainName: Deployment.domainName,
      hostedZoneId: Deployment.hostedZoneId,
      certificateArn: Deployment.certificateArn,
    });
  }
}
```

## `infra/cdk/lib/web-application.ts`

The web app construct **imports** the hosted zone id and the certificate ARN for the example website. It does not create a hosted zone or a certificate.

```ts
import { RemovalPolicy } from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface WebApplicationProps {
  domainName: string;
  hostedZoneId: string;
  certificateArn: string;
}

export class WebApplication extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: WebApplicationProps) {
    super(scope, id);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.domainName,
    });

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      props.certificateArn,
    );

    this.bucket = new s3.Bucket(this, "Bucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      domainNames: [props.domainName, `www.${props.domainName}`],
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    new route53.ARecord(this, "AliasA", {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution),
      ),
    });

    new route53.ARecord(this, "AliasWww", {
      zone: hostedZone,
      recordName: `www.${props.domainName}`,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution),
      ),
    });
  }
}
```

## ADR (`docs/adr/0001-turbo-pnpm-typescript-cdk-umbrella.md`)

Fill from the `/research-summarizer` brief. Number `0001` on a new umbrella. Cite official URLs; do not invent metadata.

```md
# 0001. Turbo, pnpm, and TypeScript CDK for this umbrella

- Status: Accepted
- Date: YYYY-MM-DD
- Source type: documentation

## Key Thesis
[1-2 sentences from the research brief]

## Context
New umbrella needs one JS build graph, a grouped apps/packages layout, an Angular calculator plus a .NET persist API, and import-only DNS/TLS. Persist is ADR 0002.

## Decision
1. pnpm workspace grouping globs (`apps/frontend/*/*`, `packages/frontend/*/*`, `packages/shared/*/*`, `packages/contracts/*/*`, `infra/cdk`). Grouping folders have no `package.json`. Do not use `apps/**` / `packages/**`. Root `packageManager` is pnpm; Turbo owns `build` / `test` / `lint` / `format` / `dev`. The .NET API stays outside that graph.
2. Example Application is `apps/frontend/angular/example-app` (Angular CLI 22). `dev` binds `0.0.0.0:4200`. It hosts the calculator UI Package and proxies `/api` to the .NET API.
3. Rules Package is `packages/frontend/typescript/example-calculator` (`@<umbrella>/example-calculator`, pure TypeScript `Calculator` + Node tests).
4. UI Package is `packages/frontend/angular/example-calculator` (`@<umbrella>/example-calculator-ui`). It depends on the rules Package and is the only place that instantiates `Calculator` for the UI.
5. `docker/Dockerfile` + `docker/docker-compose.yml` serve `example-app` via pnpm (`http://localhost:4200/`) and the .NET API (`http://localhost:3000/`) with a SQLite file volume. Details: ADR 0002.
6. TypeScript CDK in `infra/cdk`. `WebApplication` imports hosted zone id and certificate ARN; it does not create zones or certificates. CDK does not deploy the .NET API.
7. `Constants.Deployment.ts` is gitignored (copy from `.example`). It holds `accountId`, `region`, imported hosted zone id, and certificate ARN. It does not hold access keys. Constructs receive account + region only.

## Key Findings
1. [Finding + official source — include Turbo grouping vs `apps/**`]
2. [Finding + official source]

## Methodology
Official docs summarized with `/research-summarizer`. Comparison: Turbo vs npm-only; import-only DNS/TLS vs creating zones/certs.

## Limitations
- [What the sources do not cover]

## Consequences
- Single `pnpm` / `turbo` entry at repo root
- `docker compose -f docker/docker-compose.yml up --build` serves `example-app` at `http://localhost:4200/` plus the API (`:3000`)
- Operator copies `Constants.Deployment.ts` locally before `cdk synth`
- ACM cert for CloudFront must be in `us-east-1`
- Starter Diátaxis docs sit alongside this ADR (`docs/tutorial/`, `docs/how-to/`, `docs/reference/`, `docs/explanation/`)
- Persist path: `docs/adr/0002-angular-dotnet-calculator-sqlite.md`

## Actionable Takeaways
- [What a future reader should do]
```

## ADR (`docs/adr/0002-angular-dotnet-calculator-sqlite.md`)

Fill from the `/research-summarizer` brief for Angular 22, ASP.NET Core 10, and file-backed SQLite. Cite official URLs; do not invent metadata. Do not research unused stacks.

```md
# 0002. Angular, .NET API, and SQLite persist

- Status: Accepted
- Date: YYYY-MM-DD
- Source type: documentation

## Key Thesis
[1-2 sentences: Angular computes locally, ASP.NET Core owns the single calculator row, SQLite is a file on a Compose volume]

## Context
The example UI already computes with the TypeScript `Calculator` class. The umbrella needs a persist path the operator can run with Docker Compose. This is the Learn classroom stack: Angular + one .NET backend.

## Decision
1. UI computes locally. After each successful result it `PUT`s `{ value }` to `/api/calculator/value`. On load it `GET`s the last value. Persist failures are non-blocking.
2. API is `apps/backend/dotnet/example-api` (ASP.NET Core 10). It implements `GET|PUT /api/calculator/value` and upserts one SQLite row (`id = 1`). Port 3000. `SQLITE_PATH` (Compose: `/data/calculator.db`).
3. Compose runs `example-app` and `example-api`. Volume `calculator-sqlite` mounts at `/data` on the API. There is no SQLite server container and no BFF.
4. The API stays outside the pnpm/Turbo graph.
5. CDK stays web-only. It does not deploy the API.
6. Later Learn lessons gitlink `Mikepattyn.Email` and `Mikepattyn.Contact.Api` under `packages/`. Do not vendor them at scaffold time.

## Key Findings
1. [Finding + official source — Angular 22]
2. [Finding + official source — ASP.NET Core 10 + SQLite]
3. [Finding + official source — file-backed SQLite / Compose named volume]

## Methodology
Official docs summarized with `/research-summarizer` for Angular and ASP.NET Core.

## Limitations
- [What the sources do not cover]

## Consequences
- `http://localhost:4200/` still hosts the calculator UI
- Persist requires Compose (or a locally running API on `:3000`)
- Reload shows the last stored value when the persist path is up

## Actionable Takeaways
- [What a future reader should do]
```

## Project skills (always)

Copy `assets/skills/` into `<umbrella>/.cursor/skills/` (full trees). Do not rewrite the skill files.

| Source | Destination |
|--------|-------------|
| `assets/skills/README.md` | `.cursor/skills/README.md` |
| `assets/skills/documentation-writer/` | `.cursor/skills/documentation-writer/` |
| `assets/skills/research/` | `.cursor/skills/research/` |
| `assets/skills/research-summarizer/` | `.cursor/skills/research-summarizer/` |

## Diátaxis starter (alongside ADR 0001 and ADR 0002)

Write after the ADRs. Follow `/documentation-writer`. These outlines are **pre-approved** for the scaffold — do not pause for user sign-off. Use CONTEXT.md terms. Point explanation at the ADRs; do not invent citations.

### `docs/tutorial/get-started.md`

1. What you will have done by the end (`example-app` calculator UI at `http://localhost:4200/`, example-calculator tests green)
2. Prerequisites: Node `>=22`, Corepack, pnpm `9.15.9`, .NET 10 SDK. Persist also needs Docker (or a local `dotnet run`).
3. Install at the repo root (`corepack enable`, `pnpm install`)
4. Build and test the rules Package (`pnpm exec turbo run build test --filter @<umbrella>/example-calculator`)
5. Start the `example-app` Application (`pnpm --filter @<umbrella>/example-app dev`) and use the calculator (arithmetic works without the API)
6. Optional: persist the last result via Docker (link the how-to). Compose also publishes the API at `http://localhost:3000/`
7. What to read next: how-to, reference, ADR 0001, ADR 0002, then [learn.mikepattyn.nl](https://learn.mikepattyn.nl)

### `docs/how-to/serve-example-app.md`

1. Serve on the host (`pnpm --filter @<umbrella>/example-app dev`; binds `0.0.0.0:4200`; `/api` proxies to `API_PROXY_TARGET` or `http://localhost:3000`)
2. Serve the full persist path with Docker (`docker compose -f docker/docker-compose.yml up --build`)
3. Success check: `http://localhost:4200/` shows the calculator. After an operation, reload still shows the last value when Compose is up.
4. Notes: bind-mount + named `node_modules` volumes on `example-app`; `CHOKIDAR_USEPOLLING`; API `:3000`; volume `calculator-sqlite`. Host persist without Compose: `dotnet run` in `apps/backend/dotnet/example-api` with `SQLITE_PATH` to a local file. No AWS deploy here.

### `docs/reference/repository-layout.md`

Information-oriented only. Include:

- Directory tree (`apps/frontend/angular/example-app`, `apps/backend/dotnet/example-api`, packages, `infra/cdk`, `docker`, `docs`, `.cursor/skills`)
- Workspace globs (`apps/frontend/*/*`, `packages/frontend/*/*`, `packages/shared/*/*`, `packages/contracts/*/*`, `infra/cdk`)
- Rule: grouping folders have no `package.json`. The .NET API has no pnpm `package.json`.
- Root Turbo tasks (`build`, `test`, `lint`, `format`, `dev`)
- Package names (`@<umbrella>/example-app`, `@<umbrella>/example-calculator`, `@<umbrella>/example-calculator-ui`, `@<umbrella>/cdk`)
- Docker paths; Compose services `example-app`, `example-api`; volume `calculator-sqlite`
- Persist contract: UI `/api/calculator/value` → .NET API → SQLite file
- `Constants.Deployment.ts` vs `.example` (gitignored vs committed)
- Reserved empty folders for later Learn gitlinks: `packages/Mikepattyn.Email`, `packages/Mikepattyn.Contact.Api`

### `docs/explanation/umbrella-decisions.md`

Understanding-oriented companion to ADR 0001 and ADR 0002. Discuss why one JS graph (pnpm + Turbo), why apps/packages are grouped by frontend/backend then framework/language, why the example is three layers (rules Package → UI Package → Application), why the UI computes locally while one .NET API persists one SQLite row, why Docker Compose runs two services plus a file volume (not a SQLite server), and why CDK **imports** the PlatformDomain instead of creating it. Link `docs/adr/0001-turbo-pnpm-typescript-cdk-umbrella.md` for the graph/CDK status and tables, and `docs/adr/0002-angular-dotnet-calculator-sqlite.md` for persist. Do not paste those tables here.

## CONTEXT.md starter terms

**Platform**: Umbrella that owns the pnpm/Turbo graph and TypeScript CDK.
_Avoid_: treating `apps/frontend/angular/example-app` as the whole repo

**Application**: Deployable product under `apps/{frontend|backend}/{framework|language}/`. Examples are `example-app` and `example-api`.
_Avoid_: service (too generic)

**Package**: Shared library under `packages/{frontend|backend|shared}/{framework|language}/`. First examples are `example-calculator` (rules) and `example-calculator-ui` (Angular UI).
_Avoid_: treating packages as deployable Applications

**InfrastructureConstruct**: Reusable CDK construct (here: `WebApplication`).
_Avoid_: module, component

**ApplicationStack**: Per-app CDK stack (`WebApplicationStack`).
_Avoid_: mixing two apps in one stack class

**PlatformDomain**: Imported Route53 hosted zone and ACM certificate for the example website.
_Avoid_: creating hosted zones or certificates in CDK
