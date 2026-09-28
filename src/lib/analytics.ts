export type AnalyticsEvent = "workshop_viewed" | "booking_started" | "booking_completed";

export interface WorkshopEventProps {
  workshopId: string;
  workshopSlug: string;
  workshopName: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Report an event to the page's data layer, if one is installed. */
export const track = (event: AnalyticsEvent, props: WorkshopEventProps): void => {
  try {
    window.dataLayer?.push({ event, ...props });
  } catch {
    // Analytics must never break the page.
  }
};
