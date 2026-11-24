import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ScriptTitle from "@/components/ui/ScriptTitle";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  /** Optional "back" pill shown to the left of the title */
  back?: { to: string; label: string };
  children?: ReactNode;
}

/**
 * Header band for pages without a photo hero. The darker paper sits behind the
 * logo and the white menu bar so both stand out, and holds the page title.
 */
export default function PageHeader({ kicker, title, back, children }: PageHeaderProps) {
  return (
    <header className="dotted-bg bg-paper-dark pb-10 pt-[150px] lg:pb-14 lg:pt-[176px]">
      <div className="page-container grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex justify-center lg:justify-start">
          {back && (
            <Link to={back.to} className="inline-flex items-center gap-2 rounded-pill bg-white py-[9px] pl-4 pr-5 font-sans text-[14px] font-bold text-navy shadow-card transition hover:-translate-x-0.5 hover:text-navy">
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" /> {back.label}
            </Link>
          )}
        </div>
        <div className="text-center">
          {kicker && <ScriptTitle as="p">{kicker}</ScriptTitle>}
          <h1 className="display mt-2 text-[44px] leading-[1] text-navy lg:text-[56px]">{title}</h1>
          {children}
        </div>
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </header>
  );
}
