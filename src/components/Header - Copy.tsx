import { Coins } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-red-900 text-white border-b border-gold/20 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <LogoIcon />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-xl font-bold text-gold">
            My Feng Shui Calculator
          </h1>
        </div>

        {/* Optional: Add nav links or buttons here */}
        {/* <nav className="hidden md:flex gap-6">
          <a href="#about" className="text-white hover:text-gold transition">About</a>
          <a href="#report" className="text-white hover:text-gold transition">Report</a>
        </nav> */}
      </div>
    </header>
  );
}
