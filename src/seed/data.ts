// Data loaded by `npm run seed` (src/seed/index.ts).
// Settings are the real ones decided with Alex (CLAUDE.md, COPY.md).
// Recipes are SAMPLES: their slug starts with "exemplo-" and their name says
// "(exemplo)". They are replaced by the real recipes after Phase 2.

export const siteSettings = {
  portions: { small: 1, medium: 4, large: 7 },
  defaultPrices: {
    main: { small: 3, medium: 8, large: 13 },
    rice: { small: 1.5, medium: 3, large: 4.5 },
    salad: { small: 3, medium: 8, large: 13 },
  },
  deliveryFee: 5,
  freeDeliveryThreshold: 30,
  deliveryDays: ['1', '2', '3', '4', '5'] as ('1' | '2' | '3' | '4' | '5')[],
  windowStart: '17:00',
  windowEnd: '20:30',
  sameDayCutoff: '16:30',
  contactEmail: 'alexandre.bourlier@gmail.com',
  storage: {
    pt: {
      storageMain:
        'Guardar no congelador. Para aquecer, descongela no frigorífico de um dia para o outro ou aquece diretamente congelado. Micro-ondas: tira a tampa da caixa e cobre com um prato, mexendo a meio, até estar bem quente por todo. Tacho: em lume brando com um pouco de água, mexendo de vez em quando. Depois de descongelado, não voltes a congelar.',
      storageRice:
        'Guardar no congelador. Micro-ondas: tira a tampa da caixa, junta um pouco de água e cobre com um prato, mexendo a meio, até estar bem quente. Frigideira: uns minutos com um fio de azeite. Depois de descongelado, não voltes a congelar.',
      storageSalad:
        'Guardar no frigorífico, até 5 dias. Vai sem tempero para se manter fresca: na hora de servir, junta azeite, sal e pimenta, ou o que preferires.',
    },
    en: {
      storageMain:
        "Keep in the freezer. To reheat, thaw overnight in the fridge or heat straight from frozen. Microwave: take the lid off the container and cover with a plate, stirring halfway, until piping hot all the way through. Pan: over low heat with a splash of water, stirring now and then. Once thawed, don't refreeze.",
      storageRice:
        "Keep in the freezer. Microwave: take the lid off, add a splash of water and cover with a plate, stirring halfway, until piping hot. Pan: a few minutes with a drizzle of olive oil. Once thawed, don't refreeze.",
      storageSalad:
        'Keep in the fridge, up to 5 days. We leave it unseasoned so it stays fresh: just before serving, add olive oil, salt and pepper, or whatever you like.',
    },
  },
}

// Units for ingredient quantities (internal, Portuguese).
export const units: { name: string; abbreviation?: string }[] = [
  { name: 'g' },
  { name: 'kg' },
  { name: 'ml' },
  { name: 'l' },
  { name: 'colher de chá', abbreviation: 'c. chá' },
  { name: 'colher de sopa', abbreviation: 'c. sopa' },
  { name: 'chávena' },
  { name: 'unidade', abbreviation: 'un.' },
  { name: 'pitada' },
  { name: 'q.b.' },
]

// Notable nutrients (the list recipes pick from, and health tags point to).
export const nutrients = [
  { slug: 'proteina', pt: { name: 'Proteína', benefit: 'Constrói e repara os músculos' }, en: { name: 'Protein', benefit: 'Builds and repairs muscles' } },
  { slug: 'fibra', pt: { name: 'Fibra', benefit: 'Boa digestão e saciedade' }, en: { name: 'Fibre', benefit: 'Good digestion, keeps you full' } },
  { slug: 'ferro', pt: { name: 'Ferro', benefit: 'Transporta o oxigénio no sangue' }, en: { name: 'Iron', benefit: 'Carries oxygen in the blood' } },
  { slug: 'calcio', pt: { name: 'Cálcio', benefit: 'Ossos e dentes fortes' }, en: { name: 'Calcium', benefit: 'Strong bones and teeth' } },
  { slug: 'magnesio', pt: { name: 'Magnésio', benefit: 'Músculos e sistema nervoso' }, en: { name: 'Magnesium', benefit: 'Muscles and nervous system' } },
  { slug: 'zinco', pt: { name: 'Zinco', benefit: 'Sistema imunitário' }, en: { name: 'Zinc', benefit: 'Immune system' } },
  { slug: 'folato', pt: { name: 'Folato', benefit: 'Formação dos glóbulos vermelhos' }, en: { name: 'Folate', benefit: 'Red blood cell formation' } },
  { slug: 'vitamina-b12', pt: { name: 'Vitamina B12', benefit: 'Sangue e sistema nervoso' }, en: { name: 'Vitamin B12', benefit: 'Blood and nervous system' } },
  { slug: 'vitamina-c', pt: { name: 'Vitamina C', benefit: 'Imunidade e absorção do ferro' }, en: { name: 'Vitamin C', benefit: 'Immunity and iron absorption' } },
  { slug: 'vitamina-d', pt: { name: 'Vitamina D', benefit: 'Absorção do cálcio' }, en: { name: 'Vitamin D', benefit: 'Calcium absorption' } },
  { slug: 'omega-3', pt: { name: 'Ómega-3', benefit: 'Coração e cérebro' }, en: { name: 'Omega-3', benefit: 'Heart and brain' } },
  { slug: 'potassio', pt: { name: 'Potássio', benefit: 'Tensão arterial equilibrada' }, en: { name: 'Potassium', benefit: 'Healthy blood pressure' } },
]

// Health tags and the nutrients that trigger them (by nutrient slug).
export const healthTags = [
  { slug: 'musculos-fortes', icon: '💪', nutrients: ['proteina', 'magnesio'], pt: { name: 'Músculos fortes' }, en: { name: 'Strong muscles' } },
  { slug: 'ossos-fortes', icon: '🦴', nutrients: ['calcio', 'vitamina-d', 'magnesio'], pt: { name: 'Ossos fortes' }, en: { name: 'Strong bones' } },
  { slug: 'sangue-saudavel', icon: '🩸', nutrients: ['ferro', 'folato', 'vitamina-b12'], pt: { name: 'Sangue saudável' }, en: { name: 'Healthy blood' } },
  { slug: 'coracao-saudavel', icon: '❤️', nutrients: ['omega-3', 'fibra', 'potassio'], pt: { name: 'Coração saudável' }, en: { name: 'Healthy heart' } },
  { slug: 'imunidade', icon: '🛡️', nutrients: ['vitamina-c', 'zinco'], pt: { name: 'Imunidade' }, en: { name: 'Immune support' } },
]

// Sample ingredients (matched by their Portuguese name) with their unit.
export const ingredients: { pt: string; en: string; unit: string }[] = [
  { pt: 'Quinoa', en: 'Quinoa', unit: 'g' },
  { pt: 'Grão-de-bico cozido', en: 'Cooked chickpeas', unit: 'g' },
  { pt: 'Feijão branco cozido', en: 'Cooked white beans', unit: 'g' },
  { pt: 'Arroz integral', en: 'Brown rice', unit: 'g' },
  { pt: 'Tomate', en: 'Tomato', unit: 'g' },
  { pt: 'Leite de coco', en: 'Coconut milk', unit: 'ml' },
  { pt: 'Caril em pó', en: 'Curry powder', unit: 'colher de sopa' },
  { pt: 'Sementes de abóbora', en: 'Pumpkin seeds', unit: 'g' },
  { pt: 'Azeite', en: 'Olive oil', unit: 'colher de sopa' },
  { pt: 'Cebola', en: 'Onion', unit: 'unidade' },
  { pt: 'Alho', en: 'Garlic', unit: 'unidade' },
  { pt: 'Sal', en: 'Salt', unit: 'q.b.' },
]

type SampleRecipe = {
  slug: string
  type: 'main' | 'rice' | 'salad'
  featured: boolean
  /** Free stand-in photo from Unsplash (photo id). */
  unsplashId: string
  /** Initial stock, recorded as one "production" entry in the stock log. */
  stock: { small: number; medium: number; large: number }
  priceOverrides?: { small?: number; medium?: number; large?: number }
  /** Internal recipe references (admins only). */
  sourceLinks?: string[]
  nutrition: { protein: number; carbs: number; fat: number; fibre: number }
  /** Nutrient slugs; health tags are inferred from them. */
  notableNutrients: string[]
  /** Ingredient (Portuguese name, see `ingredients`) and quantity per batch. */
  ingredients: { ingredient: string; quantity: number }[]
  suggestRice?: boolean
  pt: { name: string; description: string; servingSuggestion?: string; photoAlt: string }
  en: { name: string; description: string; servingSuggestion?: string; photoAlt: string }
}

export const sampleRecipes: SampleRecipe[] = [
  {
    slug: 'exemplo-salada-de-quinoa',
    type: 'salad',
    featured: true,
    unsplashId: '1505576633757-0ac1084af824',
    stock: { small: 6, medium: 3, large: 1 },
    nutrition: { protein: 18, carbs: 52, fat: 26, fibre: 4 },
    notableNutrients: ['proteina', 'fibra', 'magnesio', 'ferro'],
    ingredients: [
      { ingredient: 'Quinoa', quantity: 500 },
      { ingredient: 'Grão-de-bico cozido', quantity: 400 },
      { ingredient: 'Tomate', quantity: 300 },
      { ingredient: 'Sementes de abóbora', quantity: 60 },
    ],
    pt: {
      name: 'Salada de quinoa (exemplo)',
      description: 'Quinoa, grão, sementes e legumes da época, feita esta manhã. Rica em proteína e fibra, para te manter cheio até ao fim do dia.',
      photoAlt: 'Taça de salada de quinoa com legumes coloridos',
    },
    en: {
      name: 'Quinoa salad (sample)',
      description: 'Quinoa, chickpeas, seeds and seasonal vegetables, made this morning. Rich in protein and fibre to keep you full all evening.',
      photoAlt: 'Bowl of quinoa salad with colourful vegetables',
    },
  },
  {
    slug: 'exemplo-caril-de-grao-de-bico',
    type: 'main',
    featured: false,
    unsplashId: '1654199903998-e49181b41a95',
    stock: { small: 5, medium: 4, large: 2 },
    priceOverrides: { large: 12.5 },
    sourceLinks: ['https://www.bbcgoodfood.com/recipes/chickpea-curry'],
    nutrition: { protein: 22, carbs: 50, fat: 24, fibre: 4 },
    notableNutrients: ['proteina', 'ferro', 'fibra', 'vitamina-c'],
    ingredients: [
      { ingredient: 'Grão-de-bico cozido', quantity: 1200 },
      { ingredient: 'Leite de coco', quantity: 400 },
      { ingredient: 'Tomate', quantity: 500 },
      { ingredient: 'Cebola', quantity: 2 },
      { ingredient: 'Alho', quantity: 3 },
      { ingredient: 'Caril em pó', quantity: 2 },
      { ingredient: 'Azeite', quantity: 2 },
      { ingredient: 'Sal', quantity: 1 },
    ],
    suggestRice: true,
    pt: {
      name: 'Caril de grão-de-bico (exemplo)',
      description: 'Cremoso e suave, com especiarias que aquecem sem picar. O grão traz ferro e proteína em cada colherada.',
      servingSuggestion: 'Serve com o nosso arroz e uma salada fresca.',
      photoAlt: 'Caril de grão-de-bico com brócolos numa taça',
    },
    en: {
      name: 'Chickpea curry (sample)',
      description: 'Creamy and mild, with warming spices and no heat. Chickpeas bring iron and protein in every spoonful.',
      servingSuggestion: 'Serve with our rice and a fresh salad.',
      photoAlt: 'Chickpea curry with broccoli in a bowl',
    },
  },
  {
    slug: 'exemplo-feijao-branco-estufado',
    type: 'main',
    featured: false,
    unsplashId: '1779119867390-c64f66cd02b8',
    // All sizes at 0 on purpose: shows the "sold out" and production-request states.
    stock: { small: 0, medium: 0, large: 0 },
    nutrition: { protein: 24, carbs: 55, fat: 15, fibre: 6 },
    notableNutrients: ['fibra', 'ferro', 'calcio', 'folato', 'potassio'],
    ingredients: [
      { ingredient: 'Feijão branco cozido', quantity: 1500 },
      { ingredient: 'Tomate', quantity: 800 },
      { ingredient: 'Cebola', quantity: 2 },
      { ingredient: 'Alho', quantity: 4 },
      { ingredient: 'Azeite', quantity: 3 },
      { ingredient: 'Sal', quantity: 1 },
    ],
    suggestRice: true,
    pt: {
      name: 'Feijão branco estufado (exemplo)',
      description: 'Feijão branco em molho de tomate e ervas, a lembrar o tacho da avó. Cheio de fibra e de minerais para os ossos.',
      servingSuggestion: 'Serve com o nosso arroz e uma salada fresca.',
      photoAlt: 'Feijão branco estufado em molho de tomate',
    },
    en: {
      name: 'Stewed white beans (sample)',
      description: "White beans in a tomato and herb sauce, like grandma's pot. Full of fibre and bone-friendly minerals.",
      servingSuggestion: 'Serve with our rice and a fresh salad.',
      photoAlt: 'White beans stewed in tomato sauce',
    },
  },
  {
    slug: 'exemplo-arroz-integral',
    type: 'rice',
    featured: false,
    unsplashId: '1582576163090-09d3b6f8a969',
    stock: { small: 10, medium: 6, large: 3 },
    nutrition: { protein: 9, carbs: 82, fat: 6, fibre: 3 },
    notableNutrients: ['fibra', 'magnesio'],
    ingredients: [
      { ingredient: 'Arroz integral', quantity: 1000 },
      { ingredient: 'Sal', quantity: 1 },
    ],
    pt: {
      name: 'Arroz integral (exemplo)',
      description: 'Arroz integral soltinho, cozinhado no ponto. O par perfeito para qualquer prato.',
      photoAlt: 'Arroz integral com legumes verdes num prato',
    },
    en: {
      name: 'Brown rice (sample)',
      description: 'Fluffy brown rice, cooked just right. The perfect partner for any dish.',
      photoAlt: 'Brown rice with green vegetables on a plate',
    },
  },
]
