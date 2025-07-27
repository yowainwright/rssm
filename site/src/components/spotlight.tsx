"use client";

import { useState } from "react";

const steps = [
  {
    title: "Install RSSM",
    description: "Add RSSM and Zod to your React project",
    code: `npm install rssm zod

# or with yarn
yarn add rssm zod

# or with bun
bun add rssm zod`,
    language: "bash",
    filename: "terminal",
  },
  {
    title: "Define Your Schema",
    description: "Create a type-safe schema with Zod validation",
    code: `import { z } from 'zod';

// Define your state schema
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  createdAt: z.date()
});

// TypeScript types are automatically inferred
type User = z.infer<typeof userSchema>;`,
    language: "typescript",
    filename: "schema.ts",
  },
  {
    title: "Create State Machine",
    description: "Initialize RSSM with your schema",
    code: `import { createRSSM } from 'rssm';

// Create your state machine
const userStore = createRSSM({
  schema: userSchema,
  options: {
    persist: true,           // Enable localStorage
    storageKey: 'users',     // Storage key
    encrypt: true,           // Encrypt stored data
    ttl: 24 * 60 * 60 * 1000 // 24 hour TTL
  }
});`,
    language: "typescript",
    filename: "store.ts",
  },
  {
    title: "Use in React",
    description: "Access your type-safe state with hooks",
    code: `import { useRSSM } from 'rssm';

function UserList() {
  const { 
    state,      // Current state
    create,     // Create new items
    update,     // Update existing items
    delete: remove,  // Delete items
    loading,    // Loading state
    error       // Error handling
  } = useRSSM(userStore);

  const handleAddUser = async (data) => {
    await create({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date()
    });
  };

  return (
    <div>
      {state.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}`,
    language: "tsx",
    filename: "UserList.tsx",
  },
  {
    title: "CLI Generator",
    description: "Generate complete state machines from JSON schemas",
    code: `# Install the CLI globally
npm install -g rssm

# Generate from a JSON schema file
rssm generate ./schemas/user.json

# Or use npx
npx rssm generate ./schemas/user.json

# This creates:
# - TypeScript types
# - Zod schemas
# - React hooks
# - CRUD operations
# - Tests`,
    language: "bash",
    filename: "terminal",
  },
];

export function Spotlight() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = steps[activeStep];

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              Get Started in Minutes
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Follow these simple steps to integrate RSSM into your project
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Left side - Steps */}
          <div className="lg:col-span-2">
            <nav className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full rounded-lg px-4 py-3 text-left transition-all ${
                    index === activeStep
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        index === activeStep
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p
                        className={`text-sm ${
                          index === activeStep
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Right side - Code */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
              {/* Code header */}
              <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {currentStep.filename}
                </span>
              </div>

              {/* Code content */}
              <div className="bg-gradient-to-br from-card to-muted/20">
                <pre className="overflow-x-auto p-6">
                  <code
                    className={`language-${currentStep.language} text-sm leading-relaxed`}
                  >
                    {currentStep.code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
