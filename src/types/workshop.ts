export type WorkshopCategory = "Kintsugi" | "Cyanotype" | "Mosaic Art" | "Ceramic Painting" | "Pottery" | "Open Studio";
export type WorkshopGroup = "craft" | "ceramic";

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  /** Short display title used on cards, e.g. "Kintsugi" */
  shortTitle: string;
  /** Handwritten label above the title, e.g. "Craft workshop" */
  kicker: string;
  category: WorkshopCategory;
  group: WorkshopGroup;
  tagline: string;
  intro: string;
  description: string;
  whatYouWillDo: string[];
  includes: string[];
  duration: string;
  maxParticipants: number;
  level: string;
  cardImage: string;
  heroImage: string;
  gallery: string[];
  /** Slug of the matching Cal.com event type, e.g. "kintsugi-workshop" */
  calEventSlug: string;
  /** False hides booking for this workshop */
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  avatar?: string;
  /** Relative date label, e.g. "2 weeks ago" */
  when: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  image: string;
  alt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Text fields of a workshop that exist in every language. */
export type WorkshopTextFields = "title" | "shortTitle" | "kicker" | "tagline" | "intro" | "description" | "duration" | "level";
export type WorkshopListFields = "whatYouWillDo" | "includes";

export type LocalizedString = Record<"en" | "fr", string>;
export type LocalizedList = Record<"en" | "fr", string[]>;

/** Workshop as authored: text in every language, resolved to `Workshop` for the active one. */
export type WorkshopSource = Omit<Workshop, WorkshopTextFields | WorkshopListFields> &
  Record<WorkshopTextFields, LocalizedString> &
  Record<WorkshopListFields, LocalizedList>;

export interface TestimonialSource extends Omit<Testimonial, "quote" | "when"> {
  quote: LocalizedString;
  when: LocalizedString;
}

export interface JournalPostSource extends Omit<JournalPost, "title" | "alt"> {
  title: LocalizedString;
  alt: LocalizedString;
}

export interface FaqItemSource {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}
