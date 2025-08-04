import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import fengShuiHeroImage from "@/assets/hero-image.jpg";

type HeroSectionProps = {
  birthDate: Date | undefined;
  setBirthDate: (date: Date | undefined) => void;
  onCalculate: () => void;
};

const HeroSection = ({ birthDate, setBirthDate, onCalculate }: HeroSectionProps) => {
  return (
    <section className="relative bg-red-800 text-white min-h-[90vh] py-32 overflow-hidden">
      {/* Background image with opacity overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={fengShuiHeroImage}
          alt="Feng Shui Compass"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-yellow-800/50 mix-blend-multiply"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-6 h-6 bg-gold/30 rounded-full blur-lg animate-pulse" />
      <div className="absolute top-16 right-80 w-10 h-10 bg-gold/30 rounded-full blur-md animate-pulse delay-1500" />
	  <div className="absolute top-45 left-16 w-20 h-20 bg-gold/30 rounded-full blur-md animate-pulse delay-1500" />
      <div className="absolute bottom-16 right-20 w-20 h-20 bg-gold/30 rounded-full blur-md animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-8 h-8 bg-gold/20 rounded-full blur-md animate-pulse delay-2000" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl pt-24">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Discover Your <span className="text-gold">Feng Shui</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Calculate your personal feng shui elements, find harmony in your space,
          and unlock the secrets of ancient Chinese wisdom.
        </p>

        {/* Date Picker & Button */}
        <div className="bg-white/10 backdrop-blur-md border border-gold/30 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <DatePickerInput
              date={birthDate}
              onDateChange={setBirthDate}
              placeholder="Enter your birthdate to start"
            />
            <Button
              variant="gold"
              size="lg"
              onClick={onCalculate}
              disabled={!birthDate}
              className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
            >
              Calculate Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
