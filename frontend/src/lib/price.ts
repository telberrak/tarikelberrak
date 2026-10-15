// Admin forms take dollars ("9.99"); the API stores integer cents.
export function dollarsToCents(raw: FormDataEntryValue | null): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : 0;
}

export function centsToDollarsInput(cents: number | undefined): string {
  return cents && cents > 0 ? (cents / 100).toFixed(2) : "";
}
