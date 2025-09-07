// src/pages/Index.tsx
import { useState } from "react";
import Header from "@/components/Header"; 
import { FengShuiCalculatorModal } from "@/components/FengShuiCalculatorModal";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import DailyWisdomBanner from "@/components/DailyWisdomBanner";
import ToolsSection from "@/components/ToolsSection";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col overflow-hidden">
      <Header />

      <main>
        <HeroSection />
        <ToolsSection />
		<DailyWisdomBanner />
        <CTASection onStartCalculation={() => setIsModalOpen(true)} />
        <Footer />
      </main>

      <FengShuiCalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // Adjust props as per your existing modal requirements
        birthDate={null} 
      />
    </div>
  );
};

export default Index;
