import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_OUTPUT_DIR = path.join(__dirname, "integration-output");

// Import the actual CLI functions for unit testing
import { generateComponent } from "../src/generator";
import { parseJsonSchema } from "../src/schema-parser";

describe("RSSM CLI Integration Tests", () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  describe("Schema Parser", () => {
    test("should parse simple JSON schema", async () => {
      const schema = JSON.stringify({ name: "string", age: "number" });
      const result = await parseJsonSchema(schema, "User");

      expect(result.typeName).toBe("UserData");
      expect(result.zodSchema).toContain("z.object({");
      expect(result.zodSchema).toContain("name: z.string()");
      expect(result.zodSchema).toContain("age: z.number()");
      expect(result.zodSchema).toContain(
        "type UserData = z.infer<typeof userdata",
      );
    });

    test("should parse array schema", async () => {
      const schema = JSON.stringify([{ id: "string", title: "string" }]);
      const result = await parseJsonSchema(schema, "TodoList");

      expect(result.zodSchema).toContain("z.array(");
      expect(result.zodSchema).toContain("id: z.string()");
      expect(result.zodSchema).toContain("title: z.string()");
    });

    test("should parse nested schema", async () => {
      const schema = JSON.stringify({
        user: {
          profile: {
            name: "string",
            age: "number",
          },
        },
      });
      const result = await parseJsonSchema(schema, "AppState");

      expect(result.zodSchema).toContain("user: z.object({");
      expect(result.zodSchema).toContain("profile: z.object({");
    });

    test("should handle date type", async () => {
      const schema = JSON.stringify({ createdAt: "date", updatedAt: "date" });
      const result = await parseJsonSchema(schema, "TimeStamps");

      expect(result.zodSchema).toContain("createdAt: z.string().datetime()");
      expect(result.zodSchema).toContain("updatedAt: z.string().datetime()");
    });

    test("should read schema from file", async () => {
      const schemaFile = path.join(TEST_OUTPUT_DIR, "test-schema.json");
      await fs.writeFile(schemaFile, JSON.stringify({ test: "boolean" }));

      const result = await parseJsonSchema(schemaFile, "TestSchema");

      expect(result.zodSchema).toContain("test: z.boolean()");
    });

    test("should throw on invalid JSON", async () => {
      await expect(parseJsonSchema("invalid json", "Test")).rejects.toThrow(
        "Invalid JSON schema",
      );
    });

    test("should throw on non-existent file", async () => {
      await expect(
        parseJsonSchema("/nonexistent/file.json", "Test"),
      ).rejects.toThrow("Failed to read schema file");
    });
  });

  describe("Component Generator", () => {
    test("should generate TypeScript component with all features", async () => {
      const options = {
        name: "TestState",
        typeName: "TestStateData",
        zodSchema: `const teststateschema = z.object({
  name: z.string(),
  count: z.number(),
});

type TestStateData = z.infer<typeof teststateschema>;`,
        persist: true,
        logging: true,
        encrypt: true,
        ttl: 3600,
        outputDir: TEST_OUTPUT_DIR,
        typescript: true,
      };

      await generateComponent(options);

      // Check component file
      const componentPath = path.join(TEST_OUTPUT_DIR, "teststate.tsx");
      const componentContent = await fs.readFile(componentPath, "utf-8");

      expect(componentContent).toContain("import { z } from 'zod';");
      expect(componentContent).toContain("import { createRssm } from 'rssm';");
      expect(componentContent).toContain(
        "createRssm<TestStateData>('TestState')",
      );
      // When persist is true (default), it won't be explicitly set in props
      expect(componentContent).not.toContain("persist={false}");
      expect(componentContent).toContain("logging={true}");
      expect(componentContent).toContain("encrypt={true}");
      expect(componentContent).toContain("ttl={3600}");
      expect(componentContent).toContain("export type { TestStateData };");

      // Check example file
      const examplePath = path.join(TEST_OUTPUT_DIR, "teststate.example.tsx");
      const exampleContent = await fs.readFile(examplePath, "utf-8");

      expect(exampleContent).toContain("import React from 'react';");
      expect(exampleContent).toContain(
        "import { TestStateProvider, useTestState }",
      );
      expect(exampleContent).toContain(
        "const { data, loading, error, actions } = useTestState()",
      );
    });

    test("should generate JavaScript component", async () => {
      const options = {
        name: "JsState",
        typeName: "JsStateData",
        zodSchema: `const jsstateschema = z.object({
  value: z.string(),
});`,
        persist: false,
        logging: false,
        encrypt: false,
        outputDir: TEST_OUTPUT_DIR,
        typescript: false,
      };

      await generateComponent(options);

      const componentPath = path.join(TEST_OUTPUT_DIR, "jsstate.jsx");
      const componentContent = await fs.readFile(componentPath, "utf-8");

      expect(componentContent).not.toContain("import { z } from 'zod';");
      expect(componentContent).not.toContain(": React.ReactNode");
      expect(componentContent).not.toContain("export type {");
      expect(componentContent).toContain("persist={false}");
    });

    test("should handle minimal options", async () => {
      const options = {
        name: "MinimalState",
        typeName: "MinimalStateData",
        zodSchema: `const minimalstateschema = z.object({
  data: z.unknown(),
});

type MinimalStateData = z.infer<typeof minimalstateschema>;`,
        outputDir: TEST_OUTPUT_DIR,
        typescript: true,
      };

      await generateComponent(options);

      const componentPath = path.join(TEST_OUTPUT_DIR, "minimalstate.tsx");
      const componentContent = await fs.readFile(componentPath, "utf-8");

      // Should not have optional props when using defaults
      expect(componentContent).not.toContain("persist={false}");
      expect(componentContent).not.toContain("logging={");
      expect(componentContent).not.toContain("encrypt={");
      expect(componentContent).not.toContain("ttl={");
    });

    test("should create output directory if it doesn't exist", async () => {
      const nestedDir = path.join(TEST_OUTPUT_DIR, "nested", "deep", "dir");

      const options = {
        name: "NestedState",
        typeName: "NestedStateData",
        zodSchema: "const nestedstateschema = z.object({});",
        outputDir: nestedDir,
        typescript: true,
      };

      await generateComponent(options);

      const dirExists = await fs
        .access(nestedDir)
        .then(() => true)
        .catch(() => false);
      expect(dirExists).toBe(true);

      const componentPath = path.join(nestedDir, "nestedstate.tsx");
      const fileExists = await fs
        .access(componentPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });
  });
});
