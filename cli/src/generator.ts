import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { highlight } from 'cli-highlight';
import boxen from 'boxen';

interface GeneratorOptions {
  name: string;
  typeName: string;
  zodSchema: string;
  persist: boolean;
  logging: boolean;
  encrypt: boolean;
  ttl?: number;
  outputDir: string;
  typescript: boolean;
}

export async function generateComponent(options: GeneratorOptions) {
  const {
    name,
    typeName,
    zodSchema,
    persist,
    logging,
    encrypt,
    ttl,
    outputDir,
    typescript
  } = options;

  // Ensure output directory exists
  const dirSpinner = ora('Creating output directory...').start();
  try {
    await fs.mkdir(outputDir, { recursive: true });
    dirSpinner.succeed();
  } catch (error) {
    dirSpinner.fail('Failed to create directory');
    throw error;
  }

  const fileName = `${name.toLowerCase()}.${typescript ? 'tsx' : 'jsx'}`;
  const filePath = path.join(outputDir, fileName);

  // Generate the component code
  const code = generateCode(options);

  // Write the component file
  const componentSpinner = ora(`Writing ${fileName}...`).start();
  try {
    await fs.writeFile(filePath, code, 'utf-8');
    componentSpinner.succeed(chalk.green(`Component created: ${fileName}`));
  } catch (error) {
    componentSpinner.fail('Failed to write component file');
    throw error;
  }

  // Show component preview
  console.log('\n' + chalk.blue('📄 Component Preview:'));
  const highlightedCode = highlight(code.substring(0, 500) + '\n...', { language: 'typescript' });
  console.log(boxen(highlightedCode, {
    padding: 1,
    borderStyle: 'single',
    borderColor: 'gray',
    dimBorder: true
  }));

  // Generate example usage file
  const exampleCode = generateExampleCode(options);
  const examplePath = path.join(outputDir, `${name.toLowerCase()}.example.${typescript ? 'tsx' : 'jsx'}`);
  
  const exampleSpinner = ora(`Writing example file...`).start();
  try {
    await fs.writeFile(examplePath, exampleCode, 'utf-8');
    exampleSpinner.succeed(chalk.green(`Example created: ${name.toLowerCase()}.example.${typescript ? 'tsx' : 'jsx'}`));
  } catch (error) {
    exampleSpinner.fail('Failed to write example file');
    throw error;
  }

  // Summary box
  const summary = [
    chalk.green.bold('✨ Files Generated Successfully!'),
    '',
    chalk.white('Component:') + ' ' + chalk.cyan(filePath),
    chalk.white('Example:') + ' ' + chalk.cyan(examplePath),
    '',
    chalk.gray('Features enabled:'),
    `  ${persist ? '✓' : '✗'} Persistence`,
    `  ${logging ? '✓' : '✗'} Logging`,
    `  ${encrypt ? '✓' : '✗'} Encryption`,
    ttl ? `  ✓ TTL: ${ttl}s` : '  ✗ TTL'
  ].join('\n');

  console.log('\n' + boxen(summary, {
    padding: 1,
    borderStyle: 'double',
    borderColor: 'green'
  }));
}

function generateCode(options: GeneratorOptions): string {
  const {
    name,
    typeName,
    zodSchema,
    persist,
    logging,
    encrypt,
    ttl,
    typescript
  } = options;

  const providerProps = [
    'schema={' + `${typeName.toLowerCase()}Schema` + '}',
    `name="${name.toLowerCase()}"`,
    persist !== true && `persist={${persist}}`,
    logging && `logging={${logging}}`,
    encrypt && `encrypt={${encrypt}}`,
    ttl && `ttl={${ttl}}`,
  ].filter(Boolean).join('\n      ');

  return `${typescript ? "import { z } from 'zod';" : ''}
import { createRssm } from 'rssm';

// Define your schema
${zodSchema}

// Create the state machine
const { RssmProvider, useRssm } = createRssm${typescript ? `<${typeName}>` : ''}('${name}');

// Export the provider with preset configuration
export function ${name}Provider({ children }${typescript ? ': { children: React.ReactNode }' : ''}) {
  return (
    <RssmProvider
      ${providerProps}
    >
      {children}
    </RssmProvider>
  );
}

// Export the hook for convenience
export const use${name} = useRssm;

// Export types${typescript ? `
export type { ${typeName} };` : ''}
`;
}

function generateExampleCode(options: GeneratorOptions): string {
  const { name, typeName, typescript } = options;

  return `${typescript ? "import React from 'react';" : ''}
import { ${name}Provider, use${name} } from './${name.toLowerCase()}';

function ${name}Demo() {
  const { data, loading, error, actions } = use${name}();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>${name} Demo</h2>
      
      {/* Display current state */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      
      {/* Example actions */}
      <button onClick={() => actions.create(/* your data here */)}>
        Create
      </button>
      
      <button onClick={() => actions.update(/* partial data here */)}>
        Update
      </button>
      
      <button onClick={() => actions.reset()}>
        Reset
      </button>
      
      <button onClick={() => actions.destroy()}>
        Clear
      </button>
    </div>
  );
}

export default function App() {
  return (
    <${name}Provider>
      <${name}Demo />
    </${name}Provider>
  );
}
`;
}