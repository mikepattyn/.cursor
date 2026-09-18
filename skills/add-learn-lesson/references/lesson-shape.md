# Lesson shape

Source of types: Learn app `src/lib/lessons/types.ts`. Do not invent extra
fields on `Lesson` or `Step`.

## Files

| Tree | Path |
|------|------|
| Learn app | `src/lib/lessons/<id>.ts` |
| Learn app | `src/lib/lessons/catalog.ts` — import + append to `track.lessons` |
| `mikepattyn/learn` | `curriculum/NN-kebab-title.md` |
| `mikepattyn/learn` | `README.md` path table |

`NN` is two-digit, matching lesson `number` (`04-…` for lesson 4). Existing:

| # | id | Markdown |
|---|----|----------|
| 1 | `scaffold` | `01-scaffold-the-umbrella.md` |
| 2 | `email` | `02-the-email-package.md` |
| 3 | `contact-api` | `03-contact-api-lambda.md` |

Default track:

```ts
id: "first-contact-email"
title: "First contact email"
```

A new track is a new `Track` plus a home-page section. Do not add a track
unless the user named one.

## Block types

Use only these `Block` variants:

| `type` | Use for |
|--------|---------|
| `p` | One short paragraph |
| `code` | Command or file excerpt. Set `lang`, optional `file` |
| `list` | Parallel facts. Keep items one line if you can |
| `caution` | Irreversible or security-real. Rare |
| `note` | Side door: default, local-vs-AWS, where a file lives |
| `flow` | Three to five boxes. `label` + optional `hint` |
| `kv` | Env vars or name/value rows. `key` is the name, `value` is the note |
| `link` | One outbound URL. Public repos only |

Code blocks stay short. Split a long file across steps rather than dumping it.

## Catalog wiring

```ts
import { newThingLesson } from "./new-thing";

export const track: Track = {
  id: "first-contact-email",
  title: "First contact email",
  summary: "…",
  lessons: [scaffoldLesson, emailLesson, contactApiLesson, newThingLesson],
};
```

`number` is 1-based order in that array. After an insert, renumber only if
you inserted in the middle. Prefer append.

## Home page

The home list reads `track.lessons`. Appending is enough. The player header uses `lessons.length` for “Lesson N of M”.
