"use client";

import { usePathname } from "next/navigation";
import FloatingCart from "./FloatingCart";

export default function ConditionalFloatingCart() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <FloatingCart />;
}
