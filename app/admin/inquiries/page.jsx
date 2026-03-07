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
import {
  Search,
  Mail,
  Phone,
  Building2,
  Globe,
  Calendar,
  X,
  Trash2,
  ChevronDown,
  MessageSquareText,
  Inbox,
  User,
} from "lucide-react";

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

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-28" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-40" />
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="px-4 py-4 hidden sm:table-cell">
        <div className="h-4 bg-gray-200 rounded w-20" />
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
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      ))}
    </div>
  );
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "inquiries"));
      const docs = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((d) => !d.type || d.type !== "product-inquiry");

      docs.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });

      setInquiries(docs);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
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
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      toast.success("Inquiry deleted");
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      toast.error("Failed to delete inquiry");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

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

  const counts = useMemo(() => {
    const c = { all: inquiries.length, new: 0, responded: 0, closed: 0 };
    inquiries.forEach((inq) => {
      const s = inq.status || "new";
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [inquiries]);

  const filtered = useMemo(() => {
    let list = inquiries;
    if (statusFilter !== "all") {
      list = list.filter((inq) => (inq.status || "new") === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (inq) =>
          (inq.name || "").toLowerCase().includes(q) ||
          (inq.email || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [inquiries, statusFilter, search]);

  const TABS = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "responded", label: "Responded" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Contact Inquiries</h1>
        <p className="text-sm text-[#737373] mt-1">
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TABS.map((tab) => (
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
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-sm text-[#111827] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] transition-colors"
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

      {/* Table (desktop) */}
      {loading ? (
        <>
          <div className="hidden sm:block rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden lg:table-cell">Country</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden sm:table-cell">Date</th>
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
          <h3 className="text-base font-semibold text-[#111827] mb-1">No inquiries found</h3>
          <p className="text-sm text-[#737373]">
            {search
              ? "Try adjusting your search terms"
              : statusFilter !== "all"
                ? `No ${statusFilter} inquiries at the moment`
                : "Contact form submissions will appear here"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373] hidden lg:table-cell">Country</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[#737373]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    onClick={() => setSelectedInquiry(inq)}
                  >
                    <td className="px-4 py-3.5 font-medium text-[#111827]">
                      {inq.name || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#737373]">{inq.email || "—"}</td>
                    <td className="px-4 py-3.5 text-[#737373] hidden md:table-cell">
                      {inq.company || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#737373] hidden lg:table-cell">
                      {inq.country || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#737373]">
                      {formatDate(inq.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={inq.status || "new"} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Status dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setStatusDropdown(statusDropdown === inq.id ? null : inq.id)
                            }
                            disabled={updatingStatus === inq.id}
                            className="cursor-pointer p-1.5 rounded-lg text-[#737373] hover:text-[#111827] hover:bg-gray-100 transition-colors disabled:opacity-50"
                            title="Change status"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {statusDropdown === inq.id && (
                            <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl border border-[#e5e7eb] shadow-lg py-1 min-w-[140px]">
                              {STATUS_OPTIONS.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusUpdate(inq.id, s)}
                                  className={`cursor-pointer w-full text-left px-3 py-2 text-sm capitalize hover:bg-[#f8fafc] transition-colors ${
                                    (inq.status || "new") === s
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
                          onClick={() => setDeleteConfirm(inq.id)}
                          className="cursor-pointer p-1.5 rounded-lg text-[#737373] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete inquiry"
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
            {filtered.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className="cursor-pointer rounded-xl border border-[#e5e7eb] bg-white shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-[#111827]">{inq.name || "—"}</p>
                    <p className="text-xs text-[#737373]">{inq.email || "—"}</p>
                  </div>
                  <StatusBadge status={inq.status || "new"} />
                </div>
                <div className="flex items-center gap-3 text-xs text-[#737373]">
                  {inq.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {inq.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(inq.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Slide-over detail panel */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedInquiry(null);
              setStatusDropdown(null);
            }}
          />
          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111827]">Inquiry Details</h2>
              <button
                onClick={() => {
                  setSelectedInquiry(null);
                  setStatusDropdown(null);
                }}
                className="cursor-pointer p-1.5 rounded-lg text-[#737373] hover:text-[#111827] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status + Date header */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedInquiry.status || "new"} />
                <span className="text-xs text-[#737373]">
                  {formatDateTime(selectedInquiry.createdAt)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#083865]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#737373] mb-0.5">Name</p>
                    <p className="text-sm font-medium text-[#111827]">
                      {selectedInquiry.name || "—"}
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
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-sm font-medium text-[#1361A9] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {selectedInquiry.email || "—"}
                    </a>
                  </div>
                </div>

                {selectedInquiry.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-[#111827]">
                        {selectedInquiry.phone}
                      </p>
                    </div>
                  </div>
                )}

                {selectedInquiry.company && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] mb-0.5">Company</p>
                      <p className="text-sm font-medium text-[#111827]">
                        {selectedInquiry.company}
                      </p>
                    </div>
                  </div>
                )}

                {selectedInquiry.country && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#083865]/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-[#083865]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] mb-0.5">Country</p>
                      <p className="text-sm font-medium text-[#111827]">
                        {selectedInquiry.country}
                      </p>
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
                    {selectedInquiry.message || "No message provided."}
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
                      onClick={() => handleStatusUpdate(selectedInquiry.id, s)}
                      disabled={
                        updatingStatus === selectedInquiry.id ||
                        (selectedInquiry.status || "new") === s
                      }
                      className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        (selectedInquiry.status || "new") === s
                          ? "bg-[#083865] text-white"
                          : "bg-white border border-[#e5e7eb] text-[#111827] hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setDeleteConfirm(selectedInquiry.id)}
                  className="cursor-pointer w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Delete Inquiry</h3>
            <p className="text-sm text-[#737373] mb-6">
              Are you sure you want to delete this inquiry? This action cannot be undone.
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
