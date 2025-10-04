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

The app uses two approaches for fetching exchange rate data:

1. **API Route** (`/api/exchange-rate`):
   - Server-side route handler that acts as a proxy to El Toque's API
   - Located in `src/app/api/exchange-rate/route.ts`
   - Includes 1-hour cache revalidation
   - Falls back to mock data if API fails (lines 38-42)
   - Accepts optional `date_from` and `date_to` query parameters

2. **Server Action** (`fetchTRMI`):
   - Located in `src/app/actions.ts`
   - Server action for fetching TRMI data with optional date filtering
   - Returns typed response with success/error handling
   - Also includes 1-hour cache revalidation

### Page Structure

- **Main Page** (`src/app/page.tsx`):
  - Server component that fetches and displays exchange rates in three cards
  - Cards show USD, EUR, and MLC rates against Cuban Peso (CUP)
  - Responsive grid layout (3 columns on desktop, 1 on mobile)
  - Uses Tailwind CSS for styling with gradient backgrounds and hover effects

### API Response Format

The El Toque API returns exchange rate data in this format:

```typescript
{
  usd: number,  // USD to CUP exchange rate
  eur: number,  // EUR to CUP exchange rate
  mlc: number   // MLC to CUP exchange rate
}
```

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

## Project Documentation

- **README.md**: User-facing documentation with setup, deployment, and API information
- **CONTRIBUTING.md**: Guidelines for contributors including workflow, code standards, and feature ideas
- **SECURITY.md**: Security policy and vulnerability reporting process
- **GitHub Templates**: Issue and PR templates located in `.github/`
