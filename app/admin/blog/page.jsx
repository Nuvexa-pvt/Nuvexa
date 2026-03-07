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
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  ImagePlus,
  X,
  Loader2,
  Eye,
  Heart,
  Calendar,
  Tag,
  Check,
  AlertTriangle,
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Highlighter,
  Undo2,
  Redo2,
  Minus,
  Upload,
  GripVertical,
  FileText,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const formatDate = (timestamp) => {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const INITIAL_FORM = {
  title: "",
  slug: "",
  author: "",
  content: "",
  coverImage: "",
  subImages: [],
  tags: [],
  published: false,
};

// ─── TipTap Editor Styles ─────────────────────────────────────────────────────

const editorStyles = `
  .ProseMirror {
    min-height: 400px;
    outline: none;
    padding: 1.5rem;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
  .ProseMirror h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    line-height: 1.2;
  }
  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  .ProseMirror h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  .ProseMirror p {
    margin-bottom: 0.75rem;
    line-height: 1.7;
  }
  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .ProseMirror ul {
    list-style-type: disc;
  }
  .ProseMirror ol {
    list-style-type: decimal;
  }
  .ProseMirror li {
    margin-bottom: 0.25rem;
  }
  .ProseMirror blockquote {
    border-left: 3px solid #1361A9;
    padding-left: 1rem;
    margin-left: 0;
    margin-bottom: 0.75rem;
    color: #555;
    font-style: italic;
  }
  .ProseMirror a {
    color: #1361A9;
    text-decoration: underline;
    cursor: pointer;
  }
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 0.75rem 0;
  }
  .ProseMirror hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 1.5rem 0;
  }
  .ProseMirror mark {
    background-color: #fef08a;
    padding: 0.125rem 0.25rem;
    border-radius: 0.125rem;
  }
  .ProseMirror code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  .ProseMirror pre {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 0.75rem;
  }
  .ProseMirror pre code {
    background: none;
    padding: 0;
    color: inherit;
    font-size: 0.875rem;
  }
`;

// ─── Cover Image Dropzone ─────────────────────────────────────────────────────

function CoverImageDropzone({ preview, onDrop, disabled }) {
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
            alt="Cover preview"
            className="w-full max-w-md h-48 object-cover rounded-xl border border-[#e5e7eb]"
          />
          <p className="text-sm text-[#737373]">Drop or click to replace</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-6">
          <ImagePlus className="w-10 h-10 text-[#737373]" />
          <p className="text-sm font-medium text-[#111827]">
            Drop cover image here or click to browse
          </p>
          <p className="text-xs text-[#737373]">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}
    </div>
  );
}

// ─── Sub Images Dropzone ──────────────────────────────────────────────────────

function SubImagesDropzone({ previews, onDrop, onRemove, disabled }) {
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
          <Upload className="w-6 h-6 text-[#737373]" />
          <p className="text-sm text-[#737373]">
            Drop additional images or click to browse
          </p>
        </div>
      </div>
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img
                src={src}
                alt={`Sub image ${i + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-[#e5e7eb]"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(i);
                }}
                className="cursor-pointer absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TipTap Toolbar ───────────────────────────────────────────────────────────

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`cursor-pointer p-2 rounded-lg transition-colors ${
        active
          ? "bg-[#1361A9]/10 text-[#1361A9]"
          : "text-[#111827] hover:bg-[#e5e7eb]"
      } ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#e5e7eb] mx-1 self-center" />;
}

function EditorToolbar({ editor }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const storageRef = ref(
          storage,
          `blogs/editor-${Date.now()}-${file.name}`
        );
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image inserted");
      } catch {
        toast.error("Failed to upload image");
      }
    };
    input.click();
  };

  const colors = [
    "#111827",
    "#dc2626",
    "#ea580c",
    "#ca8a04",
    "#16a34a",
    "#1361A9",
    "#083865",
    "#7c3aed",
    "#db2777",
    "#737373",
  ];

  const highlightColors = [
    "#fef08a",
    "#bbf7d0",
    "#bfdbfe",
    "#fecaca",
    "#e9d5ff",
    "#fed7aa",
    "#fce7f3",
    "#d1fae5",
  ];

  return (
    <div className="sticky top-0 z-10 bg-[#f8fafc] border-b border-[#e5e7eb] px-3 py-2 flex flex-wrap gap-1 items-center">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Link */}
      <ToolbarButton
        onClick={addLink}
        active={editor.isActive("link")}
        title="Insert Link"
      >
        <Link2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Remove Link"
      >
        <Unlink className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Image */}
      <ToolbarButton onClick={addImage} title="Insert Image from URL">
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={handleImageUpload} title="Upload Image">
        <Upload className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Align */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Color */}
      <div className="relative">
        <ToolbarButton
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
          }}
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </ToolbarButton>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-2 grid grid-cols-5 gap-1 z-20">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColorPicker(false);
                }}
                className="cursor-pointer w-6 h-6 rounded-full border border-[#e5e7eb] hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setShowColorPicker(false);
              }}
              className="cursor-pointer col-span-5 text-xs text-[#737373] hover:text-[#111827] mt-1"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Highlight */}
      <div className="relative">
        <ToolbarButton
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
          }}
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-2 grid grid-cols-4 gap-1 z-20">
            {highlightColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color })
                    .run();
                  setShowHighlightPicker(false);
                }}
                className="cursor-pointer w-6 h-6 rounded-full border border-[#e5e7eb] hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
              className="cursor-pointer col-span-4 text-xs text-[#737373] hover:text-[#111827] mt-1"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function BlogListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex gap-4 animate-pulse"
        >
          <div className="w-24 h-20 bg-[#e5e7eb] rounded-lg shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-[#e5e7eb] rounded w-2/3" />
            <div className="h-4 bg-[#e5e7eb] rounded w-1/3" />
            <div className="flex gap-2">
              <div className="h-6 bg-[#e5e7eb] rounded-full w-16" />
              <div className="h-6 bg-[#e5e7eb] rounded-full w-20" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-8 w-8 bg-[#e5e7eb] rounded-lg" />
            <div className="h-8 w-8 bg-[#e5e7eb] rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({ blog, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111827] text-lg">
              Delete Blog Post
            </h3>
            <p className="text-sm text-[#737373]">This cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-[#111827] mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">&quot;{blog.title}&quot;</span>?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="cursor-pointer px-4 py-2 rounded-xl border border-[#e5e7eb] bg-white hover:bg-[#f8fafc] text-sm font-medium text-[#111827] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="cursor-pointer px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function AdminBlogPage() {
  // ── State ─────────────────────────────────────────────────────────────
  const [mode, setMode] = useState("list"); // "list" | "editor"
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [tagInput, setTagInput] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [subFiles, setSubFiles] = useState([]);
  const [subPreviews, setSubPreviews] = useState([]);

  // ── TipTap Editor ─────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your blog post...",
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none focus:outline-none",
      },
    },
  });

  // ── Fetch Blogs ───────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setBlogs(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ── All tags for filter dropdown ──────────────────────────────────────
  const allTags = useMemo(() => {
    const tagSet = new Set();
    blogs.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [blogs]);

  // ── Filtered blogs ───────────────────────────────────────────────────
  const filteredBlogs = useMemo(() => {
    let result = blogs;
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter((b) =>
        b.title?.toLowerCase().includes(s)
      );
    }
    if (filterTag) {
      result = result.filter((b) => b.tags?.includes(filterTag));
    }
    return result;
  }, [blogs, search, filterTag]);

  // ── Upload helpers ────────────────────────────────────────────────────
  const uploadImage = async (file, path) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  // ── Form helpers ──────────────────────────────────────────────────────
  const resetForm = () => {
    setForm({ ...INITIAL_FORM });
    setEditingId(null);
    setTagInput("");
    setCoverFile(null);
    setCoverPreview("");
    setSubFiles([]);
    setSubPreviews([]);
    if (editor) editor.commands.clearContent();
  };

  const openEditor = (blog = null) => {
    if (blog) {
      setEditingId(blog.id);
      setForm({
        title: blog.title || "",
        slug: blog.slug || "",
        author: blog.author || "",
        content: blog.content || "",
        coverImage: blog.coverImage || "",
        subImages: blog.subImages || [],
        tags: blog.tags || [],
        published: blog.published || false,
      });
      setCoverPreview(blog.coverImage || "");
      setSubPreviews(blog.subImages || []);
      setCoverFile(null);
      setSubFiles([]);
      setTagInput("");
      if (editor) {
        editor.commands.setContent(blog.content || "");
      }
    } else {
      resetForm();
    }
    setMode("editor");
  };

  const handleTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : generateSlug(title),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleCoverDrop = useCallback((file) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }, []);

  const handleSubImagesDrop = useCallback((acceptedFiles) => {
    setSubFiles((prev) => [...prev, ...acceptedFiles]);
    setSubPreviews((prev) => [
      ...prev,
      ...acceptedFiles.map((f) => URL.createObjectURL(f)),
    ]);
  }, []);

  const removeSubImage = useCallback(
    (index) => {
      // Determine if this index corresponds to an existing URL or a new file
      const existingCount = form.subImages.length;
      if (index < existingCount) {
        // Remove from existing subImages
        setForm((prev) => ({
          ...prev,
          subImages: prev.subImages.filter((_, i) => i !== index),
        }));
      } else {
        // Remove from new files
        const fileIndex = index - existingCount;
        setSubFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }
      setSubPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [form.subImages.length]
  );

  // ── Save / Update ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!form.author.trim()) {
      toast.error("Author is required");
      return;
    }

    const editorContent = editor?.getHTML() || "";
    if (
      !editorContent ||
      editorContent === "<p></p>" ||
      editorContent.trim() === ""
    ) {
      toast.error("Content cannot be empty");
      return;
    }

    setSaving(true);
    try {
      let coverUrl = form.coverImage;
      if (coverFile) {
        coverUrl = await uploadImage(
          coverFile,
          `blogs/cover-${Date.now()}-${coverFile.name}`
        );
      }

      // Upload new sub images
      const newSubUrls = await Promise.all(
        subFiles.map((f) =>
          uploadImage(f, `blogs/sub-${Date.now()}-${f.name}`)
        )
      );
      const finalSubImages = [...form.subImages, ...newSubUrls];

      const data = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        author: form.author.trim(),
        content: editorContent,
        coverImage: coverUrl,
        subImages: finalSubImages,
        tags: form.tags,
        published: form.published,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "blogs", editingId), data);
        toast.success("Blog post updated");
      } else {
        data.createdAt = serverTimestamp();
        data.likes = 0;
        data.views = 0;
        await addDoc(collection(db, "blogs"), data);
        toast.success("Blog post created");
      }

      resetForm();
      setMode("list");
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
      toast.error("Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Published ──────────────────────────────────────────────────
  const togglePublished = async (blog) => {
    try {
      await updateDoc(doc(db, "blogs", blog.id), {
        published: !blog.published,
        updatedAt: serverTimestamp(),
      });
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, published: !b.published } : b
        )
      );
      toast.success(
        blog.published ? "Post set to draft" : "Post published"
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Try to delete cover image from storage
      if (deleteTarget.coverImage) {
        try {
          const coverRef = ref(storage, deleteTarget.coverImage);
          await deleteObject(coverRef);
        } catch {
          // Ignore — image may not exist in storage
        }
      }
      // Try to delete sub images from storage
      if (deleteTarget.subImages?.length) {
        await Promise.allSettled(
          deleteTarget.subImages.map((url) => {
            try {
              return deleteObject(ref(storage, url));
            } catch {
              return Promise.resolve();
            }
          })
        );
      }
      await deleteDoc(doc(db, "blogs", deleteTarget.id));
      toast.success("Blog post deleted");
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog post");
    } finally {
      setDeleting(false);
    }
  };

  // ── Render: Editor Mode ───────────────────────────────────────────────
  if (mode === "editor") {
    return (
      <>
        <style>{editorStyles}</style>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                resetForm();
                setMode("list");
              }}
              className="cursor-pointer p-2 rounded-xl border border-[#e5e7eb] bg-white hover:bg-[#f8fafc] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#111827]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">
                {editingId ? "Edit Blog Post" : "New Blog Post"}
              </h1>
              <p className="text-sm text-[#737373]">
                {editingId
                  ? "Update your blog post details"
                  : "Create a new blog post"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="xl:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Blog post title"
                  className="w-full text-2xl font-bold text-[#111827] placeholder:text-[#adb5bd] border-0 outline-none bg-transparent"
                />
                <div className="flex items-center gap-2 mt-3 text-sm text-[#737373]">
                  <span>Slug:</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="flex-1 text-sm text-[#111827] border-0 border-b border-dashed border-[#e5e7eb] outline-none bg-transparent focus:border-[#1361A9] pb-0.5 transition-colors"
                  />
                </div>
              </div>

              {/* TipTap Editor */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  placeholder="Author name"
                  className="w-full rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#adb5bd] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
                />
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-[#1361A9]/10 text-[#1361A9] rounded-full px-3 py-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="cursor-pointer hover:text-[#083865] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Type tag and press Enter"
                    className="flex-1 rounded-xl border border-[#e5e7eb] px-3 py-2 text-sm text-[#111827] placeholder:text-[#adb5bd] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="cursor-pointer px-3 py-2 rounded-xl bg-white border border-[#e5e7eb] hover:bg-[#f8fafc] text-sm text-[#111827] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Cover Image
                </label>
                <CoverImageDropzone
                  preview={coverPreview}
                  onDrop={handleCoverDrop}
                  disabled={saving}
                />
              </div>

              {/* Sub Images */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Additional Images
                </label>
                <SubImagesDropzone
                  previews={subPreviews}
                  onDrop={handleSubImagesDrop}
                  onRemove={removeSubImage}
                  disabled={saving}
                />
              </div>

              {/* Publish Toggle */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-[#111827]">
                      Published
                    </label>
                    <p className="text-xs text-[#737373] mt-0.5">
                      {form.published
                        ? "Visible to readers"
                        : "Saved as draft"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        published: !prev.published,
                      }))
                    }
                    className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors ${
                      form.published ? "bg-emerald-500" : "bg-[#e5e7eb]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        form.published ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer w-full py-3 rounded-xl bg-[#083865] hover:bg-[#062d52] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingId ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {editingId ? "Update Post" : "Save Post"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Render: List Mode ─────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Blog Posts</h1>
            <p className="text-sm text-[#737373]">
              Manage your blog content
            </p>
          </div>
          <button
            onClick={() => openEditor()}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#083865] hover:bg-[#062d52] text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#111827] placeholder:text-[#adb5bd] focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all bg-white"
            />
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="cursor-pointer rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm text-[#111827] bg-white focus:ring-2 focus:ring-[#1361A9]/30 focus:border-[#1361A9] outline-none transition-all"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Blog list */}
        {loading ? (
          <BlogListSkeleton />
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-12 text-center">
            <FileText className="w-12 h-12 text-[#e5e7eb] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#111827] mb-1">
              {search || filterTag
                ? "No matching posts"
                : "No blog posts yet"}
            </h3>
            <p className="text-sm text-[#737373] mb-6">
              {search || filterTag
                ? "Try adjusting your filters"
                : "Create your first blog post to get started"}
            </p>
            {!search && !filterTag && (
              <button
                onClick={() => openEditor()}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#083865] hover:bg-[#062d52] text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {/* Cover thumbnail */}
                <div className="shrink-0">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full sm:w-28 h-24 object-cover rounded-lg border border-[#e5e7eb]"
                    />
                  ) : (
                    <div className="w-full sm:w-28 h-24 bg-[#f8fafc] rounded-lg border border-[#e5e7eb] flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#e5e7eb]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[#111827] text-base truncate">
                      {blog.title}
                    </h3>
                    <button
                      onClick={() => togglePublished(blog)}
                      className={`cursor-pointer shrink-0 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        blog.published
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-[#737373] hover:bg-gray-200"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </button>
                  </div>

                  <p className="text-sm text-[#737373] mt-1">
                    By {blog.author || "Unknown"}
                  </p>

                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#1361A9]/10 text-[#1361A9] rounded-full px-2.5 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#737373]">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {blog.views ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {blog.likes ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0 self-start">
                  <button
                    onClick={() => openEditor(blog)}
                    className="cursor-pointer p-2 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#f8fafc] text-[#111827] transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(blog)}
                    className="cursor-pointer p-2 rounded-lg border border-[#e5e7eb] bg-white hover:bg-red-50 text-[#111827] hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          blog={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}
