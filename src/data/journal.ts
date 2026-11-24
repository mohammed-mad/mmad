import type { JournalPostSource } from "@/types/workshop";
import { images } from "@/data/images";

export const journalSources: JournalPostSource[] = [
  { id: "j-1", slug: "caring-for-kintsugi", image: images.kintsugiGoldPlates, title: { en: "Caring for your kintsugi piece", fr: "Prendre soin de votre pièce en kintsugi" }, alt: { en: "Flowered saucers mended with golden seams", fr: "Des soucoupes fleuries réparées avec des jointures dorées" } },
  { id: "j-2", slug: "cyanotype-no-two-prints", image: images.cyanotypePrint, title: { en: "Cyanotype: why no two prints match", fr: "Cyanotype : pourquoi aucun tirage ne se ressemble" }, alt: { en: "A blue botanical cyanotype print held up in the sun", fr: "Un cyanotype botanique bleu tenu au soleil" } },
  { id: "j-3", slug: "mosaic-three-patterns", image: images.mosaicPaper, title: { en: "Mosaic at home: three patterns to try", fr: "La mosaïque chez soi : trois motifs à essayer" }, alt: { en: "A colourful paper-square mosaic beside trays of cut squares", fr: "Une mosaïque colorée en carrés de papier, à côté de bacs de carrés découpés" } },
  { id: "j-4", slug: "crooked-tile", image: images.mosaicTilesNippers, title: { en: "In praise of the crooked tile", fr: "Éloge de la tesselle de travers" }, alt: { en: "Bowls of colourful mosaic tiles beside red tile nippers", fr: "Des bols de tesselles colorées à côté d’une pince à carrelage rouge" } },
];
