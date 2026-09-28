import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import ScriptTitle from "@/components/ui/ScriptTitle";
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
    <section className="page-container pb-20 pt-[200px]">
      <Link to={`/workshops/${workshop.slug}`} className="inline-flex items-center gap-2 font-sans text-[14px] text-green-olive transition hover:text-tomato">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.booking.backTo(workshop.title)}
      </Link>
      <div className="mt-6 text-center">
        <ScriptTitle as="p">{workshop.kicker}</ScriptTitle>
        <h1 className="display mt-2 text-[44px] leading-[1] text-green lg:text-[56px]">{t.booking.heading}</h1>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
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
  );
}
