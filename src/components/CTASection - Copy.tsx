const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-red-700 to-yellow-500 text-white py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Life?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Join thousands who have discovered harmony through our FengShui Calculator. Start your journey to balance and prosperity today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-gold text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-yellow-400 transition">Start Your Calculation</button>
          <button className="bg-transparent border-2 border-white px-6 py-3 rounded-full text-white hover:bg-white hover:text-black transition">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;