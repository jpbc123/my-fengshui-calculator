const FeaturesSection = () => {
  return (
    <section className="bg-black text-white py-20" id="features">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gold">
          Unlock the Power of FengShui
        </h2>
        <p className="text-lg max-w-3xl mx-auto mb-12 text-gray-300">
          Harness ancient Chinese wisdom with modern precision. Our comprehensive calculator provides personalized insights to transform your life and space.
        </p>

        {/* Grid of features */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {[
            {
              icon: "🔍",
              title: "Personal Element Analysis",
              desc: "Discover your core element based on your birth date and time. Understand your natural strengths, weaknesses, and life path according to ancient feng shui principles.",
            },
            {
              icon: "🏠",
              title: "Space Harmony Mapping",
              desc: "Get detailed recommendations for arranging your living and working spaces. Optimize energy flow for prosperity, health, and happiness.",
            },
            {
              icon: "💫",
              title: "Compatibility Analysis",
              desc: "Understand relationship dynamics through element compatibility. Perfect for personal relationships, business partnerships, and family harmony.",
            },
            {
              icon: "📅",
              title: "Daily Guidance",
              desc: "Receive personalized daily tips and recommendations based on your element and current cosmic influences to make the most of each day.",
            },
            {
              icon: "🎯",
              title: "Goal Manifestation",
              desc: "Learn the optimal timing and feng shui arrangements to support your personal and professional goals using ancient wisdom.",
            },
            {
              icon: "🌱",
              title: "Wellness Optimization",
              desc: "Discover how to enhance your physical and mental well-being through personalized feng shui practices and environmental adjustments.",
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