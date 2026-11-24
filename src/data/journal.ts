import type { JournalPostSource } from "@/types/workshop";
import { images } from "@/data/images";

export const journalSources: JournalPostSource[] = [
  { id: "j-1", slug: "caring-for-kintsugi", image: images.kintsugiBowl, title: { en: "Caring for your kintsugi piece", fr: "Prendre soin de votre pièce en kintsugi" }, alt: { en: "A ceramic plate mended with golden seams", fr: "Une assiette en céramique réparée avec des jointures dorées" } },
  { id: "j-2", slug: "cyanotype-no-two-prints", image: images.cyanotypePrint, title: { en: "Cyanotype: why no two prints match", fr: "Cyanotype : pourquoi aucun tirage ne se ressemble" }, alt: { en: "A blue botanical cyanotype print held up in the sun", fr: "Un cyanotype botanique bleu tenu au soleil" } },
  { id: "j-3", slug: "mosaic-three-patterns", image: images.mosaicCat, title: { en: "Mosaic at home: three patterns to try", fr: "La mosaïque chez soi : trois motifs à essayer" }, alt: { en: "A mosaic cat in blue tiles on a yellow wall", fr: "Un chat en mosaïque bleue sur un mur jaune" } },
  { id: "j-4", slug: "crooked-tile", image: images.mosaicTiles, title: { en: "In praise of the crooked tile", fr: "Éloge de la tesselle de travers" }, alt: { en: "Hands sorting coloured mosaic tiles on a table", fr: "Des mains trient des tesselles colorées sur une table" } },
];
