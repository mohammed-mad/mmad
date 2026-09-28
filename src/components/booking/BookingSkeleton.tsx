import { useT } from "@/i18n/LanguageContext";

/**
 * Placeholder shown while the Cal.com embed loads: a pulsing outline of a
 * month header, a 7-column day grid and a row of time slots, so the layout
 * doesn't jump once the real calendar renders.
 */
export default function BookingSkeleton() {
  const t = useT();

  return (
    <div role="status" aria-live="polite" className="min-h-[420px] w-full bg-white p-6 shadow-float lg:p-9">
      <span className="sr-only">{t.booking.loading}</span>
      <div aria-hidden="true" className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-beige-dark" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-pill bg-beige-dark" />
            <div className="h-8 w-8 rounded-pill bg-beige-dark" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={`day-label-${index}`} className="h-3 rounded bg-beige-dark" />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, index) => (
            <div key={`day-cell-${index}`} className="aspect-square rounded bg-beige-dark" />
          ))}
        </div>
        <div className="mt-8 h-4 w-40 rounded bg-beige-dark" />
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`slot-${index}`} className="h-9 rounded-pill bg-beige-dark" />
          ))}
        </div>
      </div>
    </div>
  );
}
