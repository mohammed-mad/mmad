import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { getNavLinks } from "@/data/site";
import { useT } from "@/i18n/LanguageContext";

/** Pages that open with a dark photo hero get the white logo. */
const darkHeroPattern = /^\/($|workshops|places|about|contact|private-workshops)/;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const t = useT();
  const navLinks = getNavLinks(t);
  const onDarkHero = darkHeroPattern.test(pathname);

  return (
    <div className="absolute inset-x-0 top-0 z-40">
      {/* Desktop: logo left, links centred, Contact + language right; all transparent over the page */}
      <div className="flex items-start justify-between px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:px-10">
        <div className="pt-4 lg:justify-self-start lg:pt-5">
          <Logo tone={onDarkHero ? "light" : "dark"} size={120} className="lg:hidden" />
          <Logo tone={onDarkHero ? "light" : "dark"} size={160} className="hidden lg:inline-block" />
        </div>

        {/* Links centred on the page */}
        <nav aria-label="Primary" className={["hidden items-center gap-1 lg:flex xl:gap-3", onDarkHero ? "text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]" : "text-navy"].join(" ")}>
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                ["px-3 py-3 font-sans text-[16px] leading-[28px] transition xl:px-[14px] xl:text-[17px]", isActive ? (onDarkHero ? "text-sun" : "underline decoration-[1.5px] underline-offset-[6px]") : onDarkHero ? "hover:text-sun" : "hover:text-navy-soft hover:underline hover:decoration-[1.5px] hover:underline-offset-[6px]"].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Contact and language on the far right, opposite the logo */}
        <div className={["hidden items-center gap-2 lg:flex lg:justify-self-end", onDarkHero ? "text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]" : "text-navy"].join(" ")}>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              [
                "rounded-pill border-[1.5px] px-5 py-[7px] font-sans text-[16px] leading-[24px] transition xl:text-[17px]",
                onDarkHero ? "border-white/80 hover:border-sun hover:text-sun" : "border-navy hover:bg-navy hover:text-paper",
                isActive ? (onDarkHero ? "border-sun text-sun" : "bg-navy text-paper") : "",
              ].join(" ")
            }
          >
            {t.nav.contact}
          </NavLink>
          <LanguageSwitcher variant="toggle" tone={onDarkHero ? "light" : "dark"} />
        </div>

        <div className="mt-4 flex items-center gap-2 lg:hidden">
          <LanguageSwitcher variant="pill" />
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.nav.closeMenu : t.nav.openMenu} className="inline-flex h-12 w-12 items-center justify-center bg-navy text-white">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="mx-4 mt-2 bg-white shadow-float sm:mx-6 lg:hidden">
          {[...navLinks, { label: t.nav.contact, to: "/contact" }].map((link) => (
            <NavLink key={link.label} to={link.to} onClick={() => setOpen(false)} className="block border-b border-navy/10 px-5 py-4 font-sans text-[17px] text-navy last:border-0 hover:text-navy">
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
