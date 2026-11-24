import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { FaqItem } from "@/types/workshop";
import { useT } from "@/i18n/LanguageContext";

interface FaqListProps {
  items: FaqItem[];
  title?: string;
}

export default function FaqList({ items, title }: FaqListProps) {
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  const heading = title ?? t.contactPage.faqTitle;
  return (
    <div>
      <h2 className="font-sans text-h3 text-navy">{heading}</h2>
      <ul className="mt-4 border-t border-navy/15">
        {items.map((item) => {
          const expanded = open === item.id;
          return (
            <li key={item.id} className="border-b border-navy/15">
              <button type="button" onClick={() => setOpen(expanded ? null : item.id)} aria-expanded={expanded} aria-controls={`faq-${item.id}`} className="flex w-full items-center gap-4 py-[14px] text-left">
                {expanded ? <Minus className="h-4 w-4 shrink-0 text-navy" strokeWidth={2.5} aria-hidden="true" /> : <Plus className="h-4 w-4 shrink-0 text-navy" strokeWidth={2.5} aria-hidden="true" />}
                <span className="font-sans text-[15px] font-bold text-navy">{item.question}</span>
              </button>
              {expanded && (
                <p id={`faq-${item.id}`} className="pb-5 pl-8 pr-4 font-sans text-[16px] leading-[26px] text-navy-soft">
                  {item.answer}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
