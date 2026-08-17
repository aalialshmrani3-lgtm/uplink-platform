import { describe, expect, it, vi } from "vitest";
import { clearLegacyClientShell } from "./legacyClientCleanup";

describe("clearLegacyClientShell", () => {
  it("unregisters inherited workers and clears origin cache entries without blocking failures", async () => {
    const unregister = vi.fn().mockResolvedValue(true);
    const getRegistrations = vi.fn().mockResolvedValue([{ unregister }]);
    const keys = vi.fn().mockResolvedValue(["legacy-shell", "legacy-assets"]);
    const remove = vi.fn().mockResolvedValue(true);
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: { getRegistrations } });
    Object.defineProperty(window, "caches", { configurable: true, value: { keys, delete: remove } });

    await clearLegacyClientShell();

    expect(unregister).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledWith("legacy-shell");
    expect(remove).toHaveBeenCalledWith("legacy-assets");
  });
});
