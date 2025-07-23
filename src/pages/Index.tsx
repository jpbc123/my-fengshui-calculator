// src/pages/Index.tsx 
import { useState } from "react";
import { Header } from "@/components/Header";
import { FengShuiCalculatorModal } from "@/components/FengShuiCalculatorModal";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import fengShuiCoinsImage from "@/assets/feng-shui-coins.jpg";

const Index = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalculate = () => {
    if (birthDate) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow">
        <HeroSection 
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          onCalculate={handleCalculate}
        />
        <FeaturesSection />
        <CTASection />
      </main>

      <FengShuiCalculatorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        birthDate={birthDate || null}
      />
    </div>
  );
};

export default Index;
