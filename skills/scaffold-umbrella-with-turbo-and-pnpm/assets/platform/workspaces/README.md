# Native workspaces

Copy the matching file to the umbrella root only when that ecosystem is selected. Do not invent a `package.json` for these projects.

| File | When |
|------|------|
| `Cargo.toml` | Any Rust crate |
| `go.work` | Any Go module |
| `pyproject.toml` | Any Python app (uv workspace) |
| `Directory.Build.props` | Any .NET project |

`scripts/repo.mjs` runs the `native:` commands from `scaffold.manifest.yaml`. Keep pnpm/Turbo authoritative for JavaScript only.
