import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import VisiberCalculator from "./pages/VisiberCalculator"; 
import ChineseZodiacCalculator from "./pages/ChineseZodiacCalculator";
import FengShui from "@/pages/FengShui"; 
import KuaNumberCalculator from "./pages/KuaNumberCalculator";
import PersonalElement from "./pages/PersonalElement";
import PersonalElementDetails  from "./pages/PersonalElementDetails";
import Numerology from "./pages/Numerology";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/my-fengshui-calculator"> 
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/feng-shui" element={<FengShui />} />
		  <Route path="/personal-element" element={<PersonalElement />} />
		  <Route path="/personal-element-details" element={<PersonalElementDetails />} />
		  <Route path="/kua-number-calculator" element={<KuaNumberCalculator />} />
		  <Route path="/numerology" element={<Numerology />} /> 
		  <Route path="/visiber-calculator" element={<VisiberCalculator />} /> 
          <Route path="/chinese-zodiac-calculator" element={<ChineseZodiacCalculator />} /> 
		  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
