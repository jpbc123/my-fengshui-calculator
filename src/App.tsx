import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy"; 
import FengShui from "@/pages/FengShui"; 
import PersonalElement from "./pages/PersonalElement";
import PersonalElementDetails from "./pages/PersonalElementDetails";
import KuaNumberCalculator from "./pages/KuaNumberCalculator";
import Numerology from "./pages/Numerology";
import VisiberCalculator from "./pages/VisiberCalculator";
import Astrology from "./pages/Astrology";
import ChineseZodiacCalculator from "./pages/ChineseZodiacCalculator";
import WesternZodiacCalculator from "./pages/WesternZodiacCalculator";

import Store from "./pages/Store";

// 👇 Import the new ScrollToTop component
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
          <Route path="/feng-shui" element={<FengShui />} />
          <Route path="/personal-element" element={<PersonalElement />} />
          <Route path="/personal-element-details" element={<PersonalElementDetails />} />
          <Route path="/kua-number-calculator" element={<KuaNumberCalculator />} />
          <Route path="/numerology" element={<Numerology />} /> 
          <Route path="/visiber-calculator" element={<VisiberCalculator />} />
		  <Route path="/astrology" element={<Astrology />} />
          <Route path="/chinese-zodiac-calculator" element={<ChineseZodiacCalculator />} />
		  <Route path="/western-zodiac-calculator" element={<WesternZodiacCalculator />} />
          <Route path="/store" element={<Store />} /> 
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
