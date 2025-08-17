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
        "/api/horoscope": {
          target: "https://astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/horoscope/, "/horoscope"),
          headers: {
            "X-RapidAPI-Key": env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com",
          },
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
