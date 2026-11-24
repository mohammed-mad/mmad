import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Banknote, Check, Clock, Coffee, Gift, Package, Shirt, Sparkles, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import BookingBackdrop from "@/components/booking/BookingBackdrop";
import ReserveCard from "@/components/booking/ReserveCard";
import InfoStats from "@/components/ui/InfoStats";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { useT } from "@/i18n/LanguageContext";
import { useWorkshop } from "@/i18n/useLocalizedData";
import { useWorkshopPrice } from "@/lib/useWorkshopPrice";
import { track } from "@/lib/analytics";
import { images } from "@/data/images";

const includeIcons = [Coffee, Package, Gift, Shirt, Sparkles];
const label = "font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-sun";

export default function WorkshopDetails() {
  const { slug = "" } = useParams();
  const t = useT();
  const workshop = useWorkshop(slug);
  const workshopId = workshop?.id;
  const price = useWorkshopPrice(workshop);

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
        <div className="mt-8 w-full max-w-[660px]">
          <InfoStats
            stats={[
              ...(price ? [{ label: d.price, value: price, hint: t.common.perPerson, Icon: Banknote }] : []),
              { label: d.duration, value: workshop.duration, Icon: Clock },
              { label: d.people, value: d.upTo(workshop.maxParticipants), Icon: Users },
            ]}
          />
        </div>
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
              {price && (
                <div>
                  <dt className={label}>{d.price}</dt>
                  <dd className="mt-1 font-sans text-body">
                    {price} {t.common.perPerson}
                  </dd>
                </div>
              )}
              <div>
                <dt className={label}>{d.duration}</dt>
                <dd className="mt-1 font-sans text-body">{workshop.duration}</dd>
              </div>
              <div>
                <dt className={label}>{d.people}</dt>
                <dd className="mt-1 font-sans text-body">{d.upToPeople(workshop.maxParticipants)}</dd>
              </div>
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

      <section className="page-container py-16 lg:py-[96px]" aria-labelledby="host-heading">
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 items-center gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <Photo picture={images.host} alt={d.hostAlt} sizes="220px" className="mx-auto h-[220px] w-[220px] rounded-full object-cover" />
          <div>
            <ScriptTitle as="p" dashes={false}>
              {d.hostKicker}
            </ScriptTitle>
            <h2 id="host-heading" className="font-sans text-h2 text-navy">
              {d.hostName}
            </h2>
            {d.hostText && <p className="mt-4 font-sans text-[16px] leading-[26px] text-navy-soft">{d.hostText}</p>}
            <Button to="/about" variant="secondary" size="sm" className="mt-6">
              {t.common.aboutKintessa}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
