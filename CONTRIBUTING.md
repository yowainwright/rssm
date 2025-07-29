# Contributing to rssm

First off, thank you for considering contributing to Rssm! It's people like you that make Rssm such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the [Rssm Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include code samples and stack traces if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript styleguide
- Include thoughtfully-worded, well-structured tests
- Document new code
- End all files with a newline

## Development Process

1. Fork the repo and create your branch from `main`
2. Run `bun install` to install dependencies
3. Make your changes
4. Add tests for any new functionality
5. Ensure the test suite passes with `bun test`
6. Run `bun run lint` to ensure code style
7. Run `bun run build` to ensure everything builds
8. Push to your fork and submit a pull request

### Local Development

```bash
# Install dependencies
bun install

# Run the library in watch mode
bun run dev

# Run the documentation site
bun run dev:site

# Run the CLI in development
bun run dev:cli

# Run tests
bun test

# Run tests in watch mode
bun test:watch

# Build everything
bun run build

# Lint code
bun run lint

# Format code
bun run format
```

### Project Structure

```
rssm/
├── src/           # Core library source
├── cli/           # CLI tool source
├── site/          # Documentation website
├── examples/      # Example usage
└── tests/         # Test files
```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use TypeScript for all new code
- Prefer explicit types over implicit
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Follow the existing code style

### Testing

- Write tests for all new functionality
- Ensure all tests pass before submitting PR
- Aim for high code coverage
- Test edge cases

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Recognition

Contributors who submit accepted pull requests will be added to the README contributors section.

Thank you for contributing! 🎉
