import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

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

import GamesFunLanding from "./pages/GamesFunLanding";
import GameLuckyNumber from "./pages/GameLuckyNumber";
import GameNameCompatibility from "./pages/GameNameCompatibility";
import GameChineseCompatibility from "./pages/GameChineseCompatibility";
import GameWesternCompatibility from "./pages/GameWesternCompatibility";
import GameFortuneCookie from "./pages/GameFortuneCookie";

import MeditationLanding from "./pages/MeditationLanding";
import MeditateVisualizationExercise from "./pages/MeditateVisualizationExercise";
import MeditateYogaPose from "./pages/MeditateYogaPose";
import MeditateAffirmation from "./pages/MeditateAffirmation";
import MeditateMorningMindfulness from "./pages/MeditateMorningMindfulness";
import MeditateEveningRelaxation from "./pages/MeditateEveningRelaxation";

import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";  
import PrivacyPolicy from "./pages/PrivacyPolicy"; 
import TermsOfService from "./pages/TermsOfService";
import Sitemap from "./pages/Sitemap";
import Credits from "./pages/Credits";

import ComingSoonPage from "@/pages/ComingSoonPage";
import ComingSoonStore from "@/pages/ComingSoonStore";
import Store from "./pages/Store";


import BirthChart from "./pages/BirthChart";
import FengShuiWeddingDates from "./pages/FengShuiWeddingDates";


import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import PageTitleManager from "@/components/PageTitleManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageTitleManager>
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
				<Route path="/terms-of-service" element={<TermsOfService />} />
				<Route path="/credits" element={<Credits />} />
				<Route path="/sitemap" element={<Sitemap />} />
                
                {/* Submenu-Feng Shui */}
                <Route path="/feng-shui/personal-element" element={<PersonalElement />} />
                <Route path="/feng-shui/kua-number" element={<KuaNumberCalculator />} />
                
                {/* Submenu-Numerology */}
                <Route path="/numerology/visiber-calculator" element={<VisiberCalculator />} />
                
                {/* Submenu-Astrology */}
                <Route path="/astrology/chinese-zodiac-calculator" element={<ChineseZodiacCalculator />} />
                <Route path="/astrology/western-zodiac-calculator" element={<WesternZodiacCalculator />} />
                
                {/* Features-Horoscopes */}
				<Route path="/horoscope/chinese-zodiac" element={<ChineseZodiacLanding />} />
                <Route path="/zodiac/:zodiac" element={<ChineseHoroscopeResult />} />
                <Route path="/horoscope/western-zodiac" element={<WesternDailyHoroscope />} />
                
                {/* Tools Section */}
                <Route path="/daily-wisdom-article" element={<DailyWisdomArticlePage />} />
                <Route path="/planetary-overview" element={<PlanetaryOverviewPage />} />
                
                {/* Games Section */}
                <Route path="/games-fun" element={<GamesFunLanding />} />
				<Route path="/games-fun/aura-analysis" element={<AuraAnalysisPage />} />
                <Route path="/games-fun/lucky-numbers-generator" element={<GameLuckyNumber />} />
                <Route path="/games-fun/name-compatibility" element={<GameNameCompatibility />} />
                <Route path="/games-fun/chinese-zodiac-compatibility" element={<GameChineseCompatibility />} />
                <Route path="/games-fun/western-zodiac-compatibility" element={<GameWesternCompatibility />} />
                <Route path="/games-fun/fortune-cookie" element={<GameFortuneCookie />} />
                
                {/* Meditation */}
                <Route path="/meditation" element={<MeditationLanding />} />
                <Route path="/meditation/visualization-exercises" element={<MeditateVisualizationExercise />} />
                <Route path="/meditation/yoga" element={<MeditateYogaPose />} />
                <Route path="/meditation/daily-affirmation" element={<MeditateAffirmation />} />
                <Route path="/meditation/morning-mindfulness" element={<MeditateMorningMindfulness />} />
                <Route path="/meditation/evening-relaxation" element={<MeditateEveningRelaxation />} />
                
				{/* Services */}
				<Route path="/birth-chart" element={<BirthChart />} />
				<Route path="/auspicious-wedding-date-planner" element={<FengShuiWeddingDates />} />
				
				
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
        </PageTitleManager>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;