const SHOP_DESCRIPTIONS = {
  affiche: "Affiche au dos collant type sticker, facile à coller. Format A4 (210 x 297 mm). Résistante à l'eau et aux UV, environ 7 ans de tenue prévue. Livraison sous un mois, en France uniquement.",
  sticker: "Lot de 500 stickers ronds (5 x 5 cm). Résistants à l'eau et aux UV, environ 7 ans de tenue prévue. Livraison garantie en moins d'un mois, en France uniquement."
};

const SHOP_ITEMS = [
  {
    id: "affiche-pas-en-europe",
    category: "affiches",
    title: "\"Pas en Europe - Pas en France - Pas dans le monde\"",
    description: SHOP_DESCRIPTIONS.affiche,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/b8b0cea0-fe26-4a22-9111-f620964ea116_sans_titre_626_20260504001256.png"
    ],
    koFiUrl: "https://ko-fi.com/s/a5f57920d8"
  },
  {
    id: "affiche-amour-gagnera",
    category: "affiches",
    title: "\"L'amour Gagnera\"",
    description: SHOP_DESCRIPTIONS.affiche,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/7549f001-16bf-4e64-8f84-5c6f2f6d4f75_sans_titre_628_20260324164825-_1_.jpg"
    ],
    koFiUrl: "https://ko-fi.com/s/d285b25173"
  },
  {
    id: "affiche-drapeau",
    category: "affiches",
    title: "\"Nous on aime notre drapeau - Ah ? Car vous n'en avez qu'un ?\"",
    description: SHOP_DESCRIPTIONS.affiche,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/7f9ef6b8-204a-42df-a4c4-def257517559_sans_titre_628_20260320190425.png"
    ],
    koFiUrl: "https://ko-fi.com/s/4dd4f9eeb4"
  },
  {
    id: "affiche-racines",
    category: "affiches",
    title: "\"Fiers de nos racines - Nous on connait vos racines\"",
    description: SHOP_DESCRIPTIONS.affiche,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/ef91687d-6679-4f9b-980a-140ada855fd7_sans_titre_626_20260317200138.jpg"
    ],
    koFiUrl: "https://ko-fi.com/s/8572ec7c13"
  },
  {
    id: "affiche-flamme-nationale",
    category: "affiches",
    title: "\"Rallumer la flamme nationale ! - Comme s'il ne faisait déjà pas assez chaud\"",
    description: SHOP_DESCRIPTIONS.affiche,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/8393bdf8-f70b-457e-b45c-61f0d1a37541_sans_titre_628_20260318144406.png"
    ],
    koFiUrl: "https://ko-fi.com/s/2467232b14"
  },
  {
    id: "stickers-stop-genocide",
    category: "stickers",
    title: "500 stickers \"#STOP GENOCIDE\"",
    description: SHOP_DESCRIPTIONS.sticker,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/2db1ff34-7758-4db6-a14b-bae2a1c0eead_capturedcran2026-04-11115010.png"
    ],
    koFiUrl: "https://ko-fi.com/s/5a5fbbc43c"
  },
  {
    id: "stickers-cmha",
    category: "stickers",
    title: "500 stickers \"CMHA - Collectif Militant Humanitaire Antifasciste\"",
    description: SHOP_DESCRIPTIONS.sticker,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/239e9460-239f-41ac-88d7-e06deadb0482_capturedcran2026-04-08151801.png",
      "https://storage.ko-fi.com/cdn/useruploads/display/180ea6d7-bb74-4fe1-bf72-f29c842dbb69_20260504_122333.jpg",
      "https://storage.ko-fi.com/cdn/useruploads/display/25c7f9dd-16d8-4cc9-8ee2-94e3272f26b4_20260504_121952.jpg",
      "https://storage.ko-fi.com/cdn/useruploads/display/8d5ade20-79e4-4fd0-93ca-a7fffe7299bf_20260504_133625.jpg"
    ],
    koFiUrl: "https://ko-fi.com/s/d2314ada44"
  },
  {
    id: "stickers-tous-egaux",
    category: "stickers",
    title: "500 stickers \"Nous sommes tous égaux\"",
    description: SHOP_DESCRIPTIONS.sticker,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/60233e9d-7178-463b-a2b5-f6d098951898_capturedcran2026-04-10185659.png"
    ],
    koFiUrl: "https://ko-fi.com/s/68dacb06b6"
  },
  {
    id: "stickers-lfi",
    category: "stickers",
    title: "500 stickers \"Face au fascisme ; on vote LFI\"",
    description: SHOP_DESCRIPTIONS.sticker,
    images: [
      "https://storage.ko-fi.com/cdn/useruploads/post/89473c8d-a2cb-479b-98b4-7cc3f0b499dc_capturedcran2026-04-10185247.png"
    ],
    koFiUrl: "https://ko-fi.com/s/ef3d41c3b0"
  },
  {
    id: "commission-affiches-perso",
    category: "personnalise",
    title: "10 affiches/stickers muraux personnalisés",
    description: "Un lot de 10 affiches-stickers muraux créés sur mesure selon le message ou le visuel que vous souhaitez faire passer. Contactez-nous sur Ko-fi pour discuter du projet.",
    images: [
      "https://storage.ko-fi.com/cdn/generated/5qzgypdr6xpb7/2026-05-03_rest-8d19b90a37c57e7aa59de657971cef28-trfmephw.jpg"
    ],
    priceFrom: "30",
    koFiUrl: "https://ko-fi.com/c/8933e8e31c"
  },
  {
    id: "commission-stickers-perso",
    category: "personnalise",
    title: "Stickers personnalisés",
    description: "Un lot de stickers créés sur mesure selon le message ou le visuel que vous souhaitez faire passer. Contactez-nous sur Ko-fi pour discuter du projet.",
    images: [
      "https://storage.ko-fi.com/cdn/generated/5qzgypdr6xpb7/2026-04-15_rest-09015bf3340c154d64f16a7c0dda744f-wgspnhuu.jpg"
    ],
    priceFrom: "30",
    koFiUrl: "https://ko-fi.com/c/47ca618e23"
  }
];
