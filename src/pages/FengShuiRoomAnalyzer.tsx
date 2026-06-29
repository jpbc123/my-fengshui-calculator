import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from '@/lib/helmet-shim';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Upload, Camera, RotateCcw, Sparkles, ArrowRight, Loader2, X, CheckCircle2 } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ANALYSIS_MODEL = 'gemini-2.0-flash';
const IMAGE_GEN_MODEL = 'gemini-2.0-flash-exp-image-generation';

interface FengShuiChange {
  title: string;
  description: string;
  principle: string;
}

interface AnalysisResult {
  overview: string;
  changes: FengShuiChange[];
  tips: string[];
}

const ROOM_TYPES = [
  { value: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { value: 'living-room', label: 'Living Room', icon: '🛋️' },
  { value: 'home-office', label: 'Home Office', icon: '💻' },
  { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'dining-room', label: 'Dining Room', icon: '🍽️' },
  { value: 'bathroom', label: 'Bathroom', icon: '🛁' },
];

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Feng Shui', href: '/feng-shui' },
  { label: 'Room Analyzer', href: '/feng-shui/room-analyzer' },
];

async function compressImage(file: File, maxWidth = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extractBase64(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URL');
  return { mimeType: match[1], data: match[2] };
}

async function analyzeRoom(imageDataUrl: string, roomType: string): Promise<AnalysisResult> {
  const { mimeType, data } = extractBase64(imageDataUrl);

  const prompt = `You are a professional Feng Shui consultant. Analyze this ${roomType} photo and provide specific, actionable Feng Shui improvements.

Consider these principles:
- Commanding position (bed, desk, or stove placement)
- Five elements balance (wood, fire, earth, metal, water)
- Chi (energy) flow and clutter
- Yin/Yang balance
- Bagua map alignment
- Natural light and ventilation
- Color harmony
- Mirror placement
- Plant and nature element placement

Return your analysis as valid JSON (no markdown, no code blocks) with this structure:
{
  "overview": "A 2-3 sentence overall assessment of the room's current feng shui energy",
  "changes": [
    {
      "title": "Short title of the change",
      "description": "Detailed description of what to change and how",
      "principle": "The feng shui principle behind this change"
    }
  ],
  "tips": ["Additional quick tip 1", "Additional quick tip 2"]
}

Provide 4-6 specific changes and 2-3 tips. Be specific to what you see in the photo.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${ANALYSIS_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data } },
          ],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Analysis failed: ${err}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No analysis returned');

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

async function generateFengShuiRoom(
  imageDataUrl: string,
  roomType: string,
  analysis: AnalysisResult
): Promise<string> {
  const { mimeType, data } = extractBase64(imageDataUrl);

  const changesDescription = analysis.changes
    .map((c, i) => `${i + 1}. ${c.title}: ${c.description}`)
    .join('\n');

  const prompt = `You are a professional interior designer specializing in Feng Shui. Based on this ${roomType} photo, generate a redesigned version of the SAME room with these Feng Shui improvements applied:

${changesDescription}

IMPORTANT INSTRUCTIONS:
- Keep the same room shape, size, and perspective/angle
- Apply the feng shui changes listed above
- Rearrange furniture positions as recommended
- Add plants, decor elements, or natural materials where suggested
- Improve lighting and color balance
- Make the space feel harmonious, balanced, and inviting
- Keep it realistic and achievable — this should look like a real redesigned room
- Maintain the same general style but elevated with feng shui principles

Generate the redesigned room image.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_GEN_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data } },
          ],
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Image generation failed: ${err}`);
  }

  const result = await response.json();
  const parts = result.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('No image generated');

  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('No image found in response');
}

const FengShuiRoomAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState('bedroom');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stage, setStage] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be under 20MB');
      return;
    }
    setError(null);
    setAnalysis(null);
    setGeneratedImage(null);
    const compressed = await compressImage(file);
    setSelectedImage(compressed);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setGeneratedImage(null);

    try {
      setStage('Analyzing your room\'s feng shui energy...');
      const analysisResult = await analyzeRoom(selectedImage, roomType);
      setAnalysis(analysisResult);

      setStage('Reimagining your space with feng shui principles...');
      const image = await generateFengShuiRoom(selectedImage, roomType, analysisResult);
      setGeneratedImage(image);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setStage('');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setGeneratedImage(null);
    setError(null);
    setStage('');
    setRoomType('bedroom');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Helmet>
        <title>Feng Shui Room Analyzer - AI Room Redesign | Feng Shui & Beyond</title>
        <meta name="description" content="Upload a photo of your room and let AI analyze and redesign it using authentic Feng Shui principles. See before and after transformations with detailed explanations." />
        <meta name="keywords" content="feng shui room analyzer, ai room design, feng shui bedroom, feng shui office, room layout feng shui, feng shui tips" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/feng-shui/room-analyzer" />
        <meta property="og:title" content="Feng Shui Room Analyzer - AI-Powered Room Redesign" />
        <meta property="og:description" content="Upload a photo of your room and get an AI-powered Feng Shui makeover with before/after comparison." />
        <meta property="og:url" content="https://fengshuiandbeyond.com/feng-shui/room-analyzer" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl mt-20">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Feng Shui Room Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of any room and our AI will analyze the feng shui energy,
            then show you a redesigned version with improvements — complete with explanations.
          </p>
        </motion.div>

        {/* Upload Section */}
        {!isAnalyzing && !analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 border-2 border-dashed border-gray-200 hover:border-amber-300 transition-colors">
              <CardContent className="p-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />

                {!selectedImage ? (
                  <div
                    className={`flex flex-col items-center justify-center py-12 rounded-lg cursor-pointer transition-colors ${
                      isDragOver ? 'bg-amber-50' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-amber-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      Drop your room photo here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse (JPG, PNG — max 20MB)
                    </p>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" /> Choose Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Uploaded room"
                        className="w-full max-h-[400px] object-contain rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Room Type Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What type of room is this?
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {ROOM_TYPES.map((room) => (
                          <button
                            key={room.value}
                            onClick={() => setRoomType(room.value)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-sm ${
                              roomType === room.value
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            <span className="text-xl">{room.icon}</span>
                            <span className="font-medium">{room.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Analyze Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleAnalyze}
                        className="gap-2 px-8 py-3 text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                        size="lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        Analyze & Redesign My Room
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                </div>
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-amber-300"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-lg font-medium text-gray-700">{stage}</p>
              <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Analysis Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                    onClick={() => { setError(null); setIsAnalyzing(false); }}
                  >
                    <RotateCcw className="w-3 h-3" /> Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {analysis && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overview */}
            <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Feng Shui Assessment
                </h2>
                <p className="text-gray-700 leading-relaxed">{analysis.overview}</p>
              </CardContent>
            </Card>

            {/* Before / After */}
            {generatedImage && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Before & After
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 text-center">
                      Before
                    </p>
                    <div className="rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                      <img
                        src={selectedImage!}
                        alt="Original room"
                        className="w-full h-[300px] md:h-[350px] object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2 text-center">
                      After — Feng Shui Optimized
                    </p>
                    <div className="rounded-xl overflow-hidden border-2 border-amber-300 bg-amber-50">
                      <img
                        src={generatedImage}
                        alt="Feng shui redesigned room"
                        className="w-full h-[300px] md:h-[350px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Changes */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What We Changed & Why
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {analysis.changes.map((change, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{change.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{change.description}</p>
                            <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                              {change.principle}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {analysis.tips.length > 0 && (
              <Card className="mb-8 bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
                  <ul className="space-y-2">
                    {analysis.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Try Again */}
            <div className="flex justify-center pb-8">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze Another Room
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FengShuiRoomAnalyzer;
