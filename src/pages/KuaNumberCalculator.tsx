// src/pages/KuaNumberCalculator.tsx
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "react-router-dom";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Feng Shui", path: "/feng-shui" },
  { label: "Kua Number Calculator" },
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

const kuaProfiles: Record<number, {
  name: string;
  traits: string[];
  lucky: string[];
  unlucky: string[];
}> = {
  1: {
    name: "Kan (Water)",
    traits: [
      "Adaptable and resourceful",
      "Strong intuition and insight",
      "Calm and reflective by nature",
      "Excellent at networking and connecting with others"
    ],
    lucky: ["North", "South", "Southeast", "East"],
    unlucky: ["Southwest", "West", "Northwest", "Northeast"]
  },
  2: {
    name: "Kun (Earth)",
    traits: [
      "Reliable, patient, and steady",
      "Strong family values",
      "Nurturing and supportive personality",
      "Prefers stability over risk"
    ],
    lucky: ["Southwest", "West", "Northwest", "Northeast"],
    unlucky: ["North", "South", "Southeast", "East"]
  },
  3: {
    name: "Zhen (Wood)",
    traits: [
      "Energetic and driven",
      "Thrives on taking initiative",
      "Creative and quick to adapt",
      "Can be impatient or easily frustrated"
    ],
    lucky: ["South", "North", "Southeast", "East"],
    unlucky: ["Southwest", "West", "Northwest", "Northeast"]
  },
  4: {
    name: "Xun (Wood)",
    traits: [
      "Diplomatic and persuasive",
      "Highly creative and adaptable",
      "Good with relationships and partnerships",
      "Sometimes indecisive due to considering too many options"
    ],
    lucky: ["Southeast", "East", "North", "South"],
    unlucky: ["Southwest", "West", "Northwest", "Northeast"]
  },
  5: {
    name: "Center (Earth) – Special Case",
    traits: [
      "Balanced and grounded personality",
      "Natural leader with a sense of fairness",
      "Stable, reliable, and practical",
      "Must adapt based on gender in calculations"
    ],
    lucky: ["Varies depending on gender – usually follows #2 for women and #8 for men"],
    unlucky: ["Varies depending on gender – usually follows #2 for women and #8 for men"]
  },
  6: {
    name: "Qian (Metal)",
    traits: [
      "Strong, determined, and disciplined",
      "Respected for leadership skills",
      "Goal-oriented and ambitious",
      "Sometimes too rigid or stubborn"
    ],
    lucky: ["Northwest", "Northeast", "Southwest", "West"],
    unlucky: ["South", "North", "Southeast", "East"]
  },
  7: {
    name: "Dui (Metal)",
    traits: [
      "Charming and sociable",
      "Enjoys communication and fun activities",
      "Optimistic and adaptable",
      "May struggle with focus or persistence"
    ],
    lucky: ["West", "Southwest", "Northeast", "Northwest"],
    unlucky: ["East", "Southeast", "North", "South"]
  },
  8: {
    name: "Gen (Earth)",
    traits: [
      "Calm, patient, and steady",
      "Values knowledge and self-improvement",
      "Good at long-term planning",
      "Can be slow to act but thorough"
    ],
    lucky: ["Northeast", "West", "Northwest", "Southwest"],
    unlucky: ["South", "North", "East", "Southeast"]
  },
  9: {
    name: "Li (Fire)",
    traits: [
      "Passionate and ambitious",
      "Creative and expressive",
      "Radiates warmth and enthusiasm",
      "May become impulsive or overly emotional"
    ],
    lucky: ["South", "North", "Southeast", "East"],
    unlucky: ["West", "Northwest", "Southwest", "Northeast"]
  }
};


export default function KuaNumberCalculator() {
  const [showMore, setShowMore] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState("male");
  const [kuaNumber, setKuaNumber] = useState<number | null>(null);

  const calculateKuaNumber = () => {
    const year = birthDate!.getFullYear();
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
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* Left side - Calculator and Results */}
            <div className="max-w-xl">
              {/* Breadcrumbs + title */}
              <div className="mb-8">
                <Breadcrumb items={breadcrumbs} className="text-black/80" />
                <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Kua Number Calculator</h1>
                <p className="text-black/80 mb-6">
                  Discover how <span className="font-semibold">Feng Shui</span> can guide <span className="font-semibold">harmony, balance, and positive energy</span> in your life.
                  Start with our free tools below to explore your <span className="font-semibold">personal Feng Shui insights</span>, including your <span className="font-semibold">Kua number</span> and <span className="font-semibold">lucky directions</span>.
                </p>
              </div>

              {/* Summary Box */}
				<div className="flex flex-col gap-2 mb-8">
				<div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
					<Info size={20} className="text-gold mt-1 shrink-0" />
					<div className="text-left">
					<p>
						Your <span className="font-semibold">Kua Number (Ming Gua 命卦)</span> is an essential part of Ba Zhai Feng Shui. Calculated from your <span className="font-semibold">birth year and gender</span>, it reveals your personal Feng Shui energy type. Use your <span className="font-semibold">lucky directions</span> to find the best positions for <span className="font-semibold">health, wealth, love, and growth</span>.
					</p>
					<button
						onClick={() => setShowMore(!showMore)}
						className="mt-2 text-gold hover:underline text-xs font-medium"
					>
						{showMore ? "Hide Details" : "View More"}
					</button>
					</div>
				</div>
				
				{/* Additional Info */}
				{showMore && (
					<div className="bg-gray-50 text-black/90 p-4 rounded-xl border border-gray-200 text-left">
					<p className="mb-2">
						The <span className="font-semibold">Kua system</span> comes from the <span className="font-semibold">Ba Zhai (Eight Mansions) school of Feng Shui</span>, rooted in:
					</p>
					<ul className="list-disc list-inside">
					<li>
						The <span className="font-semibold">Eight Trigrams (Bagua 八卦)</span> from the I Ching.
					</li>
					<li>
						<span className="font-semibold">Yin–Yang theory</span> and the <span className="font-semibold">Five Elements (Wood, Fire, Earth, Metal, Water)</span>.
					</li>
					</ul>
					<p className="mb-2">
						<span className="font-semibold">Feng Shui practitioners</span> in ancient China used this system to align a person’s living environment with <span className="font-semibold">cosmic energies</span> to bring harmony, health, and prosperity.
					</p>
					<p className="mb-2">
						The <span className="font-semibold">Ming Gua (命卦, meaning “life trigram”)</span> reflects the energy pattern you were born into — like an <span className="font-semibold">energetic blueprint of your Qi</span>.
					</p>
					<p className="mb-2">
						For example, those born in the year of the Dragon are said to be confident and ambitious, while Rabbits are known to be gentle and compassionate.
					</p>
					<p className="mb-2">
						<span className="font-semibold">Favorable directions</span> are used for sleeping positions, desk placement, and door orientation to attract <span className="font-semibold">positive Qi</span>.
					</p>
					<p>
						Knowing your <span className="font-semibold">Kua Number</span> can help you arrange your space to support <span className="font-semibold">prosperity, health, and harmonious relationships</span>.
					</p>
					</div>
				)}
				</div>

              {/* Input and Button Box */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col gap-4">
                  <DatePickerInput
                    placeholder="Enter your birthdate"
                    date={birthDate}
                    onDateChange={setBirthDate}
                    className="bg-white text-black border border-gray-300"
                  />
                  <RadioGroup
                    defaultValue="male"
                    onValueChange={setGender}
                    className="flex justify-center gap-6"
                  >
                    <div className="flex items-center space-x-2 text-black/90">
                      <RadioGroupItem value="male" id="male" className="border border-black" />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="flex items-center space-x-2 text-black/90">
                      <RadioGroupItem value="female" id="female" className="border border-black" />
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

              {/* Result */}
              {kuaNumber && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-200 text-left"
                >
                  <h2 className="text-xl font-bold text-gold mb-1">
                    Your Kua Number: {kuaNumber} – {kuaProfiles[kuaNumber].name}
                  </h2>
                  <p className="mb-4 text-black/90">
                    Group: <span className="font-semibold">{kuaGroup(kuaNumber)}</span>
                  </p>
                  <div className="space-y-4 text-black/90">
                    <div>
                      <h3 className="font-semibold mb-1 text-gold">Key Traits:</h3>
                      <ul className="list-disc list-inside">
                        {kuaProfiles[kuaNumber].traits.map((trait, i) => (
                          <li key={i}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gold">Lucky Directions:</h3>
                      <ul className="list-disc list-inside">
                        {kuaProfiles[kuaNumber].lucky.map((dir, i) => (
                          <li key={i}>{dir}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gold">Unlucky Directions:</h3>
                      <ul className="list-disc list-inside">
                        {kuaProfiles[kuaNumber].unlucky.map((dir, i) => (
                          <li key={i}>{dir}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gold">Practical Tips:</h3>
                      <ul className="list-disc list-inside">
                        <li>Face your lucky direction when working or studying.</li>
                        <li>Position your bed so your head points toward a lucky direction.</li>
                        <li>Place your main door to align with your most favorable direction.</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right side - related articles */}
            <div className="max-w-md mt-40 lg:mt-0">
              <h2 className="text-xl font-semibold text-black mb-4">Related Articles</h2>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-black/80 hover:text-gold">Feng Shui for Beginners: The Basics</Link></li>
                <li><Link to="#" className="text-black/80 hover:text-gold">How to Use Your Lucky Directions at Work</Link></li>
                <li><Link to="#" className="text-black/80 hover:text-gold">Balancing the Five Elements in Your Home</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}