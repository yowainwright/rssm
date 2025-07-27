import { InteractiveDemo } from "@/components/interactive-demo";
// import Documentation from "@/components/documentation.mdx";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">RSSM</h1>
          <p className="mt-2 text-xl text-muted-foreground">
            React Simple Schema State Machine - Type-safe state management with
            Zod validation
          </p>
        </div>
      </header>

      {/* Interactive Demo */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="mb-8 text-3xl font-bold">Interactive Demo</h2>
          <p className="mb-8 text-muted-foreground">
            Try out Rssm with this interactive demo. Modify the form fields and
            click the CRUD buttons to see how the state changes in real-time.
          </p>
          <InteractiveDemo />
        </div>
      </section>

      {/* Documentation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* <Documentation /> */}
            <div>Documentation will go here</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ using React, TypeScript, and Zod</p>
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
