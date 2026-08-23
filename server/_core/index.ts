import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initWebSocketServer } from "../websocket";
import publicApiRouter from "../public_api";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export type CreateAppOptions = {
  /** Test harnesses can omit Vite/static mounting while keeping the real API composition. */
  serveFrontend?: boolean;
};

export async function createApp({ serveFrontend = true }: CreateAppOptions = {}) {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Public API (requires API key)
  app.use("/api/public/v1", publicApiRouter);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Development uses Vite and production uses static files. The API-only branch is
  // intentionally opt-in for isolated NODE_ENV=test harnesses.
  if (serveFrontend) {
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  }
  return { app, server };
}

async function startServer() {
  const { server } = await createApp();

  const preferredPort = parseInt(process.env.PORT || "3000", 10);
  const isDevelopment = process.env.NODE_ENV === "development";
  const port = isDevelopment ? await findAvailablePort(preferredPort) : preferredPort;

  if (isDevelopment && port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Initialize WebSocket server (only in development)
  if (process.env.NODE_ENV === "development") {
    initWebSocketServer(server);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Runtime mode=${process.env.NODE_ENV || "production"}; requested PORT=${preferredPort}; bound PORT=${port}`);
    if (isDevelopment) {
      console.log(`WebSocket server running on ws://localhost:${port}/ws`);
    }
  });
}

// Vitest can preserve a development NODE_ENV from the parent process, so honour
// its explicit runtime marker as well as NODE_ENV when this module is imported.
if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
  startServer().catch(console.error);
}
