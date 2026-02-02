"use client";

import { useEffect, useRef, useState } from "react";
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
    description:
      "Shakthi Coconut Toddy begins its journey at sunrise, carefully tapped from mature coconut palms using traditional methods passed down through generations. Naturally fermented and minimally processed, it delivers clean energy while preserving the integrity of the land and livelihood of the farmer behind every bottle.",
  },
  {
    id: 2,
    title: "Ceylon Tea Gardens",
    image: "/tea range pic.png",
    description:
      "Our Ceylon Tea is hand-picked from the misty highlands of Sri Lanka, where generations of skilled workers have perfected the art of tea cultivation. Each leaf is carefully selected and processed to preserve its natural flavor and aroma, bringing you the authentic taste of premium Sri Lankan tea.",
  },
  {
    id: 3,
    title: "Spice Heritage",
    image: "/spice range pic.png",
    description:
      "Sri Lanka's spice heritage spans centuries, with cinnamon being the crown jewel of our exports. Our partner farmers use sustainable practices to cultivate the world's finest true cinnamon, known for its delicate flavor and numerous health benefits.",
  },
];

export default function SupplierStories() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white"
    >
      <div className="container-custom section-padding">
        {/* Header with Title and Navigation */}
        <div className="flex items-center justify-between mb-8 lg:mb-10">
          <h2
            ref={titleRef}
            className="heading-cambay text-[#083865] text-xl sm:text-2xl lg:text-3xl"
          >
            SUPPLIER STORIES
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 bg-[#D9D9D9] rounded-lg flex items-center justify-center text-[#737373] transition-all duration-300 hover:bg-[#083865] hover:text-white"
              aria-label="Previous story"
            >
              <ArrowLeft01Icon size={18} />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 bg-[#D9D9D9] rounded-lg flex items-center justify-center text-[#737373] transition-all duration-300 hover:bg-[#083865] hover:text-white"
              aria-label="Next story"
            >
              <ArrowRight01Icon size={18} />
            </button>
          </div>
        </div>

        {/* Story Card */}
        <div ref={contentRef} className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {stories.map((story) => (
              <div key={story.id} className="w-full flex-shrink-0">
                <SupplierStoryCard
                  title={story.title}
                  image={story.image}
                  description={story.description}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6 lg:hidden">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-6 bg-[#083865]" : "bg-[#D9D9D9]"
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
