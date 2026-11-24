import { Link } from "react-router-dom";
import type { Workshop } from "@/types/workshop";
import Photo from "@/components/ui/Photo";
import { useWorkshopPrice } from "@/lib/useWorkshopPrice";

interface WorkshopCardProps {
  workshop: Workshop;
  className?: string;
  /** Fill the parent's width (grid layouts) instead of the fixed carousel widths. */
  fluid?: boolean;
}

/** Portrait photo card with handwritten kicker, display title and price pill. */
export default function WorkshopCard({ workshop, className = "", fluid = false }: WorkshopCardProps) {
  const price = useWorkshopPrice(workshop);
  return (
    <Link
      to={`/workshops/${workshop.slug}`}
      className={["group relative block aspect-[420/576] shrink-0 snap-start overflow-hidden rounded-[2px]", fluid ? "w-full" : "w-[300px] sm:w-[360px] lg:w-[420px]", className].join(" ")}
      aria-label={[`${workshop.kicker}: ${workshop.shortTitle}`, price].filter(Boolean).join(", ")}
    >
      <Photo picture={workshop.cardImage} alt="" sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 300px" className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-7 text-center">
        <span className="font-script text-[17px] leading-[30px] text-sun">{workshop.kicker}</span>
        <span className="display mt-2 text-[34px] leading-none text-white lg:text-card-display">{workshop.shortTitle}</span>
        {price && <span className="mt-3 inline-flex items-center rounded-pill bg-navy px-[14px] py-[3px] font-sans text-[15px] font-bold leading-[22px] text-white">{price}</span>}
      </div>
    </Link>
  );
}
