# RSSM CLI Tests

This directory contains tests for the RSSM CLI.

## Test Structure

- **`cli.test.ts`** - End-to-end tests for CLI commands
  - Tests help commands
  - Tests version display
  - Tests the example command
- **`integration.test.ts`** - Integration tests for CLI functionality
  - Tests schema parsing
  - Tests component generation
  - Tests file creation

## Running Tests

```bash
# Run all CLI tests
bun test cli/test

# Run a specific test file
bun test cli/test/cli.test.ts

# Watch mode
bun test --watch cli/test
```

## Test Coverage

The tests cover:

1. **Schema Parser**
   - Simple JSON schema parsing
   - Array schema handling
   - Nested object schemas
   - Date type conversion
   - File input parsing
   - Error handling

2. **Component Generator**
   - TypeScript component generation
   - JavaScript component generation
   - Configuration options (persist, logging, encrypt, TTL)
   - Directory creation
   - File output

3. **CLI Commands**
   - Help display
   - Version information
   - Example usage
   - Command validation

## Writing New Tests

When adding new CLI features, ensure you:

1. Add unit tests for the feature logic in `integration.test.ts`
2. Add CLI command tests in `cli.test.ts` if new commands are added
3. Test both success and error cases
4. Clean up test files in `afterEach` hooks
