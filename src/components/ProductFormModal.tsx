"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string; // JSON-stringified array, matches Prisma schema
}

interface ProductFormModalProps {
  initial?: Partial<ProductFormValues>;
  onClose: () => void;
  onSaved: () => void;
}

function parseImages(images?: string): string[] {
  try {
    const arr = JSON.parse(images || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function ProductFormModal({ initial, onClose, onSaved }: ProductFormModalProps) {
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [stock, setStock] = useState(initial?.stock?.toString() || "0");
  const [imageUrls, setImageUrls] = useState<string[]>(parseImages(initial?.images));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload ${file.name}`);
        uploaded.push(data.url);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    setImageUrls((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      description,
      price: parseFloat(price) || 0,
      category,
      stock: parseInt(stock) || 0,
      images: JSON.stringify(imageUrls),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/products/${initial!.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm">
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="font-serif text-xl text-stone-900">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-sm text-stone-600 mb-2">
              Product Images {imageUrls.length > 0 && `(${imageUrls.length})`}
            </label>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <div
                      className={`w-full aspect-square bg-stone-100 rounded-sm overflow-hidden border-2 ${
                        i === 0 ? "border-stone-900" : "border-transparent"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-stone-900 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                        Main
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => makePrimary(i)}
                          className="bg-white text-stone-900 text-[10px] px-1.5 py-1 rounded-sm"
                        >
                          Set Main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="bg-white text-red-600 p-1 rounded-sm"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" /> Add Images
                </>
              )}
            </Button>
            <p className="text-xs text-stone-400 mt-1">
              JPG or PNG, up to 5MB each. Select multiple files at once, or click again to add more. First image is the main photo — hover any other to set it as main.
            </p>
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-stone-600 mb-1">Price</label>
              <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Stock</label>
              <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Category</label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="rounded-none" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading} className="rounded-none bg-stone-900 hover:bg-stone-800 text-white">
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
