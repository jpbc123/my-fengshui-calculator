import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { ARTICLES } from '@/data/articles-manifest';

// Prerender every Sanity-sourced article (the 2 static ones have their own
// dedicated routes/components below). Sourced from the build-time manifest so
// this never goes stale.
const sanityArticlePaths = ARTICLES
  .filter((a) => a.source === 'sanity')
  .map((a) => `articles/${a.slug.current}`);

const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ChineseHoroscopeResult = lazy(() => import('./pages/ChineseHoroscopeResult'));
const FengShui = lazy(() => import('./pages/FengShui'));
const PersonalElement = lazy(() => import('./pages/PersonalElement'));
const KuaNumberCalculator = lazy(() => import('./pages/KuaNumberCalculator'));
const Numerology = lazy(() => import('./pages/Numerology'));
const VisiberCalculator = lazy(() => import('./pages/VisiberCalculator'));
const Astrology = lazy(() => import('./pages/Astrology'));
const ChineseZodiacCalculator = lazy(() => import('./pages/ChineseZodiacCalculator'));
const WesternZodiacCalculator = lazy(() => import('./pages/WesternZodiacCalculator'));
const Horoscope = lazy(() => import('./pages/Horoscope'));
const ChineseZodiacLanding = lazy(() => import('./pages/ChineseZodiacLanding'));
const WesternDailyHoroscope = lazy(() => import('./pages/WesternDailyHoroscope'));
const AuraAnalysisPage = lazy(() => import('./pages/AuraAnalysisPage'));
const DailyWisdomArticlePage = lazy(() => import('./pages/DailyWisdomArticlePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ArticleMainPage = lazy(() => import('./pages/ArticleMainPage'));
const MercuryRetrogradePage = lazy(() => import('./pages/MercuryRetrogradePage'));
const FullMoonForecastPage = lazy(() => import('./pages/FullMoonForecastPage'));
const GamesFunLanding = lazy(() => import('./pages/GamesFunLanding'));
const GameLuckyNumber = lazy(() => import('./pages/GameLuckyNumber'));
const GameNameCompatibility = lazy(() => import('./pages/GameNameCompatibility'));
const GameChineseCompatibility = lazy(() => import('./pages/GameChineseCompatibility'));
const GameWesternCompatibility = lazy(() => import('./pages/GameWesternCompatibility'));
const GameFortuneCookie = lazy(() => import('./pages/GameFortuneCookie'));
const MeditationLanding = lazy(() => import('./pages/MeditationLanding'));
const MeditateVisualizationExercise = lazy(() => import('./pages/MeditateVisualizationExercise'));
const MeditateYogaPose = lazy(() => import('./pages/MeditateYogaPose'));
const MeditateAffirmation = lazy(() => import('./pages/MeditateAffirmation'));
const MeditateMorningMindfulness = lazy(() => import('./pages/MeditateMorningMindfulness'));
const MeditateEveningRelaxation = lazy(() => import('./pages/MeditateEveningRelaxation'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const Credits = lazy(() => import('./pages/Credits'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));
const ComingSoonStore = lazy(() => import('./pages/ComingSoonStore'));
const Store = lazy(() => import('./pages/Store'));
const BirthChart = lazy(() => import('./pages/BirthChart'));
const FengShuiWeddingDates = lazy(() => import('./pages/FengShuiWeddingDates'));

const Number33Article = lazy(() => import('./pages/Number33Article'));
const CelebrityBirthdaysArticle = lazy(() => import('./pages/CelebrityBirthdaysArticle'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Index /> },

      // Main Menus
      { path: 'feng-shui', element: <FengShui /> },
      { path: 'numerology', element: <Numerology /> },
      { path: 'astrology', element: <Astrology /> },
      { path: 'horoscope', element: <Horoscope /> },
      { path: 'store', element: <Store /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'contact-us', element: <ContactUs /> },
      { path: 'terms-of-service', element: <TermsOfService /> },
      { path: 'credits', element: <Credits /> },
      { path: 'sitemap', element: <Sitemap /> },

      // Submenu - Feng Shui
      { path: 'feng-shui/personal-element', element: <PersonalElement /> },
      { path: 'feng-shui/kua-number', element: <KuaNumberCalculator /> },
      // Submenu - Numerology
      { path: 'numerology/visiber-calculator', element: <VisiberCalculator /> },

      // Submenu - Astrology
      { path: 'astrology/chinese-zodiac-calculator', element: <ChineseZodiacCalculator /> },
      { path: 'astrology/western-zodiac-calculator', element: <WesternZodiacCalculator /> },

      // Horoscopes
      { path: 'horoscope/chinese-zodiac', element: <ChineseZodiacLanding /> },
      {
        path: 'zodiac/:zodiac',
        element: <ChineseHoroscopeResult />,
        getStaticPaths: () => [
          'zodiac/rat', 'zodiac/ox', 'zodiac/tiger', 'zodiac/rabbit',
          'zodiac/dragon', 'zodiac/snake', 'zodiac/horse', 'zodiac/goat',
          'zodiac/monkey', 'zodiac/rooster', 'zodiac/dog', 'zodiac/pig',
        ],
      },
      { path: 'horoscope/western-zodiac', element: <WesternDailyHoroscope /> },

      // Tools
      { path: 'daily-wisdom-article', element: <DailyWisdomArticlePage /> },

      // Games
      { path: 'games-fun', element: <GamesFunLanding /> },
      { path: 'games-fun/aura-analysis', element: <AuraAnalysisPage /> },
      { path: 'games-fun/lucky-numbers-generator', element: <GameLuckyNumber /> },
      { path: 'games-fun/name-compatibility', element: <GameNameCompatibility /> },
      { path: 'games-fun/chinese-zodiac-compatibility', element: <GameChineseCompatibility /> },
      { path: 'games-fun/western-zodiac-compatibility', element: <GameWesternCompatibility /> },
      { path: 'games-fun/fortune-cookie', element: <GameFortuneCookie /> },

      // Meditation
      { path: 'meditation', element: <MeditationLanding /> },
      { path: 'meditation/visualization-exercises', element: <MeditateVisualizationExercise /> },
      { path: 'meditation/yoga', element: <MeditateYogaPose /> },
      { path: 'meditation/daily-affirmation', element: <MeditateAffirmation /> },
      { path: 'meditation/morning-mindfulness', element: <MeditateMorningMindfulness /> },
      { path: 'meditation/evening-relaxation', element: <MeditateEveningRelaxation /> },

      // Services
      { path: 'birth-chart', element: <BirthChart /> },
      { path: 'auspicious-wedding-date-planner', element: <FengShuiWeddingDates /> },

      // Articles
      { path: 'article', element: <ArticleMainPage /> },
      { path: 'articles/the-number-33', element: <Number33Article /> },
      { path: 'articles/famous-celebrity-birthdays', element: <CelebrityBirthdaysArticle /> },
      {
        path: 'articles/:slug',
        element: <ArticlePage />,
        getStaticPaths: () => sanityArticlePaths,
      },

      // Dedicated Astrology Pages
      { path: 'mercury-retrograde', element: <MercuryRetrogradePage /> },
      { path: 'full-moon-forecast', element: <FullMoonForecastPage /> },

      // Coming Soon
      { path: 'community-chat', element: <ComingSoonPage /> },
      { path: 'coming-store', element: <ComingSoonStore /> },

      // Catch-all
      { path: '*', element: <NotFound /> },
    ],
  },
];
