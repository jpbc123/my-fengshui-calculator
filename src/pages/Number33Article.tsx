import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, BookOpen, Share2 } from "lucide-react";
import heroImage from "../assets/numerology.jpg";
import sectionImage1 from "../assets/cosmic-1.jpg";
import sectionImage2 from "../assets/cosmic-2.jpg";
import sectionImage3 from "../assets/astrology.jpg";
import sectionImage4 from "../assets/feng-shui.jpg";
import sectionImage5 from "../assets/western-compatibility.jpg";
import sectionImage6 from "../assets/planetary-overview.jpg";

const sections = [
  { id: "masonic", label: "The Masonic Connection" },
  { id: "body-divine", label: "33 in Body & Spirit" },
  { id: "parallel", label: "The 33rd Parallel" },
  { id: "modern-history", label: "Shadows of Modern History" },
  { id: "frequency-illusion", label: "The Frequency Illusion" },
  { id: "conclusion", label: "So… Which Is It?" },
];

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <FadeInSection>
      <blockquote className="my-12 px-6 py-8 border-l-4 border-amber-500 bg-amber-500/5 rounded-r-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
        <p className="relative text-xl md:text-2xl font-serif italic text-amber-200/90 leading-relaxed">
          {children}
        </p>
      </blockquote>
    </FadeInSection>
  );
}

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <FadeInSection className="my-16 -mx-4 md:-mx-8 lg:-mx-16">
      <div className="relative h-[300px] md:h-[420px] overflow-hidden rounded-lg md:rounded-xl">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
      </div>
    </FadeInSection>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center my-16">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/60" />
      <div className="mx-4 text-amber-500/40 text-lg">✦</div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/60" />
    </div>
  );
}

const Number33Article = () => {
  const [activeSection, setActiveSection] = useState("");
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  const handleShare = async () => {
    const url = "https://fengshuiandbeyond.com/articles/the-number-33";
    if (navigator.share) {
      await navigator.share({ title: "The Number 33", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <Helmet>
        <title>The Number 33: Elite Obsession, Hidden Patterns, or a Trick of Your Mind? | Feng Shui &amp; Beyond</title>
        <meta name="description" content="Why does the number 33 appear everywhere, from Freemasonry to the human spine to world-changing events? Explore the conspiracies, the coincidences, and the psychological trick that might explain it all." />
        <meta name="keywords" content="numerology, master numbers, number 33, conspiracy theories, frequency illusion, secret societies, freemasonry, spirituality, hidden knowledge" />
        <meta name="author" content="Feng Shui & Beyond" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/articles/the-number-33" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="The Number 33: Elite Obsession, Hidden Patterns, or a Trick of Your Mind?" />
        <meta property="og:description" content="Why does the number 33 appear everywhere, from Freemasonry to the human spine to world-changing events?" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/articles/the-number-33" />
        <meta property="og:image" content="https://fengshuiandbeyond.com/the-number-33.jpg" />
        <meta property="article:published_time" content="2026-05-24" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Number 33: Elite Obsession, Hidden Patterns, or a Trick of Your Mind?" />
        <meta name="twitter:description" content="Why does the number 33 appear everywhere, from Freemasonry to the human spine to world-changing events?" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The Number 33: Elite Obsession, Hidden Patterns, or a Trick of Your Mind?",
            "description": "Why does the number 33 appear everywhere, from Freemasonry to the human spine to world-changing events?",
            "image": "https://fengshuiandbeyond.com/the-number-33.jpg",
            "datePublished": "2026-05-24",
            "dateModified": "2026-05-24",
            "author": { "@type": "Person", "name": "Feng Shui & Beyond", "url": "https://fengshuiandbeyond.com/about-us" },
            "publisher": { "@type": "Organization", "name": "Feng Shui & Beyond", "logo": { "@type": "ImageObject", "url": "https://fengshuiandbeyond.com/circle-logo.png" } },
            "mainEntityOfPage": "https://fengshuiandbeyond.com/articles/the-number-33"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fengshuiandbeyond.com/" },
              { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://fengshuiandbeyond.com/article" },
              { "@type": "ListItem", "position": 3, "name": "The Number 33", "item": "https://fengshuiandbeyond.com/articles/the-number-33" }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-950 text-gray-200">
        <Header />

        {/* === HERO === */}
        <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
          <img
            src={heroImage}
            alt="Numerology illustration centered on the number 33"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-transparent to-transparent h-32" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="inline-block text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                Numerology Deep Dive
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
                The Number 33
                <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-amber-300/80 mt-3">
                  Elite Obsession, Hidden Patterns, or a Trick of Your Mind?
                </span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>May 24, 2026</span>
                <span className="text-amber-500/40">•</span>
                <span>12 min read</span>
                <span className="text-amber-500/40">•</span>
                <span>Feng Shui & Beyond</span>
              </div>
            </motion.div>
          </div>

          <motion.button
            onClick={() => scrollToSection("intro")}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-amber-400/60 hover:text-amber-400 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-label="Scroll to article"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>
        </section>

        {/* === BREADCRUMB + TOC + ARTICLE BODY === */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="pt-8 max-w-3xl mx-auto lg:mx-0 lg:ml-[calc(280px+3rem)]">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Articles", path: "/article" },
                { label: "The Number 33" },
              ]}
              className="text-gray-500 mb-8 [&_a]:text-gray-400 [&_a:hover]:text-amber-400"
            />
          </div>

          <div className="flex gap-12">
            {/* --- Floating TOC (desktop) --- */}
            <aside className="hidden lg:block w-[260px] flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/60 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Contents
                </h3>
                <nav className="space-y-1 border-l border-gray-800">
                  {sections.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`block w-full text-left pl-4 py-2 text-sm transition-all duration-200 border-l-2 -ml-px ${
                        activeSection === id
                          ? "border-amber-500 text-amber-400 font-medium"
                          : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share this article
                  </button>
                </div>
              </div>
            </aside>

            {/* --- Mobile TOC --- */}
            <div className="lg:hidden fixed bottom-4 right-4 z-40">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-12 h-12 rounded-full bg-amber-600 text-gray-950 shadow-lg shadow-amber-600/30 flex items-center justify-center"
                aria-label="Table of contents"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              {tocOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-16 right-0 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-4"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-500/60 mb-3">Contents</h3>
                  <nav className="space-y-1">
                    {sections.map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === id
                            ? "bg-amber-500/10 text-amber-400"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              )}
            </div>

            {/* === ARTICLE CONTENT === */}
            <article className="flex-1 max-w-3xl pb-24">
              {/* --- Intro --- */}
              <section id="intro" className="pt-8">
                <FadeInSection>
                  <div className="prose-body">
                    <p className="text-xl md:text-2xl leading-relaxed text-gray-300 mb-6 first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                      There's a number that refuses to stay quiet.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      It doesn't scream for attention. It doesn't announce itself. It simply… appears. On clocks. On license plates. In the fine print of history's most pivotal moments. And once you see it, once you <em>really</em> see it, you can't unsee it.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      We're talking about <strong className="text-amber-300">the number 33</strong>.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      To numerologists, it's the highest of the three Master Numbers, a vibration so powerful it's said to carry the energy of spiritual enlightenment, universal love, and cosmic mastery. But step beyond the world of numerology, and you'll find that 33 occupies an entirely different kind of throne, one draped in secrecy, power, and whispered conspiracies.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      So what <em>is</em> it about this number? Why does it keep surfacing in the architecture of power, the rituals of secret societies, and the turning points of human history?
                    </p>
                    <p className="text-xl leading-relaxed text-gray-300 font-medium">
                      Let's pull back the curtain.
                    </p>
                  </div>
                </FadeInSection>
              </section>

              <GoldDivider />

              {/* --- Section 1: Masonic Connection --- */}
              <SectionImage
                src={sectionImage1}
                alt="Ancient masonic temple architecture with ornate columns and mysterious symbols"
              />

              <section id="masonic">
                <FadeInSection>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                    The Masonic Connection: <span className="text-amber-400">The 33rd Degree</span>
                  </h2>
                  <div className="prose-body">
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      If there's one association that fuels the fire around the number 33, it's <strong className="text-gray-200">Freemasonry</strong>.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      In the Scottish Rite of Freemasonry, the highest honorary rank a Mason can receive is the <strong className="text-amber-300">33rd Degree</strong>. This isn't something you earn by climbing a ladder; it's <em>bestowed</em> upon you, reserved for those deemed to have rendered extraordinary service to the fraternity or to society at large.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Now, Freemasons will tell you this is simply a mark of respect. Nothing sinister. Nothing hidden.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      But conspiracy theorists? They see it differently. They argue that the 33rd Degree represents entry into an <strong className="text-gray-200">inner circle</strong>, an elite group wielding influence far beyond what the public sees. Some of history's most powerful figures were known 33rd Degree Masons: President <strong className="text-gray-200">Harry S. Truman</strong>, FBI Director <strong className="text-gray-200">J. Edgar Hoover</strong>, and General <strong className="text-gray-200">Douglas MacArthur</strong>, to name a few.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Whether you believe these men shaped the world from behind lodge doors or simply received an honorary title, the symbolism is hard to ignore. The number 33 sits at the very top of one of the world's oldest and most influential fraternal organizations.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 font-medium">
                      And that's just the beginning.
                    </p>
                  </div>
                </FadeInSection>
              </section>

              <GoldDivider />

              {/* --- Section 2: Body & Divine --- */}
              <SectionImage
                src={sectionImage2}
                alt="Detailed anatomical illustration of the human spinal column and vertebrae"
              />

              <section id="body-divine">
                <FadeInSection>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                    33 in the Body, <span className="text-amber-400">33 in the Divine</span>
                  </h2>
                  <div className="prose-body">
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Here's where things start to feel almost… <em>designed</em>.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      The human spine is composed of exactly <strong className="text-amber-300">33 vertebrae</strong>. From the base of your skull to the tip of your tailbone, 33 bones stack together to form the very column that holds you upright, the physical axis of your entire being.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      In spiritual traditions, particularly those involving <strong className="text-gray-200">kundalini energy</strong>, the spine is seen as a channel through which divine energy rises from the base to the crown of the head. The symbolism writes itself: 33 bones, 33 degrees of initiation, 33 steps to enlightenment.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Then there's the sacred dimension. In Christian tradition, <strong className="text-gray-200">Jesus was crucified at the age of 33</strong>, in 33 A.D., and is said to have performed <strong className="text-gray-200">33 miracles</strong>. In Islam, prayer beads traditionally come in sets of <strong className="text-gray-200">33</strong>. The Vedic religion honors <strong className="text-gray-200">33 deities</strong>. The divine name <em>Elohim</em> appears exactly <strong className="text-gray-200">33 times</strong> in the opening chapter of Genesis.
                    </p>
                  </div>
                </FadeInSection>

                <PullQuote>
                  "33 bones in the spine. 33 degrees of initiation. 33 steps to enlightenment. The symbolism writes itself."
                </PullQuote>

                <FadeInSection>
                  <p className="text-lg leading-relaxed text-gray-400 mb-6">
                    Coincidence? Maybe. But when a single number threads itself through the human body, ancient scriptures, and mystical traditions across cultures and continents, it starts to feel like something more.
                  </p>
                </FadeInSection>
              </section>

              <GoldDivider />

              {/* --- Section 3: 33rd Parallel --- */}
              <SectionImage
                src={sectionImage3}
                alt="Dark globe showing world map with latitude lines and geopolitical boundaries"
              />

              <section id="parallel">
                <FadeInSection>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                    The 33rd Parallel: <span className="text-amber-400">Where History Bleeds</span>
                  </h2>
                  <div className="prose-body">
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Now, let's draw a line across the globe.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      The <strong className="text-amber-300">33rd parallel north</strong>, the circle of latitude sitting 33 degrees above the equator, passes through some of the most historically significant and, frankly, <em>unsettling</em> locations on Earth.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      <strong className="text-gray-200">Dallas, Texas</strong> sits on the 33rd parallel. It's where President <strong className="text-gray-200">John F. Kennedy was assassinated</strong> in 1963. Some theorists have pointed out that the date itself, 11/22, adds up to 33.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      <strong className="text-gray-200">Roswell, New Mexico</strong>, site of the most famous alleged UFO crash in 1947, also lies near the 33rd parallel. So does <strong className="text-gray-200">Phoenix, Arizona</strong>, where thousands witnessed the still-unexplained <strong className="text-gray-200">Phoenix Lights</strong> in 1997.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      The <strong className="text-gray-200">Trinity nuclear testing grounds</strong>, where the first atomic bomb was detonated, sit on the 33rd parallel. So do <strong className="text-gray-200">Hiroshima and Nagasaki</strong>. And who authorized the dropping of those bombs? <strong className="text-amber-300">Harry S. Truman</strong>, the <strong className="text-amber-300">33rd President</strong> of the United States, and a <strong className="text-amber-300">33rd Degree Mason</strong>.
                    </p>
                  </div>
                </FadeInSection>

                <PullQuote>
                  "The Trinity test site. Hiroshima. Nagasaki. All on the 33rd parallel. All authorized by the 33rd President, a 33rd Degree Mason."
                </PullQuote>

                <FadeInSection>
                  <p className="text-lg leading-relaxed text-gray-400">
                    The layers pile up like sediment, each one adding weight to a pattern that either means everything… or nothing at all.
                  </p>
                </FadeInSection>
              </section>

              <GoldDivider />

              {/* --- Section 4: Modern History --- */}
              <SectionImage
                src={sectionImage4}
                alt="Mysterious gothic cathedral interior illuminated by dim candlelight at night"
              />

              <section id="modern-history">
                <FadeInSection>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                    33 in the Shadows of <span className="text-amber-400">Modern History</span>
                  </h2>
                  <div className="prose-body">
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      The number doesn't stop at geography. It worms its way into the timeline of modern events in ways that make even skeptics pause.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      <strong className="text-amber-300">1933</strong>: Adolf Hitler was appointed Chancellor of Germany, the year that would launch the darkest chapter of the 20th century. That same year, the first Nazi concentration camp at <strong className="text-gray-200">Dachau</strong> was established.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      <strong className="text-gray-200">Pope John Paul I</strong> served as Pope for only <strong className="text-amber-300">33 days</strong>, one of the shortest papal reigns in history, before his sudden and still-debated death.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      <strong className="text-gray-200">Disney's Club 33</strong>: Hidden behind an unmarked door at <strong className="text-amber-300">33 Royal Street</strong> in Disneyland's New Orleans Square sits the park's most exclusive, members-only club. Founded by Walt Disney himself, it features invitation-only membership, a years-long waitlist, and a strict no-photography policy. It's been called "Disney's Illuminati", a private world of luxury concealed within the happiest place on Earth.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Are these deliberate breadcrumbs left by those "in the know"? Or are they simply the kind of coincidences that emerge when you sift through enough data?
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 font-medium">
                      That question brings us to the most important part of this entire discussion.
                    </p>
                  </div>
                </FadeInSection>
              </section>

              <GoldDivider />

              {/* --- Section 5: Frequency Illusion --- */}
              <SectionImage
                src={sectionImage5}
                alt="Abstract neural network visualization with glowing connections representing brain patterns"
              />

              <section id="frequency-illusion">
                <FadeInSection>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                    The Frequency Illusion: <span className="text-amber-400">When Your Mind Becomes the Conspiracy</span>
                  </h2>
                  <div className="prose-body">
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Here's the twist in the tale, the part that might unravel everything, or make it even more mysterious, depending on how you look at it.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      There's a well-documented psychological phenomenon called the <strong className="text-amber-300">Frequency Illusion</strong>, also known as the <strong className="text-amber-300">Baader-Meinhof Phenomenon</strong>. It works like this: once you learn about something new, a word, a concept, a number, your brain suddenly starts noticing it <em>everywhere</em>. It feels like the universe is sending you signals. But what's actually happening is far more mundane.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Your brain is doing two things simultaneously. First, <strong className="text-gray-200">selective attention</strong> kicks in, your subconscious has flagged this new piece of information as important, so it starts scanning for it without you even trying. Second, <strong className="text-gray-200">confirmation bias</strong> takes over, every time you spot the thing you're looking for, it reinforces the belief that it's appearing more frequently. The hits register. The misses don't.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      This is <em>exactly</em> what happens with the number 33.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Once someone tells you to look for it, you <em>will</em> find it. On receipts. On timestamps. In news headlines. In the number of items in your shopping cart. Your brain becomes a 33-seeking missile, and every target it hits feels like proof of a grand design.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 font-medium">
                      The number 33 didn't suddenly appear in your life. It was always there. <strong className="text-amber-300">You just weren't looking.</strong>
                    </p>
                  </div>
                </FadeInSection>
              </section>

              <GoldDivider />

              {/* --- Section 6: Conclusion --- */}
              <SectionImage
                src={sectionImage6}
                alt="Mysterious antique clock face showing the passage of time"
              />

              <section id="conclusion">
                <FadeInSection>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                    So… <span className="text-amber-400">Which Is It?</span>
                  </h2>
                  <div className="prose-body">
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                       This is the question that makes the number 33 so endlessly fascinating, and so perfectly suited for a world that exists somewhere between logic and mystery.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                       Is 33 a <strong className="text-gray-200">sacred code</strong> embedded into the fabric of reality by forces we don't fully understand? Is it a <strong className="text-gray-200">signal</strong> used by secret societies to mark their influence across history? Or is it simply a <strong className="text-gray-200">number</strong>, no more meaningful than 32 or 34, that we've collectively charged with significance because our pattern-seeking brains can't resist a good story?
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      In numerology, we know that <strong className="text-amber-300">33 is the Master Teacher</strong>. It carries the combined energy of 11 (spiritual insight) and 22 (the master builder), elevated to its highest expression. It represents compassion, healing, and the courage to uplift humanity. Whether or not the conspiracies hold water, the <em>energy</em> of 33 is undeniably powerful.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-6">
                      Perhaps the real mystery isn't whether shadowy elites are encoding 33 into world events. Perhaps it's why this particular number resonates so deeply with the human psyche in the first place.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 mb-8">
                      Some patterns are planted. Some are invented. And some… some simply <em>are</em>.
                    </p>
                    <p className="text-xl leading-relaxed text-amber-300 font-medium mb-12">
                      The next time you glance at the clock and it reads <strong>3:33</strong>, ask yourself: did you find the number, or did it find you?
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection>
                  <div className="text-center py-12 border-t border-b border-amber-500/20">
                    <p className="text-2xl md:text-3xl font-serif italic text-amber-200/70 max-w-2xl mx-auto leading-relaxed">
                      "The universe speaks in symbols. Whether we're reading them correctly is another matter entirely."
                    </p>
                  </div>
                </FadeInSection>
              </section>

              {/* --- Related Articles CTA --- */}
              <FadeInSection>
                <div className="mt-20 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800">
                  <h3 className="text-2xl font-serif font-bold text-white mb-6">Explore More</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link
                      to="/numerology/visiber-calculator"
                      className="group p-5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <span className="text-xs uppercase tracking-wider text-amber-500/60">Calculator</span>
                      <p className="text-gray-200 font-medium mt-1 group-hover:text-amber-300 transition-colors">
                        Visiber Number Calculator
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Discover your personal numerology numbers</p>
                    </Link>
                    <Link
                      to="/numerology"
                      className="group p-5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <span className="text-xs uppercase tracking-wider text-amber-500/60">Numerology</span>
                      <p className="text-gray-200 font-medium mt-1 group-hover:text-amber-300 transition-colors">
                        Numerology Hub
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Explore the power of numbers in your life</p>
                    </Link>
                    <Link
                      to="/articles/house-numbers-destiny"
                      className="group p-5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <span className="text-xs uppercase tracking-wider text-amber-500/60">Article</span>
                      <p className="text-gray-200 font-medium mt-1 group-hover:text-amber-300 transition-colors">
                        House Numbers & Destiny
                      </p>
                      <p className="text-sm text-gray-500 mt-1">How your address number shapes your life</p>
                    </Link>
                    <Link
                      to="/article"
                      className="group p-5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <span className="text-xs uppercase tracking-wider text-amber-500/60">Browse</span>
                      <p className="text-gray-200 font-medium mt-1 group-hover:text-amber-300 transition-colors">
                        All Articles
                      </p>
                      <p className="text-sm text-gray-500 mt-1">More insights on feng shui, astrology & numerology</p>
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default Number33Article;
