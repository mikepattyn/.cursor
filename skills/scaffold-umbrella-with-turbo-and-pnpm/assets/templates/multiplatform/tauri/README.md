# Tauri desktop shell

Wraps the web `example-app`. Code signing is **external**: do not put certificates, Apple IDs, or Windows EV keys in this repo. Configure signing in the operator's CI secrets or local keychain.

Capabilities stay minimal (`core:default` only). Add filesystem or HTTP allowlists only when a feature needs them.

`src-tauri` is a Cargo project, not an npm package. Run `cargo test` / `cargo clippy` from `src-tauri`; do not wrap it as a workspace package.json.
