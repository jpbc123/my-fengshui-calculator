// src/data/westernZodiacData.ts
export interface WesternZodiacInfo {
  name: string;
  dateRange: string;
  traits: string[];
  yearAnalysis: string;
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  careerAdvice: string;
  personalityInsights: string;
}

export const westernZodiacData: Record<string, WesternZodiacInfo> = {
  Aries: {
    name: "Aries",
    dateRange: "March 21 - April 19",
    traits: ["Energetic", "Confident", "Adventurous", "Impulsive"],
    yearAnalysis: "2025 brings new opportunities for growth and leadership. Take bold steps but avoid impulsive decisions.",
    compatibility: ["Leo", "Sagittarius", "Gemini"],
    luckyNumbers: [1, 9, 18],
    luckyColors: ["Red", "Scarlet"],
    careerAdvice: "Great year for entrepreneurial ventures and leadership roles.",
    personalityInsights: "Aries are pioneers, driven by passion and determination. They thrive in dynamic environments."
  },
  Taurus: {
    name: "Taurus",
    dateRange: "April 20 - May 20",
    traits: ["Patient", "Reliable", "Practical", "Loyal"],
    yearAnalysis: "A year of steady progress and financial stability. Focus on building long-term plans.",
    compatibility: ["Virgo", "Capricorn", "Cancer"],
    luckyNumbers: [2, 6, 11],
    luckyColors: ["Green", "Pink"],
    careerAdvice: "Best suited for careers that value persistence and attention to detail.",
    personalityInsights: "Taurus individuals are dependable and value security, both emotional and financial."
  },
  Gemini: {
    name: "Gemini",
    dateRange: "May 21 - June 20",
    traits: ["Adaptable", "Outgoing", "Curious", "Witty"],
    yearAnalysis: "Expect changes in career and relationships. Communication will be your strongest asset.",
    compatibility: ["Libra", "Aquarius", "Aries"],
    luckyNumbers: [3, 5, 12],
    luckyColors: ["Yellow", "Light Blue"],
    careerAdvice: "Careers involving communication, travel, or technology will thrive.",
    personalityInsights: "Geminis are versatile and thrive on variety, always seeking new experiences."
  },
  Cancer: {
    name: "Cancer",
    dateRange: "June 21 - July 22",
    traits: ["Nurturing", "Loyal", "Protective", "Intuitive"],
    yearAnalysis: "Family and home life take center stage this year. Emotional bonds strengthen.",
    compatibility: ["Scorpio", "Pisces", "Taurus"],
    luckyNumbers: [2, 7, 16],
    luckyColors: ["Silver", "White"],
    careerAdvice: "Great year for careers in caregiving, counseling, or hospitality.",
    personalityInsights: "Cancers are deeply intuitive and value close relationships, often putting others before themselves."
  },
  Leo: {
    name: "Leo",
    dateRange: "July 23 - August 22",
    traits: ["Confident", "Generous", "Ambitious", "Charismatic"],
    yearAnalysis: "Opportunities for recognition and personal achievement are abundant in 2025.",
    compatibility: ["Aries", "Sagittarius", "Libra"],
    luckyNumbers: [1, 4, 19],
    luckyColors: ["Gold", "Orange"],
    careerAdvice: "Best for leadership and creative industries.",
    personalityInsights: "Leos are natural leaders with a flair for the dramatic and a generous spirit."
  },
  Virgo: {
    name: "Virgo",
    dateRange: "August 23 - September 22",
    traits: ["Practical", "Analytical", "Reliable", "Modest"],
    yearAnalysis: "Focus on health and personal development. Attention to detail pays off.",
    compatibility: ["Taurus", "Capricorn", "Cancer"],
    luckyNumbers: [5, 14, 23],
    luckyColors: ["Brown", "Green"],
    careerAdvice: "Excellent year for analytical and service-oriented professions.",
    personalityInsights: "Virgos value precision and are always willing to help others with practical solutions."
  },
  Libra: {
    name: "Libra",
    dateRange: "September 23 - October 22",
    traits: ["Diplomatic", "Charming", "Fair-minded", "Romantic"],
    yearAnalysis: "Relationships and partnerships will flourish. Seek balance in all areas of life.",
    compatibility: ["Gemini", "Aquarius", "Leo"],
    luckyNumbers: [6, 15, 24],
    luckyColors: ["Blue", "Pink"],
    careerAdvice: "Ideal for roles involving mediation, art, or public relations.",
    personalityInsights: "Libras strive for harmony and are skilled at bringing people together."
  },
  Scorpio: {
    name: "Scorpio",
    dateRange: "October 23 - November 21",
    traits: ["Passionate", "Resourceful", "Determined", "Mysterious"],
    yearAnalysis: "Transformation and personal growth dominate 2025. Let go of what no longer serves you.",
    compatibility: ["Cancer", "Pisces", "Virgo"],
    luckyNumbers: [8, 11, 21],
    luckyColors: ["Black", "Maroon"],
    careerAdvice: "Suited for investigative or transformative professions.",
    personalityInsights: "Scorpios are intense and driven, with a magnetic presence."
  },
  Sagittarius: {
    name: "Sagittarius",
    dateRange: "November 22 - December 21",
    traits: ["Optimistic", "Independent", "Adventurous", "Philosophical"],
    yearAnalysis: "Travel, learning, and personal expansion are highlighted.",
    compatibility: ["Aries", "Leo", "Aquarius"],
    luckyNumbers: [3, 7, 9],
    luckyColors: ["Purple", "Blue"],
    careerAdvice: "Perfect for travel, education, or philosophy-related careers.",
    personalityInsights: "Sagittarians seek truth and freedom, often chasing new horizons."
  },
  Capricorn: {
    name: "Capricorn",
    dateRange: "December 22 - January 19",
    traits: ["Ambitious", "Disciplined", "Patient", "Responsible"],
    yearAnalysis: "A year for career advancement and achieving long-term goals.",
    compatibility: ["Taurus", "Virgo", "Pisces"],
    luckyNumbers: [4, 8, 22],
    luckyColors: ["Black", "Dark Green"],
    careerAdvice: "Thrives in structured environments and leadership roles.",
    personalityInsights: "Capricorns are hardworking and value tradition and stability."
  },
  Aquarius: {
    name: "Aquarius",
    dateRange: "January 20 - February 18",
    traits: ["Innovative", "Independent", "Humanitarian", "Quirky"],
    yearAnalysis: "Innovation and collaboration bring success this year.",
    compatibility: ["Gemini", "Libra", "Sagittarius"],
    luckyNumbers: [4, 7, 11],
    luckyColors: ["Blue", "Turquoise"],
    careerAdvice: "Best for technology, science, and humanitarian fields.",
    personalityInsights: "Aquarians are forward-thinkers who embrace individuality and social progress."
  },
  Pisces: {
    name: "Pisces",
    dateRange: "February 19 - March 20",
    traits: ["Compassionate", "Artistic", "Intuitive", "Dreamy"],
    yearAnalysis: "Creativity and emotional growth are your focus in 2025.",
    compatibility: ["Cancer", "Scorpio", "Capricorn"],
    luckyNumbers: [2, 9, 12],
    luckyColors: ["Sea Green", "Lavender"],
    careerAdvice: "Ideal for artistic, healing, or spiritual professions.",
    personalityInsights: "Pisces are empathetic dreamers, often deeply connected to the arts and spirituality."
  }
};
