export type Variant = {
  id: string;
  name: string;
  priceMinor: number;
  available: boolean;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  imageColor: string;
  imageKey: string;
  variants: Variant[];
};

export type CartLineRecord = {
  variantId: string;
  quantity: number;
};
