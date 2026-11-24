import { useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useLanguage, useT } from "@/i18n/LanguageContext";

export interface BookingSuccessState {
  workshopSlug: string;
  workshopTitle: string;
  startTime?: string;
  endTime?: string;
  uid?: string;
  status?: string;
}

const isBookingSuccessState = (value: unknown): value is BookingSuccessState => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.workshopSlug !== "string" || typeof candidate.workshopTitle !== "string") return false;
  if (candidate.startTime !== undefined && typeof candidate.startTime !== "string") return false;
  if (candidate.endTime !== undefined && typeof candidate.endTime !== "string") return false;
  if (candidate.uid !== undefined && typeof candidate.uid !== "string") return false;
  if (candidate.status !== undefined && typeof candidate.status !== "string") return false;
  return true;
};

const isValidDate = (value: string | undefined): value is string => Boolean(value && !Number.isNaN(new Date(value).getTime()));

/** Confirmation page reached after a successful Cal.com booking, or visited/reloaded directly. */
export default function BookingSuccess() {
  const t = useT();
  const { locale } = useLanguage();
  const location = useLocation();
  const state = isBookingSuccessState(location.state) ? location.state : null;

  const hasStart = state ? isValidDate(state.startTime) : false;
  const hasEnd = hasStart && state ? isValidDate(state.endTime) : false;
  const startDate = hasStart && state ? new Date(state.startTime as string) : null;
  const endDate = hasEnd && state ? new Date(state.endTime as string) : null;
  const isConfirmed = state ? state.status === undefined || state.status.toUpperCase() === "ACCEPTED" : false;

  return (
    <section className="page-container pb-20 pt-[200px] text-center">
      <h1 className="display text-[44px] leading-[1] text-navy lg:text-[56px]">
        {state ? (isConfirmed ? t.booking.successTitle : t.booking.pendingTitle) : t.booking.successGenericTitle}
      </h1>

      {state ? (
        <div className="mt-6">
          <p className="font-sans text-h3 text-navy">{state.workshopTitle}</p>
          {startDate && (
            <p className="mt-2 font-sans text-body text-navy-soft">
              {startDate.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
              {" · "}
              {startDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
              {endDate && ` – ${endDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`}
            </p>
          )}
          <p className="mt-2 font-sans text-body text-navy-soft">
            {t.booking.locationText}
          </p>
          <p className="mt-4 font-sans text-body text-navy-soft">{isConfirmed ? t.booking.successEmail : t.booking.pendingText}</p>
        </div>
      ) : (
        <p className="mt-6 font-sans text-body text-navy-soft">{t.booking.successGeneric}</p>
      )}

      <Button to="/workshops" arrow className="mt-8">
        {t.booking.backToWorkshops}
      </Button>
    </section>
  );
}
