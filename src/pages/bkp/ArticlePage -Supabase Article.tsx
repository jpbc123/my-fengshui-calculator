// src/pages/ArticlePage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import remarkGfm for GitHub Flavored Markdown
import { supabase } from '../lib/supabase'; // Adjusted path
import Header from "../components/Header"; // Adjusted path
import Footer from "../components/Footer"; // Adjusted path
import { motion } from "framer-motion"; // For animations
import Breadcrumb from "../components/Breadcrumb"; // Import the Breadcrumb component

// Define a type for your article data for better type safety
interface Article {
  id: string;
  title: string;
  url_slug: string;
  content: string;
  main_image_url?: string; // Optional image URL
  publish_date: string;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>(); // Get the slug from the URL
  const [article, setArticle] = useState<Article | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleAndTags = async () => {
      if (!slug) {
        setError("Article slug not found in URL.");
        setLoading(false);
        return;
      }

      try {
        const { data: articleData, error: dbError } = await supabase
          .from('articles')
          .select('*')
          .eq('url_slug', slug)
          .single();

        if (dbError) {
          console.error('Supabase fetch error:', dbError);
          setError(dbError.message || 'Failed to load article.');
          setArticle(null);
          setLoading(false);
          return;
        }
        
        if (!articleData) {
          setArticle(null);
          setError("Article not found.");
          setLoading(false);
          return;
        }

        setArticle(articleData);
        setError(null);

        const { data: tagsData, error: tagsError } = await supabase
          .from('related_articles_bridge')
          .select('calculator_type')
          .eq('article_id', articleData.id);
          
        if (tagsError) {
          console.error("Error fetching tags:", tagsError);
        } else if (tagsData) {
          const fetchedTags = tagsData.map(item => item.calculator_type);
          setTags(fetchedTags);
        }

      } catch (err) {
        console.error('Unexpected error fetching article:', err);
        setError('An unexpected error occurred.');
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndTags();
  }, [slug]);

  // Memoize the Markdown content rendering for performance
  const memoizedMarkdownContent = useMemo(() => {
    if (!article?.content) return null;
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {article.content}
      </ReactMarkdown>
    );
  }, [article?.content]);

  // Define dynamic breadcrumbs
  const breadcrumbs = useMemo(() => {
    const items = [{ label: "Home", path: "/" }];
    if (tags.length > 0) {
        // Use the first tag as the category for the breadcrumb.
        // You could add logic here to choose the most relevant one if there are multiple.
        const categoryLabel = tags[0];
        // Note: The path is a placeholder. You would need to create a dedicated
        // category page (e.g., /feng-shui) to make this link functional.
        const categoryPath = `/${categoryLabel.toLowerCase().replace(/\s/g, '-')}`;
        items.push({ label: categoryLabel, path: categoryPath });
    }
    if (article) {
        items.push({ label: article.title }); // The current page has no path
    }
    return items;
  }, [article, tags]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 pt-24">
          <p className="text-lg text-gold">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-red-50 border border-red-200 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
            <p className="text-red-600">{error}</p>
            <Link to="/" className="mt-6 inline-block text-gold hover:underline">
              Go back to Home
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-bold text-yellow-700 mb-4">Article Not Found</h1>
            <p className="text-yellow-600">The article you are looking for does not exist.</p>
            <Link to="/" className="mt-6 inline-block text-gold hover:underline">
              Go back to Home
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(article.publish_date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-4xl mx-auto">
          {/* Breadcrumbs are added here, above the article content */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} className="text-black/80" />
          </div>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm"
          >
            {/* Main Image */}
            {article.main_image_url && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={article.main_image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover max-h-96"
                  onError={(e) => { e.currentTarget.src = `https://placehold.co/800x400/CCCCCC/FFFFFF?text=Image+Not+Found`; e.currentTarget.onerror = null; }}
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gold mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Article Meta */}
            <p className="text-sm text-black/60 mb-8">
              Published on {formattedDate} by fengshuiandbeyond.com
            </p>

            {/* Article Content (Markdown) */}
            <div className="prose prose-lg max-w-none text-black/90 leading-relaxed">
              {memoizedMarkdownContent}
            </div>

            {/* Tags Section */}
            {tags.length > 0 && (
              <div className="mt-8 border-t border-gray-300 pt-6">
                <p className="text-sm font-semibold text-black/70">Tags:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
}