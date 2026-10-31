const FALLBACK_MINOR_DIGITS: Record<string, number> = {
  BHD: 3,
  IQD: 3,
  JPY: 0,
  KRW: 0,
  KWD: 3,
  OMR: 3,
  VND: 0,
};

export function minorUnitDigits(currency: string): number {
  const code = currency.toUpperCase();
  try {
    const digits = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).resolvedOptions().maximumFractionDigits;
    if (typeof digits === "number") {
      return digits;
    }
  } catch {
    // Invalid codes fall through to the fallback table.
  }
  return FALLBACK_MINOR_DIGITS[code] ?? 2;
}

export function formatMoney(amountMinor: number, currency: string): string {
  const digits = minorUnitDigits(currency);
  const major = amountMinor / 10 ** digits;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(major);
}
