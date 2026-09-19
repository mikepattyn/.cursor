# Toolchains

| Lane | Runtime | Test / run |
| --- | --- | --- |
| JS / TS workspace | Node 22, pnpm 9.15.9, Turbo 2.5.8 | `pnpm exec turbo run build test lint typecheck format:check` |
| Angular app | Angular CLI 22.1.8 | `pnpm --filter @umbrella/example-app dev` |
| .NET API | 10.0 | `dotnet test ExampleApi.sln` / `dotnet run` |
| OpenAPI | contract package | `pnpm --filter "./packages/contracts/**" lint` |

Do not add `package.json` on grouping folders or on the .NET API. `scripts/repo.mjs` dispatches listed commands only.
