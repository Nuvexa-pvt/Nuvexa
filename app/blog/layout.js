const BASE_URL = "https://www.nuvexainternational.com";

export const metadata = {
  title: "Blog — Insights on Sri Lankan Natural Products & Export Trade",
  description:
    "Explore the Nuvexa International blog for expert insights on Ceylon tea, Sri Lankan spices, coconut products, herbal extracts, and global export trade from Sri Lanka.",
  keywords: [
    "Ceylon tea blog", "Sri Lanka spices insights", "coconut products news",
    "herbal extracts Sri Lanka", "Sri Lanka export trade", "natural products industry",
    "Ceylon cinnamon facts", "Sri Lanka food industry", "B2B export insights",
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Blog | NUVEXA International — Sri Lankan Natural Products & Trade Insights",
    description:
      "Expert articles on Ceylon tea, spices, coconut products, aloe vera, herbal extracts, and the Sri Lanka export trade.",
    url: `${BASE_URL}/blog`,
    images: [{ url: "/webmeta.png", width: 1200, height: 630, alt: "NUVEXA International Blog" }],
  },
  twitter: {
    title: "Blog | NUVEXA International",
    description: "Insights on Ceylon tea, spices, coconut products, and Sri Lanka's export trade.",
    images: ["/webmeta.png"],
  },
};

export default function BlogLayout({ children }) {
  return children;
}
