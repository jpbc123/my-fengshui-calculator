// src/pages/BirthChart.tsx
import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, Download, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';

import logoImage from '../assets/logo.png';
import birthChart from "../assets/birthchart.jpg";
import birthChartTwo from "../assets/birthchart-two.jpg";
import birthChartThree from "../assets/birthchart-three.jpg";
import purpleStars from "../assets/purple-stars.jpg";

interface FormErrors {
  fullName?: string;
  email?: string;
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
}

interface LocationSuggestion {
  displayName: string;
  coordinates: string;
  lat: number;
  lon: number;
}

const BirthChart = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    gender: ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedLocationDisplay, setSelectedLocationDisplay] = useState('');
  const [orderData, setOrderData] = useState<{orderId: string; timestamp: string} | null>(null);
  
  // Enhanced error handling
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  
  const locationInputRef = useRef<HTMLDivElement>(null);

  const breadcrumbs: Array<{label: string; href?: string}> = [];

  const features = [
    "Complete natal chart calculation",
    "Detailed planetary positions", 
    "House interpretations",
    "Aspect analysis",
    "Life path insights",
    "Career guidance",
    "Relationship compatibility overview",
    "PDF report"
  ];

  // Enhanced form validation
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }
    
    if (!formData.birthTime) {
      newErrors.birthTime = 'Birth time is required';
    }
    
    if (!formData.birthLocation) {
      newErrors.birthLocation = 'Birth location is required';
    }
    
    return newErrors;
  }, [formData]);

  // Enhanced location error handling
  const getLocationErrorMessage = (error: string): string => {
    if (error.includes('coordinates')) {
      return 'Please select a location from the dropdown suggestions';
    }
    if (error.includes('Invalid location format')) {
      return 'Location format not recognized. Try typing your city name.';
    }
    return 'Please check your birth location and try again';
  };

	// Input sanitization - only remove dangerous characters, preserve spaces
	const sanitizeInput = (input: string): string => {
		return input.replace(/[<>]/g, '').slice(0, 255);
	};

  // Improved debounced location search
  const debouncedLocationSearch = useCallback(
    (query: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
		const timeout = setTimeout(() => {
			if (query.length >= 3) {
				searchLocations(query);
			} else {
				setLocationSuggestions([]);
				setShowLocationSuggestions(false);
			}
		}, 300); // Changed from 500 to 300
      
      setSearchTimeout(timeout);
    },
    [] // Removed searchTimeout from dependencies to prevent recreation
  );

  // Enhanced location search with better error handling
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    setIsLoadingLocations(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const locations: LocationSuggestion[] = data.map((item: any) => {
        const parts = [];
        if (item.address?.city || item.address?.town || item.address?.village) {
          parts.push(item.address.city || item.address.town || item.address.village);
        }
        if (item.address?.state) parts.push(item.address.state);
        if (item.address?.country) parts.push(item.address.country);
        
        const displayName = parts.length > 0 ? parts.join(', ') : item.display_name.split(',').slice(0, 3).join(',');
        
        return {
          displayName: displayName,
          coordinates: `${item.lat},${item.lon}`,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        };
      });
      
      const uniqueLocations = locations.filter(location => 
        location.displayName.trim().length > 0 &&
        !isNaN(location.lat) && !isNaN(location.lon)
      );
      
      setLocationSuggestions(uniqueLocations);
      setShowLocationSuggestions(uniqueLocations.length > 0);
      
    } catch (error) {
      console.error('Location search error:', error);
      
      // Fallback locations for common searches
      const fallbackLocations: LocationSuggestion[] = [
        { displayName: 'Kuala Lumpur, Malaysia', coordinates: '3.1390,101.6869', lat: 3.1390, lon: 101.6869 },
        { displayName: 'Manila, Philippines', coordinates: '14.6042,120.9822', lat: 14.6042, lon: 120.9822 },
        { displayName: 'Singapore', coordinates: '1.3521,103.8198', lat: 1.3521, lon: 103.8198 },
        { displayName: 'Jakarta, Indonesia', coordinates: '-6.2088,106.8456', lat: -6.2088, lon: 106.8456 }
      ].filter(location => 
        location.displayName.toLowerCase().includes(query.toLowerCase())
      );
      
      setLocationSuggestions(fallbackLocations);
      setShowLocationSuggestions(fallbackLocations.length > 0);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Enhanced input change handler with sanitization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear field-specific errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Handle location search with debouncing
	if (name === 'birthLocation') {
	// Only search if it's not coordinates (user is typing, not selected)
	if (!sanitizedValue.includes(',') || !selectedLocationDisplay) {
		debouncedLocationSearch(sanitizedValue);
	}
	
	// Clear selected location display if user is typing new location
	if (selectedLocationDisplay && sanitizedValue !== selectedLocationDisplay) {
		setSelectedLocationDisplay('');
		}
	}
  };

  const selectLocation = (locationObj: LocationSuggestion) => {
    setFormData(prev => ({
      ...prev,
      birthLocation: locationObj.coordinates
    }));
    
    setSelectedLocationDisplay(locationObj.displayName);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    
    // Clear location error if it exists
    if (errors.birthLocation) {
      setErrors(prev => ({
        ...prev,
        birthLocation: undefined
      }));
    }
  };

  // Handle clicks outside location suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    if (showLocationSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showLocationSuggestions]);
  
  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Enhanced submit handler with better error handling and progress indication
  const handleSubmit = async () => {
    // Reset previous errors
    setErrors({});
    setSubmitError('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    
    try {
      setProcessingStage('Validating your information...');
      
      // Include both coordinates and display name
      const submitData = {
        ...formData,
        birthLocationDisplay: selectedLocationDisplay
      };

      setProcessingStage('Submitting your birth chart request...');
      
      const response = await fetch('/api/submitBirthChart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProcessingStage('Calculating planetary positions...');
        
        // Store order data for receipt
        setOrderData({
          orderId: result.orderId,
          timestamp: new Date().toISOString()
        });
        
        // Trigger chart calculation
        setProcessingStage('Generating interpretations...');
        
        const calcResponse = await fetch('/api/calculateBirthChart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: result.orderId })
        });
        
        if (!calcResponse.ok) {
          console.warn('Chart calculation request failed, but order was submitted successfully');
        }
        
        setProcessingStage('Creating PDF report...');
        
        setTimeout(() => {
          setCurrentStep(2);
          setProcessingStage('');
        }, 1500);
        
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(
        error instanceof Error 
          ? `Failed to submit: ${error.message}. Please check your information and try again.`
          : 'Failed to generate chart. Please check your information and try again.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  // Enhanced receipt generation function
  const generateReceipt = () => {
    console.log('Receipt generation started');
    
    if (!formData.fullName) {
      alert('Missing form data. Please go through the form process first.');
      return;
    }
    
    try {
      console.log('Creating PDF...');
      const pdf = new jsPDF();
      
      // Add logo
      try {
        pdf.addImage(logoImage, 'PNG', 20, 15, 80, 20);
      } catch (logoError) {
        console.log('Logo not added:', logoError);
      }
      
      // Company info
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Feng Shui & Beyond', 65, 45);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Birth Chart Analysis Receipt', 72, 51);
      
      // Receipt details
      const currentDate = new Date().toLocaleDateString();
      const receiptNumber = `FSB-${Date.now().toString().slice(-8)}`;
      
      pdf.setFontSize(10);
      pdf.text(`Receipt #: ${receiptNumber}`, 20, 65);
      pdf.text(`Date: ${currentDate}`, 20, 69);
      
      if (orderData?.orderId) {
        pdf.text(`Order ID: ${orderData.orderId}`, 20, 73);
      }
      
      // Customer section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Information:', 20, 85);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      let yPos = 95;
      pdf.text(`Name: ${formData.fullName}`, 20, yPos);
      yPos += 7;
      pdf.text(`Email: ${formData.email}`, 20, yPos);
      yPos += 7;
      pdf.text(`Birth Date: ${formData.birthDate}`, 20, yPos);
      yPos += 7;
      pdf.text(`Birth Time: ${formData.birthTime}`, 20, yPos);
      yPos += 7;
      
      // Handle long location text
      const locationText = selectedLocationDisplay || formData.birthLocation;
      if (locationText.length > 60) {
        pdf.text('Birth Location:', 20, yPos);
        yPos += 7;
        const splitLocation = pdf.splitTextToSize(locationText, 150);
        pdf.text(splitLocation, 20, yPos);
        yPos += splitLocation.length * 7;
      } else {
        pdf.text(`Birth Location: ${locationText}`, 20, yPos);
        yPos += 7;
      }
      
      // Service details
      yPos += 10;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Service Details:', 20, yPos);
      
      yPos += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Professional Birth Chart Analysis', 20, yPos);
      yPos += 7;
      pdf.text('Includes: Natal chart wheel, planetary positions, house interpretations,', 20, yPos);
      yPos += 7;
      pdf.text('life guidance, and comprehensive PDF report', 20, yPos);
      
      // Payment section
      yPos += 20;
      pdf.line(20, yPos, 190, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Amount Paid: FREE', 20, yPos);
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment Method: No Payment Required', 20, yPos);
      yPos += 7;
      pdf.text('Status: Completed', 20, yPos);
      
      yPos += 10;
      pdf.line(20, yPos, 190, yPos);
      
      // Footer
      yPos += 15;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Thank you for choosing Feng Shui & Beyond!', 20, yPos);
      yPos += 7;
      pdf.text('Questions? Contact us at hello@fengshuiandbeyond.com', 20, yPos);
      
      // Download
      const fileName = `Receipt_${formData.fullName.replace(/\s+/g, '_')}_${receiptNumber}.pdf`;
      console.log('Saving PDF as:', fileName);
      pdf.save(fileName);
      
      console.log('Receipt generated successfully');
      
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const isFormValid = formData.fullName && formData.email && formData.birthDate && 
                     formData.birthTime && formData.birthLocation;

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      fullName: '',
      email: '',
      birthDate: '',
      birthTime: '',
      birthLocation: '',
      gender: ''
    });
    setSelectedLocationDisplay('');
    setOrderData(null);
    setErrors({});
    setSubmitError('');
  };

  return (
  <>
  <Helmet>
  <title>Birth Chart Calculator - Free Astrological Analysis | Feng Shui & Beyond</title>
  <meta name="description" content="Get your free professional birth chart analysis with AI-powered interpretation. Discover your natal chart, planetary positions, house meanings, life path insights, and relationship compatibility. Instant PDF report delivered to your email." />
  <meta name="keywords" content="birth chart, natal chart, free birth chart, birth chart analysis, astrology birth chart, natal chart reading, birth chart calculator, astrological chart, planetary positions, horoscope chart" />
  <link rel="canonical" href="https://fengshuiandbeyond.com/birth-chart" />
  
  <meta property="og:title" content="Free Birth Chart Analysis - Professional Natal Chart Reading" />
  <meta property="og:description" content="Get your free AI-powered birth chart analysis with detailed interpretations delivered instantly." />
  <meta property="og:url" content="https://fengshuiandbeyond.com/birth-chart" />
  <meta property="og:type" content="website" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Free Birth Chart Calculator" />
  <meta name="twitter:description" content="Get your complete astrological birth chart with detailed analysis." />
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Birth Chart Analysis",
      "description": "Professional birth chart analysis service with AI-powered interpretation",
      "provider": {
        "@type": "Organization",
        "name": "Feng Shui & Beyond"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}
  </script>
</Helmet>
  
  
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl mt-20">
        <Breadcrumb items={breadcrumbs} />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* HERO SECTION WITH BACKGROUND IMAGE */}
              <div className="relative text-center mb-12 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 z-0">
                  <img src={birthChart}
                    alt="Birth natal chart background"
                    className="w-full h-full"
                  />
                  <div className="absolute"></div>
                </div>
                
                <div className="relative z-10 py-16 px-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-4">
                    Free Birth Chart Calculator - Detailed Astrological Analysis
                  </h1>
                  <div className="text-3xl font-bold text-purple-600 mb-6"></div>
                  
                  <p className="text-xl text-white max-w-2xl mx-auto mb-8 font-medium">
                    Looking to understand your unique cosmic blueprint? While getting your birth chart is simple, decoding it is another story. Our AI-powered personalized analysis goes beyond the basics to help you discover your strengths, hidden weaknesses, biggest fears, and more, all based on your unique birth chart.
                  </p>
                </div>
              </div>

              {/* INFORMATION CARDS WITH IMAGES */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="mb-4">
                    <img src={birthChartTwo}
                      alt="Astrological birth chart wheel"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">What is a Birth Chart?</h2>
                  <p className="text-gray-700 text-sm">
                    Your birth chart is a cosmic map of the planets at the exact moment you were born, revealing your unique personality, hidden strengths, and life's purpose. It's an astrological blueprint of your soul.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="mb-4">
                    <img 
                      src={birthChartThree}
                      alt="Telescope pointing at starry sky"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Why You Need Birth Time, Place, and Location</h3>
                  <p className="text-gray-700 text-sm">
                    To calculate your birth chart accurately, you need three key pieces of information: your birth date, time, and location. Without these details, the planetary placements, especially the most important ones, will be inaccurate.
                  </p>
                </div>
              </div>
			  
{/* NEW SECTION: Relationship-Focused CTA */}
<div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-xl p-8 mb-12 border border-rose-200">
  <div className="text-center max-w-4xl mx-auto">
    <h2 className="text-xl font-semibold text-purple-800 mb-4">
      Finally Understand Why Your Partner Does What They Do
    </h2>
    <p className="text-gray-700 text-sm leading-relaxed mb-6">
      Stop guessing what makes your loved ones tick. Whether it's understanding why your partner needs space after social events, why your friend always seems to worry about everything, or why certain family dynamics feel so challenging - their birth chart holds the answers. Get your chart first, then create one for everyone important in your life.
    </p>
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-purple-700 mb-2">Your Romantic Partner</h4>
        <p className="text-sm text-gray-600">Discover their love language, communication style, and what they truly need from you</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-purple-700 mb-2">Family Members</h4>
        <p className="text-sm text-gray-600">Understand parent-child dynamics, sibling relationships, and family patterns</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-purple-700 mb-2">Close Friends</h4>
        <p className="text-sm text-gray-600">Learn why you connect so naturally and how to support each other better</p>
      </div>
    </div>
    <p className="text-purple-600 font-medium mt-6">Start with your own chart below, then generate charts for your loved ones</p>
  </div>
</div>

              {/* Steps and Form */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {[1, 2].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > step ? <Check size={20} /> : step}
                      </div>
                      {step < 2 && (
                        <div className={`w-16 h-1 mx-2 ${
                          currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Card className="border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    {currentStep === 1 && "Enter Your Information"}
                    {currentStep === 2 && "Your Chart is Ready!"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Form content */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      {/* Show general submit error */}
                      {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-700 text-sm">{submitError}</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-yellow mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-black ${
                              errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.fullName && (
                            <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-yellow mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-black ${
                              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="your@email.com"
                          />
                          {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-yellow mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Birth Date *
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            min="1900-01-01"
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black ${
                              errors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {errors.birthDate && (
                            <p className="text-red-600 text-xs mt-1">{errors.birthDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-yellow mb-2">
                            <Clock className="inline w-4 h-4 mr-1" />
                            Time of Birth *
                            <div className="inline-block relative ml-2 group">
                              <div className="w-4 h-4 bg-purple-500 text-white rounded-full text-xs inline-flex items-center justify-center cursor-help">
                                ?
                              </div>
                              <div className="absolute left-0 top-6 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                If you don't know your exact birth time, 12:00 PM (noon) is commonly used as a default by astrologers. This may make some interpretations less precise.
                                <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-800 rotate-45"></div>
                              </div>
                            </div>
                          </label>
                          <input
                            type="time"
                            name="birthTime"
                            value={formData.birthTime}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black ${
                              errors.birthTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {errors.birthTime && (
                            <p className="text-red-600 text-xs mt-1">{errors.birthTime}</p>
                          )}
                          {!formData.birthTime && (
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, birthTime: '12:00'})}
                              className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
                            >
                              Click here to use 12:00 PM (noon) as default
                            </button>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.birthTime === '12:00' ? 
                              'Using 12:00 PM default time - some interpretations may be less precise' :
                              'Exact time is crucial for accuracy'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="relative" ref={locationInputRef}>
                        <label className="block text-sm font-medium text-yellow mb-2">
                          <MapPin className="inline w-4 h-4 mr-1" />
                          Birth Location *
                        </label>
                        <input
                           type="text"
						   name="birthLocation"
						   value={selectedLocationDisplay || (formData.birthLocation.includes(',') ? '' : formData.birthLocation)}
						   onChange={handleInputChange}
                          onFocus={() => {
                            if (locationSuggestions.length > 0) {
                              setShowLocationSuggestions(true);
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-black ${
                            errors.birthLocation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Start typing your city... (e.g., Kuala Lumpur)"
                          autoComplete="off"
                        />
                        {errors.birthLocation && (
                          <p className="text-red-600 text-xs mt-1">{getLocationErrorMessage(errors.birthLocation)}</p>
                        )}
                        
                        {isLoadingLocations && (
                          <div className="absolute right-3 top-11 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                          </div>
                        )}
                        
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {locationSuggestions.map((locationObj, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectLocation(locationObj)}
                                className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors text-black"
                              >
                                <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
                                {locationObj.displayName}
                                <span className="text-xs text-gray-500 block ml-6">
                                  Coordinates: {locationObj.coordinates}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-yellow mb-2">
                          Gender (Optional)
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                        >
                          <option value="">Prefer not to say</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isProcessing}
                        className={`w-full py-4 rounded-lg font-semibold transition-all ${
                          isFormValid && !isProcessing
                            ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            {processingStage || 'Generating Your Chart...'}
                          </div>
                        ) : (
                          <>
                            Generate My Birth Chart <ArrowRight className="inline ml-2 w-5 h-5" />
                          </>
                        )}
                      </button>
                      
                      <p className="text-sm text-gray-500 text-center">
                        Your chart will be delivered via email within 5-10 minutes
                      </p>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-green-600">
                        Chart Generation Successful!
                      </h3>
                      <p className="text-gray-600">
                        Your birth chart analysis is being prepared. You'll receive your detailed 
                        PDF report at <span className="font-semibold">{formData.email}</span> within 5-10 minutes.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-black">What happens next?</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Our AI system will calculate your precise birth chart instantly</li>
                          <li>• A detailed personalized report will be generated</li>
                          <li>• You'll receive it via email within 5-10 minutes</li>
                          <li>• Check your spam folder if you don't see it</li>
                        </ul>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button 
                          onClick={generateReceipt}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                          <Download className="inline mr-2 w-5 h-5" />
                          Download Receipt
                        </button>

                        <button 
                          onClick={resetForm}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                          Generate Another Chart
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ENHANCED SIDEBAR WITH IMAGES */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
              <CardHeader className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="absolute inset-0 opacity-20">
                  <img src={purpleStars}
                          alt="Galaxy background"
                          className="w-full h-full object-cover"
                        />
                </div>
                <CardTitle className="text-xl text-yellow relative z-10">What You'll Receive</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-4 bg-purple-50 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-20">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-2xl font-bold text-purple-600">FREE</div>
                    <div className="text-sm text-gray-600">For a limited time only</div>
                    <div className="text-xs text-gray-500 mt-1">Complete birth chart analysis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* REPLACED: Why We're the Most Accurate Section */}
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
              <CardHeader className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="absolute inset-0 opacity-20">
                  <img src={purpleStars}
                    alt="Galaxy background"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl text-yellow relative z-10">Why We're the Most Accurate</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2 text-purple-600">AI-Powered Precision</h4>
                    <p className="text-gray-300 text-sm">
                      Our advanced AI system combines authentic astrological techniques with precise astronomical calculations 
                      for personalized, accurate analysis.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-semibold mb-2 text-purple-600">Real-Time Accuracy</h4>
                    <p className="text-gray-300 text-sm">
                      Unlike generic templates, each report uses real astronomical data for your exact birth moment and location.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-semibold mb-2 text-purple-600">Clear & Insightful</h4>
                    <p className="text-gray-300 text-sm">
                      Our reports balance astrological depth with approachable guidance that resonates and empowers you.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 text-center">
                    Experience professional birth chart analysis at no cost
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
	</>
  );
};

export default BirthChart;