import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import { useT } from "@/i18n/LanguageContext";
import { images } from "@/data/images";

export default function About() {
  const t = useT();
  const a = t.aboutPage;
  return (
    <>
      <PageHero image={images.kintsugiBowl} imageAlt={a.heroAlt} kicker={a.kicker} title={a.title} minHeight="min-h-[440px] lg:min-h-[520px]" imagePosition="object-[center_45%]" />

      <section className="page-container py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-6 font-sans text-[16px] leading-[26px] text-navy-soft lg:grid-cols-2 lg:gap-14 lg:text-[17px] lg:leading-[28px]">
          <p>{a.text1}</p>
          <p>{a.text2}</p>
        </div>

        {/* "Your story" stays hidden until the text is written (translations: aboutPage.story). */}
        {a.story && <p className="mx-auto mt-14 max-w-[720px] text-center font-sans text-[18px] leading-[30px] text-navy">{a.story}</p>}

        <div className="mx-auto mt-14 max-w-[1000px] lg:mt-20">
          <Photo picture={images.heroTable} alt={a.photoAlt} sizes="(min-width: 1000px) 1000px, 100vw" className="aspect-[3/2] w-full rounded-[2px] object-cover sm:aspect-[16/9]" />
        </div>

        <div className="mt-12 text-center">
          <Button to="/workshops" arrow>
            {t.common.seeWorkshops}
          </Button>
        </div>
      </section>
    </>
  );
}
