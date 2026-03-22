import { getBlogBySlug } from "@/lib/blog";
import BlogDetailClient from "./BlogDetailClient";
import SchemaOrg from "@/components/SchemaOrg";

const BASE_URL = "https://www.nuvexainternational.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let blog = null;
  try {
    blog = await getBlogBySlug(slug);
  } catch {
    // fall through to defaults
  }

  if (!blog) {
    return {
      title: "Article Not Found",
      description: "This article could not be found. Browse our blog for insights on Sri Lankan natural products and export trade.",
    };
  }

  const title = blog.title;
  const description = blog.excerpt
    ?? (blog.content ? blog.content.replace(/<[^>]+>/g, "").slice(0, 155) + "…" : `Read "${blog.title}" on the Nuvexa International blog — insights on Sri Lankan natural products and export trade.`);

  return {
    title,
    description,
    keywords: [
      ...(blog.tags ?? []),
      "Sri Lanka", "Ceylon", "natural products", "export", "blog",
      "Nuvexa International",
    ],
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt ?? blog.createdAt,
      authors: blog.author ? [blog.author] : undefined,
      tags: blog.tags,
      images: blog.coverImage
        ? [{ url: blog.coverImage, alt: blog.title }]
        : [{ url: "/webmeta.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : ["/webmeta.png"],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  let blog = null;

  try {
    blog = await getBlogBySlug(slug);
  } catch {
    // client component handles not-found state
  }

  if (blog) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blog.title,
      description: blog.excerpt ?? "",
      image: blog.coverImage ?? `${BASE_URL}/webmeta.png`,
      url: `${BASE_URL}/blog/${slug}`,
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt ?? blog.createdAt,
      author: {
        "@type": "Person",
        name: blog.author ?? "NUVEXA International",
      },
      publisher: {
        "@type": "Organization",
        name: "NUVEXA International",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/blog/${slug}`,
      },
      keywords: (blog.tags ?? []).join(", "),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: blog.title, item: `${BASE_URL}/blog/${slug}` },
      ],
    };

    return (
      <>
        <SchemaOrg schema={articleSchema} />
        <SchemaOrg schema={breadcrumbSchema} />
        <BlogDetailClient />
      </>
    );
  }

  return <BlogDetailClient />;
}
