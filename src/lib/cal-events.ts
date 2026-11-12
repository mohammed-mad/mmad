import { bookingConfig } from "@/config/booking";

export interface EventPrice {
  /** Amount in the currency's main unit, e.g. 65 for €65 */
  amount: number;
  /** ISO 4217 code, upper case, e.g. "EUR" */
  currency: string;
}

const cache = new Map<string, Promise<EventPrice | null>>();

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/** Cal.com stores prices in the currency's smallest unit (cents); convert to the main unit. */
const fromMinorUnits = (amount: number, currency: string): number => {
  const digits = new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return amount / 10 ** digits;
};

/** An amount in dirhams written in the event description, e.g. "Price: 650 MAD" or "650 DH". */
const DIRHAM_PRICE = /(\d{1,6}(?:[.,]\d{1,2})?)\s*(?:MAD|DHS?|dirhams?)(?![a-z])/i;

/** Price from the event's payment settings, in whatever currency Cal.com charges. */
const parsePaymentPrice = (event: Record<string, unknown>): EventPrice | null => {
  const { price, currency } = event;
  if (typeof price !== "number" || price <= 0 || typeof currency !== "string" || !currency) return null;
  const code = currency.toUpperCase();
  try {
    return { amount: fromMinorUnits(price, code), currency: code };
  } catch {
    return null;
  }
};

/** Price in dirhams written in the event description, for events without online payment. */
const parseDescriptionPrice = (event: Record<string, unknown>): EventPrice | null => {
  if (typeof event.description !== "string") return null;
  const text = event.description.replace(/<[^>]*>/g, " ");
  const match = DIRHAM_PRICE.exec(text);
  if (!match) return null;
  const amount = Number(match[1].replace(",", "."));
  return Number.isFinite(amount) && amount > 0 ? { amount, currency: "MAD" } : null;
};

const parsePrice = (body: unknown): EventPrice | null => {
  if (!isRecord(body)) return null;
  const event = Array.isArray(body.data) ? body.data[0] : body.data;
  if (!isRecord(event)) return null;
  return parsePaymentPrice(event) ?? parseDescriptionPrice(event);
};

const requestPrice = async (eventSlug: string): Promise<EventPrice | null> => {
  const params = new URLSearchParams({ username: bookingConfig.calUsername, eventSlug });
  const response = await fetch(`${bookingConfig.calApiUrl}/event-types?${params.toString()}`, {
    headers: { "cal-api-version": bookingConfig.calApiVersion },
  });
  if (!response.ok) return null;
  return parsePrice(await response.json());
};

/**
 * Price set on the Cal.com event type (payment settings first, then a dirham
 * amount in the description), or null when the event has no price,
 * booking is not configured, or Cal.com cannot be reached. Fetched once per
 * event per page load.
 */
export const fetchEventPrice = (eventSlug: string): Promise<EventPrice | null> => {
  if (!bookingConfig.isConfigured || !eventSlug) return Promise.resolve(null);
  const cached = cache.get(eventSlug);
  if (cached) return cached;
  const request = requestPrice(eventSlug).catch(() => null);
  cache.set(eventSlug, request);
  return request;
};
