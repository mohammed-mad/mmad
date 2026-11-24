import type { Workshop, WorkshopSource } from "@/types/workshop";
import type { Lang } from "@/i18n/translations";
import { images } from "@/data/images";

const welcome = {
  en: "A warm welcome, and a drink depending on the café",
  fr: "Un accueil chaleureux, et une boisson selon le café",
};
const apron = { en: "An apron to borrow", fr: "Un tablier prêté" };

export const workshopSources: WorkshopSource[] = [
  {
    id: "ws-kintsugi",
    slug: "kintsugi",
    category: "Kintsugi",
    kicker: { en: "Mend with gold", fr: "Réparer avec l'or" },
    title: { en: "Kintsugi Workshop", fr: "Atelier Kintsugi" },
    shortTitle: { en: "Kintsugi", fr: "Kintsugi" },
    intro: {
      en: "In Japan, a cracked bowl isn’t hidden or thrown away. Its cracks are traced in gold, and the repair becomes the most beautiful part. Come and mend yours.",
      fr: "Au Japon, un bol fêlé ne se cache pas et ne se jette pas. Ses fissures sont tracées à l’or, et la réparation devient la plus belle partie. Venez réparer le vôtre.",
    },
    summary: {
      en: "Mend a broken piece of ceramic with gold, and keep it. We begin with the story, then you work at your own pace.",
      fr: "Réparez une céramique cassée avec de l’or, et gardez-la. Nous commençons par l’histoire, puis vous travaillez à votre rythme.",
    },
    description: {
      en: [
        "Kintsugi is the Japanese art of mending broken ceramics with gold, treating the crack as part of the object’s story. We begin with where it comes from, then you work on a piece of your own with lacquer or resin and gold. Mended pieces are decorative and not food safe.",
        "You’ll clean and fit the fragments, apply the adhesive, dust the seams with gold and polish the result. Bring a broken piece that matters to you, or choose one of ours.",
      ],
      fr: [
        "Le kintsugi est l’art japonais de réparer les céramiques brisées avec de l’or, en faisant de la fissure une partie de l’histoire de l’objet. Nous commençons par ses origines, puis vous travaillez sur votre propre pièce avec de la laque ou de la résine et de l’or. Les pièces réparées sont décoratives et ne conviennent pas au contact alimentaire.",
        "Vous nettoierez et assemblerez les fragments, appliquerez l’adhésif, saupoudrerez les jointures d’or et polirez le résultat. Apportez une pièce cassée qui compte pour vous, ou choisissez l’une des nôtres.",
      ],
    },
    whatYouWillDo: {
      en: ["Start with the story of kintsugi", "Fit the fragments back together", "Trace each crack in gold", "Take it home the same day"],
      fr: ["Commencer par l’histoire du kintsugi", "Rassembler les fragments", "Tracer chaque fissure à l’or", "Repartir avec votre pièce le jour même"],
    },
    includes: {
      en: [welcome.en, "All materials and gold", "A ceramic piece, if you don’t bring your own", apron.en, "A short care guide"],
      fr: [welcome.fr, "Tout le matériel et l’or", "Une pièce de céramique, si vous n’apportez pas la vôtre", apron.fr, "Un petit guide d’entretien"],
    },
    duration: { en: "approx. 2.5 hours", fr: "env. 2 h 30" },
    maxParticipants: 10,
    // The card (home page and booking summary) keeps its photo; the workshop page uses the new set.
    cardImage: images.kintsugiHands,
    heroImage: images.kintsugiGoldPlates,
    featureImage: images.kintsugiGloves,
    gallery: [images.kintsugiTeapot, images.kintsugiTable],
    calEventSlug: "kintsugi-workshop",
    active: true,
  },
  {
    id: "ws-cyanotype",
    slug: "cyanotype",
    category: "Cyanotype",
    kicker: { en: "Print with sun", fr: "Imprimer au soleil" },
    title: { en: "Cyanotype Workshop", fr: "Atelier Cyanotype" },
    shortTitle: { en: "Cyanotype", fr: "Cyanotype" },
    intro: {
      en: "A photograph made without a camera: leaves, lace and light on blue paper. Every print develops a little differently, which is exactly why you’ll want to keep yours.",
      fr: "Une photographie faite sans appareil : des feuilles, de la dentelle et de la lumière sur papier bleu. Chaque tirage se révèle un peu différemment, et c’est justement pour cela que vous voudrez garder le vôtre.",
    },
    summary: {
      en: "Leaves, lace and sunlight on blue paper. You compose, the sun prints, and you take your prints home.",
      fr: "Des feuilles, de la dentelle et du soleil sur papier bleu. Vous composez, le soleil imprime, et vous repartez avec vos tirages.",
    },
    description: {
      en: [
        "Cyanotype is one of the earliest photographic processes: light-sensitive paper, a few objects, the sun, then water. The image appears in deep blue and white.",
        "You’ll arrange your composition, expose it to the sun (or a UV lamp on cloudy days), rinse it and watch it reveal itself. Edges drift and blues vary. That’s the charm.",
      ],
      fr: [
        "Le cyanotype est l’un des tout premiers procédés photographiques : un papier sensible à la lumière, quelques objets, le soleil, puis l’eau. L’image apparaît en bleu profond et blanc.",
        "Vous composerez votre image, l’exposerez au soleil (ou à une lampe UV les jours nuageux), la rincerez et la regarderez se révéler. Les contours bougent, les bleus varient. C’est tout son charme.",
      ],
    },
    whatYouWillDo: {
      en: ["Arrange leaves, lace and small objects", "Let the sun do the drawing", "Rinse, and watch the blue appear", "Take your prints home"],
      fr: ["Disposer feuilles, dentelle et petits objets", "Laisser le soleil dessiner", "Rincer, et voir le bleu apparaître", "Repartir avec vos tirages"],
    },
    includes: {
      en: [welcome.en, "Paper or fabric, and all materials", apron.en, "Tips for drying and framing"],
      fr: [welcome.fr, "Papier ou tissu, et tout le matériel", apron.fr, "Des conseils pour le séchage et l’encadrement"],
    },
    duration: { en: "approx. 2 hours", fr: "env. 2 heures" },
    maxParticipants: 10,
    // The card (home page and booking summary) keeps its photo; the workshop page uses the new set.
    cardImage: images.cyanotypeHands,
    heroImage: images.cyanotypeRinsing,
    featureImage: images.cyanotypeCoating,
    gallery: [images.cyanotypeArtist, images.cyanotypeBotanical],
    calEventSlug: "cyanotype-workshop",
    active: true,
  },
  {
    id: "ws-mosaic",
    slug: "mosaic-art",
    category: "Mosaic Art",
    kicker: { en: "Build from pieces", fr: "Construire avec des morceaux" },
    title: { en: "Mosaic Art Workshop", fr: "Atelier Mosaïque" },
    shortTitle: { en: "Mosaic Art", fr: "Mosaïque" },
    intro: {
      en: "A mosaic is made of pieces that were never meant to match. Choose yours, arrange them, and let the uneven gaps make it yours.",
      fr: "Une mosaïque est faite de morceaux qui n’étaient pas destinés à aller ensemble. Choisissez les vôtres, disposez-les, et laissez les joints irréguliers la rendre unique.",
    },
    summary: {
      en: "Choose ceramic fragments, sketch a pattern and place each piece. You leave with a small mosaic of your own.",
      fr: "Choisissez des fragments de céramique, esquissez un motif et posez chaque pièce. Vous repartez avec votre petite mosaïque.",
    },
    description: {
      en: [
        "Mosaic is one of the oldest ways of turning fragments into a picture. We start with the basics, then you design a small piece of your own.",
        "You’ll choose ceramic fragments, sketch a pattern, place each piece, then grout and finish. Bring an idea, or let the pieces suggest one.",
      ],
      fr: [
        "La mosaïque est l’une des plus anciennes façons de transformer des fragments en image. Nous commençons par les bases, puis vous dessinez votre propre petite pièce.",
        "Vous choisirez des fragments de céramique, esquisserez un motif, poserez chaque pièce, puis ferez les joints et la finition. Venez avec une idée, ou laissez les morceaux vous en souffler une.",
      ],
    },
    whatYouWillDo: {
      en: ["Choose fragments in colours that speak to you", "Sketch and test your pattern", "Place each piece, one by one", "Grout, finish and take it home"],
      fr: ["Choisir des fragments aux couleurs qui vous parlent", "Esquisser et tester votre motif", "Poser chaque pièce, une à une", "Faire les joints, finir et l’emporter"],
    },
    includes: {
      en: [welcome.en, "All materials and tools", apron.en, "Tips for looking after your piece"],
      fr: [welcome.fr, "Tout le matériel et les outils", apron.fr, "Des conseils pour entretenir votre pièce"],
    },
    duration: { en: "approx. 2.5 hours", fr: "env. 2 h 30" },
    maxParticipants: 10,
    // The card (home page and booking summary) keeps its photo; the workshop page uses the new set.
    cardImage: images.mosaicTiles,
    heroImage: images.mosaicTilesNippers,
    featureImage: images.mosaicPaper,
    gallery: [images.mosaicBaskets],
    calEventSlug: "mosaic-workshop",
    active: true,
  },
];

/** Resolve a workshop's text fields for one language. */
export const localizeWorkshop = (source: WorkshopSource, lang: Lang): Workshop => ({
  ...source,
  title: source.title[lang],
  shortTitle: source.shortTitle[lang],
  kicker: source.kicker[lang],
  intro: source.intro[lang],
  summary: source.summary[lang],
  duration: source.duration[lang],
  description: source.description[lang],
  whatYouWillDo: source.whatYouWillDo[lang],
  includes: source.includes[lang],
});

export const getWorkshops = (lang: Lang): Workshop[] => workshopSources.map((source) => localizeWorkshop(source, lang));

export const getWorkshopBySlug = (slug: string, lang: Lang): Workshop | undefined => {
  const source = workshopSources.find((w) => w.slug === slug);
  return source ? localizeWorkshop(source, lang) : undefined;
};
