import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    // Increase chunk warning limit slightly
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor libs into separate cacheable chunks
        manualChunks: {
          "vendor-react":    ["react", "react-dom", "react-router-dom"],
          "vendor-motion":   ["framer-motion"],
          "vendor-query":    ["@tanstack/react-query"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-ui":       ["lucide-react"],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify with esbuild (default, fastest)
    minify: "esbuild",
    // Generate source maps only in dev
    sourcemap: mode === "development",
    // Target modern browsers to reduce polyfill bloat
    target: "es2020",
  },
}));
