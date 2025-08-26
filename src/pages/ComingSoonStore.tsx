// src/pages/ComingSoonPage.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col mt-2">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-7xl font-bold text-gold mb-4 animate-pulse">
            Our Store is Coming Soon!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            We're busy curating a collection of products we recommend just for you. Get ready to shop our handpicked favorites.
          </p>
          <p className="text-gray-500 mb-8">
            Stay tuned for updates! In the meantime, explore our other wisdom tools and resources.
          </p>
          <Link to="/" className="inline-block">
            <Button className="bg-gold text-black hover:bg-gold/80 font-semibold px-8 py-2 rounded-full shadow-lg transition-colors">
              Explore Our Site
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}