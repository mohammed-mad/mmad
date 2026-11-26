/**
 * Every photo used on the site, in one place.
 *
 * To add or replace a photo: put the original in `photos/<folder>/` and import its
 * optimized master from `src/assets/images/<folder>/<name>.jpg?pic` below. The master
 * is created automatically by `npm run dev` / `npm run build` (scripts/optimize-images.mjs):
 * huge photos are shrunk, small ones upscaled and cleaned up, all lightly sharpened.
 * The `?pic` suffix then makes Vite build responsive AVIF/WebP sets; each value is a `Picture`.
 */
import heroGarden from "@/assets/images/hero/hero.jpg?pic";
import cafeTableTop from "@/assets/images/hero/hero2.jpg?pic";
import heroTable from "@/assets/images/hero/hero.jpg?pic";
import studioPainting from "@/assets/images/studio/studio1.jpg?pic";
import gardenTable from "@/assets/images/studio/studio.jpg?pic";
import materialsTable from "@/assets/images/gallery/gallery-5.jpg?pic";
import journalCyanotypeTable from "@/assets/images/journal/cyanotype-table.jpg?pic";
import placesMosaic from "@/assets/images/places/mosaic-lantern.jpg?pic";
import placesCyanotype from "@/assets/images/places/cyanotype-prints.jpg?pic";
import placesKintsugi from "@/assets/images/places/kintsugi-mending.jpg?pic";
import paintingCloseUp from "@/assets/images/gallery/gallery-1.jpg?pic";
import cyanotypePrint from "@/assets/images/gallery/gallery-2.jpg?pic";
import mosaicCat from "@/assets/images/gallery/gallery-4.jpg?pic";
import kintsugiBowl from "@/assets/images/cta/kintsugi-table.jpg?pic";
import kintsugiStill from "@/assets/images/cards/kintsugi1.jpg?pic";
import kintsugiHands from "@/assets/images/cards/kintsugi.jpg?pic";
import cyanotypeHands from "@/assets/images/cards/cyanotype.jpg?pic";
import cyanotypeBlue from "@/assets/images/cards/cyanotype1.jpg?pic";
import mosaicTiles from "@/assets/images/cards/mosaic.jpg?pic";
import host from "@/assets/images/people/maker.jpg?pic";
// Kintsugi workshop photos
import kintsugiGoldPlates from "@/assets/images/kintsugi/gold-plates.jpg?pic";
import kintsugiGloves from "@/assets/images/kintsugi/gloves-mending.jpg?pic";
import kintsugiTeapot from "@/assets/images/kintsugi/hands-teapot.jpg?pic";
import kintsugiTable from "@/assets/images/kintsugi/table-overhead.jpg?pic";
// Mosaic workshop photos
// Cyanotype workshop photos
import cyanotypeRinsing from "@/assets/images/cyanotype/rinsing-prints.jpg?pic";
import cyanotypeCoating from "@/assets/images/cyanotype/coating-paper.jpg?pic";
import cyanotypeArtist from "@/assets/images/cyanotype/artist-with-prints.jpg?pic";
import cyanotypeBotanical from "@/assets/images/cyanotype/botanical-table.jpg?pic";
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
  journalCyanotypeTable,
  placesMosaic,
  placesCyanotype,
  placesKintsugi,
  paintingCloseUp,
  cyanotypePrint,
  mosaicCat,
  kintsugiBowl,
  kintsugiStill,
  kintsugiHands,
  cyanotypeHands,
  cyanotypeBlue,
  mosaicTiles,
  host,
  kintsugiGoldPlates,
  kintsugiGloves,
  kintsugiTeapot,
  kintsugiTable,
  cyanotypeRinsing,
  cyanotypeCoating,
  cyanotypeArtist,
  cyanotypeBotanical,
  mosaicTilesNippers,
  mosaicBaskets,
  mosaicPaper,
};
