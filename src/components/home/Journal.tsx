import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import SectionTitle from "@/components/ui/SectionTitle";
import { useT } from "@/i18n/LanguageContext";
import { useJournalPosts } from "@/i18n/useLocalizedData";

export default function Journal() {
  const t = useT();
  const posts = useJournalPosts();
  return (
    <section className="bg-paper py-16 lg:pt-[72px] lg:pb-[104px]" aria-labelledby="home-journal">
      <div className="page-container">
        <SectionTitle as="h2" accent={t.home.journalAccent} align="center">
          {t.home.journalTitle}
        </SectionTitle>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {posts.map((post) => (
            <li key={post.id} className="h-full">
              <Link to="/gallery" className="group flex h-full flex-col bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="aspect-[308/280] overflow-hidden">
                  <Photo picture={post.image} alt={post.alt} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <h4 className="flex-1 p-6 pb-8 font-sans text-h4 text-navy">{post.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button to="/gallery" variant="secondary">
            {t.common.allNotes}
          </Button>
        </div>
      </div>
    </section>
  );
}
