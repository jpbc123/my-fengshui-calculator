import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import numerologyImage from "@/assets/numerology.jpg"; // You might want a dedicated numerology image
import Breadcrumb from "@/components/Breadcrumb";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Numerology" },
];

export default function Numerology() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">
          What is Numerology?
        </h1>
        {/* Gold horizontal line */}
        <div className="border-t-4 border-gold w-32 mb-4"></div>
      </div>

      <div className="max-w-4xl mx-auto p-6 pt-6">
        <p className="mb-6 text-white/80">
          Numerology is the ancient study of numbers and their mystical influence
          on human life. It explores how numbers — derived from your birth date
          and name — can reveal personality traits, life challenges, and
          opportunities.
        </p>

        {/* Numerology Image */}
        <div className="mb-6">
          <img
            src={numerologyImage}
            alt="Numerology"
            className="w-full rounded-xl shadow-lg border border-gold/20"
          />
        </div>

        <p className="mb-6 text-white/80">
          The most common system reduces numbers to single digits, each holding
          unique vibrations and meanings. These core numbers — such as your Life
          Path Number or Destiny Number — act as a blueprint, offering guidance
          on career, relationships, and personal growth.
        </p>

        <p className="mb-10 text-white/80">
          Numerology blends mathematical precision with spiritual insight, giving
          you tools to make informed choices, understand life cycles, and align
          with your highest potential.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          Numerology Calculation Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/visiber-calculator">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Visiber</h3>
              <p className="text-sm text-white/80">
                Reveal your core numbers through the Visiber method and uncover
                insights about your destiny, relationships, and personal journey.
              </p>
            </div>
          </Link>

          {/* Placeholder for future tool */}
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 opacity-50">
            <h3 className="text-lg font-semibold text-gold mb-1">
              Coming Soon
            </h3>
            <p className="text-sm text-white/80">
              More Numerology tools are on the way — stay tuned for additional
              ways to explore your life’s numbers.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
