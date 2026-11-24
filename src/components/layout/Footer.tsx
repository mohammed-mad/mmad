import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { getLegalLinks, getNavLinks } from "@/data/site";
import { useT } from "@/i18n/LanguageContext";

export default function Footer() {
  const t = useT();
  const navLinks = getNavLinks(t);
  const legalLinks = getLegalLinks(t);

  return (
    <footer className="rough-edge-top bg-navy text-white">
      <div className="bg-dots-light bg-dots">
        <div className="page-container pt-[96px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[250px_200px_260px_1fr] lg:gap-0">
            <div>
              <Logo tone="light" size={190} />
            </div>

            <div>
              <h3 className="font-sans text-label uppercase text-white">{t.footer.menu}</h3>
              <ul className="mt-1">
                {[...navLinks, { label: t.nav.contact, to: "/contact" }].map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="block pb-2 font-sans text-body text-white transition hover:text-sun">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-label uppercase text-white">{t.footer.location}</h3>
              <p className="mt-1 font-sans text-body text-white lg:pr-10">
                {t.footer.locationLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div className="lg:max-w-[472px]">
              <h3 className="font-sans text-h3 text-white">{t.footer.newsletterTitle}</h3>
              <p className="mt-2 font-sans text-body text-white/70">{t.footer.newsletterText}</p>
              <NewsletterForm className="mt-4" />
            </div>
          </div>

          <div className="mt-[92px] mb-10 flex border border-white/20 md:min-h-[62px] md:items-center md:justify-center">
            <ul className="flex flex-wrap items-center justify-center gap-y-2 px-4 py-4">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="px-4 font-sans text-tiny uppercase text-white/50 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="px-4 font-sans text-tiny uppercase text-white/50">{t.footer.rights}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
