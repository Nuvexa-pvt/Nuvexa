import { NextResponse } from "next/server";

function randomPassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pw = "";
  for (let i = 0; i < 16; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw + "!1"; // always meets typical complexity rules
}

export async function POST(request) {
  try {
    const { email, displayName } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    // 1. Create the Firebase Auth user
    const createRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: randomPassword(), returnSecureToken: true }),
      }
    );
    const createData = await createRes.json();

    if (!createRes.ok) {
      const msg = createData.error?.message || "Failed to create account.";
      const friendly = {
        EMAIL_EXISTS: "An account with that email already exists.",
        INVALID_EMAIL: "Invalid email address.",
        OPERATION_NOT_ALLOWED: "Email/password sign-in is disabled in Firebase.",
      };
      return NextResponse.json({ error: friendly[msg] ?? msg }, { status: 400 });
    }

    const uid = createData.localId;
    const idToken = createData.idToken;

    // 2. Set display name if provided (use the user's own token from sign-up)
    if (displayName && idToken) {
      await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, displayName }),
        }
      );
    }

    // 3. Send password reset email so the user can set their own password
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
      }
    );

    return NextResponse.json({ uid });
  } catch (err) {
    console.error("create-user API error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
