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
              Welcome to My Feng Shui Calculator. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website.
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
              </ul>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">2. How We Use Your Information</h2>
              <p>Your information is used for the following purposes:</p>
              <ul className="list-disc ml-6">
                <li>
                  <strong className="text-black">To Provide Our Service:</strong> The core function of our site is to provide you with a detailed Feng Shui report. The birth data you enter is used exclusively to generate this report in real-time.
                </li>
                <li>
                  <strong className="text-black">To Improve Our Website:</strong> We analyze anonymous usage data to understand how our site is being used, identify areas for improvement, and optimize our services.
                </li>
                <li>
                  <strong className="text-black">To Communicate with You:</strong> If you provide us with your email address, we may send you important updates or information about our services. You can always opt out of these communications.
                </li>
              </ul>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">3. Data Security and Retention</h2>
              <p>
                We implement robust security measures to protect your data from unauthorized access, alteration, or destruction. We do not sell, rent, or trade your personal information with third parties. Once your report is generated, your birthdate data is automatically cleared from our system unless you have an active account.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">4. Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You have the option to accept or decline cookies through your browser settings.
              </p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">5. Your Choices and Rights</h2>
              <p>You have the right to access, update, or request the deletion of your personal information. If you have any concerns or wish to exercise these rights, please contact us at <a href="mailto:support@fengshuicalculator.com" className="text-gold underline">support@fengshuicalculator.com</a>.</p>
            </section>
            <hr className="my-10 border-gold/30" />

            <section>
              <h2 className="text-2xl font-semibold text-gold mb-4">6. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with a new "Last updated" date. We encourage you to review this policy periodically to stay informed.
              </p>
              <p className="mt-8 text-sm text-black/50 italic">Last updated: August 26, 2025</p>
            </section>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;