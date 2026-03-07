"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { format } from "date-fns";
import { Search01Icon } from "hugeicons-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPublishedBlogs } from "@/lib/blog";

gsap.registerPlugin(ScrollTrigger);

export default function BlogListingPage() {
  const heroContentRef = useRef(null);
  const gridRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  // Fetch blogs
  useEffect(() => {
    getAllPublishedBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, []);

  // Hero entrance animation
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        heroContentRef.current,
        { y: 50, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power4.out", delay: 0.2 }
      );
    }
  }, [loading]);

  // Grid stagger animation on filter/search change
  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".blog-card-wrapper");
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
      });
    }
  }, [activeTag, search, loading]);

  // Extract unique tags from all blogs
  const allTags = [...new Set(blogs.flatMap((b) => b.tags ?? []))];

  // Filtered blogs
  const filtered = blogs
    .filter((b) => (activeTag === "all" ? true : b.tags?.includes(activeTag)))
    .filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white overflow-x-hidden">
        {/* ── Hero ── */}
        <section
          aria-label="Blog page hero"
          className="relative w-full h-[40vh] min-h-[350px] max-h-[560px] overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src="/herobg.png"
              alt="Nuvexa International Blog"
              fill
              className="object-cover object-top scale-105"
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#083865]/20 via-transparent to-[#083865]/20" />
          </div>

          <div
            ref={heroContentRef}
            className="relative z-10 h-full flex flex-col items-center justify-end pb-10 sm:pb-12 text-center px-6 sm:px-8 lg:px-12"
          >
            <h1 className="heading-cambay text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-tight drop-shadow-2xl mb-3">
              Our Blog
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-[500px] leading-relaxed font-light tracking-wide">
              Stories, insights &amp; updates from Nuvexa International
            </p>
          </div>
        </section>

        {/* ── Search & Filter Bar ── */}
        <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] shadow-sm">
          <div className="container-custom section-padding py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search01Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search articles…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all duration-300"
                  aria-label="Search blog posts"
                />
              </div>

              {/* Tag Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide flex-shrink-0" role="group" aria-label="Filter by tag">
                <button
                  onClick={() => setActiveTag("all")}
                  className={`cursor-pointer whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                    activeTag === "all"
                      ? "bg-[#083865] text-white shadow-md shadow-[#083865]/20"
                      : "bg-[#f8fafc] border border-[#e5e7eb] text-[#737373] hover:border-[#083865]/30 hover:text-[#083865]"
                  }`}
                  aria-pressed={activeTag === "all"}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`cursor-pointer whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                      activeTag === tag
                        ? "bg-[#083865] text-white shadow-md shadow-[#083865]/20"
                        : "bg-[#f8fafc] border border-[#e5e7eb] text-[#737373] hover:border-[#083865]/30 hover:text-[#083865]"
                    }`}
                    aria-pressed={activeTag === tag}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            {!loading && (
              <p className="mt-2.5 text-xs text-[#9ca3af]">
                {filtered.length === 0
                  ? "No articles found"
                  : `${filtered.length} article${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            )}
          </div>
        </div>

        {/* ── Blog Grid ── */}
        <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Blog grid">
          <div className="container-custom section-padding">
            {loading ? (
              /* Skeleton Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[#e5e7eb] animate-pulse">
                    <div className="aspect-[16/9] bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-5 bg-gray-100 rounded w-4/5" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="flex gap-2 mt-2">
                        <div className="h-5 bg-gray-100 rounded-full w-14" />
                        <div className="h-5 bg-gray-100 rounded-full w-14" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#f0f4f8] flex items-center justify-center mb-5">
                  <Search01Icon className="w-9 h-9 text-[#083865]/30" aria-hidden="true" />
                </div>
                <h2 className="heading-cambay text-[#111827] text-xl mb-2">No articles found</h2>
                <p className="text-[#737373] text-sm max-w-xs">
                  Try adjusting your search or tag filter to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => { setSearch(""); setActiveTag("all"); }}
                  className="cursor-pointer mt-6 px-6 py-2.5 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] transition-all duration-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="blog-card-wrapper group"
                  >
                    <article className="rounded-2xl border border-[#e5e7eb] shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.1)] hover:border-[#083865]/15 transition-all duration-500 overflow-hidden bg-white">
                      {/* Cover Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {blog.coverImage ? (
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#083865]/10 to-[#1361A9]/10 flex items-center justify-center">
                            <span className="text-4xl" aria-hidden="true">📝</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        {/* Date */}
                        <p className="text-[#9ca3af] text-xs mb-2">
                          {blog.createdAt
                            ? format(new Date(blog.createdAt), "MMM dd, yyyy")
                            : "—"}
                        </p>

                        {/* Title */}
                        <h2 className="heading-cambay text-[#111827] text-lg leading-snug mb-2 group-hover:text-[#083865] transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h2>

                        {/* Author */}
                        {blog.author && (
                          <p className="text-[#737373] text-sm mb-3">
                            By {blog.author}
                          </p>
                        )}

                        {/* Tags */}
                        {blog.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {blog.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#083865]/5 text-[#083865]/70 border border-[#083865]/10"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-[#9ca3af] text-xs">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {blog.views ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {blog.likes ?? 0}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
