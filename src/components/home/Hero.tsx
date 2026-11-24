import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { useT } from "@/i18n/LanguageContext";
import { images } from "@/data/images";

export default function Hero() {
  const t = useT();
  // The header fills the screen so the next section never peeks in under the photo.
  return (
    <header className="relative isolate flex min-h-[max(640px,100svh)] flex-col overflow-hidden bg-navy">
      <Photo picture={images.heroGarden} alt={t.home.heroAlt} priority sizes="(orientation: portrait) 180vw, 100vw" className="absolute inset-0 h-full w-full object-cover object-[center_35%]" />
      {/* Darker on the text side so the copy stays readable over the bright garden */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20 lg:bg-gradient-to-r lg:from-black/65 lg:via-black/35 lg:to-black/10" aria-hidden="true" />
      <div className="relative flex flex-1 flex-col justify-end px-4 pb-16 pt-40 sm:px-6 lg:justify-center lg:px-10 lg:pb-16 lg:pt-[182px]">
        <div className="flex w-full max-w-[620px] flex-col items-center text-center lg:ml-[44px] lg:items-start lg:text-left">
          <ScriptTitle as="p" dashes={false} tone="light">
            {t.home.welcome}
          </ScriptTitle>
          <h1 className="display mt-3 text-[48px] leading-[48px] text-white sm:text-[60px] sm:leading-[60px] lg:text-[80px] lg:leading-[80px]">{t.home.title}</h1>
          <p className="mt-7 font-sans text-[17px] leading-[28px] text-white lg:text-intro">{t.home.intro}</p>
          <Button to="/workshops#upcoming" variant="yellow" arrow className="mt-8">
            {t.home.cta}
          </Button>
        </div>
      </div>
    </header>
  );
}
