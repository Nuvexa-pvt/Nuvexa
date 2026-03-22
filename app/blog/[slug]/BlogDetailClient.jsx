"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getBlogBySlug,
  incrementBlogViews,
  incrementBlogLikes,
  getRecentBlogs,
} from "@/lib/blog";

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetailClient() {
  const params = useParams();
  const slug = params?.slug;

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const viewIncremented = useRef(false);

  const contentRef = useRef(null);
  const relatedRef = useRef(null);

  // Fetch blog
  useEffect(() => {
    if (!slug) return;
    getBlogBySlug(slug)
      .then((data) => {
        setBlog(data);
        setLocalLikes(data?.likes ?? 0);
        if (data) {
          return getRecentBlogs(4);
        }
        return [];
      })
      .then((recent) => {
        setRelatedBlogs(recent.filter((b) => b.slug !== slug).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Increment views once on mount
  useEffect(() => {
    if (blog?.id && !viewIncremented.current) {
      viewIncremented.current = true;
      incrementBlogViews(blog.id);
    }
  }, [blog]);

  // Content entrance animation
  useEffect(() => {
    if (blog && contentRef.current) {
      const els = contentRef.current.querySelectorAll(".anim-in");
      gsap.set(els, { opacity: 0, y: 25 });
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
      });
    }
  }, [blog]);

  // Related section scroll animation
  useEffect(() => {
    if (relatedBlogs.length > 0 && relatedRef.current) {
      gsap.from(relatedRef.current.querySelectorAll(".related-card"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: relatedRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }
  }, [relatedBlogs]);

  // Handle like
  const handleLike = async () => {
    if (!blog?.id || liked) return;
    setLiked(true);
    setLocalLikes((prev) => prev + 1);
    await incrementBlogLikes(blog.id);
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-16">
          <div className="container-custom section-padding animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
            <div className="aspect-[21/9] bg-gray-100 rounded-2xl mb-8" />
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="h-10 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Not found ──
  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 pt-20">
          <div className="w-20 h-20 rounded-2xl bg-[#f0f4f8] flex items-center justify-center mb-5">
            <span className="text-4xl" aria-hidden="true">📝</span>
          </div>
          <h1 className="heading-cambay text-[#111827] text-2xl sm:text-3xl mb-3">
            Article not found
          </h1>
          <p className="text-[#737373] mb-8 max-w-xs">
            This article may have been removed or the link is incorrect.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white overflow-x-hidden">
        {/* ── Breadcrumb ── */}
        <div className="bg-[#f8fafc] border-b border-[#e5e7eb] pt-24 sm:pt-32 pb-4">
          <div className="container-custom section-padding">
            <nav className="flex items-center gap-2 text-xs text-[#9ca3af]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#083865] transition-colors duration-200">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="hover:text-[#083865] transition-colors duration-200">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#083865] font-medium truncate max-w-[280px]">{blog.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Article ── */}
        <article className="bg-white py-10 sm:py-14 lg:py-16" aria-label="Blog article" ref={contentRef}>
          <div className="container-custom section-padding">
            {/* Cover Image */}
            <div className="anim-in relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 sm:mb-10">
              {blog.coverImage ? (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#083865]/10 to-[#1361A9]/10 flex items-center justify-center">
                  <span className="text-6xl" aria-hidden="true">📝</span>
                </div>
              )}
            </div>

            {/* Article Header */}
            <div className="max-w-3xl mx-auto">
              {/* Title */}
              <h1 className="anim-in heading-cambay text-[#111827] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
                {blog.title}
              </h1>

              {/* Meta */}
              <div className="anim-in flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#737373] mb-5">
                {blog.author && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    {blog.author}
                  </span>
                )}
                {blog.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {blog.views ?? 0} views
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {localLikes} likes
                </span>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="anim-in flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#083865]/5 text-[#083865]/70 border border-[#083865]/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="anim-in w-full h-px bg-[#e5e7eb] mb-8" aria-hidden="true" />

              {/* Content — rendered HTML */}
              <div
                className="anim-in blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
                style={{
                  lineHeight: 1.8,
                  color: "#374151",
                  fontSize: "1.0625rem",
                }}
              />

              {/* ── Blog content inline styles ── */}
              <style jsx global>{`
                .blog-content h1 {
                  font-family: "Cambay", sans-serif;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.025em;
                  font-size: 2rem;
                  color: #111827;
                  margin-top: 2.5rem;
                  margin-bottom: 1rem;
                  line-height: 1.3;
                }
                .blog-content h2 {
                  font-family: "Cambay", sans-serif;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.025em;
                  font-size: 1.5rem;
                  color: #111827;
                  margin-top: 2rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.35;
                }
                .blog-content h3 {
                  font-family: "Cambay", sans-serif;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.025em;
                  font-size: 1.25rem;
                  color: #111827;
                  margin-top: 1.75rem;
                  margin-bottom: 0.5rem;
                  line-height: 1.4;
                }
                .blog-content p { margin-bottom: 1.25rem; }
                .blog-content a {
                  color: #1361A9;
                  text-decoration: underline;
                  text-underline-offset: 2px;
                  transition: color 0.2s;
                }
                .blog-content a:hover { color: #083865; }
                .blog-content ul, .blog-content ol {
                  padding-left: 1.5rem;
                  margin-bottom: 1.25rem;
                }
                .blog-content ul { list-style-type: disc; }
                .blog-content ol { list-style-type: decimal; }
                .blog-content li { margin-bottom: 0.35rem; }
                .blog-content blockquote {
                  border-left: 3px solid #083865;
                  padding-left: 1.25rem;
                  margin: 1.5rem 0;
                  color: #6b7280;
                  font-style: italic;
                }
                .blog-content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 1rem;
                  margin: 1.5rem 0;
                }
                .blog-content pre {
                  background: #f3f4f6;
                  border-radius: 0.75rem;
                  padding: 1rem 1.25rem;
                  overflow-x: auto;
                  margin: 1.5rem 0;
                  font-size: 0.875rem;
                }
                .blog-content code {
                  background: #f3f4f6;
                  padding: 0.15rem 0.4rem;
                  border-radius: 0.25rem;
                  font-size: 0.875em;
                }
                .blog-content pre code { background: none; padding: 0; }
                .blog-content hr {
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 2rem 0;
                }
                .blog-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5rem 0;
                }
                .blog-content th, .blog-content td {
                  border: 1px solid #e5e7eb;
                  padding: 0.625rem 0.875rem;
                  text-align: left;
                }
                .blog-content th {
                  background: #f8fafc;
                  font-weight: 600;
                  color: #111827;
                }
              `}</style>

              {/* Sub-images gallery */}
              {blog.subImages?.length > 0 && (
                <div className="anim-in mt-10">
                  <h3 className="heading-cambay text-[#111827] text-lg mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {blog.subImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <Image
                          src={img}
                          alt={`${blog.title} gallery image ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Like & Share ── */}
              <div className="anim-in flex flex-wrap items-center gap-4 mt-10 pt-8 border-t border-[#e5e7eb]">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    liked
                      ? "bg-red-50 text-red-500 border border-red-200"
                      : "bg-[#f8fafc] border border-[#e5e7eb] text-[#737373] hover:border-[#083865]/30 hover:text-[#083865]"
                  }`}
                  aria-label={liked ? "Already liked" : "Like this article"}
                >
                  <svg
                    className="w-5 h-5"
                    fill={liked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={liked ? 0 : 1.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {liked ? "Liked!" : "Like"} ({localLikes})
                </button>

                <button
                  onClick={handleShare}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#f8fafc] border border-[#e5e7eb] text-[#737373] hover:border-[#083865]/30 hover:text-[#083865] transition-all duration-300"
                  aria-label="Share this article"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* ── Related Posts ── */}
        {relatedBlogs.length > 0 && (
          <section className="bg-[#f8fafc] py-12 sm:py-14 lg:py-16" aria-label="Related articles">
            <div className="container-custom section-padding">
              <div className="text-center mb-8">
                <span className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-4">
                  Keep Reading
                </span>
                <h2 className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3">
                  Related Articles
                </h2>
                <div className="w-14 h-[3px] bg-gradient-to-r from-[#083865] to-[#1361A9] mx-auto rounded-full" aria-hidden="true" />
              </div>

              <div
                ref={relatedRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {relatedBlogs.map((rb) => (
                  <Link key={rb.id} href={`/blog/${rb.slug}`} className="related-card group">
                    <article className="rounded-2xl border border-[#e5e7eb] shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.1)] hover:border-[#083865]/15 transition-all duration-500 overflow-hidden bg-white">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {rb.coverImage ? (
                          <Image
                            src={rb.coverImage}
                            alt={rb.title}
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
                      <div className="p-5 sm:p-6">
                        <p className="text-[#9ca3af] text-xs mb-2">
                          {rb.createdAt ? format(new Date(rb.createdAt), "MMM dd, yyyy") : "—"}
                        </p>
                        <h3 className="heading-cambay text-[#111827] text-lg leading-snug group-hover:text-[#083865] transition-colors duration-300 line-clamp-2">
                          {rb.title}
                        </h3>
                        {rb.author && (
                          <p className="text-[#737373] text-sm mt-2">By {rb.author}</p>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/blog"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[#083865] text-white text-sm font-semibold rounded-xl hover:bg-[#1361A9] transition-all duration-300"
                >
                  View All Articles
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
