// src/components/RightSidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { StarsBackground } from './Stars';

// Initialize the Supabase client for the front end
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RightSidebar() {
  const [todaysTip, setTodaysTip] = useState("Loading...");
  const [luckyNumber, setLuckyNumber] = useState(null);

  useEffect(() => {
    const fetchDailyData = async () => {
      const today = dayjs().format('YYYY-MM-DD');

      const { data, error } = await supabase
        .from('fengshui_tips')
        .select('tip, lucky_number')
        .eq('date', today)
        .single();

      if (error || !data) {
        console.error("Failed to fetch daily data:", error?.message);
        // Fallback to static data if the fetch fails
        setTodaysTip("Clear your mind to welcome positive chi.");
        setLuckyNumber(8);
      } else {
        setTodaysTip(data.tip);
        setLuckyNumber(data.lucky_number);
      }
    };

    fetchDailyData();
  }, []);

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
          <p className="text-gray-300 italic text-base md:text-lg">
            "{todaysTip}"
          </p>
        </CardContent>
      </Card>

      {/* Daily Planetary Overview Widget */}
	 <StarsBackground className="relative overflow-hidden rounded-xl">
	  <Card className="relative z-10 bg-transparent text-white shadow-xl border-transparent">
	    <CardHeader className="pb-3">
	      <CardTitle className="text-lg text-gold flex items-center gap-2 relative z-10">
	        🪐 Daily Planetary Overview
	      </CardTitle>
	    </CardHeader>
	    <CardContent className="relative z-10">
	      <div className="text-center">
	        
	        <p className="text-sm text-gray-400">
	          Nothing here yet.
	        </p>
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