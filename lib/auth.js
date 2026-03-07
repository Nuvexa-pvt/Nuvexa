import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
}

export async function logOut() {
  await signOut(auth);
}
