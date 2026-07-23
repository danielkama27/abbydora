"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Instagram, Twitter, Facebook, Youtube, Linkedin, MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react";

interface FooterSettings {
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
  pinterestUrl?: string | null;
  whatsappNumber?: string | null;
}

function whatsappLink(number: string): string {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-abby-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-abby-off-white tracking-wider">
              ABBYDORA
            </h3>
            <p className="text-sm text-abby-off-white/50 leading-relaxed">
              Excellentia et traditio. An old-world tailor's atelier for the modern streetwear crowd.
            </p>
            <div className="flex flex-wrap gap-4">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
            {(settings.tiktokUrl || settings.pinterestUrl) && (
              <div className="flex gap-4 text-xs">
                {settings.tiktokUrl && (
                  <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                    TikTok
                  </a>
                )}
                {settings.pinterestUrl && (
                  <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                    Pinterest
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-abby-slate-blue mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {["Home", "Shop", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm text-abby-off-white/50 hover:text-abby-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-abby-gold mb-4">
              Collections
            </h4>
            <ul className="space-y-2">
              {["T-Shirts", "Hoodies", "Polo Shirts", "Trousers", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/shop?category=${item}`}
                    className="text-sm text-abby-off-white/50 hover:text-abby-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-abby-off-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                <MapPin className="w-4 h-4 text-abby-gold" />
                Kahawa Sukari Avenue, Nairobi
              </li>
              <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                <Phone className="w-4 h-4 text-abby-gold" />
                +254 794 450664
              </li>
              <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                <Mail className="w-4 h-4 text-abby-gold" />
                abbydoraclothing@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                <Clock className="w-4 h-4 text-abby-gold" />
                Open 6:00 AM – 8:00 PM GMT
              </li>
              {settings.whatsappNumber && (
                <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                  <MessageCircle className="w-4 h-4 text-abby-gold" />
                  <a href={whatsappLink(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="hover:text-abby-gold transition-colors">
                    {settings.whatsappNumber}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-abby-off-white/30">
            &copy; {new Date().getFullYear()} ABBYDORA. All rights reserved.
          </p>
          <p className="text-xs text-abby-off-white/30 tracking-widest uppercase">
            Sophisticated. Structural. Timeless.
          </p>
        </div>
      </div>
    </footer>
  );
}
