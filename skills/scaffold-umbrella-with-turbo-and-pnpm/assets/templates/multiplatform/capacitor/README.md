# Capacitor shell

Do not vendor generated `android/` or `ios/` trees in this template.

At scaffold time:

1. Build the web app into `webDir` (`dist`).
2. `npx cap add android` / `npx cap add ios` once.
3. Merge `overlays/android/AndroidManifest.xml` and `overlays/ios/Info.plist`.
4. `npx cap sync` after every web build.

Signing stays in the operator's keystore / Apple account. Native projects are not npm packages.
