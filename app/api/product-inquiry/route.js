import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

// Saves a product-specific inquiry to Firestore
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, productName, productSlug } = body;

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

    const docRef = await addDoc(collection(db, "inquiries"), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      productName: productName?.trim() || "",
      productSlug: productSlug?.trim() || "",
      type: "product-inquiry",
      status: "new",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been received. We will get back to you shortly.",
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
