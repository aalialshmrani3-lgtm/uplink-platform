import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { getDb } = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb }));

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function contextFor(user: Partial<AuthenticatedUser> = {}): TrpcContext {
  return {
    user: {
      id: 41,
      openId: "organization-test-user",
      email: "member@example.com",
      name: "Organization Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...user,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function resolvedBuilder<T>(value: T) {
  const builder: any = {
    from: () => builder,
    where: () => builder,
    limit: () => Promise.resolve(value),
    then: (resolve: (result: T) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(value).then(resolve, reject),
  };
  return builder;
}

describe("organizationContext", () => {
  beforeEach(() => vi.clearAllMocks());

  it("ينشئ المؤسسة وعضوية المالك والسياق النشط معاً", async () => {
    const values = vi.fn()
      .mockResolvedValueOnce({ insertId: 73 })
      .mockResolvedValueOnce({ insertId: 1 })
      .mockResolvedValueOnce({ insertId: 1 });
    getDb.mockResolvedValue({ insert: vi.fn(() => ({ values })) });

    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.create({ nameAr: "منظمة اختبار", type: "supporting", scope: "local" })).resolves.toEqual({ organizationId: 73, activeContext: 73 });
    expect(values).toHaveBeenNthCalledWith(2, expect.objectContaining({ organizationId: 73, userId: 41, role: "owner", status: "active" }));
    expect(values).toHaveBeenNthCalledWith(3, expect.objectContaining({ organizationId: 73, userId: 41 }));
  });

  it("يرفض تبديل السياق عند غياب عضوية نشطة", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([])) });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.setActive({ organizationId: 99 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يبدل السياق النشط بعد تحقق العضوية", async () => {
    const select = vi.fn()
      .mockReturnValueOnce(resolvedBuilder([{ id: 4 }]))
      .mockReturnValueOnce(resolvedBuilder([{ id: 2 }]));
    const where = vi.fn().mockResolvedValue({ affectedRows: 1 });
    getDb.mockResolvedValue({ select, update: vi.fn(() => ({ set: () => ({ where }) })) });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.setActive({ organizationId: 73 })).resolves.toEqual({ organizationId: 73 });
    expect(where).toHaveBeenCalledTimes(1);
  });

  it("يرفض الدعوة من عضو ليس مالكاً أو مديراً", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ role: "member" }])) });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.invite({ organizationId: 73, invitedEmail: "invitee@example.com", role: "member" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسجل دعوة معلقة عندما يكون طالبها مالكاً نشطاً", async () => {
    const returningId = vi.fn().mockResolvedValue([{ id: 15 }]);
    const values = vi.fn(() => ({ $returningId: returningId }));
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ role: "owner" }])), insert: vi.fn(() => ({ values })) });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.invite({ organizationId: 73, invitedEmail: "invitee@example.com", role: "reviewer" })).resolves.toEqual({ invitationId: 15, status: "pending" });
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ organizationId: 73, invitedByUserId: 41, status: "pending", role: "reviewer" }));
  });

  it("يعرض الدعوات المعلقة الخاصة بالحساب المسجل", async () => {
    const pending = [{ id: 15, organizationId: 73, invitedEmail: "member@example.com", role: "member", createdAt: new Date() }];
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder(pending)) });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.myPendingInvitations()).resolves.toEqual(pending);
  });

  it("يرفض قبول دعوة لا تخص البريد المسجل", async () => {
    getDb.mockResolvedValue({ select: vi.fn(() => resolvedBuilder([{ id: 9, organizationId: 73, invitedEmail: "other@example.com", role: "member", status: "pending" }])) });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.acceptInvitation({ invitationId: 9 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يقبل الحساب المدعو دعوته ثم ينشئ عضوية خادمية", async () => {
    const membershipValues = vi.fn().mockResolvedValue({ insertId: 1 });
    const where = vi.fn().mockResolvedValue({ affectedRows: 1 });
    getDb.mockResolvedValue({
      select: vi.fn(() => resolvedBuilder([{ id: 9, organizationId: 73, invitedEmail: "member@example.com", role: "member", status: "pending" }])),
      insert: vi.fn(() => ({ values: membershipValues })),
      update: vi.fn(() => ({ set: () => ({ where }) })),
    });
    const caller = appRouter.createCaller(contextFor());
    await expect(caller.organizationContext.acceptInvitation({ invitationId: 9 })).resolves.toEqual({ organizationId: 73, role: "member" });
    expect(membershipValues).toHaveBeenCalledWith(expect.objectContaining({ organizationId: 73, userId: 41, role: "member", status: "active" }));
    expect(where).toHaveBeenCalledTimes(1);
  });
});
