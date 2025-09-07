import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // The base path is now always the root
    base: '/',
    server: {
      port: 8080,
      proxy: {
        // Daily Wisdom API
        "/api/daily-wisdom": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        // Chinese Horoscope API
        "/api/chinese-horoscope": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        // Western Horoscope API
        "/api/western-horoscope": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        // Daily Feng Shui Tip API
        "/api/daily-fengshui-tip": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        // Planetary Overview API
        "/api/planetary-overview": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        // Contact Us Form API
        "/api/contact": {
          target: "http://localhost:3001",
          changeOrigin: true,
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
	build: {
      sourcemap: false, // 🚫 disables source maps in production
      minify: "esbuild", // or "terser" if you need advanced minification
	},
  };
});
```
eof

### Final Steps to a Live Site

1.  **Save** the `vite.config.ts` file with the corrected code.
2.  Open your terminal, commit the change, and push it to GitHub.

    ```bash
    git add vite.config.ts
    git commit -m "Fix base path for Vercel deployment"
    git push
    
