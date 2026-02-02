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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      className="relative w-full py-16 sm:py-20 lg:py-30"
    >
      {/* Dark Pattern Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/dark pattern.svg"
          alt=""
          fill
          className="object-cover opacity-60"
        />
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24">
          {/* Logo Image */}
          <div
            ref={imageRef}
            className="w-full max-w-[400px] lg:max-w-[500px] flex-shrink-0"
          >
            <Image
              src="/logo.png"
              alt="NUVEXA International"
              width={663}
              height={191}
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 max-w-[700px]">
            <h2 className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3">
              Who are we?
            </h2>
            <p className="text-[#111827] text-base lg:text-lg font-medium leading-relaxed">
              Nuvexa International (Pvt) Ltd is a Sri Lanka-based export company
              specializing in sourcing, marketing, and distributing premium
              products to international markets. We work closely with trusted
              manufacturers and producers to deliver consistent quality,
              compliance, and reliability to our global partners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
