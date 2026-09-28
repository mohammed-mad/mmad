import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    // Every image imported from src/assets/images is resized and re-encoded on the fly
    // (dev and build). The source files on disk are never modified.
    imagetools({
      include: "**/src/assets/images/**/*.{jpg,jpeg,png,webp}*",
      defaultDirectives: new URLSearchParams({ w: "1920", format: "webp", quality: "80" }),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
