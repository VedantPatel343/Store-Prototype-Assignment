import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addVariantToLines, removeCartLine, sanitizeCartLines, setLineQuantity } from "./cartLogic";
import type { CartLineRecord } from "./types";

const EMPTY_LINES: CartLineRecord[] = [];

type CartState = {
  cartsByStoreId: Record<string, CartLineRecord[]>;
  addVariant: (storeId: string, variantId: string, available: boolean) => void;
  setQuantity: (storeId: string, variantId: string, quantity: number) => void;
  removeLine: (storeId: string, variantId: string) => void;
  insertSavedLine: (storeId: string, variantId: string) => void;
};

let runAfterHydration = (action: () => void) => {
  action();
};
// Reassigned once the store exists so cart writes wait for AsyncStorage hydration.

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartsByStoreId: {},
      addVariant: (storeId, variantId, available) => {
        runAfterHydration(() => {
          set((state) => ({
            cartsByStoreId: {
              ...state.cartsByStoreId,
              [storeId]: addVariantToLines(state.cartsByStoreId[storeId] ?? [], variantId, available),
            },
          }));
        });
      },
      setQuantity: (storeId, variantId, quantity) => {
        runAfterHydration(() => {
          set((state) => ({
            cartsByStoreId: {
              ...state.cartsByStoreId,
              [storeId]: setLineQuantity(state.cartsByStoreId[storeId] ?? [], variantId, quantity),
            },
          }));
        });
      },
      removeLine: (storeId, variantId) => {
        runAfterHydration(() => {
          set((state) => ({
            cartsByStoreId: {
              ...state.cartsByStoreId,
              [storeId]: removeCartLine(state.cartsByStoreId[storeId] ?? [], variantId),
            },
          }));
        });
      },
      insertSavedLine: (storeId, variantId) => {
        runAfterHydration(() => {
          set((state) => ({
            cartsByStoreId: {
              ...state.cartsByStoreId,
              [storeId]: addVariantToLines(state.cartsByStoreId[storeId] ?? [], variantId, true),
            },
          }));
        });
      },
    }),
    {
      name: "carts-by-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cartsByStoreId: state.cartsByStoreId }),
      merge: (persisted, current) => {
        const stored = persisted as { cartsByStoreId?: Record<string, unknown> } | undefined;
        const cartsByStoreId: Record<string, CartLineRecord[]> = {};
        for (const [storeId, lines] of Object.entries(stored?.cartsByStoreId ?? {})) {
          cartsByStoreId[storeId] = sanitizeCartLines(lines);
        }
        return { ...current, cartsByStoreId };
      },
    },
  ),
);

runAfterHydration = (action) => {
  if (useCartStore.persist.hasHydrated()) {
    action();
    return;
  }
  const unsubscribe = useCartStore.persist.onFinishHydration(() => {
    unsubscribe();
    action();
  });
};

export function useStoreCartLines(storeId: string): CartLineRecord[] {
  return useCartStore((state) => state.cartsByStoreId[storeId] ?? EMPTY_LINES);
}

export function useCartHydrated(): boolean {
  const [ready, setReady] = useState(() => useCartStore.persist.hasHydrated());

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setReady(true);
    }
    return useCartStore.persist.onFinishHydration(() => {
      setReady(true);
    });
  }, []);

  return ready;
}
