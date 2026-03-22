import { Inter, Cambay } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cartContext";
import ConditionalFloatingCart from "@/components/ConditionalFloatingCart";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cambay = Cambay({
  variable: "--font-cambay",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const BASE_URL = "https://www.nuvexainternational.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "NUVEXA International | Premium Sri Lankan Exports",
    template: "%s | NUVEXA International",
  },
  description:
    "Nuvexa International is Sri Lanka's trusted export partner. We supply premium Ceylon tea, authentic spices, virgin coconut oil, aloe vera products, and certified herbal extracts to global buyers in 15+ countries.",
  keywords: [
    // Brand
    "Nuvexa International", "Nuvexa Sri Lanka", "nuvexainternational.com",
    // Core categories
    "Ceylon tea wholesale", "Ceylon black tea supplier", "Ceylon tea exporter",
    "Ceylon cinnamon exporter", "true cinnamon supplier", "Ceylon cinnamon wholesale",
    "Sri Lanka spices export", "Sri Lanka spices supplier", "spices from Sri Lanka",
    "Sri Lanka coconut products export", "virgin coconut oil Sri Lanka", "desiccated coconut exporter",
    "coconut oil supplier", "coconut flour bulk supplier", "coconut products B2B",
    "aloe vera gel supplier Sri Lanka", "aloe vera products export", "organic aloe vera",
    "Sri Lanka herbal products export", "Ceylon herbal extracts supplier", "herbal supplements Sri Lanka",
    // General
    "Sri Lanka natural products exporter", "Ceylon exports wholesale", "Sri Lanka food export company",
    "Sri Lanka B2B supplier", "certified organic products Sri Lanka", "premium natural products Sri Lanka",
    "Sri Lankan export company", "Sri Lanka to international market", "bulk natural products supplier",
  ],

  authors: [{ name: "NUVEXA International", url: BASE_URL }],
  creator: "NUVEXA International",
  publisher: "NUVEXA International (Pvt) Ltd",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "NUVEXA International",
    title: "NUVEXA International | Premium Sri Lankan Exports — Tea, Spices, Coconut & Herbs",
    description:
      "Sri Lanka's trusted export partner. Premium Ceylon tea, authentic spices, virgin coconut oil, aloe vera products, and certified herbal extracts for global buyers.",
    images: [
      {
        url: `${BASE_URL}/webmeta.png`,
        width: 1200,
        height: 630,
        alt: "NUVEXA International — Premium Sri Lankan Natural Product Exports",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NUVEXA International | Premium Sri Lankan Exports",
    description:
      "Sri Lanka's trusted export partner. Premium Ceylon tea, spices, coconut oil, aloe vera & herbal products for global buyers.",
    images: [`${BASE_URL}/webmeta.png`],
    creator: "@nuvexaintl",
  },

  alternates: {
    canonical: BASE_URL,
  },

  verification: {
    // Add your Google Search Console verification token here once available
    // google: "your-google-verification-token",
  },

  category: "Export, Natural Products, Food & Beverage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${cambay.variable} antialiased bg-white`}
      >
        <CartProvider>
          {children}
          <ConditionalFloatingCart />
        </CartProvider>
        <Toaster position="bottom-right" richColors duration={3000} />
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9Z1TBGBEBM"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9Z1TBGBEBM');
        `}
      </Script>
    </html>
  );
}
