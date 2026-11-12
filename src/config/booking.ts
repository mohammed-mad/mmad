const calUsername = (import.meta.env.VITE_CAL_USERNAME ?? "").trim();

/** Central booking configuration. The only place the Cal.com account is read. */
export const bookingConfig = {
  calUsername,
  /** False when no Cal.com account is configured; booking must not be offered. */
  isConfigured: calUsername.length > 0,
  /** Cal.com public API, used to read each event type's price. */
  calApiUrl: "https://api.cal.com/v2",
  calApiVersion: "2024-06-14",
  /**
   * Colours handed to the Cal.com embed so it reads as part of the site.
   * Values mirror the Tailwind tokens (tomato, green, beige); the booker's own
   * frame is removed because our card already frames it.
   */
  calTheme: {
    "cal-brand": "#F25742",
    "cal-brand-emphasis": "#E04A36",
    "cal-brand-text": "#FFFFFF",
    "cal-text": "#164B1E",
    "cal-text-emphasis": "#164B1E",
    "cal-text-default": "#164B1E",
    "cal-text-subtle": "#375E3D",
    "cal-text-muted": "#375E3D",
    "cal-bg-emphasis": "#EBE7DD",
    "cal-bg-subtle": "#F7F1E7",
    "cal-bg-muted": "#FFFFFF",
    "cal-border": "rgba(22, 75, 30, 0.25)",
    "cal-border-default": "rgba(22, 75, 30, 0.25)",
    "cal-border-subtle": "rgba(22, 75, 30, 0.12)",
    "cal-border-booker": "transparent",
    "cal-border-booker-width": "0px",
  },
} as const;
