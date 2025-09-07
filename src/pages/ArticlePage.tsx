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
        <div className="my-8 w-fit mx-auto rounded-xl overflow-hidden shadow-lg">
          <figure className="flex flex-col items-center">
            <img
              src={urlFor(value).width(300).url() || undefined}
              alt={value.alt || 'Kua Number Calculator Article Image'}
              className="h-auto object-cover"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x600/E5E7EB/4B5563?text=Image+Not+Found'; e.currentTarget.onerror = null; }}
            />
            {value.caption && <figcaption className="p-4 text-center text-sm text-gray-500">{value.caption}</figcaption>}
          </figure>
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="text-lg text-black/90 mb-6 leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const { href } = value;
      return (
        <a href={href} className="text-blue-600 hover:underline">
          {children}
        </a>
      );
    },
  },
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<CombinedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Render article body based on type
  const renderArticleBody = () => {
    if (!article) return null;

    if (article._type === 'dailyPlanetaryOverview') {
      const planetaryArticle = article as DailyPlanetaryOverview & { 
        body: any[];
        planetary_index?: number;
      };
      
      return (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          {/* Planetary Index Display */}
          {planetaryArticle.planetary_index && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
              </div>
              <h3 className="text-lg font-semibold mb-2">Planetary Energy Level</h3>
              <div className="flex justify-center items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < planetaryArticle.planetary_index!
                        ? 'bg-yellow-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {planetaryArticle.planetary_index}/5 Energy Rating
              </p>
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-black/90 leading-relaxed">
            <div className="whitespace-pre-wrap">
              {(article as DailyPlanetaryOverview).article}
            </div>
          </div>
        </div>
      );
    } else {
      // Regular article with PortableText
      return (
        <div className="prose prose-lg max-w-none text-black/90 leading-relaxed">
          <PortableText value={article.body} components={components} />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center text-gray-500">Loading article...</div>
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

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center text-gray-500">Article not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
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
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Breadcrumb items={breadcrumbs} />
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white p-6 md:p-12 rounded-2xl shadow-lg border border-gray-200"
          >
            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Article Meta */}
            <p className="text-sm text-black/60 mb-8">
              Published on {formattedDate}
            </p>

            {/* Article Content */}
            {renderArticleBody()}

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 border-t border-gray-300 pt-6">
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.tags
                    .filter(tag => !['kua', 'element', 'numerology', 'western zodiac'].includes(tag.toLowerCase()))
                    .map((tag, index) => (
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
    </div>
  );
}