import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

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
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("male");
  const [kuaNumber, setKuaNumber] = useState<number | null>(null);

  const calculateKuaNumber = () => {
    const year = parseInt(birthYear);
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
      <main className="pt-28 px-1 pb-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gold">Kua Number Calculator</h1>
          {/* Expandable Info Box */}
			<div className="flex flex-col gap-2">
			{/* Summary Box */}
			<div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
				<Info size={20} className="text-gold mt-1 shrink-0" />
				<div className="text-left">
				<p>
					Kua Numbers (also spelled Gua Numbers or Ming Gua 明卦) come from Feng Shui, a classical Chinese metaphysical science. They are derived from your year of birth and gender, and are used to identify your personal energy direction based on the Ba Zhai (Eight Mansions) system of Feng Shui.
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
					The concept of Kua Numbers originates from ancient Chinese cosmology, specifically:</p>
				<p>• The Eight Trigrams (Bagua 八卦) from the I Ching (Book of Changes).</p>
				<p>• The belief that each person is influenced by the balance of yin and yang, and their alignment with the five elements (wood, fire, earth, metal, water).</p>
				<p className="mb-2">• Feng Shui practitioners in ancient China used this system to align a person’s living environment with cosmic energies to bring harmony, health, and prosperity.</p>
				<p className="mb-2">The Ming Gua (命卦, meaning “life trigram”) reflects the energy pattern you were born into — like an energetic blueprint of your Qi.
				</p>
				<p className="mb-2">
					For example, those born in the year of the Dragon are said to be confident and ambitious,
					while Rabbits are known to be gentle and compassionate.
				</p>
				</div>
			)}
			</div>	

        <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-gold/20">
          <Input
            placeholder="Enter birth year (e.g. 1990)"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="bg-black text-white"
          />

          <RadioGroup
            defaultValue="male"
            onValueChange={setGender}
            className="flex gap-6"
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

          <Button onClick={calculateKuaNumber} className="bg-gold text-black hover:opacity-90">
            Calculate My Kua Number
          </Button>
        </div>

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
