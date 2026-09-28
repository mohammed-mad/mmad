import type { Workshop } from "@/types/workshop";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { formatPrice } from "@/lib/format";
import { site } from "@/data/site";
import { useT } from "@/i18n/LanguageContext";

interface BookingSummaryProps {
  workshop: Workshop;
}

const dtClass = "font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-tomato";
const ddClass = "font-sans text-[15px] text-green";

/**
 * Compact "what you're booking" card next to the Cal.com embed: image,
 * title and the essentials (duration, price, location). No description,
 * no dates — those come from the live calendar.
 */
export default function BookingSummary({ workshop }: BookingSummaryProps) {
  const t = useT();

  return (
    <div className="w-full min-w-0 overflow-hidden bg-white shadow-card">
      <img
        src={workshop.cardImage}
        alt=""
        loading="lazy"
        className="aspect-[16/9] w-full object-cover lg:aspect-[4/3]"
      />
      <div className="p-6">
        <ScriptTitle as="p" dashes={false}>
          {workshop.kicker}
        </ScriptTitle>
        <h2 className="mt-1 font-sans text-h3 text-green">{workshop.title}</h2>
        <dl className="mt-5 space-y-3">
          <div>
            <dt className={dtClass}>{t.booking.summaryDuration}</dt>
            <dd className={ddClass}>{workshop.duration}</dd>
          </div>
          <div>
            <dt className={dtClass}>{t.booking.summaryPrice}</dt>
            <dd className={ddClass}>
              {formatPrice(workshop.price)} {t.common.perPerson}
            </dd>
          </div>
          <div>
            <dt className={dtClass}>{t.booking.summaryLocation}</dt>
            <dd className={ddClass}>
              {site.name}, {site.addressLines.join(", ")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
