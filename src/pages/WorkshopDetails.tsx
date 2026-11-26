import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Clock, Coffee, Gift, Package, Shirt, Sparkles, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import BookingBackdrop from "@/components/booking/BookingBackdrop";
import ReserveCard from "@/components/booking/ReserveCard";
import InfoStats from "@/components/ui/InfoStats";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import { useT } from "@/i18n/LanguageContext";
import { useWorkshop } from "@/i18n/useLocalizedData";
import { track } from "@/lib/analytics";

const includeIcons = [Coffee, Package, Gift, Shirt, Sparkles];
const label = "font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sun";

export default function WorkshopDetails() {
  const { slug = "" } = useParams();
  const t = useT();
  const workshop = useWorkshop(slug);
  const workshopId = workshop?.id;

  useEffect(() => {
    if (!workshop) return;
    track("workshop_viewed", { workshopId: workshop.id, workshopSlug: workshop.slug, workshopName: workshop.title });
  }, [workshopId]);

  if (!workshop) return <Navigate to="/workshops" replace />;
  const d = t.detail;
  const galleryLayout =
    workshop.gallery.length === 1
      ? { grid: "", aspect: "aspect-[4/3] sm:aspect-[21/9]", sizes: "(min-width: 1160px) 1160px, 100vw" }
      : workshop.gallery.length === 2
        ? { grid: "sm:grid-cols-2", aspect: "aspect-[4/3] sm:aspect-[5/4]", sizes: "(min-width: 640px) 50vw, 100vw" }
        : { grid: "sm:grid-cols-3", aspect: "aspect-[4/3]", sizes: "(min-width: 640px) 33vw, 100vw" };

  return (
    <>
      <PageHero image={workshop.heroImage} imageAlt={`${workshop.title} – ${workshop.kicker}`} kicker={workshop.kicker} title={workshop.shortTitle} intro={<p className="lg:text-[17px] lg:leading-[28px]">{workshop.intro}</p>} align="left" minHeight="min-h-[max(600px,100svh)]">
        {workshop.active && (
          <div className="mt-7 w-full text-center lg:text-left">
            <Button to={`/book/${workshop.slug}`} variant="yellow" arrow>
              {d.reserve}
            </Button>
          </div>
        )}
        {(workshop.duration || workshop.maxParticipants !== null) && <div className="mt-8 w-full max-w-[660px]">
          <InfoStats
            stats={[
              ...(workshop.duration ? [{ label: d.duration, value: workshop.duration, Icon: Clock }] : []),
              ...(workshop.maxParticipants !== null ? [{ label: d.people, value: d.upTo(workshop.maxParticipants), Icon: Users }] : []),
            ]}
          />
        </div>}
      </PageHero>

      <section className="page-container py-14 lg:py-[80px]">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-6 font-sans text-[16px] leading-[26px] text-navy-soft lg:grid-cols-2 lg:gap-12 lg:text-[17px] lg:leading-[28px]">
          {workshop.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-[1160px] grid-cols-1 items-center gap-8 bg-paper-dark p-8 lg:grid-cols-[1fr_420px] lg:p-14">
          <div>
            <h2 className="font-sans text-h3 text-navy">{d.whatWillYouDo}</h2>
            <ul className="mt-5 space-y-2">
              {workshop.whatYouWillDo.map((line) => (
                <li key={line} className="flex items-start gap-3 font-sans text-[16px] leading-[26px] text-navy-soft">
                  <Check className="mt-[5px] h-4 w-4 shrink-0 text-navy" strokeWidth={3} aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <Photo picture={workshop.featureImage} alt="" sizes="(min-width: 1024px) 420px, 100vw" className="aspect-[4/3] w-full object-cover" />
        </div>

        <ul className={["mx-auto mt-14 grid max-w-[1160px] grid-cols-1 gap-6", galleryLayout.grid].join(" ")}>
          {workshop.gallery.map((src, index) => (
            <li key={index} className={["overflow-hidden", galleryLayout.aspect].join(" ")}>
              <Photo picture={src} alt={t.common.impression(workshop.title, index + 1)} sizes={galleryLayout.sizes} className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]" />
            </li>
          ))}
        </ul>
      </section>

      <section id="booking" className="relative scroll-mt-10 bg-navy py-14 lg:py-[80px]" aria-labelledby="booking-heading">
        <BookingBackdrop />
        <div className="page-container relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_640px] lg:gap-16">
          <div className="text-white">
            <dl className="space-y-6">
              {workshop.duration && <div>
                <dt className={label}>{d.duration}</dt>
                <dd className="mt-1 font-sans text-body">{workshop.duration}</dd>
              </div>}
              {workshop.maxParticipants !== null && <div>
                <dt className={label}>{d.people}</dt>
                <dd className="mt-1 font-sans text-body">{d.upToPeople(workshop.maxParticipants)}</dd>
              </div>}
              <div>
                <dt className={label}>{d.included}</dt>
                <dd className="mt-2">
                  <ul className="space-y-1">
                    {workshop.includes.map((item, index) => {
                      const Icon = includeIcons[index % includeIcons.length];
                      return (
                        <li key={item} className="flex items-center gap-3 font-sans text-[16px] leading-[26px]">
                          <Icon className="h-4 w-4 shrink-0 text-sun" strokeWidth={1.8} aria-hidden="true" />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
          <ReserveCard workshop={workshop} />
        </div>
      </section>

      <section className="page-container py-14 sm:py-16 lg:py-20" aria-label={t.common.aboutKintessa}>
        <div className="mx-auto flex max-w-[900px] items-center justify-center gap-10 lg:gap-20">
          <svg viewBox="0 0 120 110" className="hidden h-[100px] w-[110px] shrink-0 -rotate-12 text-navy-soft md:block" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <ellipse cx="59" cy="43" rx="45" ry="12" />
            <path d="M14 43c3 29 18 44 45 44s42-15 45-44M43 87l-3 7c12 5 26 5 38 0l-3-7" />
            <path d="m66 33-8 16 11 9-9 13 5 15" strokeWidth="2.4" />
            <path d="m94 13 3-7m7 17 8-2m-11-5 6-6" />
          </svg>
          <Link to="/about" className="group relative inline-flex shrink-0 items-center gap-3 py-5 font-display text-[22px] leading-tight text-navy outline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy min-[375px]:text-[27px] sm:gap-6 sm:text-[34px] lg:text-[42px]">
            <span className="relative">
              {t.common.aboutKintessa}
              <svg viewBox="0 0 320 18" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-5 left-0 h-[14px] w-full text-navy/50" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                <path d="M3 11c74-9 181-12 312-6M25 16c89-6 177-7 258-4" />
              </svg>
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-paper transition-colors group-hover:bg-navy-hover sm:h-14 sm:w-14" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform motion-safe:group-hover:translate-x-1 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </span>
          </Link>
          <svg viewBox="0 0 100 120" className="hidden h-[110px] w-[90px] shrink-0 rotate-12 text-navy-soft md:block" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M25 112Q50 69 65 12M36 92C10 84 12 66 16 57c17 5 26 17 20 35ZM47 70c24 3 36-9 37-24-21-2-35 7-37 24ZM56 46C36 39 36 22 41 13c16 7 22 20 15 33ZM65 14c4-9 12-13 22-12-1 12-9 19-22 20" />
            <path d="m22 70 14 22m11-22 24-15M44 25l12 21" strokeWidth="1" />
          </svg>
        </div>
      </section>
    </>
  );
}
