import { useCallback, useEffect, useRef, useState } from "react";

type ResourceState<T> = {
  key: string;
  phase: "loading" | "ready" | "error";
  data: T | null;
  error: string | null;
};

export function useAsyncResource<T>(key: string, loader: () => Promise<T>) {
  const [state, setState] = useState<ResourceState<T>>({
    key,
    phase: "loading",
    data: null,
    error: null,
  });
  const sequence = useRef(0);

  const run = useCallback(async () => {
    const token = ++sequence.current;
    setState({ key, phase: "loading", data: null, error: null });
    try {
      const data = await loader();
      if (token !== sequence.current) {
        return;
      }
      setState({ key, phase: "ready", data, error: null });
    } catch (error) {
      if (token !== sequence.current) {
        return;
      }
      setState({
        key,
        phase: "error",
        data: null,
        error: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }, [key, loader]);

  useEffect(() => {
    void run();
  }, [run]);

  const current = state.key === key ? state : { key, phase: "loading" as const, data: null, error: null };

  return {
    phase: current.phase,
    data: current.data,
    error: current.error,
    retry: run,
  };
}
