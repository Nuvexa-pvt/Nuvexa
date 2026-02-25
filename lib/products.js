import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { SAMPLE_PRODUCTS } from "./productsData";

// ─── Fetch all products ────────────────────────────────────────────────────
export async function getAllProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    if (snapshot.empty) return SAMPLE_PRODUCTS;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Firestore unavailable, using static product data:", err?.message);
    return SAMPLE_PRODUCTS;
  }
}

// ─── Fetch a single product by slug ───────────────────────────────────────
export async function getProductBySlug(slug) {
  try {
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch {
    return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

// ─── Fetch related products (same category, excluding current) ────────────
export async function getRelatedProducts(category, excludeSlug, max = 4) {
  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snapshot = await getDocs(q);
    const related = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, max);
    if (related.length === 0) {
      return SAMPLE_PRODUCTS.filter(
        (p) => p.category === category && p.slug !== excludeSlug
      ).slice(0, max);
    }
    return related;
  } catch {
    return SAMPLE_PRODUCTS.filter(
      (p) => p.category === category && p.slug !== excludeSlug
    ).slice(0, max);
  }
}
