---
name: add-learn-lesson
description: >-
  Author an ADHD-safe Learn lesson (one step on screen, no quizzes, no streaks)
  and publish it. Use when the user asks to add a lesson, write a Learn lesson,
  extend the First contact email path, publish curriculum to mikepattyn/learn,
  or mentions add-learn-lesson. Do not use for the private teach workspace
  (MISSION.md / HTML lessons) or for portfolio Under the Hood articles
  (umbrella-teach). Do not use for scaffold-umbrella-with-turbo-and-pnpm.
argument-hint: "What should the next lesson teach?"
license: MIT
metadata:
  author: mikepattyn
  audience: learning-programmers
---

# Add a Learn lesson

Write **one** public lesson for the Learn classroom, then publish it.

This is not the private `teach` workspace (HTML lessons, `MISSION.md`) and
not `umbrella-teach` (Portfolio `/#under-the-hood`). Those live on
[mikepattyn/skills](https://github.com/mikepattyn/skills). This skill lives
next to [scaffold-umbrella-with-turbo-and-pnpm](../scaffold-umbrella-with-turbo-and-pnpm/SKILL.md)
on [mikepattyn/.cursor](https://github.com/mikepattyn/.cursor).

Learn lessons are bite-sized AWS/workshop steps. The reader parks whenever
they want. Nothing grades them.

**Destinations**

| What | Where |
|------|--------|
| This skill | [mikepattyn/.cursor](https://github.com/mikepattyn/.cursor) → `skills/add-learn-lesson/` |
| Lesson markdown | [mikepattyn/learn](https://github.com/mikepattyn/learn) → `curriculum/` |
| Interactive catalog | Learn app → `src/lib/lessons/` when that tree is in the workspace |

Do **not** put lesson bodies in this repo. `.cursor` holds skills. `learn`
holds curriculum.

Read on demand: [references/adhd-voice.md](references/adhd-voice.md),
[references/lesson-shape.md](references/lesson-shape.md),
[references/publish.md](references/publish.md).
Start from [assets/lesson.template.ts](assets/lesson.template.ts) and
[assets/curriculum.template.md](assets/curriculum.template.md).

## Progress

```
Progress:
- [ ] 1. Gather topic, source repo, track
- [ ] 2. Read existing lessons (voice + next number)
- [ ] 3. Outline steps — confirm if the topic was vague
- [ ] 4. Write the TypeScript lesson (if the Learn app is here)
- [ ] 5. Wire the catalog
- [ ] 6. Write curriculum markdown
- [ ] 7. ADHD + secrets pass
- [ ] 8. Publish to mikepattyn/learn
```

On resume, skip ticks that are already done. Do not start a second lesson
in the same run.

## 1. Gather inputs

Infer from the invoking message. Ask only for what is still missing, in
**one** batch.

| Input | Rule |
|-------|------|
| Topic | One job the reader can finish in one sitting |
| Source repo | Public GitHub URL the lesson is about (clone it; do not invent APIs) |
| Track | Default: append to **First contact email**. New track only if they named one |
| Placement | Next number after the last lesson in that track |
| App tree | Learn app present if `src/lib/lessons/catalog.ts` exists |

Do not ask for live secrets. Do not invent AWS account ids, ARNs, passwords,
or Turnstile keys. Point at env var **names** only.

If they named a private repo, stop and say the classroom is public.

## 2. Read what already exists

In parallel:

- `curriculum/` on `mikepattyn/learn` (or a fresh clone)
- `src/lib/lessons/` if the Learn app is in this workspace
- The source repo the lesson teaches (README + the files you will quote)

Next lesson number = max existing `number` in the track + 1. Next markdown
file = `curriculum/NN-kebab-title.md` where `NN` is two-digit (`04-…`).

Id: kebab-case, `[a-z0-9-]+`, unique in the catalog, used in the URL
`/lesson/<id>/<stepId>`.

## 3. Outline, then write

Each lesson is **6–8 steps**. Each step is **1–2 minutes**, one job, one
primary action. Title is a verb or a concrete noun phrase (`Sit Email next
to Contact.Api`, not `Overview`).

Every step needs:

- `id` — short kebab
- `title` — what they do
- `why` — one sentence. Why this step exists. Not a recap.
- `minutes` — integer
- `blocks` — see [lesson-shape](references/lesson-shape.md)

Show the outline if the topic was vague. If they already specified the
lesson, write it.

Copy voice from the existing three lessons. Rules:
[adhd-voice](references/adhd-voice.md).

## 4. TypeScript (Learn app)

When `src/lib/lessons/catalog.ts` exists:

1. Add `src/lib/lessons/<id>.ts` exporting `<id>Lesson` as `Lesson`
2. Import it in `catalog.ts` and append it to `track.lessons` (order = path order)
3. Do not change `types.ts` unless a new block type is truly required
4. `minutes` on the lesson = sum of step minutes (or a honest round number)

Match the templates. No new UI chrome, no quizzes, no streaks.

## 5. Curriculum markdown

Write `curriculum/NN-kebab-title.md` for [mikepattyn/learn](https://github.com/mikepattyn/learn).

Same steps, same order, same commands as the TypeScript. Markdown is the
portable copy: headings for steps, fenced code, tables for env vars, a
short source link at the top.

Update `README.md` on `learn`: add one row to the path table.

Do not mention MIT in the classroom footer copy. License file on that repo
can stay.

## 6. ADHD + secrets pass

Before publish:

- [ ] One idea per step. No walls of text (about 80–120 words of prose per step, plus code)
- [ ] No quizzes, scores, streaks, or “don’t break the chain”
- [ ] No secrets, tokens, account ids, or real `Constants.Deployment` values
- [ ] Quoted code comes from the source repo, trimmed
- [ ] Caution blocks only for irreversible or security-real mistakes
- [ ] Last step tells them they can park

## 7. Publish

Follow [references/publish.md](references/publish.md).

This skill **does** push curriculum to `mikepattyn/learn` when the user
asked to add or publish a lesson. That is the job.

Do **not** push [mikepattyn/.cursor](https://github.com/mikepattyn/.cursor)
unless this run also edited the skill itself. Do not nest lesson markdown
inside `skills/`.

Commit message: `feat(learn): add <lesson id> lesson`.

## Anti-patterns

- Following `teach` (HTML lessons, quizzes, `MISSION.md`)
- Following `umbrella-teach` (Portfolio topic, EN+NL i18n)
- Running `scaffold-umbrella-with-turbo-and-pnpm` as part of writing a lesson
- A second lesson “while we are here”
- Putting curriculum files in this `.cursor` repo
- Inventing APIs you did not read
- Access keys in examples
- Purple UI, emoji chrome, or gamification in the Learn app
