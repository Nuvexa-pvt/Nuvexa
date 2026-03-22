import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Products from "@/components/home/Products";
import Categories from "@/components/home/Categories";
import VisionMission from "@/components/home/VisionMission";
import Qualities from "@/components/home/Qualities";
import SupplierStories from "@/components/home/SupplierStories";
import Footer from "@/components/Footer";
import SchemaOrg from "@/components/SchemaOrg";

const BASE_URL = "https://www.nuvexainternational.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "NUVEXA International",
  legalName: "Nuvexa International (Pvt) Ltd",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: 663,
    height: 191,
  },
  image: `${BASE_URL}/webmeta.png`,
  description:
    "Nuvexa International is a Sri Lanka-based B2B export company supplying premium Ceylon tea, authentic spices, virgin coconut oil, aloe vera products, and certified herbal extracts to global buyers in 15+ countries.",
  foundingDate: "2024",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 10 },
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 33, 1 Lane",
    addressLocality: "Ratmalana",
    addressCountry: "LK",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+94773666365",
      contactType: "sales",
      availableLanguage: ["English"],
      contactOption: "TollFree",
    },
    {
      "@type": "ContactPoint",
      email: "info@nuvexainternational.com",
      contactType: "customer support",
    },
  ],
  sameAs: [],
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Worldwide",
  },
  knowsAbout: [
    "Ceylon Tea Export",
    "Sri Lanka Spices",
    "Coconut Products",
    "Herbal Extracts",
    "Aloe Vera Products",
    "Natural Product Export",
    "B2B Trade",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "NUVEXA International",
  description: "Premium Sri Lankan Natural Product Exports — Tea, Spices, Coconut & Herbs",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/products?search={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What products does Nuvexa International export from Sri Lanka?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nuvexa International exports a wide range of premium Sri Lankan natural products including Ceylon tea (black, green, white, oolong), authentic spices (cinnamon, black pepper, cardamom, cloves, turmeric), coconut products (virgin coconut oil, desiccated coconut, coconut flour, coconut cream), aloe vera gel and extracts, and a range of certified herbal products.",
      },
    },
    {
      "@type": "Question",
      name: "Does Nuvexa International supply wholesale or B2B orders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Nuvexa International is exclusively focused on B2B and wholesale export orders. We supply importers, distributors, retailers, and private-label brands worldwide. Minimum order quantities and pricing are available upon inquiry.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Ceylon cinnamon different from regular cinnamon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ceylon cinnamon (Cinnamomum verum), also known as 'true cinnamon', is native to Sri Lanka and is widely considered the premium variety. It has a delicate, sweet flavour and contains significantly lower levels of coumarin compared to Cassia cinnamon, making it the preferred choice for health-conscious consumers and premium food brands worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "Are Nuvexa International's products certified organic or halal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many of our products are available with organic, halal, and other international certifications. We work with certified manufacturers and can provide relevant documentation upon request. Please contact us for specific certification requirements for your order.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries does Nuvexa International export to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nuvexa International currently exports to 15+ countries across Europe, North America, Asia, the Middle East, and Australia. We handle all export logistics, documentation, and compliance to ensure seamless international delivery.",
      },
    },
    {
      "@type": "Question",
      name: "How can I place a bulk order or request a product quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can request a quote or submit a bulk order inquiry through our Contact page or the Quote Request form on our website. Our sales team will respond within 1–2 business days with pricing, minimum order quantities, and shipping details.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <SchemaOrg schema={organizationSchema} />
      <SchemaOrg schema={webSiteSchema} />
      <SchemaOrg schema={faqSchema} />
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Categories />
      <VisionMission />
      <Qualities />
      {/* <SupplierStories /> */}
      <Footer />
    </main>
  );
}
