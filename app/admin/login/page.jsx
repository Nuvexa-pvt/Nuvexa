"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { signInWithEmail, logOut } from "@/lib/auth";
import { AuthProvider } from "@/lib/authContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function LoginContent() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) { setResetError("Please enter your email address."); return; }
    setResetLoading(true);
    setResetError("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/user-not-found") setResetError("No account found with that email.");
      else if (code === "auth/invalid-email") setResetError("Invalid email address.");
      else setResetError("Failed to send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user && role !== null && role !== undefined) {
      router.replace("/admin");
    }
  }, [user, role, loading, router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSigningIn(true);
    setError("");
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] via-white to-[#e8eef5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#083865] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#737373] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Logged in but awaiting role assignment (role is null)
  if (user && (role === null || role === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] via-white to-[#e8eef5] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="heading-cambay text-2xl text-[#111827] mb-2">Awaiting Access</h1>
          <p className="text-[#737373] mb-2 text-sm">
            Signed in as <span className="font-medium text-[#111827]">{user.email}</span>
          </p>
          <p className="text-[#737373] mb-6 text-sm">
            Your account is pending role assignment. Please contact an administrator.
          </p>
          <button
            onClick={handleSignOut}
            className="cursor-pointer w-full py-3 px-4 bg-[#111827] text-white rounded-xl font-medium text-sm hover:bg-[#1f2937] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] via-white to-[#e8eef5] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Nuvexa"
            className="h-12 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="heading-cambay text-2xl text-center text-[#111827] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-center text-[#737373] text-sm mb-8">
          Sign in to manage your website
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Forgot Password Panel */}
        {forgotMode && (
          <div className="mb-6">
            {resetSent ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-sm font-medium text-emerald-700">Reset link sent!</p>
                <p className="text-xs text-emerald-600 mt-1">Check your inbox at <strong>{resetEmail}</strong> and follow the link to set a new password.</p>
                <button type="button" onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(""); }} className="cursor-pointer mt-3 text-xs text-[#083865] hover:underline">Back to sign in</button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-sm text-[#374151] font-medium">Reset your password</p>
                <p className="text-xs text-[#737373]">Enter your email and we&apos;ll send you a link to reset your password.</p>
                {resetError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{resetError}</p>}
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={resetLoading} className="cursor-pointer flex-1 py-2.5 bg-[#083865] text-white text-sm rounded-xl font-medium hover:bg-[#1361A9] transition-colors disabled:opacity-50">
                    {resetLoading ? "Sending…" : "Send Reset Link"}
                  </button>
                  <button type="button" onClick={() => { setForgotMode(false); setResetError(""); }} className="cursor-pointer px-4 py-2.5 border border-[#e5e7eb] text-sm text-[#374151] rounded-xl hover:bg-[#f8fafc] transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <div className="border-t border-[#e5e7eb] mt-5" />
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-[#e5e7eb] text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#737373] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end -mt-1">
            <button
              type="button"
              onClick={() => { setForgotMode(true); setResetEmail(email); setResetError(""); setResetSent(false); }}
              className="cursor-pointer text-xs text-[#1361A9] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={signingIn}
            className="cursor-pointer w-full py-3 px-4 bg-[#083865] text-white rounded-xl font-semibold text-sm hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {signingIn && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {signingIn ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#737373] text-xs mt-6">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
