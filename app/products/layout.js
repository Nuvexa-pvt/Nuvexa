const BASE_URL = "https://www.nuvexainternational.com";

export const metadata = {
  title: "Products — Ceylon Tea, Spices, Coconut & Herbal Products",
  description:
    "Browse Nuvexa International's export product range: premium Ceylon tea, authentic Sri Lankan spices (cinnamon, pepper, cardamom), virgin coconut oil, aloe vera extracts, and certified herbal products — available for wholesale B2B orders worldwide.",
  keywords: [
    "Ceylon tea wholesale", "Ceylon black tea supplier", "Ceylon green tea bulk",
    "Ceylon cinnamon exporter", "true cinnamon wholesale", "Sri Lanka spices bulk",
    "virgin coconut oil supplier", "desiccated coconut exporter", "coconut flour bulk",
    "aloe vera gel supplier", "organic aloe vera extract", "Sri Lanka herbal products",
    "Ceylon herbal extracts", "ayurvedic herbs Sri Lanka", "natural products Sri Lanka wholesale",
    "black pepper Sri Lanka", "cardamom Sri Lanka export", "cloves exporter Sri Lanka",
    "turmeric supplier Sri Lanka", "Sri Lanka food products B2B",
  ],
  alternates: { canonical: `${BASE_URL}/products` },
  openGraph: {
    title: "Products | NUVEXA International — Ceylon Tea, Spices, Coconut & Herbal",
    description:
      "Premium export-ready natural products from Sri Lanka. Ceylon tea, cinnamon, coconut oil, aloe vera, and herbal extracts for global wholesale buyers.",
    url: `${BASE_URL}/products`,
    images: [{ url: "/webmeta.png", width: 1200, height: 630, alt: "NUVEXA International Product Range" }],
  },
  twitter: {
    title: "Products | NUVEXA International — Ceylon Tea, Spices & More",
    description:
      "Wholesale Ceylon tea, spices, coconut oil, aloe vera & herbal products from Sri Lanka. B2B export inquiries welcome.",
    images: ["/webmeta.png"],
  },
};

export default function ProductsLayout({ children }) {
  return children;
}
