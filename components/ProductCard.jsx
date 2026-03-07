"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { toast } from "sonner";
import { ShoppingCart01Icon } from "hugeicons-react";
import { CATEGORY_LABELS } from "@/lib/productsData";

export default function ProductCard({
  id = "",
  slug = "",
  image = "/product image.png",
  name = "Product",
  rating = 5,
  category = "spice",
}) {
  const { addToCart } = useCart();
  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, slug, name, image, category });
    toast.success(`${name} added to cart`);
  };

  const CardInner = (
    <article className="group relative w-full bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_-8px_rgba(8,56,101,0.12)] hover:border-[#083865]/15 transition-all duration-500 hover:-translate-y-1 cursor-pointer">

      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#f8f9fa] to-white">
        <Image
          src={image}
          alt={`${name} — ${categoryLabel} from Sri Lanka`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Category pill on image */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[#083865] text-[10px] font-semibold uppercase tracking-widest border border-[#083865]/10">
          {categoryLabel}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        <h3 className="heading-cambay text-[#111827] text-base sm:text-lg mt-0.5 mb-2.5 group-hover:text-[#083865] transition-colors duration-300 line-clamp-1">
          {name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5 mb-4" role="img" aria-label={`Rating: ${rating} out of 5`}>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < rating ? "text-[#FFB800] fill-[#FFB800]" : "text-gray-200 fill-gray-200"}`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="ml-1.5 text-[#737373] text-xs">({rating}.0)</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="cursor-pointer w-full py-3 bg-gradient-to-r from-[#f0f2f5] to-[#e8eaed] rounded-xl text-[#083865] text-xs font-semibold uppercase tracking-wide transition-all duration-500 hover:from-[#083865] hover:to-[#1361A9] hover:text-white hover:shadow-lg hover:shadow-[#083865]/20 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 flex items-center justify-center gap-2 group/btn"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart01Icon className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110" />
          Add to Cart
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#083865] via-[#1361A9] to-[#083865] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" aria-hidden="true" />
    </article>
  );

  if (slug) {
    return (
      <Link href={`/products/${slug}`} className="block focus:outline-none focus:ring-2 focus:ring-[#083865]/30 rounded-2xl">
        {CardInner}
      </Link>
    );
  }
  return CardInner;
}
