"use client";

import { useEffect, useState } from "react";
import { Mail, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export default function NewsletterMarketingPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/newsletter")
      .then((r) => r.json())
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  function exportCsv() {
    const rows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.subscribedAt}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-3xl font-bold text-abby-black">Newsletter Subscribers</h1>
        {subscribers.length > 0 && (
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 border border-abby-stone rounded-sm hover:border-abby-gold transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>
      <p className="text-sm text-abby-black/50 mb-8">
        {subscribers.length} {subscribers.length === 1 ? "person has" : "people have"} joined your newsletter from the homepage signup form.
      </p>

      {loading && <p className="text-abby-black/50">Loading...</p>}

      {!loading && subscribers.length === 0 && (
        <div className="bg-white rounded-sm border border-abby-stone p-12 text-center">
          <Mail className="w-8 h-8 text-abby-stone mx-auto mb-3" />
          <p className="text-abby-black/50">No subscribers yet.</p>
        </div>
      )}

      {subscribers.length > 0 && (
        <div className="bg-white rounded-sm border border-abby-stone overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-abby-black/40 border-b border-abby-stone">
                <th className="py-3 pl-6 font-normal">Email</th>
                <th className="py-3 pr-6 font-normal">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-abby-stone/50 last:border-0">
                  <td className="py-3 pl-6 text-abby-black">{s.email}</td>
                  <td className="py-3 pr-6 text-abby-black/50">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
