# Native workspaces

Copy `Directory.Build.props` to the umbrella root. Do not invent a `package.json` for the .NET API.

`scripts/repo.mjs` runs the `native:` commands from `scaffold.manifest.yaml`. Keep pnpm/Turbo authoritative for JavaScript only.
