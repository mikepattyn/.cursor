# Recipe-only: Kotlin Multiplatform shared calculator

Not a full KMP app (no Android/iOS targets or Gradle wrapper jar). At scaffold time run `gradle wrapper --gradle-version 8.12.1` if you promote this beyond a recipe.

```bash
./gradlew :shared:check
```

Keep `shared/` outside the pnpm graph.
