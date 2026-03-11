# Repository Guidelines

## Project Overview

- This is a Next.js App Router application that displays Cuban informal-market exchange rates (TRMI) from El Toque.
- The primary currencies shown are USD, EUR, and MLC. Upstream uses `ECU` for Euro; map that value to `eur`/`EUR` in app-facing code.
- All displayed rates are informational/referential only. Preserve the user-facing disclaimers that actual transaction values may vary.

## Project Structure & Module Organization

- Core app code lives in `src/app`; `layout.tsx` defines the shell and metadata, while `page.tsx` renders the dashboard.
- Exchange-rate logic is split between `src/app/api/exchange-rate/route.ts` and shared server actions in `src/app/actions.ts`.
- Provincial map UI lives in `src/components/Province-svg-map.tsx`, with SVG path data in `src/data/cuba-paths.ts` and shared types in `src/types/province.ts`.
- SEO and app metadata routes live alongside the app in `src/app/opengraph-image.tsx`, `src/app/icon.tsx`, `src/app/manifest.ts`, and `src/app/sitemap.ts`.
- Global styles live in `src/app/globals.css`; static assets belong in `public/`.
- High-level or integration tests should land in `src/tests/`; colocate focused unit specs alongside source as `*.test.ts(x)`.

## Build, Test, and Development Commands

- `pnpm install` resolves dependencies; rerun after pulling `main`.
- `pnpm dev` starts the Turbopack dev server at `http://localhost:3000`.
- `pnpm build` compiles the production bundle with Turbopack; confirm it succeeds before any release request.
- `pnpm start` serves the built output for smoke checks.
- `pnpm lint` runs ESLint.
- `pnpm format` writes Prettier formatting across the repo.
- `pnpm format:check` verifies formatting in CI or before review.
- Hit the health check with `curl http://localhost:3000/api/exchange-rate` prior to sign-off when the app is running and environment variables are present.

## Environment Setup

- Create `.env.local` from `.env.example`.
- `EL_TOQUE_API_TOKEN` is required for the main page and API proxy to fetch live data.
- `OPENAI_API_KEY` is required for province-rate image processing. If it is missing, province data falls back to an empty result set.
- Never commit secrets or tokens.

## Architecture & Data Flow

- The main page in `src/app/page.tsx` fetches TRMI data directly from El Toque with `next: { revalidate: 3600 }`, then calls `fetchProvinceRates` with the national USD rate.
- The public API endpoint at `/api/exchange-rate` supports optional `date_from` and `date_to` query params, validates the range, and returns a transformed response with `usd`, `eur`, `mlc`, `date`, `time`, and `raw`.
- `fetchTRMI` in `src/app/actions.ts` mirrors the same validation rules and returns a typed success/error object for reuse in server-side flows.
- `processProvinceRatesImage` uses the OpenAI SDK with `gpt-4o` vision to extract provincial rates from `https://wa.cambiocuba.money/trmi_by_province.png`, strips code fences if present, parses JSON, and caches results for 12 hours with `unstable_cache`.
- `fetchProvinceRates` maps province names to `CU-XX` IDs, calculates variance against the national USD rate, and attaches tooltip coordinates for the SVG map.

## Important Constraints

- `date_from` and `date_to` must be ordered correctly and differ by less than 24 hours before calling El Toque.
- Preserve the one-hour cache policy for TRMI fetches unless product approves a change.
- Preserve the twelve-hour cache policy for province image processing unless product approves a change.
- Keep defensive error handling around external `fetch` and OpenAI calls, and return consumer-friendly failures.
- Do not remove or weaken the referential-rate disclaimers in the UI without an explicit product decision.

## Coding Style & Naming Conventions

- Author strongly typed TypeScript; default-export pages, but prefer named exports elsewhere.
- Use server components by default in the App Router; add `'use client'` only where interactivity requires it.
- Server actions should use the `'use server'` directive.
- Use Tailwind classes ordered layout -> spacing -> color within `className`.
- Directory names use kebab-case, React components PascalCase, hooks and utilities camelCase.
- Let Prettier handle spacing; avoid manual formatting overrides.

## Testing Guidelines

- This repo currently relies on formatting, linting, and build validation in CI; there are no committed automated test scripts yet.
- When adding tests, favor Vitest with Testing Library and mirror component structure when placing specs.
- Maintain concise, deterministic specs; prefer integration flows under `src/tests/`.
- Always run `pnpm lint`, `pnpm format:check`, and any applicable tests before requesting review.
- Document any new test scripts in `package.json`.

## CI/CD & Release

- The project follows a rolling-release model: changes merged to `main` are intended for immediate deployment.
- `.github/workflows/ci.yml` runs formatting, lint, and build checks on pushes to `main` and on pull requests.
- `.github/workflows/deploy-preview.yml` posts PR preview guidance while Vercel handles deployment previews automatically.
- Production and preview deployments are expected to run on Vercel.
- `src/app/icon.tsx` and `src/app/opengraph-image.tsx` intentionally use metadata/image routes; treat their generation behavior as part of the deploy surface.

## Commit & Pull Request Guidelines

- Follow Conventional Commits such as `feat(exchange-rate): add cache`.
- Keep commits atomic; stage only related changes.
- PR descriptions should outline user-facing impact, link issues, call out config or env updates, and attach UI screenshots when visuals shift.
- Confirm `pnpm build` succeeds and note any outstanding risks or TODOs before review.

## Project Documentation

- `README.md` is the primary user-facing project document.
- `CONTRIBUTING.md` covers contributor workflow and expectations.
- `SECURITY.md` documents the security policy.
- GitHub issue templates and the PR template live under `.github/`.

## Security & Configuration Tips

- Store secrets such as `EL_TOQUE_API_TOKEN` and `OPENAI_API_KEY` in `.env.local`.
- Preserve existing cache durations and validation rules unless product requirements change.
- Wrap external integrations with defensive error handling and provide fallbacks where the current UX depends on them.
