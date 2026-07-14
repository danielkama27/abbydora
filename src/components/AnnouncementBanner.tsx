"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface Announcement {
  id: string;
  title: string;
  content: string;
  bannerImage?: string;
}

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcements?published=true")
      .then((r) => r.json())
      .then((data) => setAnnouncements(data));
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="relative bg-abby-gold text-abby-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            {current.bannerImage && (
              <div className="relative w-8 h-8 rounded overflow-hidden hidden sm:block">
                <Image src={current.bannerImage} alt="" fill className="object-cover" />
              </div>
            )}
            <p className="text-sm font-medium">
              <span className="font-semibold">{current.title}</span>
              {current.content && (
                <span className="hidden sm:inline"> — {current.content}</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-abby-black/60 hover:text-abby-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-abby-black/20">
        <div
          className="h-full bg-abby-black/40 transition-all duration-[6000ms] ease-linear"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
