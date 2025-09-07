// src/components/RightSidebar.tsx - FIXED VERSION
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { StarsBackground } from "./Stars";

// Define the data type for the planetary overview content
interface PlanetaryOverviewData {
  date: string;
  planetary_index?: number;
  summary?: string;
  article?: string;
}

export default function RightSidebar() {
  const [todaysTip, setTodaysTip] = useState("Loading...");
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);

  const [planetaryOverviewData, setPlanetaryOverviewData] =
    useState<PlanetaryOverviewData | null>(null);
  const [loadingPlanetaryOverview, setLoadingPlanetaryOverview] =
    useState(true);
  const [loadingFengShuiTip, setLoadingFengShuiTip] = useState(true);

  // FIXED: Use consistent date format that matches your backend
  const today = dayjs().format("YYYY-MM-DD");

  // Fixed API base URL to match server port
  const API_BASE_URL = "http://localhost:3001";

  // Debug function to clear today's cache
  const clearTodayCache = () => {
    console.log(`Clearing cache for ${today}`);
    localStorage.removeItem(`fengshuiTip_${today}`);
    localStorage.removeItem(`fengshuiLucky_${today}`);
    localStorage.removeItem(`planetaryOverview_${today}`);
    
    // Also clear yesterday's cache just in case
    const yesterday = dayjs().subtract(1, 'day').format("YYYY-MM-DD");
    localStorage.removeItem(`planetaryOverview_${yesterday}`);
    
    window.location.reload();
  };

  // Fetch Feng Shui Tip (with localStorage caching and better error handling)
  useEffect(() => {
    const cachedTip = localStorage.getItem(`fengshuiTip_${today}`);
    const cachedLucky = localStorage.getItem(`fengshuiLucky_${today}`);

    if (cachedTip && cachedLucky) {
      setTodaysTip(cachedTip);
      setLuckyNumber(Number(cachedLucky));
      setLoadingFengShuiTip(false);
      return;
    }

    const fetchDailyFengshuiTip = async () => {
      try {
        setLoadingFengShuiTip(true);
        console.log(`Fetching feng shui tip for ${today}...`);
        const response = await fetch(`${API_BASE_URL}/api/daily-fengshui-tip`);
        
        if (!response.ok) {
          if (response.status === 202) {
            // Request in progress, retry after delay
            setTimeout(() => fetchDailyFengshuiTip(), 3000);
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        const tip = result.tip || "Clear your mind to welcome positive chi.";
        const lucky = result.lucky_number || 8;

        setTodaysTip(tip);
        setLuckyNumber(lucky);

        // Cache in localStorage
        localStorage.setItem(`fengshuiTip_${today}`, tip);
        localStorage.setItem(`fengshuiLucky_${today}`, String(lucky));
        console.log(`Cached feng shui tip for ${today}`);
      } catch (error) {
        console.error("Failed to fetch daily feng shui tip:", error);
        setTodaysTip("Clear your mind to welcome positive chi.");
        setLuckyNumber(8);
      } finally {
        setLoadingFengShuiTip(false);
      }
    };

    fetchDailyFengshuiTip();
  }, [today, API_BASE_URL]);

  // FIXED: Planetary Overview with better cache validation
  useEffect(() => {
    const cacheKey = `planetaryOverview_${today}`;
    const cachedOverview = localStorage.getItem(cacheKey);

    console.log(`Checking cache for key: ${cacheKey}`);
    console.log(`Cached data exists:`, !!cachedOverview);

    // FIXED: Validate cached data has the correct date before using it
    if (cachedOverview) {
      try {
        const parsedData = JSON.parse(cachedOverview);
        console.log(`Cached data date: ${parsedData.date}, Today: ${today}`);
        
        // Only use cached data if it's for today's date
        if (parsedData.date === today) {
          console.log(`Using valid cached data for ${today}`);
          setPlanetaryOverviewData(parsedData);
          setLoadingPlanetaryOverview(false);
          return;
        } else {
          console.log(`Cache date mismatch. Clearing old cache and fetching fresh data.`);
          localStorage.removeItem(cacheKey);
        }
      } catch (error) {
        console.error(`Error parsing cached data:`, error);
        localStorage.removeItem(cacheKey);
      }
    }

    const fetchPlanetaryOverview = async () => {
      try {
        setLoadingPlanetaryOverview(true);
        console.log(`Fetching planetary overview for ${today}...`);
        const response = await fetch(`${API_BASE_URL}/api/planetary-overview`);
        
        if (!response.ok) {
          if (response.status === 202) {
            // Request in progress, retry after delay
            console.log(`Request in progress, retrying in 3 seconds...`);
            setTimeout(() => fetchPlanetaryOverview(), 3000);
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`Fetched planetary overview:`, result);
        
        // Ensure we have today's data
        if (result.date !== today) {
          console.warn(`API returned data for ${result.date} but expected ${today}`);
        }
        
        setPlanetaryOverviewData(result);

        // Cache in localStorage with validation
        localStorage.setItem(cacheKey, JSON.stringify(result));
        console.log(`Cached planetary overview for ${today}`);
      } catch (error) {
        console.error("Failed to fetch planetary overview:", error);
        // Fallback data
        const fallbackData = {
          date: today,
          planetary_index: 2,
          summary:
            "Universal energies are in transition today. Take time for reflection and avoid making hasty decisions.",
          article: "Sample error fallback article",
        };
        setPlanetaryOverviewData(fallbackData);
      } finally {
        setLoadingPlanetaryOverview(false);
      }
    };

    fetchPlanetaryOverview();
  }, [today, API_BASE_URL]);

  return (
    <div className="space-y-6">
      {/* Today's Feng Shui Tip Widget */}
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

      {/* Daily Planetary Overview Widget */}
      <StarsBackground className="relative overflow-hidden rounded-xl">
        <Card className="relative z-10 bg-transparent text-white shadow-xl border-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gold flex items-center gap-2 relative z-10">
              🪐 Daily Planetary Overview
              {/* Debug button - remove in production */}
              <button 
                onClick={clearTodayCache}
                className="ml-auto bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                title="Clear cache and refresh"
              >
                🗑️
              </button>
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
                  </p>
                  <p className="text-sm text-gray-200">
                    {planetaryOverviewData.summary}
                  </p>
                  <Link
                    to="/planetary-overview"
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

      {/* Featured Tool Widget */}
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