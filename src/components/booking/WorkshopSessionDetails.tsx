import type { Workshop } from "@/types/workshop";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatPrice } from "@/lib/format";
import { VENUE_TIME_ZONE } from "@/lib/cal-booking";

/** Live booking information only, read from Cal.com. */
export default function WorkshopSessionDetails({ workshop }: { workshop: Workshop }) {
  const { t, locale } = useLanguage();
  const event = workshop.event;
  if (!event) return workshop.eventStatus === "loading" ? <p className="mt-5 font-sans text-[15px] text-navy-soft">{t.booking.loading}</p> : null;
  const session = event.nextSession;
  const date = session ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: VENUE_TIME_ZONE }).format(new Date(session.start)) : null;
  const time = (iso: string) => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: VENUE_TIME_ZONE }).format(new Date(iso));
  return (
    <div className="bg-white py-5 sm:py-6">
      {session && <>
        <p className="font-sans text-[12px] uppercase tracking-wider text-navy-soft">{t.booking.nextAvailable}</p>
        <p className="mt-1 font-sans text-[17px] font-semibold capitalize text-navy">{date}</p>
        <p className="mt-1 font-sans text-[15px] text-navy-soft">{time(session.start)}–{time(session.end)} · {t.booking.form.timesIn}</p>
      </>}
      {event.venue && <p className="mt-2 font-sans text-[16px] text-navy">{event.venue}</p>}
      {workshop.duration && <p className="mt-2 font-sans text-[15px] text-navy-soft">{t.booking.summaryDuration}: {workshop.duration}</p>}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-navy/15 pt-4 font-sans text-[15px] text-navy">
        {event.price && <p>{formatPrice(event.price.amount, event.price.currency)} {t.common.perPerson}</p>}
        {event.duoPrice && <p className="font-semibold">{t.booking.duoOffer}: {formatPrice(event.duoPrice.amount, event.duoPrice.currency)} {t.booking.forTwo}</p>}
        {event.capacity !== null && <p>{t.detail.upToPeople(event.capacity)}</p>}
        {session?.remaining !== null && session?.remaining !== undefined && <p>{t.booking.seatsRemaining(session.remaining)}</p>}
      </div>
    </div>
  );
}
