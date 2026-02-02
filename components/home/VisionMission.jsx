"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VisionMission() {
  const sectionRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on background
      gsap.to(overlayRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Cards entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        visionRef.current,
        { x: -120, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
      ).fromTo(
        missionRef.current,
        { x: 120, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" },
        "-=0.9"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="vision-mission-heading"
      className="relative w-full py-16 sm:py-20 lg:py-0 lg:min-h-[700px] overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div ref={overlayRef} className="absolute inset-0 -top-20 -bottom-20">
        <Image
          src="/Vision Mission.png"
          alt="Premium Sri Lankan landscape"
          fill
          className="object-cover scale-110"
          quality={90}
          priority
          sizes="100vw"
        />
        {/* Premium overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#083865]/30 via-transparent to-[#083865]/30" />
      </div>

      {/* Screen reader heading */}
      <h2 id="vision-mission-heading" className="sr-only">Our Vision and Mission</h2>

      {/* Content */}
      <div className="relative lg:absolute lg:inset-0 flex items-center lg:items-end z-10">
        <div className="container-custom section-padding py-4 lg:pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Vision Card */}
            <article
              ref={visionRef}
              className="group glass-dark rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-14 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5)]"
            >
              {/* Icon accent - hidden on mobile */}
              <div className="hidden sm:flex w-12 h-12 mb-6 rounded-xl bg-white/10 items-center justify-center group-hover:bg-white/15 transition-colors duration-500">
                <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>

              <h3 className="heading-cambay text-white text-2xl sm:text-3xl lg:text-5xl mb-4 sm:mb-6 text-center lg:text-left">
                VISION
              </h3>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg font-normal text-center lg:text-left leading-relaxed sm:leading-[1.8] max-w-[500px] mx-auto lg:mx-0">
                To become a trusted international export partner representing Sri Lankan excellence across food, beverage, and wellness categories.
              </p>

              {/* Decorative line - hidden on mobile */}
              <div className="hidden sm:block mt-8 w-full h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
            </article>

            {/* Mission Card */}
            <article
              ref={missionRef}
              className="group glass-dark rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-14 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5)]"
            >
              {/* Icon accent - hidden on mobile */}
              <div className="hidden sm:flex w-12 h-12 mb-6 rounded-xl bg-white/10 items-center justify-center group-hover:bg-white/15 transition-colors duration-500">
                <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3 className="heading-cambay text-white text-2xl sm:text-3xl lg:text-5xl mb-4 sm:mb-6 text-center lg:text-left">
                MISSION
              </h3>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg font-normal text-center lg:text-left leading-relaxed sm:leading-[1.8] max-w-[500px] mx-auto lg:mx-0">
                To connect Sri Lanka's finest products with global markets through ethical sourcing, quality assurance, and long-term partnerships.
              </p>

              {/* Decorative line - hidden on mobile */}
              <div className="hidden sm:block mt-8 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-white/20" />
            </article>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </section>
  );
}
