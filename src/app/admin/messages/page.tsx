"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    fetchMessages();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-abby-black mb-8">Messages</h1>

      {loading && <p className="text-abby-black/50">Loading...</p>}

      {!loading && messages.length === 0 && (
        <div className="bg-white rounded-sm border border-abby-stone p-12 text-center">
          <Mail className="w-8 h-8 text-abby-stone mx-auto mb-3" />
          <p className="text-abby-black/50">No messages yet. Anything submitted through your Contact page will show up here.</p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="bg-white rounded-sm border border-abby-stone p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-abby-black">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-sm text-abby-gold hover:underline">
                  {m.email}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-abby-black/40">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => deleteMessage(m.id)}
                  className="p-1.5 text-abby-black/50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-abby-black/70 whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
