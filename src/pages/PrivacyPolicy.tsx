import { Header } from "@/components/Header";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="bg-black text-white min-h-screen pt-28 px-6 md:px-16 lg:px-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gold mb-6">Privacy Policy</h1>

          <p className="mb-4">
            At <strong>My Feng Shui Calculator</strong>, we are committed to protecting your privacy.
            This Privacy Policy explains how your personal information is collected, used,
            and disclosed when you use our website.
          </p>

          <h2 className="text-xl font-semibold text-gold mt-8 mb-2">1. Information We Collect</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>Birthdate and time (used for Feng Shui calculations)</li>
            <li>Email address (optional, for account login or report delivery)</li>
            <li>Device and usage information (for improving your experience)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gold mt-8 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>To generate your personalized Feng Shui report</li>
            <li>To improve site performance and user experience</li>
            <li>To communicate with you about features or offers (only with consent)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gold mt-8 mb-2">3. Data Security</h2>
          <p className="mb-4">
            We use industry-standard methods to protect your personal data. All sensitive calculations
            are handled securely, and we do not sell or share your information with third parties.
          </p>

          <h2 className="text-xl font-semibold text-gold mt-8 mb-2">4. Cookies</h2>
          <p className="mb-4">
            We may use cookies to enhance user experience and collect anonymous site usage statistics.
          </p>

          <h2 className="text-xl font-semibold text-gold mt-8 mb-2">5. Your Choices</h2>
          <p className="mb-4">
            You may opt out of data collection or request your data to be deleted at any time
            by contacting us at{" "}
            <a href="mailto:support@fengshuicalculator.com" className="text-gold underline">
              support@fengshuicalculator.com
            </a>.
          </p>

          <h2 className="text-xl font-semibold text-gold mt-8 mb-2">6. Changes to This Policy</h2>
          <p className="mb-4">
            This Privacy Policy may be updated occasionally. We’ll notify users of any significant changes
            on this page.
          </p>

          <p className="mt-8 text-sm text-gray-400">Last updated: July 23, 2025</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
