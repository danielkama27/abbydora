"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function DangerZonePage() {
  const [selected, setSelected] = useState({
    orders: true,
    carts: true,
    wishlists: true,
    reviews: false,
    messages: false,
    customers: false,
  });
  const [confirmText, setConfirmText] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const toggle = (key: keyof typeof selected) => setSelected((s) => ({ ...s, [key]: !s[key] }));

  const anySelected = Object.values(selected).some(Boolean);
  const canRun = anySelected && confirmText === "RESET" && !running;

  async function handleReset() {
    if (!canRun) return;
    if (!confirm("This will permanently delete the selected data. Are you absolutely sure?")) return;

    setRunning(true);
    setResults(null);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selected, confirm: confirmText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setResults(data.results);
      setConfirmText("");
      toast.success("Reset complete.");
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setRunning(false);
    }
  }

  const options: { key: keyof typeof selected; label: string; desc: string }[] = [
    { key: "orders", label: "Orders & Sales", desc: "All orders, both online and in-store (POS), and their line items." },
    { key: "carts", label: "Shopping Carts", desc: "Everything currently sitting in any customer's cart." },
    { key: "wishlists", label: "Wishlists", desc: "Everything saved to any customer's wishlist." },
    { key: "reviews", label: "Product Reviews", desc: "All customer reviews and ratings." },
    { key: "messages", label: "Contact Messages", desc: "Everything submitted through your Contact page." },
    { key: "customers", label: "Customer Accounts", desc: "All non-admin accounts. Your own admin login is never touched. Note: this also removes that customer's orders/cart/wishlist automatically, even if those boxes above are unchecked." },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h1 className="font-serif text-3xl font-bold text-abby-black">Danger Zone</h1>
      </div>
      <p className="text-sm text-abby-black/50 mb-8">
        Permanently clear test/trial data before going live. Your <strong>Products</strong>,{" "}
        <strong>Collections</strong>, <strong>Settings</strong>, and <strong>Announcements</strong> are never
        touched by this tool — only transactional and account data. This cannot be undone.
      </p>

      <div className="bg-white rounded-sm border border-red-200 p-6 space-y-4">
        {options.map((opt) => (
          <label key={opt.key} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected[opt.key]}
              onChange={() => toggle(opt.key)}
              className="mt-1"
            />
            <div>
              <p className="text-sm font-semibold text-abby-black">{opt.label}</p>
              <p className="text-xs text-abby-black/50">{opt.desc}</p>
            </div>
          </label>
        ))}

        <div className="pt-4 border-t border-abby-stone">
          <label className="block text-sm text-abby-black/70 mb-2">
            Type <strong>RESET</strong> to confirm you want to permanently delete the checked data:
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="RESET"
            className="w-full px-4 py-3 border border-red-200 rounded-sm focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={!canRun}
          className="w-full py-3 bg-red-600 text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {running ? "Resetting..." : "Permanently Delete Selected Data"}
        </button>
      </div>

      {results && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-sm p-4">
          <p className="text-sm font-semibold text-green-800 mb-2">Done:</p>
          <ul className="text-sm text-green-700 space-y-1">
            {results.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
