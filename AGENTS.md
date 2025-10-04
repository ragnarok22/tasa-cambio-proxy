# Repository Guidelines

## Project Structure & Module Organization

- Core Next.js app resides in `src/app`; `layout.tsx` anchors the shell and `page.tsx` renders the dashboard flow.
- Exchange-rate logic is split between `src/app/api/exchange-rate/route.ts` and shared utilities in `src/app/actions.ts`.
- Global styling stays in `src/app/globals.css`, static assets in `public/`, and future high-level tests should live under `src/tests/`.
- Root-level configs (`next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`) control routing, linting, styles, and TypeScript behavior.

## Build, Test, and Development Commands

- `pnpm install` syncs dependencies (pnpm is the required package manager).
- `pnpm dev` launches the Turbopack dev server at `http://localhost:3000` for rapid iteration.
- `pnpm build` compiles the production bundle; `pnpm start` serves the compiled output.
- `pnpm lint`, `pnpm prettier`, and `pnpm prettier:check` enforce code quality; hit `/api/exchange-rate` locally (`curl http://localhost:3000/api/exchange-rate`) before every review cycle.

## Coding Style & Naming Conventions

- Author strongly typed TypeScript; pages may default-export, while shared modules prefer named exports (`export function ExchangeRateCard`).
- Keep Tailwind classes ordered layout → spacing → color inside `className` props.
- Use kebab-case for directories, PascalCase for React components, camelCase for hooks/utilities (e.g., `useExchangeRates`).
- Prettier governs formatting—avoid manual indentation or spacing adjustments.

## Testing Guidelines

- Preferred stack: Vitest with Testing Library when tests are introduced.
- Co-locate unit specs as `*.test.ts(x)` next to source files; reserve `src/tests/` for broader scenarios or integration flows.
- Minimum pre-review checklist: run `pnpm lint`, ensure endpoint health via `curl`, and document any new scripts in `package.json`.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`feat(exchange-rate): add MLC quote`, `fix(api): retry on 5xx`). Keep each commit atomic.
- PR descriptions should outline user-visible changes, link relevant issues, flag environment/config updates, and attach UI screenshots when visuals change.
- Confirm `pnpm build` (or a Vercel preview) succeeds before requesting review.

## Security & Configuration Tips

- Store secrets in `.env.local`, notably `EL_TOQUE_API_TOKEN`; never commit real credentials.
- Maintain the one-hour cache policy unless product approves a change.
- Wrap external `fetch` calls with defensive error handling and supply fallback data for dependents.
