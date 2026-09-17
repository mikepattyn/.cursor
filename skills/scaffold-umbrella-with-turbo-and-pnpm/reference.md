# Reference templates

Copy these into the new umbrella. Replace placeholders. Never paste real account ids, keys, zone ids, or cert ARNs from another checkout.

**Authoritative template trees live in [assets/templates/](assets/templates/) and are selected by [assets/catalog/templates.yaml](assets/catalog/templates.yaml).** This file keeps the persist contract, CDK, ADR outlines, and Diátaxis briefs. Do not hand-author backend or frontend source from the old inline listings when a catalog asset exists.

`<framework>` is a catalog web-app id (`react-app`, `angular-app`, `vue-app`, `svelte-app`, preview `next-app`). BFF and service ids come from the catalog. Replace `@umbrella/…` with `@<umbrella-name>/…`.

Copy selected trees with `scripts/copy-template.mjs` so `bin/`, `obj/`, and `target/` are never copied. Do not invent stacks missing from the catalog.

## Calculator persist contract

The UI still instantiates `Calculator` locally. After each successful result it persists one value through the BFF to the microservice. On load it reads that value back. Persist failures are non-blocking.

- Microservice (port **8081**):
  - `GET /value` → `{ "value": number | null, "updatedAt": string | null }`
  - `PUT /value` body `{ "value": number }` → `{ "value": number, "updatedAt": string }`
- BFF (port **3000**) is a thin proxy:
  - `GET|PUT /api/calculator/value` → `{CALCULATOR_URL}/value`
  - `CALCULATOR_URL` default `http://localhost:8081`; Compose sets `http://example-calculator:8081`
- SQLite file at `SQLITE_PATH` (Compose: `/data/calculator.db`). Not a SQLite server container.

```sql
CREATE TABLE IF NOT EXISTS calculator_value (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value REAL NOT NULL,
  updated_at TEXT NOT NULL
);
```

One row; each PUT upserts `id = 1`.

`example-app` proxies same-origin `/api` to `BFF_PROXY_TARGET` (host default `http://localhost:3000`; Compose `http://example-bff:3000`). The widget must not hardcode `localhost:3000`.

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

## `packages/frontend/typescript/example-calculator` (always)

Required on every scaffold. Replace `@umbrella/example-calculator` with `@<umbrella-name>/example-calculator`.

### `packages/frontend/typescript/example-calculator/package.json`

```json
{
  "name": "@umbrella/example-calculator",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "test": "node --experimental-strip-types --test src/calculator.test.ts",
    "lint": "prettier --check .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@types/node": "^22.18.0",
    "prettier": "^3.8.1",
    "typescript": "~6.0.2"
  }
}
```

### `packages/frontend/typescript/example-calculator/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

### `packages/frontend/typescript/example-calculator/tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["src/**/*.test.ts"]
}
```

### `packages/frontend/typescript/example-calculator/.prettierrc`

```json
{
  "printWidth": 100,
  "singleQuote": true
}
```

### `packages/frontend/typescript/example-calculator/.prettierignore`

```
dist
```

### `packages/frontend/typescript/example-calculator/src/calculator.ts`

```ts
export class Calculator {
  add(left: number, right: number): number {
    return left + right;
  }

  subtract(left: number, right: number): number {
    return left - right;
  }

  multiply(left: number, right: number): number {
    return left * right;
  }

  divide(left: number, right: number): number {
    if (right === 0) {
      throw new RangeError('Cannot divide by zero');
    }

    return left / right;
  }
}
```

### `packages/frontend/typescript/example-calculator/src/index.ts`

```ts
export { Calculator } from './calculator.ts';
```

### `packages/frontend/typescript/example-calculator/src/calculator.test.ts`

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Calculator } from './calculator.ts';

describe('Calculator', () => {
  const calculator = new Calculator();

  it('adds two numbers', () => {
    assert.equal(calculator.add(2, 3), 5);
  });

  it('subtracts two numbers', () => {
    assert.equal(calculator.subtract(5, 3), 2);
  });

  it('multiplies two numbers', () => {
    assert.equal(calculator.multiply(4, 3), 12);
  });

  it('divides two numbers', () => {
    assert.equal(calculator.divide(10, 2), 5);
  });

  it('throws when dividing by zero', () => {
    assert.throws(() => calculator.divide(10, 0), {
      name: 'RangeError',
      message: 'Cannot divide by zero',
    });
  });
});
```

## UI Package (always — one framework)

Hand-author. Do not run `ng generate library`. Do not add Jest or Vitest. Source-export the widget; the app compiles it.

Read the example-app’s Angular or React versions after the CLI and pin `peerDependencies` / matching `devDependencies` to those versions. Templates below use placeholders.

The UI Package **must** instantiate `Calculator` from `@<umbrella>/example-calculator`. Do not reimplement arithmetic. On init, `GET /api/calculator/value` and show `value` when it is not null. After a successful local compute, `PUT /api/calculator/value` with `{ value }`. Persist failures must not clear the local result.

### Angular — `packages/frontend/angular/example-calculator`

#### `package.json`

```json
{
  "name": "@umbrella/example-calculator-ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json --noEmit",
    "lint": "prettier --check .",
    "format": "prettier --write ."
  },
  "peerDependencies": {
    "@angular/core": "MATCH_EXAMPLE_APP",
    "@angular/forms": "MATCH_EXAMPLE_APP"
  },
  "dependencies": {
    "@umbrella/example-calculator": "workspace:*"
  },
  "devDependencies": {
    "@angular/core": "MATCH_EXAMPLE_APP",
    "@angular/forms": "MATCH_EXAMPLE_APP",
    "prettier": "^3.8.1",
    "typescript": "MATCH_EXAMPLE_APP"
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

#### `.prettierrc` / `.prettierignore`

Same as the rules Package (printWidth 100, singleQuote; ignore nothing extra).

#### `src/stored-value.ts`

```ts
export type StoredValue = { value: number | null; updatedAt: string | null };

export async function loadStoredValue(): Promise<number | null> {
  try {
    const res = await fetch('/api/calculator/value');
    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as StoredValue;
    return data.value;
  } catch {
    return null;
  }
}

export async function persistValue(value: number): Promise<void> {
  try {
    await fetch('/api/calculator/value', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  } catch {
    // Persist is best-effort. The local result still displays.
  }
}
```

#### `src/example-calculator.component.ts`

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calculator } from '@umbrella/example-calculator';
import { loadStoredValue, persistValue } from './stored-value';

@Component({
  selector: 'example-calculator',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (submit)="$event.preventDefault()">
      <label>
        Left
        <input type="number" name="left" [(ngModel)]="left" />
      </label>
      <label>
        Right
        <input type="number" name="right" [(ngModel)]="right" />
      </label>
      <div>
        <button type="button" (click)="run('add')">Add</button>
        <button type="button" (click)="run('subtract')">Subtract</button>
        <button type="button" (click)="run('multiply')">Multiply</button>
        <button type="button" (click)="run('divide')">Divide</button>
      </div>
      @if (result() !== null) {
        <p>Result: {{ result() }}</p>
      }
      @if (error()) {
        <p role="alert">{{ error() }}</p>
      }
    </form>
  `,
})
export class ExampleCalculatorComponent {
  private readonly calculator = new Calculator();

  left = 0;
  right = 0;
  readonly result = signal<number | null>(null);
  readonly error = signal<string | null>(null);

  constructor() {
    void this.hydrate();
  }

  private async hydrate(): Promise<void> {
    const stored = await loadStoredValue();
    if (stored !== null) {
      this.result.set(stored);
    }
  }

  run(operation: 'add' | 'subtract' | 'multiply' | 'divide'): void {
    this.error.set(null);
    try {
      const next = this.calculator[operation](Number(this.left), Number(this.right));
      this.result.set(next);
      void persistValue(next);
    } catch (err) {
      this.result.set(null);
      this.error.set(err instanceof Error ? err.message : 'Calculation failed');
    }
  }
}
```

#### `src/index.ts`

```ts
export { ExampleCalculatorComponent } from './example-calculator.component.ts';
```

### React — `packages/frontend/react/example-calculator`

#### `package.json`

```json
{
  "name": "@umbrella/example-calculator-ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json --noEmit",
    "lint": "prettier --check .",
    "format": "prettier --write ."
  },
  "peerDependencies": {
    "react": "MATCH_EXAMPLE_APP",
    "react-dom": "MATCH_EXAMPLE_APP"
  },
  "dependencies": {
    "@umbrella/example-calculator": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "MATCH_EXAMPLE_APP",
    "@types/react-dom": "MATCH_EXAMPLE_APP",
    "prettier": "^3.8.1",
    "react": "MATCH_EXAMPLE_APP",
    "react-dom": "MATCH_EXAMPLE_APP",
    "typescript": "MATCH_EXAMPLE_APP"
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

#### `.prettierrc` / `.prettierignore`

Same as the rules Package.

#### `src/stored-value.ts`

Same helper as the Angular UI Package (`loadStoredValue` / `persistValue` against `/api/calculator/value`).

#### `src/ExampleCalculator.tsx`

```tsx
import { useEffect, useState, type FormEvent } from 'react';
import { Calculator } from '@umbrella/example-calculator';
import { loadStoredValue, persistValue } from './stored-value';

const calculator = new Calculator();

export function ExampleCalculator() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadStoredValue().then((stored) => {
      if (stored !== null) {
        setResult(stored);
      }
    });
  }, []);

  function run(operation: 'add' | 'subtract' | 'multiply' | 'divide') {
    setError(null);
    try {
      const next = calculator[operation](Number(left), Number(right));
      setResult(next);
      void persistValue(next);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Left
        <input
          type="number"
          name="left"
          value={left}
          onChange={(event) => setLeft(Number(event.target.value))}
        />
      </label>
      <label>
        Right
        <input
          type="number"
          name="right"
          value={right}
          onChange={(event) => setRight(Number(event.target.value))}
        />
      </label>
      <div>
        <button type="button" onClick={() => run('add')}>
          Add
        </button>
        <button type="button" onClick={() => run('subtract')}>
          Subtract
        </button>
        <button type="button" onClick={() => run('multiply')}>
          Multiply
        </button>
        <button type="button" onClick={() => run('divide')}>
          Divide
        </button>
      </div>
      {result !== null ? <p>Result: {result}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
```

#### `src/index.ts`

```ts
export { ExampleCalculator } from './ExampleCalculator.tsx';
```

## App-host snippets (always)

After the verbatim CLI, add `"@<umbrella>/example-calculator-ui": "workspace:*"` to `example-app`. Replace the CLI starter page. The app must not import `Calculator` or reimplement arithmetic.

### Angular `example-app`

Root standalone component (CLI file may be `app.ts` or `app.component.ts`):

```ts
import { Component } from '@angular/core';
import { ExampleCalculatorComponent } from '@umbrella/example-calculator-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExampleCalculatorComponent],
  template: `
    <main>
      <h1>Example calculator</h1>
      <example-calculator />
    </main>
  `,
})
export class App {}
```

In `angular.json`, set `preserveSymlinks: true` on `architect.build.options` and `architect.serve.options` so pnpm workspace links resolve. Point `architect.serve.options.proxyConfig` at `proxy.conf.cjs` (or pass `--proxy-config proxy.conf.cjs` on the `dev` script).

`proxy.conf.cjs`:

```js
const target = process.env.BFF_PROXY_TARGET || 'http://localhost:3000';

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
```

### React `example-app`

Replace `src/App.tsx`:

```tsx
import { ExampleCalculator } from '@umbrella/example-calculator-ui';

export default function App() {
  return (
    <main>
      <h1>Example calculator</h1>
      <ExampleCalculator />
    </main>
  );
}
```

In `vite.config.ts`, allow the monorepo root and prebundle the workspace UI Package if Vite cannot resolve the symlink:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4200,
    fs: { allow: ['../../../../'] },
    proxy: {
      '/api': {
        target: process.env.BFF_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['@umbrella/example-calculator-ui'],
  },
});
```

Adjust `fs.allow` to the umbrella root from `apps/frontend/react/example-app`. Keep `dev` as `vite --host 0.0.0.0 --port 4200`.

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

## Docker (always — `example-app` + BFF + calculator MS + SQLite volume)

Copy from `assets/docker/` when present. Replace `umbrella` / `@umbrella/example-app` with the folder basename and scoped app name. Assets use `apps/frontend/angular/…`; replace `angular` with `react` when React was chosen (including the Express BFF Dockerfile).

This is **not** the later umut-colak gitlink Compose file. Scaffold Compose has three services: `example-app`, `example-bff`, `example-calculator`. SQLite is a named volume file, not a database container.

Fill Compose placeholders from the chosen stacks:

| Choice | `__BFF_CONTEXT__` | `__BFF_DOCKERFILE__` |
|--------|-------------------|----------------------|
| Express | `..` | `apps/backend/express/example-bff/Dockerfile` |
| FastAPI / ASP.NET | `../apps/backend/<bff>/example-bff` | `Dockerfile` |

| Choice | `__MS_CONTEXT__` | `__MS_DOCKERFILE__` |
|--------|------------------|---------------------|
| Python / Rust / Go | `../apps/backend/<ms>/example-calculator` | `Dockerfile` |

If Express was chosen, uncomment the BFF `package.json` `COPY` in `docker/Dockerfile`.

### `docker/Dockerfile`

```dockerfile
FROM node:22-bookworm-slim

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend/angular/example-app/package.json ./apps/frontend/angular/example-app/
COPY packages/frontend/typescript/example-calculator/package.json ./packages/frontend/typescript/example-calculator/
COPY packages/frontend/angular/example-calculator/package.json ./packages/frontend/angular/example-calculator/
COPY infra/cdk/package.json ./infra/cdk/
# If Express BFF was chosen, uncomment so pnpm install --frozen-lockfile sees every workspace package:
# COPY apps/backend/express/example-bff/package.json ./apps/backend/express/example-bff/

RUN pnpm install --frozen-lockfile

EXPOSE 4200

CMD ["pnpm", "--filter", "@umbrella/example-app", "dev"]
```

### `docker/docker-compose.yml`

```yaml
name: umbrella

services:
  example-app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    image: umbrella-example-app:local
    ports:
      - "4200:4200"
    volumes:
      - ..:/workspace
      - example-app-node-modules:/workspace/node_modules
      - example-app-app-node-modules:/workspace/apps/frontend/angular/example-app/node_modules
    environment:
      CHOKIDAR_USEPOLLING: "true"
      CHOKIDAR_INTERVAL: "200"
      BFF_PROXY_TARGET: http://example-bff:3000
    working_dir: /workspace
    init: true
    stdin_open: true
    tty: true
    depends_on:
      - example-bff

  example-bff:
    build:
      context: __BFF_CONTEXT__
      dockerfile: __BFF_DOCKERFILE__
    image: umbrella-example-bff:local
    ports:
      - "3000:3000"
    environment:
      CALCULATOR_URL: http://example-calculator:8081
    depends_on:
      - example-calculator

  example-calculator:
    build:
      context: __MS_CONTEXT__
      dockerfile: __MS_DOCKERFILE__
    image: umbrella-example-calculator:local
    ports:
      - "8081:8081"
    volumes:
      - calculator-sqlite:/data
    environment:
      SQLITE_PATH: /data/calculator.db

volumes:
  example-app-node-modules:
  example-app-app-node-modules:
  calculator-sqlite:
```

### `.dockerignore` (repo root)

```
.git
**/.git
**/node_modules
**/dist
**/.angular
**/cdk.out
.turbo
**/.DS_Store
```

Run from the umbrella root: `docker compose -f docker/docker-compose.yml up --build`. Open `http://localhost:4200/`. The calculator UI is the success check. Persist uses `example-bff` on `:3000` and `example-calculator` on `:8081` with volume `calculator-sqlite`. Host-only `pnpm --filter @<umbrella>/example-app dev` still computes locally; persist needs Compose or a locally running BFF + MS.

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
New umbrella needs one JS build graph, a grouped apps/packages layout, a three-layer example calculator, and import-only DNS/TLS. Persist (BFF → microservice → SQLite volume) is ADR 0002.

## Decision
1. pnpm workspace grouping globs (`apps/frontend/*/*`, `apps/backend/*/*`, `packages/frontend/*/*`, `packages/backend/*/*`, `infra/cdk`). Grouping folders have no `package.json`. Do not use `apps/**` / `packages/**`. Root `packageManager` is pnpm; Turbo owns `build` / `test` / `lint` / `format` / `dev`. Express BFF is in that graph when chosen; other backends are not.
2. Example Application is `apps/frontend/<framework>/example-app` (Angular CLI or Vite `react-ts` — record which). `dev` binds `0.0.0.0:4200`. It hosts the calculator UI Package and proxies `/api` to the BFF.
3. Rules Package is `packages/frontend/typescript/example-calculator` (`@<umbrella>/example-calculator`, pure TypeScript `Calculator` + Node tests).
4. UI Package is `packages/frontend/<framework>/example-calculator` (`@<umbrella>/example-calculator-ui`). It depends on the rules Package and is the only place that instantiates `Calculator` for the UI.
5. `docker/Dockerfile` + `docker/docker-compose.yml` serve `example-app` via pnpm (`http://localhost:4200/`) and also run the chosen BFF, the chosen calculator microservice, and a SQLite file volume. Details: ADR 0002.
6. TypeScript CDK in `infra/cdk`. `WebApplication` imports hosted zone id and certificate ARN; it does not create zones or certificates. CDK does not deploy the BFF or microservice.
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
- `docker compose -f docker/docker-compose.yml up --build` serves `example-app` at `http://localhost:4200/` plus the BFF (`:3000`) and calculator microservice (`:8081`)
- Operator copies `Constants.Deployment.ts` locally before `cdk synth`
- ACM cert for CloudFront must be in `us-east-1`
- Starter Diátaxis docs sit alongside this ADR (`docs/tutorial/`, `docs/how-to/`, `docs/reference/`, `docs/explanation/`)
- Persist path and chosen backend stacks: `docs/adr/0002-bff-calculator-microservice-sqlite.md`

## Actionable Takeaways
- [What a future reader should do]
```

## ADR (`docs/adr/0002-bff-calculator-microservice-sqlite.md`)

Fill from the `/research-summarizer` brief for the **chosen** BFF, **chosen** microservice, and file-backed SQLite. Record which stacks were selected. Cite official URLs; do not invent metadata. Do not research unused stacks.

```md
# 0002. BFF, calculator microservice, and SQLite persist

- Status: Accepted
- Date: YYYY-MM-DD
- Source type: documentation

## Key Thesis
[1-2 sentences: thin BFF, microservice owns the single calculator row, SQLite is a file on a Compose volume]

## Context
The example UI already computes with the TypeScript `Calculator` class. The umbrella needs a persist path the operator can run with Docker Compose, using the BFF and microservice languages chosen at scaffold time.

## Decision
1. UI computes locally. After each successful result it `PUT`s `{ value }` to `/api/calculator/value`. On load it `GET`s the last value. Persist failures are non-blocking.
2. BFF is `apps/backend/<bff>/example-bff` (record Express, FastAPI, or ASP.NET Core). It proxies `GET|PUT /api/calculator/value` to `{CALCULATOR_URL}/value`. Port 3000.
3. Microservice is `apps/backend/<ms>/example-calculator` (record Python, Rust, or Go). It implements `GET|PUT /value` and upserts one SQLite row (`id = 1`). Port 8081. `SQLITE_PATH` (Compose: `/data/calculator.db`).
4. Compose runs `example-app`, `example-bff`, and `example-calculator`. Volume `calculator-sqlite` mounts at `/data` on the microservice. There is no SQLite server container.
5. Express BFF joins the pnpm/Turbo graph. Other backends stay outside that graph.
6. CDK stays web-only. It does not deploy the BFF or the microservice.

## Key Findings
1. [Finding + official source — chosen BFF]
2. [Finding + official source — chosen MS HTTP + SQLite]
3. [Finding + official source — file-backed SQLite / Compose named volume]

## Methodology
Official docs summarized with `/research-summarizer` for the stacks chosen at scaffold time.

## Limitations
- [What the sources do not cover]

## Consequences
- `http://localhost:4200/` still hosts the calculator UI
- Persist requires Compose (or a locally running BFF on `:3000` and MS on `:8081`)
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
2. Prerequisites: Node `>=22`, Corepack, pnpm `9.15.9`. Persist also needs Docker (or a local BFF + MS toolchain).
3. Install at the repo root (`corepack enable`, `pnpm install`)
4. Build and test the rules Package (`pnpm exec turbo run build test --filter @<umbrella>/example-calculator`)
5. Start the `example-app` Application (`pnpm --filter @<umbrella>/example-app dev`) and use the calculator (arithmetic works without the BFF)
6. Optional: persist the last result via Docker (link the how-to). Compose also publishes the BFF at `http://localhost:3000/` and the microservice at `http://localhost:8081/`
7. What to read next: how-to, reference, ADR 0001, ADR 0002

### `docs/how-to/serve-example-app.md`

1. Serve on the host (`pnpm --filter @<umbrella>/example-app dev`; binds `0.0.0.0:4200`; `/api` proxies to `BFF_PROXY_TARGET` or `http://localhost:3000`)
2. Serve the full persist path with Docker (`docker compose -f docker/docker-compose.yml up --build`)
3. Success check: `http://localhost:4200/` shows the calculator. After an operation, reload still shows the last value when Compose is up.
4. Notes: bind-mount + named `node_modules` volumes on `example-app`; `CHOKIDAR_USEPOLLING`; BFF `:3000`; MS `:8081`; volume `calculator-sqlite`. Host persist without Compose: run the chosen BFF (`CALCULATOR_URL=http://localhost:8081`) and MS (`SQLITE_PATH` to a local file). No AWS deploy here.

### `docs/reference/repository-layout.md`

Information-oriented only. Include:

- Directory tree (`apps|packages` → `frontend|backend` → framework/language → name; plus `infra/cdk`, `docker`, `docs`, `.cursor/skills`). List the chosen BFF and MS paths only.
- Workspace globs (`apps/frontend/*/*`, `apps/backend/*/*`, `packages/frontend/*/*`, `packages/backend/*/*`, `infra/cdk`)
- Rule: grouping folders have no `package.json`. Non-Express backends have no pnpm `package.json`.
- Root Turbo tasks (`build`, `test`, `lint`, `format`, `dev`)
- Package names (`@<umbrella>/example-app`, `@<umbrella>/example-calculator`, `@<umbrella>/example-calculator-ui`, `@<umbrella>/cdk`, and `@<umbrella>/example-bff` when Express was chosen)
- Docker paths; Compose services `example-app`, `example-bff`, `example-calculator`; volume `calculator-sqlite`
- Persist contract: UI `/api/calculator/value` → BFF → MS `/value` → SQLite file
- `Constants.Deployment.ts` vs `.example` (gitignored vs committed)

### `docs/explanation/umbrella-decisions.md`

Understanding-oriented companion to ADR 0001 and ADR 0002. Discuss why one JS graph (pnpm + Turbo), why apps/packages are grouped by frontend/backend then framework/language, why the example is three layers (rules Package → UI Package → Application), why the UI computes locally while a thin BFF and a language-chosen microservice persist one SQLite row, why Docker Compose runs three services plus a file volume (not a SQLite server), and why CDK **imports** the PlatformDomain instead of creating it. Link `docs/adr/0001-turbo-pnpm-typescript-cdk-umbrella.md` for the graph/CDK status and tables, and `docs/adr/0002-bff-calculator-microservice-sqlite.md` for persist. Do not paste those tables here.

## CONTEXT.md starter terms

**Platform**: Umbrella that owns the pnpm/Turbo graph and TypeScript CDK.  
_Avoid_: treating `apps/frontend/<framework>/example-app` as the whole repo

**Application**: Deployable product under `apps/{frontend|backend}/{framework|language}/`. Examples are `example-app`, `example-bff`, and backend `example-calculator`.  
_Avoid_: service (too generic)

**Package**: Shared library under `packages/{frontend|backend}/{framework|language}/`. First examples are `example-calculator` (rules) and `example-calculator-ui` (framework UI).  
_Avoid_: treating packages as deployable Applications

**InfrastructureConstruct**: Reusable CDK construct (here: `WebApplication`).  
_Avoid_: module, component

**ApplicationStack**: Per-app CDK stack (`WebApplicationStack`).  
_Avoid_: mixing two apps in one stack class

**PlatformDomain**: Imported Route53 hosted zone and ACM certificate for the example website.  
_Avoid_: creating hosted zones or certificates in CDK
