import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import type { TransformFactory } from "imagetools-core";
import path from "node:path";

/** Widths offered to the browser in each srcset. Never larger than the source photo. */
const RESPONSIVE_WIDTHS = [480, 800, 1200, 1600, 2048];

/** A light unsharp mask after downscaling keeps photos crisp instead of soft. */
const sharpen: TransformFactory<{ sharpen: string }> = (config, ctx) => {
  if (config.sharpen === undefined) return undefined;
  ctx.useParam("sharpen");
  return (image) => image.sharpen({ sigma: 0.5, m1: 0.5, m2: 0.8 });
};

export default defineConfig({
  plugins: [
    react(),
    // Every photo imported from src/assets/images with `?pic` becomes a <picture> source set:
    // AVIF + WebP at several widths, so each screen downloads only the size it needs.
    // The source files on disk are never modified.
    imagetools({
      include: "**/src/assets/images/**/*.{jpg,jpeg,png,webp}*",
      extendTransforms: (builtins) => [...builtins, sharpen as TransformFactory],
      defaultDirectives: async (url, metadata) => {
        if (!url.searchParams.has("pic")) return new URLSearchParams({ w: "1920", format: "webp", quality: "80" });
        const meta = await metadata();
        // EXIF orientations 5–8 are rotated 90°, so the visible width is the stored height.
        const sourceWidth = (meta.orientation ?? 1) >= 5 ? meta.height ?? 0 : meta.width ?? 0;
        const widths = RESPONSIVE_WIDTHS.filter((w) => w < sourceWidth);
        widths.push(Math.min(sourceWidth, RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1]));
        return new URLSearchParams({
          w: [...new Set(widths)].join(";"),
          format: "avif;webp",
          quality: "58",
          effort: "4",
          sharpen: "",
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
});
