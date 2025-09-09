export default function handler(req, res) {
  res.json({ 
    message: "API test works", 
    timestamp: new Date().toISOString(),
    query: req.query 
  });
}