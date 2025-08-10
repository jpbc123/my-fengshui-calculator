const FeaturesSection = () => {
  return (
    <section className="bg-black text-white py-20" id="features">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gold">
          Explore the Wisdom of Feng Shui </h2>
		<h2 className="text-4xl md:text-5xl font-bold mb-4 text-gold">Numerology & Astrology</h2>
        
        <p className="text-lg max-w-3xl mx-auto mb-10 text-gray-300">
          Gain personalized insights into your energy, relationships, and life path with our all-in-one guidance tools — blending ancient traditions with modern precision.
        </p>

        {/* Grid of features */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {[
            {
              icon: "🔍",
              title: "Personal Element Analysis",
              desc: "Discover your core element through Feng Shui’s Five Elements theory, based on your birth date. Understand your natural strengths, challenges, and life path according to ancient Chinese principles.",
            },
            {
              icon: "🏠",
              title: "Space Harmony Mapping",
              desc: "Get detailed recommendations for arranging your living and working spaces based on your Kua Number. Optimize energy flow for prosperity, health, and happiness.",
            },
            {
              icon: "💫",
              title: "Compatibility Analysis",
              desc: "Understand relationship dynamics through Astrology for deeper insights into personal, business, and family relationships.",
            },
            {
              icon: "📅",
              title: "Daily Guidance",
              desc: "Receive personalized daily tips based on your astrological influences and favorable dates in Feng Shui, helping you make the most of each day’s unique energy.",
            },
            {
              icon: "🎯",
              title: "Goal Manifestation",
              desc: "Use Numerology to identify powerful timing for your goals, and Feng Shui to align your environment for success in personal and professional endeavors",
            },
            {
              icon: "🌱",
              title: "Wellness Optimization",
              desc: "Enhance your physical and mental well-being through Feng Shui’s environmental harmony principles, with additional insights from Astrology on your personal health tendencies.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/70 border border-gold/10 rounded-xl p-6 hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;