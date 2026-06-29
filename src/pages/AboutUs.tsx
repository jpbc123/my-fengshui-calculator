import { Helmet } from "@/lib/helmet-shim";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutUsSection from "@/components/AboutUsSection"; // assuming you save it here

const AboutUsPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Feng Shui & Beyond</title>
        <meta name="description" content="Learn about Feng Shui & Beyond — our mission to bring ancient feng shui, astrology, and numerology wisdom to the modern world through free, accessible tools." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/about-us" />
      </Helmet>
      <Header />
      <main>
        <AboutUsSection />
      </main>
    </>
  );
};

export default AboutUsPage;