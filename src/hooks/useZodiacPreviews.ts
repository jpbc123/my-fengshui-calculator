// src/hooks/useZodiacPreviews.ts
import { useState, useEffect } from 'react';

interface ZodiacPreview {
  sign: string;
  preview: string;
  loading: boolean;
}

export const useZodiacPreviews = () => {
  const [previews, setPreviews] = useState<{ [key: string]: ZodiacPreview }>({});
  const [loading, setLoading] = useState(true);

  const zodiacSigns = [
    "rat", "ox", "tiger", "rabbit", "dragon", "snake", 
    "horse", "goat", "monkey", "rooster", "dog", "pig"
  ];

  useEffect(() => {
    const fetchPreviews = async () => {
      setLoading(true);
      const previewPromises = zodiacSigns.map(async (sign) => {
        try {
          // Use your existing API endpoint
          const response = await fetch(`/api/chinese-horoscope?zodiac=${sign}&period=daily&dayOffset=0`);
          if (!response.ok) throw new Error(`Failed to fetch ${sign}`);
          
          const data = await response.json();
          // Extract first 60-80 characters from horoscope_en
          const fullText = data.horoscope_en || data.horoscope || "Cosmic energy flows around you today.";
          const preview = fullText.length > 70 
            ? fullText.substring(0, 70) + "..." 
            : fullText;
          
          return {
            sign,
            preview,
            loading: false
          };
        } catch (error) {
          console.error(`Failed to fetch preview for ${sign}:`, error);
          return {
            sign,
            preview: "Discover your daily guidance...",
            loading: false
          };
        }
      });

      const results = await Promise.all(previewPromises);
      const previewsMap = results.reduce((acc, result) => {
        acc[result.sign] = result;
        return acc;
      }, {} as { [key: string]: ZodiacPreview });

      setPreviews(previewsMap);
      setLoading(false);
    };

    fetchPreviews();
  }, []);

  return { previews, loading };
};