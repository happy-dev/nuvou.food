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

// Home page images. Food photos are Unsplash stand-ins until Vivi's own;
// people photos come from the private inputs/ folder (skipped if missing).
type HomeImage = { alt: { pt: string; en: string } } & ({ unsplashId: string } | { file: string })

export const homeImages = {
  hero: {
    unsplashId: '1512621776951-a57141f2eefd',
    alt: { pt: 'Taça de legumes frescos, cereais e leguminosas', en: 'A bowl of fresh vegetables, grains and legumes' },
  },
  faster: {
    unsplashId: '1654199903998-e49181b41a95',
    alt: { pt: 'Caril de grão-de-bico numa taça', en: 'Chickpea curry in a bowl' },
  },
  kids: {
    unsplashId: '1779119867390-c64f66cd02b8',
    alt: { pt: 'Prato de feijão estufado', en: 'A plate of stewed beans' },
  },
  story: {
    file: 'inputs/photos/vivi-and-alex/WhatsApp Image 2026-10-09 at 08.39.41.jpeg',
    alt: { pt: 'A Vivi e o Alex, ao sol', en: 'Vivi and Alex in the sun' },
  },
  tome: { file: 'inputs/photos/testemonials/tomé-mayrink.png', alt: { pt: 'Tomé', en: 'Tomé' } },
  bibiana: { file: 'inputs/photos/testemonials/bibiana-de-sá.png', alt: { pt: 'Bibiana de Sá', en: 'Bibiana de Sá' } },
  antonio: { file: 'inputs/photos/testemonials/antónio-nozes.png', alt: { pt: 'António Nozes', en: 'António Nozes' } },
} satisfies Record<string, HomeImage>

export type HomeImageKey = keyof typeof homeImages

// Home page copy (inputs/notes/COPY.md, Part 2). Markup: *highlight*,
// **bold**, {placeholders} (src/lib/copy.ts). Images are set by the seed.
// Tomé is a minor: first name only. His photo is shown with his mother Vivi's consent.
const testimonials = (quotes: [string, string, string]) =>
  [
    { quote: quotes[0], name: 'Tomé', photo: 'tome' },
    { quote: quotes[1], name: 'Bibiana de Sá', photo: 'bibiana' },
    { quote: quotes[2], name: 'António Nozes', photo: 'antonio' },
  ] as { quote: string; name: string; photo: HomeImageKey | null }[]

// No delivery fee on the takeaway side: our per-person price leaves delivery
// out too (free over the threshold, one delivery covers several dinners).
const takeaway = (items: [string, string, string]) => [52, 14, 5.9].map((amount, i) => ({ item: items[i], amount }))

export const homePage = {
  pt: {
    hero: {
      headline: 'Comida feita em casa. *Sem a chatice.* Que cabe no teu bolso.',
      subtitle:
        'Refeições caseiras, ricas em proteína e sem aditivos, da nossa cozinha para a tua. Pratos e arroz entregues congelados, saladas feitas nessa manhã. Jantar em minutos. Aprovado pelos miúdos.',
    },
    howItWorks: {
      title: 'Três passos. *Zero tachos.*',
      steps: [
        { title: 'Escolhe', text: 'Escolhe as refeições e o tamanho das porções.' },
        {
          title: 'Recebe',
          text: 'Encomenda até às {cutoff} e entregamos no dia, entre as {windowStart} e as {windowEnd}, de segunda a sexta.',
        },
        { title: 'Aquece e saboreia', text: 'Aquece o prato, tempera a salada: o jantar está na mesa em minutos.' },
      ],
    },
    faster: {
      eyebrow: 'Mais rápido',
      title: 'Pronto em *minutos*',
      text: 'Nós cozinhamos (horas a fio) para que tu não tenhas de o fazer. Guarda umas refeições no congelador e o jantar deixa de ser um problema.',
    },
    cheaper: {
      eyebrow: 'Mais barato',
      title: 'Melhor do que o take-away. *Por uma fração do preço.*',
      text:
        'O take-away custa facilmente 18 € por pessoa. Um jantar Nuvou completo (prato, arroz e salada) custa **{perPerson} por pessoa**.\n\n' +
        'Como? Sem segredos: ingredientes simples e inteiros, como feijão, grão, lentilhas e cereais, cozinhados por quem os sabe tornar deliciosos. Comer bem não tem de custar uma fortuna. Muitas vezes, o que custa caro é o processado.',
      takeaway: takeaway(['Hambúrguer ×4', 'Batatas ×4', 'Taxa de serviço']),
      nuvouReceipt: { main: 'Caril de grão', rice: 'Arroz integral', salad: 'Salada de quinoa' },
    },
    kids: {
      eyebrow: 'Aprovado pelos miúdos',
      title: 'O teste mais difícil *que há.*',
      text:
        'Sejamos honestos: aos olhos de uma criança, nenhuma refeição saudável ganha a um hambúrguer com refrigerante. Há milhares de milhões em marketing a garantir isso.\n\n' +
        'Mas as nossas receitas passam no teste mais difícil que há: os três filhos da Vivi. Comem, alguns pratos já se tornaram verdadeiros favoritos, e os amigos deles pedem para repetir. Comida de conforto que lhes faz bem.',
      stamp: 'Aprovado pelos miúdos ✓',
    },
    healthy: {
      eyebrow: 'Saudável',
      title: 'Nós tratamos *da nutrição.*',
      wholeFoodTitle: '100% ingredientes naturais, zero aditivos',
      wholeFoodText:
        'Só ingredientes que reconheces da tua cozinha. Sem conservantes, sem intensificadores de sabor, sem "E-qualquer-coisa". **O congelador é o nosso único conservante.**',
      balancedTitle: 'Rica em proteína e equilibrada',
      balancedText:
        'Somos nerds da nutrição. Cada refeição é pensada para equilibrar proteínas, hidratos de carbono e gorduras saudáveis. Também temos em conta as vitaminas, os minerais e os ómega-3, garantindo que cada ingrediente contribui para o bom funcionamento do teu corpo, em vez de o prejudicar. Cada prato apresenta os valores nutricionais e os seus benefícios: ossos fortes, sangue saudável e muito mais.',
    },
    planet: {
      eyebrow: 'Leve para o planeta',
      text: 'Uma refeição média em Portugal emite 3 kg de CO₂. As nossas refeições são 100% plant-based e emitem cerca de 4 vezes menos.*',
      averageKg: 3,
      oursKg: 0.7,
      footnote:
        '*Média de 92 refeições habitualmente consumidas em Portugal: 3,0 kg CO₂e por pessoa. Refeições plant-based no mesmo estudo: 0,6–0,7 kg. Mesquita & Carvalho, The International Journal of Life Cycle Assessment, 2023.',
    },
    mostOrdered: { title: 'Os mais *pedidos*' },
    story: {
      eyebrow: 'A nossa história',
      title: 'Feito em família, *para a tua mesa.*',
      text: 'Somos a Vivi e o Alex. Há três anos que cozinhamos em grande para a nossa família. Agora cozinhamos também para ti.',
    },
    testimonials: {
      title: 'O que diz *quem já comeu?*',
      items: testimonials([
        'Os meus amigos da escola gostam tanto da nossa comida que eles me pagam bebidas em troca de um bocado dela.',
        'Melhor húmus da minha vida.',
        'Eu amo o húmus e os Dahl mesmo!',
      ]),
    },
    finalCall: {
      title: 'Hoje à noite, *o jantar já está feito.*',
    },
  },
  en: {
    hero: {
      headline: 'Home-cooked food. *None of the hassle.* Easy on your budget.',
      subtitle:
        'Whole-food, protein-rich meals with zero additives, from our kitchen to yours. Main dishes and rice delivered frozen, salads made fresh that morning. Dinner in minutes. Kid-approved.',
    },
    howItWorks: {
      title: 'Three steps. *Zero pots.*',
      steps: [
        { title: 'Choose', text: 'Pick your meals and portion sizes.' },
        {
          title: 'Receive',
          text: 'Order before {cutoff} and we deliver the same day, between {windowStart} and {windowEnd}, Monday to Friday.',
        },
        { title: 'Heat and enjoy', text: "Heat the main dish, season the salad: dinner's on the table in minutes." },
      ],
    },
    faster: {
      eyebrow: 'Faster',
      title: 'Ready in *minutes*',
      text: "We do the cooking (hours of it) so you don't have to. Keep a few meals in the freezer and dinner is never a problem again.",
    },
    cheaper: {
      eyebrow: 'Cheaper',
      title: 'Better than takeaway. *For a fraction of the price.*',
      text:
        'Takeaway easily costs €18 per person. A complete Nuvou dinner (main dish, rice and salad) costs **{perPerson} per person**.\n\n' +
        "How? No secret: simple, whole ingredients like beans, chickpeas, lentils and grains, cooked by people who know how to make them delicious. Eating well doesn't have to cost a fortune. Often it's the processed stuff that does.",
      takeaway: takeaway(['Burger ×4', 'Fries ×4', 'Service fee']),
      nuvouReceipt: { main: 'Chickpea curry', rice: 'Brown rice', salad: 'Quinoa salad' },
    },
    kids: {
      eyebrow: 'Kid-approved',
      title: 'The toughest test *there is.*',
      text:
        "Let's be honest: in a child's eyes, no healthy meal beats a burger and a soda. Billions in marketing make sure of that.\n\n" +
        "But our recipes pass the toughest test there is: Vivi's three kids. They eat it, some dishes have become real favourites, and their friends ask for more. Comfort food that does them good.",
      stamp: 'Kid-approved ✓',
    },
    healthy: {
      eyebrow: 'Healthy',
      title: 'We take care *of the nutrition.*',
      wholeFoodTitle: '100% whole food, zero additives',
      wholeFoodText:
        "Only ingredients you'd recognise in your own kitchen. No preservatives, no flavour enhancers, no E-numbers. **The freezer is our only preservative.**",
      balancedTitle: 'Protein-rich and balanced',
      balancedText:
        "We're nutrition nerds. Every meal is built to balance protein, carbohydrates and good fats. We also check vitamins, minerals and omega-3, and make sure they work for your body and not against it. Every dish shows the numbers, and what it's good for: strong bones, healthy blood and more.",
    },
    planet: {
      eyebrow: 'Light on the planet',
      text: 'An average meal in Portugal emits 3 kg of CO₂. Our meals are 100% plant-based and emit about 4 times less.*',
      averageKg: 3,
      oursKg: 0.7,
      footnote:
        '*Average of 92 meals commonly eaten in Portugal: 3.0 kg CO₂e per person. Plant-based meals in the same study: 0.6–0.7 kg. Mesquita & Carvalho, The International Journal of Life Cycle Assessment, 2023.',
    },
    mostOrdered: { title: 'Most *ordered*' },
    story: {
      eyebrow: 'Our story',
      title: 'Made by a family, *for your table.*',
      text: "We're Vivi and Alex. For three years, we've batch-cooked for our own family. Now we cook for you too.",
    },
    testimonials: {
      title: "What people *who've eaten it* say",
      items: testimonials([
        'My friends from school like our food so much that they buy me drinks in exchange for some of it.',
        'Best hummus of my life.',
        'I really love the hummus and the dahl!',
      ]),
    },
    finalCall: {
      title: "Tonight, *dinner's already done.*",
    },
  },
}
