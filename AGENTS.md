# Repository Guidelines

## Project Structure & Module Organization

- Core Next.js app lives in `src/app`; `layout.tsx` defines the shell and `page.tsx` drives the dashboard.
- Exchange-rate logic splits between `src/app/api/exchange-rate/route.ts` (API handler) and shared actions in `src/app/actions.ts`.
- Global styles live in `src/app/globals.css`; static assets belong in `public/`.
- High-level or integration tests should land in `src/tests/`; colocate focused unit specs alongside source as `*.test.ts(x)`.

## Build, Test, and Development Commands

- `pnpm install` resolves dependencies; rerun after pulling main.
- `pnpm dev` starts the Turbopack dev server at `http://localhost:3000`.
- `pnpm build` compiles the production bundle; confirm before any release request.
- `pnpm start` serves the built output for smoke checks.
- `pnpm lint`, `pnpm prettier`, and `pnpm prettier:check` enforce formatting; fix issues before review.
- Hit the health check with `curl http://localhost:3000/api/exchange-rate` prior to sign-off.

## Coding Style & Naming Conventions

- Author strongly typed TypeScript; default-export pages, but prefer named exports elsewhere (e.g., `export function ExchangeRateCard`).
- Use Tailwind classes ordered layout → spacing → color within `className`.
- Directory names use kebab-case, React components PascalCase, hooks/utilities camelCase.
- Let Prettier handle spacing; avoid manual overrides.

## Testing Guidelines

- Favor Vitest with Testing Library; mirror component structure when placing tests (e.g., `Button.test.tsx`).
- Maintain concise, deterministic specs; prefer integration flows under `src/tests/`.
- Always run `pnpm lint` and applicable tests before requesting review; document additional scripts in `package.json`.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`feat(exchange-rate): add cache`) to keep history scannable.
- Keep commits atomic; stage only related changes.
- PR descriptions should outline user-facing impact, link issues, call out config/env updates, and attach UI screenshots when visuals shift.
- Confirm `pnpm build` succeeds and note any outstanding risks or TODOs.

## Security & Configuration Tips

- Store secrets (e.g., `EL_TOQUE_API_TOKEN`) in `.env.local`; never commit credentials.
- Preserve the one-hour API cache policy unless product approves changes.
- Wrap external `fetch` calls with defensive error handling and provide fallbacks for downstream consumers.
