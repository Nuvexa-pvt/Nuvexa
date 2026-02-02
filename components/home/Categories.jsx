"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "TEA RANGE",
    image: "/tea range pic.png",
    singleLine: true,
  },
  {
    id: 2,
    name: "SPICE RANGE",
    image: "/spice range pic.png",
    singleLine: true,
  },
  {
    id: 3,
    name: "COCONUT BASED\nPRODUCTS",
    image: "/coconut pic.png",
    singleLine: false,
  },
  {
    id: 4,
    name: "Herbal Nutrition\nProduce",
    image: "/herb pic.png",
    singleLine: false,
  },
];

export default function Categories() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        cardsRef.current.children,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
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
      className="w-full py-16 sm:py-20 lg:py-24 bg-white md:-mt-14"
    >
      <div className="container-custom section-padding">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="heading-cambay text-[#083865] text-xl sm:text-2xl lg:text-3xl mb-6 lg:mb-10"
        >
          PRODUCT CATEGORIES
        </h2>

        {/* Categories Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0"
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative w-full aspect-[11/16] overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay - Dark at top for text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/30" />

              {/* Category Name */}
              <div className="absolute top-8 sm:top-10 lg:top-12 left-0 right-0 text-center px-4">
                <h3 className="heading-cambay text-white text-lg sm:text-xl lg:text-[22px] whitespace-pre-line leading-tight">
                  {category.name}
                </h3>
              </div>

              {/* View All Button */}
              <div className="absolute bottom-4 sm:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)]">
                <button className="w-full py-2.5 glass-button rounded-md border border-white text-white text-sm font-bold uppercase transition-all duration-300 hover:bg-white/30 cursor-pointer">
                  VIEW ALL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
