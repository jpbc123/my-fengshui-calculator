import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // The base path must be '/' for Vercel deployments.
    base: '/',
    server: {
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@root": path.resolve(__dirname, "./"),
      },
    },
    build: {
      sourcemap: false,
      target: 'es2015', // CHANGED: Transpile to ES2015 for Puppeteer compatibility
      minify: "terser",  // CHANGED: Use terser instead of esbuild
      // Ensure proper handling of assets
      assetsDir: "assets",
      // Generate clean URLs
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      // Add terser options
      terserOptions: {
        compress: {
          drop_console: false,
        },
        format: {
          comments: false,
        },
      },
    },
  };
});