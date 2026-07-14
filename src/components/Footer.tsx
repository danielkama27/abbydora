import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
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
              Heritage luxury fashion redefined. Crafted with precision, worn with pride.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-abby-off-white/50 hover:text-abby-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-abby-off-white mb-4">
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
            <h4 className="font-serif text-lg font-semibold text-abby-off-white mb-4">
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
                +254 794 450644
              </li>
              <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                <Mail className="w-4 h-4 text-abby-gold" />
                abbydoraclothing@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-abby-off-white/50">
                <Clock className="w-4 h-4 text-abby-gold" />
                Open 6:00 AM – 8:00 PM GMT
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-abby-off-white/30">
            &copy; {new Date().getFullYear()} ABBYDORA. All rights reserved. Heritage Luxury Fashion.
          </p>
        </div>
      </div>
    </footer>
  );
}
