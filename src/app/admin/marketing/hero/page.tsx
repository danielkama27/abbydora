"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function HeroMarketingPage() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
  const [promoText, setPromoText] = useState("");
  const [detailImageUrl, setDetailImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setMediaUrl(data.heroMediaUrl || "");
        setMediaType(data.heroMediaType || "");
        setPromoText(data.heroPromoText || "");
        setDetailImageUrl(data.detailImageUrl || "");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMediaUrl(data.url);
      setMediaType(data.type);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDetailFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDetail(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "detail-section");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDetailImageUrl(data.url);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploadingDetail(false);
      if (detailFileInputRef.current) detailFileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      let res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroMediaUrl: mediaUrl, heroMediaType: mediaType, heroPromoText: promoText, detailImageUrl }),
      });
      if (res.status === 405) {
        res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heroMediaUrl: mediaUrl, heroMediaType: mediaType, heroPromoText: promoText, detailImageUrl }),
        });
      }
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Homepage updated.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function clearHero() {
    setMediaUrl("");
    setMediaType("");
  }

  if (loading) return <p className="text-abby-black/50">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-2">Homepage Images</h1>
      <p className="text-sm text-abby-black/50 mb-8">
        The main hero at the top of your homepage, and the packaging/detail image further down the page.
      </p>

      <div className="bg-white rounded-sm border border-abby-stone p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-abby-black mb-3">Media</label>
          {mediaUrl ? (
            <div className="relative mb-4 rounded-sm overflow-hidden bg-abby-stone aspect-video">
              {mediaType === "video" ? (
                <video src={mediaUrl} className="w-full h-full object-cover" controls muted />
              ) : (
                <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
              )}
              {promoText && (
                <span className="absolute top-3 left-3 bg-abby-gold text-abby-black text-xs font-bold px-3 py-1.5 rounded-sm">
                  {promoText}
                </span>
              )}
            </div>
          ) : (
            <div className="mb-4 rounded-sm bg-abby-stone aspect-video flex items-center justify-center text-abby-black/30">
              No hero media set yet — the homepage will use its default layout.
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-abby-stone rounded-sm text-sm hover:border-abby-gold transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading..." : mediaUrl ? "Replace Media" : "Upload Image or Video"}
            </button>
            {mediaUrl && (
              <button type="button" onClick={clearHero} className="text-sm text-red-500 hover:underline">
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-abby-black/40 mt-2">Images up to 5MB, videos up to 50MB.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-abby-black mb-2">Promo Badge Text (optional)</label>
          <input
            value={promoText}
            onChange={(e) => setPromoText(e.target.value)}
            placeholder="e.g. 20% OFF, NEW ARRIVALS, LIMITED TIME"
            className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
          />
          <p className="text-xs text-abby-black/40 mt-1">Shown as a badge over the hero. Leave blank to hide it.</p>
        </div>

        <div className="pt-6 border-t border-abby-stone">
          <label className="block text-sm font-semibold text-abby-black mb-3">"The Detail Is The Design" Image</label>
          {detailImageUrl ? (
            <div className="relative mb-4 rounded-sm overflow-hidden bg-abby-stone aspect-square max-w-xs">
              <img src={detailImageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="mb-4 rounded-sm bg-abby-stone aspect-square max-w-xs flex items-center justify-center text-abby-black/30 text-center px-4">
              No image set yet — uses a default placeholder.
            </div>
          )}
          <input
            ref={detailFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDetailFileSelect}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => detailFileInputRef.current?.click()}
              disabled={uploadingDetail}
              className="inline-flex items-center gap-2 px-4 py-2 border border-abby-stone rounded-sm text-sm hover:border-abby-gold transition-colors disabled:opacity-50"
            >
              {uploadingDetail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingDetail ? "Uploading..." : detailImageUrl ? "Replace Image" : "Upload Image"}
            </button>
            {detailImageUrl && (
              <button type="button" onClick={() => setDetailImageUrl("")} className="text-sm text-red-500 hover:underline">
                Remove
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-abby-black text-abby-off-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-abby-black-soft transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
