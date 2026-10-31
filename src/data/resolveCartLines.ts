import type { CartLineRecord, Product } from "./types";

export type ResolvedCartLine = {
  productId?: string;
  variantId: string;
  quantity: number;
  status: "ready" | "missing" | "unavailable";
  title?: string;
  variantName?: string;
  unitPriceMinor?: number;
  lineTotalMinor?: number;
  imageColor?: string;
  imageKey?: string;
};

export function resolveCartLines(products: Product[], lines: CartLineRecord[]): ResolvedCartLine[] {
  const variants = new Map<string, { product: Product; variant: Product["variants"][number] }>();
  for (const product of products) {
    for (const variant of product.variants) {
      variants.set(variant.id, { product, variant });
    }
  }

  return lines.map((line) => {
    const match = variants.get(line.variantId);
    if (!match) {
      return {
        variantId: line.variantId,
        quantity: line.quantity,
        status: "missing",
      };
    }
    if (!match.variant.available) {
      return {
        variantId: line.variantId,
        quantity: line.quantity,
        status: "unavailable",
        productId: match.product.id,
        title: match.product.title,
        variantName: match.variant.name,
        unitPriceMinor: match.variant.priceMinor,
        imageColor: match.product.imageColor,
        imageKey: match.product.imageKey,
      };
    }
    return {
      variantId: line.variantId,
      quantity: line.quantity,
      status: "ready",
      productId: match.product.id,
      title: match.product.title,
      variantName: match.variant.name,
      unitPriceMinor: match.variant.priceMinor,
      lineTotalMinor: match.variant.priceMinor * line.quantity,
      imageColor: match.product.imageColor,
      imageKey: match.product.imageKey,
    };
  });
}

export function subtotalMinor(lines: ResolvedCartLine[]): number {
  return lines.reduce((sum, line) => {
    if (line.status !== "ready" || line.lineTotalMinor === undefined) {
      return sum;
    }
    return sum + line.lineTotalMinor;
  }, 0);
}

export function canCheckout(lines: ResolvedCartLine[]): boolean {
  return lines.length > 0 && lines.every((line) => line.status === "ready");
}
