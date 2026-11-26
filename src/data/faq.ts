import type { FaqItemSource } from "@/types/workshop";

export const faqSources: FaqItemSource[] = [
  {
    id: "f-1",
    question: { en: "What is the difference between an open and a private workshop?", fr: "Quelle est la différence entre un atelier ouvert et un atelier privé ?" },
    answer: {
      en: "Open workshops are public sessions in small groups: you book your own and meet the others there. Private workshops are for your group alone, on a date and in a place we agree together.",
      fr: "Les ateliers ouverts sont des séances publiques en petits groupes : vous réservez la vôtre et rencontrez les autres sur place. Les ateliers privés sont réservés à votre groupe, à une date et dans un lieu que nous choisissons ensemble.",
    },
  },
  {
    id: "f-2",
    question: { en: "How do I book a place?", fr: "Comment réserver une place ?" },
    answer: {
      en: "Choose a date on the workshop page, pick your seat and confirm. You’ll get a message on WhatsApp or by email.",
      fr: "Choisissez une date sur la page de l’atelier, réservez votre place et confirmez. Vous recevrez un message sur WhatsApp ou par e-mail.",
    },
  },
  {
    id: "f-3",
    question: { en: "Do I need any experience?", fr: "Faut-il de l’expérience ?" },
    answer: {
      en: "None. We show you the first gesture, then step back. Nothing here has to be perfect.",
      fr: "Aucune. Nous vous montrons le premier geste, puis nous nous mettons en retrait. Ici, rien n’a besoin d’être parfait.",
    },
  },
  {
    id: "f-4",
    question: { en: "Are materials included in the price?", fr: "Le matériel est-il inclus dans le prix ?" },
    answer: {
      en: "Yes: materials, tools and a guide. You only bring yourself. A drink is included or extra, depending on the café.",
      fr: "Oui : le matériel, les outils et un guide. Vous n’apportez que vous-même. Une boisson est incluse ou en supplément, selon le café.",
    },
  },
  {
    id: "f-5",
    question: { en: "Can I cancel or move my booking?", fr: "Puis-je annuler ou déplacer ma réservation ?" },
    answer: {
      en: "Yes, up to 48 hours before the session. After that, the seat can be passed to someone else.",
      fr: "Oui, jusqu’à 48 heures avant la séance. Au-delà, la place peut être cédée à quelqu’un d’autre.",
    },
  },
  {
    id: "f-6",
    question: { en: "Do you do team events and birthdays?", fr: "Organisez-vous des événements d’équipe et des anniversaires ?" },
    answer: {
      en: "Yes, that is what private workshops are for. We come to your place, to a café or to a partner venue. Tell us the date and the number of people.",
      fr: "Oui, c’est exactement le rôle des ateliers privés. Nous venons chez vous, dans un café ou dans un lieu partenaire. Indiquez-nous la date et le nombre de personnes.",
    },
  },
];
