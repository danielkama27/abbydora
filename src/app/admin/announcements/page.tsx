"use client";

import { useEffect, useState } from "react";
import { Trash2, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => setAnnouncements(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, published: true }),
      });
      setTitle("");
      setContent("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(a: Announcement) {
    await fetch(`/api/admin/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !a.published }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-8">Announcements</h1>

      <div className="bg-white rounded-sm border border-abby-stone p-6 max-w-xl mb-8">
        <p className="text-sm font-semibold text-abby-black mb-4">Write a new announcement</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-abby-black/70 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Holiday Sale"
              className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-abby-black/70 mb-1">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. 20% off everything this weekend only!"
              rows={3}
              className="w-full px-4 py-3 border border-abby-stone rounded-sm focus:outline-none focus:border-abby-gold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-abby-black text-abby-off-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-abby-black-soft transition-colors disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish Announcement"}
          </button>
          <p className="text-xs text-abby-black/40">
            Only one announcement is shown to customers at a time — publishing a new one will replace whichever is currently live.
          </p>
        </form>
      </div>

      {loading && <p className="text-abby-black/50">Loading...</p>}

      {!loading && announcements.length === 0 && (
        <div className="bg-white rounded-sm border border-abby-stone p-12 text-center">
          <Megaphone className="w-8 h-8 text-abby-stone mx-auto mb-3" />
          <p className="text-abby-black/50">No announcements yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-sm border border-abby-stone p-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-abby-black">{a.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-sm ${a.published ? "bg-green-50 text-green-600" : "bg-abby-stone text-abby-black/50"}`}>
                  {a.published ? "Live" : "Hidden"}
                </span>
              </div>
              <p className="text-sm text-abby-black/60">{a.content}</p>
              <p className="text-xs text-abby-black/30 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => togglePublished(a)}
                className="text-xs px-3 py-1.5 border border-abby-stone rounded-sm hover:border-abby-black transition-colors"
              >
                {a.published ? "Hide" : "Show"}
              </button>
              <button onClick={() => handleDelete(a.id)} className="text-abby-black/40 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
