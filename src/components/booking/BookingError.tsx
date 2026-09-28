import Button from "@/components/ui/Button";
import { useT } from "@/i18n/LanguageContext";

interface BookingErrorProps {
  onRetry: () => void;
}

/** Shown when the Cal.com embed fails to load or times out. */
export default function BookingError({ onRetry }: BookingErrorProps) {
  const t = useT();

  return (
    <div role="alert" className="flex min-h-[420px] w-full flex-col items-center justify-center gap-5 bg-white p-6 text-center shadow-float lg:p-9">
      <p className="font-sans text-[18px] font-bold text-green">{t.booking.errorTitle}</p>
      <Button variant="primary" onClick={onRetry}>
        {t.booking.retry}
      </Button>
    </div>
  );
}
