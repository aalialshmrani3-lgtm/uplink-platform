import { afterEach, describe, expect, it, vi } from "vitest";

const syntheticUser = { id: 777001, openId: "synthetic-e2e-user", name: "Synthetic E2E", email: "synthetic@example.invalid", role: "user" };
const authenticateRequest = vi.fn(async () => null);
const getDb = vi.fn(async () => ({ select: () => ({ from: () => ({ where: () => ({ limit: async () => [syntheticUser] }) }) }) }));

vi.mock("./db", () => ({ getDb }));
vi.mock("./_core/sdk", () => ({ sdk: { authenticateRequest } }));

const { createContext } = await import("./_core/context");
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  vi.clearAllMocks();
});

describe("test-only synthetic auth guard", () => {
  const opts = { req: { header: () => "777001" }, res: {} } as never;

  it("ignores synthetic auth headers outside test mode", async () => {
    process.env.NODE_ENV = "production";
    const context = await createContext(opts);
    expect(context.user).toBeNull();
    expect(getDb).not.toHaveBeenCalled();
  });

  it("resolves an explicitly synthetic user only in test mode", async () => {
    process.env.NODE_ENV = "test";
    const context = await createContext(opts);
    expect(context.user?.id).toBe(777001);
    expect(getDb).toHaveBeenCalledOnce();
  });
});
