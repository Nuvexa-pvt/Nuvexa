"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowDown01Icon } from "hugeicons-react";

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        titleRef.current,
        { y: 80, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          buttonsRef.current.children,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.5)" },
          "-=0.5"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );

      // Floating scroll indicator animation
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      aria-label="Hero section"
      className="relative w-full h-screen min-h-[700px] max-h-[1080px] overflow-hidden"
    >
      {/* Background Image with Premium Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/herobg.png"
          alt="Premium Sri Lankan Natural Products - Cinnamon, Tea, and Spices"
          fill
          className="object-cover object-center scale-105"
          priority
          quality={100}
          sizes="100vw"
        />
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#083865]/20 via-transparent to-[#083865]/20" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-20 lg:bottom-16 z-10 left-0 right-0 flex flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-12">
        {/* Premium Badge */}
        {/* <div className="mb-6 opacity-0" style={{ opacity: 1 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Premium Export Partner Since 2024
          </span>
        </div> */}

        <h1
          ref={titleRef}
          className="heading-cambay text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-[1.05] max-w-[1100px] mx-auto opacity-0 drop-shadow-2xl"
        >
          Delivering Sri Lanka's Trusted Natural Products
          <span className="block text-white/90">to the Global Market</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-white/85 text-sm sm:text-base lg:text-lg xl:text-xl max-w-[700px] mx-auto leading-relaxed tracking-wide opacity-0 font-light"
        >
          An export-focused company sourcing high-quality food, beverage, and wellness products from Sri Lanka's most trusted producers.
        </p>

        {/* Premium CTA Buttons */}
        <div
          ref={buttonsRef}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5"
          role="group"
          aria-label="Call to action buttons"
        >
          <a
            href="#products"
            className="group relative px-8 sm:px-10 py-3.5 bg-white text-[#083865] rounded-xl text-base font-semibold transition-all duration-500 hover:bg-[#083865] hover:text-white hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 opacity-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="View our products"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              View Products
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#083865] to-[#1361A9] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
          <a
            href="#footer"
            className="group relative px-8 sm:px-10 py-3.5 border-2 border-white/80 backdrop-blur-sm rounded-xl text-white text-base font-semibold transition-all duration-500 hover:bg-white/15 hover:border-white hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 opacity-0 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Send an inquiry"
          >
            Send an Inquiry
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-white/60 text-xs tracking-widest uppercase font-light">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </div> */}
    </section>
  );
}
