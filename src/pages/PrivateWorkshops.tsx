import { type FormEvent, useState } from "react";
import { MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import FaqList from "@/components/ui/FaqList";
import { fieldClass, labelClass } from "@/components/ui/formStyles";
import PageHero from "@/components/ui/PageHero";
import { useT } from "@/i18n/LanguageContext";
import { useFaq } from "@/i18n/useLocalizedData";
import { buildWhatsAppContactUrl } from "@/lib/booking-links";
import { images } from "@/data/images";

const field = fieldClass;
const label = labelClass;
const required = <span className="text-navy" aria-hidden="true"> *</span>;
const today = new Date().toISOString().slice(0, 10);

export default function PrivateWorkshops() {
  const t = useT();
  const faq = useFaq();
  const p = t.privatePage;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", people: "", date: "", message: "" });
  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value });
  const whatsapp = buildWhatsAppContactUrl(p.whatsappMessage(form.people, form.date, form.message));

  return (
    <>
      <PageHero image={images.paintingCloseUp} imagePosition="object-[center_30%]" imageAlt={p.heroAlt} kicker={p.kicker} title={p.title} intro={<p>{p.intro}</p>}>
        <Button href="#private-form" variant="yellow" arrow className="mt-8">
          {p.cta}
        </Button>
      </PageHero>

      <section className="page-container py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-8 font-sans text-[16px] leading-[26px] text-navy-soft lg:grid-cols-2 lg:gap-12">
          <p>{p.p1}</p>
          <p>
            <strong className="text-navy">{p.p2Strong}</strong>
            {p.p2}
          </p>
        </div>
      </section>

      <section id="private-form" className="page-container scroll-mt-10 pb-20">
        <div className="relative mx-auto grid max-w-[1160px] grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-0">
          <ContactInfoCard className="relative z-10 lg:mt-12 lg:mr-[-40px] lg:self-start" />
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); setSent(true); }} className="bg-paper-dark px-5 py-8 sm:p-8 lg:p-14 lg:pl-[104px]">
            <h2 className="font-sans text-h2 text-navy">{p.formTitle}</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <label className={label}>{p.name}{required}<input required className={field} value={form.name} onChange={update("name")} autoComplete="name" /></label>
              <label className={label}>{p.email}{required}<input required type="email" className={field} value={form.email} onChange={update("email")} autoComplete="email" /></label>
              <label className={label}>{p.phone}<input type="tel" className={field} value={form.phone} onChange={update("phone")} autoComplete="tel" /></label>
              <label className={label}>{p.people}<input type="number" min={6} inputMode="numeric" className={field} value={form.people} onChange={update("people")} /></label>
              <label className={`${label} sm:col-span-2`}>{p.date}<input type="date" min={today} className={`${field} sm:max-w-[calc(50%-12px)]`} value={form.date} onChange={update("date")} /></label>
              <label className={`${label} sm:col-span-2`}>{p.message}<textarea rows={5} className={`${field} resize-y`} value={form.message} onChange={update("message")} placeholder={p.messagePlaceholder} /></label>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="submit">{t.common.send}</Button>
              <Button href={whatsapp} target="_blank" rel="noreferrer" variant="secondary">
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> {p.askWhatsapp}
              </Button>
            </div>
            {sent && (
              <p className="mt-5 rounded-[4px] border border-navy/15 bg-white px-4 py-3 font-sans text-[15px] text-navy" role="status">
                {t.common.formThanks}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Reviews stay hidden until there are real ones. */}

      <section className="bg-paper-dark py-16 lg:py-24">
        <div className="page-container">
          <div className="mx-auto max-w-[1160px]">
            <FaqList items={faq} />
          </div>
        </div>
      </section>
    </>
  );
}
