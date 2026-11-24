const calUsername = (import.meta.env.VITE_CAL_USERNAME ?? "").trim();

/** Central booking configuration. The only place the Cal.com account is read. */
export const bookingConfig = {
  calUsername,
  /** False when no Cal.com account is configured; booking must not be offered. */
  isConfigured: calUsername.length > 0,
  /** Cal.com public API: event prices, free slots and creating bookings. */
  calApiUrl: "https://api.cal.com/v2",
  calApiVersion: "2024-06-14",
} as const;
