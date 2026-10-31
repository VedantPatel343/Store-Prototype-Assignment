export type StoreColors = {
  background: string;
  surface: string;
  text: string;
  accent: string;
  muted: string;
  onAccent: string;
  line: string;
  warning: string;
};

export type StoreConfig = {
  id: string;
  name: string;
  tagline: string;
  promoLabel: string;
  heroImageKey: string;
  currency: string;
  catalogId: string;
  colors: StoreColors;
  statusBar: "light" | "dark";
  featureReviews: boolean;
  radius: number;
  displayFont?: "serif";
};

export const stores: StoreConfig[] = [
  {
    id: "apex",
    name: "THREAD & FORM",
    tagline: "Everyday layers. Your own rhythm.",
    promoLabel: "The everyday wardrobe",
    heroImageKey: "thread-hero",
    currency: "USD",
    catalogId: "apex",
    statusBar: "light",
    featureReviews: true,
    radius: 0,
    colors: {
      background: "#070707",
      surface: "#141414",
      text: "#F5F5F2",
      accent: "#FFFFFF",
      muted: "#A3A39C",
      onAccent: "#111111",
      line: "#2A2A2A",
      warning: "#E7C4A8",
    },
  },
  {
    id: "northline",
    name: "STILL HOME",
    tagline: "Thoughtful objects. Quieter spaces.",
    promoLabel: "Objects for everyday living",
    heroImageKey: "still-hero",
    currency: "JPY",
    catalogId: "northline",
    statusBar: "dark",
    featureReviews: false,
    radius: 10,
    displayFont: "serif",
    colors: {
      background: "#F3EFE6",
      surface: "#FFFCF7",
      text: "#1A2422",
      accent: "#0E5C56",
      muted: "#5C6B68",
      onAccent: "#F7FFFE",
      line: "#E4DCD0",
      warning: "#8C3D24",
    },
  },
];

export const defaultStoreId = stores[0]?.id ?? "apex";

export function getStore(storeId: string): StoreConfig | undefined {
  return stores.find((store) => store.id === storeId);
}
