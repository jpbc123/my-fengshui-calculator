import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Calculator = () => {
  const [birthDate, setBirthDate] = useState<Date>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateZodiac = (year: number) => {
    const animals = [
      "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
      "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
    ];
    const baseYear = 2020;
    let index = (year - baseYear) % 12;
    if (index < 0) index += 12;
    return animals[index];
  };

  const calculateKuaNumber = (birthYear: number, gender: string, bornBeforeChineseNewYear = false) => {
    if (bornBeforeChineseNewYear) {
      birthYear -= 1;
    }

    const sumDigits = (year: number): number => {
      return year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    };

    let sum = sumDigits(birthYear);
    while (sum >= 10) {
      sum = sumDigits(sum);
    }

    let kua;
    const isAfter2000 = birthYear >= 2000;

    if (gender.toLowerCase() === "male") {
      kua = (isAfter2000 ? 9 : 10) - sum;
      if (kua === 5) kua = 2;
    } else if (gender.toLowerCase() === "female") {
      kua = (isAfter2000 ? 6 : 5) + sum;
      while (kua >= 10) {
        kua = sumDigits(kua);
      }
      if (kua === 5) kua = 8;
    }

    return kua;
  };

  const handleCalculate = () => {
    if (birthDate) {
      setIsModalOpen(true);
    }
  };

  const handleProceed = () => {
    if (gender && birthDate) {
      setShowResults(true);
    }
  };

  const resetCalculator = () => {
    setIsModalOpen(false);
    setShowResults(false);
    setGender("");
  };

  const zodiac = birthDate ? calculateZodiac(birthDate.getFullYear()) : "";
  const kuaNumber = birthDate && gender ? calculateKuaNumber(birthDate.getFullYear(), gender) : 0;

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-fortune-gradient bg-clip-text text-transparent">
          Discover Your Feng Shui
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Calculate your personal feng shui elements, find harmony in your space, and unlock the secrets of ancient Chinese wisdom
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="flex-1 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-base",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  {birthDate ? format(birthDate, "PPP") : <span>Enter your birthdate to start</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            onClick={handleCalculate}
            disabled={!birthDate}
            variant="prosperity"
            className="px-8 py-3 h-12 text-base font-semibold"
          >
            Calculate Now
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={resetCalculator}>
        <DialogContent className="sm:max-w-md animate-fade-in">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {showResults ? "Your Feng Shui Profile" : "What is your gender?"}
            </DialogTitle>
          </DialogHeader>
          
          {!showResults ? (
            <div className="space-y-6 py-4">
              <RadioGroup value={gender} onValueChange={setGender} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="text-base">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="text-base">Female</Label>
                </div>
              </RadioGroup>
              
              <Button 
                onClick={handleProceed}
                disabled={!gender}
                variant="prosperity"
                className="w-full"
              >
                Proceed
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="bg-muted rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Birthday:</span>
                  <span>{birthDate && format(birthDate, "PPP")}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Zodiac Sign:</span>
                  <span className="text-lucky-red font-bold">{zodiac}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Kua Number:</span>
                  <span className="text-prosperity-gold font-bold text-xl">{kuaNumber}</span>
                </div>
              </div>
              
              <Button 
                onClick={resetCalculator}
                variant="outline"
                className="w-full"
              >
                Calculate Again
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Calculator;