# rssm

> **r**eact **s**chema **s**tate **m**achine

A lightweight, type-safe state management solution for React applications with localStorage persistence, schema validation, logging capabilities, and a powerful CLI generator.

## Why rssm?

If you're familiar with react context, don't need redux yet, and want a simple schema based state solution with CRUD baked in, rssm is for you.

> And if you use rssm and it is NOT for you, it should be a simple pull request to switch fully to React Context or Redux!

## Features

- 🔧 **Generic State Management** - Works with any data type using TypeScript generics
- 💾 **Automatic Persistence** - LocalStorage support with encryption and TTL options
- ✅ **Schema Validation** - Validates data against Zod schemas (warns but doesn't fail)
- 📝 **Logging Support** - Optional logging with custom logger support
- 🎯 **CRUD Operations** - Standard Create, Read, Update, Destroy actions
- 🔄 **Loading & Error States** - Built-in loading and error state management
- 🚀 **Lightweight** - Small bundle size
- 🛠️ **CLI Generator** - CLI tool for generating state management components
- 🎨 **Demo App** - Full-featured demo application with shadcn UI

## Installation

```bash
npm install rssm
```

### Peer Dependencies

rssm requires the following peer dependencies:

- `react` (>=16)
- `react-dom` (>=16)
- `zod` (>=3)
- `localstorage-slim` (>=1.3.3)

## Basic Usage

### 1. Define your schema and type

```tsx
import { z } from "zod";
import { createRssm } from "rssm";

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
const { RssmProvider, useRssm } = createRssm<Organization>("OrgState");

// Export for use in other components
export { RssmProvider as OrgStateProvider, useRssm as useOrgState };
```

### 3. Wrap your app with the provider

```tsx
function App() {
  return (
    <OrgStateProvider schema={organizationSchema} name="orgState">
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
      <button onClick={() => updateOrgName("New Name")}>Update Name</button>
    </div>
  );
}
```

## Provider Props

| Prop          | Type             | Required | Default   | Description                                          |
| ------------- | ---------------- | -------- | --------- | ---------------------------------------------------- |
| `schema`      | `z.ZodSchema<T>` | yes      | -         | Zod schema for validating the state data             |
| `name`        | `string`         | yes      | -         | Unique name for the state (used as localStorage key) |
| `children`    | `ReactNode`      | yes      | -         | Child components                                     |
| `initialData` | `T \| null`      | no       | `null`    | Initial data to populate the state                   |
| `persist`     | `boolean`        | no       | `true`    | Whether to persist state to localStorage             |
| `ttl`         | `number \| null` | no       | `null`    | Time-to-live in seconds for localStorage             |
| `encrypt`     | `boolean`        | no       | `false`   | Whether to encrypt data in localStorage              |
| `logging`     | `boolean`        | no       | `false`   | Whether to enable logging                            |
| `logger`      | `Logger`         | no       | `console` | Custom logger implementation                         |

## Hook Return Value

The `useRssm` hook returns an object with:

| Property  | Type             | Description                         |
| --------- | ---------------- | ----------------------------------- |
| `data`    | `T \| null`      | The current state data              |
| `loading` | `boolean`        | Loading state indicator             |
| `error`   | `string \| null` | Error message if any                |
| `actions` | `RssmActions<T>` | Object containing all state actions |

### Actions

| Action                | Type                              | Description                             |
| --------------------- | --------------------------------- | --------------------------------------- |
| `create(data)`        | `(data: T) => void`               | Create/set new data                     |
| `read(data)`          | `(data: T) => void`               | Read/set data (alias for create)        |
| `update(partial)`     | `(partial: Partial<T>) => void`   | Update existing data partially          |
| `destroy()`           | `() => void`                      | Clear data and remove from localStorage |
| `setLoading(loading)` | `(loading: boolean) => void`      | Set loading state                       |
| `setError(error)`     | `(error: string \| null) => void` | Set error state                         |
| `reset()`             | `() => void`                      | Reset to initial state                  |

## Advanced Examples

### With Initial Data and Persistence Options

```tsx
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  preferences: z.object({
    theme: z.enum(["light", "dark"]),
    notifications: z.boolean(),
  }),
});

type User = z.infer<typeof userSchema>;

const { RssmProvider, useRssm } = createRssm<User>("UserState");

function App() {
  const initialUser: User = {
    id: "default",
    email: "user@example.com",
    name: "Guest User",
    preferences: {
      theme: "light",
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
  info: (message: string, ...args: unknown[]) => {
    // Send to logging service
    logService.info(message, args);
  },
  warn: (message: string, ...args: unknown[]) => {
    logService.warn(message, args);
  },
  error: (message: string, ...args: unknown[]) => {
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
</SiteStateProvider>;
```

### Multiple State Machines

```tsx
// Create multiple rssm instances
const { RssmProvider: OrgProvider, useRssm: useOrgState } =
  createRssm<Organization>("OrgState");

const { RssmProvider: SiteProvider, useRssm: useSiteState } =
  createRssm<Site>("SiteState");

const { RssmProvider: UserProvider, useRssm: useUserState } =
  createRssm<User>("UserState");

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
      <h2>
        {org?.name} - {site?.name}
      </h2>
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
  id: "not-a-uuid", // Invalid UUID
  count: -5, // Negative number
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
    queryKey: ["organization", orgId],
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
actions.update({ name: "New Name" }); // ✅
actions.update({ invalid: "field" }); // ❌ TypeScript error

// Create/Read require full Organization object
actions.create({ id: "1" }); // ❌ TypeScript error - missing required fields
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

- 🎨 Terminal UI with syntax highlighting
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

## API

### `createRssm<T>(name: string)`

Creates a new React Schema State Machine instance with TypeScript generics support.

**Parameters:**

- `name`: string - Unique identifier for the state machine context

**Returns:** Object containing:

- `RssmProvider`: React Provider component
- `useRssm`: React hook for accessing state and actions

**Example:**

```tsx
import { createRssm } from "rssm";

const { RssmProvider, useRssm } = createRssm<Organization>("OrgState");
```

### `RssmProvider`

React Provider component that manages state and persistence.

**Props:**

- `schema`: z.ZodSchema<T> - Zod schema for validating state data
- `name`: string - Unique name for the state (used as localStorage key)
- `children`: ReactNode - Child components
- `initialData?`: T | null - Initial data to populate the state
- `persist?`: boolean - Whether to persist state to localStorage (default: true)
- `ttl?`: number | null - Time-to-live in seconds for localStorage
- `encrypt?`: boolean - Whether to encrypt data in localStorage (default: false)
- `logging?`: boolean - Whether to enable logging (default: false)
- `logger?`: Logger - Custom logger implementation (default: console)

**Example:**

```tsx
<RssmProvider
  schema={organizationSchema}
  name="orgState"
  persist={true}
  ttl={3600}
  encrypt={true}
>
  <App />
</RssmProvider>
```

### `useRssm()`

React hook that provides access to state data and actions.

**Returns:** Object containing:

- `data`: T | null - Current state data
- `loading`: boolean - Loading state indicator
- `error`: string | null - Error message if any
- `actions`: RssmActions<T> - State manipulation actions

**Example:**

```tsx
const { data, loading, error, actions } = useRssm();
```

### Actions

#### `actions.create(data: T)`

Creates or sets new data in the state.

**Parameters:**

- `data`: T - Complete data object matching the schema

**Example:**

```tsx
actions.create({
  id: "123",
  name: "New Organization",
  slug: "new-org",
});
```

#### `actions.read(data: T)`

Alias for create - sets data in the state.

**Parameters:**

- `data`: T - Complete data object matching the schema

**Example:**

```tsx
const orgData = await fetchOrganization(id);
actions.read(orgData);
```

#### `actions.update(partial: Partial<T>)`

Updates existing data with partial values.

**Parameters:**

- `partial`: Partial<T> - Partial data object to merge with existing state

**Example:**

```tsx
actions.update({ name: "Updated Name" });
```

#### `actions.destroy()`

Clears data from state and removes from localStorage.

**Example:**

```tsx
actions.destroy();
```

#### `actions.setLoading(loading: boolean)`

Sets the loading state.

**Parameters:**

- `loading`: boolean - Loading state value

**Example:**

```tsx
actions.setLoading(true);
// ... perform async operation
actions.setLoading(false);
```

#### `actions.setError(error: string | null)`

Sets or clears the error state.

**Parameters:**

- `error`: string | null - Error message or null to clear

**Example:**

```tsx
try {
  await someOperation();
} catch (err) {
  actions.setError(err.message);
}
```

#### `actions.reset()`

Resets state to initial values.

**Example:**

```tsx
actions.reset();
```

## Migration Guides

### From rssm to React Context

If you need to migrate from rssm to plain React Context, the transition is straightforward since rssm follows similar patterns:

**1. Replace the rssm Provider with React Context:**

```tsx
// Before (rssm)
const { RssmProvider, useRssm } = createRssm<Organization>("OrgState");

// After (React Context)
const OrgStateContext = createContext<{
  data: Organization | null;
  loading: boolean;
  error: string | null;
  actions: {
    setData: (data: Organization | null) => void;
    updateData: (partial: Partial<Organization>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
} | null>(null);
```

**2. Create a custom Provider with useReducer:**

```tsx
function OrgStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orgReducer, {
    data: null,
    loading: false,
    error: null,
  });

  const actions = useMemo(
    () => ({
      setData: (data: Organization | null) =>
        dispatch({ type: "SET_DATA", payload: data }),
      updateData: (partial: Partial<Organization>) =>
        dispatch({ type: "UPDATE_DATA", payload: partial }),
      setLoading: (loading: boolean) =>
        dispatch({ type: "SET_LOADING", payload: loading }),
      setError: (error: string | null) =>
        dispatch({ type: "SET_ERROR", payload: error }),
    }),
    [],
  );

  return (
    <OrgStateContext.Provider value={{ ...state, actions }}>
      {children}
    </OrgStateContext.Provider>
  );
}
```

**3. Replace useRssm with useContext:**

```tsx
// Before
const { data, loading, error, actions } = useRssm();

// After
const context = useContext(OrgStateContext);
if (!context)
  throw new Error("useOrgState must be used within OrgStateProvider");
const { data, loading, error, actions } = context;
```

**4. Add localStorage persistence (if needed):**

```tsx
useEffect(() => {
  if (data) {
    localStorage.setItem("orgState", JSON.stringify(data));
  }
}, [data]);
```

### From rssm to Redux Toolkit

Migrating from rssm to Redux Toolkit provides more features and better DevTools support:

**1. Create a Redux slice replacing rssm:**

```tsx
// Before (rssm)
const { RssmProvider, useRssm } = createRssm<Organization>("OrgState");

// After (Redux Toolkit)
const orgSlice = createSlice({
  name: "organization",
  initialState: {
    data: null as Organization | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setOrganization: (state, action: PayloadAction<Organization>) => {
      state.data = action.payload;
      state.error = null;
    },
    updateOrganization: (
      state,
      action: PayloadAction<Partial<Organization>>,
    ) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    clearOrganization: (state) => {
      state.data = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setOrganization,
  updateOrganization,
  clearOrganization,
  setLoading,
  setError,
} = orgSlice.actions;
```

**2. Replace rssm actions with Redux actions:**

```tsx
// Before (rssm)
actions.create(orgData);
actions.update({ name: "New Name" });
actions.destroy();
actions.setLoading(true);
actions.setError("Error message");

// After (Redux Toolkit)
dispatch(setOrganization(orgData));
dispatch(updateOrganization({ name: "New Name" }));
dispatch(clearOrganization());
dispatch(setLoading(true));
dispatch(setError("Error message"));
```

**3. Create async thunks for API calls:**

```tsx
export const fetchOrganization = createAsyncThunk(
  "organization/fetch",
  async (orgId: string) => {
    const response = await api.getOrganization(orgId);
    return response.data;
  },
);

// In your slice, add extraReducers
extraReducers: (builder) => {
  builder
    .addCase(fetchOrganization.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchOrganization.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    })
    .addCase(fetchOrganization.rejected, (state, action) => {
      state.error = action.error.message || "Failed to fetch";
      state.loading = false;
    });
};
```

**4. Replace useRssm with Redux hooks:**

```tsx
// Before
const { data, loading, error, actions } = useRssm();

// After
const { data, loading, error } = useSelector(
  (state: RootState) => state.organization,
);
const dispatch = useDispatch();

// Use actions
dispatch(setOrganization(orgData));
dispatch(updateOrganization({ name: "New Name" }));
```

**5. Add Redux persist for localStorage:**

```tsx
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "organization",
  storage,
  whitelist: ["data"], // Only persist data, not loading/error states
};

const persistedReducer = persistReducer(persistConfig, orgSlice.reducer);
```

**Key Benefits of Migration:**

- **To React Context**: Removes external dependency, full control over implementation
- **To Redux Toolkit**: Better DevTools, time-travel debugging, middleware support, larger ecosystem

Both migrations maintain similar usage patterns to rssm, making the transition smooth for your team.

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
