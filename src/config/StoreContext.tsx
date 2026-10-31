import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { navigationRef } from "../navigation/rootRef";
import { defaultStoreId, getStore, stores, type StoreConfig } from "./stores";

type StoreContextValue = {
  store: StoreConfig;
  selectStore: (storeId: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeId, setStoreId] = useState(defaultStoreId);
  const [resetToken, setResetToken] = useState(0);
  const store = getStore(storeId) ?? stores[0];

  const selectStore = (nextStoreId: string) => {
    if (!getStore(nextStoreId)) {
      return;
    }
    // Entering from Welcome still needs to open the default store.
    if (nextStoreId === storeId && navigationRef.getCurrentRoute()?.name !== "Welcome") {
      return;
    }
    setStoreId(nextStoreId);
    setResetToken((token) => token + 1);
  };

  useLayoutEffect(() => {
    if (resetToken === 0) {
      return;
    }
    const resetHome = () => {
      if (!navigationRef.isReady()) {
        return false;
      }
      navigationRef.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      return true;
    };
    if (resetHome()) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      resetHome();
    });
    return () => cancelAnimationFrame(frame);
  }, [resetToken]);

  if (!store) {
    return null;
  }

  return <StoreContext.Provider value={{ store, selectStore }}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return value;
}
