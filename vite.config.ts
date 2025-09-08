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
      },
    },
    build: {
      sourcemap: false,
      minify: "esbuild",
    },
  };
});
