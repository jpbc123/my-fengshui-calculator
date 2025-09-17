// src/components/ToolsShowcaseBanner.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Compass, 
  Hash, 
  Star, 
  Sparkles, 
  ArrowRight,
  Zap,
  Target,
  Users
} from 'lucide-react';

// Define tool categories and their tools
const toolCategories = [
  {
    category: "Feng Shui",
    color: "from-emerald-500 to-green-600",
    hoverColor: "hover:from-emerald-600 hover:to-green-700",
    icon: Compass,
    tools: [
      {
        name: "Personal Element",
        path: "/personal-element",
        description: "Discover your elemental nature",
        icon: Sparkles
      },
      {
        name: "Kua Number",
        path: "/kua-number-calculator",
        description: "Find your feng shui directions",
        icon: Target
      }
    ]
  },
  {
    category: "Numerology",
    color: "from-purple-500 to-indigo-600",
    hoverColor: "hover:from-purple-600 hover:to-indigo-700",
    icon: Hash,
    tools: [
      {
        name: "Visiber Calculator",
        path: "/visiber-calculator",
        description: "Decode your life path numbers",
        icon: Calculator
      }
    ]
  },
  {
    category: "Astrology",
    color: "from-blue-500 to-cyan-600",
    hoverColor: "hover:from-blue-600 hover:to-cyan-700",
    icon: Star,
    tools: [
      {
        name: "Chinese Zodiac",
        path: "/chinese-zodiac-calculator",
        description: "Find your Chinese animal sign",
        icon: Users
      },
      {
        name: "Western Zodiac",
        path: "/western-zodiac-calculator",
        description: "Discover your zodiac sign",
        icon: Star
      }
    ]
  }
];

const ToolsShowcaseBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="p-3 bg-gradient-to-r from-gold/20 to-yellow-400/20 rounded-full">
              <Calculator className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Self-Discovery Tools
            </h2>
            <div className="p-3 bg-gradient-to-r from-yellow-400/20 to-gold/20 rounded-full">
              <Zap className="w-6 h-6 text-gold" />
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock personalized insights through our collection of traditional calculators. 
            Each tool combines ancient wisdom with modern convenience.
          </motion.p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {toolCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * categoryIndex }}
                className="group relative"
              >
                {/* Category Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                  {/* Category Header */}
                  <div className={`relative p-6 bg-gradient-to-r ${category.color} text-white overflow-hidden`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-4 translate-y-4" />
                    
                    <div className="relative z-10 flex items-center gap-3 mb-2">
                      <CategoryIcon className="w-6 h-6" />
                      <h3 className="text-xl font-bold">{category.category}</h3>
                    </div>
                    <p className="text-white/90 text-sm">
                      {category.tools.length} calculator{category.tools.length > 1 ? 's' : ''} available
                    </p>
                  </div>

                  {/* Tools List */}
                  <div className="p-6 space-y-4">
                    {category.tools.map((tool, toolIndex) => {
                      const ToolIcon = tool.icon;
                      
                      return (
                        <motion.div
                          key={tool.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * toolIndex }}
                        >
                          <Link
                            to={tool.path}
                            className="group/tool block p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 bg-gradient-to-r ${category.color} rounded-lg shadow-sm group-hover/tool:shadow-md transition-shadow`}>
                                  <ToolIcon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 group-hover/tool:text-gray-700 transition-colors">
                                    {tool.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    {tool.description}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover/tool:text-gray-600 group-hover/tool:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Category Footer */}
                  <div className="px-6 pb-6">
                    <Link
                      to={category.category === "Feng Shui" ? "/feng-shui" : 
                          category.category === "Numerology" ? "/numerology" : "/astrology"}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.color} ${category.hoverColor} 
                        text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md 
                        transition-all duration-300 transform hover:scale-105
                      `}
                    >
                      <span>Explore {category.category}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-gray-600 font-medium">
                Free Access
              </span>
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <p className="text-gray-700 text-lg font-medium mb-6">
              Start your journey of self-discovery with our traditional wisdom tools
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Based on Authentic Methods</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Completely Free</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ToolsShowcaseBanner;