import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import type { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const legacyWorkerRetirementScript = `
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil((async () => {
  await self.registration.unregister();
  const clients = await self.clients.matchAll({ type: "window" });
  await Promise.all(clients.map((client) => client.navigate(client.url)));
})()));
`;

export const DOCUMENT_CACHE_CONTROL = "no-cache, no-store, must-revalidate";

export function applyDocumentNoStore(res: Pick<Response, "setHeader">) {
  res.setHeader("Cache-Control", DOCUMENT_CACHE_CONTROL);
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

function serveLegacyWorkerRetirement(req: Request, res: Response, next: NextFunction) {
  if (req.path !== "/sw.js" && req.path !== "/service-worker.js") return next();
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Service-Worker-Allowed", "/");
  res.send(legacyWorkerRetirementScript);
}

function recoverLegacyClientStorage(req: Request, res: Response, next: NextFunction) {
  const hasRecoveryMarker = req.headers.cookie?.includes("naqla-client-recovery=1");
  const isDocumentRoute = !path.extname(req.path);
  const wantsHtml = req.method === "GET" && isDocumentRoute && Boolean(req.accepts(["html"]));
  if (wantsHtml && !hasRecoveryMarker) {
    // One recovery pass removes an inherited shell, cache and worker; the
    // marker avoids repeating this destructive cleanup on later visits.
    res.setHeader("Clear-Site-Data", '"cache", "storage"');
    res.setHeader("Set-Cookie", "naqla-client-recovery=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure");
  }
  next();
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(serveLegacyWorkerRetirement);
  app.use(recoverLegacyClientStorage);
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      applyDocumentNoStore(res);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(serveLegacyWorkerRetirement);
  app.use(recoverLegacyClientStorage);

  // Aggressive caching for static assets
  app.use(
    express.static(distPath, {
      maxAge: "1y", // Cache for 1 year
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // Never cache the HTML shell or version metadata.
        if (filePath.endsWith(".html") || filePath.endsWith("version.json")) {
          applyDocumentNoStore(res);
          return;
        }
        // Cache JS/CSS/images aggressively (they have content hashes)
        if (filePath.endsWith(".js") || filePath.endsWith(".css") || filePath.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
        res.setHeader("X-Content-Type-Options", "nosniff");
      },
    })
  );

  // fall through to index.html if the file doesn't exist
  // Always send no-cache for index.html so browsers always fetch the latest version
  app.use("*", (_req, res) => {
    applyDocumentNoStore(res);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
