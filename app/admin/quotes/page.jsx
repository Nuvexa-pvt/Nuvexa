"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
  Search,
  Mail,
  Calendar,
  X,
  Trash2,
  ChevronDown,
  MessageSquareText,
  Inbox,
  User,
  Package,
  ExternalLink,
  ShoppingCart,
  Layers,
  Briefcase,
  Phone,
  MapPin,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["new", "responded", "closed"];

const STATUS_STYLES = {
  new: "bg-amber-100 text-amber-700 border border-amber-200",
  responded: "bg-blue-100 text-[#1361A9] border border-blue-200",
  closed: "bg-gray-100 text-[#737373] border border-gray-200",
};

const STATUS_DOT = {
  new: "bg-amber-500",
  responded: "bg-[#1361A9]",
  closed: "bg-[#737373]",
};

// isBulk is stored on the document itself (set at submission time)

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || STATUS_STYLES.new}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.new}`}
      />
      {status}
    </span>
  );
}

function CategoryBadge({ isBulk }) {
  return isBulk ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
      <Layers className="w-3 h-3" />
      Bulk
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
      <ShoppingCart className="w-3 h-3" />
      Single
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <div className="h-4 bg-gray-200 rounded w-36" />
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="px-4 py-4 hidden sm:table-cell">
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </td>
      <td className="px-4 py-4">
        <div className="h-5 bg-gray-200 rounded-full w-20" />
      </td>
      <td className="px-4 py-4">
        <div className="h-8 bg-gray-200 rounded w-16" />
      </td>
    </tr>
  );
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-[#e5e7eb] bg-white p-4 space-y-3"
        >
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-48" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "inquiries"));
      const docs = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((d) => d.type === "product-inquiry");

      docs.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });

      setQuotes(docs);
    } catch (err) {
      console.error("Error fetching quotes:", err);
      toast.error("Failed to load product quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
      if (selectedQuote?.id === id) {
        setSelectedQuote((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(null);
      setStatusDropdown(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "inquiries", id));
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
      toast.success("Quote request deleted");
    } catch (err) {
      console.error("Error deleting quote:", err);
      toast.error("Failed to delete quote");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  // ── Formatters ────────────────────────────────────────────────────────────

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM d, yyyy");
    } catch {
      return "—";
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "—";
    }
  };

  // ── Computed ──────────────────────────────────────────────────────────────

  const statusCounts = useMemo(() => {
    const c = { all: quotes.length, new: 0, responded: 0, closed: 0 };
    quotes.forEach((q) => {
      const s = q.status || "new";
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [quotes]);

  const categoryCounts = useMemo(() => {
    const c = { all: quotes.length, bulk: 0, single: 0 };
    quotes.forEach((q) => {
      if (q.isBulk === true) c.bulk++
      else c.single++;
    });
    return c;
  }, [quotes]);

  const filtered = useMemo(() => {
    let list = quotes;

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((q) => (q.status || "new") === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((q) => {
        const bulk = q.isBulk === true;
        return categoryFilter === "bulk" ? bulk : !bulk;
      });
    }

    // Search
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      list = list.filter(
        (q) =>
          (q.productName || "").toLowerCase().includes(term) ||
          (q.name || "").toLowerCase().includes(term) ||
          (q.email || "").toLowerCase().includes(term)
      );
    }

    return list;
  }, [quotes, statusFilter, categoryFilter, search]);

  // ── Tab configs ───────────────────────────────────────────────────────────

  const STATUS_TABS = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "responded", label: "Responded" },
    { key: "closed", label: "Closed" },
  ];

  const CATEGORY_TABS = [
    { key: "all", label: "All" },
    { key: "bulk", label: "Bulk" },
    { key: "single", label: "Single" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Product Quotes</h1>
        <p className="text-sm text-[#737373] mt-1">
          Manage product inquiry quotes and requests
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-[#083865] text-white shadow-sm"
                : "bg-white text-[#111827] border border-[#e5e7eb] hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-[#737373]"
              }`}
            >
              {statusCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-medium text-[#737373] uppercase tracking-wide mr-1">
          Category:
        </span>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              categoryFilter === tab.key
                ? "bg-[#1361A9] text-white shadow-sm"
                : "bg-white text-[#111827] border border-[#e5e7eb] hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                categoryFilter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-[#737373]"
              }`}
            >
              {categoryCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
        <input
          type="text"
          placeholder="Search by product, customer name, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm text-[#111827] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#111827]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <>
          <div className="hidden sm:block rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden">
            <SkeletonCards />
          </div>
        </>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm p-12 text-center">
          <Inbox className="w-12 h-12 text-[#737373] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111827] mb-1">No quotes found</h3>
          <p className="text-sm text-[#737373]">
            {search
              ? "Try adjusting your search terms"
              : statusFilter !== "all" || categoryFilter !== "all"
                ? "No quotes match the current filters"
                : "Product inquiry quotes will appear here"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    onClick={() => setSelectedQuote(q)}
                  >
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#083865]/5 text-[#083865] text-sm font-medium">
                        <Package className="w-3.5 h-3.5" />
                        {q.productName || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#111827]">
                      {q.name || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#737373] hidden md:table-cell">
                      {q.email || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#737373] hidden lg:table-cell">
                      {formatDate(q.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <CategoryBadge isBulk={q.isBulk === true} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={q.status || "new"} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Status dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setStatusDropdown(
                                statusDropdown === q.id ? null : q.id
                              )
                            }
                            disabled={updatingStatus === q.id}
                            className="cursor-pointer p-1.5 rounded-lg text-[#737373] hover:text-[#111827] hover:bg-gray-100 transition-colors disabled:opacity-50"
                            title="Change status"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {statusDropdown === q.id && (
                            <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl border border-[#e5e7eb] shadow-lg py-1 min-w-[140px]">
                              {STATUS_OPTIONS.map((s) => (
                                <button
                                  key={s}
                                  onClick={() =>
                                    handleStatusUpdate(q.id, s)
                                  }
                                  className={`cursor-pointer w-full text-left px-3 py-2 text-sm capitalize hover:bg-[#f8fafc] transition-colors ${
                                    (q.status || "new") === s
                                      ? "text-[#083865] font-medium"
                                      : "text-[#111827]"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirm(q.id)}
                          className="cursor-pointer p-1.5 rounded-lg text-[#737373] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete quote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelectedQuote(q)}
                className="cursor-pointer rounded-xl border border-[#e5e7eb] bg-white shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#083865]/5 text-[#083865] text-sm font-medium">
                    <Package className="w-3.5 h-3.5" />
                    {q.productName || "—"}
                  </span>
                  <StatusBadge status={q.status || "new"} />
                </div>
                <p className="text-sm font-medium text-[#111827] mb-0.5">
                  {q.name || "—"}
                </p>
                <p className="text-xs text-[#737373] mb-2">{q.email || "—"}</p>
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <CategoryBadge isBulk={q.isBulk === true} />
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(q.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Slide-over detail panel ──────────────────────────────────────────── */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedQuote(null);
              setStatusDropdown(null);
            }}
          />
          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111827]">
                Quote Details
              </h2>
              <button
                onClick={() => {
                  setSelectedQuote(null);
                  setStatusDropdown(null);
                }}
                className="cursor-pointer p-1.5 rounded-lg text-[#737373] hover:text-[#111827] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status + Category + Date */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedQuote.status || "new"} />
                  <CategoryBadge isBulk={selectedQuote.isBulk === true} />
                </div>
                <span className="text-xs text-[#737373]">
                  {formatDateTime(selectedQuote.createdAt)}
                </span>
              </div>

              {/* Product Info */}
              {selectedQuote.isBulk && selectedQuote.products?.length > 0 ? (
                /* Bulk order — list all products */
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373]">Products Requested</p>
                      <p className="text-sm font-medium text-[#111827]">{selectedQuote.products.length} item{selectedQuote.products.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#e5e7eb] overflow-hidden divide-y divide-[#e5e7eb]">
                    {selectedQuote.products.map((p, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-[#f8fafc] transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#111827] truncate">{p.name}</p>
                          {p.category && (
                            <p className="text-xs text-[#737373] capitalize mt-0.5">{p.category}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#083865] text-white text-xs font-bold">
                            ×{p.quantity ?? 1}
                          </span>
                          {p.slug && (
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#1361A9] hover:text-[#083865] transition-colors"
                              title="View product"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single product */
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-[#083865]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#737373] mb-0.5">Product</p>
                    <p className="text-sm font-medium text-[#111827]">
                      {selectedQuote.productName || "—"}
                    </p>
                    {selectedQuote.productSlug && (
                      <Link
                        href={`/products/${selectedQuote.productSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-[#1361A9] hover:underline mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View product page
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#083865]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#737373] mb-0.5">
                      Customer Name
                    </p>
                    <p className="text-sm font-medium text-[#111827]">
                      {selectedQuote.name || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#083865]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#737373] mb-0.5">Email</p>
                    <a
                      href={`mailto:${selectedQuote.email}`}
                      className="text-sm font-medium text-[#1361A9] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {selectedQuote.email || "—"}
                    </a>
                  </div>
                </div>

                {selectedQuote.company && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] mb-0.5">Company</p>
                      <p className="text-sm font-medium text-[#111827]">{selectedQuote.company}</p>
                    </div>
                  </div>
                )}

                {selectedQuote.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] mb-0.5">Phone</p>
                      <a
                        href={`tel:${selectedQuote.phone}`}
                        className="text-sm font-medium text-[#1361A9] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {selectedQuote.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedQuote.destination && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] mb-0.5">Destination / Country</p>
                      <p className="text-sm font-medium text-[#111827]">{selectedQuote.destination}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquareText className="w-4 h-4 text-[#737373]" />
                  <p className="text-xs font-medium text-[#737373] uppercase tracking-wide">
                    Message
                  </p>
                </div>
                <div className="rounded-xl bg-[#f8fafc] border border-[#e5e7eb] p-4">
                  <p className="text-sm text-[#111827] whitespace-pre-wrap leading-relaxed">
                    {selectedQuote.message || "No message provided."}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-[#e5e7eb] pt-5 space-y-3">
                <p className="text-xs font-medium text-[#737373] uppercase tracking-wide mb-2">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        handleStatusUpdate(selectedQuote.id, s)
                      }
                      disabled={
                        updatingStatus === selectedQuote.id ||
                        (selectedQuote.status || "new") === s
                      }
                      className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        (selectedQuote.status || "new") === s
                          ? "bg-[#083865] text-white"
                          : "bg-white border border-[#e5e7eb] text-[#111827] hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setDeleteConfirm(selectedQuote.id)}
                  className="cursor-pointer w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Delete Quote
            </h3>
            <p className="text-sm text-[#737373] mb-6">
              Are you sure you want to delete this quote request? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-[#111827] bg-white border border-[#e5e7eb] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting === deleteConfirm}
                className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting === deleteConfirm ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {statusDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setStatusDropdown(null)}
        />
      )}
    </div>
  );
}
