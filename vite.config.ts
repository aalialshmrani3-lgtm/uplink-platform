import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
// Temporarily disable manus runtime to fix React hooks issue
// import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Remove vitePluginManusRuntime temporarily to fix React duplicate issue
const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "wouter",
      "@trpc/client",
      "@trpc/react-query",
      "@tanstack/react-query",
      "framer-motion",
      "recharts",
      "lucide-react",
    ],
  },
  envDir: path.resolve(__dirname),
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client", "public"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Disable code splitting - single bundle to avoid module loading issues
        manualChunks: undefined,
        inlineDynamicImports: true,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 5000, // Increase limit for single bundle
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      clientPort: 3000,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
