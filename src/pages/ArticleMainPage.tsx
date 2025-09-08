import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import dayjs from "dayjs";
import { createClient } from '@sanity/client';
import imageUrlBuilder from "@sanity/image-url";
import { toPlainText } from "@portabletext/react";
import { motion } from "framer-motion";

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

const ARTICLES_PER_PAGE = 6;

const categories = [
  "All",
  "Feng Shui",
  "Astrology",
  "Numerology",
  "Celebrity",
  "Planetary Overview",
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<CombinedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

        // Query for daily planetary overviews
        const planetaryQuery = `
          *[_type == "dailyPlanetaryOverview"] | order(date desc) {
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
          sanityClient.fetch(planetaryQuery)
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
    ? articles
    : articles.filter((article) => {
        if (article._type === 'dailyPlanetaryOverview') {
          // Daily planetary overviews always belong to "Planetary Overview" category
          const belongs = selectedCategory === "Planetary Overview";
          console.log(`Planetary article ${article._id} belongs to category:`, belongs);
          return belongs;
        } else {
          // Regular articles use tags
          const regularArticle = article as SanityArticle;
          const belongs = regularArticle.tags?.some(
            (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
          );
          console.log(`Regular article ${article._id} with tags [${regularArticle.tags?.join(', ')}] belongs to category ${selectedCategory}:`, belongs);
          return belongs;
        }
      });

  console.log(`Filtered articles for category "${selectedCategory}":`, filteredArticles.length);

  // Pagination logic
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-full font-medium transition-colors ${
            currentPage === i
              ? "bg-gold text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
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
      // You might want to create a special route for planetary overviews
      // or handle them differently. For now, using the generated slug:
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center text-gray-500">Loading articles...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50">
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
      <div className="flex flex-col min-h-screen font-sans bg-gray-50">
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
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-3xl sm:text-4xl font-bold text-black mt-8">
            Articles
          </h1>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); // reset to page 1 when switching category
                }}
                className={`px-4 py-2 rounded-full border transition ${
                  selectedCategory === category
                    ? "bg-gold text-white font-bold"
                    : "border-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => (
              <motion.div
                key={article._id}
                initial="hidden"
                animate="visible"
                variants={articleCardVariants}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] border border-gray-200"
              >
                <Link to={getArticleLink(article)}>
                  {article._type === 'article' && (article as SanityArticle).mainImage?.asset?._ref ? (
                    <img
                      src={
                        urlFor((article as SanityArticle).mainImage).width(500).url() || undefined
                      }
                      alt={(article as SanityArticle).mainImage?.alt || article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/500x300/E5E7EB/4B5563?text=Image+Not+Found";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  ) : article._type === 'dailyPlanetaryOverview' ? (
                    <div className="relative w-full h-48">
                      <img
                        src={planetaryOverviewImage}
                        alt="Planetary Overview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-sm font-medium">Planetary Overview</div>
                          {(article as DailyPlanetaryOverview).planetary_index && (
                            <div className="text-xs mt-1">
                              Energy Level: {(article as DailyPlanetaryOverview).planetary_index}/5
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                </Link>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-black mb-2">
                    <Link
                      to={getArticleLink(article)}
                      className="hover:text-gold transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Published: {dayjs(article.publishDate).format("MMMM D, YYYY")}
                  </p>
                  {getArticleDescription(article) && (
                    <p className="text-black/80 text-base mb-4 line-clamp-3">
                      {getArticleDescription(article)}
                    </p>
                  )}
                  <Link
                    to={getArticleLink(article)}
                    className="inline-block text-gold font-semibold hover:underline transition-colors"
                  >
                    Read More &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}