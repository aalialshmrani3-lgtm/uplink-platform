import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "server/**/*.test.tsx", "server/**/*.spec.ts", "client/src/components/MatchingIntelligenceHub.test.tsx", "client/src/components/ApplicationCopilotWorkspace.test.tsx", "client/src/components/CommercializeWorkspace.test.tsx", "client/src/components/NaqlaEngineEntry.test.tsx", "client/src/contexts/LanguageContext.test.tsx"],
  },
});
