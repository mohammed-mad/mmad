import ReviewsBlock from "@/components/ui/ReviewsBlock";
import { useT } from "@/i18n/LanguageContext";

export default function Reviews() {
  const t = useT();
  return (
    <section className="relative overflow-hidden py-16 lg:pt-[110px] lg:pb-[150px]" aria-label={t.home.reviewsAria}>
      <svg viewBox="0 0 320 240" className="pointer-events-none absolute -bottom-6 left-0 hidden h-[240px] w-auto text-navy-soft/70 lg:block" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 240Q90 180 196 90" />
        <path d="M45.6 214.8Q72.2 191 48.9 154.9Q21.8 188.2 45.6 214.8Z" />
        <path d="M72.6 192.9Q92.3 219.8 127.9 201.5Q99.4 173.3 72.6 192.9Z" />
        <path d="M101.2 169.5Q123.9 148.6 103.4 117.5Q80.3 146.7 101.2 169.5Z" />
        <path d="M129.3 146.1Q145.7 168 174.8 152.7Q151.2 129.8 129.3 146.1Z" />
        <path d="M156.8 123.1Q174.2 106.9 158.2 83.1Q140.6 105.8 156.8 123.1Z" />
        <path d="M196 90Q222 92.1 229.5 61.5Q198.1 64 196 90Z" />
        <g strokeWidth="1">
          <path d="M45.6 214.8L48 171.7" />
          <path d="M72.6 192.9L112.5 199.1" />
          <path d="M101.2 169.5L102.8 132.1" />
          <path d="M129.3 146.1L162.1 150.9" />
          <path d="M156.8 123.1L157.8 94.3" />
          <path d="M196 90L220.1 69.5" />
        </g>
        <circle cx="262" cy="200" r="22" />
        <path d="M262 178c-1-9 1-16 7-22" />
        <path d="M264 170c8-7 17-8 25-3-7 7-16 8-25 3Z" />
        <circle cx="300" cy="224" r="15" />
        <path d="M300 209c0-6 2-11 6-15" />
      </svg>
      <div className="page-container relative">
        <ReviewsBlock className="mx-auto max-w-[1220px]" />
      </div>
    </section>
  );
}
