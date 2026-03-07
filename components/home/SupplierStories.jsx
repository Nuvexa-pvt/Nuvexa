"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import SupplierStoryCard from "./SupplierStoryCard";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    id: 1,
    title: "Shakthi Coconut Toddy",
    image: "/shakthi.png",
    category: "Coconut Products",
    description:
      "Shakthi Coconut Toddy begins its journey at sunrise, carefully tapped from mature coconut palms using traditional methods passed down through generations. Naturally fermented and minimally processed, it delivers clean energy while preserving the integrity of the land and livelihood of the farmer behind every bottle.",
  },
  {
    id: 2,
    title: "Ceylon Tea Gardens",
    image: "/tea range pic.png",
    category: "Premium Tea",
    description:
      "Our Ceylon Tea is hand-picked from the misty highlands of Sri Lanka, where generations of skilled workers have perfected the art of tea cultivation. Each leaf is carefully selected and processed to preserve its natural flavor and aroma, bringing you the authentic taste of premium Sri Lankan tea.",
  },
  {
    id: 3,
    title: "Spice Heritage",
    image: "/spice range pic.png",
    category: "Authentic Spices",
    description:
      "Sri Lanka's spice heritage spans centuries, with cinnamon being the crown jewel of our exports. Our partner farmers use sustainable practices to cultivate the world's finest true cinnamon, known for its delicate flavor and numerous health benefits.",
  },
];

export default function SupplierStories() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
        headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section
      ref={sectionRef}
      id="stories"
      aria-labelledby="stories-heading"
      className="w-full py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-[#f8f9fa] to-white"
    >
      <div className="container-custom section-padding">
        {/* Header with Title and Navigation */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-14 gap-6">
          <div>
            <span className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-3">
              Behind the Products
            </span>
            <h2
              id="stories-heading"
              className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl"
            >
              SUPPLIER STORIES
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3" role="group" aria-label="Carousel navigation">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-1 mr-4">
              <span className="text-[#083865] font-semibold text-sm">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[#083865]/30 text-sm">/</span>
              <span className="text-[#083865]/40 text-sm">
                {String(stories.length).padStart(2, '0')}
              </span>
            </div>
            
            <button
              onClick={goToPrevious}
              disabled={isAnimating}
              className="cursor-pointer w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl border border-[#083865]/10 flex items-center justify-center text-[#737373] transition-all duration-300 hover:bg-[#083865] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-[#083865]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
              aria-label="Previous story"
            >
              <ArrowLeft01Icon className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={isAnimating}
              className="cursor-pointer w-11 h-11 sm:w-12 sm:h-12 bg-[#083865] rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#083865]/30"
              aria-label="Next story"
            >
              <ArrowRight01Icon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Card Carousel */}
        <div ref={contentRef} className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            role="region"
            aria-live="polite"
          >
            {stories.map((story) => (
              <div key={story.id} className="w-full flex-shrink-0">
                <SupplierStoryCard
                  title={story.title}
                  image={story.image}
                  category={story.category}
                  description={story.description}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div 
          className="flex items-center justify-center gap-2.5 mt-8"
          role="tablist"
          aria-label="Story slides"
        >
          {stories.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              className={`cursor-pointer h-2.5 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 ${
                index === currentIndex 
                  ? "w-8 bg-gradient-to-r from-[#083865] to-[#1361A9]" 
                  : "w-2.5 bg-[#083865]/20 hover:bg-[#083865]/40"
              }`}
              aria-label={`Go to story ${index + 1}: ${stories[index].title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
