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
    description: "Direct partnerships with farmers ensuring fair trade practices"
  },
  { 
    id: 2, 
    name: "Quality & Compliance", 
    icon: ShieldCheck,
    description: "Meeting international standards with rigorous quality checks"
  },
  { 
    id: 3, 
    name: "Transparency", 
    icon: Search,
    description: "Complete traceability from farm to your facility"
  },
  { 
    id: 4, 
    name: "Long-term Partnerships", 
    icon: Handshake,
    description: "Building lasting relationships with trust and reliability"
  },
];

export default function Qualities() {
  const sectionRef = useRef(null);
  const qualitiesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        qualitiesRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="qualities"
      className="relative w-full py-24  bg-gradient-to-b from-white via-[#f8f9fa] to-white overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23083865' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Side Decorations - Spice Images */}
      <img src="/spices.png" alt="" className="rotate-180 absolute top-0 -left-20 h-full opacity-60 pointer-events-none"/>
      <img src="/spices.png" alt="" className="absolute top-0 -right-20 h-full opacity-60 pointer-events-none"/>

      {/* Content */}
      <div className="relative z-10 container-custom px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="heading-cambay text-3xl sm:text-4xl lg:text-[42px] text-[#083865] leading-tight">
            Our Commitment to Excellence
          </h2>
          {/* <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#083865] to-transparent mx-auto mt-6" /> */}
        </div>

        {/* Qualities Grid */}
        <div
          ref={qualitiesRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-[900px] mx-auto"
        >
          {qualities.map((quality, index) => (
            <div
              key={quality.id}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 lg:p-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#083865]/10 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.08)] hover:shadow-[0_12px_48px_-8px_rgba(8,56,101,0.15)] hover:border-[#083865]/20 transition-all duration-500">
                
                {/* Decorative Number */}
                <span className="absolute top-6 right-8 text-[80px] lg:text-[100px] font-bold text-[#083865]/[0.03] leading-none select-none">
                  0{quality.id}
                </span>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-[#083865]/5 to-[#1361A9]/10 flex items-center justify-center group-hover:from-[#083865]/10 group-hover:to-[#1361A9]/20 transition-all duration-500">
                    <quality.icon 
                      strokeWidth={1.25}
                      className="w-8 h-8 lg:w-10 lg:h-10 text-[#083865] group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  {/* Accent Line */}
                  <div className="absolute -bottom-3 left-0 w-8 h-[2px] bg-gradient-to-r from-[#083865] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Text Content */}
                <h3 className="heading-cambay text-xl lg:text-2xl text-[#083865] mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {quality.name}
                </h3>
                <p className="text-[#737373] text-sm lg:text-base leading-relaxed">
                  {quality.description}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-[#083865]/20 via-[#1361A9]/10 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Bottom Element
        <div className="flex items-center justify-center gap-2 mt-16 lg:mt-20">
          <div className="w-12 h-[1px] bg-[#083865]/20" />
          <div className="w-2 h-2 rounded-full bg-[#083865]/30" />
          <div className="w-12 h-[1px] bg-[#083865]/20" />
        </div> */}
      </div>
    </section>
  );
}
