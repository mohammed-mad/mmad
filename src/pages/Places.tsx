import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import { useT } from "@/i18n/LanguageContext";
import { images } from "@/data/images";

const blockTitle = "font-sans text-h2 text-navy";
const blockText = "mt-4 font-sans text-[16px] leading-[26px] text-navy-soft lg:text-[17px] lg:leading-[28px]";

/** "The places": where the workshops happen, ending on the three crafts and a link to the workshops. */
export default function Places() {
  const t = useT();
  const p = t.placesPage;

  return (
    <>
      <PageHero image={images.heroTable} imageAlt={p.heroAlt} kicker={p.kicker} title={p.title} intro={<p>{p.intro}</p>} minHeight="min-h-[520px] lg:min-h-[600px]" imagePosition="object-[center_40%]" />

      <section className="page-container py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pr-6">
            <h2 className={blockTitle}>{p.block1Title}</h2>
            <p className={blockText}>{p.block1Text}</p>
          </div>
          <Photo picture={images.cafeTableTop} alt={p.block1Alt} sizes="(min-width: 1160px) 548px, (min-width: 1024px) 46vw, 100vw" className="aspect-[4/3] w-full rounded-[2px] object-cover object-[center_55%]" />
        </div>

        <div className="mx-auto mt-16 grid max-w-[1160px] grid-cols-1 items-center gap-8 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          <Photo picture={images.materialsTable} alt={p.block2Alt} sizes="(min-width: 1160px) 548px, (min-width: 1024px) 46vw, 100vw" className="order-2 aspect-[4/3] w-full rounded-[2px] object-cover lg:order-1" />
          <div className="order-1 lg:order-2 lg:pl-6">
            <h2 className={blockTitle}>{p.block2Title}</h2>
            <p className={blockText}>{p.block2Text}</p>
          </div>
        </div>
      </section>

      {/* Reviews stay hidden until there are real ones. */}

      <section className="grid grid-cols-1 lg:grid-cols-2" aria-labelledby="places-belief">
        {/* The portrait mosaic runs tall on the left; cyanotype and kintsugi stack on the right. */}
        <div className="grid h-[420px] grid-cols-2 grid-rows-2 gap-[3px] bg-paper sm:h-[520px] lg:h-[600px]">
          <Photo picture={images.placesMosaic} alt={p.block3Alts[2]} sizes="(min-width: 1024px) 25vw, 50vw" className="row-span-2 h-full w-full object-cover object-center" />
          <Photo picture={images.placesCyanotype} alt={p.block3Alts[1]} sizes="(min-width: 1024px) 25vw, 50vw" className="h-full w-full object-cover object-center" />
          <Photo picture={images.placesKintsugi} alt={p.block3Alts[0]} sizes="(min-width: 1024px) 25vw, 50vw" className="h-full w-full object-cover object-[center_45%]" />
        </div>
        <div className="flex items-center bg-paper-dark px-4 py-14 sm:px-8 lg:px-[80px] lg:py-20">
          <div className="max-w-[520px]">
            <h2 id="places-belief" className={blockTitle}>
              {p.block3Title}
            </h2>
            <p className={blockText}>{p.block3Text}</p>
            <Button to="/workshops" variant="secondary" arrow className="mt-8">
              {t.common.seeWorkshops}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
