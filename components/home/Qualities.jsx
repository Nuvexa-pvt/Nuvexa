"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, ShieldCheck, Search, Handshake } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const qualities = [
  { 
    id: 1, 
    name: "Ethical Sourcing", 
    icon: Leaf,
    description: "Direct partnerships with farmers ensuring fair trade practices and sustainable agriculture."
  },
  { 
    id: 2, 
    name: "Quality & Compliance", 
    icon: ShieldCheck,
    description: "Meeting international standards with rigorous quality checks and certifications."
  },
  { 
    id: 3, 
    name: "Full Transparency", 
    icon: Search,
    description: "Complete traceability from farm to your facility with detailed documentation."
  },
  { 
    id: 4, 
    name: "Lasting Partnerships", 
    icon: Handshake,
    description: "Building enduring relationships with trust, reliability, and mutual growth."
  },
];

export default function Qualities() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const qualitiesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        qualitiesRef.current.children,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="qualities"
      aria-labelledby="qualities-heading"
      className="relative w-full py-24 sm:py-28 lg:py-32 bg-gradient-to-b from-white via-[#f8f9fa] to-white overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23083865' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} aria-hidden="true" />

      {/* Premium Side Decorations */}
      <Image 
        src="/spices.png" 
        alt="" 
        width={400}
        height={800}
        className="rotate-180 absolute top-0 -left-24 lg:-left-16 h-full w-auto opacity-40 pointer-events-none hidden md:block"
        aria-hidden="true"
      />
      <Image 
        src="/spices.png" 
        alt="" 
        width={400}
        height={800}
        className="absolute top-0 -right-24 lg:-right-16 h-full w-auto opacity-40 pointer-events-none hidden md:block"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container-custom section-padding">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-14 lg:mb-20">
          <span className="inline-block text-xs sm:text-sm tracking-[0.25em] uppercase text-[#083865]/50 font-medium mb-4">
            Why Choose Us
          </span>
          <h2 
            id="qualities-heading"
            className="heading-cambay text-3xl sm:text-4xl lg:text-[48px] text-[#083865] leading-tight mb-6"
          >
            Our Commitment to Excellence
          </h2>
          <p className="text-[#737373] text-base lg:text-lg max-w-[600px] mx-auto leading-relaxed">
            We uphold the highest standards in every aspect of our business, ensuring quality and trust in every partnership.
          </p>
        </div>

        {/* Qualities Grid */}
        <div
          ref={qualitiesRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-[1000px] mx-auto"
          role="list"
        >
          {qualities.map((quality) => (
            <article
              key={quality.id}
              role="listitem"
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 lg:p-10 bg-white rounded-2xl border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.12)] hover:border-[#083865]/15 transition-all duration-500 overflow-hidden">
                
                {/* Gradient accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#083865]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Decorative Number */}
                <span className="absolute top-4 right-6 text-[90px] lg:text-[110px] font-bold text-[#083865]/[0.03] leading-none select-none pointer-events-none" aria-hidden="true">
                  0{quality.id}
                </span>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-br from-[#083865]/5 to-[#1361A9]/8 flex items-center justify-center group-hover:from-[#083865]/10 group-hover:to-[#1361A9]/15 transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#083865]/10">
                    <quality.icon 
                      strokeWidth={1.5}
                      className="w-7 h-7 lg:w-8 lg:h-8 text-[#083865] transition-transform duration-500 group-hover:scale-110" 
                      aria-hidden="true"
                    />
                  </div>
                  {/* Accent Line */}
                  <div className="absolute -bottom-3 left-0 w-10 h-[2px] bg-gradient-to-r from-[#083865] to-[#1361A9] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100 origin-left rounded-full" />
                </div>

                {/* Text Content */}
                <h3 className="heading-cambay text-xl lg:text-2xl text-[#083865] mb-3 transition-transform duration-300 group-hover:translate-x-1">
                  {quality.name}
                </h3>
                <p className="text-[#737373] text-sm lg:text-base leading-relaxed relative z-10">
                  {quality.description}
                </p>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-[#083865]/30 via-[#1361A9]/20 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 rounded-full" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
