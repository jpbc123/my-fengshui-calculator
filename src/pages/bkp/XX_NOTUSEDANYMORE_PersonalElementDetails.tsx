import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";

export default function PersonalElementDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  useEffect(() => {
    if (!result) {
      navigate("/personal-element"); // fallback if someone visits directly
    }
  }, [result, navigate]);

  if (!result) return null;

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Feng Shui", path: "/feng-shui" },
    { label: "Personal Element", path: "/personal-element" },
    { label: "Details" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-1">
          Detailed Personal Element Analysis
        </h1>
      </div>
      <main className="pt-6 px-1 pb-10">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-gold/10 border border-gold/30 p-6 rounded-xl space-y-4">
            <p><strong>Heavenly Stem:</strong> {result.stem}</p>
            <p><strong>Element:</strong> {result.element}</p>
            <p className="text-white/90">{result.description}</p>

            <div className="mt-6">
              <h2 className="text-xl text-gold font-semibold mb-2">More About {result.element} People</h2>
              <p className="text-white/80 text-sm">
                {getElementDescription(result.element)}
              </p>

              <h2 className="text-xl text-gold font-semibold mt-4 mb-2">More About Heavenly Stem {result.stem}</h2>
              <p className="text-white/80 text-sm">
                {getStemDescription(result.stem)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Detailed descriptions of elements
function getElementDescription(element: string): string {
  switch (element) {
    case "Wood":
      return "Wood represents growth, vitality, and creativity. People with the Wood element are driven by a desire to expand their horizons — like a tree reaching toward the sky. They are generous, dependable, and compassionate individuals who often seek harmony and unity in their surroundings. However, when out of balance, Wood personalities may become overly rigid, impatient, or overextended in helping others.";
    case "Fire":
      return "Fire symbolizes passion, transformation, warmth, and illumination. Fire types are natural motivators and leaders, shining brightly with optimism and charm. They seek to inspire and energize others but may become impulsive or restless if imbalanced.";
    case "Earth":
      return "Earth represents stability, nourishment, and support. Earth personalities are loyal, dependable, and practical — the anchors in relationships and communities. They value trust and routine, but when out of balance, they may resist change or become overly protective.";
    case "Metal":
      return "Metal signifies discipline, structure, justice, and refinement. Those with a Metal element often value honor and order. They're resilient and precise, but may come across as emotionally distant or rigid if unbalanced.";
    case "Water":
      return "Water represents wisdom, flexibility, and depth. Water people are introspective, intuitive, and strategic. Like a river, they can adapt to circumstances and find creative paths forward. However, they may struggle with fear or indecision when unbalanced.";
    default:
      return "No description found.";
  }
}

// Detailed descriptions of each Heavenly Stems
function getStemDescription(stem: string): string {
  switch (stem) {
    case "Jia":
      return "🌳 Jia (甲) is Yang Wood, symbolizing tall trees, strength, and integrity. Jia people are principled, determined, and thrive when building long-term visions. They may struggle with stubbornness or adapting quickly to change.";
    case "Yi":
      return "🌿 Yi (乙) is Yin Wood, symbolizing vines and flowers. Elegant, adaptable, and strategic, Yi individuals flourish in creative and supportive environments. They tend to avoid conflict and may overthink in tense situations.";
    case "Bing":
      return "🔥 Bing (丙) is Yang Fire, representing the sun. Bing types are charismatic, bold, and inspiring. They shine naturally in leadership and high-visibility roles, but may burn out or become overbearing if unchecked.";
    case "Ding":
      return "🔥 Ding (丁) is Yin Fire, symbolizing candlelight or gentle flames. Ding personalities are intuitive, warm, and emotionally attuned. While they illuminate others quietly, they may suffer from self-doubt or lack of direction.";
    case "Wu":
      return "⛰️ Wu (戊) is Yang Earth, like mountains or plateaus — solid, immovable, and protective. Wu people are dependable and resilient, often seen as the pillars of families or communities. However, they can resist change or become too fixed in their views.";
    case "Ji":
      return "🪨 Ji (己) is Yin Earth, symbolizing fertile soil and caregiving energy. Ji personalities are humble, analytical, and hardworking. They support others behind the scenes but may become overly cautious or feel emotionally burdened.";
    case "Geng":
      return "⚔️ Geng (庚) is Yang Metal, representing raw ore or swords. Geng individuals are courageous, direct, and value justice. They often act as protectors but may appear aggressive or too blunt when imbalanced.";
    case "Xin":
      return "💍 Xin (辛) is Yin Metal, symbolizing jewelry or precious metals. Xin types are refined, elegant, and precise. They appreciate aesthetics and clarity but can be perfectionistic or emotionally guarded.";
    case "Ren":
      return "🌊 Ren (壬) is Yang Water, representing oceans or rivers. Ren people are intelligent, ambitious, and enduring. They have vast inner resources and vision, but can become emotionally detached or domineering.";
    case "Gui":
      return "💧 Gui (癸) is Yin Water, symbolizing rain, mist, or dew. Gui personalities are gentle, mysterious, and deeply intuitive. They are empathetic and philosophical, yet may avoid decisions or retreat emotionally under stress.";
    default:
      return "More information about this Heavenly Stem is coming soon.";
  }
}
