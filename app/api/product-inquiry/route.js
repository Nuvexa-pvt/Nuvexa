import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

// Saves a product inquiry (single product or bulk cart quote) to Firestore
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      message,
      // Single-product fields (from product detail page)
      productName,
      productSlug,
      // Bulk-quote fields (from /quote page)
      company,
      phone,
      destination,
      products,    // [{ id, name, quantity, slug, category }]
      isBulk,
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const docData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      type: "product-inquiry",
      status: "new",
      createdAt: serverTimestamp(),
    };

    // Single product inquiry
    if (productName) docData.productName = productName.trim();
    if (productSlug) docData.productSlug = productSlug.trim();

    // Bulk cart quote
    if (isBulk) {
      docData.isBulk = true;
      if (company?.trim()) docData.company = company.trim();
      if (phone?.trim()) docData.phone = phone.trim();
      if (destination?.trim()) docData.destination = destination.trim();
      if (Array.isArray(products) && products.length > 0) {
        docData.products = products.map((p) => ({
          id: p.id ?? "",
          name: p.name ?? "",
          quantity: p.quantity ?? 1,
          slug: p.slug ?? "",
          category: p.category ?? "",
        }));
        // Convenience: summary of product names for admin list view
        docData.productName = products.map((p) => `${p.quantity}x ${p.name}`).join(", ");
      }
    }

    const docRef = await addDoc(collection(db, "inquiries"), docData);

    return NextResponse.json({
      success: true,
      message: "Your quote request has been received. We will get back to you shortly.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Product inquiry submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
