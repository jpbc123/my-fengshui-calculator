// utils/cacheUtils.js
// Smart caching utility for daily content

export const getCacheKey = (type, date) => {
  return `${type}_${date}`;
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Smart cleanup - only removes yesterday's cache, keeps today's
export const cleanupOldCache = (type) => {
  const today = getCurrentDate();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Clean up yesterday's cache for this type
  const yesterdayKey = getCacheKey(type, yesterday);
  localStorage.removeItem(yesterdayKey);
  
  // Optional: Clean up any cache older than yesterday
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${type}_`)) {
      const match = key.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const cacheDate = match[1];
        if (cacheDate < yesterday) {
          localStorage.removeItem(key);
        }
      }
    }
  });
};

export const getCachedData = (type, date) => {
  const cacheKey = getCacheKey(type, date);
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.error('Error parsing cached data:', error);
      localStorage.removeItem(cacheKey);
    }
  }
  return null;
};

export const setCachedData = (type, date, data) => {
  const cacheKey = getCacheKey(type, date);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

// Usage example for your components:
export const fetchDailyContent = async (type, apiUrl, date = getCurrentDate()) => {
  // Clean up old cache first
  cleanupOldCache(type);
  
  // Check for today's cached data
  const cached = getCachedData(type, date);
  if (cached) {
    console.log(`Using cached ${type} for ${date}`);
    return cached;
  }
  
  // Fetch fresh data
  try {
    const response = await fetch(`${apiUrl}?date=${date}`);
    const data = await response.json();
    
    // Cache the response
    setCachedData(type, date, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

// Specific helper functions for each content type
export const fetchFengShuiTip = (date) => 
  fetchDailyContent('fengshuiTip', '/api/daily-fengshui-tip', date);

export const fetchPlanetaryOverview = (date) => 
  fetchDailyContent('planetaryOverview', '/api/planetary-overview', date);

export const fetchDailyWisdom = (date) => 
  fetchDailyContent('dailyWisdom', '/api/daily-wisdom', date);