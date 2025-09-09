export default function handler(req, res) {
  const { zodiac } = req.query;
  res.json({ 
    message: `Chinese horoscope for ${zodiac}`,
    timestamp: new Date().toISOString()
  });
}