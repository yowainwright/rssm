# rssm 

> React Simple Schema State Machine

A lightweight, type-safe state management solution for React applications with built-in localStorage persistence, schema validation, logging capabilities, and a powerful CLI generator.

## Features

- 🔧 **Generic State Management** - Works with any data type using TypeScript generics
- 💾 **Automatic Persistence** - Built-in localStorage support with encryption and TTL options
- ✅ **Schema Validation** - Validates data against Zod schemas (warns but doesn't fail)
- 📝 **Logging Support** - Optional logging with custom logger support
- 🎯 **CRUD Operations** - Standard Create, Read, Update, Destroy actions
- 🔄 **Loading & Error States** - Built-in loading and error state management
- 🚀 **Lightweight** - Minimal dependencies and small bundle size
- 🛠️ **CLI Generator** - Beautiful CLI tool for generating state management components
- 🎨 **Demo App** - Full-featured demo application with shadcn UI

## Installation

```bash
npm install rsssm
```

### Peer Dependencies

Rssm requires the following peer dependencies:
- `react` (>=16)
- `react-dom` (>=16)
- `zod` (>=3)

## Basic Usage

### 1. Define your schema and type

```tsx
import { z } from 'zod';
import { createRssm } from 'rssm';

// Define your data schema
const organizationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  createdAt: z.string().optional(),
});

// Infer the TypeScript type
type Organization = z.infer<typeof organizationSchema>;
```

### 2. Create your state machine

```tsx
// Create the rssm
const { RssmProvider, useRssm } = createRssm<Organization>('OrgState');

// Export for use in other components
export { RssmProvider as OrgStateProvider, useRssm as useOrgState };
```

### 3. Wrap your app with the provider

```tsx
function App() {
  return (
    <OrgStateProvider 
      schema={organizationSchema}
      name="orgState"
    >
      <YourComponents />
    </OrgStateProvider>
  );
}
```

### 4. Use the hook in your components

```tsx
function OrganizationSelector() {
  const { data, loading, error, actions } = useOrgState();

  // Load organization data
  const loadOrganization = async (orgId: string) => {
    actions.setLoading(true);
    try {
      const org = await fetchOrganization(orgId);
      actions.read(org);
    } catch (err) {
      actions.setError(err.message);
    }
  };

  // Update organization
  const updateOrgName = (newName: string) => {
    actions.update({ name: newName });
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!data) return <EmptyState />;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => updateOrgName('New Name')}>
        Update Name
      </button>
    </div>
  );
}
```

## Provider Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `schema` | `z.ZodSchema<T>` | ✅ | - | Zod schema for validating the state data |
| `name` | `string` | ✅ | - | Unique name for the state (used as localStorage key) |
| `children` | `ReactNode` | ✅ | - | Child components |
| `initialData` | `T \| null` | ❌ | `null` | Initial data to populate the state |
| `persist` | `boolean` | ❌ | `true` | Whether to persist state to localStorage |
| `ttl` | `number \| null` | ❌ | `null` | Time-to-live in seconds for localStorage |
| `encrypt` | `boolean` | ❌ | `false` | Whether to encrypt data in localStorage |
| `logging` | `boolean` | ❌ | `false` | Whether to enable logging |
| `logger` | `Logger` | ❌ | `console` | Custom logger implementation |

## Hook Return Value

The `useRssm` hook returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T \| null` | The current state data |
| `loading` | `boolean` | Loading state indicator |
| `error` | `string \| null` | Error message if any |
| `actions` | `RssmActions<T>` | Object containing all state actions |

### Actions

| Action | Type | Description |
|--------|------|-------------|
| `create(data)` | `(data: T) => void` | Create/set new data |
| `read(data)` | `(data: T) => void` | Read/set data (alias for create) |
| `update(partial)` | `(partial: Partial<T>) => void` | Update existing data partially |
| `destroy()` | `() => void` | Clear data and remove from localStorage |
| `setLoading(loading)` | `(loading: boolean) => void` | Set loading state |
| `setError(error)` | `(error: string \| null) => void` | Set error state |
| `reset()` | `() => void` | Reset to initial state |

## Advanced Examples

### With Initial Data and Persistence Options

```tsx
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }),
});

type User = z.infer<typeof userSchema>;

const { RssmProvider, useRssm } = createRssm<User>('UserState');

function App() {
  const initialUser: User = {
    id: 'default',
    email: 'user@example.com',
    name: 'Guest User',
    preferences: {
      theme: 'light',
      notifications: true,
    },
  };

  return (
    <RssmProvider
      schema={userSchema}
      name="userState"
      initialData={initialUser}
      persist={true}
      ttl={3600} // 1 hour
      encrypt={true} // Encrypt sensitive user data
    >
      <UserProfile />
    </RssmProvider>
  );
}
```

### With Custom Logger

```tsx
const customLogger = {
  info: (message: string, ...args: any[]) => {
    // Send to logging service
    logService.info(message, args);
  },
  warn: (message: string, ...args: any[]) => {
    logService.warn(message, args);
  },
  error: (message: string, ...args: any[]) => {
    logService.error(message, args);
    // Also send to error tracking
    errorTracker.captureMessage(message, { extra: args });
  },
};

<SiteStateProvider
  schema={siteSchema}
  name="siteState"
  logging={true}
  logger={customLogger}
>
  {children}
</SiteStateProvider>
```

### Multiple State Machines

```tsx
// Create multiple rssm instances
const { 
  RssmProvider: OrgProvider, 
  useRssm: useOrgState 
} = createRssm<Organization>('OrgState');

const { 
  RssmProvider: SiteProvider, 
  useRssm: useSiteState 
} = createRssm<Site>('SiteState');

const { 
  RssmProvider: UserProvider, 
  useRssm: useUserState 
} = createRssm<User>('UserState');

// Combine providers
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <OrgProvider schema={orgSchema} name="orgState">
      <SiteProvider schema={siteSchema} name="siteState">
        <UserProvider schema={userSchema} name="userState">
          {children}
        </UserProvider>
      </SiteProvider>
    </OrgProvider>
  );
}

// Use in components
function Dashboard() {
  const { data: org } = useOrgState();
  const { data: site } = useSiteState();
  const { data: user } = useUserState();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <h2>{org?.name} - {site?.name}</h2>
    </div>
  );
}
```

### With Async Operations

```tsx
function useOrganizationManager() {
  const { data, loading, error, actions } = useOrgState();

  const loadOrganization = async (orgId: string) => {
    actions.setLoading(true);
    actions.setError(null);
    
    try {
      const response = await api.getOrganization(orgId);
      actions.read(response.data);
    } catch (err) {
      actions.setError(err.message);
    }
  };

  const updateOrganization = async (updates: Partial<Organization>) => {
    actions.setLoading(true);
    
    try {
      const response = await api.updateOrganization(data!.id, updates);
      actions.update(response.data);
    } catch (err) {
      actions.setError(err.message);
      // Revert optimistic update if needed
    }
  };

  const deleteOrganization = async () => {
    actions.setLoading(true);
    
    try {
      await api.deleteOrganization(data!.id);
      actions.destroy();
    } catch (err) {
      actions.setError(err.message);
    }
  };

  return {
    organization: data,
    loading,
    error,
    loadOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
```

## Schema Validation

Rssm validates data against the provided Zod schema but **does not fail** if validation fails. Instead, it:

1. Logs a warning (if logging is enabled)
2. Uses the unvalidated data

This approach ensures your app doesn't break due to schema mismatches while still alerting you to potential issues.

```tsx
const strictSchema = z.object({
  id: z.string().uuid(),
  count: z.number().positive(),
});

// This will warn but still work
actions.create({ 
  id: 'not-a-uuid', // Invalid UUID
  count: -5 // Negative number
});
```

## localStorage Behavior

When `persist` is `true` (default):

- State is automatically saved to localStorage on every change
- State is loaded from localStorage on initialization
- `DESTROY` and `RESET` actions remove the data from localStorage
- Supports TTL (time-to-live) for automatic expiration
- Supports encryption for sensitive data

## Best Practices

1. **Name your state machines descriptively**: Use names like `orgState`, `siteState`, `userPreferences`
2. **Define schemas strictly**: Even though validation doesn't fail, strict schemas help catch issues
3. **Handle errors appropriately**: Always check and handle the `error` state in your UI
4. **Use loading states**: Show appropriate UI feedback during async operations
5. **Combine with React Query**: For server state, combine Rssm with React Query:

```tsx
function useOrganizationWithCache() {
  const { actions } = useOrgState();
  
  return useQuery({
    queryKey: ['organization', orgId],
    queryFn: fetchOrganization,
    onSuccess: (data) => {
      actions.read(data); // Cache in Rssm
    },
  });
}
```

## TypeScript Support

Rssm is fully typed and provides excellent TypeScript support:

```tsx
// Type is inferred from schema
const { data } = useOrgState();
// data is typed as: Organization | null

// Update accepts Partial<Organization>
actions.update({ name: 'New Name' }); // ✅
actions.update({ invalid: 'field' }); // ❌ TypeScript error

// Create/Read require full Organization object
actions.create({ id: '1' }); // ❌ TypeScript error - missing required fields
```

## CLI Generator

Rssm includes a powerful CLI tool for generating state management components with beautiful terminal UI:

```bash
# Interactive mode
npx create-rssm init

# With options
npx create-rssm init \
  --name UserState \
  --schema '{"name": "string", "age": "number"}' \
  --persist \
  --encrypt \
  --ttl 3600

# View examples
npx create-rssm example
```

### CLI Features

- 🎨 Beautiful terminal UI with syntax highlighting
- 📋 Interactive prompts for easy configuration
- 🔧 Generate from JSON schemas or schema files
- 💾 Configure persistence, encryption, and TTL
- 📝 TypeScript and JavaScript support
- 🚀 Generates both component and example code

## Demo Application

Explore Rssm features with our demo application:

```bash
# Clone the repository
git clone https://github.com/yowainwright/rssm.git
cd rssm

# Install dependencies
bun install

# Build the library
bun run build:lib

# Run the demo
bun run dev:demo
```

The demo showcases:
- User preferences with theme switching
- Todo list with CRUD operations
- Encrypted data storage
- TTL (time-to-live) functionality
- Real-time state synchronization

## Development

```bash
# Install dependencies
bun install

# Build everything
bun run build

# Run tests
bun test

# Development mode
bun run dev

# Run the demo
bun run dev:demo

# Develop the CLI
bun run dev:cli
```

## License

MIT