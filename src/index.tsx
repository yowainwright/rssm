import { createContext, useContext, useReducer, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import isEqual from "react-fast-compare";
import storage from "localstorage-slim";
import type {
  Action,
  State,
  RssmProviderProps,
  RssmConfig,
  RssmContextValue,
  RssmHookReturn,
} from "./types";

function createReducer<T>(
  config: RssmConfig<T>,
  debouncedPersist: (state: State<T>) => void,
) {
  const log = config.logger || console;

  return (state: State<T>, action: Action<T>): State<T> => {
    if (config.logging) {
      log.info(`[${config.name}] Action: ${action.type}`, action.payload);
    }

    switch (action.type) {
      case "CREATE":
      case "READ": {
        let data = action.payload as T;

        try {
          data = config.schema.parse(action.payload);
        } catch (error) {
          if (config.logging) {
            log.warn(
              `[${config.name}] Schema validation failed, using unvalidated data:`,
              error,
            );
          }
        }

        const newState = {
          data,
          loading: false,
          error: null,
        };

        if (config.persist) {
          try {
            storage.set(config.name, newState, {
              ttl: config.ttl || 0,
              encrypt: config.encrypt,
            });
            if (config.logging) {
              log.info(`[${config.name}] Persisted to localStorage`);
            }
          } catch (error) {
            if (config.logging) {
              log.error(
                `[${config.name}] Failed to persist to localStorage:`,
                error,
              );
            }
          }
        }

        return newState;
      }

      case "UPDATE": {
        const currentData = state.data;
        let newData = currentData
          ? { ...currentData, ...(action.payload as Partial<T>) }
          : (action.payload as T);

        if (currentData && isEqual(currentData, newData)) {
          if (config.logging) {
            log.info(`[${config.name}] No changes detected, skipping update`);
          }
          return state;
        }

        try {
          newData = config.schema.parse(newData);
        } catch (error) {
          if (config.logging) {
            log.warn(
              `[${config.name}] Schema validation failed on update, using unvalidated data:`,
              error,
            );
          }
        }

        const newState = {
          ...state,
          data: newData,
          error: null,
        };

        if (config.persist) {
          debouncedPersist(newState);
        }

        return newState;
      }

      case "DESTROY": {
        const newState = {
          data: null,
          loading: false,
          error: null,
        };

        if (config.persist) {
          try {
            storage.remove(config.name);
            if (config.logging) {
              log.info(`[${config.name}] Removed from localStorage`);
            }
          } catch (error) {
            if (config.logging) {
              log.error(
                `[${config.name}] Failed to remove from localStorage:`,
                error,
              );
            }
          }
        }

        return newState;
      }

      case "SET_LOADING": {
        if (state.loading === (action.payload as boolean)) {
          return state;
        }

        const newState = {
          ...state,
          loading: action.payload as boolean,
        };

        if (config.persist) {
          debouncedPersist(newState);
        }

        return newState;
      }

      case "SET_ERROR": {
        if (state.error === (action.payload as string | null)) {
          return state;
        }

        const newState = {
          ...state,
          error: action.payload as string | null,
          loading: false,
        };

        if (config.persist) {
          debouncedPersist(newState);
          if (config.logging && action.payload) {
            log.warn(
              `[${config.name}] Error state will be persisted:`,
              action.payload,
            );
          }
        }

        return newState;
      }

      case "RESET": {
        const newState = {
          data: null,
          loading: false,
          error: null,
        };

        if (config.persist) {
          try {
            storage.remove(config.name);
            if (config.logging) {
              log.info(`[${config.name}] Reset and removed from localStorage`);
            }
          } catch (error) {
            if (config.logging) {
              log.error(
                `[${config.name}] Failed to reset localStorage:`,
                error,
              );
            }
          }
        }

        return newState;
      }

      default:
        return state;
    }
  };
}

export function createRssm<T>(name: string) {
  const Context = createContext<RssmContextValue<T> | undefined>(undefined);

  function RssmProvider({
    children,
    schema,
    name,
    initialData = null,
    persist = true,
    ttl = null,
    encrypt = false,
    logging = false,
    logger = console,
    debounceDelay = 500,
  }: RssmProviderProps<T>) {
    const config: RssmConfig<T> = {
      name,
      schema,
      persist,
      ttl,
      encrypt,
      logging,
      logger,
    };

    const debouncedPersist = useDebouncedCallback((state: State<T>) => {
      try {
        storage.set(config.name, state, {
          ttl: config.ttl || 0,
          encrypt: config.encrypt,
        });
        if (config.logging) {
          logger.info(`[${config.name}] Debounced persist to localStorage`);
        }
      } catch (error) {
        if (config.logging) {
          logger.error(
            `[${config.name}] Failed to persist to localStorage:`,
            error,
          );
        }
      }
    }, debounceDelay);

    const reducer = createReducer<T>(config, debouncedPersist);

    const getInitialState = (): State<T> => {
      if (persist) {
        try {
          const stored = storage.get<State<T>>(name);
          if (stored && stored.data) {
            try {
              stored.data = schema.parse(stored.data);
              if (logging) {
                logger.info(`[${name}] Loaded from localStorage`, stored);
              }
            } catch (error) {
              if (logging) {
                logger.warn(
                  `[${name}] Stored data failed schema validation, using as-is:`,
                  error,
                );
              }
            }
            return stored;
          }
        } catch (error) {
          if (logging) {
            logger.error(`[${name}] Failed to load from localStorage:`, error);
          }
        }
      }

      let validatedInitialData = initialData;
      if (initialData) {
        try {
          validatedInitialData = schema.parse(initialData);
        } catch (error) {
          if (logging) {
            logger.warn(
              `[${name}] Initial data failed schema validation, using as-is:`,
              error,
            );
          }
        }
      }

      return {
        data: validatedInitialData,
        loading: false,
        error: null,
      };
    };

    const [state, dispatch] = useReducer(reducer, getInitialState());

    useEffect(() => {
      return () => {
        debouncedPersist.flush();
      };
    }, [debouncedPersist]);

    return (
      <Context.Provider value={{ state, dispatch }}>
        {children}
      </Context.Provider>
    );
  }

  function useRssm(): RssmHookReturn<T> {
    const context = useContext(Context);

    if (!context) {
      throw new Error(`${name} must be used within ${name}Provider`);
    }

    const { state, dispatch } = context;

    return {
      ...state,
      actions: {
        create: (data: T) => dispatch({ type: "CREATE", payload: data }),
        read: (data: T) => dispatch({ type: "READ", payload: data }),
        update: (data: Partial<T>) =>
          dispatch({ type: "UPDATE", payload: data }),
        destroy: () => dispatch({ type: "DESTROY" }),
        setLoading: (loading: boolean) =>
          dispatch({ type: "SET_LOADING", payload: loading }),
        setError: (error: string | null) =>
          dispatch({ type: "SET_ERROR", payload: error }),
        reset: () => dispatch({ type: "RESET" }),
      },
    };
  }

  return {
    RssmProvider,
    useRssm,
  };
}

export type {
  RssmProviderProps,
  RssmHookReturn,
  State,
  Logger,
  RssmActions,
} from "./types";
