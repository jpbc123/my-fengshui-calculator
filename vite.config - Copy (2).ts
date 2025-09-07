// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: mode === "production" ? "/my-fengshui-calculator/" : "/",
    server: {
      port: 8080,
      proxy: {

        // Proxy for the Daily Wisdom API (your Node.js backend)
        "/api/daily-wisdom": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/daily-wisdom/, "/api/daily-wisdom"),
        },
        // Proxy for the Chinese Horoscope API (your Node.js backend)
        "/api/chinese-horoscope": { 
            target: "http://localhost:3001", // Your Node.js backend server
            changeOrigin: true,
            // The rewrite rule ensures the path remains /api/chinese-horoscope/:zodiac on the backend
            rewrite: (path) => path.replace(/^\/api\/chinese-horoscope/, "/api/chinese-horoscope"),
        },
        // NEW Proxy for the Western Horoscope API (your Node.js backend)
        "/api/western-horoscope": {
          target: "http://localhost:3001", // Your Node.js backend server
          changeOrigin: true,
          // No rewrite needed here, as the client-side URL matches the backend endpoint exactly
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
		"~": path.resolve(__dirname, "./src"),
      },
    },
  };
});