import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, "../bin/rssm.js");
const TEST_OUTPUT_DIR = path.join(__dirname, "test-output");

describe("RSSM CLI", () => {
  beforeEach(async () => {
    // Create test output directory
    await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test output directory
    await fs.rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  describe("basic commands", () => {
    test("should display help", async () => {
      const { stdout } = await execAsync(`bun ${CLI_PATH} --help`);

      expect(stdout).toContain("React Simple Schema State Machine CLI");
      expect(stdout).toContain("create");
      expect(stdout).toContain("example");
      expect(stdout).toContain("update");
    });

    test("should display version", async () => {
      const { stdout } = await execAsync(`bun ${CLI_PATH} --version`);
      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    test("should display create command help", async () => {
      const { stdout } = await execAsync(`bun ${CLI_PATH} create --help`);
      expect(stdout).toContain("Create a new Rssm state machine");
      expect(stdout).toContain("--name");
      expect(stdout).toContain("--schema");
      expect(stdout).toContain("--typescript");
      expect(stdout).toContain("--persist");
      expect(stdout).toContain("--logging");
      expect(stdout).toContain("--encrypt");
      expect(stdout).toContain("--ttl");
      expect(stdout).toContain("--output");
    });

    test("should display examples", async () => {
      const { stdout } = await execAsync(`bun ${CLI_PATH} example`);

      expect(stdout).toContain("Rssm Example Usage");
      expect(stdout).toContain("Basic user preferences");
      expect(stdout).toContain("Todo list with TTL");
      expect(stdout).toContain("Secure user data with encryption");
      expect(stdout).toContain("Pro Tips");
    });

    test("should display coming soon message for update", async () => {
      const { stdout } = await execAsync(`bun ${CLI_PATH} update`);

      expect(stdout).toContain("The update command is coming soon!");
      expect(stdout).toContain("Update existing state machines");
    });
  });
});
