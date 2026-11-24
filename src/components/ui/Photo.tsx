import type { CSSProperties } from "react";

interface PhotoProps {
  picture: Picture;
  alt: string;
  /** Rendered width hint for the browser, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  /** Above-the-fold images load eagerly with high priority; everything else is lazy. */
  priority?: boolean;
  className?: string;
  /** Classes for the <picture> wrapper (it is `display: contents` by default). */
  pictureClassName?: string;
  style?: CSSProperties;
}

/**
 * Responsive photo: AVIF and WebP at several widths, so each screen downloads
 * only the size it needs. Intrinsic width/height prevent layout shift.
 */
export default function Photo({ picture, alt, sizes = "100vw", priority = false, className = "", pictureClassName = "contents", style }: PhotoProps) {
  return (
    <picture className={pictureClassName}>
      {Object.entries(picture.sources).map(([format, srcSet]) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet} sizes={sizes} className="hidden" />
      ))}
      <img
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        // React 18 only knows the lowercase attribute.
        {...{ fetchpriority: priority ? "high" : "auto" }}
        className={className}
        style={style}
      />
    </picture>
  );
}
