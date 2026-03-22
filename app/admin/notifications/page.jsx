"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import {
  Bell,
  Plus,
  Trash2,
  Pencil,
  X,
  Mail,
  User,
  RefreshCw,
  Inbox,
} from "lucide-react";

export default function NotificationsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "notification-emails"));
      const docs = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime - aTime;
        });
      setEmails(docs);
    } catch (err) {
      console.error("fetchEmails:", err);
      toast.error("Failed to load notification emails");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  function openAdd() {
    setEditingId(null);
    setFormName("");
    setFormEmail("");
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(entry) {
    setEditingId(entry.id);
    setFormName(entry.name || "");
    setFormEmail(entry.email || "");
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    const email = formEmail.trim().toLowerCase();
    const name = formName.trim();

    if (!email) {
      setFormError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Check for duplicate (exclude current when editing)
    const duplicate = emails.find(
      (e) => e.email === email && e.id !== editingId
    );
    if (duplicate) {
      setFormError("This email is already in the notification list.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        await updateDoc(doc(db, "notification-emails", editingId), {
          name,
          email,
          updatedAt: serverTimestamp(),
        });
        setEmails((prev) =>
          prev.map((e) => (e.id === editingId ? { ...e, name, email } : e))
        );
        toast.success("Notification email updated");
      } else {
        const docRef = await addDoc(collection(db, "notification-emails"), {
          name,
          email,
          createdAt: serverTimestamp(),
        });
        setEmails((prev) => [{ id: docRef.id, name, email }, ...prev]);
        toast.success("Notification email added");
      }
      closeModal();
    } catch (err) {
      console.error("save error:", err);
      setFormError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "notification-emails", id));
      setEmails((prev) => prev.filter((e) => e.id !== id));
      toast.success("Notification email removed");
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
            <Bell size={22} className="text-brand-navy" /> Notification Emails
          </h2>
          <p className="text-brand-gray mt-1 text-sm">
            Manage the email addresses that get notified when a new inquiry or
            quote request comes in.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAdd}
            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-brand-navy text-white hover:bg-[#1361A9] transition-colors"
          >
            <Plus size={14} /> Add Email
          </button>
          <button
            onClick={fetchEmails}
            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[#e5e7eb] hover:bg-[#f8fafc] text-brand-dark transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
        <p className="text-sm text-[#1361A9]">
          <strong>How it works:</strong> Every email address listed below will
          receive a notification whenever a customer submits a contact inquiry or
          a product quote request. Notifications are sent simultaneously to all
          recipients.
        </p>
      </div>

      {/* Email list */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e5e7eb] bg-[#f8fafc] flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-dark">Recipients</p>
          <span className="text-xs text-brand-gray">
            {emails.length} {emails.length === 1 ? "email" : "emails"}
          </span>
        </div>

        {loading ? (
          <div className="space-y-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 border-b border-[#f3f4f6] animate-pulse"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-32" />
                </div>
                <div className="h-8 w-20 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-3">
              <Inbox size={20} className="text-brand-gray" />
            </div>
            <p className="text-sm font-medium text-brand-dark">
              No notification emails yet
            </p>
            <p className="text-xs text-brand-gray mt-1 max-w-xs">
              Add email addresses to start receiving notifications when new
              inquiries or quotes arrive.
            </p>
            <button
              onClick={openAdd}
              className="cursor-pointer mt-4 flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-brand-navy text-white hover:bg-[#1361A9] transition-colors"
            >
              <Plus size={14} /> Add First Email
            </button>
          </div>
        ) : (
          <ul>
            {emails.map((entry, idx) => (
              <li
                key={entry.id}
                className={`flex items-center gap-4 px-5 py-4 ${
                  idx < emails.length - 1 ? "border-b border-[#f3f4f6]" : ""
                } hover:bg-[#fafafa] transition-colors`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark truncate">
                    {entry.email}
                  </p>
                  {entry.name && (
                    <p className="text-xs text-brand-gray truncate mt-0.5">
                      {entry.name}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    title="Edit"
                    className="cursor-pointer p-1.5 rounded-lg text-brand-gray hover:text-[#1361A9] hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(entry.id)}
                    disabled={deleting === entry.id}
                    title="Remove"
                    className="cursor-pointer p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-gray hover:bg-[#f3f4f6] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                {editingId ? (
                  <Pencil size={18} className="text-brand-navy" />
                ) : (
                  <Plus size={18} className="text-brand-navy" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-dark">
                  {editingId ? "Edit Notification Email" : "Add Notification Email"}
                </h3>
                <p className="text-xs text-brand-gray">
                  {editingId
                    ? "Update the recipient details"
                    : "This email will receive all inquiry & quote notifications"}
                </p>
              </div>
            </div>

            {formError && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
                {formError}
              </p>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Recipient name{" "}
                  <span className="text-brand-gray font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray"
                  />
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-brand-dark placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray"
                  />
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-brand-dark placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer flex-1 py-2.5 border border-[#e5e7eb] text-sm text-brand-dark rounded-xl hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer flex-1 py-2.5 bg-brand-navy text-white text-sm rounded-xl font-medium hover:bg-[#1361A9] transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Saving…"
                    : editingId
                    ? "Update Email"
                    : "Add Email"}
                </button>
              </div>
            </form>
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
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Remove Email
            </h3>
            <p className="text-sm text-[#737373] mb-6">
              Are you sure you want to remove this email from notifications?
              They will no longer receive inquiry or quote alerts.
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
                {deleting === deleteConfirm ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
