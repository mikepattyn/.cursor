# Preview: Kotlin Ktor calculator API

Preview stack. Not selected by the default scaffold prompts.

Do **not** vendor `gradle/wrapper/gradle-wrapper.jar` in this template. At scaffold time the agent must generate the wrapper:

```bash
gradle wrapper --gradle-version 8.12.1
```

Then:

```bash
./gradlew test
./gradlew run
```

Listens on `:8081`. Contract: `GET|PUT /value`, `GET /healthz`, `GET /readyz`. SQLite file at `SQLITE_PATH`.
