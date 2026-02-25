// Static product catalogue — mirrors Firestore document structure.
// Used as immediate fallback when Firestore is empty or unavailable.
// Replace/extend by seeding the Firestore `products` collection.

export const SAMPLE_PRODUCTS = [
  {
    id: "prod-001",
    slug: "ceylon-cinnamon-quills",
    name: "Ceylon Cinnamon Quills",
    description:
      "Harvested from the inner bark of Cinnamomum verum trees native to Sri Lanka, our Ceylon Cinnamon Quills are tightly rolled by skilled artisans following centuries-old traditions. Softer and more delicate than Cassia cinnamon, they offer a sweeter, more complex flavour profile with subtle citrus undertones. Ideal for culinary applications, health supplements, and nutraceutical formulations globally.",
    mainImage: "/spices.png",
    images: ["/spices.png", "/product image.png", "/spice range pic.png"],
    category: "spice",
    rating: 5,
    featured: true,
  },
  {
    id: "prod-002",
    slug: "ceylon-black-tea",
    name: "Ceylon Black Tea",
    description:
      "Sourced from mist-covered highland estates at altitudes exceeding 4,000 feet, our Ceylon Black Tea offers a bold, rich flavour with a bright golden liquor. Each batch is carefully selected from single-origin gardens, delivering exceptional quality with a distinctive briskness, clean finish, and the signature note of the Sri Lankan terroir.",
    mainImage: "/tea range pic.png",
    images: ["/tea range pic.png", "/product image.png"],
    category: "tea",
    rating: 5,
    featured: true,
  },
  {
    id: "prod-003",
    slug: "virgin-coconut-oil",
    name: "Virgin Coconut Oil",
    description:
      "Cold-pressed from freshly harvested Sri Lankan coconuts, our Virgin Coconut Oil retains its natural aroma, nutrients, and purity. With a high lauric acid content and no chemical processing, it is prized in culinary, skincare, and hair care applications worldwide. Unrefined, chemical-free, and sustainably sourced.",
    mainImage: "/coconut pic.png",
    images: ["/coconut pic.png", "/product image.png"],
    category: "coconut-products",
    rating: 5,
    featured: true,
  },
  {
    id: "prod-004",
    slug: "moringa-leaf-powder",
    name: "Moringa Leaf Powder",
    description:
      "Dubbed the 'Miracle Tree' of Sri Lanka, our Moringa Leaf Powder is rich in vitamins, minerals, and antioxidants. Sun-dried at controlled temperatures and finely milled to preserve natural potency, this vibrant green superfood is ideal for health supplements, functional foods, smoothies, and nutraceutical manufacturing.",
    mainImage: "/herb pic.png",
    images: ["/herb pic.png", "/product image.png"],
    category: "herbal",
    rating: 5,
    featured: true,
  },
  {
    id: "prod-005",
    slug: "green-cardamom-pods",
    name: "Green Cardamom Pods",
    description:
      "Sourced from the aromatic spice gardens of Sri Lanka's humid lowlands, our Green Cardamom Pods are hand-picked at peak maturity to capture their intense fragrance and complex flavour. Known as the 'Queen of Spices', they add a warm, eucalyptus-like note to both sweet and savoury dishes and are widely used in beverages and confectionery.",
    mainImage: "/spice range pic.png",
    images: ["/spice range pic.png", "/product image.png"],
    category: "spice",
    rating: 4,
    featured: false,
  },
  {
    id: "prod-006",
    slug: "ceylon-white-tea",
    name: "Ceylon White Tea",
    description:
      "One of Sri Lanka's rarest offerings, our Ceylon White Tea is crafted from young silver-tipped buds with minimal processing. The result is a delicate, naturally sweet tea with a pale golden infusion and subtle floral undertones. A luxury beverage for the discerning palate and a premium offering for high-end retail and hospitality markets.",
    mainImage: "/tea range pic.png",
    images: ["/tea range pic.png"],
    category: "tea",
    rating: 5,
    featured: false,
  },
  {
    id: "prod-007",
    slug: "desiccated-coconut",
    name: "Desiccated Coconut",
    description:
      "Made from freshly grated Sri Lankan coconut, our Desiccated Coconut is finely shredded and gently dried to preserve its natural sweetness and rich coconut flavour. Free from additives and preservatives, it is the preferred choice for confectionery, bakery, and snack manufacturing across global markets.",
    mainImage: "/coconut pic.png",
    images: ["/coconut pic.png"],
    category: "coconut-products",
    rating: 4,
    featured: false,
  },
  {
    id: "prod-008",
    slug: "turmeric-powder",
    name: "Turmeric Powder",
    description:
      "Ground from high-curcumin Sri Lankan turmeric roots, our Turmeric Powder is vibrant in colour and potent in active compounds. A cornerstone of Ayurvedic medicine and modern wellness trends, it offers powerful anti-inflammatory and antioxidant properties ideal for food processing, supplements, and cosmetic applications.",
    mainImage: "/herb pic.png",
    images: ["/herb pic.png"],
    category: "herbal",
    rating: 5,
    featured: false,
  },
  {
    id: "prod-009",
    slug: "ceylon-black-pepper",
    name: "Ceylon Black Pepper",
    description:
      "Harvested from the climbing pepper vines of Sri Lanka's humid lowlands, our Ceylon Black Pepper delivers a bold, pungent heat with complex aromatic depth. Sun-dried to develop its wrinkled black skin and concentrated flavour — the 'King of Spices' in its finest, most authentic form. Widely sought after by premium spice distributors globally.",
    mainImage: "/spices.png",
    images: ["/spices.png"],
    category: "spice",
    rating: 4,
    featured: false,
  },
  {
    id: "prod-010",
    slug: "ceylon-green-tea",
    name: "Ceylon Green Tea",
    description:
      "Lightly oxidised and carefully steamed to preserve its natural antioxidants, our Ceylon Green Tea offers a fresh, grassy flavour with a clean, light-bodied finish. Rich in catechins and polyphenols, it is the ideal choice for health-focused beverage markets, wellness brands, and premium tea retailers worldwide.",
    mainImage: "/tea range pic.png",
    images: ["/tea range pic.png"],
    category: "tea",
    rating: 4,
    featured: false,
  },
  {
    id: "prod-011",
    slug: "coconut-cream",
    name: "Coconut Cream",
    description:
      "Extracted from the first pressing of freshly grated Sri Lankan coconut flesh, our Coconut Cream is exceptionally thick, rich, and aromatic. Free from additives and preservatives, it is the preferred choice for premium culinary, food service, and food manufacturing applications across Asia, Europe, and the Middle East.",
    mainImage: "/coconut pic.png",
    images: ["/coconut pic.png"],
    category: "coconut-products",
    rating: 5,
    featured: false,
  },
  {
    id: "prod-012",
    slug: "herbal-neem-powder",
    name: "Herbal Neem Powder",
    description:
      "Derived from the leaves of neem trees cultivated in Sri Lanka's dry zone, our Herbal Neem Powder is a potent botanical ingredient valued in Ayurveda and traditional medicine. Known for its antibacterial, antifungal, and purifying properties, it is widely used in natural cosmetics, Ayurvedic formulations, and therapeutic products.",
    mainImage: "/herb pic.png",
    images: ["/herb pic.png"],
    category: "herbal",
    rating: 4,
    featured: false,
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "spice", label: "Spices" },
  { id: "tea", label: "Tea" },
  { id: "coconut-products", label: "Coconut Products" },
  { id: "herbal", label: "Herbal" },
];

export const CATEGORY_LABELS = {
  spice: "Spice",
  tea: "Tea",
  "coconut-products": "Coconut Products",
  herbal: "Herbal",
};
