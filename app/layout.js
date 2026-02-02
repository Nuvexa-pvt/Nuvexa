import { Inter, Cambay } from "next/font/google";
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

export const metadata = {
  title: "NUVEXA International | Premium Sri Lankan Exports",
  description: "Delivering Sri Lanka's trusted natural products to the global market. Export-focused company sourcing high-quality food, beverage, and wellness products.",
  keywords: "Sri Lanka exports, Ceylon tea, spices, coconut products, herbal products, natural products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${cambay.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
