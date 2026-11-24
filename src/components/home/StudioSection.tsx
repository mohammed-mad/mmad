import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import SectionTitle from "@/components/ui/SectionTitle";
import { useT } from "@/i18n/LanguageContext";
import { images } from "@/data/images";

/** "A third place, not a classroom." – photo left, story right. */
export default function StudioSection() {
  const t = useT();
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2" aria-labelledby="home-third-place">
      <div className="relative h-[320px] sm:h-[440px] lg:h-auto lg:min-h-[590px]">
        <Photo picture={images.heroTable} alt={t.home.thirdPlaceAlt} sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover object-[40%_center]" />
      </div>
      <div className="flex items-center bg-paper-dark px-4 py-14 sm:px-8 lg:px-0 lg:py-20">
        <div className="max-w-[528px] lg:ml-[110px] lg:mr-10">
          <SectionTitle as="h2" id="home-third-place" accent={t.home.thirdPlaceAccent}>
            {t.home.thirdPlaceTitle}
          </SectionTitle>
          <p className="mt-5 font-sans text-body text-navy-soft">{t.home.thirdPlaceText}</p>
          <Button to="/about" variant="secondary" className="mt-7">
            {t.common.aboutKintessa}
          </Button>
        </div>
      </div>
    </section>
  );
}
