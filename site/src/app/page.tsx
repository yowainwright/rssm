import { InteractiveDemo } from "@/components/interactive-demo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const documentation = `
## Installation

\`\`\`bash
npm install rssm zod react
# or
yarn add rssm zod react
# or
bun add rssm zod react
\`\`\`

## Quick Start

### 1. Define your schema

\`\`\`typescript
import { z } from 'zod';
import { createRssm } from 'rssm';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  active: z.boolean(),
});

type User = z.infer<typeof userSchema>;
\`\`\`

### 2. Create your state machine

\`\`\`typescript
const { RssmProvider, useRssm } = createRssm<User>('userState');
\`\`\`

### 3. Wrap your app

\`\`\`typescript
function App() {
  return (
    <RssmProvider schema={userSchema} name="userState">
      <YourComponent />
    </RssmProvider>
  );
}
\`\`\`

### 4. Use in components

\`\`\`typescript
function UserProfile() {
  const { data, loading, error, actions } = useRssm();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No user data</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <button onClick={() => actions.update({ active: !data.active })}>
        Toggle Active
      </button>
    </div>
  );
}
\`\`\`

## API Reference

### \`createRssm<T>(name: string)\`

Creates a new Rssm instance with TypeScript support.

**Parameters:**
- \`name\`: Unique identifier for the state machine

**Returns:**
- \`RssmProvider\`: React Provider component
- \`useRssm\`: React Hook for accessing state

### Provider Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| \`schema\` | \`ZodSchema<T>\` | ✅ | - | Zod schema for validation |
| \`name\` | \`string\` | ✅ | - | Unique name for localStorage key |
| \`children\` | \`ReactNode\` | ✅ | - | Child components |
| \`initialData\` | \`T \\| null\` | ❌ | \`null\` | Initial state data |
| \`persist\` | \`boolean\` | ❌ | \`true\` | Enable localStorage |
| \`ttl\` | \`number\` | ❌ | - | Time-to-live in seconds |
| \`encrypt\` | \`boolean\` | ❌ | \`false\` | Encrypt stored data |
| \`logging\` | \`boolean\` | ❌ | \`false\` | Enable console logging |

### Hook Return Value

The \`useRssm\` hook returns:

\`\`\`typescript
{
  data: T | null;        // Current state data
  loading: boolean;      // Loading indicator
  error: string | null;  // Error message
  actions: {
    create: (data: T) => void;
    read: (data: T) => void;
    update: (partial: Partial<T>) => void;
    destroy: () => void;
    reset: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}
\`\`\`

## Features

### 🔒 Encryption

Enable encryption for sensitive data:

\`\`\`typescript
<RssmProvider
  schema={schema}
  name="secure"
  encrypt={true}
>
  {children}
</RssmProvider>
\`\`\`

### ⏰ TTL (Time-to-Live)

Auto-expire data after specified seconds:

\`\`\`typescript
<RssmProvider
  schema={schema}
  name="temporary"
  ttl={3600} // 1 hour
>
  {children}
</RssmProvider>
\`\`\`

### 📝 Logging

Enable debug logging:

\`\`\`typescript
<RssmProvider
  schema={schema}
  name="debug"
  logging={true}
>
  {children}
</RssmProvider>
\`\`\`

## CLI Tool

Rssm includes a powerful CLI for generating components:

\`\`\`bash
# Interactive mode
npx rssm create

# With options
npx rssm create \\
  --name UserState \\
  --schema '{"name": "string", "email": "string"}' \\
  --persist \\
  --encrypt
\`\`\`

## TypeScript Support

Rssm is fully typed with TypeScript:

\`\`\`typescript
// Type is inferred from schema
const { data } = useRssm();
// data is typed as: User | null

// Update accepts Partial<User>
actions.update({ name: 'New Name' }); // ✅
actions.update({ invalid: 'field' }); // ❌ TypeScript error
\`\`\`

## Best Practices

1. **Unique Names**: Always use unique names for each state machine
2. **Schema Validation**: Define strict schemas for data integrity
3. **Error Handling**: Always handle the error state in your UI
4. **Loading States**: Show appropriate feedback during async operations
5. **Security**: Use encryption for sensitive data

## License

MIT © [Your Name]
`;

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">RSSM</h1>
          <p className="mt-2 text-xl text-muted-foreground">
            React Simple Schema State Machine - Type-safe state management with Zod validation
          </p>
        </div>
      </header>

      {/* Interactive Demo */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="mb-8 text-3xl font-bold">Interactive Demo</h2>
          <p className="mb-8 text-muted-foreground">
            Try out Rssm with this interactive demo. Modify the form fields and click the CRUD buttons to see how the state changes in real-time.
          </p>
          <InteractiveDemo />
        </div>
      </section>

      {/* Documentation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {documentation}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ using React, TypeScript, and Zod
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="https://github.com/yowainwright/rssm"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/rssm"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}