import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChineseHoroscopeResult from "@/pages/ChineseHoroscopeResult"; 
import FengShui from "@/pages/FengShui"; 
import PersonalElement from "./pages/PersonalElement";
import PersonalElementDetails from "./pages/PersonalElementDetails";
import KuaNumberCalculator from "./pages/KuaNumberCalculator";
import Numerology from "./pages/Numerology";
import VisiberCalculator from "./pages/VisiberCalculator";
import Astrology from "./pages/Astrology";
import WesternDailyHoroscope from "./pages/WesternDailyHoroscope";
import WesternZodiacCalculator from "./pages/WesternZodiacCalculator";
import ChineseZodiacCalculator from "./pages/ChineseZodiacCalculator";
import ChineseZodiacLanding from "@/pages/ChineseZodiacLanding";

import PrivacyPolicy from "./pages/PrivacyPolicy"; 
import DailyWisdomArticlePage from "@/pages/DailyWisdomArticlePage"; 

import Store from "./pages/Store";

import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/my-fengshui-calculator">
        <ScrollToTop /> {/* 👈 This will reset scroll on route change */}
        <Routes>
          <Route path="/" element={<Index />} />
		  <Route path="*" element={<NotFound />} />
		  
		  {/* Main Menus */}
          <Route path="/feng-shui" element={<FengShui />} />
		  <Route path="/numerology" element={<Numerology />} /> 
		  <Route path="/astrology" element={<Astrology />} />
		  <Route path="/store" element={<Store />} /> 
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
		  
		  {/* Submenu-Feng Shui */}
          <Route path="/personal-element" element={<PersonalElement />} />
          <Route path="/kua-number-calculator" element={<KuaNumberCalculator />} />
          
		  {/* Submenu-Numerology */}
          <Route path="/visiber-calculator" element={<VisiberCalculator />} />
		  
		  {/* Submenu-Astrology */}
          <Route path="/chinese-zodiac-calculator" element={<ChineseZodiacCalculator />} />
		  <Route path="/chinese-zodiac-landing" element={<ChineseZodiacLanding />} />
		  <Route path="/western-zodiac-calculator" element={<WesternZodiacCalculator />} />
		 
		  {/* Features-Horoscopes */}
		  <Route path="/zodiac/:zodiac" element={<ChineseHoroscopeResult />} /> {/* Result for HeroSection */}
          <Route path="/western-horoscope" element={<WesternDailyHoroscope />} />
		  
		  <Route path="/daily-wisdom-article" element={<DailyWisdomArticlePage />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
