# FrontendEngineerIntern

A free, open course that takes you from zero to frontend engineer, one short section at a time.

**Read it:** [frontendengineerintern.dukedev.space](https://frontendengineerintern.dukedev.space)

## What's inside

- 19 chapters in four parts, from how the web works to how senior engineers think
- Short sections written in plain words, with every new term explained
- Interactive figures you can tap to see each idea working
- Exercises at the end of every section

Chapter 1 is being written now. Sections open one at a time as they're finished.

## Run it locally

You need Node.js 22 or newer and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm db:migrate
pnpm dev
```

Then open http://localhost:3000. Set `BETTER_AUTH_SECRET` in `.env.local` first; `.env.example` explains each value.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production |
| `pnpm lint` | Lint the code |
| `pnpm typecheck` | Check types |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run browser tests |

## Project layout

```
src/app          Pages: landing, contents, chapters, sections
src/content      The course map and each section (MDX)
src/components   Figures, book layout and site parts
figures          Build scripts for the interactive figures
drizzle          Database migrations
tests/e2e        Browser tests
```

## Built with

Next.js, TypeScript, MDX, Drizzle with Turso, Better Auth, hosted on Vercel.

## Credits

- The interactive figures are made with [Anatomy](https://github.com/wheresryan22/anatomy), an open-source skill by Ryan ([@wheresryan22](https://github.com/wheresryan22)), released under the MIT license. Its drawing kit is included in `figures/kit` with its license.
- The typeface is PP Neue Montreal by [Pangram Pangram](https://pangrampangram.com), used with permission. The font files are not covered by this repository's licenses.
- Facts in the sections come from [MDN Web Docs](https://developer.mozilla.org) and the other sources each section lists.

## License

The code is [MIT](LICENSE). The lessons and figures are [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).

Made by [Duke Azeta](https://dukedev.space).
