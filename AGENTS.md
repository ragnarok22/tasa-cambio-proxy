# Repository Guidelines

## Project Structure & Module Organization

The Next.js app lives in `src/app`; the root layout is `layout.tsx` and the main dashboard sits in `page.tsx`. The TRMI proxy endpoint resides at `src/app/api/exchange-rate/route.ts` and shares logic with `src/app/actions.ts`. Global styles are consolidated in `src/app/globals.css`, while static assets belong in `public/`. Top-level configs such as `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, and `tsconfig.json` govern routing, linting, styles, and TypeScript.

## Build, Test, and Development Commands

Run `pnpm install` to sync dependencies; pnpm is the canonical package manager. `pnpm dev` launches Next.js with Turbopack at `http://localhost:3000`. Use `pnpm build` to compile the production bundle and `pnpm start` to serve it. Quality checks live in `pnpm lint`, `pnpm prettier`, and `pnpm prettier:check`; run them before every push.

## Coding Style & Naming Conventions

Write TypeScript and keep components typed. Pages may default-export, but prefer named exports elsewhere (e.g., `export function ExchangeRateCard`). Prettier dictates formatting—no manual tweaks. Tailwind utility classes stay in JSX `className` props and should flow layout → spacing → color. Use kebab-case for directories, PascalCase for React components, and camelCase for hooks (`useExchangeRates`).

## Testing Guidelines

Automated tests are not yet scaffolded. When adding them, colocate unit specs as `*.test.ts(x)` next to their sources and place higher-level flows under `src/tests/`. Prefer the Next.js-friendly stack (Vitest + Testing Library) and document new scripts in `package.json`. Always run `pnpm lint` and hit `/api/exchange-rate` locally (e.g., `curl http://localhost:3000/api/exchange-rate`) before requesting review.

## Commit & Pull Request Guidelines

Follow the Conventional Commit pattern used in history (`feat(exchange-rate): …`, `fix(api): …`). Keep commits scoped to one change. Pull requests should describe behavior, reference tickets, list environment updates, and include screenshots for UI tweaks. Confirm `pnpm build` or the Vercel preview before requesting merge.

## Security & Configuration Tips

Store the El Toque token in `.env.local` as `EL_TOQUE_API_TOKEN` and never commit real credentials. Stick with the 1-hour cache window unless product requirements change. Review every external `fetch` for robust error states and fallback data.
