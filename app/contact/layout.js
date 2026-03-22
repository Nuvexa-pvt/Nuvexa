import SchemaOrg from "@/components/SchemaOrg";

const BASE_URL = "https://www.nuvexainternational.com";

export const metadata = {
  title: "Contact Us — Get in Touch with Our Export Team",
  description:
    "Contact Nuvexa International for B2B export inquiries. Whether you're a global buyer seeking premium Sri Lankan natural products or a local producer seeking international markets, reach out to our team.",
  keywords: [
    "contact Nuvexa International", "Sri Lanka export inquiry", "Ceylon products bulk order",
    "B2B export contact", "Sri Lanka supplier contact", "wholesale Sri Lanka products",
    "Ceylon tea order", "spices supplier contact Sri Lanka", "natural products wholesale inquiry",
  ],
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact Nuvexa International | B2B Export Inquiries",
    description:
      "Send a trade inquiry to Nuvexa International. We supply premium Ceylon tea, spices, coconut products, aloe vera, and herbal extracts to global buyers.",
    url: `${BASE_URL}/contact`,
    images: [{ url: `${BASE_URL}/webmeta.png`, width: 1200, height: 630, alt: "Contact NUVEXA International" }],
  },
  twitter: {
    title: "Contact Nuvexa International | B2B Export Inquiries",
    description:
      "Reach out for wholesale inquiries on Ceylon tea, spices, coconut products, and herbal extracts from Sri Lanka.",
    images: [`${BASE_URL}/webmeta.png`],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${BASE_URL}/#organization`,
  name: "NUVEXA International",
  legalName: "Nuvexa International (Pvt) Ltd",
  url: BASE_URL,
  image: `${BASE_URL}/webmeta.png`,
  logo: `${BASE_URL}/logo.png`,
  description:
    "Nuvexa International is a Sri Lanka-based B2B export company supplying premium Ceylon tea, spices, coconut products, aloe vera, and herbal extracts to global buyers.",
  telephone: ["+94773666365", "+94778910168", "+94113686996"],
  email: "info@nuvexainternational.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 33, 1 Lane",
    addressLocality: "Ratmalana",
    addressCountry: "LK",
    addressRegion: "Western Province",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.82299,
    longitude: 79.88022,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "13:00",
    },
  ],
  priceRange: "$$",
  areaServed: "Worldwide",
};

export default function ContactLayout({ children }) {
  return (
    <>
      <SchemaOrg schema={localBusinessSchema} />
      {children}
    </>
  );
}
