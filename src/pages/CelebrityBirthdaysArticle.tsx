import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { motion, useInView } from "framer-motion";
import { ChevronDown, Share2, Star, Sparkles } from "lucide-react";
import heroImage from "../assets/purple-stars.jpg";
import sectionImage1 from "../assets/astrology.jpg";
import sectionImage2 from "../assets/cosmic-1.jpg";
import sectionImage3 from "../assets/western-compatibility.jpg";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Celebrity {
  name: string;
  day: number;
  year: number;
  profession: string;
  funFact: string;
  featured?: boolean;
  imageUrl?: string;
  imageCredit?: string;
}

interface MonthData {
  month: number;
  name: string;
  celebrities: Celebrity[];
}

// ─── Zodiac Helpers ──────────────────────────────────────────────────────────

const WESTERN_ZODIAC = [
  { name: "Capricorn", symbol: "♑", element: "Earth", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, color: "text-stone-400", bg: "bg-stone-500/20" },
  { name: "Aquarius", symbol: "♒", element: "Air", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  { name: "Pisces", symbol: "♓", element: "Water", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, color: "text-indigo-400", bg: "bg-indigo-500/20" },
  { name: "Aries", symbol: "♈", element: "Fire", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, color: "text-red-400", bg: "bg-red-500/20" },
  { name: "Taurus", symbol: "♉", element: "Earth", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  { name: "Gemini", symbol: "♊", element: "Air", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { name: "Cancer", symbol: "♋", element: "Water", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, color: "text-slate-300", bg: "bg-slate-500/20" },
  { name: "Leo", symbol: "♌", element: "Fire", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, color: "text-orange-400", bg: "bg-orange-500/20" },
  { name: "Virgo", symbol: "♍", element: "Earth", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, color: "text-lime-400", bg: "bg-lime-500/20" },
  { name: "Libra", symbol: "♎", element: "Air", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, color: "text-pink-400", bg: "bg-pink-500/20" },
  { name: "Scorpio", symbol: "♏", element: "Water", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, color: "text-rose-500", bg: "bg-rose-500/20" },
  { name: "Sagittarius", symbol: "♐", element: "Fire", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, color: "text-violet-400", bg: "bg-violet-500/20" },
];

const CHINESE_ZODIAC = [
  { name: "Rat", emoji: "🐀" },
  { name: "Ox", emoji: "🐂" },
  { name: "Tiger", emoji: "🐅" },
  { name: "Rabbit", emoji: "🐇" },
  { name: "Dragon", emoji: "🐉" },
  { name: "Snake", emoji: "🐍" },
  { name: "Horse", emoji: "🐴" },
  { name: "Goat", emoji: "🐐" },
  { name: "Monkey", emoji: "🐵" },
  { name: "Rooster", emoji: "🐓" },
  { name: "Dog", emoji: "🐕" },
  { name: "Pig", emoji: "🐖" },
];

function getWesternZodiac(month: number, day: number) {
  for (const sign of WESTERN_ZODIAC) {
    if (sign.startMonth === sign.endMonth) continue;
    if (sign.startMonth > sign.endMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign;
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign;
    }
  }
  return WESTERN_ZODIAC[0];
}

function getChineseZodiac(year: number) {
  const index = ((year - 1900) % 12 + 12) % 12;
  return CHINESE_ZODIAC[index];
}

// ─── Celebrity Data (by Month) ──────────────────────────────────────────────

const MONTHS_DATA: MonthData[] = [
  {
    month: 1, name: "January",
    celebrities: [
      { name: "Timothee Chalamet", day: 27, year: 1995, profession: "Actor", funFact: "Breakthrough in Call Me by Your Name; youngest Best Actor nominee in decades" },
      { name: "Elvis Presley", day: 8, year: 1935, profession: "Singer & Actor", funFact: "The King of Rock and Roll sold over 500 million records worldwide" },
      { name: "David Bowie", day: 8, year: 1947, profession: "Singer & Musician", funFact: "Reinvented himself across five decades, from Ziggy Stardust to Blackstar" },
      { name: "Jim Carrey", day: 17, year: 1962, profession: "Actor & Comedian", funFact: "Wrote himself a $10 million check before he was famous, then cashed it years later" },
      { name: "Dolly Parton", day: 19, year: 1946, profession: "Singer & Actress", funFact: "Has donated over 200 million books to children through her Imagination Library", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Young-Dolly-Parton.jpg", imageCredit: "RCA Records / Public Domain" },
      { name: "Ellen DeGeneres", day: 26, year: 1958, profession: "TV Host & Comedian", funFact: "Hosted the Oscars twice and holds multiple Daytime Emmy records" },
    ],
  },
  {
    month: 2, name: "February",
    celebrities: [
      { name: "Harry Styles", day: 1, year: 1994, profession: "Singer & Actor", funFact: "From One Direction to solo superstardom and a Vogue cover in a dress" },
      { name: "Shakira", day: 2, year: 1977, profession: "Singer & Songwriter", funFact: "Her hips don't lie, and neither do her 80+ million album sales worldwide" },
      { name: "Jennifer Aniston", day: 11, year: 1969, profession: "Actress", funFact: "Rachel Green earned her a million dollars per episode of Friends" },
      { name: "Rihanna", day: 20, year: 1988, profession: "Singer & Entrepreneur", funFact: "Built Fenty into a billion-dollar empire while racking up 14 number-one hits", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Rihanna_2012_%28Headshot%29.jpg", imageCredit: "Liam Mendes / CC BY-SA 2.0" },
      { name: "Drew Barrymore", day: 22, year: 1975, profession: "Actress & TV Host", funFact: "Started acting at age 5 in E.T. and became a producer by her twenties" },
    ],
  },
  {
    month: 3, name: "March",
    celebrities: [
      { name: "Justin Bieber", day: 1, year: 1994, profession: "Singer", funFact: "Discovered on YouTube at 13, became the youngest solo male act to top the Hot 100" },
      { name: "Daniel Craig", day: 2, year: 1968, profession: "Actor", funFact: "Redefined James Bond for a grittier era across five blockbuster films" },
      { name: "Bruce Willis", day: 19, year: 1955, profession: "Actor", funFact: "Yippee-ki-yay: Die Hard turned him from a TV comedian into an action legend" },
      { name: "Reese Witherspoon", day: 22, year: 1976, profession: "Actress & Producer", funFact: "Won the Oscar for Walk the Line and built a media empire with Hello Sunshine" },
      { name: "Lady Gaga", day: 28, year: 1986, profession: "Singer & Actress", funFact: "From meat dresses to an Oscar for A Star Is Born, she never stops reinventing", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Lady_Gaga_A_Star_is_Born_premire.png", imageCredit: "Sassy Films / CC BY 3.0" },
    ],
  },
  {
    month: 4, name: "April",
    celebrities: [
      { name: "Robert Downey Jr.", day: 4, year: 1965, profession: "Actor", funFact: "His comeback story led to Iron Man, launching the entire MCU phenomenon" },
      { name: "Kristen Stewart", day: 9, year: 1990, profession: "Actress", funFact: "Went from Twilight to a Cesar Award, the first American actress to win one" },
      { name: "Emma Watson", day: 15, year: 1990, profession: "Actress & Activist", funFact: "Grew up as Hermione Granger and became a UN Women Goodwill Ambassador", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Emma_Watson%2C_2012.jpg", imageCredit: "David Shankbone / CC BY 2.0" },
      { name: "Penelope Cruz", day: 28, year: 1974, profession: "Actress", funFact: "First Spanish actress to win an Academy Award, for Vicky Cristina Barcelona" },
      { name: "Channing Tatum", day: 26, year: 1980, profession: "Actor", funFact: "Went from stripper to Magic Mike superstar, then a critically praised dramatic actor" },
    ],
  },
  {
    month: 5, name: "May",
    celebrities: [
      { name: "Dwayne Johnson", day: 2, year: 1972, profession: "Actor & Former Wrestler", funFact: "From WWE champion to Hollywood's highest-paid actor for multiple years running", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dwayne_The_Rock_Johnson_2009_portrait.jpg", imageCredit: "David Shankbone / CC BY 3.0" },
      { name: "Adele", day: 5, year: 1988, profession: "Singer & Songwriter", funFact: "Hello from the other side of 120+ million album sales and 16 Grammys" },
      { name: "George Clooney", day: 6, year: 1961, profession: "Actor & Director", funFact: "Sold his tequila brand for a billion dollars while winning Oscars on the side" },
      { name: "Cate Blanchett", day: 14, year: 1969, profession: "Actress", funFact: "Two-time Oscar winner who disappears into every role from Galadriel to Carol" },
      { name: "Chris Brown", day: 5, year: 1989, profession: "Singer & Dancer", funFact: "Released his debut album at 16, earning comparisons to Michael Jackson" },
    ],
  },
  {
    month: 6, name: "June",
    celebrities: [
      { name: "Tom Holland", day: 1, year: 1996, profession: "Actor", funFact: "Landed Spider-Man at 19 and became the MCU's most lovable web-slinger" },
      { name: "Angelina Jolie", day: 4, year: 1975, profession: "Actress & Humanitarian", funFact: "Oscar winner turned UNHCR Special Envoy, championing refugees worldwide", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Angelina_Jolie_2_June_2014_%28cropped%29.jpg", imageCredit: "FCO / CC BY 2.0" },
      { name: "Nicole Kidman", day: 20, year: 1967, profession: "Actress & Producer", funFact: "From Moulin Rouge to Big Little Lies, she dominates both film and television" },
      { name: "Chris Pratt", day: 21, year: 1979, profession: "Actor", funFact: "Transformed from lovable Andy Dwyer to blockbuster lead in Guardians of the Galaxy" },
      { name: "Ariana Grande", day: 26, year: 1993, profession: "Singer & Actress", funFact: "Her four-octave vocal range and ponytail are equally iconic in pop culture" },
      { name: "Mindy Kaling", day: 24, year: 1979, profession: "Actress & Writer", funFact: "Created, wrote, and starred in The Mindy Project after breaking out on The Office" },
    ],
  },
  {
    month: 7, name: "July",
    celebrities: [
      { name: "Margot Robbie", day: 2, year: 1990, profession: "Actress & Producer", funFact: "Brought Barbie to life in the billion-dollar film and earned Oscar nods for I, Tonya" },
      { name: "Tom Cruise", day: 3, year: 1962, profession: "Actor & Producer", funFact: "Does his own stunts at 60+, from hanging off planes to HALO jumping for real" },
      { name: "Tom Hanks", day: 9, year: 1956, profession: "Actor", funFact: "Back-to-back Best Actor Oscars for Philadelphia and Forrest Gump, a rare feat", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/66/Tom_Hanks_2014.jpg", imageCredit: "U.S. Dept. of State / Public Domain" },
      { name: "Selena Gomez", day: 22, year: 1992, profession: "Singer & Actress", funFact: "Most-followed woman on Instagram and Emmy-nominated for Only Murders in the Building" },
      { name: "Jennifer Lopez", day: 24, year: 1969, profession: "Singer & Actress", funFact: "Jenny from the Block became a multi-hyphenate mogul worth hundreds of millions" },
    ],
  },
  {
    month: 8, name: "August",
    celebrities: [
      { name: "Jason Momoa", day: 1, year: 1979, profession: "Actor", funFact: "Went from Baywatch to Aquaman, becoming DC's most physically imposing hero" },
      { name: "Chris Hemsworth", day: 11, year: 1983, profession: "Actor", funFact: "Australia's hammer-wielding Thor has anchored seven Marvel films and counting" },
      { name: "Halle Berry", day: 14, year: 1966, profession: "Actress", funFact: "First African American woman to win the Academy Award for Best Actress" },
      { name: "Madonna", day: 16, year: 1958, profession: "Singer & Actress", funFact: "The Queen of Pop has sold over 300 million records, more than any other female artist", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Madonna_at_the_premiere_of_I_Am_Because_We_Are.jpg", imageCredit: "David Shankbone / CC BY-SA 3.0" },
      { name: "Blake Lively", day: 25, year: 1987, profession: "Actress", funFact: "Serena van der Woodsen turned real-life entrepreneur with Betty Buzz and Betty Booze" },
      { name: "Jack Black", day: 28, year: 1969, profession: "Actor & Comedian", funFact: "From School of Rock to Kung Fu Panda, his energy is unmatched in Hollywood" },
    ],
  },
  {
    month: 9, name: "September",
    celebrities: [
      { name: "Zendaya", day: 1, year: 1996, profession: "Actress & Singer", funFact: "Won back-to-back Emmys for Euphoria, becoming the youngest two-time winner" },
      { name: "Keanu Reeves", day: 2, year: 1964, profession: "Actor", funFact: "Hollywood's nicest human gave away millions from The Matrix to the crew" },
      { name: "Beyonce", day: 4, year: 1981, profession: "Singer & Performer", funFact: "Queen Bey holds the record for most Grammy wins of all time with 32 trophies", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Beyonce_Knowles_at_age_19.jpeg", imageCredit: "John Ferguson / CC BY 2.0" },
      { name: "Adam Sandler", day: 9, year: 1966, profession: "Actor & Comedian", funFact: "His comedies have earned billions, but Uncut Gems proved he's a dramatic powerhouse" },
      { name: "Will Smith", day: 25, year: 1968, profession: "Actor & Rapper", funFact: "From Fresh Prince to two Oscar nominations, he's one of Hollywood's biggest draws" },
    ],
  },
  {
    month: 10, name: "October",
    celebrities: [
      { name: "Kate Winslet", day: 5, year: 1975, profession: "Actress", funFact: "Rose from Titanic went on to win the Oscar and dominate prestige television" },
      { name: "Hugh Jackman", day: 12, year: 1968, profession: "Actor & Singer", funFact: "Played Wolverine for 17 years while winning Tonys on Broadway between films" },
      { name: "Zac Efron", day: 18, year: 1987, profession: "Actor", funFact: "High School Musical heartthrob turned serious actor in The Iron Claw" },
      { name: "Kim Kardashian", day: 21, year: 1980, profession: "TV Personality & Entrepreneur", funFact: "Turned reality TV fame into SKIMS and a billion-dollar business empire" },
      { name: "Ryan Reynolds", day: 23, year: 1976, profession: "Actor & Entrepreneur", funFact: "Deadpool's fourth-wall-breaking humor mirrors his real-life marketing genius", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg", imageCredit: "Dick Thomas Johnson / CC BY 2.0" },
      { name: "Drake", day: 24, year: 1986, profession: "Rapper & Singer", funFact: "Started on Degrassi, became the most-streamed artist in Spotify history" },
    ],
  },
  {
    month: 11, name: "November",
    celebrities: [
      { name: "Leonardo DiCaprio", day: 11, year: 1974, profession: "Actor & Environmentalist", funFact: "Finally won his Oscar for The Revenant after five nominations and decades of iconic roles", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Leonardo_DiCaprio_2002.jpg", imageCredit: "Georges Biard / CC BY-SA 3.0" },
      { name: "Ryan Gosling", day: 12, year: 1980, profession: "Actor & Musician", funFact: "From The Notebook heartthrob to Oscar-nominated Ken, he does it all" },
      { name: "Scarlett Johansson", day: 22, year: 1984, profession: "Actress", funFact: "Highest-grossing actress ever thanks to Black Widow and the MCU" },
      { name: "Miley Cyrus", day: 23, year: 1992, profession: "Singer & Actress", funFact: "From Hannah Montana to 'Flowers,' her reinventions keep topping the charts" },
      { name: "Mark Ruffalo", day: 22, year: 1967, profession: "Actor", funFact: "Three-time Oscar nominee who made the Hulk lovable again in the MCU" },
    ],
  },
  {
    month: 12, name: "December",
    celebrities: [
      { name: "Britney Spears", day: 2, year: 1981, profession: "Singer", funFact: "The Princess of Pop sold 150 million records and sparked a global movement with #FreeBritney" },
      { name: "Jay-Z", day: 4, year: 1969, profession: "Rapper & Mogul", funFact: "24 Grammys, a billion-dollar net worth, and married to Beyonce, talk about a power couple" },
      { name: "Taylor Swift", day: 13, year: 1989, profession: "Singer & Songwriter", funFact: "The Eras Tour became the highest-grossing concert tour in history", featured: true, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Taylor_Swift_%286966830273%29.jpg", imageCredit: "Eva Rinaldi / CC BY-SA 2.0" },
      { name: "Brad Pitt", day: 18, year: 1963, profession: "Actor & Producer", funFact: "From Fight Club to producing 12 Years a Slave, he's shaped both sides of the camera" },
      { name: "Billie Eilish", day: 18, year: 2001, profession: "Singer & Songwriter", funFact: "Won her first five Grammys at 18, the youngest artist to sweep the major categories" },
      { name: "Samuel L. Jackson", day: 21, year: 1948, profession: "Actor", funFact: "Highest all-time box office star with over $27 billion in total worldwide gross" },
    ],
  },
];

const MONTH_COLORS = [
  "from-sky-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-red-500 to-orange-500",
  "from-green-500 to-emerald-600",
  "from-yellow-500 to-amber-500",
  "from-cyan-500 to-sky-600",
  "from-orange-500 to-red-500",
  "from-lime-500 to-green-600",
  "from-fuchsia-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-indigo-600",
];

const ZODIAC_INSIGHTS = [
  { after: 2, text: "Fire signs (Aries, Leo, Sagittarius) are the most common zodiac signs among A-list action stars. Their natural confidence and bold energy translate perfectly to the big screen." },
  { after: 5, text: "Did you know? More Billboard Hot 100 number-one artists are Sagittarius than any other sign. Their adventurous spirit fuels creative risk-taking." },
  { after: 8, text: "Virgos and Libras dominate award season. Their perfectionism and charm make them Hollywood's most decorated signs at the Oscars." },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center my-12">
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-400/60 to-amber-400/60" />
      <div className="mx-3 text-pink-400 text-lg">{"✦"}</div>
      <div className="h-px w-20 bg-gradient-to-l from-transparent via-pink-400/60 to-amber-400/60" />
    </div>
  );
}

function ZodiacBadge({ month, day }: { month: number; day: number }) {
  const sign = getWesternZodiac(month, day);
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sign.bg} ${sign.color}`}>
      <span className="text-sm">{sign.symbol}</span>
      {sign.name}
    </span>
  );
}

function ChineseZodiacBadge({ year }: { year: number }) {
  const animal = getChineseZodiac(year);
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
      <span className="text-sm">{animal.emoji}</span>
      {animal.name}
    </span>
  );
}

function CelebrityCard({ celebrity, month }: { celebrity: Celebrity; month: number }) {
  const sign = getWesternZodiac(month, celebrity.day);

  if (celebrity.featured) {
    return (
      <FadeInSection className="col-span-full">
        <div>
          <div className="relative overflow-hidden rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-950/40 via-pink-950/20 to-purple-950/30 shadow-lg shadow-amber-500/10">
            <div className="absolute top-3 right-3 flex items-center gap-1 text-amber-300 text-xs font-semibold tracking-wider uppercase bg-amber-500/20 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              Featured
            </div>
            <div className="flex flex-col md:flex-row md:items-stretch">
              {celebrity.imageUrl && (
                <div className="shrink-0 w-full md:w-56 lg:w-64">
                  <div className="relative h-64 md:h-full min-h-[14rem] overflow-hidden">
                    <img
                      src={celebrity.imageUrl}
                      alt={celebrity.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a0a2e]/70 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/80 to-transparent md:hidden" />
                    {celebrity.imageCredit && (
                      <span className="absolute bottom-1 left-1 text-[10px] text-white/40 bg-black/50 px-1.5 py-0.5 rounded">
                        {celebrity.imageCredit}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-3xl ${sign.color}`}>{sign.symbol}</span>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-white">{celebrity.name}</h4>
                    <p className="text-sm text-gray-400">{celebrity.profession}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 mb-4">
                  <span className="text-xs text-gray-400">
                    {MONTHS_DATA[month - 1].name} {celebrity.day}, {celebrity.year}
                  </span>
                  <ZodiacBadge month={month} day={celebrity.day} />
                  <ChineseZodiacBadge year={celebrity.year} />
                </div>
                <p className="text-gray-200 leading-relaxed">{celebrity.funFact}</p>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    );
  }

  return (
    <FadeInSection>
      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-pink-400/30 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300 p-5">
        <div className="flex items-start gap-3">
          <div className={`text-3xl shrink-0 mt-0.5 ${sign.color} drop-shadow-lg`}>
            {sign.symbol}
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-white group-hover:text-pink-300 transition-colors">
              {celebrity.name}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{celebrity.profession}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-gray-500">
                {MONTHS_DATA[month - 1].name} {celebrity.day}, {celebrity.year}
              </span>
              <ZodiacBadge month={month} day={celebrity.day} />
              <ChineseZodiacBadge year={celebrity.year} />
            </div>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">{celebrity.funFact}</p>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

function InsightCallout({ text }: { text: string }) {
  return (
    <FadeInSection>
      <div className="my-12 mx-auto max-w-2xl px-6 py-6 rounded-xl border border-pink-400/20 bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400/60 to-transparent" />
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-pink-100/90 leading-relaxed italic">{text}</p>
        </div>
      </div>
    </FadeInSection>
  );
}

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <FadeInSection className="my-14 -mx-4 md:-mx-8 lg:-mx-12">
      <div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-lg md:rounded-xl">
        <img src={src} alt={alt} className="w-full h-full object-cover saturate-125" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e] via-transparent to-[#1a0a2e]/30" />
      </div>
    </FadeInSection>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const CelebrityBirthdaysArticle = () => {
  const [activeMonth, setActiveMonth] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveMonth(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    MONTHS_DATA.forEach(({ name }) => {
      const el = document.getElementById(`month-${name.toLowerCase()}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToMonth = (name: string) => {
    const el = document.getElementById(`month-${name.toLowerCase()}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  const handleShare = async () => {
    const url = "https://fengshuiandbeyond.com/articles/famous-celebrity-birthdays";
    if (navigator.share) {
      await navigator.share({ title: "Famous Celebrity Birthdays & Their Zodiac Signs", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const totalCelebs = MONTHS_DATA.reduce((sum, m) => sum + m.celebrities.length, 0);

  return (
    <>
      <Helmet>
        <title>Famous Celebrity Birthdays & Their Zodiac Signs | Feng Shui &amp; Beyond</title>
        <meta name="description" content="Explore famous celebrity birthdays organized by month. Discover the Western zodiac signs and Chinese zodiac animals of your favorite stars, from Taylor Swift to Leonardo DiCaprio." />
        <meta name="keywords" content="celebrity birthdays, famous birthdays, zodiac signs celebrities, celebrity astrology, star signs, Chinese zodiac celebrities, celebrity horoscope, birthday astrology" />
        <meta name="author" content="Feng Shui & Beyond" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/articles/famous-celebrity-birthdays" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="Famous Celebrity Birthdays & Their Zodiac Signs" />
        <meta property="og:description" content="Discover the zodiac signs and cosmic blueprints behind your favorite celebrities, organized by birth month." />
        <meta property="og:url" content="https://fengshuiandbeyond.com/articles/famous-celebrity-birthdays" />
        <meta property="article:published_time" content="2026-05-25" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Famous Celebrity Birthdays & Their Zodiac Signs" />
        <meta name="twitter:description" content="Discover the zodiac signs and cosmic blueprints behind your favorite celebrities." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Famous Celebrity Birthdays & Their Zodiac Signs",
            "description": "Explore famous celebrity birthdays organized by month with their Western zodiac signs and Chinese zodiac animals.",
            "image": "https://fengshuiandbeyond.com/celebrity-birthdays.jpg",
            "datePublished": "2026-05-25",
            "dateModified": "2026-05-25",
            "author": { "@type": "Person", "name": "Feng Shui & Beyond", "url": "https://fengshuiandbeyond.com/about-us" },
            "publisher": { "@type": "Organization", "name": "Feng Shui & Beyond", "logo": { "@type": "ImageObject", "url": "https://fengshuiandbeyond.com/circle-logo.png" } },
            "mainEntityOfPage": "https://fengshuiandbeyond.com/articles/famous-celebrity-birthdays"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fengshuiandbeyond.com/" },
              { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://fengshuiandbeyond.com/article" },
              { "@type": "ListItem", "position": 3, "name": "Celebrity Birthdays", "item": "https://fengshuiandbeyond.com/articles/famous-celebrity-birthdays" }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#16082b] to-[#0f0a1e] text-gray-100">
        <Header />

        {/* === HERO === */}
        <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
          <img
            src={heroImage}
            alt="Starry cosmic sky representing celebrity astrology"
            className="absolute inset-0 w-full h-full object-cover saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e] via-purple-950/50 to-fuchsia-950/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e]/70 via-transparent to-transparent h-32" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="inline-block text-pink-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4 bg-pink-500/10 px-3 py-1 rounded-full">
                Celebrity Astrology
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1] mb-6">
                Famous Celebrity Birthdays
                <span className="block bg-gradient-to-r from-pink-400 via-amber-300 to-fuchsia-400 bg-clip-text text-transparent text-2xl md:text-3xl lg:text-4xl mt-2 font-normal">
                  & Their Zodiac Signs
                </span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
                {totalCelebs} of your favorite stars, their cosmic blueprints revealed month by month.
              </p>

              <div className="flex items-center gap-4 mt-8 text-sm text-gray-300">
                <time dateTime="2026-05-25">May 25, 2026</time>
                <span className="w-1 h-1 rounded-full bg-pink-400/50" />
                <span>15 min read</span>
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-gray-300 hover:text-pink-400 transition-colors"
                  aria-label="Share article"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* === BREADCRUMB === */}
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Articles", href: "/article" },
              { label: "Celebrity Birthdays" },
            ]}
          />
        </div>

        {/* === FLOATING TOC (Month Selector) === */}
        <div className="sticky top-0 z-40 bg-[#1a0a2e]/90 backdrop-blur-md border-b border-purple-500/10">
          <div className="max-w-4xl mx-auto px-6">
            {/* Mobile TOC */}
            <div className="md:hidden py-3" ref={tocRef}>
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="flex items-center justify-between w-full text-sm text-gray-300 hover:text-white"
              >
                <span className="font-medium">
                  {activeMonth ? activeMonth.replace("month-", "").charAt(0).toUpperCase() + activeMonth.replace("month-", "").slice(1) : "Jump to month"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${tocOpen ? "rotate-180" : ""}`} />
              </button>
              {tocOpen && (
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {MONTHS_DATA.map(({ name }) => (
                    <button
                      key={name}
                      onClick={() => scrollToMonth(name)}
                      className={`text-xs px-3 py-2 rounded-md transition-colors ${
                        activeMonth === `month-${name.toLowerCase()}`
                          ? "bg-pink-500/20 text-pink-300 font-semibold"
                          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {name.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop TOC */}
            <div className="hidden md:flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
              {MONTHS_DATA.map(({ name }) => (
                <button
                  key={name}
                  onClick={() => scrollToMonth(name)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    activeMonth === `month-${name.toLowerCase()}`
                      ? "bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 text-pink-300 shadow-sm shadow-pink-500/10"
                      : "text-gray-400 hover:text-pink-300 hover:bg-white/5"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === ARTICLE CONTENT === */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Intro */}
          <FadeInSection>
            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-lg text-gray-200 leading-relaxed">
                Ever wondered what zodiac sign your favorite celebrity shares with you? From chart-topping musicians to Oscar-winning actors, the stars above have shaped the personalities, talents, and destinies of Hollywood's brightest.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Below, we've curated {totalCelebs} famous celebrity birthdays organized by birth month, complete with their <strong className="text-white">Western zodiac sign</strong> and <strong className="text-white">Chinese zodiac animal</strong>. Whether you're curious about cosmic connections or just love celebrity trivia, scroll through to discover who shares your birthday month and what the stars say about them.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Note: Chinese zodiac years listed are based on the Western calendar year. For precise calculations accounting for the Lunar New Year date, try our <Link to="/astrology/chinese-zodiac-calculator" className="text-pink-400 hover:text-pink-300 underline underline-offset-2">Chinese Zodiac Calculator</Link>.
              </p>
            </div>
          </FadeInSection>

          <GoldDivider />

          {/* Month Sections */}
          {MONTHS_DATA.map((monthData, index) => {
            const insight = ZODIAC_INSIGHTS.find((i) => i.after === index);
            const showImage = index === 3 || index === 7;
            const images = [
              { src: sectionImage1, alt: "Astrology and zodiac illustration" },
              { src: sectionImage2, alt: "Cosmic energy and stars" },
              { src: sectionImage3, alt: "Zodiac compatibility chart" },
            ];
            const imageIndex = index === 3 ? 0 : index === 7 ? 1 : 2;

            return (
              <div key={monthData.name}>
                <section id={`month-${monthData.name.toLowerCase()}`} className="scroll-mt-16 mb-16">
                  <FadeInSection>
                    <div className={`relative overflow-hidden rounded-xl p-6 md:p-8 mb-8 bg-gradient-to-r ${MONTH_COLORS[index]} shadow-lg`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-2 right-4 text-6xl md:text-8xl font-serif font-bold text-white/10 select-none">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-md">
                          {monthData.name}
                        </h2>
                        <p className="text-sm text-white/70 mt-1">
                          {monthData.celebrities.length} celebrities
                        </p>
                      </div>
                    </div>
                  </FadeInSection>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthData.celebrities.map((celebrity) => (
                      <CelebrityCard
                        key={celebrity.name}
                        celebrity={celebrity}
                        month={monthData.month}
                      />
                    ))}
                  </div>
                </section>

                {insight && <InsightCallout text={insight.text} />}
                {showImage && <SectionImage src={images[imageIndex].src} alt={images[imageIndex].alt} />}
                {(index < MONTHS_DATA.length - 1) && <GoldDivider />}
              </div>
            );
          })}

          {/* Conclusion */}
          <GoldDivider />
          <FadeInSection>
            <div className="text-center py-14 px-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-violet-500/10 border border-pink-400/10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                Discover Your Own Cosmic Blueprint
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Now that you've explored the zodiac signs of your favorite celebrities, why not dive deeper into your own astrological profile? Our free calculators can reveal your Western zodiac traits, Chinese zodiac animal, numerology life path, and more.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/astrology/western-zodiac-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 transition-all text-sm font-semibold shadow-md shadow-pink-500/20"
                >
                  Western Zodiac Calculator
                </Link>
                <Link
                  to="/astrology/chinese-zodiac-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-400 hover:to-purple-400 transition-all text-sm font-semibold shadow-md shadow-violet-500/20"
                >
                  Chinese Zodiac Calculator
                </Link>
                <Link
                  to="/numerology"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all text-sm font-semibold shadow-md shadow-amber-500/20"
                >
                  Numerology Calculator
                </Link>
              </div>
            </div>
          </FadeInSection>
        </main>
      </div>
    </>
  );
};

export default CelebrityBirthdaysArticle;
