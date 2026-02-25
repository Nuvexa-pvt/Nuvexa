"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Contact us", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const backdropRef = useRef(null);

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
            className="lg:hidden p-2.5 text-[#111827] hover:text-[#083865] hover:bg-[#083865]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
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
                className="p-2 text-[#111827] hover:text-[#083865] hover:bg-[#083865]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
                aria-label="Close navigation menu"
              >
                <Cancel01Icon size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-6">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href.split("#")[0].length > 1);
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
