import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("production port policy", () => {
  it("binds production to PORT exactly and confines available-port fallback to development", async () => {
    const source = await readFile(path.resolve(process.cwd(), "server/_core/index.ts"), "utf8");
    expect(source).toContain('const isDevelopment = process.env.NODE_ENV === "development";');
    expect(source).toContain("const port = isDevelopment ? await findAvailablePort(preferredPort) : preferredPort;");
    expect(source).toContain("if (isDevelopment && port !== preferredPort)");
  });
});
