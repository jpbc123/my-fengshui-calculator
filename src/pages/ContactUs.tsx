import React, { useEffect, useState } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarsBackground } from "@/components/starsBackground";

const MAX_MESSAGE_LENGTH = 255;

export default function ContactUs() {
  const [formData, setFormData] = useState({
    subject: "",
    name: "",
    email: "",
    confirmEmail: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [emailMatchError, setEmailMatchError] = useState(null);
  const [messageLengthError, setMessageLengthError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) {
      setMessageLengthError("Message must not exceed 255 characters.");
    } else {
      setMessageLengthError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email !== formData.confirmEmail) {
      setEmailMatchError("Emails do not match.");
      return;
    } else {
      setEmailMatchError(null); // Clear the error if they now match
    }

    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      setMessageLengthError("Message must not exceed 255 characters.");
      return;
    }

    setStatus("loading");

    try {
      // Send form data to the new server endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form.');
      }

      // If the request was successful
      setStatus("success");
      setFormData({
        subject: "",
        name: "",
        email: "",
        confirmEmail: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  return (
    <StarsBackground
      className="min-h-screen"
      starColor="#FFD700"
      speed={60}
      factor={0.03}
    >
      <div className="text-white min-h-screen flex flex-col mt-2 font-inter relative z-10">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="max-w-xl w-full mt-4">

            <div className="bg-black/80 backdrop-blur-sm p-6 md:p-12 shadow-2xl rounded-lg text-left w-full max-w-2xl mx-auto border border-gray-600">
              <h2 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-4 animate-pulse text-center">Talk to Us</h2>
              <p className="text-gray-300 mb-6 text-center">
                Send us a message and we'll get back to you as soon as we can.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-200">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-500 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-800/50 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-500 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-800/50 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="confirmEmail" className="block text-sm font-medium mb-1 text-gray-200">
                    Confirm Email
                  </label>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-500 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-800/50 text-white placeholder-gray-400"
                  />
                  {emailMatchError && (
                    <p className="text-red-400 text-sm mt-1">{emailMatchError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-200">
                    Subject (optional)
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-500 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-800/50 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-200">
                    Type your message here...
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-500 focus:border-yellow-400 focus:ring-yellow-400 bg-gray-800/50 text-white placeholder-gray-400"
                  />
                  <p className="text-right text-gray-400 text-sm mt-1">
                    {formData.message.length} / {MAX_MESSAGE_LENGTH}
                  </p>
                  {messageLengthError && (
                    <p className="text-red-400 text-sm mt-1">{messageLengthError}</p>
                  )}
                </div>

                {/* reCAPTCHA Placeholder */}
                <div className="flex justify-center pt-2">
                  <div className="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY"></div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black w-full font-semibold"
                    disabled={status === "loading" || !!emailMatchError || !!messageLengthError}
                  >
                    {status === "loading" ? "Submitting..." : "Submit"}
                  </Button>
                </div>

                {status === "success" && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-green-400 pt-2 text-center sm:text-left">
                    <span>Thanks! Our team will review your message and get back to you as soon as we can.</span>
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 animate-bounce" />
                  </div>
                )}

                {status === "error" && (
                  <p className="text-red-400 pt-2 text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </StarsBackground>
  );
}
