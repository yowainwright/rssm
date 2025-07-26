# RSSM Project Rules and Context

## Release Strategy
- **Single Package Release**: Only publish the `rssm` package to npm
- The `rssm` package already includes the CLI (via `bin` field pointing to `./cli/bin/rssm.js`)
- Do NOT create separate releases for `rssm-cli` or `rssm-site`

## CI/CD Requirements (To be implemented when ready)
When setting up the release workflow:
1. The release of `rssm` package should trigger GitHub Pages deployment
2. The site (in `/site` directory) should be built and deployed to GitHub Pages
3. Use a single GitHub Actions workflow that:
   - Publishes `rssm` to npm
   - Builds the site
   - Deploys to GitHub Pages

## Project Structure
- Monorepo with three parts:
  - `/src` - Main rssm library
  - `/cli` - CLI tool (bundled with main package)
  - `/site` - Documentation site (deployed to GitHub Pages)
- Maintain local separation but publish as one unified package

## Development Commands
- `bun run build` - Builds both library and CLI
- `bun run dev:site` - Runs the documentation site locally
- `bun run lint` - Runs oxlint on all source directories
- `bun run test` - Runs tests