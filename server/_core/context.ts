import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { users } from "../../drizzle/schema";
type User = typeof users.$inferSelect;
import { sdk } from "./sdk";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  const syntheticUserId = process.env.NODE_ENV === "test" ? opts.req.header("x-naqla-test-user-id") : undefined;
  if (syntheticUserId && /^\d+$/.test(syntheticUserId)) {
    const db = await getDb();
    const [syntheticUser] = db ? await db.select().from(users).where(eq(users.id, Number(syntheticUserId))).limit(1) : [];
    user = syntheticUser ?? null;
  }

  try {
    if (!user) user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
