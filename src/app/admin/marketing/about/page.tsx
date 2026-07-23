"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Stat {
  label: string;
  value: string;
}

const defaultBody = `Founded in 2024, AbbyDora was born from a simple belief: that quality fashion should be timeless, accessible, and thoughtfully made. We set out to create a curated collection of wardrobe essentials that transcend fleeting trends.

Every piece in our collection is carefully selected and crafted with attention to detail. From the sourcing of premium materials to the final stitching, we work with skilled artisans who share our commitment to excellence.

Our approach is rooted in sustainability. We prioritize eco-friendly fabrics, ethical production practices, and designs meant to last. We believe that the best wardrobe is one built on quality, not quantity.`;

const defaultStats: Stat[] = [
  { label: "Products", value: "500+" },
  { label: "Happy Customers", value: "10,000+" },
  { label: "Countries", value: "30+" },
];

export default function AboutMarketingPage() {
  const [title, setTitle] = useState("About AbbyDora");
  const [subtitle, setSubtitle] = useState("Our Story");
  const [body, setBody] = useState(defaultBody);
  const [stats, setStats] = useState<Stat[]>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.aboutTitle) setTitle(data.aboutTitle);
        if (data.aboutSubtitle) setSubtitle(data.aboutSubtitle);
        if (data.aboutBody) setBody(data.aboutBody);
        if (data.aboutStats) {
          try {
            const parsed = JSON.parse(data.aboutStats);
            if (Array.isArray(parsed) && parsed.length > 0) setStats(parsed);
          } catch {}
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function updateStat(index: number, field: "label" | "value", value: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addStat() {
    setStats((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeStat(index: number) {
    setStats((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        aboutTitle: title,
        aboutSubtitle: subtitle,
        aboutBody: body,
        aboutStats: JSON.stringify(stats.filter((s) => s.label.trim() && s.value.trim())),
      };
      let res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 405) {
        res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to save");
      toast.success("About page updated.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-abby-black/50">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-2">About Page</h1>
      <p className="text-sm text-abby-black/50 mb-8">
        Edit the content shown on your public "About" page. Changes apply immediately after saving.
      </p>

      <div className="bg-white rounded-sm border border-abby-stone p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-abby-black mb-2">Small Label (above title)</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Our Story"
            className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-abby-black mb-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="About AbbyDora"
            className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-abby-black mb-2">Body Text</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold font-mono text-sm"
          />
          <p className="text-xs text-abby-black/40 mt-1">Leave a blank line between paragraphs to separate them.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-abby-black mb-3">Stats Row</label>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={s.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="500+"
                  className="w-28 px-3 py-2 border border-abby-stone rounded-sm text-sm focus:outline-none focus:border-abby-gold"
                />
                <input
                  value={s.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="Products"
                  className="flex-1 px-3 py-2 border border-abby-stone rounded-sm text-sm focus:outline-none focus:border-abby-gold"
                />
                <button onClick={() => removeStat(i)} className="text-abby-black/30 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStat}
            className="inline-flex items-center gap-1.5 text-xs text-abby-black/60 hover:text-abby-black mt-3"
          >
            <Plus className="w-3.5 h-3.5" /> Add stat
          </button>
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
