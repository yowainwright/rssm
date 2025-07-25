interface StorageOptions {
  ttl?: number | null; // Time to live in seconds
  encrypt?: boolean;
}

interface StorageItem<T> {
  value: T;
  expires?: number;
}

class LocalStorage {
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private encode<T>(value: T, encrypt: boolean): string {
    const json = JSON.stringify(value);
    if (encrypt && typeof window !== 'undefined' && window.btoa) {
      // Simple base64 encoding for demo. In production, use proper encryption
      return btoa(encodeURIComponent(json));
    }
    return json;
  }

  private decode<T>(value: string, decrypt: boolean): T {
    if (decrypt && typeof window !== 'undefined' && window.atob) {
      try {
        return JSON.parse(decodeURIComponent(atob(value)));
      } catch {
        // If decryption fails, try parsing as regular JSON
        return JSON.parse(value);
      }
    }
    return JSON.parse(value);
  }

  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }

    const { ttl, encrypt = false } = options;
    
    const item: StorageItem<T> = {
      value,
      expires: ttl ? Date.now() + (ttl * 1000) : undefined,
    };

    try {
      const encoded = this.encode(item, encrypt);
      window.localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded');
      }
    }
  }

  get<T>(key: string, options: { decrypt?: boolean } = {}): T | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const item = this.decode<StorageItem<T>>(stored, options.decrypt || false);
      
      // Check if item has expired
      if (item.expires && Date.now() > item.expires) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Get all keys with optional prefix filter
  keys(prefix?: string): string[] {
    if (!this.isStorageAvailable()) {
      return [];
    }

    try {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && (!prefix || key.startsWith(prefix))) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Failed to get keys from localStorage:', error);
      return [];
    }
  }

  // Clean up expired items
  cleanup(prefix?: string): void {
    const keys = this.keys(prefix);
    
    keys.forEach(key => {
      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) return;

        const item = JSON.parse(stored) as StorageItem<unknown>;
        if (item.expires && Date.now() > item.expires) {
          this.remove(key);
        }
      } catch {
        // If we can't parse it, leave it alone
      }
    });
  }
}

// Export singleton instance
export const storage = new LocalStorage();