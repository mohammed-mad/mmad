import type { ReactNode } from "react";

interface ScriptTitleProps {
  children: ReactNode;
  className?: string;
  dashes?: boolean;
  /** "light" (yellow) only over photos or navy; "dark" (navy) on light backgrounds. */
  tone?: "light" | "dark";
  as?: "p" | "span" | "h1" | "h2";
}

/** Handwritten Homemade Apple label, optionally between two short dashes. */
export default function ScriptTitle({ children, className = "", dashes = true, tone = "dark", as: Tag = "p" }: ScriptTitleProps) {
  return (
    <Tag className={[dashes ? "script-title" : "font-script text-script", tone === "light" ? "text-sun" : "text-navy", className].join(" ")}>{children}</Tag>
  );
}
