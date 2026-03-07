"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight01Icon } from "hugeicons-react";

export default function SupplierStoryCard({
  image = "/coconut pic.png",
  title = "Shakthi Coconut Toddy",
  category = "Premium Products",
  description = "Shakthi Coconut Toddy begins its journey at sunrise, carefully tapped from mature coconut palms using traditional methods passed down through generations. Naturally fermented and minimally processed, it delivers clean energy while preserving the integrity of the land and livelihood of the farmer behind every bottle.",
}) {
  const cardRef = useRef(null);

  return (
    <article
      ref={cardRef}
      className="group relative w-full bg-white rounded-2xl overflow-hidden border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.1)] transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Text Content */}
        <div className="p-8 sm:p-10 lg:p-12 xl:p-14 flex-1 flex flex-col justify-between order-2 lg:order-1">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#083865]/5 text-[#083865] text-xs font-medium uppercase tracking-wider">
              {title}
            </span>
          </div>

          {/* Story Title - Mobile */}
          <h3 className="heading-cambay text-[#083865] text-xl sm:text-2xl mb-4 lg:hidden">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[#333333] text-base lg:text-lg xl:text-xl font-normal leading-[1.8] flex-1">
            {description}
          </p>

          {/* Read More Button */}
          <div className="mt-8 flex items-center gap-4">
            <button 
              className="cursor-pointer group/btn inline-flex items-center gap-2 px-6 py-3 bg-[#083865] text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2"
              aria-label={`Read more about ${title}`}
            >
              <span>Read Full Story</span>
              <ArrowRight01Icon className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
            
            {/* Secondary link */}
            {/* <a 
              href="#" 
              className="hidden sm:inline-flex text-[#083865] text-sm font-medium hover:text-[#1361A9] transition-colors duration-300 underline-offset-4 hover:underline"
            >
              View Products
            </a> */}
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full lg:w-[420px] xl:w-[500px] h-[280px] sm:h-[320px] lg:h-auto lg:min-h-[380px] flex-shrink-0 order-1 lg:order-2 overflow-hidden">
          {/* Desktop margin wrapper */}
          <div className="lg:absolute lg:inset-6 lg:rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={`${title} - ${category} from NUVEXA International`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:rounded-xl" />
          </div>
          
          {/* Title overlay on image - Desktop only */}
          {/* <div className="hidden lg:flex absolute bottom-10 left-10 right-10">
            <h3 className="heading-cambay text-white text-2xl xl:text-3xl drop-shadow-lg bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
              {title}
            </h3>
          </div> */}
        </div>
      </div>

      {/* Decorative accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#083865] via-[#1361A9] to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" aria-hidden="true" />
    </article>
  );
}
