"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  Star,
  ImagePlus,
  X,
  Loader2,
  Package,
  Tag,
  FolderOpen,
  Check,
  AlertTriangle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ─── Sub-components ───────────────────────────────────────────────────────────

function MainImageDropzone({ preview, onDrop, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files[0]),
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
        isDragActive
          ? "border-[#1361A9] bg-[#1361A9]/5"
          : "border-[#e5e7eb] hover:border-[#1361A9]/40"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="flex flex-col items-center gap-3">
          <img
            src={preview}
            alt="Main preview"
            className="w-40 h-40 object-cover rounded-xl border border-[#e5e7eb]"
          />
          <p className="text-sm text-brand-gray">
            Drop or click to replace
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4">
          <ImagePlus className="w-10 h-10 text-brand-gray" />
          <p className="text-sm font-medium text-brand-dark">
            Drop main image here or click to browse
          </p>
          <p className="text-xs text-brand-gray">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}
    </div>
  );
}

function AdditionalImagesDropzone({ previews, onDrop, onRemove, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
          isDragActive
            ? "border-[#1361A9] bg-[#1361A9]/5"
            : "border-[#e5e7eb] hover:border-[#1361A9]/40"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-1 py-2">
          <ImagePlus className="w-7 h-7 text-brand-gray" />
          <p className="text-sm text-brand-gray">
            Drop additional images or click to browse
          </p>
        </div>
      </div>
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((p, i) => (
            <div key={i} className="relative group">
              <img
                src={p.url}
                alt={`Additional ${i + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-[#e5e7eb]"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-brand-gray mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-xl bg-white border border-[#e5e7eb] hover:bg-[#f8fafc] text-brand-dark transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-12" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-16" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
    </tr>
  );
}

// ─── Category Management Modal ────────────────────────────────────────────────

function CategoryManager({ open, onClose, categories, onCategoriesChanged, products }) {
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  if (!open) return null;

  const handleAdd = async () => {
    const label = newLabel.trim();
    if (!label) return;
    const id = generateSlug(label);
    if (categories.some((c) => c.id === id)) {
      toast.error("A category with this ID already exists");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "categories"), { id, label });
      toast.success("Category added");
      setNewLabel("");
      onCategoriesChanged();
    } catch (err) {
      toast.error("Failed to add category");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (cat) => {
    const label = editLabel.trim();
    if (!label) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "categories", cat.docId), {
        label,
        id: generateSlug(label),
      });
      toast.success("Category updated");
      setEditingId(null);
      setEditLabel("");
      onCategoriesChanged();
    } catch (err) {
      toast.error("Failed to update category");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    const usedBy = products.filter((p) => p.category === cat.id);
    if (usedBy.length > 0) {
      toast.error(`Cannot delete — ${usedBy.length} product(s) use this category`);
      return;
    }
    setDeletingId(cat.docId);
    try {
      await deleteDoc(doc(db, "categories", cat.docId));
      toast.success("Category deleted");
      onCategoriesChanged();
    } catch (err) {
      toast.error("Failed to delete category");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
            <Tag className="w-5 h-5" /> Manage Categories
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add new */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New category name..."
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newLabel.trim()}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-xl bg-[#083865] hover:bg-[#062d52] text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>

        {/* List */}
        {categories.length === 0 ? (
          <div className="text-center py-8 text-brand-gray text-sm">
            No categories yet. Add one above.
          </div>
        ) : (
          <ul className="divide-y divide-[#e5e7eb]">
            {categories.map((cat) => (
              <li key={cat.docId} className="flex items-center gap-3 py-3">
                {editingId === cat.docId ? (
                  <>
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none"
                      onKeyDown={(e) => e.key === "Enter" && handleEdit(cat)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(cat)}
                      disabled={saving}
                      className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditLabel(""); }}
                      className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-brand-dark">{cat.label}</span>
                      <span className="text-xs text-brand-gray ml-2">({cat.id})</span>
                    </div>
                    <button
                      onClick={() => { setEditingId(cat.docId); setEditLabel(cat.label); }}
                      className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-brand-gray transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      disabled={deletingId === cat.docId}
                      className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-brand-gray hover:text-red-500 transition-colors"
                    >
                      {deletingId === cat.docId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Page Component ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminProductsPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState("list"); // "list" | "add" | "edit"
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    rating: "5",
    featured: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]); // { file, url }
  const [existingImages, setExistingImages] = useState([]); // URLs from Firestore (edit mode)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // ─── Data Fetching ────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "products"));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(items);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "categories"));
      const items = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
      setCategories(items);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, [fetchProducts, fetchCategories]);

  // ─── Filtered Products ────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let list = products;
    if (filterCategory !== "all") {
      list = list.filter((p) => p.category === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, filterCategory, searchQuery]);

  // ─── Form Helpers ─────────────────────────────────────────────────────────

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", category: "", rating: "5", featured: false, tags: [] });
    setMainImageFile(null);
    setMainImagePreview("");
    setAdditionalFiles([]);
    setExistingImages([]);
    setEditingProduct(null);
    setSlugManuallyEdited(false);
    setTagInput("");
  };

  const handleNameChange = (name) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManuallyEdited ? f.slug : generateSlug(name),
    }));
  };

  const handleSlugChange = (slug) => {
    setSlugManuallyEdited(true);
    setForm((f) => ({ ...f, slug }));
  };

  const openAdd = () => {
    resetForm();
    if (categories.length > 0) {
      setForm((f) => ({ ...f, category: categories[0].id }));
    }
    setMode("add");
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      category: product.category || "",
      rating: String(product.rating || 5),
      featured: product.featured || false,
      tags: product.tags || [],
    });
    setMainImagePreview(product.mainImage || "");
    setMainImageFile(null);
    setExistingImages(product.images || []);
    setAdditionalFiles([]);
    setSlugManuallyEdited(true);
    setMode("edit");
  };

  const goBack = () => {
    resetForm();
    setMode("list");
  };

  // ─── Image Upload ─────────────────────────────────────────────────────────

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleMainImageDrop = (file) => {
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleAdditionalDrop = (files) => {
    const newFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setAdditionalFiles((prev) => [...prev, ...newFiles]);
  };

  const removeAdditionalFile = (index) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Save Product ────────────────────────────────────────────────────────

  const handleSave = async () => {
    // Validation
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    if (!mainImagePreview && !mainImageFile) {
      toast.error("Main image is required");
      return;
    }

    // Check slug uniqueness
    const slugConflict = products.find(
      (p) => p.slug === form.slug.trim() && p.id !== editingProduct?.id
    );
    if (slugConflict) {
      toast.error("A product with this slug already exists");
      return;
    }

    setSaving(true);

    try {
      // Upload main image if new file
      let mainImageUrl = mainImagePreview;
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile);
      }

      // Upload additional images
      const uploadedAdditional = await Promise.all(
        additionalFiles.map((f) => uploadImage(f.file))
      );

      const allImages = [...existingImages, ...uploadedAdditional];

      const productData = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        category: form.category,
        rating: parseInt(form.rating, 10),
        featured: form.featured,
        tags: form.tags,
        mainImage: mainImageUrl,
        images: allImages,
        updatedAt: serverTimestamp(),
      };

      if (mode === "add") {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, "products"), productData);
        toast.success("Product created successfully");
      } else {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
        toast.success("Product updated successfully");
      }

      await fetchProducts();
      goBack();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle Featured ──────────────────────────────────────────────────────

  const toggleFeatured = async (product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        featured: !product.featured,
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, featured: !p.featured } : p
        )
      );
      toast.success(
        product.featured ? "Removed from featured" : "Marked as featured"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update featured status");
    }
  };

  // ─── Delete Product ───────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Try to delete images from storage
      if (deleteTarget.mainImage) {
        try {
          const mainRef = ref(storage, deleteTarget.mainImage);
          await deleteObject(mainRef);
        } catch {
          // Ignore — image might not exist in storage
        }
      }
      if (deleteTarget.images?.length) {
        await Promise.allSettled(
          deleteTarget.images.map((url) => {
            try {
              const imgRef = ref(storage, url);
              return deleteObject(imgRef);
            } catch {
              return Promise.resolve();
            }
          })
        );
      }

      await deleteDoc(doc(db, "products", deleteTarget.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ─── Category label helper ───────────────────────────────────────────────

  const getCategoryLabel = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.label || id;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ─── RENDER: Add / Edit Form ──────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  if (mode === "add" || mode === "edit") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-[#e5e7eb] hover:bg-[#f8fafc] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-dark" />
          </button>
          <h1 className="text-xl font-semibold text-brand-dark">
            {mode === "add" ? "Add Product" : "Edit Product"}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-dark">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Ceylon Cinnamon Sticks"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-dark">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="ceylon-cinnamon-sticks"
                className="w-full px-3 py-2.5 rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all font-mono text-xs"
              />
              <p className="text-xs text-brand-gray">
                Auto-generated from name. Edit to customize.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-dark">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Describe the product..."
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all resize-none"
            />
          </div>

          {/* Category, Rating, Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-dark">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.docId} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-dark">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all bg-white"
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v} Star{v !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-dark">
                Featured
              </label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={`cursor-pointer w-full px-3 py-2.5 text-sm rounded-xl border transition-all flex items-center gap-2 ${
                  form.featured
                    ? "bg-[#083865] border-[#083865] text-white"
                    : "bg-white border-[#e5e7eb] text-brand-gray hover:bg-[#f8fafc]"
                }`}
              >
                <Star className={`w-4 h-4 ${form.featured ? "fill-white" : ""}`} />
                {form.featured ? "Featured" : "Not Featured"}
              </button>
            </div>
          </div>

          {/* Product Attribute Tags */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-dark">
              Attribute Badges
            </label>
            <p className="text-xs text-brand-gray">
              e.g. &quot;Premium Grade&quot;, &quot;Export Quality&quot;, &quot;Natural &amp; Pure&quot;. Press Enter or comma to add.
            </p>
            {/* Chips */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#083865]/8 border border-[#083865]/20 text-[#083865] text-xs font-semibold uppercase tracking-wide"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}
                      className="cursor-pointer text-[#083865]/60 hover:text-[#083865] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const val = tagInput.trim().replace(/,$/, "");
                    if (val && !form.tags.includes(val)) {
                      setForm((f) => ({ ...f, tags: [...f.tags, val] }));
                    }
                    setTagInput("");
                  }
                }}
                placeholder="Type a badge and press Enter"
                className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  const val = tagInput.trim();
                  if (val && !form.tags.includes(val)) {
                    setForm((f) => ({ ...f, tags: [...f.tags, val] }));
                  }
                  setTagInput("");
                }}
                className="cursor-pointer px-4 py-2.5 text-sm font-medium rounded-xl bg-[#083865]/8 hover:bg-[#083865]/15 border border-[#083865]/20 text-[#083865] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-dark">
              Main Image <span className="text-red-500">*</span>
            </label>
            <MainImageDropzone
              preview={mainImagePreview}
              onDrop={handleMainImageDrop}
              disabled={saving}
            />
          </div>

          {/* Additional Images */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-dark">
              Additional Images
            </label>
            {/* Existing images (edit mode) */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-brand-gray mb-2">Current images:</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url}
                        alt={`Existing ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-[#e5e7eb]"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <AdditionalImagesDropzone
              previews={additionalFiles}
              onDrop={handleAdditionalDrop}
              onRemove={removeAdditionalFile}
              disabled={saving}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
            <button
              onClick={goBack}
              disabled={saving}
              className="cursor-pointer px-5 py-2.5 text-sm font-medium rounded-xl bg-white border border-[#e5e7eb] hover:bg-[#f8fafc] text-brand-dark transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer px-6 py-2.5 text-sm font-medium rounded-xl bg-[#083865] hover:bg-[#062d52] text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "add" ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ─── RENDER: Product List ─────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-brand-dark">Products</h1>
          <p className="text-sm text-brand-gray mt-0.5">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="cursor-pointer px-4 py-2.5 text-sm font-medium rounded-xl bg-white border border-[#e5e7eb] hover:bg-[#f8fafc] text-brand-dark transition-colors flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Categories
          </button>
          <button
            onClick={openAdd}
            className="cursor-pointer px-4 py-2.5 text-sm font-medium rounded-xl bg-[#083865] hover:bg-[#062d52] text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all bg-white min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.docId} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
        {loading ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden sm:table-cell">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden sm:table-cell">Featured</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-brand-gray uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {searchQuery || filterCategory !== "all" ? (
                <Search className="w-7 h-7 text-brand-gray" />
              ) : (
                <Package className="w-7 h-7 text-brand-gray" />
              )}
            </div>
            <h3 className="text-base font-medium text-brand-dark mb-1">
              {searchQuery || filterCategory !== "all"
                ? "No products found"
                : "No products yet"}
            </h3>
            <p className="text-sm text-brand-gray mb-4 text-center max-w-sm">
              {searchQuery || filterCategory !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Get started by adding your first product to the catalog."}
            </p>
            {!searchQuery && filterCategory === "all" && (
              <button
                onClick={openAdd}
                className="cursor-pointer px-4 py-2.5 text-sm font-medium rounded-xl bg-[#083865] hover:bg-[#062d52] text-white transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden sm:table-cell">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider hidden sm:table-cell">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-brand-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#f8fafc] transition-colors"
                  >
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      {product.mainImage ? (
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-[#e5e7eb]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-brand-gray" />
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-brand-dark">
                        {product.name}
                      </p>
                      <p className="text-xs text-brand-gray font-mono">
                        {product.slug}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-[#083865]/5 text-[#083865]">
                        <FolderOpen className="w-3 h-3" />
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm text-brand-dark">
                          {product.rating || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                          product.featured
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-gray-100 text-brand-gray hover:bg-gray-200"
                        }`}
                      >
                        <Star
                          className={`w-3 h-3 ${
                            product.featured ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                        {product.featured ? "Featured" : "No"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#1361A9]/10 text-brand-gray hover:text-[#1361A9] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-brand-gray hover:text-red-500 transition-colors"
                          title="Delete"
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
        )}
      </div>

      {/* Product count */}
      {!loading && filteredProducts.length > 0 && (
        <p className="text-xs text-brand-gray text-right">
          Showing {filteredProducts.length} of {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone and will also remove associated images.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Category Manager Modal */}
      <CategoryManager
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onCategoriesChanged={() => fetchCategories()}
        products={products}
      />
    </div>
  );
}
