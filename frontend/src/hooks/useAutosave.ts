import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface AutosaveOptions {
  key: string;
  data: any;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutosave({
  key,
  data,
  enabled = true,
  debounceMs = 2000,
}: AutosaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousDataRef = useRef<string | undefined>(undefined);

  const save = useCallback(() => {
    if (!enabled) return;

    const dataString = JSON.stringify(data);

    if (dataString === previousDataRef.current) return;

    try {
      localStorage.setItem(key, dataString);
      previousDataRef.current = dataString;
      console.log("💾 Autosaved:", key);
    } catch (error) {
      console.error("Autosave error:", error);
      toast.error("Failed to autosave form data");
    }
  }, [key, data, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled, save]);

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
      previousDataRef.current = undefined;
      console.log("🗑️ Cleared autosave:", key);
    } catch (error) {
      console.error("Clear autosave error:", error);
    }
  }, [key]);

  const loadSaved = useCallback((): any | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        previousDataRef.current = saved;
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Load autosave error:", error);
      return null;
    }
  }, [key]);

  return {
    clearSaved,
    loadSaved,
  };
}
