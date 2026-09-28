import { bookingConfig } from "@/config/booking";

/** Cal.com booking link (`username/event-slug`) or null when booking is not configured. */
export const buildCalLink = (eventSlug: string): string | null =>
  bookingConfig.isConfigured && eventSlug ? `${bookingConfig.calUsername}/${eventSlug}` : null;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/** UTM parameters present in a query string, to forward to Cal.com. */
export const pickUtmParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) result[key] = value;
  }
  return result;
};
