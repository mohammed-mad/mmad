import type { ReactNode } from "react";
import Photo from "@/components/ui/Photo";
import ScriptTitle from "@/components/ui/ScriptTitle";

interface PageHeroProps {
  image: Picture;
  imageAlt: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** "center" for page heroes, "left" for the workshop detail hero */
  align?: "center" | "left";
  minHeight?: string;
  imagePosition?: string;
}

/** Full-width photo hero with a dark overlay and centred copy. */
export default function PageHero({ image, imageAlt, kicker, title, intro, children, align = "center", minHeight = "min-h-[560px] lg:min-h-[660px]", imagePosition = "object-center" }: PageHeroProps) {
  const centered = align === "center";
  return (
    <header className={["relative isolate flex w-full overflow-hidden bg-navy", minHeight].join(" ")}>
      <Photo picture={image} alt={imageAlt} priority sizes="(orientation: portrait) 180vw, 100vw" className={["absolute inset-0 h-full w-full object-cover", imagePosition].join(" ")} />
      {/* Left-aligned heroes sit on busy photos: darken the text side more than the rest */}
      <div className={["absolute inset-0", centered ? "bg-black/40" : "bg-gradient-to-t from-black/70 via-black/45 to-black/30 lg:bg-gradient-to-r lg:from-black/75 lg:via-black/45 lg:to-black/15"].join(" ")} aria-hidden="true" />
      {/* Soft fade behind the transparent menu bar */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" aria-hidden="true" />
      <div className={["page-container relative flex flex-1 flex-col pb-16 pt-[190px] lg:pb-[100px] lg:pt-[190px]", centered ? "items-center text-center" : "items-start text-center lg:items-start"].join(" ")}>
        <ScriptTitle as="p" tone="light">{kicker}</ScriptTitle>
        <h1 className="display mt-3 max-w-[820px] text-[44px] leading-[1] text-white sm:text-[52px] lg:text-[58px] lg:leading-[60px]">{title}</h1>
        {intro && <div className={["mt-6 max-w-[620px] font-sans text-[17px] leading-[28px] text-white lg:text-intro", centered ? "" : "lg:text-left"].join(" ")}>{intro}</div>}
        {children}
      </div>
    </header>
  );
}
