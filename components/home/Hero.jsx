"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          buttonsRef.current.children,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1080px] overflow-hidden pb-0"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/herobg.png"
          alt="Sri Lankan Natural Products"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-15 z-10 left-0 right-0 flex flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-12 pt-24">
        <h1
          ref={titleRef}
          className="heading-cambay text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] leading-[1.1] max-w-[1000px] mx-auto opacity-0"
        >
          Delivering Sri Lanka's trusted
          natural products
          to the global market
        </h1>

        <p
          ref={subtitleRef}
          className=" text-white/90 text-sm sm:text-base lg:text-lg  max-w-[800px] mx-auto leading-relaxed tracking-wide opacity-0 font-light"
        >
          An export-focused company sourcing high-quality food, beverage, and wellness products
          <span className="md:hidden"> </span>
          from Sri Lanka's most trusted producers.
        </p>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#products"
            className="group relative px-8 sm:px-10 py-3 border-2 border-white rounded-xl text-white text-base font-medium transition-all duration-300 hover:bg-white hover:text-[#111827] opacity-0"
          >
            View Products
          </a>
          <a
            href="#footer"
            className="group relative px-8 sm:px-10 py-3 border-2 border-white rounded-xl text-white text-base font-medium transition-all duration-300 hover:bg-white hover:text-[#111827] opacity-0"
          >
            Send an Inquiry
          </a>
        </div>
      </div>
    </section>
  );
}
