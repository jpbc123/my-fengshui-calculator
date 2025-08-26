// src/components/PeriodTabs.tsx
import { motion } from 'framer-motion';

interface PeriodTabItem {
    id: 'today' | 'yesterday' | 'weekly' | 'yearly';
    label: string;
}

interface PeriodTabsProps {
    tabs: PeriodTabItem[];
    activeTab: 'today' | 'yesterday' | 'weekly' | 'yearly';
    onTabClick: (tabId: 'today' | 'yesterday' | 'weekly' | 'yearly') => void;
}

const PeriodTabs = ({ tabs, activeTab, onTabClick }: PeriodTabsProps) => {
    return (
        <div className="relative flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none border ${
                            isActive
                                ? 'border-transparent text-white'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black'
                        }`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="period-bubble"
                                className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default PeriodTabs;