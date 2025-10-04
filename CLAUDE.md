# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that displays Cuban currency exchange rates (USD, EUR, MLC) from El Toque's API. The app serves as a proxy to fetch and display TRMI (Tasa Representativa del Mercado Informal) data for users.

**Important**: All displayed rates are informational/referential only and include disclaimers to users that actual rates may vary in real transactions.

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build --turbopack

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code with Prettier
pnpm prettier

# Check formatting
pnpm prettier:check
```

## Environment Setup

Create a `.env.local` file based on `.env.example`:

```
EL_TOQUE_API_TOKEN=your_token_here
```

This token is required for the API proxy to function. Without it, the app will return mock data.

## Architecture

### Data Fetching Strategy

The app fetches data directly from El Toque's TRMI API. There are two approaches:

1. **Direct Fetch in Page Component** (`src/app/page.tsx`):
   - Main page fetches directly from El Toque API
   - Includes 1-hour cache revalidation with Next.js `revalidate`
   - Falls back to mock data if API fails or token is missing
   - Transforms API response from `{ tasas: { USD, ECU, MLC } }` to simple format

2. **API Route** (`/api/exchange-rate`):
   - Public endpoint for external integrations
   - Validates date range (must be < 24 hours between `date_from` and `date_to`)
   - Returns transformed data with additional fields: `date`, `time`, `raw`
   - Located in `src/app/api/exchange-rate/route.ts`

3. **Server Action** (`fetchTRMI`):
   - Reusable server action in `src/app/actions.ts`
   - Same date validation as API route
   - Returns typed response: `{ success: boolean, data?: any, error?: string }`

### API Response Transformation

El Toque API returns data in this structure:

```typescript
// Raw API response
{
  tasas: {
    USD: 442.0,
    ECU: 500.0,  // Note: ECU is used for EUR
    MLC: 210.0,
    USDT_TRC20: 495.0,
    BTC: 470.0,
    // ... other currencies
  },
  date: "2025-10-04",
  hour: 10,
  minutes: 34,
  seconds: 15
}

// Transformed format (used throughout the app)
{
  usd: 442.0,
  eur: 500.0,  // Mapped from ECU
  mlc: 210.0,
  date: "2025-10-04",
  time: "10:34:15",
  raw: { /* original response */ }
}
```

**Important**: The API uses `ECU` for Euro rates, which we map to `eur` in our interface.

### Date Range Validation

**Critical constraint**: El Toque API requires that `date_from` and `date_to` differ by **less than 24 hours**. Both the API route and server action validate this before making requests.

### Page Structure

- **Main Page** (`src/app/page.tsx`):
  - Server component that fetches and displays exchange rates in three cards (USD, EUR, MLC)
  - Responsive grid layout (3 columns on desktop, 1 on mobile)
  - Includes disclaimers that rates are referential only
  - Footer with author attribution and link to reinierhernandez.com
  - Structured data (JSON-LD) for SEO

## Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4.1
- **Fonts**: Geist Sans & Geist Mono (optimized with next/font)
- **Package Manager**: pnpm 10.18.0
- **TypeScript**: 5.9.3

## Code Style

- Use Prettier for all formatting (enforced via pre-commit or manual runs)
- ESLint with Next.js config for linting
- Server components by default (App Router)
- Server actions with 'use server' directive for data mutations

## Release Strategy

This project uses a **rolling release model**. All changes are merged to `main` and deployed immediately. There are no versioned releases - users should always use the latest version from the main branch.

## SEO & Metadata

The app includes comprehensive SEO optimization:

- **Open Graph**: Full metadata for social sharing (Facebook, LinkedIn)
- **Twitter Cards**: `summary_large_image` with custom image
- **Dynamic OG Image**: Generated via `opengraph-image.tsx` using Next.js edge runtime
- **PWA Manifest**: `manifest.ts` for installable app support
- **Sitemap**: Dynamic sitemap at `/sitemap.xml` with hourly change frequency
- **Favicons**: Multiple sizes generated from logo (16x16, 32x32, 192x192, 512x512, Apple touch icon)
- **Structured Data**: JSON-LD schema for `WebApplication` type

**Important URLs**:

- OG Image: `/opengraph-image` (auto-generated, not `/og-image.png`)
- Favicon: Dynamically generated via `icon.tsx`

## Assets

- **Logo**: `logo-tarifa-cambio.png` in root (source file)
- **Generated Icons**: All in `public/` (favicon-_.png, icon-_.png, apple-touch-icon.png)
- **Screenshots**: Reference `public/screenshot-desktop.png` in README (placeholder)

## Deployment Notes

- **Platform**: Vercel (recommended)
- **Environment Variables**: `EL_TOQUE_API_TOKEN` (required for production)
- **Base URL**: `https://tasa-cambio-cuba.vercel.app`
- **Edge Runtime Warning**: `icon.tsx` and `opengraph-image.tsx` use edge runtime (disables static generation for those routes - this is expected)

## Project Documentation

- **README.md**: Comprehensive user documentation with Spanish language, API examples, deployment instructions
- **CONTRIBUTING.md**: Contributor guidelines including workflow, code standards, and feature ideas
- **SECURITY.md**: Security policy (rolling release model, no versioning)
- **GitHub Templates**: Issue templates (bug, feature, docs, question) and PR template in `.github/`

## Important Constraints

1. **Date Range**: API calls with `date_from` and `date_to` must have < 24 hours difference
2. **Cache**: 1-hour revalidation on all API calls (via Next.js `revalidate: 3600`)
3. **Currency Mapping**: El Toque uses `ECU` for Euro, we map it to `EUR`/`eur`
4. **Mock Data**: App falls back to mock rates (USD: 400, EUR: 500, MLC: 200) if API fails
5. **Referential Rates**: All UI includes disclaimers that rates are informational only
