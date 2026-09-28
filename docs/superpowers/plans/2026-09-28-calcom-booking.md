# Cal.com Booking Integration — Implementation Plan

Spec: the "Cal.com Booking Integration Plan" document supplied by the project owner (sections 1–28).
This plan adapts that spec to the existing codebase.

## Context

- Vite 5 + React 18 + TypeScript + Tailwind 3. Router: `react-router-dom` v6 (`src/App.tsx`).
- Path alias `@` → `src`.
- Bilingual site (EN/FR). Every user-facing string lives in `src/i18n/translations.ts`
  (`en` object defines the `Translation` type, `fr` must mirror it). Components read strings with
  `useT()` / `useLanguage()` from `@/i18n/LanguageContext`.
- Workshop data: `src/data/workshops.ts` (`workshopSources`, localized through `localizeWorkshop`),
  types in `src/types/workshop.ts`, hooks in `src/i18n/useLocalizedData.ts` (`useWorkshop(slug)`, `useWorkshops()`).
- Workshop slugs: `kintsugi`, `cyanotype`, `mosaic-art`, `ceramic-painting`, `hand-built-pottery`, `open-studio`.
- Existing booking is a WhatsApp hand-off (`src/components/booking/BookingPanel.tsx`) driven by
  hardcoded `sessions` in the workshop data. It is replaced by Cal.com in this plan.
- Shared UI to reuse: `Button` (`to` / `href` / button variants), `ScriptTitle`, `SectionTitle`,
  `ContactInfoCard`, `PageHero`. Layout class `page-container`. Pages without a hero use
  `pb-20 pt-[200px]` on their root section (see `src/pages/NotFound.tsx`).
- Design tokens (Tailwind): colors `beige`, `beige-dark`, `green`, `green-olive`, `tomato`, `orange`, `ink`;
  fonts `font-sans`, `font-script`, class `display`; shadows `shadow-card`, `shadow-float`;
  radius `rounded-pill`. Brand colour for Cal: tomato `#F25742`.
- No backend, no analytics provider, no test runner, no ESLint config. Do not add any of them.

## Global Constraints

1. Do not redesign unrelated parts of the site. Reuse existing components, tokens and class patterns.
2. Strict TypeScript. No `any`. No `@ts-ignore`.
3. Never hardcode the Cal.com username or a Cal.com URL inside a component. The username comes only from
   `bookingConfig` in `src/config/booking.ts`; the link is built only by `buildCalLink` in `src/lib/cal.ts`.
4. Never render fake calendars, time slots, seat counts or confirmations. Availability comes only from the Cal.com embed.
5. No secrets in frontend code. Only `VITE_CAL_USERNAME` (a public username) is read from the environment.
6. Every new user-facing string is added to BOTH `en` and `fr` in `src/i18n/translations.ts`. No literal UI text in components.
7. Use the official `@calcom/embed-react` component. Do not hand-write an `<iframe>`.
8. No new dependencies other than `@calcom/embed-react`.
9. Verification command for every task: `npm run build` (runs `tsc -b && vite build`). It must pass.
10. Git: stage only the files you changed, by explicit path. NEVER use `git add -A`, `git add .` or `git commit -a`:
    the working tree contains the owner's uncommitted image edits under `src/assets/images/` and a deleted
    `hero_check.jpg` that must stay uncommitted. Do not stage `tsconfig.app.tsbuildinfo` or `tsconfig.node.tsbuildinfo`.
11. End every commit message with the line: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`

---

## Task 1: Booking foundation (dependency, config, data mapping, helpers)

**Files**
- Modify: `package.json`, `package-lock.json` (via `npm install @calcom/embed-react`)
- Create: `src/config/booking.ts`
- Create: `src/lib/cal.ts`
- Create: `src/lib/analytics.ts`
- Create: `.env.example`
- Modify: `src/vite-env.d.ts`
- Modify: `src/types/workshop.ts`
- Modify: `src/data/workshops.ts`

**Requirements**

1. Install `@calcom/embed-react` as a regular dependency.

2. `src/vite-env.d.ts`: keep the existing reference line and add typing so
   `import.meta.env.VITE_CAL_USERNAME` is `string | undefined`:

   ```ts
   interface ImportMetaEnv {
     readonly VITE_CAL_USERNAME?: string;
   }

   interface ImportMeta {
     readonly env: ImportMetaEnv;
   }
   ```

3. `.env.example` containing exactly:

   ```env
   # Public Cal.com username (or team path) that owns the workshop event types.
   # Never put API keys or webhook secrets in VITE_* variables.
   VITE_CAL_USERNAME=your-cal-username
   ```

   Confirm `.env` files are git-ignored for local values: `.gitignore` already ignores `*.local`,
   so document in the file comment that local values go in `.env.local`. Do not create `.env.local`.

4. `src/config/booking.ts`:

   ```ts
   const calUsername = (import.meta.env.VITE_CAL_USERNAME ?? "").trim();

   /** Central booking configuration. The only place the Cal.com account is read. */
   export const bookingConfig = {
     calUsername,
     /** False when no Cal.com account is configured; booking must not be offered. */
     isConfigured: calUsername.length > 0,
     /** Accent colour handed to the Cal.com embed (Tailwind `tomato`). */
     brandColor: "#F25742",
   } as const;
   ```

5. `src/lib/cal.ts`:

   ```ts
   import { bookingConfig } from "@/config/booking";

   /** Cal.com booking link (`username/event-slug`) or null when booking is not configured. */
   export const buildCalLink = (eventSlug: string): string | null =>
     bookingConfig.isConfigured && eventSlug ? `${bookingConfig.calUsername}/${eventSlug}` : null;

   const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

   /** UTM parameters present in a query string, to forward to Cal.com. */
   export const pickUtmParams = (search: string): Record<string, string> => {
     const params = new URLSearchParams(search);
     const result: Record<string, string> = {};
     for (const key of UTM_KEYS) {
       const value = params.get(key);
       if (value) result[key] = value;
     }
     return result;
   };
   ```

6. `src/lib/analytics.ts`: a thin, provider-free tracker. It pushes to `window.dataLayer` when that array
   exists and is otherwise a no-op. It must never throw.

   ```ts
   export type AnalyticsEvent = "workshop_viewed" | "booking_started" | "booking_completed";

   export interface WorkshopEventProps {
     workshopId: string;
     workshopSlug: string;
     workshopName: string;
   }

   declare global {
     interface Window {
       dataLayer?: Record<string, unknown>[];
     }
   }

   /** Report an event to the page's data layer, if one is installed. */
   export const track = (event: AnalyticsEvent, props: WorkshopEventProps): void => {
     try {
       window.dataLayer?.push({ event, ...props });
     } catch {
       // Analytics must never break the page.
     }
   };
   ```

7. `src/types/workshop.ts`: add two fields to the `Workshop` interface, after `gallery`:

   ```ts
   /** Slug of the matching Cal.com event type, e.g. "kintsugi-workshop" */
   calEventSlug: string;
   /** False hides booking for this workshop */
   active: boolean;
   ```

   Do not change or remove anything else in this file in this task (sessions are removed in Task 4).

8. `src/data/workshops.ts`: add to every workshop source `active: true` and `calEventSlug`:

   | slug | calEventSlug |
   |---|---|
   | `kintsugi` | `kintsugi-workshop` |
   | `cyanotype` | `cyanotype-workshop` |
   | `mosaic-art` | `mosaic-workshop` |
   | `ceramic-painting` | `ceramic-painting-workshop` |
   | `hand-built-pottery` | `pottery-workshop` |
   | `open-studio` | `open-studio` |

**Verification**: `npm run build` passes.

**Commit**: `Add Cal.com booking configuration and workshop event mapping`

---

## Task 2: Booking components and strings

Depends on Task 1 (`bookingConfig`, `buildCalLink`, `pickUtmParams`, `Workshop.calEventSlug`).

**Files**
- Create: `src/components/booking/CalBooking.tsx`
- Create: `src/components/booking/BookingSkeleton.tsx`
- Create: `src/components/booking/BookingError.tsx`
- Create: `src/components/booking/BookingSummary.tsx`
- Modify: `src/i18n/translations.ts`

Do not touch `src/components/booking/BookingPanel.tsx` in this task.

**Strings**: add to the existing `booking` block of BOTH languages (keep all existing keys):

| key | en | fr |
|---|---|---|
| `heading` | `Book your workshop` | `Réservez votre atelier` |
| `chooseDateTime` | `Choose your date & time` | `Choisissez votre date et votre heure` |
| `loading` | `Loading the booking calendar…` | `Chargement du calendrier de réservation…` |
| `errorTitle` | `We couldn't load the booking calendar.` | `Impossible de charger le calendrier de réservation.` |
| `retry` | `Try again` | `Réessayer` |
| `unavailableTitle` | `Booking currently unavailable` | `Réservation momentanément indisponible` |
| `unavailableText` | `Online booking for this workshop is not open right now. Send us a message and we'll help you find a date.` | `La réservation en ligne de cet atelier n'est pas ouverte pour le moment. Écrivez-nous et nous vous aiderons à trouver une date.` |
| `contactUs` | `Contact us` | `Contactez-nous` |
| `notFoundTitle` | `Workshop not found.` | `Atelier introuvable.` |
| `backToWorkshops` | `Back to workshops` | `Retour aux ateliers` |
| `summaryDuration` | `Duration` | `Durée` |
| `summaryPrice` | `Price` | `Prix` |
| `summaryLocation` | `Location` | `Lieu` |
| `successTitle` | `Booking confirmed` | `Réservation confirmée` |
| `successEmail` | `Confirmation has been sent to your email.` | `Une confirmation a été envoyée à votre adresse e-mail.` |
| `successGeneric` | `Thank you! Check your inbox for your booking details.` | `Merci ! Consultez votre boîte mail pour les détails de votre réservation.` |
| `bookCta` | `Book this workshop` | `Réserver cet atelier` |
| `seeDates` | `See dates` | `Voir les dates` |

**`CalBooking.tsx`**

```tsx
export interface BookingResult {
  /** Event title reported by Cal.com */
  title?: string;
  /** ISO start time reported by Cal.com */
  startTime?: string;
  /** ISO end time reported by Cal.com */
  endTime?: string;
  /** Cal.com booking uid */
  uid?: string;
}

interface CalBookingProps {
  eventSlug: string;
  workshopName?: string;
  customerName?: string;
  customerEmail?: string;
  onBookingSuccess?: (result: BookingResult) => void;
}
```

Behaviour:

- Default export `CalBooking`. Builds the link with `buildCalLink(eventSlug)`. If it returns `null`, render nothing (`return null`);
  the page decides what to show when booking is unavailable.
- Renders the official `Cal` component from `@calcom/embed-react` with `calLink`, a `namespace` equal to `eventSlug`,
  and `config` containing: `layout: "month_view"`, `theme: "light"`, the UTM params from
  `pickUtmParams(window.location.search)`, and `name` / `email` only when `customerName` / `customerEmail` are provided.
- Uses `getCalApi({ namespace })` in an effect to:
  - call `cal("ui", { theme: "light", hideEventTypeDetails: true, layout: "month_view", cssVarsPerTheme: { light: { "cal-brand": bookingConfig.brandColor }, dark: { "cal-brand": bookingConfig.brandColor } } })`
    (check the installed type definitions in `node_modules/@calcom/embed-core` and pass exactly what they accept);
  - subscribe with `cal("on", …)` to `linkReady` (→ status `ready`), `linkFailed` (→ status `error`) and
    `bookingSuccessfulV2` (→ call `onBookingSuccess` with the fields read from the event's `detail.data`);
  - unsubscribe with `cal("off", …)` in the effect cleanup.
  Event names and payload shapes must be taken from the installed package's types, not guessed. Narrow unknown values
  with type guards; no `any`.
- Status state: `"loading" | "ready" | "error"`. Starts at `loading`.
  - If `getCalApi` rejects → `error`.
  - If the embed has not reported `linkReady` within 15 seconds → `error`.
  - While `loading`, render `<BookingSkeleton />` above/over the embed container; the `Cal` element stays mounted
    (it must be mounted to load) but visually hidden until ready, without leaving an empty white area.
  - On `error`, render `<BookingError onRetry={…} />` instead. Retry resets status to `loading` and remounts the
    embed (change a `key`).
- Container: `w-full min-w-0 overflow-hidden bg-white shadow-float`. The `Cal` element gets
  `style={{ width: "100%", height: "100%", overflow: "auto" }}`. No fixed pixel widths. No horizontal scrolling at 320px.
- `workshopName` is used for the accessible label of the region: `aria-label` = `` `${t.booking.chooseDateTime} – ${workshopName}` `` when provided.

**`BookingSkeleton.tsx`**: default export, no props. A white `shadow-float` block with pulsing (`animate-pulse`)
`bg-beige-dark` bars suggesting a month header, a 7-column day grid and a row of time slots. `role="status"`,
`aria-live="polite"`, with `t.booking.loading` in a `sr-only` span. Minimum height about 420px so layout does not jump.

**`BookingError.tsx`**: default export, props `{ onRetry: () => void }`. White `shadow-float` block, `role="alert"`,
shows `t.booking.errorTitle` and a `Button` (`variant="primary"`, `onClick={onRetry}`) labelled `t.booking.retry`.

**`BookingSummary.tsx`**: default export, props `{ workshop: Workshop }`. Compact card (`bg-white shadow-card`):
- image `workshop.cardImage` with `alt=""`, `loading="lazy"`, cropped with `object-cover`
  (`aspect-[4/3]` on `lg`, a shorter `aspect-[16/9]` below `lg` so it does not dominate mobile);
- `workshop.kicker` via `ScriptTitle` (`as="p"`, `dashes={false}`), `workshop.title` as an `h2` (`font-sans text-h3 text-green`);
- a `dl` with three rows using labels `t.booking.summaryDuration` / `summaryPrice` / `summaryLocation` and values
  `workshop.duration`, `` `${formatPrice(workshop.price)} ${t.common.perPerson}` ``, and `site.name` + `site.addressLines.join(", ")`
  (from `@/data/site`). Label style: `font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-tomato`.
- Does NOT show the workshop description, intro, includes or any dates.

**Verification**: `npm run build` passes. The components are not yet routed; that is Task 3.

**Commit**: `Add Cal.com booking components`

---

## Task 3: Booking page, success page and routes

Depends on Task 1 and Task 2.

**Files**
- Modify (rewrite): `src/pages/Booking.tsx`
- Create: `src/pages/BookingSuccess.tsx`
- Modify: `src/App.tsx`

**Routes** (`src/App.tsx`, inside the existing `<Route element={<Layout />}>`):

```tsx
<Route path="/book/:workshopSlug" element={<Booking />} />
<Route path="/booking/success" element={<BookingSuccess />} />
<Route path="/booking/:slug" element={<LegacyBookingRedirect />} />
```

`LegacyBookingRedirect` is a small component (defined in `src/App.tsx`) that reads `slug` with `useParams` and
returns `<Navigate to={`/book/${slug}`} replace />`. It replaces the current `/booking/:slug` route so old links keep working.

**`src/pages/Booking.tsx`** (default export `Booking`)

- `const { workshopSlug = "" } = useParams();` then `useWorkshop(workshopSlug)`.
- Unknown workshop: do NOT redirect and do NOT load another workshop. Render a section (`page-container pb-20 pt-[200px]`)
  with an `h1` (`display text-[44px] leading-[1] text-green lg:text-[56px]`) showing `t.booking.notFoundTitle`
  and a `Button to="/workshops" arrow` labelled `t.booking.backToWorkshops`.
- Known workshop. Layout, keeping the existing page header pattern:
  - back link to `/workshops/${workshop.slug}` using the existing markup and `t.booking.backTo(workshop.title)`;
  - centered `ScriptTitle` with `workshop.kicker` and `h1` with `t.booking.heading`;
  - grid `mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:gap-12`, children must have `min-w-0`:
    - left: `<BookingSummary workshop={workshop} />` (`lg:self-start`);
    - right: an `h2` (`font-sans text-h3 text-green`) with `t.booking.chooseDateTime`, then the booking area.
  - Booking area:
    - if `!workshop.active` OR `!bookingConfig.isConfigured`: a white `shadow-float` block with
      `t.booking.unavailableTitle`, `t.booking.unavailableText` and a `Button to="/contact" variant="secondary"` labelled `t.booking.contactUs`.
      The Cal embed must not be mounted.
    - otherwise `<CalBooking eventSlug={workshop.calEventSlug} workshopName={workshop.title} onBookingSuccess={…} />`.
- Analytics: when the embed is shown for a known, bookable workshop, call
  `track("booking_started", { workshopId, workshopSlug, workshopName })` once per workshop (effect keyed on `workshop.id`).
- On booking success: `track("booking_completed", …)` then
  `navigate("/booking/success", { state })` where `state` is a `BookingSuccessState`:

  ```ts
  export interface BookingSuccessState {
    workshopSlug: string;
    workshopTitle: string;
    startTime?: string;
    endTime?: string;
    uid?: string;
  }
  ```

  Export this interface from `src/pages/BookingSuccess.tsx` and import it in `Booking.tsx`.
- Remove the old `BookingPanel` and `ContactInfoCard` usage and the `useSearchParams` session/participants parsing from this page.

**`src/pages/BookingSuccess.tsx`** (default export `BookingSuccess`)

- Reads `useLocation().state` and validates it with a type guard (`unknown` → `BookingSuccessState | null`).
- Root section `page-container pb-20 pt-[200px] text-center`.
- Always shows: `h1` with `t.booking.successTitle`, and `Button to="/workshops" arrow` labelled `t.booking.backToWorkshops`.
- With valid state: shows `workshopTitle`; if `startTime` parses as a valid date, shows the date
  (weekday, day, month) and the time range `HH:mm – HH:mm` (end only if `endTime` is valid), formatted with
  `toLocaleDateString` / `toLocaleTimeString` using `locale` from `useLanguage()`; the location
  (`site.name`, `site.addressLines.join(", ")`); and `t.booking.successEmail`.
- Without valid state (direct visit or reload): shows only `t.booking.successGeneric`. It must never invent
  a workshop, date or time.
- No "Manage booking" link: the embed event does not provide a trustworthy management URL; customers manage
  bookings from the confirmation email.

**Verification**: `npm run build` passes. Start `npm run dev` and confirm with `curl` that `/book/kintsugi`,
`/book/does-not-exist` and `/booking/success` return HTTP 200 (SPA shell).

**Commit**: `Add Cal.com booking page, success page and routes`

---

## Task 4: Connect CTAs and remove hardcoded availability

Depends on Tasks 1–3.

**Files**
- Modify: `src/pages/WorkshopDetails.tsx`
- Modify: `src/pages/Workshops.tsx`
- Modify: `src/types/workshop.ts`
- Modify: `src/data/workshops.ts`
- Modify: `src/i18n/useLocalizedData.ts`
- Modify: `src/lib/booking-links.ts`
- Modify: `src/i18n/translations.ts`
- Delete: `src/components/booking/BookingPanel.tsx`
- Delete: `src/lib/booking.ts`

**Requirements**

1. `src/pages/WorkshopDetails.tsx`
   - The hero button (currently `href="#booking"`) becomes `<Button to={`/book/${workshop.slug}`} arrow>` with the same label `d.reserve`.
   - In the green `#booking` section keep the left column (`dl` with price, duration, max people, included) exactly as is.
     Replace the right column's `BookingPanel` with a white card (`bg-white p-6 shadow-float lg:p-9`) containing:
     an `h2 id="booking-heading"` (`font-sans text-h3 text-green`, no longer `sr-only`) with `t.booking.title`;
     a line with `formatPrice(workshop.price)` + `t.common.perPerson`; and
     - when `workshop.active`: `<Button to={`/book/${workshop.slug}`} arrow fullWidth>` labelled `t.booking.bookCta`;
     - when not active: the text `t.booking.unavailableTitle` and no booking button.
   - Remove the paragraph using `d.fullNote`, the `useSearchParams` import/usage, and the `BookingPanel` import.
   - Add `track("workshop_viewed", { workshopId, workshopSlug, workshopName })` in an effect keyed on the workshop id.
     Hooks must be called before the early `return <Navigate …>`; restructure so hook order is valid.

2. `src/pages/Workshops.tsx`, section `#upcoming`: it currently lists hardcoded sessions with seat counts.
   Keep the section, its `SectionTitle`, the `ul`/`li` borders and the row link styling, but render one row per
   ACTIVE workshop (from `useWorkshops()`), linking to `/book/${workshop.slug}`:
   first column `workshop.shortTitle` (bold green), second column `workshop.duration` in `text-green-olive` followed by a pill
   (`rounded-pill bg-orange px-[8px] py-[1px] font-sans text-[10px] font-bold uppercase text-ink`) with `t.booking.seeDates`.
   No dates, times or seat counts. Remove `useUpcomingSessions` and any now-unused imports (`formatShortDate`, `locale`…).

3. Remove hardcoded availability from the data layer:
   - `src/types/workshop.ts`: delete `WorkshopSession`, `BookingStatus`, `Booking`, `BookingCustomer`, and the `sessions` field of `Workshop`.
   - `src/data/workshops.ts`: delete the `session(...)` helper, every `sessions: [...]` entry, `UpcomingSession` and `getUpcomingSessions`.
   - `src/i18n/useLocalizedData.ts`: delete `useUpcomingSessions` and its import.
   - `src/lib/booking-links.ts`: keep ONLY `buildWhatsAppContactUrl` (used by `ContactInfoCard` and `PrivateWorkshops`)
     and the imports it needs. Delete `BookingRequest`, `buildWhatsAppMessage`, `buildWhatsAppUrl`, `buildGoogleCalendarUrl`,
     `buildIcsContent`, `downloadIcs` and helpers.
   - Delete `src/components/booking/BookingPanel.tsx` and `src/lib/booking.ts` (use `git rm`).

4. `src/i18n/translations.ts`: remove strings that are no longer referenced anywhere in `src` after the changes above,
   in BOTH languages. Candidates: in `booking` — `chooseDate`, `noDates`, `howMany`, `removeParticipant`, `addParticipant`,
   `total`, `selectDate`, `yourName`, `namePlaceholder`, `whatsapp`, `whatsappNote`, `googleCalendar`, `ics`, `pageTitle`;
   in `common` — `full`, `left`, `spots`, `spotsLeft`; in `detail` — `fullNote`; in `messages` — `whatsappBooking`, `calendarDetails`.
   For each candidate, `grep` for its usage first and remove it only if unused. Keep `booking.title` and `booking.backTo`.

5. After the change, this command must print nothing:
   `grep -rn "\.sessions\|sessions:\|spotsLeft\|BookingPanel\|cal\.com\|useUpcomingSessions" src`
   (the Cal.com origin lives inside the embed package, not in `src`; the word "sessions" in marketing copy is fine).

**Verification**: `npm run build` passes and the grep in requirement 5 prints nothing.

**Commit**: `Route booking CTAs to Cal.com and remove hardcoded sessions`
