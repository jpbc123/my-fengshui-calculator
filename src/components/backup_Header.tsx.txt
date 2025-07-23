import { Coins } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gold/20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Coins className="h-8 w-8 text-gold" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-xl font-bold text-gold">
            My Feng Shui Calculator
          </h1>
        </div>
      </div>
    </header>
  );
}