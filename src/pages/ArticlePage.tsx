import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import dayjs from 'dayjs';
import { client } from "../../sanityClient";
import imageUrlBuilder from '@sanity/image-url';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { toPlainText } from '@portabletext/react';
import { Calendar, Tag, Star, ArrowLeft, Share2 } from "lucide-react";

// Define the interface for your article data from Sanity
interface SanityArticle {
  _type: string;
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

// Sanity image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// Component for rendering Sanity Portable Text
const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value.asset?._ref) return null;
      return (
        <div className="my-10 w-full mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <figure className="flex flex-col">
            <img
              src={urlFor(value).width(800).url() || undefined}
              alt={value.alt || 'Article Image'}
              className="w-full h-auto object-cover"
              onError={(e) => { 
                e.currentTarget.src = 'https://placehold.co/800x400/E5E7EB/4B5563?text=Image+Not+Found'; 
                e.currentTarget.onerror = null; 
              }}
            />
            {value.caption && (
              <figcaption className="p-4 text-center text-sm text-gray-600 bg-gray-50 italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6 mt-12 text-black leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-12 mb-6 text-black leading-tight border-l-4 border-gold pl-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-10 mb-4 text-black leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-8 mb-3 text-black leading-tight">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-gray-800 mb-6 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gold bg-gold/5 pl-6 py-4 my-8 italic text-lg text-gray-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-gray-800">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg text-gray-800">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const { href } = value;
      return (
        <a 
          href={href} 
          className="text-gold hover:text-gold/80 underline underline-offset-2 font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-black">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700">{children}</em>
    ),
  },
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<CombinedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        // Check if this is a planetary overview slug
        if (slug?.startsWith('planetary-')) {
          // Extract date from slug (format: planetary-2025-09-06)
          const dateString = slug.replace('planetary-', '');
          
          const planetaryQuery = `*[_type == "dailyPlanetaryOverview" && date == $date][0]{
            _id,
            _type,
            date,
            planetary_index,
            summary,
            article,
            createdAt
          }`;
          
          const planetaryArticle = await client.fetch(planetaryQuery, { date: dateString });
          
          if (planetaryArticle) {
            // Transform to match article structure
            const transformedArticle: CombinedArticle = {
              ...planetaryArticle,
              slug: { current: slug },
              title: `Planetary Overview - ${dayjs(planetaryArticle.date).format('MMMM D, YYYY')}`,
              publishDate: planetaryArticle.date,
              body: [{ 
                _type: 'block',
                children: [{ _type: 'span', text: planetaryArticle.article }]
              }],
              metaDescription: planetaryArticle.summary,
              tags: ['Planetary Overview']
            };
            
            setArticle(transformedArticle);
            setError(null);
          } else {
            setError("Planetary overview not found.");
          }
        } else {
          // Regular article query
          const query = `*[_type == "article" && slug.current == $slug][0]{
            _type,
            title,
            subtitle,
            publishDate,
            tags,
            body,
            mainImage,
            metaDescription,
            slug
          }`;
          
          const fetchedArticle = await client.fetch(query, { slug });
          
          if (fetchedArticle) {
            setArticle(fetchedArticle);
            setError(null);
          } else {
            setError("Article not found.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch article from Sanity:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const breadcrumbs = useMemo(() => [
    { label: "Home", path: "/" },
    { label: "Articles", path: "/article" },
    { label: article?.title || "Loading..." },
  ], [article]);

  const formattedDate = useMemo(() => {
    return article?.publishDate ? dayjs(article.publishDate).format('MMMM D, YYYY') : '';
  }, [article]);

  // Generate fallback meta description
  const metaDescription = useMemo(() => {
    if (article?.metaDescription) {
      return article.metaDescription;
    }
    if (article?._type === 'dailyPlanetaryOverview') {
      const planetaryArticle = article as DailyPlanetaryOverview & { metaDescription?: string };
      return planetaryArticle.summary || 'Daily planetary overview with cosmic insights and energy readings.';
    }
    if (article?.body) {
      const plainText = toPlainText(article.body);
      return plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');
    }
    return 'Read this article on feng shui, astrology, and numerology insights.';
  }, [article]);

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: article?.title || '',
      text: metaDescription,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render article body based on type
  const renderArticleBody = () => {
    if (!article) return null;

    if (article._type === 'dailyPlanetaryOverview') {
      const planetaryArticle = article as DailyPlanetaryOverview & { 
        body: any[];
        planetary_index?: number;
      };
      
      return (
        <div className="mb-10">
          {/* Planetary Index Display */}
          {planetaryArticle.planetary_index && (
            <div className="mb-10 p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="text-gold mr-2" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">Planetary Energy Level</h3>
                </div>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full transition-all duration-300 ${
                        i < planetaryArticle.planetary_index!
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {planetaryArticle.planetary_index}/5 Energy Rating
                </p>
              </div>
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
              {(article as DailyPlanetaryOverview).article}
            </div>
          </div>
        </div>
      );
    } else {
      // Regular article with PortableText
      return (
        <div className="prose prose-lg max-w-none">
          <PortableText value={article.body} components={components} />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <div className="text-gray-500">Loading article...</div>
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
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Article Not Found</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/article" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center text-gray-500">Article not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} | Your Site Name</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        {article._type === 'article' && (article as SanityArticle).mainImage && (
          <meta property="og:image" content={urlFor((article as SanityArticle).mainImage).width(1200).height(630).url()} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={metaDescription} />
        {article._type === 'article' && (article as SanityArticle).mainImage && (
          <meta name="twitter:image" content={urlFor((article as SanityArticle).mainImage).width(1200).height(630).url()} />
        )}
        {article.tags && <meta name="keywords" content={article.tags.join(', ')} />}
        <meta name="author" content="Your Site Name" />
        <meta name="publish-date" content={article.publishDate} />
        <link rel="canonical" href={`${window.location.origin}/articles/${slug}`} />
      </Helmet>
      
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <Breadcrumb items={breadcrumbs} />
          
          {/* Back to Articles Button */}
          <div className="mt-8 mb-6">
            <Link 
              to="/article" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </Link>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Hero Image for Regular Articles */}
            {article._type === 'article' && (article as SanityArticle).mainImage && (
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <img
                  src={urlFor((article as SanityArticle).mainImage).width(1200).url()}
                  alt={(article as SanityArticle).mainImage?.alt || article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Article Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gold" />
                  <span>{formattedDate}</span>
                </div>
                
                {article._type === 'dailyPlanetaryOverview' && (
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-purple-600" />
                    <span className="text-purple-600 font-medium">Planetary Overview</span>
                  </div>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ml-auto"
                >
                  <Share2 size={16} />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Article Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Subtitle for Regular Articles */}
              {article._type === 'article' && (article as SanityArticle).subtitle && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {(article as SanityArticle).subtitle}
                </p>
              )}

              {/* Article Content */}
              <div className="article-content">
                {renderArticleBody()}
              </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag size={18} className="text-gold" />
                    <h3 className="text-lg font-semibold text-black">Topics</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {article.tags
                      .filter(tag => !['kua', 'element', 'numerology', 'western zodiac'].includes(tag.toLowerCase()))
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gold/10 text-gold text-sm font-medium rounded-full border border-gold/20 hover:bg-gold/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Found this article helpful? Explore more insights and tools.
                </p>
                <Link
                  to="/article"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
                >
                  Read More Articles
                </Link>
              </div>
            </div>
          </motion.article>
        </div>
      </main>
    </div>
  );
}