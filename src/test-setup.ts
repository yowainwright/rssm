// Setup file for bun tests
import { beforeAll } from "bun:test";

// Add any global test setup here
beforeAll(() => {
  // Mock DOM globals if needed
  global.window = {} as any;
  global.document = {
    createElement: () => ({}),
  } as any;
});