const calUsername = (import.meta.env.VITE_CAL_USERNAME ?? "").trim();

/** Central booking configuration. The only place the Cal.com account is read. */
export const bookingConfig = {
  calUsername,
  /** False when no Cal.com account is configured; booking must not be offered. */
  isConfigured: calUsername.length > 0,
  /** Accent colour handed to the Cal.com embed (Tailwind `tomato`). */
  brandColor: "#F25742",
} as const;
