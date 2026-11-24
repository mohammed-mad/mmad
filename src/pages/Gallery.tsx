import Photo from "@/components/ui/Photo";
import ScriptTitle from "@/components/ui/ScriptTitle";
import { useT } from "@/i18n/LanguageContext";
import { useGallery } from "@/i18n/useLocalizedData";

export default function GalleryPage() {
  const t = useT();
  const images = useGallery();
  return (
    <section className="page-container pb-20 pt-[200px]">
      <div className="text-center">
        <ScriptTitle as="p">{t.galleryPage.kicker}</ScriptTitle>
        <h1 className="display mt-2 text-[44px] leading-[1] text-navy lg:text-[56px]">{t.galleryPage.title}</h1>
        <p className="mx-auto mt-4 max-w-[600px] font-sans text-body text-navy-soft">{t.galleryPage.intro}</p>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((image, index) => (
          <li key={image.id} className={["overflow-hidden", index === 0 ? "col-span-2 row-span-2" : ""].join(" ")}>
            <Photo picture={image.src} alt={image.alt} priority={index === 0} sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"} className="aspect-[4/3] h-full w-full object-cover transition duration-500 hover:scale-[1.04]" />
          </li>
        ))}
      </ul>
    </section>
  );
}
