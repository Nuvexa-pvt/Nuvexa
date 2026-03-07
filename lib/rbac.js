// ─── Role-Based Access Control ────────────────────────────────────────────────
//
//  admin     → all pages
//  company   → dashboard, products, inquiries, quotes (no blog)
//  marketing → dashboard, blogs (no products / inquiries / quotes)

export const ROLES = ["admin", "company", "marketing"];

export const ROLE_LABELS = {
  admin: "Admin",
  company: "Company",
  marketing: "Marketing",
};

export const ROLE_DESCRIPTIONS = {
  admin: "Full access to all pages and settings",
  company: "Products, inquiries & quotes — no blog access",
  marketing: "Blog management and dashboard only",
};

/** Map each page key → which roles are allowed */
export const PAGE_PERMISSIONS = {
  dashboard:   ["admin", "company", "marketing"],
  products:    ["admin", "company"],
  blogs:       ["admin", "marketing"],
  inquiries:   ["admin", "company"],
  quotes:      ["admin", "company"],
  permissions: ["admin"],
};

/** Check whether `role` can access `page` */
export function hasPermission(role, page) {
  if (!role) return false;
  return PAGE_PERMISSIONS[page]?.includes(role) ?? false;
}

/** Return the list of page keys a given role can access */
export function allowedPages(role) {
  if (!role) return [];
  return Object.entries(PAGE_PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([page]) => page);
}
