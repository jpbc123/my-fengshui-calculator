// src/components/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Menu, X } from "lucide-react";

const menuConfig = [
  {
    label: "Explore by Wisdom",
    items: [
      { name: "Feng Shui", href: "/feng-shui" },
      { name: "Numerology", href: "/numerology" },
      { name: "Astrology", href: "/astrology" },
    ],
  },
  {
    label: "Features",
    items: [
	  { name: "Articles", href: "#" },
      { name: "Daily Horoscope", href: "/daily-horoscope" },
      { name: "Lucky Numbers Generator", href: "#" },
    ],
  },
  {
    label: "Store",
    href: "/store", 
  },
  {
    label: "About",
    items: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gold/20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline hover:no-underline focus:no-underline"
        >
          <div className="relative">
            <LogoIcon />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red rounded-full animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-gold">Feng Shui & Beyond</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-white font-medium relative z-50">
          {menuConfig.map((menu) => (
            <div key={menu.label} className="relative">
              {menu.items ? (
                <>
                  <div className="peer cursor-pointer">{menu.label}</div>
                  <div className="absolute top-full left-0 mt-2 min-w-60 rounded-md shadow-lg bg-gray-900 text-white opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200 py-1 z-50">
                    {menu.items.map((item, idx) =>
                      item.isHeader ? (
                        <div
                          key={idx}
                          className="px-4 py-2 text-xs uppercase tracking-wider text-white/40 cursor-default select-none"
                        >
                          {item.name}
                        </div>
                      ) : item.href?.startsWith("/") ? (
                        <Link
                          key={idx}
                          to={item.href}
                          className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          key={idx}
                          href={item.href}
                          className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors"
                        >
                          {item.name}
                        </a>
                      )
                    )}
                  </div>
                </>
              ) : menu.href?.startsWith("/") ? (
                <Link
                  to={menu.href}
                  className="cursor-pointer hover:text-gold transition-colors"
                >
                  {menu.label}
                </Link>
              ) : (
                <a
                  href={menu.href}
                  className="cursor-pointer hover:text-gold transition-colors"
                >
                  {menu.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile hamburger icon */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Login / Get Started - Desktop */}
        <div className="hidden md:flex gap-4">
          <button className="text-white hover:text-gold transition">Login</button>
          <button className="bg-gold text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition">
            Get Started
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gold/20 text-white px-4 pb-6 pt-4 space-y-4">
          {menuConfig.map((menu) => (
            <div key={menu.label}>
              {menu.items ? (
                <>
                  <div
                    onClick={() => toggleDropdown(menu.label)}
                    className="cursor-pointer font-semibold flex justify-between items-center"
                  >
                    <span>{menu.label}</span>
                    <span>{openDropdown === menu.label ? "▲" : "▼"}</span>
                  </div>
                  {openDropdown === menu.label && (
                    <div className="pl-4 mt-2 space-y-1">
                      {menu.items.map((item, idx) =>
                        item.isHeader ? (
                          <div
                            key={idx}
                            className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none"
                          >
                            {item.name}
                          </div>
                        ) : item.href?.startsWith("/") ? (
                          <Link
                            key={idx}
                            to={item.href}
                            className="block text-sm text-white/90 hover:text-gold transition"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <a
                            key={idx}
                            href={item.href}
                            className="block text-sm text-white/90 hover:text-gold transition"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : menu.href?.startsWith("/") ? (
                <Link
                  to={menu.href}
                  className="block text-sm text-white/90 hover:text-gold transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {menu.label}
                </Link>
              ) : (
                <a
                  href={menu.href}
                  className="block text-sm text-white/90 hover:text-gold transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {menu.label}
                </a>
              )}
            </div>
          ))}

          {/* Mobile Login / Get Started */}
          <div className="pt-4 border-t border-gold/20 mt-4 space-y-2">
            <button className="w-full text-left text-white hover:text-gold transition">
              Login
            </button>
            <button className="w-full bg-gold text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
