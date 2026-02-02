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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        visionRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        missionRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      className="relative w-full py-24 sm:py-32 lg:py-40 xl:py-[290px] overflow-hidden h-[800px] sm:h-[600px] lg:h-[500px]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Vision Mission.png"
          alt="Vision Mission Background"
          fill
          className="object-cover"
          quality={90}
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-8 z-10 container-custom section-padding mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vision Card */}
          <div
            ref={visionRef}
            className="glass-dark rounded-2xl p-8 sm:p-10 lg:p-12"
          >
            <h3 className="heading-cambay text-white text-3xl sm:text-4xl lg:text-5xl mb-6 text-center">
              VISION
            </h3>
            <p className="text-white/90 text-base lg:text-lg font-normal text-center leading-relaxed max-w-[500px] mx-auto">
              To become a trusted international export partner representing Sri Lankan excellence across food, beverage, and wellness categories
            </p>
          </div>

          {/* Mission Card */}
          <div
            ref={missionRef}
            className="glass-dark rounded-2xl p-8 sm:p-10 lg:p-12"
          >
            <h3 className="heading-cambay text-white text-3xl sm:text-4xl lg:text-5xl mb-6 text-center">
              MISSION
            </h3>
            <p className="text-white/90 text-base lg:text-lg font-normal text-center leading-relaxed max-w-[500px] mx-auto">
              To connect Sri Lanka's finest products with global markets through ethical sourcing, quality assurance, and long-term partnerships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
