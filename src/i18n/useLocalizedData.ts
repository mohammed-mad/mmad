import { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCalEvents, type CalEventState } from "@/lib/useCalEvents";
import { getWorkshopBySlug, getWorkshops } from "@/data/workshops";
import { testimonialSources } from "@/data/testimonials";
import { journalSources } from "@/data/journal";
import { faqSources } from "@/data/faq";
import { getGalleryImages } from "@/data/gallery";
import type { FaqItem, JournalPost, Testimonial, Workshop } from "@/types/workshop";

function withCalEvent(workshop: Workshop, state?: CalEventState): Workshop {
  const event = state?.event ?? null;
  const minutes = event?.durationMinutes;
  const duration = minutes ? `${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)}h` : ""}${minutes % 60 ? `${minutes % 60}min` : ""}` : "";
  return { ...workshop, event, eventStatus: state?.status ?? "unavailable", duration, maxParticipants: event?.capacity ?? null };
}

export const useWorkshops = () => {
  const { lang } = useLanguage();
  const workshops = useMemo(() => getWorkshops(lang), [lang]);
  const events = useCalEvents(workshops.filter((w) => w.active).map((w) => w.calEventSlug));
  return workshops.map((workshop) => withCalEvent(workshop, events[workshop.calEventSlug]));
};

export const useWorkshop = (slug: string) => {
  const { lang } = useLanguage();
  const workshop = useMemo(() => getWorkshopBySlug(slug, lang), [slug, lang]);
  const events = useCalEvents(workshop?.active ? [workshop.calEventSlug] : []);
  return workshop ? withCalEvent(workshop, events[workshop.calEventSlug]) : undefined;
};

export const useTestimonials = (): Testimonial[] => {
  const { lang } = useLanguage();
  return useMemo(() => testimonialSources.map((t) => ({ ...t, quote: t.quote[lang], when: t.when[lang] })), [lang]);
};

export const useJournalPosts = (): JournalPost[] => {
  const { lang } = useLanguage();
  return useMemo(() => journalSources.map((p) => ({ ...p, title: p.title[lang], alt: p.alt[lang] })), [lang]);
};

export const useFaq = (): FaqItem[] => {
  const { lang } = useLanguage();
  return useMemo(() => faqSources.map((f) => ({ id: f.id, question: f.question[lang], answer: f.answer[lang] })), [lang]);
};

export const useGallery = () => {
  const { lang } = useLanguage();
  return useMemo(() => getGalleryImages(lang), [lang]);
};
