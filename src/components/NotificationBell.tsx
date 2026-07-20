"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const SEEN_KEY = "abbydora-last-seen-announcement";

export function NotificationBell() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/announcements?published=true")
      .then((r) => r.json())
      .then((data: Announcement[]) => {
        if (!Array.isArray(data)) return;
        setAnnouncements(data);
        if (data.length > 0) {
          const lastSeen = window.localStorage.getItem(SEEN_KEY);
          setHasUnread(lastSeen !== data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    setOpen((prev) => !prev);
    if (announcements.length > 0) {
      window.localStorage.setItem(SEEN_KEY, announcements[0].id);
      setHasUnread(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        aria-label="Announcements"
        className="relative text-abby-black hover:text-abby-gold transition-colors"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-abby-gold rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-stone-200 shadow-lg rounded-sm z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-900">Announcements</p>
          </div>
          {announcements.length === 0 ? (
            <p className="text-sm text-stone-400 p-6 text-center">Nothing new right now.</p>
          ) : (
            <ul>
              {announcements.map((a) => (
                <li key={a.id} className="p-4 border-b border-stone-50 last:border-0">
                  <p className="text-sm font-medium text-stone-900">{a.title}</p>
                  <p className="text-sm text-stone-500 mt-1">{a.content}</p>
                  <p className="text-xs text-stone-300 mt-2">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
