"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { logOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { hasPermission, ROLE_LABELS } from "@/lib/rbac";
import {
  LayoutDashboard,
  Package,
  PenSquare,
  Mail,
  MessageSquareQuote,
  Bell,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

// Every sidebar entry has a `page` key that matches PAGE_PERMISSIONS
const ALL_SIDEBAR_LINKS = [
  { label: "Dashboard",   href: "/admin",             icon: LayoutDashboard,    page: "dashboard"   },
  { label: "Products",    href: "/admin/products",     icon: Package,            page: "products"    },
  { label: "Blog Posts",  href: "/admin/blog",         icon: PenSquare,          page: "blogs"       },
  { label: "Inquiries",   href: "/admin/inquiries",    icon: Mail,               page: "inquiries"   },
  { label: "Quotes",        href: "/admin/quotes",         icon: MessageSquareQuote, page: "quotes"        },
  { label: "Notifications", href: "/admin/notifications",  icon: Bell,               page: "notifications" },
  { label: "Permissions",   href: "/admin/permissions",    icon: ShieldCheck,        page: "permissions"   },
];

// Which page key does a pathname map to?
function getPageKey(pathname) {
  if (pathname === "/admin") return "dashboard";
  if (pathname.startsWith("/admin/products"))    return "products";
  if (pathname.startsWith("/admin/blog"))        return "blogs";
  if (pathname.startsWith("/admin/inquiries"))   return "inquiries";
  if (pathname.startsWith("/admin/quotes"))        return "quotes";
  if (pathname.startsWith("/admin/notifications")) return "notifications";
  if (pathname.startsWith("/admin/permissions"))   return "permissions";
  return null;
}

function getPageTitle(pathname) {
  const link = ALL_SIDEBAR_LINKS.find((l) =>
    l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)
  );
  return link?.label || "Dashboard";
}

function AdminShell({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCounts, setNotifCounts] = useState({ inquiries: 0, quotes: 0 });

  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoginPage && !loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Fetch unread notification counts once role is confirmed
  useEffect(() => {
    if (!user || isLoginPage || !role) return;
    const fetchCounts = async () => {
      try {
        const [inqSnap, quoteSnap] = await Promise.all([
          getDocs(query(collection(db, "inquiries"), where("status", "==", "new"), where("type", "!=", "product-inquiry"))),
          getDocs(query(collection(db, "inquiries"), where("status", "==", "new"), where("type", "==", "product-inquiry"))),
        ]);
        setNotifCounts({ inquiries: inqSnap.size, quotes: quoteSnap.size });
      } catch {
        // best-effort
      }
    };
    fetchCounts();
  }, [user, role, isLoginPage]);

  // â”€â”€ Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-brand-navy border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-gray text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // â”€â”€ Not authenticated â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!user) return isLoginPage ? <>{children}</> : null;
  if (isLoginPage) return <>{children}</>;

  // â”€â”€ Awaiting role assignment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="heading-cambay text-2xl text-brand-dark mb-2">Awaiting Access</h1>
          <p className="text-brand-gray mb-2 text-sm">
            Your account <strong className="text-brand-dark">{user.email}</strong> has been registered.
          </p>
          <p className="text-brand-gray mb-6 text-sm">
            Please ask an admin to assign you a role before you can access the dashboard.
          </p>
          <button
            onClick={async () => {
              await logOut();
              router.replace("/admin/login");
            }}
            className="cursor-pointer w-full py-3 px-4 bg-brand-dark text-white rounded-xl font-medium text-sm hover:bg-[#1f2937] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Filter sidebar links by role â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sidebarLinks = ALL_SIDEBAR_LINKS.filter((l) => hasPermission(role, l.page));

  const pageTitle = getPageTitle(pathname);
  const currentPageKey = getPageKey(pathname);
  const canAccessCurrentPage = !currentPageKey || hasPermission(role, currentPageKey);

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#051e36] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Nuvexa"
              className="h-8 object-contain brightness-0 invert"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <span
              className="heading-cambay text-lg tracking-wider hidden"
              style={{ display: "none" }}
            >
              NUVEXA
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-2.5 border-b border-white/10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {ROLE_LABELS[role] ?? role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            const badgeCount =
              link.page === "inquiries" ? notifCounts.inquiries :
              link.page === "quotes"    ? notifCounts.quotes    : 0;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-blue rounded-r-full" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{link.label}</span>
                {badgeCount > 0 && !isActive && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold">
                {user.email?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.displayName || "Admin"}
              </p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await logOut();
              router.replace("/admin/login");
            }}
            className="cursor-pointer flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="cursor-pointer lg:hidden p-2 hover:bg-[#f3f4f6] rounded-xl transition-colors"
              >
                <Menu size={20} className="text-brand-dark" />
              </button>
              <h1 className="heading-cambay text-xl text-brand-dark">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold">
                  {user.email?.[0]?.toUpperCase() || "A"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content â€” or 403 if no permission */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {canAccessCurrentPage ? children : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="heading-cambay text-2xl text-brand-dark mb-2">Access Restricted</h2>
              <p className="text-brand-gray text-sm max-w-xs">
                Your <strong>{ROLE_LABELS[role]}</strong> role doesn&apos;t have permission to view this page.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
