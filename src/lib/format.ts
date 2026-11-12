/** Dirhams read as "650 MAD"; other currencies use their symbol, e.g. "€65". */
export const formatPrice = (amount: number, currency: string): string =>
  currency === "MAD"
    ? `${new Intl.NumberFormat("en-IE", { maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(amount)} MAD`
    : new Intl.NumberFormat("en-IE", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(amount);
