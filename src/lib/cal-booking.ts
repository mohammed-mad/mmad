import { bookingConfig } from "@/config/booking";

/**
 * Our own booking flow on top of Cal.com's public API v2: read the free slots
 * of an event type and create the booking. Cal.com stays the source of truth
 * (availability, calendar, confirmation emails); no API key is needed because
 * both endpoints are the same public ones the Cal.com booking page uses.
 */

/** Workshops happen in Casablanca, so times are always shown in the venue's time zone. */
export const VENUE_TIME_ZONE = "Africa/Casablanca";

const SLOTS_API_VERSION = "2024-09-04";
const BOOKINGS_API_VERSION = "2024-08-13";

/** Free start times (ISO strings) grouped by day ("YYYY-MM-DD", venue time). */
export type SlotsByDay = Record<string, string[]>;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/** How long free dates are reused before asking Cal.com again. */
const SLOTS_CACHE_MS = 2 * 60 * 1000;
const slotsCache = new Map<string, { at: number; request: Promise<SlotsByDay> }>();

/** Forget cached free dates, e.g. after a booking failed because a slot was just taken. */
export const clearSlotsCache = () => slotsCache.clear();

/**
 * Available start times for an event between two days (inclusive). Results are
 * reused for a couple of minutes, so revisiting a month or a booking page is instant.
 */
export function fetchSlots(eventSlug: string, startDay: string, endDay: string): Promise<SlotsByDay> {
  const key = `${eventSlug}|${startDay}|${endDay}`;
  const cached = slotsCache.get(key);
  if (cached && Date.now() - cached.at < SLOTS_CACHE_MS) return cached.request;
  const request = requestSlots(eventSlug, startDay, endDay);
  slotsCache.set(key, { at: Date.now(), request });
  request.catch(() => slotsCache.delete(key));
  return request;
}

async function requestSlots(eventSlug: string, startDay: string, endDay: string): Promise<SlotsByDay> {
  const params = new URLSearchParams({
    username: bookingConfig.calUsername,
    eventTypeSlug: eventSlug,
    start: startDay,
    end: endDay,
    timeZone: VENUE_TIME_ZONE,
  });
  const response = await fetch(`${bookingConfig.calApiUrl}/slots?${params.toString()}`, {
    headers: { "cal-api-version": SLOTS_API_VERSION },
  });
  if (!response.ok) throw new Error(`slots ${response.status}`);
  const body: unknown = await response.json();
  const data = isRecord(body) && isRecord(body.data) ? body.data : {};
  const result: SlotsByDay = {};
  for (const [day, slots] of Object.entries(data)) {
    if (!Array.isArray(slots)) continue;
    const starts = slots.map((slot) => (isRecord(slot) && typeof slot.start === "string" ? slot.start : null)).filter((s): s is string => Boolean(s));
    if (starts.length) result[day] = starts;
  }
  return result;
}

export interface BookingRequest {
  eventSlug: string;
  start: string;
  name: string;
  email: string;
  /** International format, e.g. "+212612345678" */
  phone: string;
  /** Full names of the people coming along (no emails needed) */
  guests: string[];
  notes: string;
  language: "en" | "fr";
}

export interface CreatedBooking {
  uid?: string;
  start?: string;
  end?: string;
  status?: string;
}

/** Thrown with Cal.com's own message so the form can explain what went wrong. */
export class BookingFailedError extends Error {}

/**
 * Books the slot. Guests are sent by name inside the booking notes, because
 * Cal.com's own "guests" field only accepts e-mail addresses.
 */
export async function createBooking(request: BookingRequest): Promise<CreatedBooking> {
  const guestLine = request.guests.length ? `Guests (${request.guests.length}): ${request.guests.join(", ")}` : "";
  const notes = [guestLine, request.notes.trim()].filter(Boolean).join("\n\n");

  const response = await fetch(`${bookingConfig.calApiUrl}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "cal-api-version": BOOKINGS_API_VERSION },
    body: JSON.stringify({
      start: request.start,
      eventTypeSlug: request.eventSlug,
      username: bookingConfig.calUsername,
      attendee: {
        name: request.name.trim(),
        email: request.email.trim(),
        phoneNumber: request.phone,
        timeZone: VENUE_TIME_ZONE,
        language: request.language,
      },
      // The event asks for the attendee's phone as its location.
      location: { type: "attendeePhone", phone: request.phone },
      ...(notes ? { bookingFieldsResponses: { notes } } : {}),
    }),
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || (isRecord(body) && body.status === "error")) {
    const error = isRecord(body) && isRecord(body.error) ? body.error : null;
    throw new BookingFailedError(typeof error?.message === "string" ? error.message : `booking ${response.status}`);
  }
  const data = isRecord(body) && isRecord(body.data) ? body.data : {};
  const text = (key: string) => (typeof data[key] === "string" ? (data[key] as string) : undefined);
  return { uid: text("uid"), start: text("start"), end: text("end"), status: text("status") };
}
