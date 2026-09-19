# Release policy

- Packages default to `"private": true` and version `0.0.0` (OpenAPI contracts may use `0.1.0`).
- Versions are **independent**. A change in one leaf does not bump siblings.
- npm publish is **opt-in**. Set `publishable: true` in `scaffold.manifest.yaml` and add a `.changeset` directory before the release workflow calls Changesets.
- Without those, `release.yml` is a no-op for npm.
- `dotnet pack` is per-leaf and never goes through npm.
