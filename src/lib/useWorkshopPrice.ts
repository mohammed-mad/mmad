import { useEffect, useState } from "react";
import type { Workshop } from "@/types/workshop";
import { fetchEventPrice, type EventPrice } from "@/lib/cal-events";
import { formatPrice } from "@/lib/format";

/** Formatted price of a workshop as set in Cal.com, or null while loading or when none is set. */
export const useWorkshopPrice = (workshop: Pick<Workshop, "calEventSlug" | "active"> | undefined): string | null => {
  const slug = workshop?.active ? workshop.calEventSlug : "";
  const [price, setPrice] = useState<EventPrice | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPrice(null);
    fetchEventPrice(slug).then((result) => {
      if (!cancelled) setPrice(result);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return price ? formatPrice(price.amount, price.currency) : null;
};
