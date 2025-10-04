# Contributing to Tasa de Cambio - Cuba

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Be respectful and constructive in all interactions. We're all here to improve this project together.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/tasa-cambio-proxy.git
cd tasa-cambio-proxy

# Add upstream remote
git remote add upstream https://github.com/ragnarok22/tasa-cambio-proxy.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment

```bash
cp .env.example .env.local
# Add your EL_TOQUE_API_TOKEN to .env.local
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Running the App

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Code Quality

Before committing, ensure your code passes all quality checks:

```bash
# Format code
pnpm prettier

# Check formatting
pnpm prettier:check

# Lint code
pnpm lint

# Build to verify no errors
pnpm build
```

### Making Changes

1. **Keep commits focused** - Each commit should represent a single logical change
2. **Write clear commit messages**:

   ```
   feat: add historical data chart component
   fix: handle missing API token gracefully
   docs: update installation instructions
   style: format code with prettier
   refactor: extract exchange rate card to component
   ```

3. **Test your changes** - Verify the app works correctly in development and production builds

## Pull Request Process

### 1. Update Your Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to [https://github.com/ragnarok22/tasa-cambio-proxy](https://github.com/ragnarok22/tasa-cambio-proxy)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template with:
   - **Description**: What does this PR do?
   - **Motivation**: Why is this change needed?
   - **Testing**: How did you test this?
   - **Screenshots**: If UI changes, include before/after screenshots

### 4. Code Review

- Address review feedback promptly
- Push new commits to the same branch
- Use `git commit --fixup` for small fixes to previous commits

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── exchange-rate/
│   │       └── route.ts          # API route handlers
│   ├── actions.ts                # Server actions
│   ├── page.tsx                  # Page components
│   ├── layout.tsx                # Layout components
│   └── globals.css               # Global styles
```

## Coding Standards

### TypeScript

- Use strict TypeScript - no `any` types unless absolutely necessary
- Define interfaces for all data structures
- Export types from the same file where they're defined

### React/Next.js

- Use Server Components by default
- Use Client Components (`'use client'`) only when needed (interactivity, hooks)
- Prefer Server Actions over API routes for mutations
- Keep components small and focused

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and color schemes
- Use semantic color names from the Tailwind palette

### File Naming

- Use kebab-case for files: `exchange-rate-card.tsx`
- Use PascalCase for components: `ExchangeRateCard`
- Use camelCase for functions and variables: `fetchExchangeRate`

## What to Contribute

### Good First Issues

- Improve documentation
- Add tests
- Fix typos or formatting
- Enhance error messages
- Improve accessibility

### Feature Ideas

- Historical data visualization (charts/graphs)
- Currency conversion calculator
- Multiple language support (ES/EN)
- Dark mode toggle
- PWA support for offline access
- Share exchange rate as image
- Notifications for rate changes

### Bug Fixes

- Report bugs via GitHub Issues first
- Include reproduction steps
- Mention your environment (OS, browser, Node version)

## Questions?

- Open an issue for discussion
- Check existing issues and PRs first
- Be patient and respectful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
