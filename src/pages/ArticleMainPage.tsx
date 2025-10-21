// src/pages/ArticleMainPage.tsx
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import dayjs from "dayjs";
import { createClient } from '@sanity/client';
import imageUrlBuilder from "@sanity/image-url";
import { toPlainText } from "@portabletext/react";
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight, Search } from "lucide-react";

import planetaryOverviewImage from '../assets/planetary-overview.jpg';

// Create Sanity client inline
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  perspective: 'published',
});

// Helper function to check if client is configured
const isClientConfigured = () => {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET;
  return !!(projectId && dataset);
};

// Sanity image URL builder
const builder = imageUrlBuilder(sanityClient);
function urlFor(source: any) {
  return builder.image(source);
}

// Define the interface for your article data from Sanity
interface SanityArticle {
  _id: string;
  _type: string; // Added to distinguish between schemas
  slug: { current: string };
  title: string;
  subtitle?: string;
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  publishDate: string;
  tags?: string[];
  body: any[];
  metaDescription?: string;
}

// Define interface for daily planetary overview
interface DailyPlanetaryOverview {
  _id: string;
  _type: string;
  date: string;
  planetary_index?: number;
  summary?: string;
  article: string;
  createdAt: string;
}

// Union type for combined data
type CombinedArticle = SanityArticle | (DailyPlanetaryOverview & {
  slug: { current: string };
  title: string;
  publishDate: string;
  body: any[];
  metaDescription?: string;
});

const ARTICLES_PER_PAGE = 9;

const categories = [
  { name: "All", icon: null, color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
  { name: "Feng Shui", icon: null, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { name: "Astrology", icon: null, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  { name: "Numerology", icon: null, color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { name: "Celebrity", icon: null, color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
  { name: "Planetary Overview", icon: null, color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<CombinedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    if (category !== "All") {
      newSearchParams.set('category', category);
    }
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    async function fetchArticles() {
      // Check if Sanity client is properly configured
      if (!isClientConfigured()) {
        console.warn('Sanity client not configured properly');
        setError("Sanity client not configured properly");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching articles from Sanity...');
        
        // Query for regular articles
        const articleQuery = `
          *[_type == "article"] | order(publishDate desc) {
            _id,
            _type,
            title,
            slug,
            publishDate,
            mainImage,
            body,
            tags,
            metaDescription,
          }
        `;

        // Query for daily planetary overviews (only today and earlier)
        const today = dayjs().format('YYYY-MM-DD');
        const planetaryQuery = `
          *[_type == "dailyPlanetaryOverview" && date <= $today] | order(date desc) {
            _id,
            _type,
            date,
            planetary_index,
            summary,
            article,
            createdAt
          }
        `;

        const [fetchedArticles, fetchedPlanetary] = await Promise.all([
          sanityClient.fetch(articleQuery),
          sanityClient.fetch(planetaryQuery, { today })
        ]);

        console.log('Fetched articles:', fetchedArticles.length);
        console.log('Fetched planetary overviews:', fetchedPlanetary.length);

        // Transform planetary overviews to match article structure
        const transformedPlanetary: CombinedArticle[] = fetchedPlanetary.map((item: DailyPlanetaryOverview) => ({
          ...item,
          slug: { current: `planetary-${dayjs(item.date).format('YYYY-MM-DD')}` },
          title: `Planetary Overview - ${dayjs(item.date).format('MMMM D, YYYY')}`,
          publishDate: item.date,
          body: [{ 
            _type: 'block',
            children: [{ _type: 'span', text: item.article }]
          }],
          metaDescription: item.summary,
          tags: ['Planetary Overview'] // Ensure it gets the right tag
        }));

        // Combine and sort by publish date
        const combinedArticles = [...fetchedArticles, ...transformedPlanetary]
          .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

        console.log('Combined articles:', combinedArticles.length);
        setArticles(combinedArticles);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch articles from Sanity:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Articles" },
  ];

  // Filtering by category
  const filteredArticles = selectedCategory === "All"
    ? articles.filter(article => article._type !== 'dailyPlanetaryOverview') // Exclude planetary overviews from "All"
    : selectedCategory === "Planetary Overview"
    ? articles.filter(article => article._type === 'dailyPlanetaryOverview') // Only show planetary overviews
    : articles.filter((article) => {
        // For other categories, only check regular articles
        if (article._type === 'dailyPlanetaryOverview') {
          return false; // Planetary overviews don't belong to other categories
        }
        const regularArticle = article as SanityArticle;
        const belongs = regularArticle.tags?.some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
        );
        console.log(`Regular article ${article._id} with tags [${regularArticle.tags?.join(', ')}] belongs to category ${selectedCategory}:`, belongs);
        return belongs;
      });

  console.log(`Filtered articles for category "${selectedCategory}":`, filteredArticles.length);

  // Pagination logic
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 mx-1 rounded-lg font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
      );
    }

    // Page numbers (show max 5 pages)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-lg font-medium transition-colors ${
            currentPage === i
              ? "bg-gold text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 mx-1 rounded-lg font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  const articleCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getArticleLink = (article: CombinedArticle) => {
    if (article._type === 'dailyPlanetaryOverview') {
      return `/articles/${article.slug.current}`;
    }
    return `/articles/${article.slug.current}`;
  };

  const getArticleDescription = (article: CombinedArticle) => {
    if (article._type === 'dailyPlanetaryOverview') {
      const planetaryArticle = article as DailyPlanetaryOverview & { metaDescription?: string };
      return planetaryArticle.summary || planetaryArticle.metaDescription;
    }
    const regularArticle = article as SanityArticle;
    return regularArticle.metaDescription || (regularArticle.body && regularArticle.body.length > 0 ? toPlainText(regularArticle.body) : '');
  };

  const getCategoryData = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || categories[0];
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <div className="text-gray-500">Loading articles...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center text-red-500">Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8 md:py-16">
            <Breadcrumb items={breadcrumbs} />
            <h1 className="text-3xl sm:text-4xl font-bold text-black mt-8">
              Articles
            </h1>
            <p className="text-center text-gray-500 mt-8">No articles found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
<Helmet>
  <title>Articles - Astrology, Feng Shui, Numerology & Spiritual Wisdom | Feng Shui and Beyond</title>
  <meta name="description" content="Explore our comprehensive collection of articles on astrology, feng shui, numerology, planetary overviews, and celebrity insights. Deep dive into ancient wisdom and modern spiritual practices." />
  <meta name="keywords" content="astrology articles, feng shui guide, numerology readings, spiritual articles, planetary overview, celebrity astrology, horoscope insights, metaphysical wisdom" />
  
  {/* Open Graph */}
  <meta property="og:title" content="Articles - Astrology, Feng Shui & Spiritual Wisdom" />
  <meta property="og:description" content="Comprehensive articles covering astrology, feng shui, numerology, and planetary insights. Explore ancient wisdom and modern spiritual practices." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://fengshuiandbeyond.com/article" />
  <meta property="og:image" content="https://fengshuiandbeyond.com/images/articles-og.jpg" />
  
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Spiritual Articles & Wisdom" />
  <meta name="twitter:description" content="Explore astrology, feng shui, numerology and more through our expert articles." />
  <meta name="twitter:image" content="https://fengshuiandbeyond.com/images/articles-twitter.jpg" />
  
  {/* Dynamic title based on selected category */}
  {selectedCategory !== "All" && (
    <>
      <meta property="og:title" content={`${selectedCategory} Articles | Feng Shui and Beyond`} />
      <title>{selectedCategory} Articles - Expert Insights & Guidance | Feng Shui and Beyond</title>
    </>
  )}
  
  {/* Structured Data - Blog/Collection */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`,
      "description": "Collection of articles about astrology, feng shui, numerology, and spiritual wisdom",
      "url": `https://fengshuiandbeyond.com/article${selectedCategory !== "All" ? `?category=${selectedCategory}` : ''}`,
      "publisher": {
        "@type": "Organization",
        "name": "Feng Shui and Beyond",
        "logo": {
          "@type": "ImageObject",
          "url": "https://fengshuiandbeyond.com/logo.png"
        }
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": filteredArticles.length,
        "itemListElement": paginatedArticles.slice(0, 10).map((article, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://fengshuiandbeyond.com${getArticleLink(article)}`
        }))
      }
    })}
  </script>
  
  {/* Structured Data - BreadcrumbList */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://fengshuiandbeyond.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Articles",
          "item": "https://fengshuiandbeyond.com/article"
        }
      ]
    })}
  </script>
  
  <link rel="canonical" href={`https://fengshuiandbeyond.com/article${selectedCategory !== "All" ? `?category=${selectedCategory}` : ''}`} />
</Helmet>
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Breadcrumb items={breadcrumbs} />
          
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mt-8 mb-4">
              Articles
            </h1>
            <p className="text-gray-600 text-lg">
              Explore our collection of articles on astrology, numerology, feng shui, and more. 
              Discover insights that can guide your personal journey.
            </p>
          </div>

          {/* Modern Category Filter */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Tag size={20} className="text-gold" />
              <h2 className="text-xl font-semibold text-black">Categories</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-gold text-white shadow-lg transform scale-105"
                        : `${category.color} border border-transparent hover:shadow-md`
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {paginatedArticles.length} of {filteredArticles.length} articles
                {selectedCategory !== "All" && (
                  <span className="ml-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
                    {selectedCategory}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article, index) => (
              <motion.div
                key={article._id}
                initial="hidden"
                animate="visible"
                variants={articleCardVariants}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              >
                <Link to={getArticleLink(article)} className="block">
                  {article._type === 'article' && (article as SanityArticle).mainImage?.asset?._ref ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          urlFor((article as SanityArticle).mainImage).width(500).url() || undefined
                        }
                        alt={(article as SanityArticle).mainImage?.alt || article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/500x300/E5E7EB/4B5563?text=Image+Not+Found";
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </div>
                  ) : article._type === 'dailyPlanetaryOverview' ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={planetaryOverviewImage}
                        alt="Planetary Overview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                        <div className="text-center text-white">
                          <div className="text-sm font-medium">Planetary Overview</div>
                          {(article as DailyPlanetaryOverview).planetary_index && (
                            <div className="text-xs mt-1 opacity-90">
                              Energy Level: {(article as DailyPlanetaryOverview).planetary_index}/5
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No Image</span>
                    </div>
                  )}
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {dayjs(article.publishDate).format("MMMM D, YYYY")}
                    </p>
                  </div>
                  
                  <h2 className="text-xl font-bold text-black mb-3 group-hover:text-gold transition-colors">
                    <Link to={getArticleLink(article)}>
                      {article.title}
                    </Link>
                  </h2>
                  
                  {getArticleDescription(article) && (
                    <p className="text-gray-600 text-base mb-4 line-clamp-3 leading-relaxed">
                      {getArticleDescription(article)}
                    </p>
                  )}
                  
                  <Link
                    to={getArticleLink(article)}
                    className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-200"
                  >
                    Read More 
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-2">
                {renderPaginationButtons()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
	</>
  );
}