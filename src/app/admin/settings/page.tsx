"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    freeShippingThreshold: "200",
    shippingRate: "15",
    instagramUrl: "",
    twitterUrl: "",
    facebookUrl: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          freeShippingThreshold: String(data.freeShippingThreshold ?? 200),
          shippingRate: String(data.shippingRate ?? 15),
          instagramUrl: data.instagramUrl || "",
          twitterUrl: data.twitterUrl || "",
          facebookUrl: data.facebookUrl || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.status === 405) {
        // Some hosting setups occasionally block PUT — retry with POST as a fallback.
        res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
      }
      if (res.ok) {
        setSaved(true);
        toast.success("Settings saved.");
        setTimeout(() => setSaved(false), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || `Failed to save (status ${res.status})`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-abby-black/50">Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-8">Settings</h1>

      <div className="bg-white rounded-sm border border-abby-stone p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-abby-black mb-2">Shipping Rate (KSh)</label>
              <input
                type="number"
                value={settings.shippingRate}
                onChange={(e) => setSettings({ ...settings, shippingRate: e.target.value })}
                className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-abby-black mb-2">Free Shipping Over (KSh)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-abby-stone">
            <p className="text-sm font-semibold text-abby-black mb-4">Social Links</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-abby-black/70 mb-2">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/abbydora"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-abby-black/70 mb-2">Twitter / X URL</label>
                <input
                  type="url"
                  placeholder="https://x.com/abbydora"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-abby-black/70 mb-2">Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/abbydora"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-abby-black text-abby-off-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-abby-black-soft transition-colors disabled:opacity-50"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
