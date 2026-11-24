/**
 * Every photo used on the site, in one place. The `?pic` suffix makes Vite build
 * responsive AVIF/WebP sets (see vite.config.ts); each value is a `Picture`.
 * High-resolution originals are preferred wherever one exists.
 */
// hero.jpg upscaled 2.5× with Lanczos + light sharpening (the original stays next to it)
import heroGarden from "@/assets/images/hero/hero-enhanced.jpg?pic";
import cafeTableTop from "@/assets/images/hero/hero2.jpg?pic";
import heroTable from "@/assets/images/hero/hero.jpg?pic";
import studioPainting from "@/assets/images/studio/studio1.jpg?pic";
import gardenTable from "@/assets/images/studio/studio.jpg?pic";
import materialsTable from "@/assets/images/gallery/gallery-5.jpg?pic";
import paintingCloseUp from "@/assets/images/gallery/gallery-1.jpg?pic";
import cyanotypePrint from "@/assets/images/gallery/gallery-2.jpg?pic";
import carving from "@/assets/images/gallery/gallery-12.jpg?pic";
import mosaicCat from "@/assets/images/gallery/gallery-4.jpg?pic";
import kintsugiBowl from "@/assets/images/cta/kintsugi-table.jpg?pic";
import kintsugiStill from "@/assets/images/cards/kintsugi1.jpg?pic";
import kintsugiHands from "@/assets/images/cards/kintsugi.jpg?pic";
import cyanotypeHands from "@/assets/images/cards/cyanotype.jpg?pic";
import cyanotypeBlue from "@/assets/images/cards/cyanotype1.jpg?pic";
import mosaicTiles from "@/assets/images/cards/mosaic.jpg?pic";
import mosaicTable from "@/assets/images/workshops/mosaic.jpg?pic";
import host from "@/assets/images/people/maker.jpg?pic";
// Kintsugi workshop photos: originals in kintsugi/originals, upscaled 2× + cleaned up here
import kintsugiGoldPlates from "@/assets/images/kintsugi/gold-plates.jpg?pic";
import kintsugiGloves from "@/assets/images/kintsugi/gloves-mending.jpg?pic";
import kintsugiTeapot from "@/assets/images/kintsugi/hands-teapot.jpg?pic";
import kintsugiTable from "@/assets/images/kintsugi/table-overhead.jpg?pic";
// Mosaic workshop photos: originals in mosaic/originals, upscaled 2× + cleaned up here
import mosaicTilesNippers from "@/assets/images/mosaic/tiles-and-nippers.jpg?pic";
import mosaicBaskets from "@/assets/images/mosaic/tile-baskets.jpg?pic";
import mosaicPaper from "@/assets/images/mosaic/paper-mosaic.jpg?pic";

export const images = {
  heroGarden,
  cafeTableTop,
  heroTable,
  studioPainting,
  gardenTable,
  materialsTable,
  paintingCloseUp,
  cyanotypePrint,
  carving,
  mosaicCat,
  kintsugiBowl,
  kintsugiStill,
  kintsugiHands,
  cyanotypeHands,
  cyanotypeBlue,
  mosaicTiles,
  mosaicTable,
  host,
  kintsugiGoldPlates,
  kintsugiGloves,
  kintsugiTeapot,
  kintsugiTable,
  mosaicTilesNippers,
  mosaicBaskets,
  mosaicPaper,
};
