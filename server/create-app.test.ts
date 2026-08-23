import { afterAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";

describe("createApp test composition", () => {
  let server: Server | undefined;

  afterAll(async () => {
    await new Promise<void>(resolve => server?.close(() => resolve()) ?? resolve());
  });

  it("mounts the real tRPC middleware without binding a port or static frontend", async () => {
    const { createApp } = await import("./_core/index");
    const composed = await createApp({ serveFrontend: false });
    server = composed.server;
    expect(server.listening).toBe(false);

    await new Promise<void>(resolve => server!.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    expect(address && typeof address !== "string").toBeTruthy();
    const port = typeof address === "object" && address ? address.port : 0;
    const response = await fetch(`http://127.0.0.1:${port}/api/trpc/auth.me?input=${encodeURIComponent('{"json":null}')}`);
    expect(response.status).toBe(200);
  });
});
