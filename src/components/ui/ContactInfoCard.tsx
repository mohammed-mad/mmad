import { site } from "@/data/site";
import { buildWhatsAppContactUrl } from "@/lib/booking-links";
import { useT } from "@/i18n/LanguageContext";

const Label = ({ children }: { children: React.ReactNode }) => <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy">{children}</p>;
const Value = ({ children }: { children: React.ReactNode }) => <div className="mt-1 font-sans text-[15px] leading-[24px] text-navy">{children}</div>;

/** White floating card with phone, WhatsApp, where we are and email. */
export default function ContactInfoCard({ className = "" }: { className?: string }) {
  const t = useT();
  const c = t.contactPage.card;
  return (
    <aside className={["rounded-[4px] bg-white p-6 shadow-float", className].join(" ")} aria-label={c.aria}>
      <Label>{c.phone}</Label>
      <Value>
        <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="hover:text-navy">
          {site.phoneDisplay}
        </a>
      </Value>
      <div className="mt-5">
        <Label>{c.whatsapp}</Label>
        <Value>
          <a href={buildWhatsAppContactUrl(t.contactPage.whatsappGeneral)} target="_blank" rel="noreferrer" className="hover:text-navy">
            {c.whatsappLink}
          </a>
        </Value>
      </div>
      <div className="mt-5">
        <Label>{c.basedIn}</Label>
        <Value>{c.basedInValue}</Value>
      </div>
      <div className="mt-5">
        <Label>{c.email}</Label>
        <Value>
          <a href={`mailto:${site.email}`} className="hover:text-navy">
            {site.email}
          </a>
        </Value>
      </div>
    </aside>
  );
}
