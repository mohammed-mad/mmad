import { site } from "@/data/site";

export const buildWhatsAppContactUrl = (message: string): string => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
