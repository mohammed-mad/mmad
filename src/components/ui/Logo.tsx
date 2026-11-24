import type { SVGProps } from "react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";

interface LogoProps {
  /** "light" on navy or photos (paper mark + yellow slogan); "dark" on light backgrounds (all navy) */
  tone?: "light" | "dark";
  /** Width in px; the lock-up keeps its proportions */
  size?: number;
  className?: string;
}

/** The Kintessa symbol: a "k" whose stem carries the two dots of an "ï", drawn with rounded strokes. */
export function LogoMark({ color = "currentColor", ...svgProps }: { color?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 152 145" fill="none" stroke={color} strokeWidth="23" strokeLinecap="round" aria-hidden="true" {...svgProps}>
      <path d="M77 36v91" />
      <path d="M17 39 77 85 17 128" strokeLinejoin="round" />
      <path d="M137 39 77 85l60 43" strokeLinejoin="round" />
      <circle cx="67" cy="10" r="9.5" fill={color} stroke="none" />
      <circle cx="87" cy="10" r="9.5" fill={color} stroke="none" />
    </svg>
  );
}

/**
 * Logo lock-up from the brand guide: symbol, "kintessa" in Literata (lowercase, regular)
 * and "your third place" in Homemade Apple. Yellow is only used on dark backgrounds.
 */
export default function Logo({ tone = "dark", size = 150, className = "" }: LogoProps) {
  const t = useT();
  const main = tone === "light" ? "#F8F9F0" : "#022264";
  const slogan = tone === "light" ? "#FFDE59" : "#022264";
  return (
    <Link to="/" aria-label={t.brand.home} className={["inline-block shrink-0", className].join(" ")}>
      <svg viewBox="0 0 300 212" width={size} height={(size * 212) / 300} aria-hidden="true">
        <LogoMark color={main} x="113" y="2" width="74" height="70" />
        <text x="150" y="146" textAnchor="middle" fill={main} fontFamily="'Literata Variable', Literata, Georgia, serif" fontSize="72" fontWeight="400" letterSpacing="0.5">
          kintessa
        </text>
        <text x="154" y="196" textAnchor="middle" fill={slogan} fontFamily="'Homemade Apple', cursive" fontSize="24">
          your third place
        </text>
      </svg>
    </Link>
  );
}
