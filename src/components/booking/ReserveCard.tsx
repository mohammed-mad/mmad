import { Link } from "react-router-dom";
import { CalendarDays, MailCheck, MapPin } from "lucide-react";
import type { Workshop } from "@/types/workshop";
import Button from "@/components/ui/Button";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { useT } from "@/i18n/LanguageContext";
import { useWorkshopPrice } from "@/lib/useWorkshopPrice";

const steps = [
  { Icon: CalendarDays, key: "stepDate" },
  { Icon: MailCheck, key: "stepConfirm" },
  { Icon: MapPin, key: "stepCome" },
] as const;

/** Hand-drawn underline that sits under the price. */
function Squiggle() {
  return (
    <svg className="mt-2 h-[10px] w-[132px] text-orange" viewBox="0 0 132 10" fill="none" aria-hidden="true">
      <path d="M2 6c10-5 18 4 28 0s18-5 28-1 18 4 28 0 18-4 28-1 12 3 16 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Booking call-to-action on the workshop page: price from Cal.com, what happens next, and the button. */
export default function ReserveCard({ workshop }: { workshop: Workshop }) {
  const t = useT();
  const price = useWorkshopPrice(workshop);
  // "350 MAD" reads as amount + unit; symbol prices such as "€65" stay in one piece.
  const [amount, unit] = price ? price.split(" ") : [];

  return (
    <div className="flex flex-col bg-white p-6 shadow-float lg:self-center lg:p-10">
      <div>
        <ScriptTitle as="p" dashes={false}>
          {workshop.shortTitle}
        </ScriptTitle>
        <h2 id="booking-heading" className="font-sans text-h2 text-green">
          {t.booking.title}
        </h2>
        {price && (
          <div className="mt-6">
            <p className="flex items-baseline gap-2 text-green">
              <span className="display text-[44px] leading-none">{amount}</span>
              {unit && <span className="font-sans text-[18px] font-bold leading-none tracking-[0.04em]">{unit}</span>}
            </p>
            <Squiggle />
            <p className="mt-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-green-olive">{t.common.perPerson}</p>
          </div>
        )}
        <hr className="mt-6 border-green/10" />
        {workshop.active ? (
          <>
            <ol className="mt-6 space-y-3">
              {steps.map(({ Icon, key }) => (
                <li key={key} className="flex items-center gap-3 font-sans text-[16px] leading-[26px] text-green-olive">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-beige-dark text-tomato">
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  {t.booking[key]}
                </li>
              ))}
            </ol>
            <Button to={`/book/${workshop.slug}`} arrow fullWidth className="mt-8">
              {t.booking.bookCta}
            </Button>
          </>
        ) : (
          <p className="mt-6 font-sans text-body text-green-olive">{t.booking.unavailableTitle}</p>
        )}
        <p className="mt-5 text-center font-sans text-[14px] leading-[22px] text-green-olive">
          {t.booking.groupNote}
          <Link to="/private-workshops" className="font-bold text-tomato hover:underline">
            {t.booking.groupLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
