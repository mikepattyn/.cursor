# Publish

Curriculum is public. Push only `mikepattyn/learn` for a lesson run.

## Learn repo (`mikepattyn/learn`)

```bash
git clone https://github.com/mikepattyn/learn.git
# write curriculum/NN-kebab-title.md
# update README.md path table
git add curriculum/NN-kebab-title.md README.md
git commit -m "feat(learn): add <id> lesson"
git push origin main
```

If `learn` is already a checkout, work on `main`, pull `--ff-only`, then
commit only those paths. Do not scoop unrelated dirty files.

README row:

```md
| N | [Title](curriculum/NN-kebab-title.md) | [owner/repo](https://github.com/owner/repo) |
```

## Learn app (this workspace)

When `src/lib/lessons/catalog.ts` exists, the TypeScript catalog **is** the
interactive classroom. HMR picks up the new lesson. Do not put secrets in
the app. Do not add auth or a database for curriculum.

Grok App Builder: leave the preview server running. Do not push this app
tree to `mikepattyn/learn`.

## Skill home (`mikepattyn/.cursor`)

Only when **this skill** changed:

```
skills/add-learn-lesson/
```

Commit: `feat(skills): add add-learn-lesson` (first time) or
`fix(skills): …` / `docs(skills): …`.

Never commit a lesson body under `skills/`. Do not copy this skill into
the scaffold skill’s `assets/skills/` — that shelf is for umbrellas the
scaffold writes, not for Learn.

## GitHub CLI

`gh` as `mikepattyn` is enough. Do not create a new repo.
`mikepattyn/.cursor` and `mikepattyn/learn` already exist and are public.

If push is denied, stop and say so. Do not open a fork.

## Privacy

Drop before commit:

- `.env`, passwords, app passwords, Turnstile secrets
- AWS access keys, account ids copied from a real `Constants.Deployment.ts`
- Customer mail, private URLs, unpublished product plans

Quoted public source is fine. Trim it. Link the repo.
