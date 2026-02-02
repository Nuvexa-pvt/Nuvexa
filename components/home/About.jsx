"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const decorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -100, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Decorative line animation
      gsap.fromTo(
        decorRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
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
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Dark Pattern Background with gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/dark pattern.svg"
          alt=""
          fill
          className="object-cover opacity-50"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-[#083865]/5" />
      </div>

      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-[#083865]/20 to-transparent" />

      <div className="container-custom section-padding relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 xl:gap-28">
          {/* Logo Image with premium frame */}
          <div
            ref={imageRef}
            className="w-full max-w-[380px] lg:max-w-[480px] flex-shrink-0 relative"
          >
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#083865]/5 to-[#1361A9]/5 rounded-3xl -z-10 transform -rotate-2" />
            <div className="relative p-6 lg:p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#083865]/10 shadow-[0_8px_40px_-12px_rgba(8,56,101,0.15)]">
              <Image
                src="/logo.png"
                alt="NUVEXA International - Premium Export Company"
                width={663}
                height={191}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 max-w-[650px]">
            {/* Section label */}
            <span className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-4">
              About Our Company
            </span>
            
            <h2 
              id="about-heading"
              className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] leading-tight mb-2"
            >
              Who Are We?
            </h2>
            
            {/* Animated decorative line */}
            <div 
              ref={decorRef}
              className="w-16 h-[3px] bg-gradient-to-r from-[#083865] to-[#1361A9] mb-6 origin-left rounded-full"
            />
            
            <p className="text-[#111827] text-base lg:text-lg xl:text-xl font-normal leading-[1.8] mb-6">
              Nuvexa International (Pvt) Ltd is a Sri Lanka-based export company
              specializing in sourcing, marketing, and distributing premium
              products to international markets.
            </p>
            
            <p className="text-[#737373] text-sm lg:text-base leading-relaxed">
              We work closely with trusted manufacturers and producers to deliver 
              consistent quality, compliance, and reliability to our global partners.
            </p>

            {/* Stats row */}
            <div className="mt-10 pt-8 border-t border-[#083865]/10 grid grid-cols-3 gap-6">
              {[
                { value: "50+", label: "Products" },
                { value: "15+", label: "Countries" },
                { value: "100%", label: "Quality" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="heading-cambay text-[#083865] text-2xl lg:text-3xl mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[#737373] text-xs sm:text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
