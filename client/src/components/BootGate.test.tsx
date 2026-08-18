import { describe, expect, it } from "vitest";

describe("BootGate healthy-path rendering", () => {
  it("renders children while the guard completes instead of rendering a cosmetic splash", async () => {
    const source = await import("node:fs/promises").then((fs) => fs.readFile(new URL("./BootGate.tsx", import.meta.url), "utf8"));

    expect(source).toContain('if (status === "ready" || status === "booting") return <>{children}</>;');
    expect(source).not.toContain('data-boot-state="booting"');
  });
});
