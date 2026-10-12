# FrontendEngineerIntern

A free, open course that takes you from zero to frontend engineer, one small lesson at a time. It starts with how the web works and ends with what senior engineers think about.

Every lesson opens with a real-life comparison, explains one idea, shows it as an interactive figure, then checks what you remember.

The course is being built level by level. Level 1 (Web fundamentals) is in progress.

## Run it locally

You need Node.js 22 or newer and pnpm.

```bash
pnpm install
cp .env.example .env.local   # then set BETTER_AUTH_SECRET
pnpm db:migrate
pnpm dev
```

Open http://localhost:3000.

Sign-in is optional. To turn on Google or GitHub sign-in, add their client ID and secret to `.env.local`. The callback URLs are listed in `.env.example`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Check types |
| `pnpm lint` | Lint |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | Browser tests (Playwright) |
| `pnpm db:generate` | Create a migration from the schema |
| `pnpm db:migrate` | Apply migrations |

## How it's built

- Next.js (App Router) and TypeScript
- Turso (libSQL) with Drizzle ORM, for learner progress only
- Better Auth with optional Google and GitHub sign-in
- Lessons are MDX files in the repo, written and reviewed by hand
- Lesson figures are made with the [anatomy](https://github.com/wheresryan22/anatomy) skill

## License

- Code: [MIT](LICENSE)
- Lessons and figures: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md)

### Fonts

The typeface is PP Neue Montreal by [Pangram Pangram Foundry](https://pangrampangram.com). It's used in this project with permission. The font files in `public/fonts/` are not covered by this repository's licenses. Don't reuse them in your own projects without getting a license from the foundry.
