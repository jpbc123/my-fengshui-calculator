import { Link } from "react-router-dom"; // ⬅️ Add this import
import LogoIcon from "@/components/LogoIcon";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gold/20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ⬇️ Logo + Title wrapped in Link */}
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
              items: ["Feature 1", "Feature 2", "Feature 3"],
            },
            {
              label: "Calculator",
              items: [
                "Chinese Zodiac",
                "Visiber (Premium)",
                "Daily Energy Chart",
                "Element Compatibility",
              ],
            },
            {
              label: "About",
              items: [
			  <a href="/my-fengshui-calculator/privacy-policy">Privacy Policy</a>,
			  "Terms & Conditions", "Contact Us"],
            },
            {
              label: "Community",
              items: ["Store", "Community Chat"],
            },
          ].map((menu) => (
            <div key={menu.label} className="relative">
              {/* Parent Hover Target */}
              <div className="peer cursor-pointer">{menu.label}</div>

              {/* Dropdown */}
              <div
                className="absolute top-full left-0 mt-2 min-w-48 rounded-md shadow-lg bg-gray-900 text-white opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200 py-1 z-50"
              >
                {menu.items.map((item, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block px-4 py-2 hover:bg-gold hover:text-black transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Login and Get Started */}
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
