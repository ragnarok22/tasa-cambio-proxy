# Security Policy

## Supported Versions

This project uses a rolling release model. Security patches are applied directly to the `main` branch and deployed immediately. We recommend always using the latest version from the main branch.

## Reporting a Vulnerability

We take the security of Tasa de Cambio - Cuba seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please **do not** open a public GitHub issue for security vulnerabilities. This could put users at risk before a fix is available.

### 2. Report Privately

Send a detailed report to the repository maintainer:

- **Contact**: Create a private security advisory on GitHub
  - Go to [Security Advisories](https://github.com/ragnarok22/tasa-cambio-proxy/security/advisories)
  - Click "Report a vulnerability"

Or alternatively, open a private issue describing:

- The type of vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### 3. What to Include

A good vulnerability report includes:

- **Description**: Clear explanation of the vulnerability
- **Impact**: What can an attacker accomplish?
- **Reproduction**: Step-by-step instructions to reproduce
- **Environment**: Browser, OS, Node.js version, etc.
- **Proof of Concept**: Code snippet or screenshots (if applicable)
- **Suggested Fix**: Your ideas on how to fix it (optional)

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**

   ```bash
   pnpm update
   ```

2. **Secure API Tokens**
   - Never commit `.env.local` or `.env` files
   - Use strong, unique API tokens
   - Rotate tokens regularly

3. **Production Deployment**
   - Use environment variables for secrets
   - Enable HTTPS only
   - Set appropriate CORS policies

### For Contributors

1. **Never Commit Secrets**
   - Check `.gitignore` includes `.env.local`, `.env`
   - Use `git secrets` or similar tools
   - Review diffs before committing

2. **Dependency Security**
   - Run `pnpm audit` regularly
   - Update dependencies promptly
   - Review security advisories

3. **Code Review**
   - Validate all user inputs
   - Sanitize data before rendering
   - Use parameterized queries
   - Avoid `eval()` and similar dangerous functions

4. **API Security**
   - Validate environment variables
   - Handle API errors gracefully
   - Don't expose sensitive error details to users
   - Implement rate limiting where appropriate

## Known Security Considerations

### API Token Exposure

- **Risk**: The `EL_TOQUE_API_TOKEN` is used server-side only
- **Mitigation**: Never expose this token in client-side code or commits
- **Status**: ✅ Token is properly secured in environment variables

### External API Dependency

- **Risk**: The app relies on El Toque's API
- **Mitigation**:
  - API calls are made server-side only
  - Fallback to mock data on API failure
  - 1-hour caching reduces API exposure
- **Status**: ✅ Properly implemented

### Cross-Site Scripting (XSS)

- **Risk**: User data could be injected if inputs are added
- **Mitigation**:
  - React automatically escapes values
  - No user inputs currently in the app
  - Future inputs should use proper sanitization
- **Status**: ✅ No current risk

## Security Updates

Security updates will be released as patch versions and announced via:

- GitHub Security Advisories
- Release notes
- README notifications (for critical issues)

## Acknowledgments

We appreciate security researchers and users who report vulnerabilities responsibly. Contributors will be acknowledged in release notes (unless they prefer to remain anonymous).

## Questions?

If you have questions about security but haven't found a vulnerability, feel free to:

- Open a regular GitHub issue
- Start a discussion in GitHub Discussions

Thank you for helping keep Tasa de Cambio - Cuba secure!
