import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";
import { sendNotificationEmails } from "@/lib/notifications";

// Saves a contact inquiry to Firestore and returns success/error
export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, phone, company, country, message } = body;

    // Basic field validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Save inquiry to Firestore
    const inquiryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      company: company?.trim() || "",
      country: country?.trim() || "",
      message: message.trim(),
      status: "new",           // for backend dashboard filtering
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "inquiries"), inquiryData);

    // Notify all registered emails — awaited so Vercel doesn't kill it before it sends
    await sendNotificationEmails("inquiry", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      company: company?.trim() || "",
      country: country?.trim() || "",
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been received. We will get back to you shortly.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
