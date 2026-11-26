import type { Translation } from "@/i18n/translations";

export interface NavLink {
  label: string;
  to: string;
}

/** Primary navigation, labelled in the active language. */
export const getNavLinks = (t: Translation): NavLink[] => [
  { label: t.nav.workshops, to: "/workshops" },
  { label: t.nav.places, to: "/places" },
  { label: t.nav.privateWorkshops, to: "/private-workshops" },
  { label: t.nav.gallery, to: "/gallery" },
  { label: t.nav.about, to: "/about" },
];

export const getLegalLinks = (t: Translation): NavLink[] => [
  { label: t.footer.terms, to: "/terms" },
  { label: t.footer.privacy, to: "/privacy" },
];

export const site = {
  name: "Kintessa",
  tagline: "The third place · Casablanca",
  email: "kintessa96@gmail.com",
  phoneDisplay: "+212 625 300 857",
  /** International number without "+" or spaces, used for wa.me links */
  whatsappNumber: "212625300857",
  googleReviews: {
    rating: "5.0",
    count: 86,
    url: "https://www.google.com/maps",
  },
};
