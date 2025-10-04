# Tasa de Cambio - Cuba

A Next.js application that displays real-time Cuban currency exchange rates (USD, EUR, MLC) from El Toque's TRMI (Tasa Representativa del Mercado Informal) API.

> **Note:** Exchange rates displayed are for informational purposes only and should be used as a reference. Actual rates may vary in real transactions.

## Features

- 🇨🇺 Real-time exchange rates for USD, EUR, and MLC to Cuban Peso (CUP)
- 📊 Clean, responsive card-based UI
- ⚡ Server-side rendering with 1-hour cache for optimal performance
- 🎨 Modern design with Tailwind CSS
- 🔄 Automatic fallback to mock data if API is unavailable

## Prerequisites

- Node.js 18+
- pnpm 10.18.0+ (recommended)
- El Toque API token

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/ragnarok22/tasa-cambio-proxy.git
cd tasa-cambio-proxy
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your El Toque API token:

```
EL_TOQUE_API_TOKEN=your_actual_token_here
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `pnpm dev`            | Start development server with Turbopack |
| `pnpm build`          | Build for production                    |
| `pnpm start`          | Start production server                 |
| `pnpm lint`           | Run ESLint                              |
| `pnpm prettier`       | Format code with Prettier               |
| `pnpm prettier:check` | Check code formatting                   |

## API Endpoints

### GET `/api/exchange-rate`

Fetches current exchange rates from El Toque API.

**Query Parameters:**

- `date_from` (optional): Start date for historical data (YYYY-MM-DD)
- `date_to` (optional): End date for historical data (YYYY-MM-DD)

**Response:**

```json
{
  "usd": 400,
  "eur": 500,
  "mlc": 200
}
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **React**: 19.2
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **TypeScript**: 5.9
- **Fonts**: Geist Sans & Geist Mono
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── exchange-rate/
│   │       └── route.ts          # API proxy endpoint
│   ├── actions.ts                # Server actions
│   ├── page.tsx                  # Main page with exchange rate cards
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
```

## Deployment

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ragnarok22/tasa-cambio-proxy)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add `EL_TOQUE_API_TOKEN` to environment variables
4. Deploy

### Deploy Anywhere

This is a standard Next.js application and can be deployed to any platform that supports Node.js:

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

Make sure to set the `EL_TOQUE_API_TOKEN` environment variable in your hosting platform.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `pnpm prettier` and `pnpm lint`
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Security

Please review our [Security Policy](SECURITY.md) for information on reporting vulnerabilities.

## License

MIT - See [LICENSE](LICENSE) file for details.

## Acknowledgments

- Exchange rate data provided by [El Toque](https://eltoque.com)
- Built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)
