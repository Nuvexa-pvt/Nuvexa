"use client";

import { useRef } from "react";
import Image from "next/image";
import { HeartAddIcon } from "hugeicons-react";

export default function ProductCard({
  image = "/product image.png",
  name = "CINNAMON",
  rating = 5,
  category = "Premium Spice",
}) {
  const cardRef = useRef(null);

  return (
    <article
      ref={cardRef}
      className="group relative w-full max-w-[340px] bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_-8px_rgba(8,56,101,0.12)] hover:border-[#083865]/15 transition-all duration-500 hover:-translate-y-1 mx-auto cursor-pointer"
    >
      {/* Wishlist Button - Top Right */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#737373] shadow-md transition-all duration-300 hover:bg-[#083865] hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 opacity-0 group-hover:opacity-100"
        aria-label={`Add ${name} to wishlist`}
      >
        <HeartAddIcon className="w-5 h-5" />
      </button>

      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#f8f9fa] to-white">
        <Image
          src={image}
          alt={`${name} - ${category} from Sri Lanka`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info */}
      <div className="p-5 sm:p-6">
        {/* Category label */}
        <span className="text-[#083865]/50 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
          {category}
        </span>

        {/* Product Name */}
        <h3 className="heading-cambay text-[#111827] text-lg sm:text-xl mt-1.5 mb-2 group-hover:text-[#083865] transition-colors duration-300">
          {name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-[#FFB800] fill-[#FFB800]' : 'text-gray-200 fill-gray-200'}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="ml-2 text-[#737373] text-xs font-medium">({rating}.0)</span>
        </div>

        {/* Add to Wishlist Button */}
        <button 
          className="mt-5 w-full py-3.5 bg-gradient-to-r from-[#f0f2f5] to-[#e8eaed] rounded-xl text-[#083865] text-sm font-semibold uppercase tracking-wide transition-all duration-500 hover:from-[#083865] hover:to-[#1361A9] hover:text-white hover:shadow-lg hover:shadow-[#083865]/20 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 group/btn"
          aria-label={`Add ${name} to wishlist`}
        >
          <span className="flex items-center justify-center gap-2">
            <HeartAddIcon className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            Add to Wishlist
          </span>
        </button>
      </div>

      {/* Premium indicator line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#083865] via-[#1361A9] to-[#083865] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" aria-hidden="true" />
    </article>
  );
}
