import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import BookingSummary from "@/components/booking/BookingSummary";
import CalBooking, { type BookingResult } from "@/components/booking/CalBooking";
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
        <h1 className="display text-[44px] leading-[1] text-green lg:text-[56px]">{t.booking.notFoundTitle}</h1>
        <Button to="/workshops" arrow className="mt-8">
          {t.booking.backToWorkshops}
        </Button>
      </section>
    );
  }

  const bookable = workshop.active && bookingConfig.isConfigured;

  const handleBookingSuccess = (result: BookingResult) => {
    if (result.paymentRequired) return;
    track("booking_completed", { workshopId: workshop.id, workshopSlug: workshop.slug, workshopName: workshop.title });
    const state: BookingSuccessState = {
      workshopSlug: workshop.slug,
      workshopTitle: workshop.title,
      startTime: result.startTime,
      endTime: result.endTime,
      uid: result.uid,
      status: result.status,
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
            <h2 className="font-sans text-h3 text-green">{t.booking.chooseDateTime}</h2>
            <div className="mt-6">
              {bookable ? (
                <CalBooking key={workshop.id} eventSlug={workshop.calEventSlug} workshopName={workshop.title} onBookingSuccess={handleBookingSuccess} />
              ) : (
                <div className="bg-white p-8 text-center shadow-float">
                  <p className="font-sans text-h3 text-green">{t.booking.unavailableTitle}</p>
                  <p className="mt-3 font-sans text-body text-green-olive">{t.booking.unavailableText}</p>
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
