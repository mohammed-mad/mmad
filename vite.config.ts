import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import path from "node:path";

/**
 * Photos: originals live in `photos/`; `npm run dev` / `npm run build` first run
 * scripts/optimize-images.mjs, which writes enhanced, size-capped masters to
 * `src/assets/images/`. Each master imported with `?pic` is then turned here into
 * a responsive <picture> source set.
 *
 * - Production build: AVIF + WebP at up to five widths (smallest files, encoded once).
 * - Dev server: WebP only at three widths, so pages show their photos quickly while
 *   working (AVIF is slow to encode on the fly).
 */
const BUILD_WIDTHS = [480, 800, 1200, 1600, 2048];
const DEV_WIDTHS = [640, 1200, 2048];

export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  const widthsFor = (sourceWidth: number) => {
    const ladder = isBuild ? BUILD_WIDTHS : DEV_WIDTHS;
    // Never larger than the master itself.
    const widths = ladder.filter((w) => w < sourceWidth);
    widths.push(Math.min(sourceWidth, ladder[ladder.length - 1]));
    return [...new Set(widths)].join(";");
  };

  return {
    plugins: [
      react(),
      imagetools({
        include: "**/src/assets/images/**/*.{jpg,jpeg,png,webp}*",
        defaultDirectives: async (url, metadata) => {
          if (!url.searchParams.has("pic")) return new URLSearchParams({ w: "1920", format: "webp", quality: "80" });
          const meta = await metadata();
          // EXIF orientations 5–8 are rotated 90°, so the visible width is the stored height.
          const sourceWidth = (meta.orientation ?? 1) >= 5 ? (meta.height ?? 0) : (meta.width ?? 0);
          return new URLSearchParams({
            w: widthsFor(sourceWidth),
            format: isBuild ? "avif;webp" : "webp",
            quality: isBuild ? "58" : "75",
            effort: isBuild ? "4" : "0",
            as: "picture",
          });
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
