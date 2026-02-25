"use client";

import { useEffect, useRef, useState, use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/lib/cartContext";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/productsData";
import { ShoppingCart01Icon, Mail01Icon, ArrowLeft01Icon, CheckmarkCircle01Icon } from "hugeicons-react";

function StarRating({ rating, size = "sm" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${sz} ${i < rating ? "text-[#FFB800] fill-[#FFB800]" : "text-gray-200 fill-gray-200"}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="ml-2 text-[#737373] text-sm">({rating}.0)</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", message: "" });
  const [inquiryStatus, setInquiryStatus] = useState("idle"); // idle | sending | sent | error

  const contentRef = useRef(null);
  const inquiryRef = useRef(null);

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    Promise.all([getProductBySlug(slug)])
      .then(([prod]) => {
        setProduct(prod);
        if (prod) {
          setInquiryForm((f) => ({
            ...f,
            message: `Hi, I'm interested in ${prod.name}. Please provide more details about pricing and availability.`,
          }));
          return getRelatedProducts(prod.category, prod.slug, 4);
        }
        return [];
      })
      .then(setRelatedProducts)
      .finally(() => setLoading(false));
  }, [slug]);

  // Entrance animation
  useEffect(() => {
    if (product && contentRef.current) {
      const els = contentRef.current.querySelectorAll(".anim-in");
      gsap.set(els, { opacity: 0, y: 25 });
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1,
      });
    }
  }, [product]);

  // Inquiry panel animation
  useEffect(() => {
    if (!inquiryRef.current) return;
    if (inquiryOpen) {
      gsap.fromTo(inquiryRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(inquiryRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [inquiryOpen]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id: product.id, slug: product.slug, name: product.name, image: product.mainImage, category: product.category });
    toast.success(`${product.name} added to cart`);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setInquiryStatus("sending");
    try {
      const res = await fetch("/api/product-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiryForm,
          productName: product.name,
          productSlug: product.slug,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setInquiryStatus("sent");
      toast.success("Inquiry sent! We'll be in touch shortly.");
    } catch {
      setInquiryStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const allImages = product ? [product.mainImage, ...(product.images?.filter((img) => img !== product.mainImage) ?? [])] : [];
  const categoryLabel = product ? (CATEGORY_LABELS[product.category] ?? product.category) : "";

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-16">
          <div className="container-custom section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 animate-pulse">
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-square bg-gray-100 rounded-3xl" />
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 space-y-4 pt-2">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-10 bg-gray-100 rounded w-3/4" />
                <div className="h-5 bg-gray-100 rounded w-1/3" />
                <div className="h-24 bg-gray-100 rounded" />
                <div className="h-12 bg-gray-100 rounded-xl mt-4" />
                <div className="h-12 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Not found ──
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 pt-20">
          <div className="w-20 h-20 rounded-2xl bg-[#f0f4f8] flex items-center justify-center mb-5">
            <span className="text-4xl" aria-hidden="true">🌿</span>
          </div>
          <h1 className="heading-cambay text-[#111827] text-2xl sm:text-3xl mb-3">Product not found</h1>
          <p className="text-[#737373] mb-8 max-w-xs">This product may have been removed or the link is incorrect.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] transition-all duration-300"
          >
            <ArrowLeft01Icon className="w-4 h-4" />
            Back to Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main>
        {/* ── Breadcrumb ── */}
        <div className="bg-[#f8fafc] border-b border-[#e5e7eb] pt-24 sm:pt-32 pb-4">
          <div className="container-custom section-padding">
            <nav className="flex items-center gap-2 text-xs text-[#9ca3af]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#083865] transition-colors duration-200">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/products" className="hover:text-[#083865] transition-colors duration-200">Products</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-[#083865] transition-colors duration-200">
                {categoryLabel}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#083865] font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Product Detail ── */}
        <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Product details">
          <div className="container-custom section-padding" ref={contentRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

              {/* Left — Image Gallery */}
              <div className="lg:sticky lg:top-28 anim-in">
                {/* Main Image */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] lg:max-h-[min(440px,52vh)] xl:max-h-[min(500px,56vh)] rounded-3xl overflow-hidden bg-[#f4f6f9] mb-3">
                  <Image
                    src={allImages[activeImage] ?? product.mainImage}
                    alt={`${product.name} — ${categoryLabel}`}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] rounded-3xl pointer-events-none" aria-hidden="true" />
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm text-[#083865] text-[10px] font-bold uppercase tracking-widest border border-[#083865]/8 shadow-sm">
                    {categoryLabel}
                  </span>
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2.5" role="list" aria-label="Product image thumbnails">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        role="listitem"
                        onClick={() => setActiveImage(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          activeImage === idx
                            ? "border-[#083865] shadow-md shadow-[#083865]/15 scale-[1.02]"
                            : "border-transparent hover:border-[#083865]/25 opacity-75 hover:opacity-100"
                        }`}
                        aria-label={`View image ${idx + 1}`}
                        aria-pressed={activeImage === idx}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} view ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Product Info */}
              <div className="space-y-5 lg:pt-1">

                {/* Name + Rating */}
                <div className="anim-in">
                  <h1 className="heading-cambay text-[#111827] text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.1] mb-3">
                    {product.name}
                  </h1>
                  <StarRating rating={product.rating} size="lg" />
                </div>

                {/* Description */}
                <div className="anim-in pt-1">
                  <p className="text-[#4b5563] text-[15px] leading-[1.75]">
                    {product.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e7eb] anim-in" aria-hidden="true" />

                {/* Origin / Quality badges */}
                <div className="grid grid-cols-2 gap-2 anim-in" aria-label="Product attributes">
                  {[
                    "Premium Grade",
                    "Export Quality",
                    "Sri Lanka Origin",
                    "Natural & Pure",
                  ].map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#f4f6f9] border border-[#e5e7eb]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#083865]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <svg className="w-2.5 h-2.5 text-[#083865]" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </span>
                      <span className="text-[#374151] text-[11px] font-semibold uppercase tracking-wide">{tag}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e7eb] anim-in" aria-hidden="true" />

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 anim-in">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-[#083865] text-white font-semibold text-sm uppercase tracking-wide rounded-2xl transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/25 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 flex items-center justify-center gap-2"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart01Icon className="w-4.5 h-4.5" aria-hidden="true" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => setInquiryOpen((v) => !v)}
                    className={`flex-1 py-4 border-2 font-semibold text-sm uppercase tracking-wide rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 flex items-center justify-center gap-2 ${
                      inquiryOpen
                        ? "border-[#083865] bg-[#083865]/5 text-[#083865]"
                        : "border-[#083865]/20 text-[#083865] hover:border-[#083865]/50 hover:bg-[#083865]/4"
                    }`}
                    aria-expanded={inquiryOpen}
                    aria-controls="inquiry-form"
                  >
                    <Mail01Icon className="w-4.5 h-4.5" aria-hidden="true" />
                    {inquiryOpen ? "Close" : "Send Inquiry"}
                  </button>
                </div>

                {/* Inline Inquiry Form */}
                <div
                  ref={inquiryRef}
                  id="inquiry-form"
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                  aria-hidden={!inquiryOpen}
                >
                  {inquiryStatus === "sent" ? (
                    <div className="bg-[#f0fdf4] border border-[#16a34a]/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                      <CheckmarkCircle01Icon className="w-10 h-10 text-[#16a34a]" aria-hidden="true" />
                      <h3 className="heading-cambay text-[#111827] text-lg">Inquiry Sent!</h3>
                      <p className="text-[#4b5563] text-sm">
                        Thank you! We&apos;ll get back to you shortly with pricing and availability details.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleInquirySubmit}
                      className="bg-[#f8fafc] border border-[#e5e7eb] rounded-2xl p-5 sm:p-6 space-y-4"
                      noValidate
                    >
                      <h3 className="heading-cambay text-[#111827] text-base mb-1">Product Inquiry</h3>
                      <div>
                        <label htmlFor="inq-name" className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                          Your Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="inq-name"
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="John Smith"
                          className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="inq-email" className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="inq-email"
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="john@company.com"
                          className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="inq-message" className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                          Message
                        </label>
                        <textarea
                          id="inq-message"
                          rows={4}
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300 resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={inquiryStatus === "sending"}
                        className="w-full py-3.5 bg-[#083865] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#083865]/30 flex items-center justify-center gap-2"
                      >
                        {inquiryStatus === "sending" ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                            Sending…
                          </>
                        ) : (
                          "Send Inquiry"
                        )}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#f8fafc] py-12 sm:py-14 lg:py-16 border-t border-[#e5e7eb]" aria-label="Related products">
            <div className="container-custom section-padding">
              <div className="flex items-end justify-between mb-8 sm:mb-10">
                <div>
                  <span className="text-[#083865]/60 text-xs font-semibold uppercase tracking-widest block mb-2">
                    More from {categoryLabel}
                  </span>
                  <h2 className="heading-cambay text-[#111827] text-2xl sm:text-3xl">
                    Related Products
                  </h2>
                </div>
                <Link
                  href={`/products?category=${product.category}`}
                  className="hidden sm:flex items-center gap-1.5 text-[#083865] text-sm font-semibold hover:gap-2.5 transition-all duration-300"
                >
                  View all {categoryLabel}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard
                    key={rel.id}
                    id={rel.id}
                    slug={rel.slug}
                    name={rel.name}
                    image={rel.mainImage}
                    rating={rel.rating}
                    category={rel.category}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
