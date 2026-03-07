"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu01Icon, Cancel01Icon, ArrowDown01Icon } from "hugeicons-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { CATEGORIES } from "@/lib/productsData";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Products", href: "/products", hasDropdown: true },
  { name: "Blog", href: "/blog" },
  { name: "Contact us", href: "/contact" },
];

// Static fallback (all except "all")
const FALLBACK_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

// Module-level cache so we only fetch once per session
let _categoryCache = null;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const pathname = usePathname();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const backdropRef = useRef(null);
  const dropdownTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out", delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Animate backdrop
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      // Animate menu
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    if (mobileMenuRef.current && backdropRef.current) {
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setIsMobileMenuOpen(false),
      });
    } else {
      setIsMobileMenuOpen(false);
    }
  }, []);

  const openProducts = useCallback(() => {
    clearTimeout(dropdownTimeout.current);
    setIsProductsOpen(true);
  }, []);

  const closeProducts = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => setIsProductsOpen(false), 160);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProductsOpen(false);
  }, [pathname]);

  // Fetch categories from Firestore once (module-level cache)
  useEffect(() => {
    if (_categoryCache) {
      setCategories(_categoryCache);
      return;
    }
    getDocs(collection(db, "categories"))
      .then((snap) => {
        if (!snap.empty) {
          const items = snap.docs
            .map((d) => ({ id: d.data().id, label: d.data().label }))
            .filter((c) => c.id && c.label);
          if (items.length > 0) {
            _categoryCache = items;
            setCategories(items);
          }
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className={`fixed left-0 right-0 mx-auto z-50 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-200px)] max-w-[1600px] transition-all duration-500 ${
          isScrolled 
            ? "top-4 shadow-[0_8px_32px_-8px_rgba(8,56,101,0.15)]" 
            : "top-5 sm:top-7"
        }`}
      >
        <div className={`glass-effect rounded-2xl px-5 sm:px-8 lg:px-10 py-4 lg:py-5 flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "bg-white/80" : "bg-white/60"
        }`}>
          {/* Logo */}
          <Link 
            href="/" 
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 rounded-lg"
            aria-label="NUVEXA International - Go to homepage"
          >
            <Image
              src="/logo.png"
              alt="NUVEXA International"
              width={125}
              height={36}
              className="h-8 sm:h-9 lg:h-[38px] w-auto object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href.split("#")[0].length > 1);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={openProducts}
                    onMouseLeave={closeProducts}
                  >
                    {/* Trigger link */}
                    <Link
                      href={link.href}
                      className={`relative text-sm xl:text-base leading-[1.21] font-medium transition-all duration-300 hover:text-[#083865] focus:outline-none focus:text-[#083865] group flex items-center gap-1.5 ${
                        isActive ? "text-[#083865]" : "text-[#111827]/80"
                      }`}
                    >
                      {link.name}
                      <ArrowDown01Icon
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${isProductsOpen ? "rotate-180" : "rotate-0"}`}
                      />
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#083865] to-[#1361A9] transition-all duration-300 rounded-full ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`} />
                    </Link>

                    {/* Dropdown panel — always mounted, toggled by opacity/pointer-events */}
                    <div
                      onMouseEnter={openProducts}
                      onMouseLeave={closeProducts}
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[260px] transition-all duration-200 ease-out origin-top ${
                        isProductsOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                          : "opacity-0 translate-y-3 pointer-events-none scale-[0.98]"
                      }`}
                      role="menu"
                      aria-label="Product categories"
                    >
                      {/* Arrow pointer */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-[#e8ecf0] rotate-45 rounded-tl-sm shadow-none" />

                      <div className="bg-white/98 backdrop-blur-xl rounded-2xl border border-[#e8ecf0] shadow-[0_20px_60px_-15px_rgba(8,56,101,0.18)] overflow-hidden">
                        {/* Header */}
                        <div className="px-5 pt-5 pb-3 border-b border-[#f0f4f8]">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#083865]/50">
                            Browse Categories
                          </span>
                        </div>

                        {/* Text-only category list */}
                        <div className="p-2.5" role="none">
                          {categories.map((cat, i) => (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.id}`}
                              role="menuitem"
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#083865]/5 group/item focus:outline-none focus:ring-2 focus:ring-[#083865]/20"
                            >
                              <span className="text-sm font-medium text-[#374151] group-hover/item:text-[#083865] transition-colors duration-200">
                                {cat.label}
                              </span>
                              <svg
                                className="w-3.5 h-3.5 text-[#d1d5db] group-hover/item:text-[#083865] group-hover/item:translate-x-0.5 transition-all duration-200"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ))}
                        </div>

                        {/* View all footer */}
                        <div className="px-4 pb-4 pt-1">
                          <Link
                            href="/products"
                            role="menuitem"
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#083865]/5 to-[#1361A9]/5 border border-[#083865]/10 text-[#083865] text-sm font-semibold transition-all duration-200 hover:from-[#083865]/10 hover:to-[#1361A9]/10 hover:border-[#083865]/20 group/all focus:outline-none focus:ring-2 focus:ring-[#083865]/20"
                          >
                            <span>View all products</span>
                            <svg className="w-4 h-4 transition-transform duration-200 group-hover/all:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm xl:text-base leading-[1.21] font-medium transition-all duration-300 hover:text-[#083865] focus:outline-none focus:text-[#083865] group ${
                    isActive ? "text-[#083865]" : "text-[#111827]/80"
                  }`}
                >
                  {link.name}
                  {/* Underline indicator */}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#083865] to-[#1361A9] transition-all duration-300 rounded-full ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            })}
          </div>

          {/* CTA Button - Desktop */}
          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 bg-[#083865] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2"
          >
            Get Quote
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Mobile: Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="cursor-pointer lg:hidden p-2.5 text-[#111827] hover:text-[#083865] hover:bg-[#083865]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu01Icon size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-0 right-0 h-full w-[300px] sm:w-[340px] bg-white z-50 shadow-2xl lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Image
                src="/logo.png"
                alt="NUVEXA International"
                width={100}
                height={29}
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={closeMobileMenu}
                className="cursor-pointer p-2 text-[#111827] hover:text-[#083865] hover:bg-[#083865]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
                aria-label="Close navigation menu"
              >
                <Cancel01Icon size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-6">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href.split("#")[0].length > 1);

                  if (link.hasDropdown) {
                    return (
                      <div key={link.name}>
                        {/* Products accordion trigger */}
                        <button
                          onClick={() => setIsMobileProductsOpen((v) => !v)}
                          className={`cursor-pointer w-full flex items-center justify-between text-lg font-medium py-3.5 px-4 rounded-xl transition-all duration-300 ${
                            isActive
                              ? "text-[#083865] bg-[#083865]/5"
                              : "text-[#111827] hover:text-[#083865] hover:bg-[#083865]/5"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#083865]" />}
                            {link.name}
                          </span>
                          <ArrowDown01Icon
                            className={`w-4 h-4 transition-transform duration-300 ${isMobileProductsOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </button>

                        {/* Sub-categories slide-down */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-out ${
                            isMobileProductsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-4 pl-4 border-l-2 border-[#083865]/10 py-1.5 flex flex-col gap-0.5">
                            {categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/products?category=${cat.id}`}
                                onClick={closeMobileMenu}
                                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 text-[#4b5563] hover:text-[#083865] hover:bg-[#083865]/5 group/mitem"
                              >
                                <span>{cat.label}</span>
                                <svg className="w-3.5 h-3.5 text-[#d1d5db] group-hover/mitem:text-[#083865] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            ))}
                            <Link
                              href="/products"
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold text-[#083865] hover:bg-[#083865]/5 transition-all duration-200 mt-1"
                            >
                              View all products →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 text-lg font-medium py-3.5 px-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "text-[#083865] bg-[#083865]/5"
                          : "text-[#111827] hover:text-[#083865] hover:bg-[#083865]/5"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#083865]" />
                      )}
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer CTA */}
            <div className="p-6 border-t border-gray-100">
              <a
                href="/contact"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#083865] text-white text-base font-semibold rounded-xl transition-all duration-300 hover:bg-[#1361A9] focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
              >
                Get Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="text-center text-[#737373] text-xs mt-4">
                Premium Export Partner
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
