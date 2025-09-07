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
import KuaNumberCalculator from "./pages/KuaNumberCalculator";
import Numerology from "./pages/Numerology";
import VisiberCalculator from "./pages/VisiberCalculator";
import Astrology from "./pages/Astrology";
import ChineseZodiacCalculator from "./pages/ChineseZodiacCalculator";
import WesternZodiacCalculator from "./pages/WesternZodiacCalculator";
import Horoscope from "./pages/Horoscope";
import ChineseZodiacLanding from "@/pages/ChineseZodiacLanding";
import WesternDailyHoroscope from "./pages/WesternDailyHoroscope";

import AuraAnalysisPage from "@/pages/AuraAnalysisPage";
import DailyWisdomArticlePage from "@/pages/DailyWisdomArticlePage"; 
import PlanetaryOverviewPage from "@/pages/PlanetaryOverviewPage"; 
import ArticlePage from './pages/ArticlePage';
import ArticleMainPage from './pages/ArticleMainPage';

import GameLuckyNumber from "./pages/GameLuckyNumber";
import GameNameCompatibility from "./pages/GameNameCompatibility";
import GameChineseCompatibility from "./pages/GameChineseCompatibility";
import GameWesternCompatibility from "./pages/GameWesternCompatibility";
import GameFortuneCookie from "./pages/GameFortuneCookie";

import MeditateVisualizationExercise from "./pages/MeditateVisualizationExercise";
import MeditateYogaPose from "./pages/MeditateYogaPose";
import MeditateAffirmation from "./pages/MeditateAffirmation";
import MeditateMorningMindfulness from "./pages/MeditateMorningMindfulness";
import MeditateEveningRelaxation from "./pages/MeditateEveningRelaxation";

import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";  
import PrivacyPolicy from "./pages/PrivacyPolicy"; 

import ComingSoonPage from "@/pages/ComingSoonPage";
import ComingSoonStore from "@/pages/ComingSoonStore";
import Store from "./pages/Store";

import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/my-fengshui-calculator">
        <ScrollToTop />

        {/* App layout wrapper */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Main Menus */}
              <Route path="/feng-shui" element={<FengShui />} />
              <Route path="/numerology" element={<Numerology />} /> 
              <Route path="/astrology" element={<Astrology />} />
              <Route path="/horoscope" element={<Horoscope />} />
              <Route path="/store" element={<Store />} /> 
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/about-us" element={<AboutUs />} />
			  <Route path="/contact-us" element={<ContactUs />} />
              
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
              <Route path="/zodiac/:zodiac" element={<ChineseHoroscopeResult />} />
              <Route path="/western-horoscope" element={<WesternDailyHoroscope />} />
              
              {/* Tools Section */}
              <Route path="/daily-wisdom-article" element={<DailyWisdomArticlePage />} />
              <Route path="/aura-analysis" element={<AuraAnalysisPage />} />
              <Route path="/planetary-overview" element={<PlanetaryOverviewPage />} />
              
              {/* Games Section */}
              <Route path="/lucky-numbers" element={<GameLuckyNumber />} />
              <Route path="/name-compatibility" element={<GameNameCompatibility />} />
              <Route path="/chinese-compatibility" element={<GameChineseCompatibility />} />
              <Route path="/western-compatibility" element={<GameWesternCompatibility />} />
              <Route path="/fortune-cookie" element={<GameFortuneCookie />} />
			  
			  {/* Meditation */}
              <Route path="/meditate-visualization" element={<MeditateVisualizationExercise />} />
			  <Route path="/meditate-yoga-pose" element={<MeditateYogaPose />} />
			  <Route path="/meditate-affirmation" element={<MeditateAffirmation />} />
			  <Route path="/meditate-morning" element={<MeditateMorningMindfulness />} />
			  <Route path="/meditate-evening" element={<MeditateEveningRelaxation />} />
              
              {/* Articles Routing */}
              <Route path="/article" element={<ArticleMainPage />} />
              <Route path="/articles/:slug" element={<ArticlePage />} />

              {/* Coming Soon */}
              <Route path="/community-chat" element={<ComingSoonPage />} />
              <Route path="/coming-store" element={<ComingSoonStore />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
