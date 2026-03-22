import { getProductBySlug } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/productsData";
import ProductDetailClient from "./ProductDetailClient";
import SchemaOrg from "@/components/SchemaOrg";

const BASE_URL = "https://www.nuvexainternational.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    // fall through to defaults
  }

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product could not be found. Browse our full range of premium Sri Lankan natural products.",
    };
  }

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category ?? "Natural Product";
  const title = `${product.name} — ${categoryLabel} from Sri Lanka`;
  const description =
    product.description
      ? `${product.description.slice(0, 150)}… | Available for wholesale export from Nuvexa International, Sri Lanka.`
      : `Premium ${product.name} sourced from Sri Lanka. Available for wholesale B2B export by Nuvexa International.`;

  return {
    title,
    description,
    keywords: [
      product.name, categoryLabel, "Sri Lanka", "wholesale", "export", "B2B",
      "Ceylon", "natural product", "supplier",
      ...(product.tags ?? []),
    ],
    alternates: { canonical: `${BASE_URL}/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/products/${slug}`,
      type: "website",
      images: product.mainImage
        ? [{ url: product.mainImage, alt: product.name }]
        : [{ url: "/webmeta.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      title,
      description,
      images: product.mainImage ? [product.mainImage] : ["/webmeta.png"],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch {
    // client component handles not-found state
  }

  if (product) {
    const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category ?? "Natural Product";

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description ?? `Premium ${product.name} from Sri Lanka`,
      image: product.mainImage ?? `${BASE_URL}/webmeta.png`,
      url: `${BASE_URL}/products/${slug}`,
      brand: {
        "@type": "Brand",
        name: "NUVEXA International",
      },
      category: categoryLabel,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        seller: {
          "@type": "Organization",
          name: "NUVEXA International",
          url: BASE_URL,
        },
      },
      ...(product.rating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          bestRating: 5,
          worstRating: 1,
          ratingCount: 1,
        },
      }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Products", item: `${BASE_URL}/products` },
        { "@type": "ListItem", position: 3, name: categoryLabel, item: `${BASE_URL}/products?category=${product.category}` },
        { "@type": "ListItem", position: 4, name: product.name, item: `${BASE_URL}/products/${slug}` },
      ],
    };

    return (
      <>
        <SchemaOrg schema={productSchema} />
        <SchemaOrg schema={breadcrumbSchema} />
        <ProductDetailClient />
      </>
    );
  }

  return <ProductDetailClient />;
}
