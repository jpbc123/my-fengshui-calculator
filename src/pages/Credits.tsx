// src/pages/Credits.tsx
import { Helmet } from "@/lib/helmet-shim";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { ExternalLink } from "lucide-react";

const Credits = () => {
  return (
    <>
      <Helmet>
        <title>Credits & Attributions | Feng Shui & Beyond</title>
        <meta name="description" content="Image credits and attributions for Feng Shui & Beyond. Acknowledging the creators and sources of images used on our site." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/credits" />
      </Helmet>
      <SplashCursor />
      <div className="relative min-h-screen bg-white text-black">
        <Header />
        <main className="container mx-auto max-w-4xl py-24 px-4">
          <article className="prose prose-lg mx-auto text-black">
            <h1 className="text-4xl font-bold text-gold mb-6 text-center">Image Credits & Attributions</h1>
            <p className="lead text-black/80 text-center mb-12">
              We acknowledge and thank the creators of the visual content used throughout our website.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gold mt-10 mb-6">Chinese Zodiac Icons</h2>
              <p className="mb-6">All Chinese zodiac animal icons used throughout our website are sourced from Flaticon and created by Freepik:</p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/chinese-horoscope" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Rat, Monkey, Pig icons created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-ox" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Ox icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-tiger" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Tiger icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-rabbit" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Rabbit icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-dragon" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Dragon icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-snake" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Snake icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-horse" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Horse icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-goat" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Goat icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-rooster" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Rooster icon created by Freepik - Flaticon
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <a href="https://www.flaticon.com/free-icons/year-of-the-dog" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-gold hover:text-gold/80 underline">
                    Dog icon created by Freepik - Flaticon
                  </a>
                </div>
              </div>
            </section>

            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-6">Astrology & Horoscope Graphics</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-black mb-2">Western Zodiac Wheel</h4>
                  <div className="flex items-start gap-2">
                    <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <a href="https://www.britannica.com/topic/zodiac" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-gold hover:text-gold/80 underline text-sm">
                      Zodiac reference from Britannica Encyclopedia
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Horoscope Background Graphics</h4>
                  <div className="flex items-start gap-2">
                    <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <a href="https://www.freepik.com/free-vector/horoscope-composition-background-with-zodiac-astrology-symbols-flat-vector-illustration_58574513.htm" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-gold hover:text-gold/80 underline text-sm">
                      Horoscope composition by Freepik
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Birth Chart Graphics</h4>
                  <div className="flex items-start gap-2">
                    <ExternalLink size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <a href="https://www.freepik.com/free-photo/horoscope-chart-horoscope-wheel-chart-white-paper-black-white-zodiac-wheel-with-blue-markings_1189696.htm" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-gold hover:text-gold/80 underline text-sm">
                      Birth chart image by Dragana_Gordic on Freepik
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-6">Additional Resources</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-black mb-4">Photography & Background Images</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Additional photography and background images are sourced from:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Pexels</strong> - Free stock photography under Pexels License</li>
                  <li><strong>Unsplash</strong> - Free high-resolution photos under Unsplash License</li>
				  <li><strong>Flickr</strong> - Creative Commons licensed photography contributed by talented photographers worldwide.</li>
                  <li><strong>Custom Graphics</strong> - Original illustrations created specifically for Feng Shui & Beyond</li>
                </ul>
              </div>
            </section>

            <hr className="my-10 border-gold/30" />

            <section className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gold mb-4">License Compliance</h2>
              <p className="text-sm text-gray-700">
                All images and graphics used on this website are properly licensed for commercial use. 
                We respect the intellectual property rights of all creators and comply with the terms 
                of service of all platforms from which we source visual content.
              </p>
              <p className="text-sm text-gray-700 mt-4">
                If you are a content creator and believe your work has been used improperly, 
                please contact us at{" "}
                <a href="mailto:myfengshuicalculator@gmail.com" className="text-gold underline">
                  myfengshuicalculator@gmail.com
                </a>{" "}
                and we will address the matter promptly.
              </p>
            </section>
          </article>
        </main>
      </div>
    </>
  );
};

export default Credits;