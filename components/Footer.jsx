"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Facebook01Icon, 
  InstagramIcon, 
  Linkedin01Icon, 
  TwitterIcon,
  Mail01Icon,
  Location01Icon,
  Call02Icon
} from "hugeicons-react";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/#products" },
  { name: "Quality Assurance", href: "/#qualities" },
  { name: "News", href: "/#stories" },
  { name: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook01Icon, href: "#", label: "Follow us on Facebook" },
  { icon: InstagramIcon, href: "#", label: "Follow us on Instagram" },
  { icon: Linkedin01Icon, href: "#", label: "Connect on LinkedIn" },
  { icon: TwitterIcon, href: "#", label: "Follow us on Twitter" },
];

export default function Footer() {
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      role="contentinfo"
      className="relative w-full bg-gradient-to-b from-[#0a0a0a] to-black pt-12 sm:pt-20 lg:pt-28 pb-6 sm:pb-10 rounded-t-[32px] sm:rounded-t-[50px] lg:rounded-t-[60px] overflow-hidden"
    >
      {/* Background Pattern - hidden on mobile */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none opacity-15">
        <Image
          src="/dark pattern.svg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Gradient overlays - hidden on mobile */}
      <div className="hidden sm:block absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#083865]/10 to-transparent pointer-events-none" />
      <div className="hidden sm:block absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#1361A9]/5 to-transparent pointer-events-none" />

      <div
        ref={contentRef}
        className="relative z-10 container-custom section-padding"
      >
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 text-center sm:text-left">
            {/* Logo */}
            <Link href="/" className="inline-block mb-4 sm:mb-6 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg">
              <Image
                src="/logo white (1).png"
                alt="NUVEXA International - Premium Export Company"
                width={447}
                height={129}
                className="w-[140px] sm:w-[200px] lg:w-[260px] h-auto mx-auto sm:mx-0"
              />
            </Link>

            {/* Description - hidden on mobile */}
            <p className="hidden sm:block text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-[360px]">
              Delivering Sri Lanka's finest natural products to global markets with trust, quality, and reliability.
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 transition-all duration-300 hover:bg-[#083865] hover:border-[#083865] hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - hidden on mobile */}
          <div className="hidden sm:block lg:col-span-2">
            <h3 className="heading-cambay text-white text-base sm:text-lg mb-6">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/50 text-sm sm:text-base font-medium transition-all duration-300 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 group focus:outline-none focus:text-white"
                >
                  <span className="w-0 h-px bg-white transition-all duration-300 group-hover:w-3" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* About - hidden on mobile */}
          <div className="hidden sm:block lg:col-span-3">
            <h3 className="heading-cambay text-white text-base sm:text-lg mb-6">
              About Us
            </h3>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed">
              Nuvexa International (Pvt) Ltd is a Sri Lanka–based export company delivering premium products to global markets through trusted partnerships, consistent quality, and reliable sourcing.
            </p>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 text-center sm:text-left">
            <h3 className="hidden sm:block heading-cambay text-white text-base sm:text-lg mb-6">
              Get in Touch
            </h3>
            <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-4">
              <a 
                href="mailto:peshala@sunwayhc.com" 
                className="flex items-center gap-2 sm:gap-3 text-white/60 text-sm sm:text-base transition-colors duration-300 hover:text-white group focus:outline-none focus:text-white"
              >
                <Mail01Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#1361A9] group-hover:text-white transition-colors" />
                <span>peshala@sunwayhc.com</span>
              </a>
              <a 
                href="tel:+94773666365" 
                className="flex items-center gap-2 sm:gap-3 text-white/60 text-sm sm:text-base transition-colors duration-300 hover:text-white group focus:outline-none focus:text-white"
              >
                <Call02Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#1361A9] group-hover:text-white transition-colors" />
                <span>(+94) 77 366 6365</span>
              </a>
              {/* Location - hidden on mobile */}
              <div className="hidden sm:flex items-start gap-3 text-white/50 text-sm sm:text-base">
                <Location01Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#1361A9]" />
                <span>No. 33, 1 Lane, Ratmalana, Sri Lanka.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} NUVEXA International (Pvt) Ltd. All rights reserved.
            </p>
            {/* <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-white/40 text-sm hover:text-white transition-colors duration-300 focus:outline-none focus:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-white/40 text-sm hover:text-white transition-colors duration-300 focus:outline-none focus:text-white"
              >
                Terms of Service
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#083865] to-transparent rounded-full" />
    </footer>
  );
}
