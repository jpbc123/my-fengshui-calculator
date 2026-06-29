// src/pages/TermsOfService.tsx
import { Helmet } from "@/lib/helmet-shim";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SplashCursor } from "@/components/ui/splash-cursor";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Feng Shui & Beyond</title>
        <meta name="description" content="Terms of Service for Feng Shui & Beyond. Read our terms and conditions for using our feng shui, astrology, and numerology tools." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/terms-of-service" />
      </Helmet>
      <SplashCursor />
      <div className="relative min-h-screen bg-white text-black">
        <Header />
        <main className="container mx-auto max-w-4xl py-24 px-4">
          <article className="prose prose-lg mx-auto text-black">
            <h1 className="text-4xl font-bold text-gold mb-6 text-center">Terms of Service</h1>
            <p className="lead text-black/80">
              Welcome to Feng Shui & Beyond. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gold mt-10 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or using the Feng Shui & Beyond website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please discontinue use of our services immediately.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services after any modifications constitutes acceptance of the updated Terms.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">2. Description of Services</h2>
              <p>
                Feng Shui & Beyond provides digital services including but not limited to:
              </p>
              <ul className="list-disc ml-6">
                <li><strong className="text-black">Feng Shui Wedding Date Selection:</strong> Personalized auspicious wedding date recommendations based on traditional Chinese calendar principles and zodiac compatibility analysis.</li>
                <li><strong className="text-black">Birth Chart Analysis:</strong> Astrological natal chart interpretations providing insights into personality traits, life path guidance, and cosmic influences.</li>
                <li><strong className="text-black">Numerology Calculations:</strong> Personal number analysis and interpretations based on numerological principles.</li>
                <li><strong className="text-black">Daily Horoscopes and Guidance:</strong> Regular astrological and feng shui insights for personal reflection and guidance.</li>
                <li><strong className="text-black">Educational Content:</strong> Articles, tips, and resources related to astrology, feng shui, and numerology.</li>
				<li><strong className="text-black">Service Methodology:</strong> Our calculators and analysis tools utilize pre-determined results based on extensive research of traditional methodologies and interpretations. Results are generated using established algorithms and lookup tables rather than real-time calculations, ensuring consistent and researched-based guidance for users with similar inputs.</li>
              </ul>
              <p>
                All services are delivered digitally and are available immediately upon completion of payment processing.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">3. Payment Terms and No Refund Policy</h2>
              <p>
                <strong className="text-black">Payment Processing:</strong> All payments are processed securely through Paddle, our authorized payment processor. By making a purchase, you authorize us to charge your selected payment method for the full amount of your order.
              </p>
              <p>
                <strong className="text-black">All Sales Are Final:</strong> Due to the personalized and immediately delivered nature of our digital services, we do not offer refunds, exchanges, cancellations, or returns once a service has been rendered or digital content has been delivered. This policy applies regardless of your satisfaction with the results.
              </p>
              <p>
                <strong className="text-black">Service Delivery:</strong> Digital reports and analysis are typically delivered within minutes of successful payment. In rare cases of technical issues preventing immediate delivery, we will resolve delivery within 24 hours or provide a full refund at our discretion.
              </p>
              <p>
                <strong className="text-black">Pricing:</strong> All prices are displayed in USD unless otherwise specified. Prices may change at any time without notice, but changes will not affect orders already placed.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">4. Service Limitations and Disclaimers</h2>
              <p>
                <strong className="text-black">Entertainment and Guidance Purposes Only:</strong> Although rooted in traditional practices and centuries of cultural wisdom, our astrological, numerological, and feng shui analyses are intended for personal guidance and should not be used as substitutes for:
              </p>
              <ul className="list-disc ml-6">
                <li>Medical, psychological, or mental health advice or treatment</li>
                <li>Legal counsel or advice</li>
                <li>Financial, investment, or business advice</li>
                <li>Relationship counseling or therapy</li>
                <li>Career counseling or professional guidance</li>
              </ul>
              <p>
                <strong className="text-black">Our Approach:</strong> We provide insights based on time-tested traditional interpretative methods. While we strive for accuracy and meaningful guidance, results should be considered as a valuable perspective among many in your decision-making process rather than absolute certainty..
              </p>
              <p>
                <strong className="text-black">Individual Results May Vary:</strong> Astrological and feng shui interpretations are subjective in nature. Different practitioners may provide varying interpretations of the same data.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">5. User Responsibilities and Conduct</h2>
              <p>
                By using our services, you agree to:
              </p>
              <ul className="list-disc ml-6">
                <li><strong className="text-black">Provide Accurate Information:</strong> Supply truthful and accurate birth dates, times, and locations for calculations. Inaccurate information will result in inaccurate analyses.</li>
                <li><strong className="text-black">Age Requirements:</strong> You must be at least 18 years old to purchase our services. Users aged 13-17 may use free content with parental consent.</li>
                <li><strong className="text-black">Lawful Use:</strong> Use our services only for lawful purposes and in accordance with these Terms.</li>
                <li><strong className="text-black">Personal Use:</strong> Services purchased are for your personal use only. You may not resell, redistribute, or use our content for commercial purposes without written permission.</li>
                <li><strong className="text-black">Respectful Communication:</strong> Maintain respectful communication in any interactions with our support team or community features.</li>
              </ul>
              <p>
                You are prohibited from:
              </p>
              <ul className="list-disc ml-6">
                <li>Attempting to reverse engineer our calculation methods or proprietary algorithms</li>
                <li>Using our services to harm, harass, or defraud others</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Interfering with the proper functioning of our website or services</li>
              </ul>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">6. Intellectual Property Rights</h2>
              <p>
                <strong className="text-black">Our Content:</strong> All content on the Feng Shui & Beyond website, including but not limited to text, graphics, logos, images, calculations, interpretations, and software, is the property of Feng Shui & Beyond and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong className="text-black">Your License:</strong> Upon purchase of our services, you receive a non-exclusive, non-transferable license to use the resulting reports and analyses for your personal use only. This license does not grant you ownership rights to our methods, algorithms, or underlying content.
              </p>
              <p>
                <strong className="text-black">Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of our services or included software, nor may you reverse engineer or attempt to extract the source code of our proprietary calculation methods.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">7. Limitation of Liability</h2>
              <p>
                <strong className="text-black">Maximum Liability:</strong> To the fullest extent permitted by law, Feng Shui & Beyond's total liability to you for any damages arising from or related to these Terms or your use of our services shall not exceed the amount you paid for the specific service giving rise to the claim.
              </p>
              <p>
                <strong className="text-black">Exclusion of Damages:</strong> We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc ml-6">
                <li>Personal or business decisions made based on our reports or guidance</li>
                <li>Financial losses or missed opportunities</li>
                <li>Relationship or personal issues</li>
                <li>Emotional distress or psychological harm</li>
                <li>Loss of data or business interruption</li>
              </ul>
              <p>
                <strong className="text-black">Service Availability:</strong> We do not guarantee that our services will be available at all times or free from technical issues. We reserve the right to suspend or discontinue services for maintenance, updates, or other operational reasons.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">8. Third-Party Services</h2>
              <p>
                Our website may integrate with or link to third-party services, including:
              </p>
              <ul className="list-disc ml-6">
                <li><strong className="text-black">Paddle:</strong> Payment processing services</li>
                <li><strong className="text-black">Analytics Services:</strong> Website performance and user behavior tracking</li>
                <li><strong className="text-black">Content Delivery Networks:</strong> For improved website performance</li>
                <li><strong className="text-black">Social Media Platforms:</strong> For sharing and community features</li>
              </ul>
              <p>
                These third-party services operate under their own terms of service and privacy policies. We are not responsible for their practices, availability, or performance. Your use of third-party services is at your own risk.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">9. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the practices described in our Privacy Policy.
              </p>
              <p>
                <strong className="text-black">Data Security:</strong> We implement reasonable security measures to protect your personal information, but we cannot guarantee absolute security. You provide personal information at your own risk.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">10. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your access to our services at any time, with or without cause, and with or without notice. Reasons for termination may include violation of these Terms, fraudulent activity, or abuse of our services.
              </p>
              <p>
                Upon termination, your right to use our services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">11. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our services will be resolved through binding arbitration in Malaysia, except for claims that may be brought in small claims court.
              </p>
              <p>
                Both parties agree to waive their right to a jury trial and to participate in class action lawsuits or class-wide arbitration.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">12. Contact Information and Support</h2>
              <p>
                For questions about these Terms of Service, technical support, or general inquiries, please contact us:
              </p>
              <ul className="list-none">
                <li><strong className="text-black">Email:</strong> <a href="mailto:myfengshuicalculator@gmail.com" className="text-gold underline">myfengshuicalculator@gmail.com</a></li>
                <li><strong className="text-black">Website:</strong> Contact form available on our Contact Us page</li>
                <li><strong className="text-black">Response Time:</strong> We aim to respond to all inquiries within 48 hours</li>
              </ul>
              <p>
                Please include relevant details about your inquiry to help us assist you more effectively.
              </p>
            </section>

            <section className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gold mb-4">Important Notice</h2>
              <p>
                <strong className="text-black">These Terms of Service constitute a legally binding agreement.</strong> If you do not agree to any provision of these Terms, you must discontinue use of our services immediately. We recommend printing or saving a copy of these Terms for your records.
              </p>
              <p className="mt-4 text-sm text-black/50 italic">Last updated: September 17, 2025</p>
              <p className="text-sm text-black/50 italic">Effective date: September 17, 2025</p>
            </section>
          </article>
        </main>
      </div>
    </>
  );
};

export default TermsOfService;