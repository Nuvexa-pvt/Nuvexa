import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

const BLOGS_COLLECTION = "blogs";

// ─── Fetch all published blogs (newest first) ──────────────────────────────
export async function getAllPublishedBlogs() {
  try {
    const snapshot = await getDocs(collection(db, BLOGS_COLLECTION));
    if (snapshot.empty) return [];
    return snapshot.docs
      .map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? null,
        updatedAt: d.data().updatedAt?.toDate?.() ?? null,
      }))
      .filter((b) => b.published === true)
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  } catch (err) {
    console.warn("Failed to fetch blogs:", err?.message);
    return [];
  }
}

// ─── Fetch a single blog by slug ───────────────────────────────────────────
export async function getBlogBySlug(slug) {
  try {
    const q = query(
      collection(db, BLOGS_COLLECTION),
      where("slug", "==", slug)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return {
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? null,
      updatedAt: d.data().updatedAt?.toDate?.() ?? null,
    };
  } catch (err) {
    console.warn("Failed to fetch blog by slug:", err?.message);
    return null;
  }
}

// ─── Increment blog views ──────────────────────────────────────────────────
export async function incrementBlogViews(blogId) {
  try {
    const ref = doc(db, BLOGS_COLLECTION, blogId);
    await updateDoc(ref, { views: increment(1) });
  } catch (err) {
    console.warn("Failed to increment views:", err?.message);
  }
}

// ─── Increment blog likes ──────────────────────────────────────────────────
export async function incrementBlogLikes(blogId) {
  try {
    const ref = doc(db, BLOGS_COLLECTION, blogId);
    await updateDoc(ref, { likes: increment(1) });
  } catch (err) {
    console.warn("Failed to increment likes:", err?.message);
  }
}

// ─── Fetch recent published blogs ──────────────────────────────────────────
export async function getRecentBlogs(max = 3) {
  try {
    const snapshot = await getDocs(collection(db, BLOGS_COLLECTION));
    if (snapshot.empty) return [];
    return snapshot.docs
      .map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? null,
        updatedAt: d.data().updatedAt?.toDate?.() ?? null,
      }))
      .filter((b) => b.published === true)
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      .slice(0, max);
  } catch (err) {
    console.warn("Failed to fetch recent blogs:", err?.message);
    return [];
  }
}
