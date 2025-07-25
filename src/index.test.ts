import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, beforeEach, mock, spyOn } from "bun:test";
import { z } from "zod";
import ls from "localstorage-slim";
import { createStateMachine } from "../index";

// Mock localstorage-slim
mock.module("localstorage-slim", () => ({
  default: {
    get: mock(() => null),
    set: mock(() => {}),
    remove: mock(() => {})
  }
}));

// Test schema
const testSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
});

type TestData = z.infer<typeof testSchema>;

describe("StateMachine", () => {
  const mockLogger = {
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
  };

  beforeEach(() => {
    // Reset all mocks
    (ls.get as any).mockReset();
    (ls.set as any).mockReset();
    (ls.remove as any).mockReset();
    (ls.get as any).mockReturnValue(null);
    (ls.set as any).mockImplementation(() => {});
    (ls.remove as any).mockImplementation(() => {});
    mockLogger.info.mockReset();
    mockLogger.warn.mockReset();
    mockLogger.error.mockReset();
  });

  describe("createStateMachine", () => {
    test("should create a state machine with provider and hook", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      expect(StateMachineProvider).toBeDefined();
      expect(useStateMachine).toBeDefined();
    });
  });

  describe("StateMachineProvider", () => {
    test("should provide initial state with null data", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test">
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test("should provide initial state with initial data", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      const initialData: TestData = { id: "1", name: "Test", count: 0 };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" initialData={initialData}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      expect(result.current.data).toEqual(initialData);
    });

    test("should load from localStorage when persist is true (default)", () => {
      const storedState = {
        data: { id: "2", name: "Stored", count: 5 },
        loading: false,
        error: null,
      };
      (storage.get as any).mockReturnValue(storedState);

      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test">
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      expect(ls.get).toHaveBeenCalledWith("test", { decrypt: false });
      expect(result.current.data).toEqual(storedState.data);
    });

    test("should not load from localStorage when persist is false", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" persist={false}>
          {children}
        </StateMachineProvider>
      );

      renderHook(() => useStateMachine(), { wrapper });

      expect(ls.get).not.toHaveBeenCalled();
    });

    test("should validate initial data and warn if invalid", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      const invalidData = { id: "1", name: "Test", count: "not a number" as unknown as number };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider 
          schema={testSchema} 
          name="test" 
          initialData={invalidData}
          logging={true}
          logger={mockLogger}
          persist={false}
        >
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("[test] Initial data failed schema validation"),
        expect.any(Error)
      );
      // Should still use the invalid data
      expect(result.current.data).toEqual(invalidData);
    });
  });

  describe("State Actions", () => {
    test("should handle CREATE action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const newData: TestData = { id: "1", name: "Created", count: 1 };

      act(() => {
        result.current.state.create(newData);
      });

      expect(result.current.data).toEqual(newData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test("should handle READ action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const readData: TestData = { id: "2", name: "Read", count: 2 };

      act(() => {
        result.current.state.read(readData);
      });

      expect(result.current.data).toEqual(readData);
    });

    test("should handle UPDATE action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      const initialData: TestData = { id: "1", name: "Initial", count: 1 };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RSSMProvider schema={testSchema} name="test" initialData={initialData} persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.update({ name: "Updated", count: 2 });
      });

      expect(result.current.data).toEqual({ id: "1", name: "Updated", count: 2 });
    });

    test("should handle DESTROY action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      const initialData: TestData = { id: "1", name: "ToDestroy", count: 1 };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RSSMProvider schema={testSchema} name="test" initialData={initialData} persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.destroy();
      });

      expect(result.current.data).toBeNull();
    });

    test("should handle SET_LOADING action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.state.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
    });

    test("should handle SET_ERROR action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.setError("Test error");
      });

      expect(result.current.error).toBe("Test error");
      expect(result.current.loading).toBe(false);
    });

    test("should handle RESET action", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      const initialData: TestData = { id: "1", name: "ToReset", count: 1 };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RSSMProvider schema={testSchema} name="test" initialData={initialData} persist={false}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Persistence", () => {
    test("should persist state changes to localStorage", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test">
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const newData: TestData = { id: "1", name: "Persist", count: 1 };

      act(() => {
        result.current.state.create(newData);
      });

      expect(ls.set).toHaveBeenCalledWith(
        "test",
        { data: newData, loading: false, error: null },
        { ttl: null, encrypt: false }
      );
    });

    test("should remove from localStorage on destroy", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test">
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.destroy();
      });

      expect(ls.remove).toHaveBeenCalledWith("test");
    });

    test("should support TTL option", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" ttl={3600}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const newData: TestData = { id: "1", name: "TTL", count: 1 };

      act(() => {
        result.current.state.create(newData);
      });

      expect(ls.set).toHaveBeenCalledWith(
        "test",
        expect.any(Object),
        { ttl: 3600, encrypt: false }
      );
    });

    test("should support encryption option", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider schema={testSchema} name="test" encrypt={true}>
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const newData: TestData = { id: "1", name: "Encrypt", count: 1 };

      act(() => {
        result.current.state.create(newData);
      });

      expect(ls.set).toHaveBeenCalledWith(
        "test",
        expect.any(Object),
        { ttl: null, encrypt: true }
      );
    });
  });

  describe("Schema Validation", () => {
    test("should validate data on CREATE and warn if invalid", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider 
          schema={testSchema} 
          name="test" 
          logging={true}
          logger={mockLogger}
          persist={false}
        >
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const invalidData = { id: "1", name: "Invalid", count: "not a number" as unknown as number };

      act(() => {
        result.current.state.create(invalidData);
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("[test] Schema validation failed"),
        expect.any(Error)
      );
      // Should still set the invalid data
      expect(result.current.data).toEqual(invalidData);
    });

    test("should validate data on UPDATE and warn if invalid", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      const initialData: TestData = { id: "1", name: "Valid", count: 1 };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider 
          schema={testSchema} 
          name="test" 
          initialData={initialData}
          logging={true}
          logger={mockLogger}
          persist={false}
        >
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.update({ count: "invalid" as unknown as number });
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("[test] Schema validation failed on update"),
        expect.any(Error)
      );
      // Should still update with invalid data
      expect(result.current.data).toEqual({ id: "1", name: "Valid", count: "invalid" });
    });
  });

  describe("Logging", () => {
    test("should log actions when logging is enabled", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider 
          schema={testSchema} 
          name="test" 
          logging={true}
          logger={mockLogger}
          persist={false}
        >
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });
      const newData: TestData = { id: "1", name: "Log", count: 1 };

      act(() => {
        result.current.state.create(newData);
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        "[test] Action: CREATE",
        newData
      );
    });

    test("should not log when logging is disabled (default)", () => {
      const { StateMachineProvider, useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StateMachineProvider 
          schema={testSchema} 
          name="test"
          logger={mockLogger}
          persist={false}
        >
          {children}
        </StateMachineProvider>
      );

      const { result } = renderHook(() => useStateMachine(), { wrapper });

      act(() => {
        result.current.state.create({ id: "1", name: "NoLog", count: 1 });
      });

      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    test("should throw error when hook is used outside provider", () => {
      const { useStateMachine } = createStateMachine<TestData>("TestMachine");
      
      const consoleError = spyOn(console, "error").mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useStateMachine());
      }).toThrow("TestMachine must be used within TestMachineProvider");
      
      consoleError.mockRestore();
    });
  });
});