import type { Workshop } from "@/types/workshop";
import { formatPrice } from "@/lib/format";

/** Derived only from the shared, refreshed Cal.com event data. */
export const useWorkshopPrice = (workshop: Pick<Workshop, "event"> | undefined): string | null => {
  const price = workshop?.event?.price;
  return price ? formatPrice(price.amount, price.currency) : null;
};
