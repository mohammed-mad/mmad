import { useEffect, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import type { EmbedEvent } from "@calcom/embed-react";
import type { GlobalCal, GlobalCalWithoutNs, PrefillAndIframeAttrsConfig } from "@calcom/embed-core";
import { bookingConfig } from "@/config/booking";
import { buildCalLink, pickUtmParams } from "@/lib/cal";
import { useT } from "@/i18n/LanguageContext";
import BookingSkeleton from "./BookingSkeleton";
import BookingError from "./BookingError";

export interface BookingResult {
  /** Event title reported by Cal.com */
  title?: string;
  /** ISO start time reported by Cal.com */
  startTime?: string;
  /** ISO end time reported by Cal.com */
  endTime?: string;
  /** Cal.com booking uid */
  uid?: string;
}

interface CalBookingProps {
  eventSlug: string;
  workshopName?: string;
  customerName?: string;
  customerEmail?: string;
  onBookingSuccess?: (result: BookingResult) => void;
}

type Status = "loading" | "ready" | "error";

/** How long we wait for the embed to report `linkReady` before treating it as failed. */
const READY_TIMEOUT_MS = 15000;

type CalApi = GlobalCal | GlobalCalWithoutNs;

/** The Cal.com booker embed, with a skeleton while it loads and a retry state on failure. */
export default function CalBooking({ eventSlug, workshopName, customerName, customerEmail, onBookingSuccess }: CalBookingProps) {
  const t = useT();
  const calLink = buildCalLink(eventSlug);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  // Kept in a ref so the effect below doesn't need to resubscribe when the
  // caller passes a new function identity on every render.
  const onBookingSuccessRef = useRef(onBookingSuccess);
  onBookingSuccessRef.current = onBookingSuccess;

  useEffect(() => {
    if (!calLink) return;

    let cancelled = false;
    let cal: CalApi | null = null;

    const handleReady = () => {
      if (cancelled) return;
      setStatus("ready");
    };

    const handleFailed = () => {
      if (cancelled) return;
      setStatus("error");
    };

    const handleBookingSuccess = (event: EmbedEvent<"bookingSuccessfulV2">) => {
      const { title, startTime, endTime, uid } = event.detail.data;
      onBookingSuccessRef.current?.({ title, startTime, endTime, uid });
    };

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      setStatus((current) => (current === "loading" ? "error" : current));
    }, READY_TIMEOUT_MS);

    getCalApi({ namespace: eventSlug })
      .then((api) => {
        if (cancelled) return;
        cal = api;
        cal("ui", {
          theme: "light",
          hideEventTypeDetails: true,
          layout: "month_view",
          cssVarsPerTheme: {
            light: { "cal-brand": bookingConfig.brandColor },
            dark: { "cal-brand": bookingConfig.brandColor },
          },
        });
        cal("on", { action: "linkReady", callback: handleReady });
        cal("on", { action: "linkFailed", callback: handleFailed });
        cal("on", { action: "bookingSuccessfulV2", callback: handleBookingSuccess });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (cal) {
        cal("off", { action: "linkReady", callback: handleReady });
        cal("off", { action: "linkFailed", callback: handleFailed });
        cal("off", { action: "bookingSuccessfulV2", callback: handleBookingSuccess });
      }
    };
    // `attempt` intentionally re-runs the whole setup (and resets the ready timeout) on retry.
  }, [calLink, eventSlug, attempt]);

  if (!calLink) return null;

  const config: PrefillAndIframeAttrsConfig = {
    layout: "month_view",
    theme: "light",
    ...pickUtmParams(window.location.search),
  };
  if (customerName) config.name = customerName;
  if (customerEmail) config.email = customerEmail;

  const retry = () => {
    setStatus("loading");
    setAttempt((current) => current + 1);
  };

  const ariaLabel = workshopName ? `${t.booking.chooseDateTime} – ${workshopName}` : t.booking.chooseDateTime;

  return (
    <div role="region" aria-label={ariaLabel} className="w-full min-w-0 overflow-hidden bg-white shadow-float">
      {status === "loading" && <BookingSkeleton />}
      {status === "error" && <BookingError onRetry={retry} />}
      <div className={status === "ready" ? undefined : "hidden"} aria-hidden={status !== "ready"}>
        <Cal
          key={attempt}
          calLink={calLink}
          namespace={eventSlug}
          config={config}
          style={{ width: "100%", height: "100%", overflow: "auto" }}
        />
      </div>
    </div>
  );
}
