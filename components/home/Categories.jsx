"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight01Icon } from "hugeicons-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "TEA RANGE",
    subtitle: "Premium Ceylon Tea",
    image: "/tea range pic.png",
    singleLine: true,
  },
  {
    id: 2,
    name: "SPICE RANGE",
    subtitle: "Authentic Sri Lankan Spices",
    image: "/spice range pic.png",
    singleLine: true,
  },
  {
    id: 3,
    name: "COCONUT PRODUCTS",
    subtitle: "Pure & Natural",
    image: "/coconut pic.png",
    singleLine: true,
  },
  {
    id: 4,
    name: "HERBAL NUTRITION",
    subtitle: "Wellness & Health",
    image: "/herb pic.png",
    singleLine: true,
  },
];

export default function Categories() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          cardsRef.current.children,
          { y: 80, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="categories-heading"
      className="w-full py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-white via-[#fafbfc] to-white"
    >
      <div className="container-custom section-padding">
        {/* Section Header */}
        <div className="mb-10 lg:mb-14">
          <span
            ref={subtitleRef}
            className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-3"
          >
            Explore Our Range
          </span>
          <h2
            ref={titleRef}
            id="categories-heading"
            className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl"
          >
            PRODUCT CATEGORIES
          </h2>
        </div>

        {/* Categories Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
          role="list"
        >
          {categories.map((category) => (
            <article
              key={category.id}
              role="listitem"
              className="group relative w-full aspect-[10/14] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={`${category.name} - ${category.subtitle}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/40 transition-opacity duration-500 group-hover:opacity-80" />
              
              {/* Premium shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-out" />

              {/* Category Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 lg:p-8">
                {/* Top: Category Info */}
                <div className="text-center transform transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="inline-block text-white/70 text-[13px] sm:text-xs tracking-widest uppercase mb-2 font-medium">
                    {category.subtitle}
                  </span>
                  <h3 className="heading-cambay text-white text-4xl sm:text-xl lg:text-2xl leading-tight drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>

                {/* Bottom: View All Button */}
                <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <button 
                    className="w-full py-3 px-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/30 text-white text-sm font-semibold uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white hover:text-[#083865] hover:border-transparent focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={`View all ${category.name} products`}
                  >
                    <span>View All</span>
                    <ArrowRight01Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
