import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import products from "@/data/storeProducts.json";

const categories = ["All", "Feng Shui", "Astrology", "Numerology", "Seasonal Picks"];

const Store = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      <main className="flex-grow px-4 py-8 md:px-12 lg:px-20">
        <h1 className="text-3xl font-bold text-center mb-4">Feng Shui Marketplace</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Curated tools, books, and treasures for harmony, insight, and prosperity.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600 flex-grow">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-3">{product.price}</p>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Buy Now →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Affiliate Disclaimer */}
        <p className="text-xs text-center text-gray-500 mt-12 max-w-xl mx-auto">
          As an Amazon Associate and ClickBank affiliate, we may earn commissions from qualifying purchases.
          Your price remains the same, and these commissions help support our work.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Store;
