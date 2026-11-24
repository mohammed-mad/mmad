import type { Workshop } from "@/types/workshop";
import Photo from "@/components/ui/Photo";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { useWorkshopPrice } from "@/lib/useWorkshopPrice";
import { useT } from "@/i18n/LanguageContext";

interface BookingSummaryProps {
  workshop: Workshop;
}

const dtClass = "font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy";
const ddClass = "font-sans text-[15px] text-navy";

/**
 * Compact "what you're booking" card next to the Cal.com embed: image,
 * title, a short description and the essentials (duration, price, location).
 * No dates — those come from the live calendar.
 */
export default function BookingSummary({ workshop }: BookingSummaryProps) {
  const t = useT();
  const price = useWorkshopPrice(workshop);

  return (
    <div className="w-full min-w-0 overflow-hidden bg-white shadow-card">
      <Photo picture={workshop.cardImage} alt="" sizes="(min-width: 1024px) 300px, 100vw" priority className="aspect-[16/9] w-full object-cover lg:aspect-[4/3]" />
      <div className="p-6">
        <ScriptTitle as="p" dashes={false}>
          {workshop.kicker}
        </ScriptTitle>
        <h2 className="mt-1 font-sans text-h3 text-navy">{workshop.title}</h2>
        <p className="mt-3 font-sans text-[15px] leading-[24px] text-navy-soft">{workshop.summary}</p>
        <dl className="mt-5 space-y-3">
          <div>
            <dt className={dtClass}>{t.booking.summaryDuration}</dt>
            <dd className={ddClass}>{workshop.duration}</dd>
          </div>
          {price && (
            <div>
              <dt className={dtClass}>{t.booking.summaryPrice}</dt>
              <dd className={ddClass}>
                {price} {t.common.perPerson}
              </dd>
            </div>
          )}
          <div>
            <dt className={dtClass}>{t.booking.summaryLocation}</dt>
            <dd className={ddClass}>
              {t.booking.locationText}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
