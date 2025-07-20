import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// User preferences hook
interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  sidebarCollapsed: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  compactMode: boolean;
  autoSave: boolean;
  language: string;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  sidebarCollapsed: false,
  soundEnabled: false,
  animationsEnabled: true,
  compactMode: false,
  autoSave: true,
  language: 'en',
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'neocore-preferences',
    defaultPreferences
  );

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    preferences,
    updatePreference,
    setPreferences,
  };
}

// Recent searches hook
export function useRecentSearches(maxItems: number = 10) {
  const [searches, setSearches] = useLocalStorage<string[]>('neocore-recent-searches', []);

  const addSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearches(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, maxItems);
    });
  };

  const removeSearch = (query: string) => {
    setSearches(prev => prev.filter(item => item !== query));
  };

  const clearSearches = () => {
    setSearches([]);
  };

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}

// Draft auto-save hook
export function useAutoSave<T>(
  key: string,
  data: T,
  delay: number = 1000
) {
  const [, setDraft] = useLocalStorage(`${key}-draft`, data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDraft(data);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay, key, setDraft]);

  const clearDraft = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`${key}-draft`);
    }
  };

  const loadDraft = (): T | null => {
    if (typeof window === "undefined") return null;
    
    try {
      const draft = window.localStorage.getItem(`${key}-draft`);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  };

  return { clearDraft, loadDraft };
}