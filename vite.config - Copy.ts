// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Vite mode:", mode);
  console.log("Loaded RapidAPI Key:", env.VITE_RAPIDAPI_KEY);

  return {
    base: mode === "production" ? "/my-fengshui-calculator/" : "/",
    server: {
      port: 8080,
      proxy: {
        // Existing proxy for the Horoscope API
        "/api/horoscope": {
          target: "https://astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/horoscope/, "/horoscope"),
          headers: {
            "X-RapidAPI-Key": env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com",
          },
        },
        // Proxy for the Daily Wisdom API
        "/api/daily-wisdom": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/daily-wisdom/, "/api/daily-wisdom"),
        },
        // NEW proxy for the Chinese Horoscope API
        // This rule will match paths like /api/chinese-horoscope/rat, /api/chinese-horoscope/ox, etc.
        "/api/chinese-horoscope": { 
            target: "http://localhost:3001", // Your Node.js backend server
            changeOrigin: true,
            // The rewrite rule ensures the path remains /api/chinese-horoscope/:zodiac on the backend
            rewrite: (path) => path.replace(/^\/api\/chinese-horoscope/, "/api/chinese-horoscope"),
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});