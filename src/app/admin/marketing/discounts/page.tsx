"use client";

import { useEffect, useState } from "react";
import { Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  active: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  timesUsed: number;
  createdAt: string;
}

export default function DiscountsMarketingPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const load = () => {
    fetch("/api/admin/discounts")
      .then((r) => r.json())
      .then((data) => setDiscounts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !value) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code, type, value,
          expiresAt: expiresAt || undefined,
          usageLimit: usageLimit || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create code");
      toast.success(`Code ${data.code} created.`);
      setCode(""); setValue(""); setExpiresAt(""); setUsageLimit("");
      load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create code");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(d: Discount) {
    await fetch(`/api/admin/discounts/${d.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !d.active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this discount code?")) return;
    await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-2">Discount Codes</h1>
      <p className="text-sm text-abby-black/50 mb-8">Create promo codes customers can enter at checkout.</p>

      <div className="bg-white rounded-sm border border-abby-stone p-6 max-w-2xl mb-8">
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-abby-black/70 mb-1">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE20"
              className="w-full px-4 py-2.5 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-abby-black/70 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
              className="w-full px-4 py-2.5 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            >
              <option value="percentage">Percentage off</option>
              <option value="fixed">Fixed amount off (KSh)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-abby-black/70 mb-1">
              Value {type === "percentage" ? "(%)" : "(KSh)"}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "percentage" ? "20" : "500"}
              className="w-full px-4 py-2.5 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-abby-black/70 mb-1">Usage Limit (optional)</label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Unlimited"
              className="w-full px-4 py-2.5 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-abby-black/70 mb-1">Expires On (optional)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-2.5 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="col-span-2 bg-abby-black text-abby-off-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-abby-black-soft transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Code"}
          </button>
        </form>
      </div>

      {loading && <p className="text-abby-black/50">Loading...</p>}
      {!loading && discounts.length === 0 && (
        <div className="bg-white rounded-sm border border-abby-stone p-12 text-center">
          <Tag className="w-8 h-8 text-abby-stone mx-auto mb-3" />
          <p className="text-abby-black/50">No discount codes yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {discounts.map((d) => (
          <div key={d.id} className="bg-white rounded-sm border border-abby-stone p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-mono font-semibold text-abby-black">{d.code}</p>
                <span className={`text-xs px-2 py-0.5 rounded-sm ${d.active ? "bg-green-50 text-green-600" : "bg-abby-stone text-abby-black/50"}`}>
                  {d.active ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-sm text-abby-black/60">
                {d.type === "percentage" ? `${d.value}% off` : `KSh ${d.value} off`}
                {d.usageLimit && ` · ${d.timesUsed}/${d.usageLimit} used`}
                {!d.usageLimit && d.timesUsed > 0 && ` · used ${d.timesUsed} times`}
                {d.expiresAt && ` · expires ${new Date(d.expiresAt).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(d)}
                className="text-xs px-3 py-1.5 border border-abby-stone rounded-sm hover:border-abby-black transition-colors"
              >
                {d.active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => handleDelete(d.id)} className="text-abby-black/40 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
