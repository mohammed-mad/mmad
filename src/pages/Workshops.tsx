import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import SectionTitle from "@/components/ui/SectionTitle";
import WorkshopCard from "@/components/ui/WorkshopCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { useWorkshops } from "@/i18n/useLocalizedData";
import { images } from "@/data/images";

export default function Workshops() {
  const { t } = useLanguage();
  const workshops = useWorkshops();
  const activeWorkshops = workshops.filter((workshop) => workshop.active);
  const w = t.workshopsPage;

  return (
    <>
      <PageHero
        image={images.studioPainting}
        imageAlt={w.heroAlt}
        kicker={w.kicker}
        title={w.title}
        intro={
          <p>
            {w.intro1}
            <Link to="/private-workshops" className="text-sun underline-offset-2 hover:underline">
              {w.introLink}
            </Link>
            {w.intro2}
          </p>
        }
      >
        <Button href="#upcoming" variant="yellow" arrow className="mt-8">
          {w.seeDates}
        </Button>
      </PageHero>

      <section className="page-container pt-14 lg:pt-20" aria-labelledby="three-workshops">
        <div className="mx-auto max-w-[1300px]">
          <h2 id="three-workshops" className="font-sans text-h2 text-navy">
            {w.threeWorkshops}
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-6">
            {workshops.map((workshop) => (
              <li key={workshop.id}>
                <WorkshopCard workshop={workshop} fluid />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="upcoming" className="page-container scroll-mt-24 py-16 lg:py-24" aria-labelledby="upcoming-heading">
        <div className="mx-auto max-w-[620px]">
          <SectionTitle as="h2" id="upcoming-heading" accent={w.upcomingAccent} align="center">
            {w.upcomingTitle}
          </SectionTitle>
          <ul className="mt-6 border-t border-navy/15">
            {activeWorkshops.map((workshop) => (
              <li key={workshop.id} className="border-b border-navy/15">
                <Link to={`/book/${workshop.slug}`} className="grid grid-cols-[1fr_auto] items-center gap-4 px-2 py-4 transition hover:bg-paper-dark sm:grid-cols-[180px_1fr_auto]">
                  <span className="font-sans text-[15px] font-bold text-navy">{workshop.shortTitle}</span>
                  <span className="hidden font-sans text-[15px] text-navy-soft sm:block">{workshop.duration}</span>
                  <span className="rounded-pill bg-sun px-[10px] py-[2px] font-sans text-[10px] font-bold uppercase text-navy">{t.booking.seeDates}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center font-sans text-[15px] leading-[26px] text-navy-soft">{w.newsletterNote}</p>
        </div>
      </section>

      {/* Reviews stay hidden until there are real ones. */}

      <section className="grid grid-cols-1 lg:grid-cols-2" aria-labelledby="private-heading">
        <div className="relative h-[320px] sm:h-[420px] lg:h-auto lg:min-h-[520px]">
          <Photo picture={images.paintingCloseUp} alt={w.privateAlt} sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />
        </div>
        <div className="flex items-center bg-paper-dark px-4 py-14 sm:px-8 lg:px-[80px]">
          <div className="max-w-[520px]">
            <h2 id="private-heading" className="font-sans text-h2 text-navy">
              {w.privateTitle}
            </h2>
            <p className="mt-4 font-sans text-body text-navy-soft">{w.privateText}</p>
            <Button to="/private-workshops" variant="secondary" className="mt-7">
              {t.common.moreInformation}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
