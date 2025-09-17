// RecentArticlesPreview.tsx - Simplified Version
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from '@sanity/client';
import imageUrlBuilder from "@sanity/image-url";
import { toPlainText } from "@portabletext/react";
import dayjs from "dayjs";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

// Interface for articles only (no planetary overview)
interface SanityArticle {
  _id: string;
  slug: { current: string };
  title: string;
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  publishDate: string;
  body: any[];
  metaDescription?: string;
}

const RecentArticlesPreview = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentArticles() {
      if (!isClientConfigured()) {
        console.warn('Sanity client not configured properly');
        setError("Sanity client not configured properly");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching recent articles from Sanity...');
        
        // Query for recent articles only (excluding planetary overviews)
        const articleQuery = `
          *[_type == "article"] | order(publishDate desc)[0...3] {
            _id,
            title,
            slug,
            publishDate,
            mainImage,
            body,
            metaDescription
          }
        `;

        const fetchedArticles = await sanityClient.fetch(articleQuery);
        setArticles(fetchedArticles);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    }

    fetchRecentArticles();
  }, []);

  const getArticleExcerpt = (article: SanityArticle) => {
    if (article.metaDescription) {
      return article.metaDescription;
    }
    
    if (article.body && article.body.length > 0) {
      const fullText = toPlainText(article.body);
      return fullText.slice(0, 150) + (fullText.length > 150 ? '...' : '');
    }
    
    return 'Read this insightful article to discover more...';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="animate-pulse bg-gray-300 h-6 w-6 rounded"></div>
          <div className="animate-pulse bg-gray-300 h-6 w-32 rounded"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-3 w-full rounded"></div>
                <div className="bg-gray-300 h-3 w-5/6 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="text-center text-gray-500">
          {error ? `Error: ${error}` : 'No recent articles found'}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-lg">
            <div className="w-5 h-5 bg-gold rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-black">Recent Articles</h2>
        </div>

      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article, index) => (
          <motion.article
            key={article._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 group hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors duration-200"
          >
            {/* Thumbnail */}
            <Link to={`/articles/${article.slug.current}`} className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                {article.mainImage?.asset?._ref ? (
                  <img
                    src={urlFor(article.mainImage).width(120).height(120).url()}
                    alt={article.mainImage?.alt || article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/120x120/E5E7EB/4B5563?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center">No Image</span>
                  </div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Calendar size={12} />
                <span>{dayjs(article.publishDate).format("MMM D, YYYY")}</span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-black mb-2 group-hover:text-gold transition-colors line-clamp-2">
                <Link to={`/articles/${article.slug.current}`}>
                  {article.title}
                </Link>
              </h3>

              {/* Excerpt with inline Read More */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {getArticleExcerpt(article)}{" "}
                <Link
                  to={`/articles/${article.slug.current}`}
                  className="inline-flex items-center gap-1 text-gold hover:text-gold/80 font-medium transition-colors whitespace-nowrap"
                >
                  Read More
                  <ArrowRight size={12} />
                </Link>
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <Link
            to="/article"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors"
          >
            Explore All Articles
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentArticlesPreview;