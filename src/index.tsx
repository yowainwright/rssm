import React, { createContext, useContext, useReducer } from "react";
import { storage } from "./storage";
import type {
  Action,
  State,
  RssmProviderProps,
  RssmConfig,
  RssmContextValue,
  RssmHookReturn,
} from "./types";

/**
 * Generic reducer for rssm with localStorage support and schema validation
 */
function createReducer<T>(config: RssmConfig<T>) {
  const log = config.logger || console;
  
  return (state: State<T>, action: Action<T>): State<T> => {
    if (config.logging) {
      log.info(`[${config.name}] Action: ${action.type}`, action.payload);
    }
    
    switch (action.type) {
      case "CREATE":
      case "READ": {
        let data = action.payload as T;
        
        // Try to validate data against schema
        try {
          data = config.schema.parse(action.payload);
        } catch (error) {
          if (config.logging) {
            log.warn(`[${config.name}] Schema validation failed, using unvalidated data:`, error);
          }
        }
        
        const newState = {
          data,
          loading: false,
          error: null,
        };
        
        if (config.persist) {
          try {
            storage.set(config.name, newState, { ttl: config.ttl, encrypt: config.encrypt });
            if (config.logging) {
              log.info(`[${config.name}] Persisted to localStorage`);
            }
          } catch (error) {
            if (config.logging) {
              log.error(`[${config.name}] Failed to persist to localStorage:`, error);
            }
          }
        }
        
        return newState;
      }

      case "UPDATE": {
        let data = state.data 
          ? { ...state.data, ...(action.payload as Partial<T>) }
          : (action.payload as T);
        
        // Try to validate updated data against schema
        try {
          data = config.schema.parse(data);
        } catch (error) {
          if (config.logging) {
            log.warn(`[${config.name}] Schema validation failed on update, using unvalidated data:`, error);
          }
        }
        
        const newState = {
          ...state,
          data,
          error: null,
        };
        
        if (config.persist) {
          try {
            storage.set(config.name, newState, { ttl: config.ttl, encrypt: config.encrypt });
            if (config.logging) {
              log.info(`[${config.name}] Updated in localStorage`);
            }
          } catch (error) {
            if (config.logging) {
              log.error(`[${config.name}] Failed to update localStorage:`, error);
            }
          }
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
              log.error(`[${config.name}] Failed to remove from localStorage:`, error);
            }
          }
        }
        
        return newState;
      }

      case "SET_LOADING": {
        const newState = {
          ...state,
          loading: action.payload as boolean,
        };
        
        if (config.persist) {
          try {
            storage.set(config.name, newState, { ttl: config.ttl, encrypt: config.encrypt });
          } catch (error) {
            if (config.logging) {
              log.error(`[${config.name}] Failed to persist loading state:`, error);
            }
          }
        }
        
        return newState;
      }

      case "SET_ERROR": {
        const newState = {
          ...state,
          error: action.payload as string | null,
          loading: false,
        };
        
        if (config.persist) {
          try {
            storage.set(config.name, newState, { ttl: config.ttl, encrypt: config.encrypt });
            if (config.logging && action.payload) {
              log.warn(`[${config.name}] Error state persisted:`, action.payload);
            }
          } catch (error) {
            if (config.logging) {
              log.error(`[${config.name}] Failed to persist error state:`, error);
            }
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
              log.error(`[${config.name}] Failed to reset localStorage:`, error);
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

/**
 * Create a React Simple Schema State Machine (rssm) with provider and hook
 */
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
    logger = console
  }: RssmProviderProps<T>) {
    const config: RssmConfig<T> = { name, schema, persist, ttl, encrypt, logging, logger };
    const reducer = createReducer<T>(config);
    
    // Load initial state from localStorage if persist is enabled
    const getInitialState = (): State<T> => {
      if (persist) {
        try {
          const stored = storage.get<State<T>>(name, { decrypt: encrypt });
          if (stored && stored.data) {
            // Try to validate stored data against schema
            try {
              stored.data = schema.parse(stored.data);
              if (logging) {
                logger.info(`[${name}] Loaded from localStorage`, stored);
              }
            } catch (error) {
              if (logging) {
                logger.warn(`[${name}] Stored data failed schema validation, using as-is:`, error);
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
      
      // Validate initial data if provided
      let validatedInitialData = initialData;
      if (initialData) {
        try {
          validatedInitialData = schema.parse(initialData);
        } catch (error) {
          if (logging) {
            logger.warn(`[${name}] Initial data failed schema validation, using as-is:`, error);
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
        update: (data: Partial<T>) => dispatch({ type: "UPDATE", payload: data }),
        destroy: () => dispatch({ type: "DESTROY" }),
        setLoading: (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }),
        setError: (error: string | null) => dispatch({ type: "SET_ERROR", payload: error }),
        reset: () => dispatch({ type: "RESET" }),
      },
    };
  }

  return {
    RssmProvider,
    useRssm,
  };
}

// Re-export types
export type { 
  RssmProviderProps, 
  RssmHookReturn, 
  State, 
  Logger,
  RSSMActions 
} from "./types";