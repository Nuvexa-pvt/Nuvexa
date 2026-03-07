"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, PAGE_PERMISSIONS } from "@/lib/rbac";
import { Shield, Trash2, RefreshCw, Check, ChevronDown, UserPlus, X, Mail } from "lucide-react";

// ── Helper ────────────────────────────────────────────────────────────────────
function initials(user) {
  const name = user.displayName || user.email || "?";
  return name
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function RoleBadge({ role }) {
  const colors = {
    admin:     "bg-red-100 text-red-700 border-red-200",
    company:   "bg-blue-100 text-[#1361A9] border-blue-200",
    marketing: "bg-emerald-100 text-emerald-700 border-emerald-200",
    null:      "bg-gray-100 text-gray-500 border-gray-200",
  };
  const label = role ? ROLE_LABELS[role] : "Pending";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[role] ?? colors.null}`}>
      {label}
    </span>
  );
}

const PAGE_KEYS = Object.keys(PAGE_PERMISSIONS);

// ── Component ─────────────────────────────────────────────────────────────────
export default function PermissionsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [pendingRoles, setPendingRoles] = useState({});
  const [saved, setSaved] = useState({});
  const [deleting, setDeleting] = useState({});

  // ── Invite modal state ───────────────────────────────────────────────────
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDisplayName, setInviteDisplayName] = useState("");
  const [inviteRole, setInviteRole] = useState("company");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteDone, setInviteDone] = useState(false);

  function openInvite() { setInviteEmail(""); setInviteDisplayName(""); setInviteRole("company"); setInviteError(""); setInviteDone(false); setInviteOpen(true); }
  function closeInvite() { setInviteOpen(false); }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
    } catch {
      // Fallback without orderBy
      try {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
      } catch (err) {
        console.error("fetchUsers:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleSaveRole(uid) {
    const newRole = pendingRoles[uid];
    if (!newRole) return;
    setSaving((s) => ({ ...s, [uid]: true }));
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
      setPendingRoles((p) => { const n = { ...p }; delete n[uid]; return n; });
      setSaved((s) => ({ ...s, [uid]: true }));
      setTimeout(() => setSaved((s) => { const n = { ...s }; delete n[uid]; return n; }), 2000);
    } catch (err) {
      console.error("saveRole:", err);
    } finally {
      setSaving((s) => { const n = { ...s }; delete n[uid]; return n; });
    }
  }

  async function handleDelete(uid) {
    if (!confirm("Remove this user's access? They can still log in but won't be able to use the admin panel.")) return;
    setDeleting((d) => ({ ...d, [uid]: true }));
    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      console.error("deleteUser:", err);
    } finally {
      setDeleting((d) => { const n = { ...d }; delete n[uid]; return n; });
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail) { setInviteError("Email is required."); return; }
    setInviteLoading(true);
    setInviteError("");
    try {
      // Create Firebase Auth user + send password reset email
      const displayName = inviteDisplayName.trim() || null;
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, displayName }),
      });
      const data = await res.json();
      if (!res.ok) { setInviteError(data.error || "Failed to create user."); return; }
      // Create Firestore user doc with the assigned role
      await setDoc(doc(db, "users", data.uid), {
        email: inviteEmail,
        displayName,
        role: inviteRole,
        createdAt: serverTimestamp(),
      });
      setUsers((prev) => [{ uid: data.uid, email: inviteEmail, role: inviteRole, displayName }, ...prev]);
      setInviteDone(true);
    } catch (err) {
      setInviteError("Unexpected error. Please try again.");
      console.error(err);
    } finally {
      setInviteLoading(false);
    }
  }

  // ── Role permissions table data ──────────────────────────────────────────
  const roleMatrix = ROLES.map((role) => ({
    role,
    pages: PAGE_KEYS.filter((page) => PAGE_PERMISSIONS[page].includes(role)),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
            <Shield size={22} className="text-brand-navy" /> Permissions
          </h2>
          <p className="text-brand-gray mt-1 text-sm">
            Manage admin access roles for each user. New users appear here automatically after their first login attempt.
          </p>
        </div>
        <button
          onClick={openInvite}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-brand-navy text-white hover:bg-[#1361A9] transition-colors"
        >
          <UserPlus size={14} /> Invite User
        </button>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[#e5e7eb] hover:bg-[#f8fafc] text-brand-dark transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Role reference card */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e5e7eb] bg-[#f8fafc]">
          <p className="text-sm font-semibold text-brand-dark">Role Permissions Reference</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wide w-32">Role</th>
                {PAGE_KEYS.map((page) => (
                  <th key={page} className="text-center px-3 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wide capitalize">{page}</th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wide">Description</th>
              </tr>
            </thead>
            <tbody>
              {roleMatrix.map(({ role, pages }) => (
                <tr key={role} className="border-b border-[#f3f4f6] last:border-0">
                  <td className="px-5 py-3"><RoleBadge role={role} /></td>
                  {PAGE_KEYS.map((page) => (
                    <td key={page} className="text-center px-3 py-3">
                      {pages.includes(page)
                        ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100"><Check size={11} className="text-emerald-600" /></span>
                        : <span className="text-gray-300 text-base">—</span>}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-xs text-brand-gray">{ROLE_DESCRIPTIONS[role]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e5e7eb] bg-[#f8fafc] flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-dark">Users</p>
          <span className="text-xs text-brand-gray">{users.length} {users.length === 1 ? "user" : "users"}</span>
        </div>

        {loading ? (
          <div className="space-y-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#f3f4f6] animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-32" />
                </div>
                <div className="h-8 w-32 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-3">
              <Shield size={20} className="text-brand-gray" />
            </div>
            <p className="text-sm font-medium text-brand-dark">No users yet</p>
            <p className="text-xs text-brand-gray mt-1">Users will appear here when they first log in to the admin panel.</p>
          </div>
        ) : (
          <ul>
            {users.map((user, idx) => {
              const isDirty  = pendingRoles[user.uid] !== undefined;
              const isSaving = saving[user.uid];
              const wasSaved = saved[user.uid];
              const isDeleting = deleting[user.uid];

              return (
                <li
                  key={user.uid}
                  className={`flex items-center gap-4 px-5 py-4 ${idx < users.length - 1 ? "border-b border-[#f3f4f6]" : ""} hover:bg-[#fafafa] transition-colors`}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{initials(user)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-brand-dark truncate">{user.email}</p>
                      {user.role === null || user.role == null ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
                          Awaiting role
                        </span>
                      ) : (
                        <RoleBadge role={user.role} />
                      )}
                    </div>
                    {user.displayName && (
                      <p className="text-xs text-brand-gray truncate mt-0.5">{user.displayName}</p>
                    )}
                  </div>

                  {/* Role selector */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative">
                      <select
                        value={pendingRoles[user.uid] ?? user.role ?? ""}
                        onChange={(e) =>
                          setPendingRoles((p) => ({ ...p, [user.uid]: e.target.value || null }))
                        }
                        className="appearance-none cursor-pointer text-sm px-3 py-1.5 pr-8 border border-[#e5e7eb] rounded-lg bg-white text-brand-dark hover:border-[#1361A9] focus:outline-none focus:ring-2 focus:ring-[#1361A9]/20 focus:border-[#1361A9] transition-colors"
                      >
                        <option value="">— No role —</option>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
                    </div>

                    <button
                      onClick={() => handleSaveRole(user.uid)}
                      disabled={!isDirty || isSaving}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                        wasSaved
                          ? "bg-emerald-100 text-emerald-700 cursor-default"
                          : isDirty
                          ? "bg-brand-navy text-white hover:bg-[#1361A9]"
                          : "bg-[#f3f4f6] text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isSaving ? "Saving…" : wasSaved ? "Saved ✓" : "Save"}
                    </button>

                    <button
                      onClick={() => handleDelete(user.uid)}
                      disabled={isDeleting}
                      title="Remove user access"
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Invite User Modal ───────────────────────────────────────────────── */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={closeInvite} className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-gray hover:bg-[#f3f4f6] transition-colors"><X size={16} /></button>

            {inviteDone ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-2">Invitation sent!</h3>
                <p className="text-sm text-brand-gray mb-1">An account was created for</p>
                <p className="text-sm font-semibold text-brand-dark">{inviteEmail}</p>
                <p className="text-xs text-brand-gray mt-2 mb-5">They&apos;ll receive a password-reset email to set their password and can then log in.</p>
                <div className="flex gap-2">
                  <button onClick={() => { setInviteDone(false); setInviteEmail(""); setInviteDisplayName(""); setInviteRole("company"); }} className="cursor-pointer flex-1 py-2.5 border border-[#e5e7eb] text-sm text-brand-dark rounded-xl hover:bg-[#f8fafc] transition-colors">Invite another</button>
                  <button onClick={closeInvite} className="cursor-pointer flex-1 py-2.5 bg-brand-navy text-white text-sm rounded-xl hover:bg-[#1361A9] transition-colors">Done</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center"><UserPlus size={18} className="text-brand-navy" /></div>
                  <div>
                    <h3 className="text-base font-bold text-brand-dark">Invite User</h3>
                    <p className="text-xs text-brand-gray">Create an account and assign a role</p>
                  </div>
                </div>

                {inviteError && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{inviteError}</p>
                )}

                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Display name</label>
                    <input
                      type="text"
                      value={inviteDisplayName}
                      onChange={(e) => setInviteDisplayName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-brand-dark placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Email address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-brand-dark placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Role</label>
                    <div className="relative">
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full appearance-none cursor-pointer text-sm px-4 py-2.5 pr-9 border border-[#e5e7eb] rounded-xl bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-[#083865]/25 focus:border-[#083865]/40 transition-all"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]} — {ROLE_DESCRIPTIONS[r]}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
                    </div>
                  </div>

                  <p className="text-xs text-brand-gray bg-[#f8fafc] rounded-lg px-3 py-2">
                    A password-reset email will be sent automatically so the user can set their own password.
                  </p>

                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={closeInvite} className="cursor-pointer flex-1 py-2.5 border border-[#e5e7eb] text-sm text-brand-dark rounded-xl hover:bg-[#f8fafc] transition-colors">Cancel</button>
                    <button type="submit" disabled={inviteLoading} className="cursor-pointer flex-1 py-2.5 bg-brand-navy text-white text-sm rounded-xl font-medium hover:bg-[#1361A9] transition-colors disabled:opacity-50">
                      {inviteLoading ? "Creating…" : "Create & Invite"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
