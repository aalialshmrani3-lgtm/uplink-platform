import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

function contextFor(id: number): TrpcContext {
  return { user: { id, openId: `application-user-${id}`, email: `application${id}@example.com`, name: `Application ${id}`, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = {
    from: () => builder,
    innerJoin: () => builder,
    where: () => builder,
    limit: () => Promise.resolve(value),
    orderBy: () => Promise.resolve(value),
    then: (resolve: (input: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject),
  };
  return builder;
}

describe("NAQLA2 applications and immutable versions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يرفض إنشاء Application من Candidate لا يملكه طالب المطابقة", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    await expect(appRouter.createCaller(contextFor(1)).naqla2.applications.create({ matchCandidateId: 9 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("ينشئ Application مملوكة من Candidate teaser-only صالح", async () => {
    const values = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 15 }]) }));
    getDb.mockResolvedValue({
      select: vi.fn(() => resolvedBuilder([{ candidateId: 9, listingId: 4, ownerUserId: 2 }])),
      insert: vi.fn(() => ({ values })),
    });
    await expect(appRouter.createCaller(contextFor(1)).naqla2.applications.create({ matchCandidateId: 9 })).resolves.toMatchObject({ applicationId: 15, status: "draft" });
  });

  it("يرفض إصدار نسخة أو إرسال Application لا يملكها المتصل", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.applications.createImmutableVersion({ applicationId: 7, summary: "Synthetic application version for a governed demonstration workflow." })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.naqla2.applications.submit({ applicationId: 7 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يتطلب نسخة ثابتة قبل الإرسال ويحسب SHA-256 للإصدار", async () => {
    const select = vi.fn()
      .mockImplementationOnce(() => resolvedBuilder([{ id: 7, applicantUserId: 1, status: "draft" }]))
      .mockImplementationOnce(() => resolvedBuilder([]))
      .mockImplementationOnce(() => resolvedBuilder([{ id: 7, applicantUserId: 1, status: "draft" }]))
      .mockImplementationOnce(() => resolvedBuilder([]));
    const values = vi.fn(() => ({ $returningId: vi.fn().mockResolvedValue([{ id: 21 }]) }));
    getDb.mockResolvedValue({ select, insert: vi.fn(() => ({ values })) });
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.naqla2.applications.createImmutableVersion({ applicationId: 7, summary: "Synthetic application version for a governed demonstration workflow." })).resolves.toMatchObject({ versionId: 21, versionNumber: 1, payloadSha256: expect.stringMatching(/^[a-f0-9]{64}$/) });
    await expect(caller.naqla2.applications.submit({ applicationId: 7 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });
});
