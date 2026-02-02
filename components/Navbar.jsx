"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";

const navLinks = [
  { name: "Home", href: "#", active: true },
  { name: "About us", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Quality Assurance", href: "#qualities" },
  { name: "News", href: "#stories" },
  { name: "Contact us", href: "#footer" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );
    }
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 mx-auto z-50 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-266px)] max-w-[1654px] transition-all duration-300 ${
          isScrolled ? "top-4" : "top-5 sm:top-7"
        }`}
      >
        <div className="glass-effect rounded-[13px] px-5 sm:px-8 lg:px-9 py-4 lg:py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="NUVEXA International"
              width={125}
              height={36}
              className="h-8 sm:h-9 lg:h-[36px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-[48px]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base leading-[1.21] font-normal transition-colors duration-200 hover:text-[#1361A9] ${
                  link.active ? "text-[#1361A9]" : "text-[#111827]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#111827] hover:text-[#1361A9] transition-colors"
            aria-label="Open menu"
          >
            <Menu01Icon size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl lg:hidden transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Image
              src="/logo.png"
              alt="NUVEXA International"
              width={100}
              height={29}
              className="h-7 w-auto object-contain"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#111827] hover:text-[#1361A9] transition-colors"
              aria-label="Close menu"
            >
              <Cancel01Icon size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium py-2 border-b border-gray-100 transition-colors duration-200 hover:text-[#1361A9] ${
                  link.active ? "text-[#1361A9]" : "text-[#111827]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
