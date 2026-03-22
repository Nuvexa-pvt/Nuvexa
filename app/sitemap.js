import { getAllProducts } from "@/lib/products";
import { getAllPublishedBlogs } from "@/lib/blog";

const BASE_URL = "https://www.nuvexainternational.com";

export default async function sitemap() {
  const now = new Date().toISOString();

  // Static routes
  const staticRoutes = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic product routes
  let productRoutes = [];
  try {
    const products = await getAllProducts();
    productRoutes = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch {
    // silently fail — static routes still generate
  }

  // Dynamic blog routes
  let blogRoutes = [];
  try {
    const blogs = await getAllPublishedBlogs();
    blogRoutes = blogs
      .filter((b) => b.slug)
      .map((b) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt ?? b.createdAt ?? now,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    // silently fail
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
