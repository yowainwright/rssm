# rssm CLI

A beautiful command-line interface for generating React Simple Schema State Machine (Rssm) components with type-safe state management.

## Features

- 🎨 **Beautiful Terminal UI** - Syntax-highlighted code snippets with boxed output
- 🚀 **Interactive Prompts** - Guided setup with intelligent defaults
- 📝 **Schema Generation** - Convert JSON schemas to Zod schemas automatically
- 🔧 **Flexible Configuration** - Support for persistence, encryption, TTL, and logging
- 📦 **Complete Output** - Generates both component and example usage files
- 🌈 **Visual Feedback** - Colorful output with progress spinners and ASCII art

## Installation

The CLI is included with the `rssm` package:

```bash
npm install rssm
# or
yarn add rssm
# or
bun add rssm
```

## Usage

### Interactive Mode

Run the CLI without options for an interactive experience:

```bash
npx rssm create
```

You'll be prompted for:

- Component name
- JSON schema (inline or file path)
- Persistence settings
- Encryption options
- TTL (time-to-live)
- Output directory

### Command Line Options

Skip prompts by providing options directly:

```bash
npx rssm create \
  --name UserState \
  --schema '{"name": "string", "email": "string"}' \
  --persist \
  --encrypt \
  --logging \
  --ttl 3600 \
  --output ./src/state
```

#### Available Options

| Option              | Alias | Description              | Default            |
| ------------------- | ----- | ------------------------ | ------------------ |
| `--name <name>`     | `-n`  | State machine name       | Interactive prompt |
| `--schema <schema>` | `-s`  | JSON schema or file path | Interactive prompt |
| `--typescript`      | `-t`  | Generate TypeScript      | `true`             |
| `--persist`         | `-p`  | Enable localStorage      | `true`             |
| `--logging`         | `-l`  | Enable logging           | `false`            |
| `--encrypt`         | `-e`  | Enable encryption        | `false`            |
| `--ttl <seconds>`   |       | Time-to-live in seconds  | None               |
| `--output <path>`   | `-o`  | Output directory         | `./src/state`      |

### View Examples

See example usage patterns:

```bash
npx rssm example
```

## Code Generation

The CLI generates beautiful, syntax-highlighted code snippets in your terminal:

### Component Preview

The CLI shows a preview of the generated component with proper syntax highlighting:

```typescript
import { z } from "zod";
import { createRssm } from "rssm";

// Your schema definition
const userStateSchema = z.object({
  name: z.string(),
  email: z.string(),
});

// ... rest of component
```

### Generated Files

1. **Component File** (`<name>.tsx`)
   - Fully configured Rssm provider
   - Exported hooks for easy usage
   - TypeScript types included

2. **Example File** (`<name>.example.tsx`)
   - Complete usage example
   - Demonstrates all CRUD operations
   - Ready-to-run demo component

## Examples

### Basic User Preferences

```bash
npx rssm create \
  --name UserPreferences \
  --schema '{"theme": "string", "language": "string", "notifications": "boolean"}'
```

### Todo List with TTL

```bash
npx rssm create \
  --name TodoList \
  --schema '[{"id": "string", "text": "string", "completed": "boolean"}]' \
  --ttl 86400
```

### Secure User Data

```bash
npx rssm create \
  --name UserData \
  --schema '{"id": "string", "email": "string", "profile": {"name": "string", "avatar": "string"}}' \
  --encrypt \
  --logging
```

### Using a Schema File

```bash
npx rssm create \
  --name AppState \
  --schema ./schemas/app-state.json
```

## Schema File Format

You can provide schemas as JSON files:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "profile": {
      "name": "string",
      "avatar": "string",
      "preferences": {
        "theme": "string",
        "notifications": "boolean"
      }
    }
  },
  "lastLogin": "string"
}
```

## Visual Features

### ASCII Art Banner

```
 ____  ____ ____ __  __
|  _ \/ ___/ ___||  \/  |
| |_) \___ \___ \| |\/| |
|  _ < ___) |__) | |  | |
|_| \_\____/____/|_|  |_|

React Simple Schema State Machine CLI
```

### Progress Indicators

- ✨ Ora spinners for async operations
- ✅ Success messages with green checkmarks
- ❌ Clear error messages with helpful hints

### Boxed Output

- Configuration summaries in bordered boxes
- Code snippets with syntax highlighting
- Success messages with decorative borders

## Tips

1. **Complex Schemas**: Use a JSON file for complex nested schemas
2. **Quick Generation**: Use command-line options to skip all prompts
3. **TypeScript**: Generated code includes full TypeScript support by default
4. **Validation**: The CLI validates your schema before generation

## Future Commands

### Update (Coming Soon)

```bash
npx rssm update
```

This will allow you to:

- Update existing state machines with new schema fields
- Change configuration options (persistence, encryption, etc.)
- Migrate from older versions of Rssm

## Development

The CLI is built with:

- [Commander.js](https://github.com/tj/commander.js/) - Command-line interface
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Ora](https://github.com/sindresorhus/ora) - Elegant spinners
- [Boxen](https://github.com/sindresorhus/boxen) - Bordered boxes
- [cli-highlight](https://github.com/felixfbecker/cli-highlight) - Syntax highlighting
- [Figlet](https://github.com/patorjk/figlet.js/) - ASCII art
- [Gradient String](https://github.com/bokub/gradient-string) - Gradient text

## License

MIT
