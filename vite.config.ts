import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
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
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
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
    minify: "esbuild",
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        format: "es",
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('wouter')) {
              return 'vendor-react';
            }
            if (id.includes('@trpc') || id.includes('@tanstack')) {
              return 'vendor-trpc';
            }
            if (id.includes('recharts') || id.includes('chart.js') || id.includes('react-chartjs')) {
              return 'vendor-charts';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('sonner')) {
              return 'vendor-ui';
            }
            return 'vendor-misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 6000,
  },
  server: {
    host: "0.0.0.0",
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
      protocol: "ws",
      host: "localhost",
      port: 3000,
      clientPort: 3000,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    watch: {
      ignored: ["**/*"],
      usePolling: false,
    },
  },
});
