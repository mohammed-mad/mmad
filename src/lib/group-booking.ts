import { createBooking, type BookingRequest, type CreatedBooking } from "@/lib/cal-booking";
import { fetchCalEvent, type CalEventDetails } from "@/lib/cal-events";

export function groupPrice(people: number, event: CalEventDetails): number | null {
  if (!event.price) return null;
  const duo = event.duoPrice?.currency === event.price.currency ? event.duoPrice : null;
  return duo ? Math.floor(people / 2) * duo.amount + (people % 2) * event.price.amount : people * event.price.amount;
}

/** Refresh Cal.com at submission; guest names remain requests for manual confirmation. */
export async function createBookingWithGuestRequests(request: BookingRequest): Promise<CreatedBooking> {
  if (!request.name.trim() || !request.email.trim() || request.guests.some((name) => !name.trim())) throw new Error("Participant names are required");
  const event = await fetchCalEvent(request.eventSlug, true);
  if (!event) throw new Error("This event is unavailable");
  const people = 1 + request.guests.length;
  if (event.capacity && people > event.capacity) throw new Error("Requested group exceeds this event's capacity");
  if (event.onlinePayment) throw new Error("This event requires checkout on Cal.com");
  const total = groupPrice(people, event);
  const priceNote = request.guests.length
    ? `Requested group size: ${people} (main participant + ${request.guests.length} pending guests). ${total !== null && event.price ? `Estimated group total: ${total} ${event.price.currency}, subject to host confirmation of guest places.` : "Final group price to be confirmed by the host."} Only the main participant's seat is reserved automatically.`
    : "";
  const booking = await createBooking({ ...request, locationType: event.locationType === "address" ? "address" : event.locationType === "attendeePhone" ? "attendeePhone" : undefined, notes: [priceNote, request.notes.trim()].filter(Boolean).join("\n\n") });
  return { ...booking, participantCount: people, ...(total !== null && event.price ? { totalPrice: total, currency: event.price.currency } : {}), venue: event.venue ?? undefined };
}
