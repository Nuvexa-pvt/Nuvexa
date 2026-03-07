"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext({ user: null, role: null, isAdmin: false, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }

      // Fetch or create user doc in Firestore
      try {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setRole(snap.data().role ?? null);
        } else {
          // First login: create a pending user doc (role: null until admin assigns)
          // But for test@gmail.com, auto-assign admin role
          const defaultRole = u.email === "test@gmail.com" ? "admin" : null;
          await setDoc(userRef, {
            email: u.email,
            displayName: u.displayName || null,
            role: defaultRole,
            createdAt: serverTimestamp(),
          });
          setRole(defaultRole);
        }
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

