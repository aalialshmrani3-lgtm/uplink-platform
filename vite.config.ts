// v2.1 - Single bundle mode: fixes React useLayoutEffect duplication error
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      // Force all React imports to resolve to the SAME instance
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client"),
    },
    dedupe: ["react", "react-dom", "react-dom/client", "scheduler"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "wouter",
      "@trpc/client",
      "@trpc/react-query",
      "@tanstack/react-query",
      "framer-motion",
      "recharts",
      "lucide-react",
    ],
    force: false,
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
      // Ensure React is deduplicated across all chunks
      external: [],
      output: {
        // Single bundle to avoid React duplication across chunks
        manualChunks: undefined,
        inlineDynamicImports: true,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 6000,
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
    watch: {
      ignored: ['**/*'],
      usePolling: false,
    },
  },
});
