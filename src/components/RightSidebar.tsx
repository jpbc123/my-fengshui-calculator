// src/components/RightSidebar.tsx - UPDATED TO USE ARTICLEPAGE
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Link } from "react-router-dom";
import { StarsBackground } from "./Stars";

dayjs.extend(utc);
dayjs.extend(timezone);

interface PlanetaryOverviewData {
  date: string;
  planetary_index?: number;
  summary?: string;
  article?: string;
}

interface FengShuiTipData {
  tip: string;
}

export default function RightSidebar() {
  const [todaysTip, setTodaysTip] = useState("Loading...");
  const [planetaryOverviewData, setPlanetaryOverviewData] = useState<PlanetaryOverviewData | null>(null);
  const [loadingPlanetaryOverview, setLoadingPlanetaryOverview] = useState(true);
  const [loadingFengShuiTip, setLoadingFengShuiTip] = useState(true);

  // Use current date for display
  const today = dayjs().format("YYYY-MM-DD");
  
  const isCacheValid = (cacheKey: string, expectedDate: string): boolean => {
    const cachedData = localStorage.getItem(cacheKey);
    if (!cachedData) return false;
    
    try {
      const parsed = JSON.parse(cachedData);
      const cacheDate = parsed.date || parsed.cached_date;
      const isValid = cacheDate === expectedDate;
      
      console.log(`Cache validation for ${cacheKey}: cached=${cacheDate}, expected=${expectedDate}, valid=${isValid}`);
      return isValid;
    } catch (error) {
      console.error(`Error parsing cache for ${cacheKey}:`, error);
      localStorage.removeItem(cacheKey);
      return false;
    }
  };

  const cleanupOldCache = () => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => 
      key.startsWith('fengshuiTip_') || 
      key.startsWith('planetaryOverview_')
    );
    
    cacheKeys.forEach(key => {
      const date = key.split('_')[1];
      if (date && date !== today) {
        console.log(`Removing old cache: ${key}`);
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    cleanupOldCache();
  }, [today]);

  // Fetch Feng Shui Tip using Vercel API routes
  useEffect(() => {
    const tipCacheKey = `fengshuiTip_${today}`;
    const tipCached = localStorage.getItem(tipCacheKey);
    
    if (tipCached && isCacheValid(tipCacheKey, today)) {
      try {
        const tipData = JSON.parse(tipCached);
        console.log(`Using cached feng shui tip for ${today}`);
        setTodaysTip(tipData.tip);
        setLoadingFengShuiTip(false);
        return;
      } catch (error) {
        console.error(`Error parsing feng shui cache:`, error);
        localStorage.removeItem(tipCacheKey);
      }
    }

    const fetchDailyFengshuiTip = async () => {
      try {
        setLoadingFengShuiTip(true);
        console.log(`Fetching feng shui tip for ${today}...`);
        
        const response = await fetch('/api/daily-fengshui-tip');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const tip = result?.tip || "Clear your mind to welcome positive chi.";

        setTodaysTip(tip);

        localStorage.setItem(tipCacheKey, JSON.stringify({
          tip,
          cached_date: today,
          cached_at: new Date().toISOString()
        }));
        
        console.log(`Cached feng shui tip for ${today}`);
      } catch (error) {
        console.error("Failed to fetch daily feng shui tip:", error);
        setTodaysTip("Clear your mind to welcome positive chi.");
      } finally {
        setLoadingFengShuiTip(false);
      }
    };

    fetchDailyFengshuiTip();
  }, [today]);

  // Fetch Planetary Overview using Vercel API routes
  useEffect(() => {
    const cacheKey = `planetaryOverview_${today}`;
    console.log(`Checking planetary overview cache for key: ${cacheKey}`);

    if (isCacheValid(cacheKey, today)) {
      const cachedData = localStorage.getItem(cacheKey);
      try {
        const parsedData = JSON.parse(cachedData!);
        console.log(`Using cached planetary overview for ${today}`);
        setPlanetaryOverviewData(parsedData);
        setLoadingPlanetaryOverview(false);
        return;
      } catch (error) {
        console.error(`Error parsing planetary overview cache:`, error);
        localStorage.removeItem(cacheKey);
      }
    }

    const fetchPlanetaryOverview = async () => {
      try {
        setLoadingPlanetaryOverview(true);
        console.log(`Fetching planetary overview for ${today}...`);
        
        const response = await fetch('/api/planetary-overview');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result) {
          const normalizedResult = {
            ...result,
            date: today,
            cached_date: today,
            cached_at: new Date().toISOString()
          };
          setPlanetaryOverviewData(normalizedResult);
          localStorage.setItem(cacheKey, JSON.stringify(normalizedResult));
          console.log(`Cached planetary overview for ${today}`);
        } else {
          const fallbackData = {
            date: today,
            planetary_index: 2,
            summary: "Universal energies are in transition today. Take time for reflection and avoid making hasty decisions.",
            article: "Today brings a blend of practical and intuitive energies. The planetary alignments suggest focusing on balance and mindful decision-making.",
            cached_date: today,
            cached_at: new Date().toISOString(),
            is_fallback: true
          };
          setPlanetaryOverviewData(fallbackData);
        }
      } catch (error) {
        console.error("Failed to fetch planetary overview:", error);
        const fallbackData = {
          date: today,
          planetary_index: 2,
          summary: "Universal energies are in transition today. Take time for reflection and avoid making hasty decisions.",
          article: "Today brings a blend of practical and intuitive energies. The planetary alignments suggest focusing on balance and mindful decision-making.",
          cached_date: today,
          cached_at: new Date().toISOString(),
          is_fallback: true
        };
        setPlanetaryOverviewData(fallbackData);
      } finally {
        setLoadingPlanetaryOverview(false);
      }
    };

    fetchPlanetaryOverview();
  }, [today]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-950 to-gray-900 text-white shadow-xl border-gold/10 p-6">
        <CardHeader className="py-2">
          <CardTitle className="text-lg text-gold flex items-center gap-2">
            🌿 Today's Feng Shui Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-2">
          {loadingFengShuiTip ? (
            <p className="text-gray-400 italic text-base md:text-lg">
              Loading feng shui tip...
            </p>
          ) : (
            <p className="text-gray-300 italic text-base md:text-lg">
              "{todaysTip}"
            </p>
          )}
        </CardContent>
      </Card>

      <StarsBackground className="relative overflow-hidden rounded-xl">
        <Card className="relative z-10 bg-transparent text-white shadow-xl border-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gold flex items-center gap-2 relative z-10">
              🪐 Daily Planetary Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-left min-h-[150px]">
              {loadingPlanetaryOverview ? (
                <p className="text-sm text-gray-400">
                  Loading planetary overview...
                </p>
              ) : planetaryOverviewData ? (
                <>
                  {planetaryOverviewData.planetary_index && (
                    <p className="text-xs text-gray-400">
                      Planetary Index: {planetaryOverviewData.planetary_index}/5
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mb-2">
                    {dayjs(planetaryOverviewData.date).format("MMM D, YYYY")}
                    {(planetaryOverviewData as any).is_fallback && (
                      <span className="text-yellow-400 ml-2">(Fallback)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-200">
                    {planetaryOverviewData.summary}
                  </p>
                  {/* UPDATED: Use ArticlePage with planetary slug format */}
                  <Link
                    to={`/articles/planetary-${today}`}
                    className="text-gold text-sm font-semibold hover:underline mt-2 inline-block"
                  >
                    Read full overview
                  </Link>
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  Planetary overview not available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </StarsBackground>

      <Card className="bg-gradient-to-br from-indigo-950 to-gray-900 text-white shadow-xl border-gold/10">
        <CardContent className="p-6">
          <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-gold mb-2">Discover Your Aura</h3>
            <p className="text-sm text-gray-300 mb-4">
              Explore your personal energy field with our new aura analysis tool.
            </p>
            <Link to="/aura-analysis">
              <button className="bg-gold text-black px-4 py-2 rounded-lg text-sm hover:bg-gold/80 transition-colors">
                Try it now
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}