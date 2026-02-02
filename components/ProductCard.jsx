"use client";

import { useRef } from "react";
import Image from "next/image";
import { StarIcon } from "hugeicons-react";

export default function ProductCard({
  image = "/product image.png",
  name = "CINNAMON",
  rating = 5 
}) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className="group relative w-full max-w-[320px] h-[420px] sm:h-[420px] border border-[#A8A8A8] rounded-xl overflow-hidden bg-white transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 mx-auto cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative w-full h-[200px] sm:h-[240px] mt-4 mx-auto px-4">
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 mt-7">
        {/* Product Name */}
        <h3 className="heading-cambay text-[#111827] text-lg sm:text-xl text-center">
          {name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-1 mt-0">
          {[...Array(rating)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD700] fill-[#FFD700]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Wishlist Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
        <button className="w-full py-3 bg-[#D9D9D9] rounded-xl text-[#737373] text-sm font-medium transition-all duration-300 hover:bg-[#083865] hover:text-white cursor-pointer">
          ADD TO WISHLIST
        </button>
      </div>
    </div>
  );
}
