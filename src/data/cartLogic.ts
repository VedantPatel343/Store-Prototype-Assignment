import type { CartLineRecord } from "./types";

export function addVariantToLines(
  lines: CartLineRecord[],
  variantId: string,
  available: boolean,
): CartLineRecord[] {
  if (!available || variantId.trim() === "") {
    return lines;
  }
  const existing = lines.find((line) => line.variantId === variantId);
  if (!existing) {
    return [...lines, { variantId, quantity: 1 }];
  }
  return lines.map((line) =>
    line.variantId === variantId ? { ...line, quantity: line.quantity + 1 } : line,
  );
}

export function setLineQuantity(
  lines: CartLineRecord[],
  variantId: string,
  quantity: number,
): CartLineRecord[] {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return lines;
  }
  if (!lines.some((line) => line.variantId === variantId)) {
    return lines;
  }
  return lines.map((line) =>
    line.variantId === variantId ? { ...line, quantity } : line,
  );
}

export function removeCartLine(lines: CartLineRecord[], variantId: string): CartLineRecord[] {
  return lines.filter((line) => line.variantId !== variantId);
}

export function cartCount(lines: CartLineRecord[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function sanitizeCartLines(lines: unknown): CartLineRecord[] {
  if (!Array.isArray(lines)) {
    return [];
  }
  return lines.flatMap((line) => {
    if (!line || typeof line !== "object") {
      return [];
    }
    const record = line as { variantId?: unknown; quantity?: unknown };
    if (typeof record.variantId !== "string" || record.variantId.trim() === "") {
      return [];
    }
    const quantity =
      typeof record.quantity === "number" && Number.isInteger(record.quantity) && record.quantity >= 1
        ? record.quantity
        : 1;
    return [{ variantId: record.variantId, quantity }];
  });
}
