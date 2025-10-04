# Repository Guidelines

## Project Structure & Module Organization

- Next.js source resides in `src/app`; `layout.tsx` defines the shell and `page.tsx` renders the dashboard.
- API logic sits in `src/app/api/exchange-rate/route.ts` with shared helpers in `src/app/actions.ts`.
- Global styling lives in `src/app/globals.css`; static assets belong in `public/`.
- Configuration files (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`) stay at the repo root. Future integration tests should land in `src/tests/`.

## Build, Test, and Development Commands

- `pnpm install` syncs dependencies; pnpm is the required package manager.
- `pnpm dev` runs the Next.js dev server via Turbopack at `http://localhost:3000`.
- `pnpm build` compiles the production bundle; `pnpm start` serves that build.
- `pnpm lint`, `pnpm prettier`, and `pnpm prettier:check` enforce style. Hit `/api/exchange-rate` locally (`curl http://localhost:3000/api/exchange-rate`) before review.

## Coding Style & Naming Conventions

- Write strongly typed TypeScript; favor named exports for modules (`export function ExchangeRateCard`).
- Keep Tailwind class names ordered layout → spacing → color inside `className` props.
- Directories use kebab-case, React components use PascalCase, and hooks/utilities use camelCase (`useExchangeRates`).
- Prettier governs formatting; avoid manual indentation tweaks.

## Testing Guidelines

- Vitest + Testing Library are the preferred stack when tests arrive.
- Co-locate unit specs as `*.test.ts(x)` beside sources and stage broader scenarios under `src/tests/`.
- At minimum, run `pnpm lint` and confirm the exchange-rate endpoint responds before asking for feedback.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`feat(exchange-rate): add USD conversion`, `fix(api): handle 5xx retries`).
- Keep each commit atomic and reference related issues in PR descriptions.
- PRs should outline behavior changes, note environment or config updates, and include UI screenshots when visuals shift.
- Verify `pnpm build` or a Vercel preview before requesting review.

## Security & Configuration Tips

- Store `EL_TOQUE_API_TOKEN` in `.env.local` and keep credentials out of git.
- Preserve the one-hour caching policy unless product signs off on changes.
- Wrap external `fetch` calls with error handling and supply sensible fallbacks for downstream consumers.
