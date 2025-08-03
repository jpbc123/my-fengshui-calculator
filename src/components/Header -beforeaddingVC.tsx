import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gold/20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 no-underline hover:no-underline focus:no-underline">
          <div className="relative">
            <LogoIcon />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-xl font-bold text-gold">
            My Feng Shui Calculator
          </h1>
        </Link>

        {/* Dropdown Menus */}
        <nav className="hidden md:flex items-center gap-6 text-white font-medium relative z-50">
          {[
            {
              label: "Features",
              items: [
                { name: "Feng Shui Tips", href: "#" },
                { name: "Element Compatibility", href: "#" },
                { name: "Daily Quote / Motivation", href: "#" },
                { name: "Lucky Colors / Directions", href: "#" },
              ],
            },
            {
              label: "Calculator",
              items: [
                { name: "Chinese Zodiac", href: "#" },
                { name: "Visiber (Premium)", href: "#" },
                { name: "Daily Energy Chart", href: "#" },
              ],
            },
            {
              label: "Community",
              items: [
                { name: "Store", href: "#" },
                { name: "Community Chat", href: "#" },
              ],
            },
            {
              label: "About",
              items: [
                <a href="/my-fengshui-calculator/privacy-policy" className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors">Privacy Policy</a>,
                <a href="#" className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors">Terms & Conditions</a>,
                <a href="#" className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors">Contact Us</a>,
              ],
            },
          ].map((menu) => (
            <div key={menu.label} className="relative">
              <div className="peer cursor-pointer">{menu.label}</div>
              <div className="absolute top-full left-0 mt-2 min-w-60 rounded-md shadow-lg bg-gray-900 text-white opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200 py-1 z-50">
                {menu.items.map((item, idx) =>
                  typeof item === "string" || typeof item === "object" && item?.type === 'a' ? (
                    <div key={idx}>{item}</div>
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
            </div>
          ))}
        </nav>

        {/* Login / Get Started */}
        <div className="hidden md:flex gap-4">
          <button className="text-white hover:text-gold transition">Login</button>
          <button className="bg-gold text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
