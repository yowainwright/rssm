import { z } from "zod";

/**
 * Standard action types for state machine
 */
export type ActionType = "CREATE" | "READ" | "UPDATE" | "DESTROY" | "SET_LOADING" | "SET_ERROR" | "RESET";

export interface Action<T> {
  type: ActionType;
  payload?: T | Partial<T> | boolean | string | null;
}

export interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface Logger {
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export interface RssmProviderProps<T> {
  children: React.ReactNode;
  schema: z.ZodSchema<T>;
  initialData?: T | null;
  name: string;
  persist?: boolean;
  ttl?: number | null;
  encrypt?: boolean;
  logging?: boolean;
  logger?: Logger;
}

export interface RssmConfig<T> {
  name: string;
  schema: z.ZodSchema<T>;
  persist?: boolean;
  ttl?: number | null;
  encrypt?: boolean;
  logging?: boolean;
  logger?: Logger;
}

export interface RssmContextValue<T> {
  state: State<T>;
  dispatch: React.Dispatch<Action<T>>;
}

export interface RssmActions<T> {
  create: (data: T) => void;
  read: (data: T) => void;
  update: (data: Partial<T>) => void;
  destroy: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export interface RssmHookReturn<T> extends State<T> {
  actions: RssmActions<T>;
}