"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────

const whatWeDo = [
  "Source export-ready products from trusted producers",
  "Ensure quality, certifications, and compliance",
  "Market and distribute products internationally",
  "Support brand and private-label export opportunities",
];

const howWeDoIt = [
  "Partnering with certified manufacturers",
  "Maintaining strict quality assurance processes",
  "Aligning with international export regulations",
  "Building long-term supplier and buyer relationships",
];

const stats = [
  { value: "50+", label: "Products Exported" },
  { value: "15+", label: "Countries Reached" },
  { value: "100%", label: "Quality Assured" },
  { value: "2024", label: "Founded" },
];

// ─── Sub-components ────────────────────────────────────────────────────────

// Props: { items: string[], color?: string }
function CheckList({ items }) {
  return (
    <ul className="space-y-3 sm:space-y-4" role="list">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#083865]/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-3 h-3 text-[#083865]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span className="text-[#374151] text-sm sm:text-base leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const whoRef = useRef(null);
  const whatRef = useRef(null);
  const howRef = useRef(null);
  const brandRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        heroContentRef.current,
        { y: 60, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out", delay: 0.3 }
      );

      // Who We Are section
      gsap.fromTo(
        whoRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: whoRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // What & How sections stagger
      gsap.fromTo(
        [whatRef.current, howRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.2,
          scrollTrigger: { trigger: whatRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Brand section
      gsap.fromTo(
        brandRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: brandRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Story section
      gsap.fromTo(
        storyRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: storyRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Stats counter effect
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.5)",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      }

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}

      {/* ── Who We Are ───────────────────────────────────────────────── */}
      <section
        ref={whoRef}
        aria-labelledby="who-heading"
        className="relative w-full py-20 sm:py-24 lg:py-24 overflow-hidden mt-20"
      >
        {/* Subtle pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <Image src="/dark pattern.svg" alt="" fill className="object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/90" />
        </div>

        <div className="container-custom section-padding relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 xl:gap-28">
            {/* Image panel */}
            <div className="w-full max-w-[400px] lg:max-w-[500px] flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-[#083865]/8 to-[#1361A9]/8 rounded-3xl -z-10 rotate-1" />
                <div className="relative p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#083865]/10 shadow-[0_12px_48px_-8px_rgba(8,56,101,0.12)]">
                  <Image
                    src="/logo.png"
                    alt="Nuvexa International"
                    width={663}
                    height={191}
                    className="w-full h-auto"
                  />
                  {/* Decorative tag */}
                  <div className="mt-8 p-4 bg-[#083865]/5 rounded-xl border border-[#083865]/10">
                    <p className="text-[#083865] text-xs sm:text-sm font-medium tracking-wide uppercase text-center">
                      Sri Lanka's Trusted Export Partner
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 max-w-[640px]">
              <span className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-4">
                Who We Are
              </span>
              <h2
                id="who-heading"
                className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] leading-tight mb-3"
              >
                Nuvexa International
              </h2>
              <div className="w-14 h-[3px] bg-gradient-to-r from-[#083865] to-[#1361A9] mb-7 rounded-full" aria-hidden="true" />
              <p className="text-[#111827] text-base lg:text-lg leading-[1.85] mb-5">
                Nuvexa International (Pvt) Ltd is an export company based in Sri Lanka,
                focused on bringing high-quality Sri Lankan products to international markets.
              </p>
              <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
                We act as the bridge between reliable local manufacturers and global buyers,
                ensuring that every product meets the strictest standards of quality, compliance,
                and authenticity before reaching its destination.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <div className="bg-[#083865] py-8 sm:py-10">
        <div
          ref={statsRef}
          className="container-custom section-padding grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          role="list"
          aria-label="Key statistics"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              role="listitem"
              className="flex flex-col items-center text-center"
            >
              <span className="heading-cambay text-white text-3xl sm:text-4xl lg:text-5xl leading-none">
                {stat.value}
              </span>
              <span className="mt-2 text-white/60 text-xs sm:text-sm tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>


      {/* ── What We Do & How We Do It ─────────────────────────────────── */}
      <section
        aria-labelledby="operations-heading"
        className="relative w-full py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-[#f8f9fa] to-white"
      >
        <h2 id="operations-heading" className="sr-only">Our Operations</h2>
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* What We Do */}
            <article
              ref={whatRef}
              className="group relative bg-white rounded-2xl p-8 sm:p-10 border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.1)] hover:border-[#083865]/15 transition-all duration-500"
              aria-labelledby="what-heading"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#083865]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true" />
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#083865]/8 flex items-center justify-center mb-6 group-hover:bg-[#083865]/12 transition-colors duration-300">
                <svg className="w-7 h-7 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xs tracking-[0.2em] uppercase text-[#083865]/50 font-medium">What We Do</span>
              <h3 id="what-heading" className="heading-cambay text-[#083865] text-xl sm:text-2xl lg:text-3xl mt-2 mb-5">
                Our Services
              </h3>
              <CheckList items={whatWeDo} />
            </article>

            {/* How We Do It */}
            <article
              ref={howRef}
              className="group relative bg-white rounded-2xl p-8 sm:p-10 border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.1)] hover:border-[#083865]/15 transition-all duration-500"
              aria-labelledby="how-heading"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#083865]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true" />
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#083865]/8 flex items-center justify-center mb-6 group-hover:bg-[#083865]/12 transition-colors duration-300">
                <svg className="w-7 h-7 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs tracking-[0.2em] uppercase text-[#083865]/50 font-medium">How We Do It</span>
              <h3 id="how-heading" className="heading-cambay text-[#083865] text-xl sm:text-2xl lg:text-3xl mt-2 mb-5">
                Our Process
              </h3>
              <CheckList items={howWeDoIt} />
            </article>
          </div>
        </div>
      </section>

      {/* ── Our Brand ─────────────────────────────────────────────────── */}
      <section
        ref={brandRef}
        aria-labelledby="brand-heading"
        className="relative w-full py-20 sm:py-24 lg:py-32 overflow-hidden bg-[#083865]"
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <Image src="/dark pattern.svg" alt="" fill className="object-cover" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#083865] via-[#0d4a7a] to-[#083865]" />

        <div className="container-custom section-padding relative z-10">
          <div className="max-w-[800px] mx-auto text-center">
            <span className="inline-block text-xs sm:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-4">
              Our Brand
            </span>
            <h2
              id="brand-heading"
              className="heading-cambay text-white text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] leading-tight mb-6"
            >
              What Nuvexa Represents
            </h2>
            <div className="w-14 h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8 rounded-full" aria-hidden="true" />
            <p className="text-white/75 text-base sm:text-lg lg:text-xl leading-[1.85] mb-6">
              Nuvexa International represents <strong className="text-white font-semibold">reliability, transparency, and consistency</strong> in exports. 
              We do not mass-produce products; instead, we carefully curate and represent brands and producers who meet global standards.
            </p>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Every product that carries our name has been vetted through a rigorous process to ensure it meets the highest 
              standards expected by international buyers.
            </p>

            {/* Brand pillars */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6" role="list" aria-label="Brand values">
              {[
                { title: "Reliability", desc: "Consistent delivery and dependable partnerships across every transaction." },
                { title: "Transparency", desc: "Clear communication and full traceability from source to destination." },
                { title: "Consistency", desc: "Maintaining the same high standards with every shipment, every time." },
              ].map((pillar) => (
                <div
                  key={pillar.title}
                  role="listitem"
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center hover:bg-white/8 hover:border-white/20 transition-all duration-300"
                >
                  <h3 className="heading-cambay text-white text-lg sm:text-xl mb-3">{pillar.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      <section
        ref={storyRef}
        aria-labelledby="story-heading"
        className="relative w-full py-20 sm:py-24 lg:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <Image src="/dark pattern.svg" alt="" fill className="object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80" />
        </div>

        <div className="container-custom section-padding relative z-10">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs sm:text-sm tracking-[0.25em] uppercase text-[#083865]/50 font-medium mb-4">
                Our Story
              </span>
              <h2
                id="story-heading"
                className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] leading-tight mb-4"
              >
                How We Started
              </h2>
              <div className="w-14 h-[3px] bg-gradient-to-r from-[#083865] to-[#1361A9] mx-auto rounded-full" aria-hidden="true" />
            </div>

            {/* Timeline-style story */}
            <div className="relative pl-8 border-l-2 border-[#083865]/15 space-y-10">
              {/* Origin */}
              <div className="relative">
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#083865] border-4 border-white shadow-md" aria-hidden="true" />
                <span className="text-xs tracking-widest uppercase text-[#1361A9] font-medium">The Beginning</span>
                <h3 className="heading-cambay text-[#083865] text-lg sm:text-xl mt-1 mb-3">Founded with Purpose</h3>
                <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
                  Founded with the vision of expanding Sri Lanka's export presence, Nuvexa International was established 
                  to help local producers reach international markets while maintaining product integrity and authenticity.
                </p>
              </div>

              {/* Mission */}
              <div className="relative">
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#1361A9] border-4 border-white shadow-md" aria-hidden="true" />
                <span className="text-xs tracking-widest uppercase text-[#1361A9] font-medium">Our Drive</span>
                <h3 className="heading-cambay text-[#083865] text-lg sm:text-xl mt-1 mb-3">The Mission Forward</h3>
                <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
                  We continue to grow our network of certified producers, expand into new markets, and champion 
                  Sri Lankan excellence on the world stage — one shipment at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        aria-labelledby="cta-heading"
        className="relative w-full py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-white"
      >
        <div className="container-custom section-padding">
          <div className="relative max-w-[700px] mx-auto text-center bg-white rounded-3xl p-10 sm:p-14 border border-[#083865]/10 shadow-[0_8px_48px_-12px_rgba(8,56,101,0.12)]">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#083865] to-transparent rounded-full" aria-hidden="true" />
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-[#083865]/50 font-medium mb-4">
              Get In Touch
            </span>
            <h2 id="cta-heading" className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl mb-4 leading-tight">
              Ready to Partner With Us?
            </h2>
            <p className="text-[#737373] text-sm sm:text-base leading-relaxed mb-8 max-w-[480px] mx-auto">
              Whether you're a buyer looking for premium Sri Lankan products or a producer seeking international markets, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#083865] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 min-h-11"
                aria-label="Send us an inquiry"
              >
                Send an Inquiry
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#083865]/20 text-[#083865] text-sm font-semibold rounded-xl transition-all duration-300 hover:border-[#083865] hover:bg-[#083865]/5 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 min-h-11"
                aria-label="View our products"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
