"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { CATEGORY_LABELS } from "@/lib/productsData";
import {
  ShoppingBag01Icon,
  Delete02Icon,
  MinusSignIcon,
  PlusSignIcon,
  ArrowRight01Icon,
  ShoppingCart01Icon,
} from "hugeicons-react";

function CartItem({ item, onUpdateQty, onRemove }) {
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;

  return (
    <div className="flex gap-4 sm:gap-5 py-5 border-b border-[#e5e7eb] last:border-0 group">
      {/* Thumbnail */}
      <Link
        href={item.slug ? `/products/${item.slug}` : "/products"}
        className="flex-shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#f8fafc] border border-[#e5e7eb] transition-all duration-300 hover:shadow-md"
        aria-label={`View ${item.name}`}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[#083865]/60 text-[10px] font-semibold uppercase tracking-widest">
              {categoryLabel}
            </span>
            <Link
              href={item.slug ? `/products/${item.slug}` : "/products"}
              className="block heading-cambay text-[#111827] text-sm sm:text-base mt-0.5 hover:text-[#083865] transition-colors duration-200 leading-tight"
            >
              {item.name}
            </Link>
          </div>

          {/* Remove */}
          <button
            onClick={() => {
              onRemove(item.id);
              toast.success(`${item.name} removed from cart`);
            }}
            className="flex-shrink-0 p-1.5 text-[#9ca3af] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300/50"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Delete02Icon className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-0" role="group" aria-label="Quantity">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-l-lg border border-[#e5e7eb] text-[#737373] hover:text-[#083865] hover:border-[#083865]/30 hover:bg-[#083865]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#083865]/20"
              aria-label="Decrease quantity"
            >
              <MinusSignIcon className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 h-8 flex items-center justify-center border-y border-[#e5e7eb] bg-white text-sm font-semibold text-[#111827]" aria-live="polite">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-r-lg border border-[#e5e7eb] text-[#737373] hover:text-[#083865] hover:border-[#083865]/30 hover:bg-[#083865]/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#083865]/20"
              aria-label="Increase quantity"
            >
              <PlusSignIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[#9ca3af] text-xs">
            Qty: {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart, isHydrated } = useCart();

  const heroRef = useRef(null);

  useEffect(() => {
    if (isHydrated && heroRef.current) {
      gsap.set(heroRef.current, { opacity: 0, y: 20 });
      gsap.to(heroRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
    }
  }, [isHydrated]);

  const handleBulkInquiry = () => {
    const names = cartItems.map((i) => `${i.quantity}x ${i.name}`).join(", ");
    const message = encodeURIComponent(`Hi, I'd like to inquire about bulk pricing for the following products: ${names}. Please provide more details.`);
    window.location.href = `/contact?message=${message}`;
  };

  return (
    <>
      <Navbar />

      <main>
        {/* ── Sub-page Header ── */}
        <div className="bg-gradient-to-br from-[#051e36] to-[#083865] pt-24 sm:pt-34 pb-10 sm:pb-8">
          <div className="container-custom section-padding" ref={heroRef}>
            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag01Icon className="w-6 h-6 text-white/60" aria-hidden="true" />
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Cart</span>
            </div>
            <h1 className="heading-cambay text-white text-3xl sm:text-4xl lg:text-5xl mb-2">
              Your Cart
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              {isHydrated
                ? cartCount === 0
                  ? "Your cart is empty"
                  : `${cartCount} item${cartCount !== 1 ? "s" : ""} ready to inquire`
                : "Loading your cart…"}
            </p>
          </div>
        </div>

        {/* ── Cart Content ── */}
        <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Cart contents">
          <div className="container-custom section-padding">

            {!isHydrated ? (
              /* Hydration skeleton */
              <div className="max-w-3xl mx-auto space-y-5 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-5 border-b border-[#e5e7eb]">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                      <div className="h-5 bg-gray-100 rounded w-2/3" />
                      <div className="h-8 bg-gray-100 rounded w-28 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#f0f4f8] to-[#e8edf2] flex items-center justify-center mb-6 shadow-inner">
                  <ShoppingCart01Icon className="w-10 h-10 text-[#083865]/25" aria-hidden="true" />
                </div>
                <h2 className="heading-cambay text-[#111827] text-2xl mb-2">Your cart is empty</h2>
                <p className="text-[#737373] text-sm mb-8 leading-relaxed">
                  Browse our premium Sri Lankan products and add items to your cart to create a bulk inquiry.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2"
                >
                  Browse Products
                  <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              /* Cart Layout */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-5xl mx-auto lg:max-w-none">

                {/* Items List */}
                <div className="lg:col-span-8">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="heading-cambay text-[#111827] text-xl">
                      Cart Items ({cartCount})
                    </h2>
                    <button
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                      className="text-xs text-[#9ca3af] hover:text-red-500 font-medium transition-colors duration-200 underline decoration-dotted underline-offset-2 focus:outline-none"
                      aria-label="Remove all items from cart"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 sm:px-6 divide-y divide-[#e5e7eb]" role="list" aria-label="Cart items">
                    {cartItems.map((item) => (
                      <div key={item.id} role="listitem">
                        <CartItem
                          item={item}
                          onUpdateQty={updateQuantity}
                          onRemove={removeFromCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-28">
                    <div className="bg-gradient-to-br from-[#f8fafc] to-[#f0f4f8] rounded-2xl border border-[#e5e7eb] p-6 space-y-5">
                      <h3 className="heading-cambay text-[#111827] text-lg">Order Summary</h3>

                      {/* Items summary */}
                      <div className="space-y-2.5">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-[#4b5563] truncate mr-2 flex-1">{item.name}</span>
                            <span className="text-[#111827] font-medium flex-shrink-0">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-[#e5e7eb] pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#4b5563] text-sm font-medium">Total Items</span>
                          <span className="heading-cambay text-[#111827] text-lg">{cartCount}</span>
                        </div>
                      </div>

                      {/* Inquiry info */}
                      <div className="bg-[#083865]/5 border border-[#083865]/10 rounded-xl p-4">
                        <p className="text-[#374151] text-xs leading-relaxed">
                          <span className="font-semibold text-[#083865]">Inquiry-based ordering.</span> We&apos;ll provide custom pricing for your selected products based on quantity and requirements.
                        </p>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={handleBulkInquiry}
                        className="w-full py-4 bg-gradient-to-r from-[#083865] to-[#1361A9] text-white font-semibold text-sm uppercase tracking-wide rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-[#083865]/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 flex items-center justify-center gap-2.5"
                        aria-label="Send bulk inquiry for all cart items"
                      >
                        Send Bulk Inquiry
                        <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <Link
                        href="/products"
                        className="block text-center text-[#083865] text-sm font-medium hover:text-[#1361A9] transition-colors duration-200"
                      >
                        ← Continue browsing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
