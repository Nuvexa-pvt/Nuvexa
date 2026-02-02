"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "../ProductCard";
import { ArrowRight01Icon } from "hugeicons-react";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: 1, name: "CINNAMON", image: "/product image.png", rating: 5 },
  { id: 2, name: "CINNAMON", image: "/product image.png", rating: 5 },
  { id: 3, name: "CINNAMON", image: "/product image.png", rating: 5 },
  { id: 4, name: "CINNAMON", image: "/product image.png", rating: 5 },
];

export default function Products() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const ctaRef = useRef(null);

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
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="products"
      aria-labelledby="products-heading"
      className="w-full py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-white to-[#f8f9fa]"
    >
      <div className="container-custom section-padding">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-14 gap-4">
          <div>
            <span
              ref={subtitleRef}
              className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-3"
            >
              Featured Selection
            </span>
            <h2
              ref={titleRef}
              id="products-heading"
              className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl"
            >
              Most Popular Right Now
            </h2>
          </div>
          
          {/* View All Link - Desktop */}
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-2 text-[#083865] text-sm font-semibold uppercase tracking-wider hover:text-[#1361A9] transition-colors duration-300 group"
          >
            View All Products
            <ArrowRight01Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Products Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          role="list"
          aria-label="Popular products"
        >
          {products.map((product) => (
            <div key={product.id} role="listitem">
              <ProductCard
                name={product.name}
                image={product.image}
                rating={product.rating}
              />
            </div>
          ))}
        </div>

        {/* View All Button - Mobile */}
        <div ref={ctaRef} className="mt-10 text-center sm:hidden">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#083865] text-white rounded-xl text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/50 focus:ring-offset-2"
          >
            View All Products
            <ArrowRight01Icon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
