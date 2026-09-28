export const formatPrice = (amount: number, currency = "EUR"): string =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
