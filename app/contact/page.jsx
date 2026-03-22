"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

// ─── Contact info data ─────────────────────────────────────────────────────

const contactDetails = [
  {
    id: "phone",
    label: "Phone",
    icon: (
      <svg className="w-5 h-5 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    lines: [
      { text: "(+94) 77 366 6365", href: "tel:+94773666365" },
      { text: "(+94) 77 891 0168", href: "tel:+94778910168" },
      { text: "(+94) 11 368 6996", href: "tel:+94113686996" },
    ],
  },
  {
    id: "email",
    label: "Email",
    icon: (
      <svg className="w-5 h-5 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    lines: [
      { text: "info@nuvexainternational.com", href: "mailto:info@nuvexainternational.com" },
    ],
  },
  {
    id: "address",
    label: "Office",
    icon: (
      <svg className="w-5 h-5 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    lines: [
      { text: "Sales & Marketing Office", href: null },
      { text: "No. 33, 1 Lane, Ratmalana,", href: null },
      { text: "Sri Lanka.", href: null },
    ],
  },
  {
    id: "hours",
    label: "Business Hours",
    icon: (
      <svg className="w-5 h-5 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    lines: [
      { text: "Mon – Fri: 9:00 AM – 6:00 PM", href: null },
      { text: "Saturday: 9:00 AM – 1:00 PM", href: null },
      { text: "Sunday: Closed", href: null },
    ],
  },
];

// ─── Initial form state ────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  message: "",
};

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const heroContentRef = useRef(null);
  const infoRef = useRef(null);
  const formSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance — set initial state via GSAP, not Tailwind
      gsap.set(heroContentRef.current, { y: 60, opacity: 0, filter: "blur(8px)" });
      gsap.to(heroContentRef.current, {
        y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out", delay: 0.4
      });

      // Contact info cards stagger — use gsap.from so GSAP controls initial state
      gsap.from(infoRef.current?.children, {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.01, ease: "power3.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Form section entrance
      gsap.from(formSectionRef.current, {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: formSectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Submission failed.");
      setSubmitted(true);
      setForm(INITIAL_FORM);
      toast.success("Your inquiry has been submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Contact page hero"
        className="relative w-full h-[50vh] min-h-[400px] max-h-[580px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/herobg.png"
            alt="Contact Nuvexa International"
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
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/85 text-xs font-medium tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1361A9]" aria-hidden="true" />
            Get in Touch
          </span>
          <h1 className="heading-cambay text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-tight max-w-[900px] mx-auto drop-shadow-2xl">
            Contact Us
          </h1>
          <p className="mt-3 text-white/70 text-sm sm:text-base max-w-[500px] mx-auto leading-relaxed font-light tracking-wide">
            Reach out to our team — we'd love to hear from you.
          </p>
        </div>

      </section>

      {/* ── Contact Info Cards ────────────────────────────────────────── */}
      <section
        aria-labelledby="contact-info-heading"
        className="relative w-full py-12 sm:py-14 lg:py-16 bg-[#f8fafc] overflow-hidden"
      >
        <div className="container-custom section-padding relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase text-[#083865]/60 font-medium mb-4">
              Our Location &amp; Details
            </span>
            <h2
              id="contact-info-heading"
              className="heading-cambay text-[#083865] text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3"
            >
              Our Contact Details
            </h2>
            <div className="w-14 h-[3px] bg-gradient-to-r from-[#083865] to-[#1361A9] mx-auto rounded-full" aria-hidden="true" />
          </div>

          <div
            ref={infoRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {contactDetails.map((detail) => (
              <article
                key={detail.id}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] hover:shadow-[0_16px_56px_-8px_rgba(8,56,101,0.1)] hover:border-[#083865]/15 transition-all duration-500"
                aria-labelledby={`contact-${detail.id}-label`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#083865]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#083865]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#083865]/12 transition-colors duration-300">
                    {detail.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs tracking-[0.2em] uppercase text-[#083865]/50 font-medium">
                      {detail.label}
                    </span>
                    <div className="mt-1.5 space-y-1">
                      {detail.lines.map((line, i) =>
                        line.href ? (
                          <a
                            key={i}
                            href={line.href}
                            className="block text-[#374151] text-sm leading-relaxed hover:text-[#083865] transition-colors duration-200 focus:outline-none focus:text-[#083865] truncate"
                          >
                            {line.text}
                          </a>
                        ) : (
                          <p key={i} className="text-[#737373] text-sm leading-relaxed">
                            {line.text}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ────────────────────────────────────────────────── */}
      <section
        ref={formSectionRef}
        aria-labelledby="inquiry-heading"
        className="relative w-full py-12 sm:py-14 lg:py-16 bg-white"
      >
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-start">

            {/* ── Inquiry Form ─────────────────────────────────────── */}
            <div className="group relative bg-white rounded-2xl p-8 sm:p-10 border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#083865]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative z-10">
                <span className="text-xs tracking-[0.2em] uppercase text-[#083865]/50 font-medium">
                  Send a Message
                </span>
                <h2
                  id="inquiry-heading"
                  className="heading-cambay text-[#083865] text-xl sm:text-2xl lg:text-3xl mt-2 mb-3"
                >
                  Inquiry Form
                </h2>
                <div className="w-14 h-[3px] bg-gradient-to-r from-[#083865] to-[#1361A9] mb-7 rounded-full" aria-hidden="true" />

                {submitted ? (
                  <div className="rounded-xl border border-[#083865]/10 bg-[#083865]/[0.03] p-8 text-center" role="alert" aria-live="polite">
                    <div className="w-16 h-16 rounded-2xl bg-[#083865]/8 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-[#083865]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="heading-cambay text-[#083865] text-xl sm:text-2xl mb-3">Inquiry Received!</h3>
                    <p className="text-[#737373] text-sm sm:text-base leading-relaxed mb-6">
                      Thank you for reaching out. Our team will get back to you within 1–2 business days.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[#083865] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-[#1361A9] focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 min-h-11"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate aria-label="Contact inquiry form" className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Full Name" id="name" name="name" type="text" placeholder="John Smith" value={form.name} onChange={handleChange} error={errors.name} required autoComplete="name" />
                      <FormField label="Email Address" id="email" name="email" type="email" placeholder="john@company.com" value={form.email} onChange={handleChange} error={errors.email} required autoComplete="email" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Phone Number" id="phone" name="phone" type="tel" placeholder="+94 77 000 0000" value={form.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" />
                      <FormField label="Company Name" id="company" name="company" type="text" placeholder="Acme Corp" value={form.company} onChange={handleChange} error={errors.company} autoComplete="organization" />
                    </div>
                    <FormField label="Country" id="country" name="country" type="text" placeholder="United States" value={form.country} onChange={handleChange} error={errors.country} autoComplete="country-name" />

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="block text-sm font-medium text-[#374151]">
                        Message <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us about your requirements, products of interest, or any questions you have..."
                        value={form.message}
                        onChange={handleChange}
                        required
                        aria-invalid={!!errors.message}
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-[#111827] text-sm placeholder:text-[#9ca3af] resize-none
                          focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/50
                          transition-colors duration-200
                          ${errors.message ? "border-red-400 focus:ring-red-200" : "border-[#e5e7eb] hover:border-[#083865]/25"}`}
                      />
                      {errors.message && (
                        <p role="alert" className="text-red-500 text-xs mt-1">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="cursor-pointer w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#083865] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-[#1361A9] hover:shadow-lg hover:shadow-[#083865]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#083865]/30 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none min-h-11"
                    >
                      {submitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-[#9ca3af] text-xs text-center">
                      We do not share your information with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* ── Side Panel ───────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Dark info block */}
              <div className="relative bg-[#083865] rounded-2xl p-8 sm:p-10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <Image src="/dark pattern.svg" alt="" fill className="object-cover" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#083865] via-[#0d4a7a] to-[#083865]" />
                <div className="relative z-10">
                  <span className="text-xs tracking-[0.2em] uppercase text-white/50 font-medium">
                    Direct Contact
                  </span>
                  <h3 className="heading-cambay text-white text-xl sm:text-2xl mt-2 mb-5">
                    We'd Love to Hear from You
                  </h3>
                  <div className="w-14 h-[3px] bg-gradient-to-r from-transparent via-white/40 to-transparent mb-7 rounded-full" aria-hidden="true" />
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8">
                    Whether you're a global buyer seeking premium Sri Lankan products or a local producer looking to expand internationally — let's start the conversation.
                  </p>
                  <a
                    href="mailto:info@nuvexainternational.com"
                    className="flex items-center gap-3 group/link"
                    aria-label="Email info@nuvexainternational.com"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover/link:bg-white/20 transition-colors duration-200">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm group-hover/link:text-white transition-colors duration-200">
                      info@nuvexainternational.com
                    </span>
                  </a>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden border border-[#083865]/8 shadow-[0_4px_24px_-4px_rgba(8,56,101,0.06)] aspect-[4/3] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5274226977196!2d79.88022!3d6.82299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae247bdc7e13a79%3A0x79efd0e41aaa3e7!2sRatmalana%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nuvexa International office location — Ratmalana, Sri Lanka"
                  aria-label="Map showing Nuvexa office in Ratmalana, Sri Lanka"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ─── FormField sub-component ───────────────────────────────────────────────

function FormField({ label, id, name, type, placeholder, value, onChange, error, required, autoComplete }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-[#374151]">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full min-h-11 px-4 py-2.5 bg-white border rounded-xl text-[#111827] text-sm placeholder:text-[#9ca3af]
          focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/50
          transition-colors duration-200
          ${error ? "border-red-400 focus:ring-red-200" : "border-[#e5e7eb] hover:border-[#083865]/25"}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
