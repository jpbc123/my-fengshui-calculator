// src/components/PageTitleManager.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitleManagerProps {
  children: React.ReactNode;
}

// Define page titles for different routes
const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/feng-shui': 'Feng Shui',
  '/numerology': 'Numerology',
  '/astrology': 'Astrology',
  '/horoscope': 'Horoscope',
  '/meditation': 'Meditation',
  '/meditate-affirmation': 'Daily Affirmations',
  '/meditate-visualization': 'Visualization Exercise',
  '/meditate-yoga-pose': 'Yoga Poses',
  '/meditate-morning': 'Morning Mindfulness',
  '/meditate-evening': 'Evening Relaxation',
  '/games-fun': 'Games & Fun',
  '/lucky-numbers': 'Lucky Numbers',
  '/name-compatibility': 'Name Compatibility',
  '/chinese-compatibility': 'Chinese Zodiac Compatibility',
  '/western-compatibility': 'Western Zodiac Compatibility',
  '/fortune-cookie': 'Fortune Cookie',
  '/daily-wisdom-article': 'Daily Wisdom',
  '/aura-analysis': 'Aura Analysis',
  '/personal-element': 'Personal Element',
  '/kua-number-calculator': 'Kua Number Calculator',
  '/visiber-calculator': 'Visiber Calculator',
  '/chinese-zodiac-calculator': 'Chinese Zodiac Calculator',
  '/western-zodiac-calculator': 'Western Zodiac Calculator',
  '/chinese-zodiac-landing': 'Chinese Zodiac',
  '/western-horoscope': 'Western Daily Horoscope',
  '/article': 'Articles',
  '/store': 'Store',
  '/about-us': 'About Us',
  '/contact-us': 'Contact Us',
  '/privacy-policy': 'Privacy Policy',
  '/community-chat': 'Community Chat',
  '/coming-store': 'Store Coming Soon'
};

const PageTitleManager: React.FC<PageTitleManagerProps> = ({ children }) => {
  const location = useLocation();
  const defaultTitle = 'Feng Shui & Beyond';

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Handle dynamic routes
    let pageTitle = '';
    
    // Check for exact matches first
    if (PAGE_TITLES[currentPath]) {
      pageTitle = PAGE_TITLES[currentPath];
    }
    // Handle dynamic routes like /articles/:slug
    else if (currentPath.startsWith('/articles/')) {
      // Don't set a title here - let the ArticlePage component handle it
      return;
    }
    // Handle zodiac routes like /zodiac/:zodiac
    else if (currentPath.startsWith('/zodiac/')) {
      const zodiac = currentPath.split('/')[2];
      pageTitle = `${zodiac.charAt(0).toUpperCase() + zodiac.slice(1)} Horoscope`;
    }
    // Handle any other dynamic routes
    else {
      // Try to find a partial match or use default
      const pathSegments = currentPath.split('/').filter(Boolean);
      const firstSegment = pathSegments[0];
      
      // Look for routes that start with the first segment
      const matchingRoute = Object.keys(PAGE_TITLES).find(route => 
        route.startsWith(`/${firstSegment}`)
      );
      
      if (matchingRoute) {
        pageTitle = PAGE_TITLES[matchingRoute];
      }
    }
    
    // Set the document title
    const fullTitle = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
    document.title = fullTitle;
    
  }, [location.pathname]);

  return <>{children}</>;
};

export default PageTitleManager;