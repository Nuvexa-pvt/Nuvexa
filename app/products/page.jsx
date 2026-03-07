"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";
import { CATEGORY_LABELS, CATEGORIES } from "@/lib/productsData";
import { Search01Icon } from "hugeicons-react";
import { db } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 12;

const ALL_PILL = { value: "all", label: "All Products" };

// Module-level cache so we don't re-fetch on every mount
let _filterCatsCache = null;

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-[#737373] text-sm font-medium transition-all duration-300 hover:border-[#083865]/30 hover:text-[#083865] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb] disabled:hover:text-[#737373]"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-[#737373] text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`cursor-pointer w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentPage === page
                ? "bg-[#083865] text-white shadow-md"
                : "border border-[#e5e7eb] text-[#737373] hover:border-[#083865]/30 hover:text-[#083865]"
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-[#737373] text-sm font-medium transition-all duration-300 hover:border-[#083865]/30 hover:text-[#083865] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb] disabled:hover:text-[#737373]"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const gridRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [filterCategories, setFilterCategories] = useState(
    () => [ALL_PILL, ...(_filterCatsCache ?? CATEGORIES.filter((c) => c.id !== "all").map((c) => ({ value: c.id, label: c.label })))]
  );

  // Fetch categories from DB (once per session)
  useEffect(() => {
    if (_filterCatsCache) {
      setFilterCategories([ALL_PILL, ..._filterCatsCache]);
      return;
    }
    getDocs(collection(db, "categories"))
      .then((snap) => {
        const items = snap.docs
          .map((d) => ({ value: d.data().id, label: d.data().label }))
          .filter((c) => c.value && c.label);
        if (items.length > 0) {
          _filterCatsCache = items;
          setFilterCategories([ALL_PILL, ...items]);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  // Fetch products + read initial category from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat);
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  // Hero entrance
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        heroContentRef.current,
        { y: 50, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power4.out", delay: 0.2 }
      );
    }
  }, [loading]);

  // Stagger grid items on page/filter changes
  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".product-card-wrapper");
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
      });
    }
  }, [page, category, search, loading]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, search]);

  // Derived state
  const filtered = products
    .filter((p) => (category === "all" ? true : p.category === category))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative w-full h-[40vh] min-h-[350px] max-h-[560px] overflow-hidden"
          aria-label="Products hero section"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/herobg.png')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/15" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#083865]/20 via-transparent to-[#083865]/20" aria-hidden="true" />

          <div
            ref={heroContentRef}
            className="relative z-10 h-full flex flex-col items-center justify-end pb-10 sm:pb-12 text-center px-6 sm:px-8 lg:px-12"
          >
            <h1 className="heading-cambay text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-tight drop-shadow-2xl mb-3">
              Our Products
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-[500px] leading-relaxed font-light tracking-wide">
              Premium spices, teas, coconut products &amp; herbal extracts — sourced from Sri Lanka&apos;s finest farms.
            </p>
          </div>
        </section>

        {/* ── Filter & Search Bar ── */}
        <div className=" z-30 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] shadow-sm">
          <div className="container-custom section-padding py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search01Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300"
                  aria-label="Search products"
                />
              </div>

              {/* Category Pills — horizontal scroll on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide flex-shrink-0" role="group" aria-label="Filter by category">
                {filterCategories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`cursor-pointer whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                      category === cat.value
                        ? "bg-[#083865] text-white shadow-md shadow-[#083865]/20"
                        : "bg-[#f8fafc] border border-[#e5e7eb] text-[#737373] hover:border-[#083865]/30 hover:text-[#083865]"
                    }`}
                    aria-pressed={category === cat.value}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort Toggle */}
              <button
                onClick={() => setSortAsc((v) => !v)}
                className="cursor-pointer flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-xs font-semibold text-[#737373] hover:border-[#083865]/30 hover:text-[#083865] transition-all duration-300"
                aria-label={`Sort ${sortAsc ? "Z to A" : "A to Z"}`}
                title={`Currently: ${sortAsc ? "A → Z" : "Z → A"}`}
              >
                {sortAsc ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5 4l-4 4m0 0l-4-4m4 4V8"/></svg>
                )}
                <span className="hidden sm:inline">{sortAsc ? "A → Z" : "Z → A"}</span>
              </button>
            </div>

            {/* Results count */}
            {!loading && (
              <p className="mt-2.5 text-xs text-[#9ca3af]">
                {sorted.length === 0
                  ? "No products found"
                  : `Showing ${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, sorted.length)} of ${sorted.length} product${sorted.length !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>
        </div>

        {/* ── Products Grid ── */}
        <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Product grid">
          <div className="container-custom section-padding">
            {loading ? (
              /* Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[#e5e7eb] animate-pulse">
                    <div className="aspect-[4/3] bg-gray-100" />
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-10 bg-gray-100 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#f0f4f8] flex items-center justify-center mb-5">
                  <Search01Icon className="w-9 h-9 text-[#083865]/30" aria-hidden="true" />
                </div>
                <h2 className="heading-cambay text-[#111827] text-xl mb-2">No products found</h2>
                <p className="text-[#737373] text-sm max-w-xs">
                  Try adjusting your search or category filter to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => { setSearch(""); setCategory("all"); }}
                  className="cursor-pointer mt-6 px-6 py-2.5 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] transition-all duration-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
              >
                {paginated.map((product) => (
                  <div key={product.id} className="product-card-wrapper">
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      image={product.mainImage}
                      rating={product.rating}
                      category={product.category}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && paginated.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
