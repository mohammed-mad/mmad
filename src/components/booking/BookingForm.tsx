import { type FormEvent, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";
import { createBooking, fetchSlots, VENUE_TIME_ZONE, type CreatedBooking, type SlotsByDay } from "@/lib/cal-booking";

interface BookingFormProps {
  eventSlug: string;
  /** Largest group one booking may hold (booker + guests) */
  maxPeople: number;
  onBooked: (booking: CreatedBooking) => void;
}

/** How many months ahead visitors can browse. */
const MONTHS_AHEAD = 6;

const field =
  "mt-2 block w-full rounded-[6px] border border-navy/20 bg-white px-4 py-3 font-sans text-[16px] text-navy placeholder:text-navy/40 transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15";
const labelClass = "block font-sans text-[14px] font-semibold text-navy";
const chip = "rounded-[8px] border px-3 py-2 text-center font-sans transition focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/30";
const chipIdle = "border-navy/20 bg-white text-navy hover:border-navy";
const chipActive = "border-navy bg-navy text-paper";
const navButton = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/20 text-navy transition hover:border-navy disabled:pointer-events-none disabled:opacity-30";

/** "YYYY-MM-DD" for a date as seen in Casablanca. */
const venueDay = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: VENUE_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

/** "YYYY-MM" shifted by a number of months. */
const addMonths = (month: string, delta: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

/** Cells of a Monday-first month grid: null for the blanks before the 1st. */
const monthCells = (month: string): (string | null)[] => {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  return [...Array<null>(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`)];
};

function StepTitle({ n, children }: { n: number; children: string }) {
  return (
    <h3 className="flex items-center gap-3 font-sans text-[19px] font-medium text-navy">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-sans text-[14px] font-semibold text-paper">{n}</span>
      {children}
    </h3>
  );
}

/**
 * The whole booking on one screen: pick a day and a time, fill in name, e-mail,
 * phone and (optionally) the names of guests, then book with a single button.
 */
export default function BookingForm({ eventSlug, maxPeople, onBooked }: BookingFormProps) {
  const { t, lang, locale } = useLanguage();
  const f = t.booking.form;

  const today = venueDay(new Date());
  const firstMonth = today.slice(0, 7);
  const lastMonth = addMonths(firstMonth, MONTHS_AHEAD);

  const [month, setMonth] = useState(firstMonth);
  /** Free slots per month, filled as the visitor browses. */
  const [slotsByMonth, setSlotsByMonth] = useState<Record<string, SlotsByDay>>({});
  const [slotsFailed, setSlotsFailed] = useState(false);
  const [reload, setReload] = useState(0);
  /** Until the visitor moves the calendar, skip ahead from empty months to the first open one. */
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [day, setDay] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "+212 ", notes: "" });
  const [guests, setGuests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = slotsByMonth[month] ?? null;

  useEffect(() => {
    if (slotsByMonth[month]) return;
    const controller = new AbortController();
    const from = month === firstMonth ? today : `${month}-01`;
    const to = `${month}-${String(monthCells(month).filter(Boolean).length).padStart(2, "0")}`;
    setSlotsFailed(false);
    fetchSlots(eventSlug, from, to, controller.signal)
      .then((result) => setSlotsByMonth((current) => ({ ...current, [month]: result })))
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) setSlotsFailed(true);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug, month, reload]);

  // Pre-select the first open day of the month, or skip to the next month while nothing is open yet.
  useEffect(() => {
    if (!slots) return;
    const open = Object.keys(slots).sort();
    if (open.length === 0) {
      if (autoAdvance && month < lastMonth) setMonth(addMonths(month, 1));
      return;
    }
    setAutoAdvance(false);
    if (!day || !slots[day]) {
      setDay(open[0]);
      setStart(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, month, autoAdvance, lastMonth]);

  const goToMonth = (delta: number) => {
    setAutoAdvance(false);
    setMonth((current) => addMonths(current, delta));
  };

  const times = day && slots ? slots[day] ?? [] : [];

  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T12:00:00Z`));
  // Monday-first weekday initials, e.g. "Mon", "Tue" (2024-01-01 was a Monday).
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i, 12))));
  const openCount = slots ? Object.keys(slots).length : 0;

  const dayParts = (key: string) => {
    // Noon UTC keeps the calendar day stable whatever the visitor's own time zone.
    const date = new Date(`${key}T12:00:00Z`);
    return {
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(date),
      date: new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(date),
      long: new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(date),
    };
  };
  const timeLabel = (iso: string) => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: VENUE_TIME_ZONE }).format(new Date(iso));

  const people = 1 + guests.length;
  const canAddGuest = people < maxPeople;
  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!start) {
      setError(f.chooseFirst);
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 9) {
      setError(f.phoneInvalid);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const booking = await createBooking({
        eventSlug,
        start,
        name: form.name,
        email: form.email,
        phone: form.phone.replace(/[^\d+]/g, ""),
        guests: guests.map((g) => g.trim()).filter(Boolean),
        notes: form.notes,
        language: lang,
      });
      onBooked({ ...booking, start: booking.start ?? start });
    } catch {
      setError(f.failed);
      setStart(null);
      setSlotsByMonth({});
      setReload((n) => n + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-5 shadow-float sm:p-8 lg:p-10" noValidate={false}>
      <div className="grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
      <div>
      {/* 1 · Day: the full month, open days from Cal.com highlighted */}
      <StepTitle n={1}>{f.stepDay}</StepTitle>
      <div className="mt-5 rounded-[10px] border border-navy/15 p-3 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => goToMonth(-1)} disabled={month <= firstMonth} aria-label={f.prevMonth} className={navButton}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <p className="font-sans text-[18px] font-medium capitalize text-navy" aria-live="polite">
            {monthTitle}
          </p>
          <button type="button" onClick={() => goToMonth(1)} disabled={month >= lastMonth} aria-label={f.nextMonth} className={navButton}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center font-sans text-[12px] uppercase tracking-[0.06em] text-navy-soft" aria-hidden="true">
          {weekdays.map((name) => (
            <span key={name} className="py-1">
              {name}
            </span>
          ))}
        </div>

        <div role="radiogroup" aria-label={`${f.stepDay}, ${monthTitle}`} aria-busy={!slots} className={["mt-1 grid grid-cols-7 gap-1", !slots && !slotsFailed ? "animate-pulse" : ""].join(" ")}>
          {monthCells(month).map((key, index) => {
            if (!key) return <span key={`blank-${index}`} aria-hidden="true" />;
            const open = Boolean(slots?.[key]);
            const active = key === day;
            const isToday = key === today;
            const number = Number(key.slice(8));
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`${dayParts(key).long}${open ? ` – ${f.openDay}` : ""}`}
                disabled={!open}
                onClick={() => {
                  setDay(key);
                  setStart(null);
                }}
                className={[
                  "relative flex h-11 w-full flex-col items-center justify-center rounded-[8px] sm:h-12 font-sans text-[15px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 sm:text-[16px]",
                  active
                    ? "bg-navy font-semibold text-paper"
                    : open
                      ? "border border-navy/30 bg-paper font-semibold text-navy hover:border-navy hover:bg-white"
                      : "cursor-default text-navy/30",
                  isToday && !active ? "underline decoration-[1.5px] underline-offset-4" : "",
                ].join(" ")}
              >
                {number}
                {open && <span className={["absolute bottom-[4px] h-[4px] w-[4px] rounded-full", active ? "bg-sun" : "bg-navy"].join(" ")} aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-sans text-[13px] text-navy-soft">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[5px] border border-navy/30 bg-paper" aria-hidden="true">
              <span className="h-[4px] w-[4px] rounded-full bg-navy" />
            </span>
            {f.openDays}
          </span>
          {slots && <span>{openCount === 0 ? f.noSlotsMonth : f.openCount(openCount)}</span>}
        </div>
      </div>

      {slotsFailed && (
        <p className="mt-4 font-sans text-[15px] text-navy" role="alert">
          {f.slotsError}{" "}
          <button type="button" onClick={() => setReload((n) => n + 1)} className="font-semibold underline underline-offset-4">
            {t.booking.retry}
          </button>
        </p>
      )}

      </div>

      {/* 2 · Time */}
      <div>
      {day && slots?.[day] && (
        <>
          <StepTitle n={2}>{f.stepTime}</StepTitle>
          <p className="mt-3 font-sans text-[14px] text-navy">
            <span className="font-semibold capitalize">{dayParts(day).long}</span>
            <span className="block text-[13px] text-navy-soft">{f.timesIn}</span>
          </p>
          <div role="radiogroup" aria-label={f.stepTime} className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-1">
            {times.map((iso) => {
              const active = iso === start;
              return (
                <button key={iso} type="button" role="radio" aria-checked={active} onClick={() => setStart(iso)} className={[chip, "text-[16px] font-semibold", active ? chipActive : chipIdle].join(" ")}>
                  {timeLabel(iso)}
                </button>
              );
            })}
          </div>
        </>
      )}
      </div>
      </div>

      {/* 3 · Details */}
      <div className="mt-9">
        <StepTitle n={3}>{f.stepDetails}</StepTitle>
        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>
            {f.fullName} <span aria-hidden="true">*</span>
            <input required className={field} value={form.name} onChange={update("name")} autoComplete="name" />
          </label>
          <div>
            <label className={labelClass}>
              {f.email} <span aria-hidden="true">*</span>
              <input required type="email" className={field} value={form.email} onChange={update("email")} autoComplete="email" aria-describedby="booking-email-hint" />
            </label>
            <p id="booking-email-hint" className="mt-1 font-sans text-[13px] text-navy-soft">
              {f.emailHint}
            </p>
          </div>
          <label className={labelClass}>
            {f.phone} <span aria-hidden="true">*</span>
            <input required type="tel" inputMode="tel" className={field} value={form.phone} onChange={update("phone")} autoComplete="tel" />
          </label>
        </div>

        <fieldset className="mt-7 rounded-[8px] border border-navy/15 bg-paper p-4 sm:p-5">
          <legend className="px-1 font-sans text-[15px] font-semibold text-navy">{f.guestsTitle}</legend>
          <p className="font-sans text-[13px] text-navy-soft">{f.guestsHint}</p>
          {guests.map((guest, index) => (
            <div key={index} className="mt-3 flex items-end gap-2">
              <label className={`${labelClass} flex-1 text-[13px]`}>
                {f.guestLabel(index + 1)}
                <input
                  required
                  className={field}
                  value={guest}
                  autoComplete="off"
                  onChange={(e) => setGuests(guests.map((g, i) => (i === index ? e.target.value : g)))}
                />
              </label>
              <button type="button" onClick={() => setGuests(guests.filter((_, i) => i !== index))} aria-label={f.removeGuest(index + 1)} className="mb-[6px] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-navy transition hover:bg-paper-dark">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {canAddGuest && (
            <button type="button" onClick={() => setGuests([...guests, ""])} className="mt-3 inline-flex items-center gap-2 rounded-pill border border-navy/30 bg-white px-4 py-2 font-sans text-[14px] font-semibold text-navy transition hover:border-navy">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {f.addGuest}
            </button>
          )}
        </fieldset>

        <label className={`${labelClass} mt-6`}>
          {f.notes}
          <textarea rows={3} className={`${field} resize-y`} value={form.notes} onChange={update("notes")} />
        </label>
      </div>

      {/* Summary + one button */}
      <div className="mt-8 flex flex-col gap-4 border-t border-navy/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-[15px] text-navy" aria-live="polite">
          {start && day ? (
            <>
              <strong className="font-semibold">{dayParts(day).long}</strong> · {timeLabel(start)} · {f.people(people)}
            </>
          ) : (
            <span className="text-navy-soft">{f.chooseFirst}</span>
          )}
        </p>
        <Button type="submit" arrow disabled={submitting || !start} className="w-full sm:w-auto">
          {submitting ? f.submitting : f.submit(people)}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-[6px] border border-navy/20 bg-paper px-4 py-3 font-sans text-[15px] text-navy">
          {error}
        </p>
      )}
    </form>
  );
}
