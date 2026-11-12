import type { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  /** Small qualifier under the value, e.g. "per person" */
  hint?: string;
  Icon: LucideIcon;
}

/** White strip of key facts (price, duration, group size), one column per fact. */
export default function InfoStats({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  return (
    <dl className={["grid divide-x divide-green/10 overflow-hidden rounded-[4px] bg-white shadow-float", className].join(" ")} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map(({ label, value, hint, Icon }) => (
        <div key={label} className="flex flex-col items-center gap-2 px-2 py-4 text-center sm:flex-row sm:gap-3 sm:px-4 sm:py-[18px] sm:text-left">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-beige-dark text-tomato" aria-hidden="true">
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <dt className="font-sans text-[10px] font-bold uppercase leading-[14px] tracking-[0.14em] text-tomato">{label}</dt>
            <dd className="mt-[2px] font-sans text-[15px] font-bold leading-[20px] text-green sm:whitespace-nowrap sm:text-[16px]">
              {value}
              {hint && <span className="block font-sans text-[12px] font-medium leading-[16px] text-green-olive">{hint}</span>}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
