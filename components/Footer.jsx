"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Facebook01Icon, 
  InstagramIcon, 
  Linkedin01Icon, 
  TwitterIcon 
} from "hugeicons-react";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { name: "Customer service", href: "#" },
  { name: "PRODUCTS", href: "#products" },
  { name: "SUSTAINABILITY", href: "#" },
  { name: "BLOG", href: "#stories" },
  { name: "CONTACT US", href: "#" },
];

const socialLinks = [
  { icon: Facebook01Icon, href: "#", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: Linkedin01Icon, href: "#", label: "LinkedIn" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
];

export default function Footer() {
  const footerRef = useRef(null);
  const contentRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         contentRef.current,
//         { y: 60, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 1,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: footerRef.current,
//             start: "top 90%",
//             toggleActions: "play none none reverse",
//           },
//         }
//       );
//     }, footerRef);

//     return () => ctx.revert();
//   }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full bg-black pt-16 sm:pt-20 lg:pt-[83px] pb-8 sm:pb-12 rounded-t-[30px] sm:rounded-t-[40px] lg:rounded-t-[49px] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Image
          src="/dark pattern.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 container-custom section-padding w-full"
      >
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 w-full">
          {/* Logo and Social */}
          <div className="flex flex-col items-start lg:max-w-[360px]">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo white (1).png"
                alt="NUVEXA International"
                width={447}
                height={129}
                className="w-[200px] sm:w-[300px] lg:w-[350px] xl:w-[380px] h-auto"
              />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-[#8F8F8F] transition-all duration-300 hover:bg-white/20 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon size={18} className="sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* About and Links Section */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 lg:gap-16 w-full lg:w-max">
            {/* About Us */}
            <div className="max-w-[400px]">
              <h3 className="heading-cambay text-white text-xl sm:text-2xl mb-4">
                ABOUT US
              </h3>
              <p className="text-[#C7C7C7] text-sm sm:text-base font-medium leading-relaxed">
                Nuvexa International (Pvt) Ltd is a Sri Lanka–based export
                company delivering premium products to global markets through
                trusted partnerships, consistent quality, and reliable
                sourcing.
              </p>
            </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 lg:gap-16 w-full lg:w-max">
            {/* Navigation Links */}
            <div className="flex flex-col gap-3 sm:gap-4 ">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="heading-cambay text-white text-sm sm:text-base transition-colors duration-300 hover:text-[#1361A9]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#8F8F8F] text-sm sm:text-base">
              © {new Date().getFullYear()} NUVEXA International (Pvt) Ltd. All
              rights reserved.
            </p>
            {/* <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-[#8F8F8F] text-sm sm:text-base hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-[#8F8F8F] text-sm sm:text-base hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
