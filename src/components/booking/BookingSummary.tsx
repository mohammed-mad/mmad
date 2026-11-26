import type { Workshop } from "@/types/workshop";
import Photo from "@/components/ui/Photo";
import ScriptTitle from "@/components/ui/ScriptTitle";
import WorkshopSessionDetails from "@/components/booking/WorkshopSessionDetails";

interface BookingSummaryProps {
  workshop: Workshop;
}

/**
 * Compact "what you're booking" card next to the Cal.com embed: image,
 * title, a short description and the essentials (duration, price, location).
 * Dated sessions show their venue and offers; availability still comes from Cal.com.
 */
export default function BookingSummary({ workshop }: BookingSummaryProps) {
  return (
    <div className="w-full min-w-0 overflow-hidden bg-white shadow-card">
      <Photo picture={workshop.cardImage} alt="" sizes="(min-width: 1024px) 300px, 100vw" priority className="aspect-[16/9] w-full object-cover lg:aspect-[4/3]" />
      <div className="p-6">
        <ScriptTitle as="p" dashes={false}>
          {workshop.kicker}
        </ScriptTitle>
        <h2 className="mt-1 font-sans text-h3 text-navy">{workshop.title}</h2>
        <p className="mt-3 font-sans text-[15px] leading-[24px] text-navy-soft">{workshop.summary}</p>
        <div className="mt-5"><WorkshopSessionDetails workshop={workshop} /></div>
      </div>
    </div>
  );
}
