const BASE_URL = "https://www.nuvexainternational.com";

export const metadata = {
  title: "About Us — Sri Lanka's Trusted Export Partner",
  description:
    "Learn about Nuvexa International — a Sri Lanka-based B2B export company connecting certified local producers of tea, spices, coconut products, and herbal extracts with global buyers in 15+ countries.",
  keywords: [
    "about Nuvexa International", "Sri Lanka export company", "Ceylon product exporter",
    "Sri Lanka B2B export partner", "trusted Sri Lanka supplier", "Sri Lanka natural products company",
    "Ceylon tea spice coconut exporter", "Sri Lanka to global market",
  ],
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About Nuvexa International | Sri Lanka's Trusted Export Partner",
    description:
      "Nuvexa International bridges certified Sri Lankan producers with international buyers. Discover our story, values, and commitment to quality exports.",
    url: `${BASE_URL}/about`,
    images: [{ url: `${BASE_URL}/webmeta.png`, width: 1200, height: 630, alt: "About NUVEXA International" }],
  },
  twitter: {
    title: "About Nuvexa International | Sri Lanka's Trusted Export Partner",
    description:
      "Nuvexa International bridges Sri Lankan producers with global buyers. Quality-assured Ceylon tea, spices, coconut products & herbal extracts.",
    images: [`${BASE_URL}/webmeta.png`],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
