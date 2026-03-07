"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { CATEGORY_LABELS } from "@/lib/productsData";
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  ShoppingCart01Icon,
  ArrowLeft01Icon,
} from "hugeicons-react";

// Inline icon since FileTextIcon isn't exported by this version of hugeicons-react
function QuoteFileIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

const DESTINATIONS = [
  "Australia", "Canada", "China", "France", "Germany", "India", "Italy",
  "Japan", "Netherlands", "New Zealand", "Saudi Arabia", "Singapore",
  "South Korea", "Spain", "Sweden", "United Arab Emirates",
  "United Kingdom", "United States", "Other",
];

function ProductSummaryRow({ item }) {
  const label = CATEGORY_LABELS[item.category] ?? item.category;
  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-[#e5e7eb]/60 last:border-0">
      <div className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-[#f8fafc] border border-[#e5e7eb]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[#083865]/50 text-[9px] font-bold uppercase tracking-widest">{label}</span>
        <p className="text-[#111827] text-sm font-semibold leading-tight truncate mt-0.5">{item.name}</p>
      </div>
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#083865] flex items-center justify-center">
        <span className="text-white text-xs font-bold">×{item.quantity}</span>
      </div>
    </div>
  );
}

export default function QuotePage() {
  const router = useRouter();
  const { cartItems, cartCount, clearCart, isHydrated } = useCart();
  const heroRef = useRef(null);
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    destination: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Redirect to cart if empty after hydration
  useEffect(() => {
    if (isHydrated && cartItems.length === 0 && !submitted) {
      router.replace("/cart");
    }
  }, [isHydrated, cartItems.length, submitted, router]);

  // Entrance animation
  useEffect(() => {
    if (isHydrated && heroRef.current) {
      gsap.set(heroRef.current, { opacity: 0, y: 20 });
      gsap.to(heroRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated && formRef.current) {
      gsap.set(formRef.current, { opacity: 0, y: 30 });
      gsap.to(formRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.25 });
    }
  }, [isHydrated]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) e.message = "Requirements are required.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstField = document.querySelector("[data-error='true']");
      firstField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    const productList = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      slug: item.slug ?? "",
      category: item.category ?? "",
    }));

    const messageWithProducts =
      `Products Requested:\n${productList.map((p) => `• ${p.quantity}x ${p.name}`).join("\n")}\n\nAdditional Requirements:\n${form.message.trim()}`;

    try {
      const res = await fetch("/api/product-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          phone: form.phone.trim(),
          destination: form.destination,
          message: messageWithProducts,
          products: productList,
          isBulk: cartItems.length > 1,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitted(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Navbar />
        <main>
          <div className="min-h-screen bg-gradient-to-br from-[#051e36] to-[#083865] flex items-center justify-center px-6 py-24">
            <div className="w-full max-w-lg">
              <div className="bg-white rounded-3xl p-8 sm:p-10 text-center shadow-[0_32px_80px_-20px_rgba(8,56,101,0.35)]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                  <CheckmarkCircle01Icon className="w-10 h-10 text-white" />
                </div>
                <span className="inline-block text-[10px] font-bold tracking-[0.22em] uppercase text-[#083865]/50 mb-3">
                  Request Received
                </span>
                <h1 className="heading-cambay text-[#111827] text-2xl sm:text-3xl mb-3 leading-tight">
                  Quote Request Sent!
                </h1>
                <p className="text-[#737373] text-sm sm:text-base leading-relaxed mb-8">
                  Thank you for your inquiry. Our team will review your product request and get back to you within <strong className="text-[#083865]">24–48 business hours</strong> with a customised quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 transition-all duration-300"
                  >
                    <ArrowLeft01Icon className="w-4 h-4" />
                    Back to Products
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#e5e7eb] text-[#737373] text-sm font-medium rounded-xl hover:border-[#083865]/30 hover:text-[#083865] transition-all duration-300"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Skeleton / loading ──────────────────────────────────────────────────────
  if (!isHydrated) {
    return (
      <>
        <Navbar />
        <main>
          <div className="bg-gradient-to-br from-[#051e36] to-[#083865] pt-24 sm:pt-34 pb-10" />
          <div className="bg-white py-16">
            <div className="container-custom section-padding">
              <div className="max-w-4xl mx-auto animate-pulse space-y-4">
                <div className="h-8 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-48 bg-gray-100 rounded-2xl mt-6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <main>
        {/* ── Sub-page header ── */}
        <div className="bg-gradient-to-br from-[#051e36] to-[#083865] pt-24 sm:pt-34 pb-10 sm:pb-12">
          <div className="container-custom section-padding" ref={heroRef}>
            <div className="flex items-center gap-3 mb-3">
              <QuoteFileIcon className="w-6 h-6 text-white/60" />
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                  <li>
                    <Link href="/cart" className="text-white/40 hover:text-white/70 transition-colors duration-200">
                      Cart
                    </Link>
                  </li>
                  <li className="text-white/30">›</li>
                  <li className="text-white/60">Quote Request</li>
                </ol>
              </nav>
            </div>
            <h1 className="heading-cambay text-white text-3xl sm:text-4xl lg:text-5xl mb-2">
              Request a Quote
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg leading-relaxed">
              Tell us about your requirements and we&apos;ll prepare a tailored pricing proposal for your selected products.
            </p>

            {/* Items badge */}
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
              <ShoppingCart01Icon className="w-4 h-4 text-white/70" />
              <span className="text-white/80 text-sm font-medium">
                {cartCount} product{cartCount !== 1 ? "s" : ""} in your request
              </span>
            </div>
          </div>
        </div>

        {/* ── Form + Summary ── */}
        <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Quote request form">
          <div className="container-custom section-padding" ref={formRef}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-5xl mx-auto lg:max-w-none">

              {/* ── Form ── */}
              <div className="lg:col-span-7 xl:col-span-8">
                <form onSubmit={handleSubmit} noValidate className="space-y-6">

                  {/* Section: Contact Details */}
                  <div>
                    <h2 className="heading-cambay text-[#111827] text-lg mb-0.5">Your Details</h2>
                    <p className="text-[#9ca3af] text-xs mb-5">We&apos;ll use these to send you the quote.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5"
                        >
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          autoComplete="name"
                          placeholder="Jane Smith"
                          data-error={!!errors.name}
                          className={`w-full px-4 py-3 bg-[#f8fafc] border rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300 ${
                            errors.name ? "border-red-400 bg-red-50/30 focus:ring-red-300/25 focus:border-red-400" : "border-[#e5e7eb]"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5"
                        >
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          autoComplete="email"
                          placeholder="jane@company.com"
                          data-error={!!errors.email}
                          className={`w-full px-4 py-3 bg-[#f8fafc] border rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300 ${
                            errors.email ? "border-red-400 bg-red-50/30 focus:ring-red-300/25 focus:border-red-400" : "border-[#e5e7eb]"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Company */}
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5"
                        >
                          Company / Organisation
                          <span className="ml-1 text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={form.company}
                          onChange={handleChange}
                          autoComplete="organization"
                          placeholder="Acme Imports Ltd."
                          className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5"
                        >
                          Phone Number
                          <span className="ml-1 text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          autoComplete="tel"
                          placeholder="+1 555 000 0000"
                          className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Shipping & Requirements */}
                  <div className="border-t border-[#f0f4f8] pt-6">
                    <h2 className="heading-cambay text-[#111827] text-lg mb-0.5">Order Details</h2>
                    <p className="text-[#9ca3af] text-xs mb-5">Help us tailor the quote to your needs.</p>

                    {/* Destination */}
                    <div className="mb-4">
                      <label
                        htmlFor="destination"
                        className="block text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5"
                      >
                        Shipping Destination
                        <span className="ml-1 text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                      </label>
                      <select
                        id="destination"
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300 cursor-pointer appearance-none"
                      >
                        <option value="">Select a country…</option>
                        {DESTINATIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message / Requirements */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5"
                      >
                        Specific Requirements <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your quantity needs, packaging preferences, certifications required, delivery timelines, or any other details that would help us prepare your quote…"
                        data-error={!!errors.message}
                        className={`w-full px-4 py-3 bg-[#f8fafc] border rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300 resize-none leading-relaxed ${
                          errors.message ? "border-red-400 bg-red-50/30 focus:ring-red-300/25 focus:border-red-400" : "border-[#e5e7eb]"
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <span>⚠</span> {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="cursor-pointer flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#083865] to-[#1361A9] text-white font-semibold text-sm uppercase tracking-wide rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-[#083865]/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 min-w-[200px]"
                    >
                      {submitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>
                          Send Quote Request
                          <ArrowRight01Icon className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <Link
                      href="/cart"
                      className="text-[#083865] text-sm font-medium hover:text-[#1361A9] transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <ArrowLeft01Icon className="w-4 h-4" />
                      Back to cart
                    </Link>
                  </div>

                  {/* Privacy note */}
                  <p className="text-[#9ca3af] text-[11px] leading-relaxed">
                    By submitting this form you agree to our{" "}
                    <Link href="/contact" className="underline underline-offset-2 hover:text-[#083865] transition-colors">
                      privacy policy
                    </Link>
                    . We will never share your information with third parties.
                  </p>
                </form>
              </div>

              {/* ── Products Summary Sidebar ── */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-28">
                  <div className="bg-gradient-to-br from-[#f8fafc] to-[#f0f4f8] rounded-2xl border border-[#e5e7eb] p-6 space-y-5">

                    <div>
                      <h3 className="heading-cambay text-[#111827] text-lg">Products Requested</h3>
                      <p className="text-[#9ca3af] text-xs mt-0.5">{cartCount} item{cartCount !== 1 ? "s" : ""} · prices quoted on request</p>
                    </div>

                    {/* Product list */}
                    <div className="bg-white rounded-xl border border-[#e5e7eb] px-4 py-1 divide-y divide-[#f0f4f8]">
                      {cartItems.map((item) => (
                        <ProductSummaryRow key={item.id} item={item} />
                      ))}
                    </div>

                    {/* Info box */}
                    <div className="bg-[#083865]/5 border border-[#083865]/10 rounded-xl p-4 space-y-2">
                      <p className="text-[#083865] text-xs font-semibold uppercase tracking-wide">What to expect</p>
                      <ul className="space-y-1.5">
                        {[
                          "Custom wholesale pricing per product",
                          "MOQ & bulk discount information",
                          "Delivery & logistics options",
                          "Certifications & compliance docs",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-[#4b5563] leading-relaxed">
                            <span className="text-[#083865] mt-0.5 flex-shrink-0">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Response time */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#e5e7eb]">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 text-sm">⚡</span>
                      </div>
                      <div>
                        <p className="text-[#111827] text-xs font-semibold">Fast response</p>
                        <p className="text-[#9ca3af] text-[11px]">We reply within 24–48 business hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
