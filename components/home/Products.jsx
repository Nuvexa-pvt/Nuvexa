"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "../ProductCard";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: 1, name: "CINNAMON", image: "/product image.png", rating: 5 },
  { id: 2, name: "CINNAMON", image: "/product image.png", rating: 5 },
  { id: 3, name: "CINNAMON", image: "/product image.png", rating: 5 },
  { id: 4, name: "CINNAMON", image: "/product image.png", rating: 5 },
];

export default function Products() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     gsap.fromTo(
  //       titleRef.current,
  //       { y: 40, opacity: 0 },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         duration: 0.8,
  //         ease: "power3.out",
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: "top 85%",
  //           toggleActions: "play none none reverse",
  //         },
  //       }
  //     );

  //     gsap.fromTo(
  //       cardsRef.current.children,
  //       { y: 60, opacity: 0 },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         duration: 0.8,
  //         stagger: 0.15,
  //         ease: "power3.out",
  //         scrollTrigger: {
  //           trigger: cardsRef.current,
  //           start: "top 85%",
  //           toggleActions: "play none none reverse",
  //         },
  //       }
  //     );
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white md:-mt-10"
    >
      <div className="container-custom section-padding">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="heading-cambay text-[#083865] text-xl sm:text-2xl lg:text-3xl mb-8 lg:mb-12"
        >
          Most Popular Right Now
        </h2>

        {/* Products Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-[37px]"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              rating={product.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
