// src/pages/Index.tsx
import { useState } from "react";
import Header from "@/components/Header"; 
import { FengShuiCalculatorModal } from "@/components/FengShuiCalculatorModal";
import HeroSection from "@/components/HeroSection";
import ToolsSection from "@/components/ToolsSection";
import RightSidebar from "@/components/RightSidebar"; 
import DailyWisdomBanner from "@/components/DailyWisdomBanner";
import MeditationBanner from "@/components/MeditationBanner";
import ChineseZodiacCompatibilityBanner from "@/components/ChineseZodiacCompatibilityBanner";
import RecentArticlesPreview from "@/components/RecentArticlesPreview";
import CombinedDailyInsightsBanner from "@/components/CombinedDailyInsightsBanner";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        
        {/* Full-width compatibility banner */}
        <ChineseZodiacCompatibilityBanner />
        
        {/* New engagement section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Articles (70% width) */}
            <div className="lg:col-span-2">
              <RecentArticlesPreview />
            </div>
            
            {/* Right Column: Combined Daily Insights (30% width) */}
            <div className="lg:col-span-1">
              <CombinedDailyInsightsBanner />
            </div>
          </div>
        </div>
        
        {/* Existing content continues below */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Banners and Tools */}
            <div className="lg:col-span-2 space-y-8">
              <ToolsSection />
            </div>
            
            {/* Right Column: Sidebar */}
            <div className="lg:col-span-1">
              <RightSidebar />
            </div>
          </div>
          <DailyWisdomBanner />
          <MeditationBanner />
        </div>
      </main>
    </div>
  );
};

export default Index;