import type { ReactNode } from "react";

interface SectionTitleProps {
  children: string;
  /** Word(s) at the end of the title that get the short underline accent */
  accent?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  tone?: "navy" | "white";
  extra?: ReactNode;
  id?: string;
}

export default function SectionTitle({ children, accent, className = "", as: Tag = "h2", align = "left", tone = "navy", extra, id }: SectionTitleProps) {
  const text = accent && children.endsWith(accent) ? children.slice(0, -accent.length) : children;
  return (
    <Tag id={id} className={["font-sans text-h2", tone === "navy" ? "text-navy" : "text-white", align === "center" ? "text-center" : "", className].join(" ")}>
      {text}
      {accent && children.endsWith(accent) && <span className="underline-accent">{accent}</span>}
      {extra}
    </Tag>
  );
}
