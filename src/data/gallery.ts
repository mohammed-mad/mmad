import type { GalleryImage } from "@/types/workshop";
import type { Lang } from "@/i18n/translations";
import { images } from "@/data/images";

const sources: { id: string; src: Picture; alt: Record<Lang, string> }[] = [
  { id: "g-garden", src: images.heroGarden, alt: { en: "Friends painting together on a blanket in a sunny garden", fr: "Des amis peignent ensemble sur une couverture dans un jardin ensoleillé" } },
  { id: "g-kintsugi", src: images.kintsugiBowl, alt: { en: "A ceramic plate mended with golden seams", fr: "Une assiette en céramique réparée avec des jointures dorées" } },
  // { id: "g-cyanotype", src: images.cyanotypePrint, alt: { en: "A blue botanical cyanotype print held up in the sun", fr: "Un cyanotype botanique bleu tenu au soleil" } },
  // { id: "g-table", src: images.heroTable, alt: { en: "Friends painting together at a café table", fr: "Des amis peignent ensemble à une table de café" } },
  // { id: "g-mosaic", src: images.mosaicCat, alt: { en: "A mosaic cat in blue tiles on a yellow wall", fr: "Un chat en mosaïque bleue sur un mur jaune" } },
  // { id: "g-materials", src: images.materialsTable, alt: { en: "A long table laid out with materials before a workshop", fr: "Une longue table préparée avec le matériel avant un atelier" } },
  // { id: "g-painting", src: images.paintingCloseUp, alt: { en: "A participant painting carefully at the table", fr: "Une participante peint avec soin à la table" } },
  // { id: "g-gold", src: images.kintsugiStill, alt: { en: "A blue bowl with golden kintsugi seams", fr: "Un bol bleu aux jointures dorées en kintsugi" } },
];

export const getGalleryImages = (lang: Lang): GalleryImage[] => sources.map((image) => ({ id: image.id, src: image.src, alt: image.alt[lang] }));
