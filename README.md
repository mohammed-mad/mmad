# The Third Place — Craft & Ceramic Workshops

Website and workshop-booking front end for The Third Place, a creative
workshop studio in Casablanca (Kintsugi, Cyanotype, Mosaic Art, ceramic
painting, hand-built pottery and open studio evenings).

Built with **React 18 + TypeScript + Tailwind CSS**, routed with React Router,
icons from Lucide. No UI component library.

This branch (`claude/sarena-redesign`) re-implements the site on the layout,
typography and colour system of sarenaskeuken.nl, adapted to The Third Place's
content, and adds live workshop booking through Cal.com.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build
```

## Languages

The site is bilingual (English / French). An EN | FR switcher sits in the top
navigation on desktop and next to the menu button on mobile. The choice is
remembered in `localStorage` and the browser language picks the default on the
first visit.

- UI copy lives in `src/i18n/translations.ts` as two typed dictionaries
  (`en` and `fr` must have the same keys, so a missing translation fails the
  typecheck).
- Content (workshops, FAQ, journal posts, reviews, gallery alt text) is
  authored with `{ en, fr }` fields in `src/data/*` and resolved for the active
  language by the hooks in `src/i18n/useLocalizedData.ts`.
- Dates shown on the booking pages follow the active language as well.

To add a language, extend the `Lang` type, add a dictionary to `translations`,
add the language to `languages`, and add the new key to every `{ en, fr }` field.

## Booking (Cal.com)

Workshop booking is a live [Cal.com](https://cal.com) calendar embedded on the
site — there is no checkout and no backend.

1. Copy `.env.example` to `.env.local` and set `VITE_CAL_USERNAME` to the
   Cal.com username (or team path) that owns the workshop event types.
2. `VITE_CAL_USERNAME` is read at build time, so it must also be set in
   whichever environment builds the site for hosting/deployment, not just
   locally.
3. In Cal.com, create one event type per workshop whose URL slug matches that
   workshop's `calEventSlug` in `src/data/workshops.ts`:

   | Workshop | `calEventSlug` |
   | --- | --- |
   | Kintsugi | `kintsugi-workshop` |
   | Cyanotype | `cyanotype-workshop` |
   | Mosaic Art | `mosaic-workshop` |
   | Ceramic painting | `ceramic-painting-workshop` |
   | Hand-built pottery | `pottery-workshop` |
   | Open studio | `open-studio` |

4. Set `active: false` on a workshop in `src/data/workshops.ts` to hide its
   booking CTA and take it out of the bookable flow.

Without a configured username, every booking page shows "Booking currently
unavailable" instead of the calendar.

Never put API keys or webhook secrets in `VITE_*` variables — only the public
Cal.com username is read from the environment (`src/config/booking.ts`).

The embed and its loading/error states live in
`src/components/booking/CalBooking.tsx`; the booking page is
`src/pages/Booking.tsx` (route `/book/:workshopSlug`) and the confirmation
page is `src/pages/BookingSuccess.tsx` (route `/booking/success`, reached via
router state after a successful booking). The old `/booking/:slug` path
redirects to `/book/:slug` for backward compatibility.

## Structure

```
src/
├── assets/          images, self-hosted fonts, logo
├── components/
│   ├── layout/      Navbar, Footer, Layout
│   ├── home/        Hero, UspStrip, WorkshopsSlider, StudioSection, Reviews, Journal
│   ├── booking/     CalBooking (Cal.com embed), BookingSummary, BookingSkeleton, BookingError
│   └── ui/          Button, Logo, ScriptTitle, SectionTitle, Carousel, WorkshopCard,
│                    ReviewsBlock, FaqList, ContactInfoCard, NewsletterForm, InfoStats, PageHero
├── config/          booking.ts (Cal.com username, brand colour)
├── data/            workshops, site, testimonials, journal, faq, gallery
├── lib/             Cal.com link building, WhatsApp contact link, analytics, formatting
├── pages/           Home, Workshops, WorkshopDetails, Booking, BookingSuccess, PrivateWorkshops,
│                    About, Gallery, Contact, Legal, NotFound
├── types/           Workshop, Testimonial, JournalPost, FaqItem
└── index.css        @font-face declarations, Tailwind layers, shared patterns
```

### Routes

| Path | Page |
| --- | --- |
| `/` | Homepage |
| `/workshops` | Craft and ceramic workshop carousels, upcoming dates, private workshops |
| `/workshops/:slug` | Workshop detail, with a booking CTA into `/book/:slug` |
| `/book/:workshopSlug` | Workshop summary next to the live Cal.com booking calendar |
| `/booking/success` | Booking confirmation, reached via router state after a booking |
| `/booking/:slug` | Redirects to `/book/:slug` (legacy link support) |
| `/private-workshops` | Private / group workshop request form |
| `/about`, `/gallery`, `/contact` | Secondary pages |

## Design system

Tokens are in `tailwind.config.ts`: beige page backgrounds, dark-green text,
tomato and orange accents, the condensed display face, the handwritten label
face and the geometric body face. The reference site uses the commercial fonts
Hesland Sans Rough and Ambit; this build ships the closest open fonts
(Oswald, Caveat, Manrope) self-hosted from `src/assets/fonts`. To use the
originals, licence them, drop the files into that folder and add them to the
`@font-face` rules at the top of `src/index.css`; the font stacks already list
them first.

## Imagery

Photos are derived from the original design reference for The Third Place and
adapted to the new layout. Several are upscaled from a small source, so swap
them for the studio's own photography in `src/assets/images` (same file names)
when available.
