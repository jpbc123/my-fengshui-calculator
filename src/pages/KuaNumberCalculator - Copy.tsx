import { useState } from "react";
import Header from "@/components/Header";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Feng Shui", path: "/feng-shui" },
  { label: "Kua Number" },
];

const luckyDirections: Record<number, string[]> = {
  1: ["North", "South", "Southeast", "East"],
  2: ["Southwest", "West", "Northwest", "Northeast"],
  3: ["North", "South", "Southeast", "East"],
  4: ["North", "South", "Southeast", "East"],
  5: ["Southwest", "West", "Northwest", "Northeast"], // Male 5 becomes 2, Female 5 becomes 8
  6: ["Southwest", "West", "Northwest", "Northeast"],
  7: ["Southwest", "West", "Northwest", "Northeast"],
  8: ["Southwest", "West", "Northwest", "Northeast"],
  9: ["North", "South", "Southeast", "East"],
};

const kuaGroup = (kua: number) =>
  [1, 3, 4, 9].includes(kua) ? "East Group" : "West Group";

export default function KuaNumberCalculator() {
  const [showMore, setShowMore] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState("male");
  const [kuaNumber, setKuaNumber] = useState<number | null>(null);

  const calculateKuaNumber = () => {
    const year = birthDate.getFullYear();
    if (isNaN(year) || year < 1900 || year > 2100) {
      setKuaNumber(null);
      return;
    }

    const lastTwo = year % 100;
    const sum = lastTwo >= 10 ? (lastTwo % 10) + Math.floor(lastTwo / 10) : lastTwo;

    let kua = 0;

    if (gender === "male") {
      kua = year < 2000 ? 10 - sum : 9 - sum;
      if (kua === 5) kua = 2;
    } else {
      kua = year < 2000 ? sum + 5 : sum + 6;
      kua = kua >= 10 ? (kua % 10) + Math.floor(kua / 10) : kua;
      if (kua === 5) kua = 8;
    }

    setKuaNumber(kua);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
	  <div className="pt-24 px-4 max-w-3xl mx-auto">
		<Breadcrumb items={breadcrumbs} />
		<h1 className="text-2xl font-bold text-gold mb-4">
		Kua Number Calculator
		</h1>
	  </div>
      <main className="pt-6 px-1 pb-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Expandable Info Box */}
			<div className="flex flex-col gap-2">
			{/* Summary Box */}
			<div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
				<Info size={20} className="text-gold mt-1 shrink-0" />
				<div className="text-left">
				<p>
					Your Kua Number (Ming Gua 明卦) is based on your birth year and gender, and reveals your personal Feng Shui energy type. It’s used to find your best directions for health, wealth, love, and growth.
				</p>
				<button
					onClick={() => setShowMore(!showMore)}
					className="mt-2 text-gold hover:underline text-xs font-medium">
					{showMore ? "Hide Details" : "View More"}
				</button>
				</div>
			</div>
			
			{/* Additional Info */}
			{showMore && (
				<div className="bg-black/40 text-white/90 text-sm p-4 rounded-xl border border-gold/26 text-left">
				<p className="mb-2">
				The Kua system comes from the Ba Zhai (Eight Mansions) school of Feng Shui, rooted in:</p>
				<p>• The Eight Trigrams (Bagua 八卦) from the I Ching.</p>
				<p>• Yin–Yang theory and the Five Elements (Wood, Fire, Earth, Metal, Water).</p>
				<p className="mb-2">Feng Shui practitioners in ancient China used this system to align a person’s living environment with cosmic energies to bring harmony, health, and prosperity.</p>
				<p className="mb-2">The Ming Gua (命卦, meaning “life trigram”) reflects the energy pattern you were born into — like an energetic blueprint of your Qi.
				</p>
				<p className="mb-2">
				For example, those born in the year of the Dragon are said to be confident and ambitious, while Rabbits are known to be gentle and compassionate.
				</p>
				<p className="mb-2">Favorable directions are used for sleeping positions, desk placement, and door orientation to attract positive Qi.</p>
				<p>Knowing your Kua Number can help you arrange your space to support prosperity, health, and harmonious relationships.</p>
				</div>
				)}
			</div>	
			
		{/* Input and Button Box */}
		<div className="space-y-4 bg-white/5 p-6 rounded-xl border border-gold/20">
		<div className="flex flex-col gap-4">
			<DatePickerInput
			placeholder="Enter your birthdate"
			date={birthDate}
			onDateChange={setBirthDate}
			className="bg-black text-white"
			/>
		
			<RadioGroup
			defaultValue="male"
			onValueChange={setGender}
			className="flex justify-center gap-6"
			>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="male" id="male" />
				<label htmlFor="male">Male</label>
			</div>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="female" id="female" />
				<label htmlFor="female">Female</label>
			</div>
			</RadioGroup>
		
			<Button 
			variant="gold"
			size="lg"
			disabled={!birthDate}
			onClick={calculateKuaNumber}
			className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
			>
			Calculate My Kua Number
			</Button>
		</div>
		</div>

		{/* Result Display */}
        {kuaNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl bg-gold/10 border border-gold/30"
          >
            <h2 className="text-xl font-bold text-gold mb-2">Your Kua Number: {kuaNumber}</h2>
            <p className="text-white/90 mb-2">
              Group: <span className="font-semibold">{kuaGroup(kuaNumber)}</span>
            </p>
            <p className="text-white/90 mb-2">
              Lucky Directions:{" "}
              <span className="text-white font-medium">{luckyDirections[kuaNumber].join(", ")}</span>
            </p>
            <p className="text-white/60 text-sm">
              Align your bed, desk, or entrance to face these directions for better energy.
            </p>
          </motion.div>
        )}
      </div>
	  </main>
    </div>
  );
}
