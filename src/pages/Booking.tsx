import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import BookingSummary from "@/components/booking/BookingSummary";
import BookingForm from "@/components/booking/BookingForm";
import type { CreatedBooking } from "@/lib/cal-booking";
import { bookingConfig } from "@/config/booking";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n/LanguageContext";
import { useWorkshop } from "@/i18n/useLocalizedData";
import type { BookingSuccessState } from "@/pages/BookingSuccess";

/** Booking page for a single workshop: summary card beside the live Cal.com calendar. */
export default function Booking() {
  const { workshopSlug = "" } = useParams();
  const workshop = useWorkshop(workshopSlug);
  const t = useT();
  const navigate = useNavigate();

  useEffect(() => {
    if (!workshop || !workshop.active || !bookingConfig.isConfigured) return;
    track("booking_started", { workshopId: workshop.id, workshopSlug: workshop.slug, workshopName: workshop.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshop?.id]);

  if (!workshop) {
    return (
      <section className="page-container pb-20 pt-[200px]">
        <h1 className="display text-[44px] leading-[1] text-navy lg:text-[56px]">{t.booking.notFoundTitle}</h1>
        <Button to="/workshops" arrow className="mt-8">
          {t.booking.backToWorkshops}
        </Button>
      </section>
    );
  }

  const bookable = workshop.active && bookingConfig.isConfigured && workshop.eventStatus === "ready";

  const handleBooked = (result: CreatedBooking) => {
    track("booking_completed", { workshopId: workshop.id, workshopSlug: workshop.slug, workshopName: workshop.title });
    const state: BookingSuccessState = {
      workshopSlug: workshop.slug,
      workshopTitle: workshop.title,
      startTime: result.start,
      endTime: result.end,
      uid: result.uid,
      status: result.status,
      participantCount: result.participantCount,
      totalPrice: result.totalPrice,
      currency: result.currency,
      guestRequests: result.guestRequests,
      venue: result.venue,
    };
    navigate("/booking/success", { state });
  };

  return (
    <>
      <PageHeader kicker={workshop.kicker} title={t.booking.heading} back={{ to: `/workshops/${workshop.slug}`, label: t.booking.backTo(workshop.title) }} />
      <section className="page-container pb-20 pt-10 lg:pt-14">
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          <div className="min-w-0 lg:self-start">
            <BookingSummary workshop={workshop} />
          </div>
          <div className="min-w-0">
            <h2 className="sr-only">{t.booking.chooseDateTime}</h2>
            <div>
              {bookable && workshop.event ? (
                workshop.event.onlinePayment ? <div className="bg-white p-8 shadow-float"><p className="font-sans text-body text-navy">{t.booking.paymentCheckout}</p><Button href={`https://cal.com/${bookingConfig.calUsername}/${workshop.calEventSlug}`} arrow className="mt-6">{t.booking.bookCta}</Button></div> :
                <BookingForm key={workshop.id} eventSlug={workshop.calEventSlug} event={workshop.event} onBooked={handleBooked} />
              ) : (
                <div className="bg-white p-8 text-center shadow-float">
                  <p className="font-sans text-h3 text-navy">{workshop.eventStatus === "loading" ? t.booking.loading : t.booking.unavailableTitle}</p>
                  {workshop.eventStatus !== "loading" && <p className="mt-3 font-sans text-body text-navy-soft">{t.booking.unavailableText}</p>}
                  <Button to="/contact" variant="secondary" className="mt-6">
                    {t.booking.contactUs}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
