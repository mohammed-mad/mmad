import { bookingConfig } from "@/config/booking";

export interface EventPrice { amount: number; currency: string }
export interface CalEventDetails {
  slug: string;
  durationMinutes: number | null;
  price: EventPrice | null;
  duoPrice: EventPrice | null;
  venue: string | null;
  locationType: string | null;
  capacity: number | null;
  seated: boolean;
  onlinePayment: boolean;
  dateRange: { start: string; end: string } | null;
  nextSession: { start: string; end: string; remaining: number | null } | null;
}

export const CAL_REFRESH_MS = 30_000;
const cache = new Map<string, { at: number; request: Promise<CalEventDetails | null> }>();
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));
const positive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

/** Strip markup without rendering Cal.com description HTML. Preserve lines for labelled prices. */
export function descriptionText(value: unknown): string {
  return typeof value === "string" ? value.replace(/<\/(?:p|div|li)>|<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&") : "";
}

function descriptionAmount(text: string): EventPrice | null {
  const match = /(\d{1,3}(?:[ ,.\u00a0]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*(MAD|DHS?|dirhams?|EUR|USD|GBP)\b/i.exec(text);
  if (!match) return null;
  const raw = match[1].replace(/\s/g, "");
  const decimal = /[.,](\d{1,2})$/.exec(raw);
  const amount = decimal ? Number(`${raw.slice(0, decimal.index).replace(/[.,]/g, "")}.${decimal[1]}`) : Number(raw.replace(/[.,]/g, ""));
  const currency = /^(?:MAD|DHS?|dirhams?)$/i.test(match[2]) ? "MAD" : match[2].toUpperCase();
  return positive(amount) ? { amount, currency } : null;
}

/** All business values originate in Cal.com; missing values stay missing. */
export function parseCalEvent(value: unknown, slug: string): CalEventDetails | null {
  if (!isRecord(value) || value.slug !== slug) return null;
  const text = descriptionText(value.description);
  const duoLine = text.split(/\n/).find((line) => /(?:duo|offre\s+(?:pour\s+)?deux)/i.test(line));
  const duoPrice = duoLine ? descriptionAmount(duoLine) : null;
  // Never interpret a duo-only amount as an individual price.
  const individualText = text.split(/\n/).filter((line) => !/(?:duo|offre\s+(?:pour\s+)?deux)/i.test(line)).join("\n");
  const priceLine = individualText.split(/\n/).find((line) => /(?:price|prix|tarif|per\s+person|par\s+personne)/i.test(line));
  let price = descriptionAmount(priceLine ?? individualText);
  const onlinePayment = positive(value.price) && typeof value.currency === "string";
  if (onlinePayment) {
    try {
      const currency = (value.currency as string).toUpperCase();
      const digits = new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
      price = { amount: (value.price as number) / 10 ** digits, currency };
    } catch { price = null; }
  }
  const locations = Array.isArray(value.locations) ? value.locations.filter(isRecord) : [];
  const location = locations[0];
  const venue = location && [location.address, location.link, location.phone, location.phoneNumber, location.label].find((item) => typeof item === "string" && item.trim());
  const seats = isRecord(value.seats) ? value.seats : null;
  const seated = seats?.disabled === false && positive(seats.seatsPerTimeSlot);
  const window = isRecord(value.bookingWindow) ? value.bookingWindow : null;
  const range = window?.type === "range" && Array.isArray(window.value) && window.value.length === 2 && window.value.every((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) ? window.value as string[] : null;
  return {
    slug,
    durationMinutes: positive(value.lengthInMinutes) ? value.lengthInMinutes : null,
    price,
    duoPrice: duoPrice && (!price || duoPrice.currency === price.currency) ? duoPrice : null,
    venue: typeof venue === "string" ? venue : null,
    locationType: typeof location?.type === "string" ? location.type : null,
    capacity: seated ? seats!.seatsPerTimeSlot as number : null,
    seated,
    onlinePayment,
    dateRange: range ? { start: range[0], end: range[1] } : null,
    nextSession: null,
  };
}

export async function fetchCalEvent(slug: string, fresh = false): Promise<CalEventDetails | null> {
  if (!slug || !bookingConfig.isConfigured) return null;
  const key = `${bookingConfig.calUsername}/${slug}`;
  const entry = cache.get(key);
  if (!fresh && entry && Date.now() - entry.at < CAL_REFRESH_MS) return entry.request;
  const request = (async () => {
    const params = new URLSearchParams({ username: bookingConfig.calUsername, eventSlug: slug });
    const response = await fetch(`${bookingConfig.calApiUrl}/event-types?${params}`, { cache: "no-store", headers: { "cal-api-version": bookingConfig.calApiVersion } });
    if (!response.ok) throw new Error(`event type ${response.status}`);
    const body: unknown = await response.json();
    const data = isRecord(body) ? body.data : null;
    return parseCalEvent(Array.isArray(data) ? data[0] : data, slug);
  })();
  cache.set(key, { at: Date.now(), request });
  request.catch(() => { if (cache.get(key)?.request === request) cache.delete(key); });
  return request;
}

/** Preview the next real available session; the booking calendar fetches its full selected month. */
export async function fetchNextSession(event: CalEventDetails): Promise<CalEventDetails["nextSession"]> {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const from = event.dateRange && event.dateRange.start > today ? event.dateRange.start : today;
  if (event.dateRange && event.dateRange.end < from) return null;
  const horizon = new Date(`${from}T12:00:00Z`);
  horizon.setUTCMonth(horizon.getUTCMonth() + 6);
  const limit = horizon.toISOString().slice(0, 10);
  const to = event.dateRange && event.dateRange.end < limit ? event.dateRange.end : limit;
  const params = new URLSearchParams({ username: bookingConfig.calUsername, eventTypeSlug: event.slug, start: from, end: to, timeZone: "Africa/Casablanca" });
  const response = await fetch(`${bookingConfig.calApiUrl}/slots?${params}`, { cache: "no-store", headers: { "cal-api-version": "2024-09-04" } });
  if (!response.ok) throw new Error(`slots ${response.status}`);
  const body: unknown = await response.json();
  const data = isRecord(body) && isRecord(body.data) ? body.data : {};
  const slots = Object.values(data).flat().filter(isRecord).filter((slot) => typeof slot.start === "string" && Number.isFinite(new Date(slot.start).getTime()) && new Date(slot.start).getTime() > Date.now() && !(typeof slot.seatsRemaining === "number" && slot.seatsRemaining <= 0));
  slots.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());
  const first = slots[0];
  if (!first || !event.durationMinutes) return null;
  return { start: first.start as string, end: new Date(new Date(first.start as string).getTime() + event.durationMinutes * 60_000).toISOString(), remaining: typeof first.seatsRemaining === "number" ? first.seatsRemaining : null };
}
