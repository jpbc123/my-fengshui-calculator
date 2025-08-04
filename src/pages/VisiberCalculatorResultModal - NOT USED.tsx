import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  birthDate: Date;
  resultNumber: number;
}

const VisiberCalculatorResultModal: React.FC<Props> = ({
  open,
  onClose,
  birthDate,
  resultNumber,
}) => {
  if (!birthDate || !(birthDate instanceof Date)) return null;

  const day = birthDate.getDate().toString().padStart(2, "0");
  const month = (birthDate.getMonth() + 1).toString().padStart(2, "0");
  const year = birthDate.getFullYear().toString();

  const birthDigits = [...day, ...month, ...year];

  const sumDigits = (str: string) => str.split("").reduce((sum, d) => sum + parseInt(d), 0);
  const reduceToSingleDigit = (num: number) => (num > 9 ? sumDigits(num.toString()) : num);

  const daySum = sumDigits(day); // e.g. 2+6 = 8
  const monthSum = sumDigits(month); // e.g. 0+5 = 5
  const yearFirstSum = reduceToSingleDigit(sumDigits(year.slice(0, 2))); // 1+9 = 10 → 1
  const yearLastSum = sumDigits(year.slice(2)); // 9+0 = 9

  // Middle layer: combine left side and right side from above
  const leftMiddleSum = reduceToSingleDigit(daySum + monthSum); // 8+5 = 13 → 4
  const rightMiddleSum = reduceToSingleDigit(yearFirstSum + yearLastSum); // 1+9 = 10 → 1

  const meaning = {
    1: "Represents leadership and individuality. People with this number are often ambitious, courageous, and assertive.",
    2: "Signifies harmony, sensitivity, and diplomacy. These individuals value relationships and balance.",
    3: "Reflects creativity, joy, and self-expression. Often optimistic and sociable.",
    4: "Symbolizes discipline, reliability, and stability. Hardworking and detail-oriented.",
    5: "Represents change, freedom, and adventure. Energetic and versatile individuals.",
    6: "Embodies responsibility, care, and nurturing. Family-oriented and loyal.",
    7: "Denotes introspection, analysis, and spiritual depth. Intellectual and contemplative.",
    8: "Stands for power, success, and material wealth. Goal-driven and pragmatic.",
    9: "Represents compassion, idealism, and humanitarianism. Generous and wise.",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black text-white border-gold border shadow-xl animate-fade-in">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gold">Your Visiber Number</h2>
        </div>

        <p className="text-sm text-white/80 mb-1 text-center">
          Based on your birth date: {day}/{month}/{year}
        </p>

        <div className="text-center my-4">
          <p className="text-white/90 text-sm italic">
            {meaning[resultNumber as keyof typeof meaning] || "Meaning not found."}
          </p>
        </div>

        <div className="my-6 text-sm text-white/70 text-center">
          <div className="font-bold text-gold mb-4">Inverted Triangle Breakdown</div>

          <div
            className="flex justify-center flex-wrap gap-2"
            style={{ marginBottom: "-4rem" }}
          >
            {birthDigits.map((digit, index) => (
              <div
                key={index}
                className="w-10 h-10 flex items-center justify-center border border-gold text-white font-mono"
              >
                {digit}
              </div>
            ))}
          </div>

          <svg viewBox="0 0 200 200" className="mx-auto" width="100%" height="auto" style={{ marginTop: "4rem" }}>
            <polygon
              points="20,20 180,20 100,180"
              fill="none"
              stroke="gold"
              strokeWidth="1"
            />

            {/* Triangle divider lines */}
            <line x1="100" y1="20" x2="100" y2="116" stroke="gold" strokeWidth="1" />
            <line x1="44" y1="68" x2="156" y2="68" stroke="gold" strokeWidth="1" />
            <line x1="68" y1="116" x2="132" y2="116" stroke="gold" strokeWidth="1" />

            {/* Top layer values */}
            <text x="50" y="46" fill="white" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {daySum}
            </text>
            <text x="80" y="46" fill="white" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {monthSum}
            </text>
            <text x="120" y="46" fill="white" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {yearFirstSum}
            </text>
            <text x="150" y="46" fill="white" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {yearLastSum}
            </text>

            {/* Middle layer values */}
            <text x="78" y="92" fill="white" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {leftMiddleSum}
            </text>
            <text x="122" y="92" fill="white" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {rightMiddleSum}
            </text>

            {/* Final Visiber number */}
            <text
              x="100"
              y="145"
              fill="gold"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {resultNumber}
            </text>
          </svg>

          {/*
		  <p className="text-xs text-white/60 mt-4">
            The triangle below shows how your birthdate digits combine to form your unique Visiber number.
          </p>
		  */}
		  
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisiberCalculatorResultModal;
