import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import dayjs from 'dayjs';
import { client } from "../../sanityClient";
import imageUrlBuilder from '@sanity/image-url';
import { toPlainText } from '@portabletext/react';
import { motion } from 'framer-motion';

// Sanity image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

// Define the interface for your article data from Sanity
interface SanityArticle {
  _id: string;
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
}

const ARTICLES_PER_PAGE = 10;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const query = `
          *[_type == "article"] | order(publishDate desc) {
            _id,
            title,
            slug,
            publishDate,
            mainImage,
            body,
            tags,
			metaDescription,
          }
        `;
        const fetchedArticles = await client.fetch(query);
        setArticles(fetchedArticles);
        setTotalArticles(fetchedArticles.length);
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

  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-full font-medium transition-colors ${
            currentPage === i
              ? 'bg-gold text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            <h1 className="text-3xl sm:text-4xl font-bold text-black mt-8">Articles</h1>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-black mt-8">Articles</h1>
          
          <div className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => (
              <motion.div
                key={article._id}
                initial="hidden"
                animate="visible"
                variants={articleCardVariants}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] border border-gray-200"
              >
                <Link to={`/articles/${article.slug.current}`}>
                  {article.mainImage?.asset?._ref ? (
                    <img
                      src={urlFor(article.mainImage).width(500).url() || undefined}
                      alt={article.mainImage?.alt || article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/500x300/E5E7EB/4B5563?text=Image+Not+Found'; e.currentTarget.onerror = null; }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                </Link>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-black mb-2">
                    <Link to={`/article/${article.slug.current}`} className="hover:text-gold transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Published: {dayjs(article.publishDate).format('MMMM D, YYYY')}
                  </p>
                  {article.body && article.body.length > 0 && (
                    <p className="text-black/80 text-base mb-4 line-clamp-3">
                      {toPlainText(article.body)}
                    </p>
                  )}
                  <Link
                    to={`/article/${article.slug.current}`}
                    className="inline-block text-gold font-semibold hover:underline transition-colors"
                  >
                    Read More &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

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
