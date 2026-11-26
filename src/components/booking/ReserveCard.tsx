import { Link } from "react-router-dom";
import { CalendarDays, MailCheck, MapPin } from "lucide-react";
import type { Workshop } from "@/types/workshop";
import Button from "@/components/ui/Button";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { useT } from "@/i18n/LanguageContext";
import WorkshopSessionDetails from "@/components/booking/WorkshopSessionDetails";

const steps = [
  { Icon: CalendarDays, key: "stepDate" },
  { Icon: MailCheck, key: "stepConfirm" },
  { Icon: MapPin, key: "stepCome" },
] as const;

/** Booking call-to-action on the workshop page: price from Cal.com, what happens next, and the button. */
export default function ReserveCard({ workshop }: { workshop: Workshop }) {
  const t = useT();

  return (
    <div className="flex flex-col bg-white p-6 shadow-float lg:self-center lg:p-10">
      <div>
        <ScriptTitle as="p" dashes={false}>
          {workshop.shortTitle}
        </ScriptTitle>
        <h2 id="booking-heading" className="font-sans text-h2 text-navy">
          {t.booking.title}
        </h2>
        <div className="mt-6"><WorkshopSessionDetails workshop={workshop} /></div>
        <hr className="mt-6 border-navy/10" />
        {workshop.active ? (
          <>
            <ol className="mt-6 space-y-3">
              {steps.map(({ Icon, key }) => (
                <li key={key} className="flex items-center gap-3 font-sans text-[16px] leading-[26px] text-navy-soft">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-paper-dark text-navy">
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  {key === "stepCome" && workshop.event?.venue ? workshop.event.venue : t.booking[key]}
                </li>
              ))}
            </ol>
            <Button to={`/book/${workshop.slug}`} arrow fullWidth className="mt-8">
              {t.booking.bookCta}
            </Button>
          </>
        ) : (
          <p className="mt-6 font-sans text-body text-navy-soft">{t.booking.unavailableTitle}</p>
        )}
        <p className="mt-5 text-center font-sans text-[14px] leading-[22px] text-navy-soft">
          {t.booking.groupNote}
          <Link to="/private-workshops" className="font-bold text-navy hover:underline">
            {t.booking.groupLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
