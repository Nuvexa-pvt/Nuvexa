"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useCart } from "@/lib/cartContext";
import { ShoppingCart01Icon } from "hugeicons-react";

export default function FloatingCart() {
  const { cartCount, isHydrated } = useCart();
  const btnRef = useRef(null);
  const badgeRef = useRef(null);
  const [prevCount, setPrevCount] = useState(0);

  // Entrance animation after hydration
  useEffect(() => {
    if (!isHydrated || !btnRef.current) return;
    gsap.fromTo(
      btnRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.6 }
    );
  }, [isHydrated]);

  // Badge pop when count increases
  useEffect(() => {
    if (!badgeRef.current || cartCount === 0) return;
    if (cartCount > prevCount) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.8 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      );
      // Button nudge
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { scale: 1.12 },
          { scale: 1, duration: 0.35, ease: "back.out(2)" }
        );
      }
    }
    setPrevCount(cartCount);
  }, [cartCount]);

  // Don't render before hydration to avoid flash
  if (!isHydrated) return null;

  return (
    <Link
      ref={btnRef}
      href="/cart"
      className="fixed bottom-6 left-6 z-50 group"
      aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? "s" : ""}` : ""}`}
      style={{ opacity: 0 }} // GSAP controls visibility
    >
      {/* Outer glow ring — only when cart has items */}
      {cartCount > 0 && (
        <span
          className="absolute inset-0 rounded-full bg-[#083865]/20 animate-ping"
          aria-hidden="true"
        />
      )}

      {/* Main circle button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#083865] text-white shadow-[0_8px_32px_-4px_rgba(8,56,101,0.45)] transition-all duration-300 group-hover:bg-[#1361A9] group-hover:scale-110 group-hover:shadow-[0_12px_40px_-4px_rgba(8,56,101,0.55)] group-focus-visible:ring-4 group-focus-visible:ring-[#083865]/40 group-focus-visible:ring-offset-2">
        <ShoppingCart01Icon size={22} aria-hidden="true" />

        {/* Count badge */}
        {cartCount > 0 && (
          <span
            ref={badgeRef}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-white text-[#083865] text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-md border border-[#083865]/10"
            aria-hidden="true"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </span>

      {/* Tooltip label */}
      <span
        className="absolute left-16 bottom-3 pointer-events-none whitespace-nowrap px-3 py-1.5 bg-[#111827]/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden="true"
      >
        {cartCount > 0 ? `View cart (${cartCount})` : "Cart is empty"}
      </span>
    </Link>
  );
}
