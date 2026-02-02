"use client";

import { useRef } from "react";
import Image from "next/image";

export default function SupplierStoryCard({
  image = "/coconut pic.png",
  title = "Shakthi Coconut Toddy",
  description = "Shakthi Coconut Toddy begins its journey at sunrise, carefully tapped from mature coconut palms using traditional methods passed down through generations. Naturally fermented and minimally processed, it delivers clean energy while preserving the integrity of the land and livelihood of the farmer behind every bottle.",
}) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className="relative w-full border border-[#A8A8A8] rounded-xl overflow-hidden bg-white"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Text Content */}
        <div className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
          <p className="text-[#333333] text-base lg:text-xl font-medium leading-relaxed">
            {description}
          </p>

          {/* Read More Button */}
          <button className="mt-6 self-start px-8 py-3 bg-[#D9D9D9] rounded-lg text-[#737373] text-sm font-medium transition-all duration-300 hover:bg-[#083865] hover:text-white">
            READ MORE
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full lg:w-[400px] xl:w-[500px] h-[240px] sm:h-[280px] lg:h-[320px] flex-shrink-0 lg:m-6 lg:ml-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
