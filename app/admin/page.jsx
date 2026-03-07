"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { format } from "date-fns";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { hasPermission } from "@/lib/rbac";
import {
  Package,
  PenSquare,
  Mail,
  MessageSquareQuote,
  TrendingUp,
  Clock,
  ArrowRight,
  ShoppingCart,
  Layers,
} from "lucide-react";

function timeAgo(ts) {
  if (!ts) return "";
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60)    return "just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return format(date, "MMM d");
  } catch { return ""; }
}

function ActivityIcon({ type, isBulk }) {
  if (type === "product-inquiry") {
    return isBulk
      ? <Layers size={14} className="text-orange-600" />
      : <ShoppingCart size={14} className="text-sky-600" />;
  }
  return <Mail size={14} className="text-[#1361A9]" />;
}

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ products: 0, blogs: 0, inquiries: 0, quotes: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsSnap, blogsSnap, inquiriesSnap, quotesSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "blogs")),
          getDocs(query(collection(db, "inquiries"), where("status", "==", "new"))),
          getDocs(query(collection(db, "inquiries"), where("type", "==", "product-inquiry"), where("status", "==", "new"))),
        ]);
        setStats({
          products: productsSnap.size,
          blogs: blogsSnap.size,
          inquiries: inquiriesSnap.size,
          quotes: quotesSnap.size,
        });
      } catch (err) {
        console.error("fetchStats:", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchActivity() {
      try {
        const snap = await getDocs(
          query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(6))
        );
        setRecentActivity(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        // Fallback: no orderBy if index missing
        try {
          const snap = await getDocs(query(collection(db, "inquiries"), limit(20)));
          const sorted = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
            .slice(0, 6);
          setRecentActivity(sorted);
        } catch { /* silent */ }
      } finally {
        setActivityLoading(false);
      }
    }

    fetchStats();
    fetchActivity();
  }, []);

  const statCards = [
    { label: "Total Products",  value: stats.products,  icon: Package,            iconBg: "bg-blue-100",    iconColor: "text-[#1361A9]",   page: "products"  },
    { label: "Blog Posts",      value: stats.blogs,     icon: PenSquare,          iconBg: "bg-emerald-100", iconColor: "text-emerald-600", page: "blogs"     },
    { label: "New Inquiries",   value: stats.inquiries, icon: Mail,               iconBg: "bg-amber-100",   iconColor: "text-amber-600",   page: "inquiries" },
    { label: "New Quotes",      value: stats.quotes,    icon: MessageSquareQuote, iconBg: "bg-purple-100",  iconColor: "text-purple-600",  page: "quotes"    },
  ];

  const allQuickActions = [
    { label: "Add New Product",  href: "/admin/products",  icon: Package,            desc: "Add a product to your catalog",  page: "products"  },
    { label: "Write Blog Post",  href: "/admin/blog",      icon: PenSquare,          desc: "Create a new blog article",      page: "blogs"     },
    { label: "View Inquiries",   href: "/admin/inquiries", icon: Mail,               desc: "Check customer inquiries",       page: "inquiries" },
    { label: "View Quotes",      href: "/admin/quotes",    icon: MessageSquareQuote, desc: "Review quote requests",          page: "quotes"    },
  ];

  const quickActions = allQuickActions.filter((a) => hasPermission(role, a.page));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-dark">Welcome back</h2>
        <p className="text-brand-gray mt-1">
          Here&apos;s an overview of your website&apos;s current status.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards
          .filter((c) => hasPermission(role, c.page))
          .map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-brand-gray mb-1">{card.label}</p>
                    {loading ? (
                      <div className="h-8 w-16 bg-[#f3f4f6] rounded animate-pulse mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-brand-dark">{card.value}</p>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon size={20} className={card.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions — only shown when role has at least one action */}
        {quickActions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-brand-navy" />
              <h3 className="font-semibold text-brand-dark">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#f0f4f8] flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors">
                      <ActionIcon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-dark">{action.label}</p>
                      <p className="text-xs text-brand-gray">{action.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-brand-gray group-hover:text-brand-navy transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-brand-navy" />
              <h3 className="font-semibold text-brand-dark">Recent Activity</h3>
            </div>
            {hasPermission(role, "inquiries") && (
              <Link href="/admin/inquiries" className="text-xs text-[#1361A9] hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {activityLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-10" />
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-3">
                <Clock size={20} className="text-brand-gray" />
              </div>
              <p className="text-sm text-brand-gray">No activity yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((item) => {
                const isQuote  = item.type === "product-inquiry";
                const href = isQuote ? "/admin/quotes" : "/admin/inquiries";
                const accessible = hasPermission(role, isQuote ? "quotes" : "inquiries");
                return accessible ? (
                  <Link
                    key={item.id}
                    href={href}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isQuote ? (item.isBulk ? "bg-orange-50" : "bg-sky-50") : "bg-blue-50"
                    }`}>
                      <ActivityIcon type={item.type} isBulk={item.isBulk} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-dark truncate leading-snug">
                        {item.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-brand-gray truncate">
                        {isQuote
                          ? (item.isBulk ? `Bulk quote — ${item.productName || "multiple products"}` : `Quote: ${item.productName || "product"}`)
                          : (item.subject || item.message?.slice(0, 50) || "Contact inquiry")}
                      </p>
                    </div>
                    <span className="text-[11px] text-brand-gray flex-shrink-0 group-hover:text-[#1361A9] transition-colors">
                      {timeAgo(item.createdAt)}
                    </span>
                  </Link>
                ) : (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-xl"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isQuote ? (item.isBulk ? "bg-orange-50" : "bg-sky-50") : "bg-blue-50"
                    }`}>
                      <ActivityIcon type={item.type} isBulk={item.isBulk} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-dark truncate leading-snug">
                        {item.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-brand-gray truncate">
                        {isQuote
                          ? (item.isBulk ? `Bulk quote — ${item.productName || "multiple products"}` : `Quote: ${item.productName || "product"}`)
                          : (item.subject || item.message?.slice(0, 50) || "Contact inquiry")}
                      </p>
                    </div>
                    <span className="text-[11px] text-brand-gray flex-shrink-0">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


