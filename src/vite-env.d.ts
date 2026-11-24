/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAL_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Responsive photo produced by vite-imagetools (see vite.config.ts). */
interface Picture {
  /** srcset strings keyed by format, best format first (avif, webp) */
  sources: Record<string, string>;
  /** fallback image with its intrinsic size */
  img: { src: string; w: number; h: number };
}

declare module "*?pic" {
  const picture: Picture;
  export default picture;
}
