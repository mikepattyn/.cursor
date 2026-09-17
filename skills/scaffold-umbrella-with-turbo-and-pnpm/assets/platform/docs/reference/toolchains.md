# Toolchains

| Lane | Runtime | Test / run |
| --- | --- | --- |
| JS / TS workspace | Node 22, pnpm 9.15.9, Turbo | `pnpm exec turbo run build test lint typecheck format:check` |
| Python | 3.12, uv | `uv run pytest` / `uv run uvicorn` |
| .NET | 8.0 | `dotnet test` / `dotnet run` |
| Go | 1.23 | `go test ./...` |
| Rust | rust-toolchain.toml | `cargo test` |
| Java / Kotlin (preview) | JDK 21, Gradle 8.12.1 | `./gradlew test` after `gradle wrapper --gradle-version 8.12.1` |
| OpenAPI | contract package | `pnpm --filter "./packages/contracts/**" lint` |

Do not add `package.json` on grouping folders or on native leaves. `scripts/repo.mjs` dispatches listed commands only.
