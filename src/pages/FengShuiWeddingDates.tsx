// src/pages/FengShuiWeddingDates.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Star, CheckCircle, CalendarCheck, Gift, Shield, Sparkles, Users, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import { Solar, Lunar } from "lunar-typescript";
import chineseWeddingImage from '../assets/chinese-wedding-date.jpg';

interface ZodiacSigns {
  [year: number]: string;
}

interface ClashPairs {
  [zodiac: string]: string;
}

interface DateInfo {
  date: Date;
  dayName: string;
  lunarDate: string;
  reasons: string[];
  warnings: string[];
  auspiciousness: 'high' | 'medium' | 'low';
  auspiciousTimes?: string;
}

const FengShuiWeddingDates = () => {
  const [formData, setFormData] = useState({
    brideBirthdate: '',
    groomBirthdate: '',
    weddingYear: ''
  });
  
  const [auspiciousDates, setAuspiciousDates] = useState<DateInfo[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const breadcrumbs = [
  ];

  // Generate wedding year options (current year + 4 future years)
  const currentYear = new Date().getFullYear();
  const weddingYearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Data for Chinese Zodiac animals and their clash signs
  const zodiacSigns: ZodiacSigns = {
    1924: "Rat", 1925: "Ox", 1926: "Tiger", 1927: "Rabbit", 1928: "Dragon",
    1929: "Snake", 1930: "Horse", 1931: "Goat", 1932: "Monkey", 1933: "Rooster",
    1934: "Dog", 1935: "Pig", 1936: "Rat", 1937: "Ox", 1938: "Tiger",
    1939: "Rabbit", 1940: "Dragon", 1941: "Snake", 1942: "Horse", 1943: "Goat",
    1944: "Monkey", 1945: "Rooster", 1946: "Dog", 1947: "Pig", 1948: "Rat",
    1949: "Ox", 1950: "Tiger", 1951: "Rabbit", 1952: "Dragon", 1953: "Snake",
    1954: "Horse", 1955: "Goat", 1956: "Monkey", 1957: "Rooster", 1958: "Dog",
    1959: "Pig", 1960: "Rat", 1961: "Ox", 1962: "Tiger", 1963: "Rabbit",
    1964: "Dragon", 1965: "Snake", 1966: "Horse", 1967: "Goat", 1968: "Monkey",
    1969: "Rooster", 1970: "Dog", 1971: "Pig", 1972: "Rat", 1973: "Ox",
    1974: "Tiger", 1975: "Rabbit", 1976: "Dragon", 1977: "Snake", 1978: "Horse",
    1979: "Goat", 1980: "Monkey", 1981: "Rooster", 1982: "Dog", 1983: "Pig",
    1984: "Rat", 1985: "Ox", 1986: "Tiger", 1987: "Rabbit", 1988: "Dragon",
    1989: "Snake", 1990: "Horse", 1991: "Goat", 1992: "Monkey", 1993: "Rooster",
    1994: "Dog", 1995: "Pig", 1996: "Rat", 1997: "Ox", 1998: "Tiger",
    1999: "Rabbit", 2000: "Dragon", 2001: "Snake", 2002: "Horse", 2003: "Goat",
    2004: "Monkey", 2005: "Rooster", 2006: "Dog", 2007: "Pig", 2008: "Rat",
    2009: "Ox", 2010: "Tiger", 2011: "Rabbit", 2012: "Dragon", 2013: "Snake",
    2014: "Horse", 2015: "Goat", 2016: "Monkey", 2017: "Rooster", 2018: "Dog",
    2019: "Pig", 2020: "Rat", 2021: "Ox", 2022: "Tiger", 2023: "Rabbit",
    2024: "Dragon", 2025: "Snake"
  };

  const clashPairs: ClashPairs = {
    "Rat": "Horse", "Ox": "Goat", "Tiger": "Monkey", "Rabbit": "Rooster",
    "Dragon": "Dog", "Snake": "Pig", "Horse": "Rat", "Goat": "Ox",
    "Monkey": "Tiger", "Rooster": "Rabbit", "Dog": "Dragon", "Pig": "Snake"
  };

  const features = [
    "Chinese lunar calendar integration",
    "Year-round date availability with warnings", 
    "Daily zodiac clash analysis",
    "Heavenly stem elemental harmony",
    "Ghost Month cultural guidance",
    "Traditional lucky number analysis",
    "San Niang Sha day warnings",
    "Cultural festival awareness"
  ];

  const faqData = [
    {
      question: "How do I use this wedding date selector and what should I expect?",
      answer: "Simply enter both partners' birth dates and select your planned wedding year. Our tool will analyze your zodiac compatibility, elemental harmony, and lunar calendar factors to provide year-round wedding date options. Each result shows the date's auspiciousness level (High, Medium, or Low) along with positive factors and traditional warnings. You'll see dates from every month, giving you flexibility while respecting cultural wisdom."
    },
    {
      question: "What is Ghost Month and why is it significant?",
      answer: "Ghost Month refers to the seventh month of the lunar calendar (usually July-August), when it's traditionally believed that ancestral spirits return to the earthly realm. During this period, Chinese culture considers it inauspicious to hold celebrations like weddings, as the presence of spirits may bring negative energy. While we still show Ghost Month dates with clear warnings, many couples prefer to avoid this period for their wedding ceremonies."
    },
    {
      question: "What is San Niang Sha and why should I be aware of it?",
      answer: "San Niang Sha refers to specific lunar days (3rd, 7th, 13th, 18th, 22nd, and 27th of each lunar month) that are traditionally considered unlucky for weddings. Legend tells of San Niang, a vengeful deity who opposes marriages and love. These days are believed to bring marital discord, relationship challenges, or wedding day mishaps. Our tool flags these dates with warnings so you can make an informed decision."
    },
    {
      question: "What do 'zodiac clashes' mean in wedding date selection?",
      answer: "Zodiac clashes occur when incompatible Chinese zodiac animals meet. Each zodiac sign has a direct opposite that creates conflict: Rat-Horse, Ox-Goat, Tiger-Monkey, Rabbit-Rooster, Dragon-Dog, and Snake-Pig. In wedding date selection, we check if the daily zodiac animal clashes with either partner's birth year animal. Clashing energies may create tension or obstacles, so we provide warnings when this occurs."
    },
    {
      question: "How are auspicious wedding dates determined in this calendar?",
      answer: "Our wedding date calculator uses authentic Chinese feng shui principles, analyzing multiple factors including lunar calendar positioning, daily zodiac animals, elemental harmony through heavenly stems, and traditional taboos. We evaluate each date's cosmic energy alignment with your personal birth charts, considering both positive influences and potential warnings to provide comprehensive guidance for your special day."
    },
    {
      question: "Why is it important to choose an auspicious wedding date?",
      answer: "In Chinese tradition, selecting an auspicious wedding date is believed to establish a harmonious foundation for marriage. By aligning your wedding with favorable cosmic energies and avoiding traditionally problematic periods, couples aim to enhance their relationship's potential for happiness, prosperity, and longevity. While not scientifically proven, this practice offers cultural guidance and peace of mind for those who value traditional wisdom."
    },
    {
      question: "What if my preferred wedding date shows warnings or isn't highly auspicious?",
      answer: "Don't worry! Our tool provides year-round options, including dates with warnings for educational purposes. If your preferred date has warnings, you can either accept the traditional concerns and proceed, or consider nearby dates with better auspiciousness ratings. Remember, the most important factor is your love and commitment - traditional guidance is meant to support, not dictate, your choices."
    },
    {
      question: "Can auspicious wedding dates influence fertility and family harmony?",
      answer: "Traditional Chinese belief suggests that auspicious wedding dates create favorable energetic conditions for all aspects of married life, including starting a family and maintaining household harmony. The theory is that positive cosmic alignment at the time of marriage continues to influence the relationship throughout its duration. While this is a cultural belief rather than scientific fact, many couples find comfort and intention in following these traditions."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Helper function to get Chinese Zodiac using lunar calendar
  const getZodiac = (year: number): string => {
    return zodiacSigns[year] || "Unknown";
  };

  // Helper function to check if two zodiac signs clash
  const doZodiacsClash = (zodiac1: string, zodiac2: string): boolean => {
    return clashPairs[zodiac1] === zodiac2 || clashPairs[zodiac2] === zodiac1;
  };

  // Get heavenly stem element for a given date
  const getHeavenlyStemElement = (date: Date): string => {
    try {
      const lunar = Lunar.fromDate(date);
      const dayGanZhi = lunar.getDayInGanZhi();
      const stemChineseChar = dayGanZhi.charAt(0);
      
      const stemMapping: Record<string, string> = {
        "甲": "Wood", "乙": "Wood",
        "丙": "Fire", "丁": "Fire",
        "戊": "Earth", "己": "Earth",
        "庚": "Metal", "辛": "Metal",
        "壬": "Water", "癸": "Water"
      };
      
      return stemMapping[stemChineseChar] || "Unknown";
    } catch (error) {
      console.error("Error calculating heavenly stem:", error);
      return "Unknown";
    }
  };

  // Check if date falls on San Niang Sha
  const isSanNiangSha = (date: Date): boolean => {
    try {
      const lunar = Lunar.fromDate(date);
      const lunarDay = lunar.getDay();
      const sanNiangDays = [3, 7, 13, 18, 22, 27];
      return sanNiangDays.includes(lunarDay);
    } catch (error) {
      return false;
    }
  };

  // Get daily zodiac animal
  const getDailyZodiacClash = (date: Date): string => {
    try {
      const lunar = Lunar.fromDate(date);
      const dayGanZhi = lunar.getDayInGanZhi();
      const branchChar = dayGanZhi.charAt(1);
      
      const branchToZodiac: Record<string, string> = {
        "子": "Rat", "丑": "Ox", "寅": "Tiger", "卯": "Rabbit",
        "辰": "Dragon", "巳": "Snake", "午": "Horse", "未": "Goat", 
        "申": "Monkey", "酉": "Rooster", "戌": "Dog", "亥": "Pig"
      };
      
      return branchToZodiac[branchChar] || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  // Check if it's Ghost Month
  const isGhostMonth = (date: Date): boolean => {
    try {
      const lunar = Lunar.fromDate(date);
      return lunar.getMonth() === 7;
    } catch (error) {
      return false;
    }
  };

  // Generate simple auspicious times based on zodiac
  const generateAuspiciousTimes = (dailyZodiac: string): string => {
    const timePatterns: Record<string, string> = {
      "Rat": "0500 to 0659, 1100 to 1259, 1500 to 1859",
      "Ox": "0500 to 0659, 0900 to 1059, 1500 to 1659, 1900 to 2259",
      "Tiger": "0700 to 1459, 1900 to 2059",
      "Rabbit": "0500 to 0659, 1100 to 1459, 1700 to 1859",
      "Dragon": "0700 to 1059, 1500 to 1859, 2100 to 2259",
      "Snake": "0700 to 1059, 1300 to 1459, 1900 to 2059",
      "Horse": "0500 to 0659, 1100 to 1259, 1500 to 1859",
      "Goat": "0500 to 0659, 0900 to 1059, 1500 to 1659, 1900 to 2259",
      "Monkey": "0700 to 1059, 1300 to 1459, 1900 to 2059",
      "Rooster": "0500 to 0659, 1100 to 1459, 1700 to 1859",
      "Dog": "0700 to 1059, 1500 to 1859, 2100 to 2259",
      "Pig": "0700 to 0859, 1100 to 1459, 1900 to 2259"
    };
    
    return timePatterns[dailyZodiac] || "0900 to 1200, 1400 to 1700";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showModalAlert = (title: string, message: string) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  const findAuspiciousDates = async () => {
    if (!formData.brideBirthdate || !formData.groomBirthdate || !formData.weddingYear) {
      showModalAlert("Missing Information", "Please enter both birth dates and select your planned wedding year to find auspicious dates.");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const brideYear = new Date(formData.brideBirthdate).getFullYear();
    const groomYear = new Date(formData.groomBirthdate).getFullYear();
    const brideZodiac = getZodiac(brideYear);
    const groomZodiac = getZodiac(groomYear);
    const brideElement = getHeavenlyStemElement(new Date(formData.brideBirthdate));
    const groomElement = getHeavenlyStemElement(new Date(formData.groomBirthdate));

    const selectedYear = parseInt(formData.weddingYear);
    const dates: DateInfo[] = [];
    
    let startDate: Date;
    let endDate: Date;
    
    if (selectedYear === currentYear) {
      startDate = new Date();
    } else {
      startDate = new Date(selectedYear, 0, 1);
    }
    
    endDate = new Date(selectedYear, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDate();
      const dayOfWeek = d.getDay();
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

      const reasons: string[] = [];
      const warnings: string[] = [];

      // Get lunar date info
      let lunarDate = "";
      try {
        const lunar = Lunar.fromDate(d);
        const lunarDay = lunar.getDay();
        const lunarMonth = lunar.getMonth();
        lunarDate = `${lunarDay} ${getChineseMonth(lunarMonth)} ${lunar.getYear()}`;
        
        // San Niang Sha warning
        if (isSanNiangSha(d)) {
          warnings.push("San Niang Sha day - traditionally avoided for weddings");
        }

        // Ghost Month warning
        if (isGhostMonth(d)) {
          warnings.push("Ghost Month - seventh lunar month when ancestral spirits are active");
        }

        // Lunar day analysis
        if ([1, 6, 8, 9, 15, 16, 24, 25].includes(lunarDay)) {
          reasons.push(`Auspicious lunar day (${lunarDay}) brings good fortune`);
        }

        // Number 4 warnings
        if (lunarDay.toString().includes('4')) {
          warnings.push("Lunar day contains number 4 - traditionally avoided");
        }

        // Even lunar months
        if (lunarMonth % 2 === 0) {
          reasons.push(`Even lunar month promotes harmony and balance`);
        }

        // Special festivals
        const monthDay = `${lunarMonth}-${lunarDay}`;
        switch (monthDay) {
          case "1-15":
            reasons.push(`Lantern Festival - celebration of reunion and love`);
            break;
          case "2-2":
            reasons.push(`Dragon Head Raising Day - auspicious for new beginnings`);
            break;
          case "8-15":
            reasons.push(`Mid-Autumn Festival - symbol of reunion and completeness`);
            break;
        }

      } catch (error) {
        lunarDate = "Lunar calculation unavailable";
        warnings.push("Lunar calculation unavailable for this date");
      }

      // Daily zodiac analysis
      const dailyZodiac = getDailyZodiacClash(d);
      let auspiciousTimes = "";
      
      if (dailyZodiac !== "Unknown") {
        auspiciousTimes = generateAuspiciousTimes(dailyZodiac);
        
        if (doZodiacsClash(brideZodiac, dailyZodiac) || doZodiacsClash(groomZodiac, dailyZodiac)) {
          warnings.push(`Daily zodiac (${dailyZodiac}) clashes with your signs (${brideZodiac} & ${groomZodiac})`);
        } else {
          reasons.push(`Daily zodiac (${dailyZodiac}) harmonious with your signs (${brideZodiac} & ${groomZodiac})`);
        }
      }

      // Elemental analysis
      const dayElement = getHeavenlyStemElement(d);
      if (dayElement !== "Unknown" && brideElement !== "Unknown" && groomElement !== "Unknown") {
        const elementCycle: Record<string, string> = {
          "Wood": "Fire", "Fire": "Earth", "Earth": "Metal", "Metal": "Water", "Water": "Wood"
        };
        
        if (elementCycle[dayElement] === brideElement || elementCycle[dayElement] === groomElement ||
            dayElement === brideElement || dayElement === groomElement) {
          reasons.push(`Day element (${dayElement}) supports your personal elements`);
        }
        
        const destructiveCycle: Record<string, string> = {
          "Wood": "Earth", "Fire": "Metal", "Earth": "Water", "Metal": "Wood", "Water": "Fire"
        };
        
        if (destructiveCycle[dayElement] === brideElement || destructiveCycle[dayElement] === groomElement) {
          warnings.push(`Day element (${dayElement}) may conflict with your personal elements`);
        }
      }

      // Number 4 in Gregorian date
      if (day.toString().includes('4')) {
        warnings.push("Date contains number 4 - considered unlucky in Chinese culture");
      }

      // Lucky numbers
      const luckyNumbers = [2, 6, 8, 9];
      if (luckyNumbers.includes(day % 10)) {
        reasons.push(`Lucky Gregorian day number (${day}) brings prosperity`);
      }

      // Weekend bonus
      if (dayOfWeek === 6 || dayOfWeek === 0) {
        reasons.push(`Weekend date ideal for celebration and gathering`);
      }

      // Determine auspiciousness - FIXED LOGIC
      let auspiciousness: 'high' | 'medium' | 'low';
      
      // High: No warnings AND multiple positive factors
      if (warnings.length === 0 && reasons.length >= 2) {
        auspiciousness = 'high';
      }
      // Medium: Minor warnings OR decent positive factors
      else if ((warnings.length <= 1 && reasons.length >= 1) || (warnings.length === 0 && reasons.length >= 1)) {
        auspiciousness = 'medium';
      }
      // Low: Multiple warnings OR few positive factors
      else {
        auspiciousness = 'low';
      }
      
      // FORCE some dates to be low auspiciousness for demonstration
      // This ensures we show warning examples
      if (warnings.length >= 2) {
        auspiciousness = 'low';
      }
      
      // Special cases that should definitely be low
      if (isGhostMonth(d) && isSanNiangSha(d)) {
        auspiciousness = 'low'; // Both Ghost Month AND San Niang Sha
      }
      
      if (day.toString().includes('4') && warnings.length > 0) {
        auspiciousness = 'low'; // Number 4 with other warnings
      }

      // INCLUDE ALL DATES - this is the key change
      // We include every date but just vary the auspiciousness level
      dates.push({ 
        date: new Date(d), 
        dayName,
        lunarDate,
        reasons, 
        warnings, 
        auspiciousness,
        auspiciousTimes 
      });
    }

    // Filter to get a good spread throughout the year
    // CRITICAL FIX: Include ALL dates, then filter for display variety
    const datesByMonth: { [key: number]: DateInfo[] } = {};
    dates.forEach(date => {
      const month = date.date.getMonth();
      if (!datesByMonth[month]) {
        datesByMonth[month] = [];
      }
      datesByMonth[month].push(date);
    });

    // NEW APPROACH: Ensure we get dates from every month with variety
    const finalDates: DateInfo[] = [];
    
    // For each month, include a mix of high, medium, AND low auspiciousness dates
    Object.keys(datesByMonth).forEach(monthKey => {
      const month = parseInt(monthKey);
      const monthDates = datesByMonth[month];
      
      // Sort by auspiciousness but keep variety
      const highDates = monthDates.filter(d => d.auspiciousness === 'high');
      const mediumDates = monthDates.filter(d => d.auspiciousness === 'medium');
      const lowDates = monthDates.filter(d => d.auspiciousness === 'low');
      
      // Take dates from each category to show warnings
      const selectedDates: DateInfo[] = [];
      
      // Take top 2 high dates
      selectedDates.push(...highDates.slice(0, 2));
      
      // Take 2 medium dates (which often have some warnings)
      selectedDates.push(...mediumDates.slice(0, 2));
      
      // IMPORTANT: Take 1-2 low dates to show warnings in action
      selectedDates.push(...lowDates.slice(0, Math.min(2, lowDates.length)));
      
      // If we don't have enough variety, take more from what we have
      if (selectedDates.length < 3 && monthDates.length > 0) {
        const remaining = monthDates.filter(d => !selectedDates.includes(d));
        selectedDates.push(...remaining.slice(0, 6 - selectedDates.length));
      }
      
      finalDates.push(...selectedDates);
    });

    // Final sort: high first, but keep some low auspiciousness dates for education
    finalDates.sort((a, b) => {
      // Don't sort by auspiciousness only - maintain variety
      const monthA = a.date.getMonth();
      const monthB = b.date.getMonth();
      
      // Group by month first
      if (monthA !== monthB) {
        return monthA - monthB;
      }
      
      // Within same month, sort by auspiciousness but keep variety
      const auspiciousnessOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const aOrder = auspiciousnessOrder[a.auspiciousness];
      const bOrder = auspiciousnessOrder[b.auspiciousness];
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      return a.date.getTime() - b.date.getTime();
    });

    setAuspiciousDates(finalDates);
    setShowResults(true);
    setCurrentPage(1); // Reset to first page when new results are loaded
    setIsLoading(false);
  };

  // Helper function for Chinese month names
  const getChineseMonth = (month: number): string => {
    const monthNames = ["", "正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
    return monthNames[month] || `${month}月`;
  };

  const isFormValid = formData.brideBirthdate && formData.groomBirthdate && formData.weddingYear;

  const getAuspiciousnessConfig = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return {
          icon: <Star className="w-3 h-3 mr-1" />,
          label: "Highly Auspicious",
          bgColor: "bg-gradient-to-r from-emerald-100 to-green-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200"
        };
      case 'medium':
        return {
          icon: <Clock className="w-3 h-3 mr-1" />,
          label: "Moderately Auspicious",
          bgColor: "bg-gradient-to-r from-amber-100 to-yellow-100",
          textColor: "text-amber-700",
          borderColor: "border-amber-200"
        };
      case 'low':
        return {
          icon: <AlertTriangle className="w-3 h-3 mr-1" />,
          label: "Proceed with Caution",
          bgColor: "bg-gradient-to-r from-orange-100 to-red-100",
          textColor: "text-orange-700",
          borderColor: "border-orange-200"
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 text-slate-800">
      <Header />
      
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-red-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb items={breadcrumbs} />

          {/* Hero + FAQ Section with Single Background Image */}
          <div 
            className="relative text-center mb-16 mt-8 rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url(${chineseWeddingImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Adjustable blur overlay - change backdrop-blur-sm to backdrop-blur-md, backdrop-blur-lg, or backdrop-blur-xl for more blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-none"></div>
            
            <div className="relative z-10">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="py-20 px-8"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  Feng Shui Wedding Dates
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  Discover year-round wedding dates with traditional wisdom and cultural guidance
                </p>
              </motion.div>

              {/* FAQ Section (no separate background) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="pb-16 px-8"
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqData.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-rose-50/70 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-slate-800 pr-4">
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {openFAQ === index ? (
                              <ChevronUp className="w-5 h-5 text-rose-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-rose-600" />
                            )}
                          </div>
                        </button>
                        
                        <motion.div
                          initial={false}
                          animate={{
                            height: openFAQ === index ? "auto" : 0,
                            opacity: openFAQ === index ? 1 : 0
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2">
                            <div className="border-t border-rose-100 pt-4">
                              <p className="text-slate-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Enter Your Birth Information</h2>
                  <p className="text-slate-600">We'll analyze your compatibility and provide guidance for wedding dates throughout the year</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  {/* Partner One */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-4">Partner One</h3>
                      <div>
                        <label htmlFor="brideBirthdate" className="block text-sm font-medium text-white/90 mb-2">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="brideBirthdate"
                          name="brideBirthdate"
                          value={formData.brideBirthdate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner Two */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-4">Partner Two</h3>
                      <div>
                        <label htmlFor="groomBirthdate" className="block text-sm font-medium text-white/90 mb-2">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="groomBirthdate"
                          name="groomBirthdate"
                          value={formData.groomBirthdate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wedding Year */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-4">Wedding Year</h3>
                      <div>
                        <label htmlFor="weddingYear" className="block text-sm font-medium text-white/90 mb-2">
                          Planned Year
                        </label>
                        <select
                          id="weddingYear"
                          name="weddingYear"
                          value={formData.weddingYear}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                        >
                          <option value="" className="text-gray-800">Select Year</option>
                          {weddingYearOptions.map(year => (
                            <option key={year} value={year.toString()} className="text-gray-800">
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={findAuspiciousDates}
                    disabled={!isFormValid || isLoading}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        Consulting the Stars...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 w-5 h-5" />
                        Find Our Perfect Dates
                      </>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Results Section */}
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8"
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">Your Wedding Dates for {formData.weddingYear}</h3>
                    <p className="text-slate-600">Year-round options with traditional guidance and cultural insights</p>
                  </div>

                  {auspiciousDates.length > 0 ? (
                    <>
                      {/* Pagination Info */}
                      <div className="text-center mb-6 text-slate-600">
                        Showing {Math.min((currentPage - 1) * resultsPerPage + 1, auspiciousDates.length)} - {Math.min(currentPage * resultsPerPage, auspiciousDates.length)} of {auspiciousDates.length} dates
                      </div>
                      
                      <div className="grid gap-6">
                        {auspiciousDates
                          .slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
                          .map((dateInfo, index) => {
                        const formattedDate = dateInfo.date.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                        
                        const auspiciousnessConfig = getAuspiciousnessConfig(dateInfo.auspiciousness);
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className={`group bg-gradient-to-r from-white to-rose-50/30 rounded-2xl p-6 border-2 ${auspiciousnessConfig.borderColor} hover:shadow-lg transition-all duration-300`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {/* Date Header */}
                                <div className="mb-4">
                                  <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mr-3" />
                                    <h4 className="text-xl font-bold text-slate-800">{formattedDate}</h4>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                                    <span className="font-medium">{dateInfo.dayName}</span>
                                    <span>•</span>
                                    <span>Lunar: {dateInfo.lunarDate}</span>
                                  </div>
                                  {dateInfo.auspiciousTimes && (
                                    <div className="mt-2 text-sm text-slate-600">
                                      <span className="font-medium">Auspicious Times: </span>
                                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                        {dateInfo.auspiciousTimes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Positive Reasons */}
                                {dateInfo.reasons.length > 0 && (
                                  <div className="space-y-2 mb-4">
                                    {dateInfo.reasons.map((reason, reasonIndex) => (
                                      <div key={reasonIndex} className="flex items-start text-sm text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Warnings */}
                                {dateInfo.warnings.length > 0 && (
                                  <div className="space-y-2 mb-4">
                                    {dateInfo.warnings.map((warning, warningIndex) => (
                                      <div key={warningIndex} className="flex items-start text-sm text-red-600">
                                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{warning}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 text-right">
                                <div className={`inline-flex items-center px-3 py-1 ${auspiciousnessConfig.bgColor} ${auspiciousnessConfig.textColor} text-xs font-medium rounded-full`}>
                                  {auspiciousnessConfig.icon}
                                  {auspiciousnessConfig.label}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      </div>
                      
                      {/* Pagination Controls */}
                      {auspiciousDates.length > resultsPerPage && (
                        <div className="mt-8 flex items-center justify-between">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                            Previous
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            {Array.from({ length: Math.ceil(auspiciousDates.length / resultsPerPage) }, (_, i) => i + 1)
                              .filter(page => 
                                page === 1 || 
                                page === Math.ceil(auspiciousDates.length / resultsPerPage) ||
                                Math.abs(page - currentPage) <= 2
                              )
                              .map((page, index, arr) => (
                                <div key={page} className="flex items-center">
                                  {index > 0 && arr[index - 1] !== page - 1 && (
                                    <span className="px-2 text-slate-400">...</span>
                                  )}
                                  <button
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                                      currentPage === page
                                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                </div>
                              ))
                            }
                          </div>
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(auspiciousDates.length / resultsPerPage)))}
                            disabled={currentPage === Math.ceil(auspiciousDates.length / resultsPerPage)}
                            className="flex items-center px-4 py-2 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            Next
                            <ChevronDown className="w-4 h-4 ml-2 -rotate-90" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-10 h-10 text-slate-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate-600 mb-2">No Suitable Dates Found</h4>
                      <p className="text-slate-500">Please try different birth dates or wedding year</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6">
                  <div className="flex items-center">
                    <Gift className="w-6 h-6 mr-3" />
                    <h3 className="text-xl font-bold">What's Included</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">Free Analysis</div>
                      <div className="text-sm text-gray-600">For a limited time only</div>
                      <div className="text-sm text-slate-600">Ancient wisdom made accessible</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Why Trust Our Calculator?</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Authentic Traditions</div>
                      <div className="text-sm text-slate-600">Based on 4,000-year-old practices</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Lunar Calendar Precision</div>
                      <div className="text-sm text-slate-600">Real-time celestial calculations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mr-4">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Privacy Protected</div>
                      <div className="text-sm text-slate-600">Your data stays secure</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cultural Context */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-xl text-white p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-rose-400" />
                  Cultural Wisdom
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  In Chinese culture, choosing an auspicious wedding date is believed to set the foundation for a harmonious marriage. Our approach provides year-round options while honoring traditional wisdom through clear warnings and guidance.
                </p>
                <div className="bg-white/10 rounded-lg p-3 text-xs text-slate-400">
                  <strong>Note:</strong> This tool provides cultural insights based on traditional beliefs. All dates are suitable for weddings - we simply provide traditional context to help with your decision.
                </div>
              </motion.div>

              {/* New Approach Explanation */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 mr-3" />
                    <h3 className="text-xl font-bold">Our Balanced Approach</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Unlike traditional methods that eliminate many dates, we provide year-round options with clear guidance:
                  </p>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-700">Comprehensive Coverage</div>
                        <div className="text-slate-600">Find suitable dates in every month of the year</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-700">Traditional Warnings</div>
                        <div className="text-slate-600">Clear alerts about Ghost Month, San Niang Sha, and zodiac clashes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-700">Auspiciousness Levels</div>
                        <div className="text-slate-600">Three-tier system helps you choose the best dates for your needs</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-700">Practical Flexibility</div>
                        <div className="text-slate-600">Balance cultural respect with modern wedding planning needs</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <div className="text-xs text-emerald-800">
                      <strong>Perfect Balance:</strong> Honor ancient wisdom while providing practical year-round wedding planning options. Every couple deserves their perfect day!
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md mx-auto p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">{modalContent.title}</h3>
              <p className="text-slate-600 mb-6">{modalContent.message}</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FengShuiWeddingDates;