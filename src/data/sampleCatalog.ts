import type { Product } from "./types";

const apexProducts: Product[] = [
  {
    id: "apex-stride-runner",
    title: "Everyday Mesh Sneaker",
    description: "Find your everyday stride. A textured mesh upper, padded collar and sculpted sole give this lace-up runner an easy, athletic feel. Finished in charcoal with an off-white sole for a clean look from morning walks to weekend plans.",
    imageColor: "#2A2A2A",
    imageKey: "stride-runner",
    variants: [
      { id: "apex-stride-8", name: "Size 8", priceMinor: 12800, available: true },
      { id: "apex-stride-9", name: "Size 9", priceMinor: 12800, available: true },
      { id: "apex-stride-10", name: "Size 10", priceMinor: 12800, available: true },
      { id: "apex-stride-11", name: "Size 11", priceMinor: 12800, available: false },
    ],
  },
  {
    id: "apex-flex-hoodie",
    title: "Essential Pullover Hoodie",
    description: "Your go-to layer before and after training. This charcoal pullover pairs a relaxed shape with an adjustable drawstring hood and a roomy kangaroo pocket. Ribbed cuffs and hem finish the look and make it easy to layer over your favorite tee.",
    imageColor: "#3C3832",
    imageKey: "flex-hoodie",
    variants: [
      { id: "apex-flex-s", name: "Small", priceMinor: 7400, available: true },
      { id: "apex-flex-m", name: "Medium", priceMinor: 7400, available: true },
      { id: "apex-flex-l", name: "Large", priceMinor: 7800, available: true },
      { id: "apex-flex-xl", name: "X-Large", priceMinor: 7800, available: false },
    ],
  },
  {
    id: "apex-court-short",
    title: "Weekend Drawstring Shorts",
    description: "Keep your kit simple with these forest-green athletic shorts. An elastic waistband and adjustable drawcord let you dial in the fit, while side pockets keep small essentials close. The clean, easy shape works for court sessions and off-duty days alike.",
    imageColor: "#1E2B26",
    imageKey: "court-short",
    variants: [
      { id: "apex-court-s", name: "Small", priceMinor: 4200, available: true },
      { id: "apex-court-m", name: "Medium", priceMinor: 4200, available: true },
      { id: "apex-court-l", name: "Large", priceMinor: 4600, available: true },
    ],
  },
  {
    id: "apex-training-tee",
    title: "Classic Crew Tee",
    description: "An everyday training essential with a clean crew neckline and short sleeves. The unfussy silhouette pairs effortlessly with shorts or joggers, and sits comfortably under a hoodie when you head out. Shown in Black.",
    imageColor: "#4A4038",
    imageKey: "training-tee",
    variants: [
      { id: "apex-tee-black", name: "Black", priceMinor: 2800, available: true },
      { id: "apex-tee-bone", name: "Bone", priceMinor: 2800, available: true },
      { id: "apex-tee-olive", name: "Olive", priceMinor: 3000, available: false },
    ],
  },
];

const outerwearProducts: Product[] = [
  {
    id: "nl-ridge-parka",
    title: "Alpine Hooded Parka",
    description: "Make room for colder days. The Alpine Hooded Parka combines a long silhouette with a generous hood, front zip fastening and roomy flap pockets. Its deep teal finish brings a quiet touch of color to an everyday outer layer, with space underneath for your favorite knit.",
    imageColor: "#1F3A40",
    imageKey: "ridge-parka",
    variants: [
      { id: "nl-parka-s", name: "Small", priceMinor: 16800, available: true },
      { id: "nl-parka-m", name: "Medium", priceMinor: 16800, available: true },
      { id: "nl-parka-l", name: "Large", priceMinor: 17800, available: false },
    ],
  },
  {
    id: "nl-base-crew",
    title: "Oatmeal Knit Sweater",
    description: "A simple knit you'll reach for throughout the season. This oatmeal crew features a softly textured finish and ribbing at the neckline, cuffs and hem. Wear it on its own with denim or layer it beneath a jacket for an easy cold-weather outfit.",
    imageColor: "#C4B8A5",
    imageKey: "base-crew",
    variants: [
      { id: "nl-crew-s", name: "Small", priceMinor: 6800, available: true },
      { id: "nl-crew-m", name: "Medium", priceMinor: 6800, available: true },
      { id: "nl-crew-l", name: "Large", priceMinor: 6800, available: true },
    ],
  },
  {
    id: "nl-trail-beanie",
    title: "Ribbed Cuff Beanie",
    description: "Finish your cold-weather kit with a little color. This rust-red beanie has a textured rib knit and a wide fold-over cuff for an easy, close-fitting shape. A simple companion for early starts, weekend walks and everyday commutes.",
    imageColor: "#8C3A2F",
    imageKey: "trail-beanie",
    variants: [{ id: "nl-beanie-os", name: "One size", priceMinor: 2400, available: true }],
  },
  {
    id: "nl-wool-sock",
    title: "Cozy Knit Socks",
    description: "Bring a cozy finish to your everyday layers. These oatmeal crew socks feature a textured knit, ribbed cuffs and contrasting heels and toes. Their classic length pairs neatly with boots or sneakers. Includes one pair.",
    imageColor: "#D7C4A3",
    imageKey: "wool-sock",
    variants: [
      { id: "nl-sock-m", name: "Medium", priceMinor: 1800, available: true },
      { id: "nl-sock-l", name: "Large", priceMinor: 1800, available: true },
      { id: "nl-sock-xl", name: "X-Large", priceMinor: 2100, available: false },
    ],
  },
];

const homeProducts: Product[] = [
  {
    "id": "home-dome-lamp",
    "title": "Mori Dome Table Lamp",
    "description": "A quiet focal point for your desk or bedside. A forest-green dome shade sits above a slender stem and round base, bringing a sculptural touch to reading corners and side tables.",
    "imageColor": "#DAD8D4",
    "imageKey": "dome-lamp",
    "variants": [
      {
        "id": "home-lamp-standard",
        "name": "Forest green",
        "priceMinor": 12800,
        "available": true
      },
      {
        "id": "home-lamp-large",
        "name": "Forest green / Large",
        "priceMinor": 15800,
        "available": false
      }
    ]
  },
  {
    "id": "home-stoneware-mug",
    "title": "Sunday Stoneware Mug",
    "description": "Make a little room for your morning ritual. A softly rounded handle, speckled cream glaze and simple silhouette make this ceramic mug an easy companion for coffee or tea. Choose a single mug or a matching pair.",
    "imageColor": "#DAD8D4",
    "imageKey": "stoneware-mug",
    "variants": [
      {
        "id": "home-mug-single",
        "name": "Single mug",
        "priceMinor": 2400,
        "available": true
      },
      {
        "id": "home-mug-pair",
        "name": "Set of 2",
        "priceMinor": 4400,
        "available": true
      }
    ]
  },
  {
    "id": "home-arch-vase",
    "title": "Terra Arch Vase",
    "description": "Warm terracotta and a sculptural arch bring character to a shelf or console. Display this textured ceramic vase on its own, or add a few dried stems for a simple, considered arrangement.",
    "imageColor": "#DAD8D4",
    "imageKey": "arch-vase",
    "variants": [
      {
        "id": "home-vase-small",
        "name": "Small",
        "priceMinor": 4800,
        "available": true
      },
      {
        "id": "home-vase-large",
        "name": "Large",
        "priceMinor": 6800,
        "available": true
      }
    ]
  },
  {
    "id": "home-oak-clock",
    "title": "Tempo Oak Wall Clock",
    "description": "An understated finishing touch for your living room or workspace. A natural oak frame surrounds a cream dial with clean black markers and hands, keeping the design simple and easy to read.",
    "imageColor": "#DAD8D4",
    "imageKey": "oak-clock",
    "variants": [
      {
        "id": "home-clock-natural",
        "name": "Natural oak",
        "priceMinor": 7900,
        "available": true
      }
    ]
  }
];

export const sampleCatalogs: Record<string, Product[]> = {
  apex: [...apexProducts, ...outerwearProducts],
  northline: homeProducts,
};

