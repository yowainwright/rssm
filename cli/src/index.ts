#!/usr/bin/env node

import { Command } from "commander";
import { input, select, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { z } from "zod";
import ora from "ora";
import boxen from "boxen";
import { highlight } from "cli-highlight";
import gradient from "gradient-string";
import figlet from "figlet";
import { generateComponent } from "./generator.js";
import { parseJsonSchema } from "./schema-parser.js";

const program = new Command();

// Display banner
const banner = figlet.textSync("RSSM", {
  font: "Standard",
  horizontalLayout: "default",
  verticalLayout: "default",
});

console.log(gradient.pastel.multiline(banner));
console.log(gradient.pastel("React Simple Schema State Machine CLI\n"));

program
  .name("rssm")
  .description("React Simple Schema State Machine CLI")
  .version("1.0.0");

program
  .command("create")
  .description("Create a new Rssm state machine")
  .option("-n, --name <name>", "State machine name")
  .option("-s, --schema <schema>", "JSON schema or path to schema file")
  .option("-t, --typescript", "Generate TypeScript code", true)
  .option("-p, --persist", "Enable localStorage persistence", true)
  .option("-l, --logging", "Enable logging", false)
  .option("-e, --encrypt", "Enable encryption", false)
  .option("--ttl <seconds>", "Time to live in seconds")
  .option("-o, --output <path>", "Output directory", "./src/state")
  .action(async (options) => {
    try {
      // Interactive prompts for missing options
      const name =
        options.name ||
        (await input({
          message: "What is the name of your state machine?",
          default: "AppState",
          validate: (value) => {
            if (!value || !/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
              return "Name must start with a letter and contain only letters and numbers";
            }
            return true;
          },
        }));

      const schemaInput =
        options.schema ||
        (await input({
          message: "Enter your JSON schema (or path to schema file):",
          default: "{}",
        }));

      const persist =
        options.persist ??
        (await confirm({
          message: "Enable localStorage persistence?",
          default: true,
        }));

      const logging =
        options.logging ??
        (await confirm({
          message: "Enable logging?",
          default: false,
        }));

      const encrypt =
        options.encrypt ??
        (await confirm({
          message: "Enable encryption for stored data?",
          default: false,
        }));

      let ttl: number | undefined;
      if (persist && options.ttl !== undefined) {
        ttl = parseInt(options.ttl);
      } else if (persist && options.ttl === undefined) {
        const wantsTtl = await confirm({
          message: "Set a TTL (time to live) for stored data?",
          default: false,
        });

        if (wantsTtl) {
          const ttlInput = await input({
            message: "TTL in seconds:",
            default: "3600",
            validate: (value) => {
              const num = parseInt(value);
              if (isNaN(num) || num <= 0) {
                return "TTL must be a positive number";
              }
              return true;
            },
          });
          ttl = parseInt(ttlInput);
        }
      }

      const outputDir =
        options.output ||
        (await input({
          message: "Output directory:",
          default: "./src/state",
        }));

      // Parse the schema
      const parseSpinner = ora("Parsing JSON schema...").start();
      let zodSchema: string;
      let typeName: string;

      try {
        const parsed = await parseJsonSchema(schemaInput, name);
        zodSchema = parsed.zodSchema;
        typeName = parsed.typeName;
        parseSpinner.succeed("Schema parsed successfully");
      } catch (error) {
        parseSpinner.fail("Failed to parse schema");
        throw error;
      }

      // Show preview with beautiful formatting
      const configSummary = [
        `${chalk.white("Name:")} ${chalk.green(name)}`,
        `${chalk.white("Type:")} ${chalk.green(typeName)}`,
        `${chalk.white("Persistence:")} ${persist ? chalk.green("✓ Enabled") : chalk.red("✗ Disabled")}`,
        `${chalk.white("Logging:")} ${logging ? chalk.green("✓ Enabled") : chalk.red("✗ Disabled")}`,
        `${chalk.white("Encryption:")} ${encrypt ? chalk.green("✓ Enabled") : chalk.red("✗ Disabled")}`,
        ttl ? `${chalk.white("TTL:")} ${chalk.green(`${ttl} seconds`)}` : "",
        `${chalk.white("Output:")} ${chalk.green(outputDir)}`,
      ]
        .filter(Boolean)
        .join("\n");

      console.log(
        "\n" +
          boxen(configSummary, {
            title: "📋 Configuration Summary",
            titleAlignment: "center",
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "blue",
          }),
      );

      // Show generated code preview
      console.log("\n" + chalk.blue("📝 Generated Schema:"));
      const highlightedSchema = highlight(zodSchema, {
        language: "typescript",
      });
      console.log(
        boxen(highlightedSchema, {
          padding: 1,
          borderStyle: "single",
          borderColor: "gray",
          dimBorder: true,
        }),
      );

      const proceed = await confirm({
        message: "Generate Rssm component with these settings?",
        default: true,
      });

      if (!proceed) {
        console.log(chalk.yellow("Generation cancelled."));
        return;
      }

      // Generate the component
      const generateSpinner = ora("Generating Rssm component...").start();

      try {
        await generateComponent({
          name,
          typeName,
          zodSchema,
          persist,
          logging,
          encrypt,
          ttl,
          outputDir,
          typescript: options.typescript,
        });
        generateSpinner.succeed("Component generated successfully");
      } catch (error) {
        generateSpinner.fail("Failed to generate component");
        throw error;
      }

      // Success message with beautiful formatting
      const successMessage = gradient.cristal(
        "\n✨ Rssm component generated successfully!\n",
      );
      console.log(successMessage);

      // Next steps in a beautiful box
      const nextSteps = [
        chalk.blue.bold("Next Steps:"),
        "",
        chalk.gray("1. Install peer dependencies:"),
        chalk.cyan("   npm install react zod"),
        "",
        chalk.gray("2. Import and use your state machine:"),
        chalk.cyan(
          `   import { ${name}Provider, use${name} } from '${outputDir}/${name.toLowerCase()}';`,
        ),
        "",
        chalk.gray("3. Check the generated example file for usage patterns"),
      ].join("\n");

      console.log(
        boxen(nextSteps, {
          padding: 1,
          margin: 1,
          borderStyle: "double",
          borderColor: "green",
        }),
      );
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : error,
      );
      process.exit(1);
    }
  });

program
  .command("example")
  .description("Show example usage")
  .action(() => {
    console.log(gradient.rainbow("\n📚 Rssm Example Usage\n"));

    const examples = [
      {
        title: "1. Basic user preferences",
        command: `rssm create \\
  --name UserPreferences \\
  --schema '{"theme": "string", "language": "string", "notifications": "boolean"}'`,
        description: "Simple state for user settings",
      },
      {
        title: "2. Todo list with TTL",
        command: `rssm create \\
  --name TodoList \\
  --schema '[{"id": "string", "text": "string", "completed": "boolean"}]' \\
  --ttl 86400`,
        description: "Array state with 24-hour persistence",
      },
      {
        title: "3. Secure user data with encryption",
        command: `rssm create \\
  --name UserData \\
  --schema '{"id": "string", "email": "string", "profile": {"name": "string", "avatar": "string"}}' \\
  --encrypt \\
  --logging`,
        description: "Encrypted state with logging enabled",
      },
    ];

    examples.forEach((example, index) => {
      console.log(chalk.yellow.bold(example.title));
      console.log(chalk.gray(example.description));
      const highlightedCommand = highlight(example.command, {
        language: "bash",
      });
      console.log(
        boxen(highlightedCommand, {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 0, right: 0 },
          borderStyle: "single",
          borderColor: "gray",
          dimBorder: true,
        }),
      );
    });

    const tip = [
      chalk.blue.bold("💡 Pro Tips:"),
      "",
      "• Use a JSON schema file for complex schemas:",
      chalk.cyan("  rssm create --name AppState --schema ./schema.json"),
      "",
      "• Skip all prompts with complete options:",
      chalk.cyan("  rssm create -n MyState -s '{}' --no-persist --no-encrypt"),
      "",
      "• Enable all features for maximum functionality:",
      chalk.cyan("  rssm create --persist --encrypt --logging --ttl 3600"),
    ].join("\n");

    console.log(
      boxen(tip, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "magenta",
      }),
    );
  });

// Placeholder for future update command
program
  .command("update")
  .description("Update an existing Rssm state machine (coming soon)")
  .action(() => {
    console.log(chalk.yellow("\n🚧 The update command is coming soon!\n"));
    console.log(chalk.gray("This will allow you to:"));
    console.log(
      chalk.gray("  • Update existing state machines with new schema fields"),
    );
    console.log(
      chalk.gray(
        "  • Change configuration options (persistence, encryption, etc.)",
      ),
    );
    console.log(chalk.gray("  • Migrate from older versions of Rssm\n"));
  });

program.parse();
