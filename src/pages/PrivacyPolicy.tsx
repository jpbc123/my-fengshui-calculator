import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SplashCursor } from "@/components/ui/splash-cursor";

const PrivacyPolicy = () => {
  return (
    <>
      <SplashCursor />
      <div className="relative min-h-screen bg-white text-black">
        <Header />
        <main className="container mx-auto max-w-4xl py-24 px-4">
          <article className="prose prose-lg mx-auto text-black">
            <h1 className="text-4xl font-bold text-gold mb-6 text-center">Privacy Policy</h1>
            <p className="lead text-black/80">
              Welcome to Feng Shui & Beyond. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gold mt-10 mb-4">1. Information We Collect</h2>
              <p>We only collect the information necessary to provide you with our services. This includes:</p>
              <ul className="list-disc ml-6">
                <li>
                  <strong className="text-black">Personal Information:</strong> We collect your birthdate and time to perform accurate numerology and Feng Shui calculations. This data is used solely for generating your personalized reports and is not stored or associated with your identity after the calculation is complete, unless you create an account (not yet available).
                </li>
                <li>
                  <strong className="text-black">Optional Account Data:</strong> If you choose to create an account, we collect your email address. This is used for account login, password recovery, and to save your reports for future access.
                </li>
                <li>
                  <strong className="text-black">Usage Data:</strong> We automatically collect non-personally identifiable information about your device and how you interact with our website. This includes your IP address, browser type, pages visited, and time spent on each page. This data helps us improve our website's performance and user experience.
                </li>
                <li>
                  <strong className="text-black">Analytics and Tracking:</strong> We use third-party services like Google Analytics to understand website usage patterns. These services may use cookies and similar technologies to collect information about your browsing behavior across our site and other websites.
                </li>
              </ul>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">2. How We Use Your Information</h2>
              <p>Your information is used for the following purposes:</p>
              <ul className="list-disc ml-6">
                <li>
                  <strong className="text-black">To Provide Our Service:</strong> The core function of our site is to provide you with detailed Feng Shui, astrology, and numerology reports. The birth data you enter is used exclusively to generate these reports in real-time.
                </li>
                <li>
                  <strong className="text-black">To Improve Our Website:</strong> We analyze anonymous usage data to understand how our site is being used, identify areas for improvement, and optimize our services.
                </li>
                <li>
                  <strong className="text-black">To Communicate with You:</strong> If you provide us with your email address, we may send you important updates or information about our services. You can always opt out of these communications.
                </li>
                <li>
                  <strong className="text-black">To Personalize Content:</strong> We may use aggregated data to provide more relevant content and recommendations based on popular interests and usage patterns.
                </li>
              </ul>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">3. Affiliate Disclosure</h2>
              <p>
                <strong className="text-black">Amazon Associate Program:</strong> Some links on this site are affiliate links. This means if you click on them and make a purchase, I may earn a small commission — at no extra cost to you. As an Amazon Associate I earn from qualifying purchases.
              </p>
              <p>
                We only recommend products and services that we believe will add value to our users. Our affiliate relationships do not influence our editorial content or recommendations. All opinions expressed are our own, and we maintain editorial independence in our content creation.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">4. Data Security and Retention</h2>
              <p>
                We implement robust security measures to protect your data from unauthorized access, alteration, or destruction. We do not sell, rent, or trade your personal information with third parties. Once your report is generated, your birthdate data is automatically cleared from our system unless you have an active account.
              </p>
              <p>
                <strong className="text-black">Data Retention:</strong> Personal information is only retained as long as necessary to fulfill the purposes outlined in this policy. Usage analytics data may be retained longer for statistical analysis and website improvement purposes.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">5. Third-Party Services</h2>
              <p>
                Our website may use third-party services including but not limited to:
              </p>
              <ul className="list-disc ml-6">
                <li><strong className="text-black">Content Management:</strong> Sanity CMS for managing our articles and content</li>
                <li><strong className="text-black">Analytics:</strong> Google Analytics for website performance tracking</li>
                <li><strong className="text-black">Hosting:</strong> Vercel for website hosting and deployment</li>
                <li><strong className="text-black">Email Services:</strong> For account-related communications (when available)</li>
				<li><strong className="text-black">Content Sources:</strong> Images and visual content on our website are sourced from open-source platforms including Pexels, FlatIcon, Freepik, and other royalty-free resources, properly attributed where required.</li>
				<li><strong className="text-black">Trademark Clarification:</strong> Feng Shui & Beyond operates independently and has no affiliation with any Facebook groups, social media pages, or other entities using similar names. We are a standalone digital service provider.</li>
              </ul>
              <p>
                These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these third-party services.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">6. Cookies and Local Storage</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. Types of cookies we use include:
              </p>
              <ul className="list-disc ml-6">
                <li><strong className="text-black">Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong className="text-black">Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong className="text-black">Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p>
                You have the option to accept or decline cookies through your browser settings. Note that disabling certain cookies may affect website functionality.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">7. Your Choices and Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc ml-6">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to or restrict processing</li>
                <li>The right to data portability</li>
              </ul>
              <p>
                If you have any concerns or wish to exercise these rights, please contact us at <a href="mailto:support@fengshuicalculator.com" className="text-gold underline">support@fengshuicalculator.com</a>.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">8. Children's Privacy</h2>
              <p>
                Our services are not directed toward children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">9. International Users</h2>
              <p>
                If you access our website from outside the United States, please note that certain information may be transferred to, stored, and processed on servers located in the United States. This information may include details such as your IP address, browser type, device information, and pages you visit on our site. By using our services, you consent to this transfer and processing of your information in accordance with our Privacy Policy.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with a new "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>
              <p>
                For significant changes that materially affect your rights, we will provide additional notice through our website or other communication channels.
              </p>
              <p className="mt-8 text-sm text-black/50 italic">Last updated: September 8, 2025</p>
            </section>

            <section className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gold mb-4">Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us through our Contact Page or at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:yfengshuicalculator@gmail.com" className="text-gold underline">myfengshuicalculator@gmail.com</a>
              </p>
            </section>
          </article>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicy;