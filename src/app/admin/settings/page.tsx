"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "ABBYDORA",
    tagline: "Heritage Style, Modern Aesthetics",
    contactEmail: "hello@abbydora.com",
    currency: "USD",
    shippingRate: "15",
    freeShippingThreshold: "200",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-8">Settings</h1>

      <div className="bg-white rounded-sm border border-abby-stone p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-abby-black mb-2">Site Name</label>
            <input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-abby-black mb-2">Tagline</label>
            <input
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-abby-black mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-abby-black mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-abby-black mb-2">Shipping Rate</label>
              <input
                type="number"
                value={settings.shippingRate}
                onChange={(e) => setSettings({ ...settings, shippingRate: e.target.value })}
                className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-abby-black mb-2">Free Shipping Threshold</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-abby-black text-abby-off-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-abby-black-soft transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
