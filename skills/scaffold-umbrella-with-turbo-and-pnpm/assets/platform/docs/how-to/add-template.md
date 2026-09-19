# Add a template

This scaffold is the Learn stack: Angular 22 + one .NET 10 API. Do not add React, Vue, Express, or other language lanes.

1. Author a complete leaf under `.cursor/skills/scaffold-umbrella-with-turbo-and-pnpm/assets/templates/<role>/<name>/`.
2. Pin versions. Use `@umbrella` scoped names and `0.0.0` private packages (contracts may be `0.1.0`).
3. The API health endpoint is `/healthz`. Persist is `GET|PUT /api/calculator/value`.
4. Add a `package.json` only if the leaf is a JS/TS workspace package. The .NET API uses NuGet.
5. Add a row to `.cursor/skills/scaffold-umbrella-with-turbo-and-pnpm/assets/catalog/templates.yaml` (`id`, `tier`, `roles`, `source`, `destination`, commands, lockfiles, deployment). Validate it against `assets/catalog/schema.json`.
6. Document the copy destination in this umbrella's `docs/reference/repository-layout.md`.
7. If CI should run a native command, add it under `native:` in `scaffold.manifest.yaml` — do not invent a fake npm wrapper.

```yaml
commands:
  check: pnpm exec turbo run build test lint typecheck format:check
  test: pnpm exec turbo run test
  dev: pnpm --filter @umbrella/example-app dev
  dev:web: pnpm --filter @umbrella/example-app dev
  dev:full: docker compose -f docker/docker-compose.yml up --build
native:
  dotnet-api: dotnet test apps/backend/dotnet/example-api/ExampleApi.sln
```
