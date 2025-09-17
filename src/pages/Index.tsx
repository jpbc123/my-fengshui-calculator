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
import FengShuiWeddingDatesBanner from "@/components/FengShuiWeddingDatesBanner";
import BirthChartBanner from "@/components/BirthChartBanner";
import ToolsShowcaseBanner from "@/components/ToolsShowcaseBanner"; // ADD THIS IMPORT

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        
        {/* Full-width compatibility banner */}
        <ChineseZodiacCompatibilityBanner />
             
        {/* Existing engagement section */}
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
        
        {/* Premium Services Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Premium Feng Shui & Astrological Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Unlock personalized insights through our premium feng shui and astrological services. 
                Whether you're planning life's biggest moments or seeking cosmic guidance, our platform 
                combines traditional wisdom with modern convenience.
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Professional-grade analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Based on authentic feng shui principles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Built on classical astrological foundations</span>
                </div>
              </div>
            </div>
            
            {/* Service Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FengShuiWeddingDatesBanner />
              <BirthChartBanner />
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-2">
                Be among the first to experience our new platform
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Free access during launch period
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  Quality-assured platform
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  100% Secure & Private
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  Instant Results
                </span>
              </div>
            </div>
          </div>
        </section>
        
        {/* ADD THE TOOLS SHOWCASE BANNER HERE - after compatibility, before articles */}
        <ToolsShowcaseBanner />
		
        {/* Existing content continues below */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MeditationBanner />
        </div>
      </main>
    </div>
  );
};

export default Index;