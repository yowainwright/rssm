import { InteractiveDemo } from "@/components/interactive-demo";
import { StateFlowCube } from "@/components/state-flow-cube";
import { Spotlight } from "@/components/spotlight";
import {
  ArrowRight,
  Code2,
  Zap,
  Shield,
  Database,
  Braces,
  GitBranch,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  React Schema
                </span>
                <br />
                <span className="text-foreground">State Machine</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Type-safe state management with Zod validation, localStorage
                persistence, and a powerful CLI generator. Build with a standard
                CRUD methodoligy. Implement React state with confidence in
                seconds.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href="#get-started"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="https://github.com/yowainwright/rssm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-input bg-background/50 px-8 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50 hover:bg-accent"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right side - State Flow Visualization */}
            <div className="lg:pl-8">
              <StateFlowCube />
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="border-t">
        <Spotlight />
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                Everything You Need
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features for modern React applications
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Type-Safe by Default</h3>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with Zod schema validation ensures
                  your state is always correct
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Built-in Persistence</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic localStorage sync with encryption, TTL, and
                  migration support
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized for performance with minimal re-renders and
                  efficient updates
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">CLI Generator</h3>
                <p className="text-sm text-muted-foreground">
                  Generate complete state machines from JSON schemas with our
                  powerful CLI
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Braces className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Simple API</h3>
                <p className="text-sm text-muted-foreground">
                  Intuitive CRUD operations with built-in error handling and
                  loading states
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">DevTools Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Debug with confidence using Redux DevTools integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                See It In Action
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Try our interactive demo to experience RSSM's power
            </p>
          </div>
          <div className="mt-12">
            <InteractiveDemo />
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              React Schema State Machine
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A fast way to not get locked in the library but get your React State
            locked in!
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.npmjs.com/package/rssm"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Install from npm
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://github.com/yowainwright/rssm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-input bg-background/50 px-8 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50 hover:bg-accent"
            >
              Star on GitHub
            </a>
          </div>

          {/* Big RSSM Name */}
          <div className="mt-32 mb-16">
            <h1 className="text-8xl font-bold tracking-tight sm:text-9xl lg:text-[12rem]">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                RSSM
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, and Zod
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/yowainwright/rssm"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/rssm"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
