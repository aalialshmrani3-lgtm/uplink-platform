import { describe, expect, it } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { contracts, events, naqla2InterestRequests, naqla2MarketplaceListings, naqla2VettingReviews, naqla3CommercialAssets, naqla3CommercialTransactions, organizationInvitations, organizationMemberships, userActiveContexts } from "../drizzle/schema";

describe("مخطط بيانات الفعاليات والعقود", () => {
  it("يطابق اسم عمود الحدث الافتراضي في قاعدة البيانات", () => {
    const columns = getTableColumns(events);
    expect(columns.isVirtual.name).toBe("isVirtual");
  });

  it("يحتفظ بأسماء أعمدة توقيعات العقود الفعلية", () => {
    const columns = getTableColumns(contracts);
    expect(columns.partyAsignature.name).toBe("partyASignature");
    expect(columns.partyAsignedAt.name).toBe("partyASignedAt");
    expect(columns.partyBsignature.name).toBe("partyBSignature");
    expect(columns.partyBsignedAt.name).toBe("partyBSignedAt");
    expect(columns.sellerSignatureUrl.name).toBe("seller_signature_url");
    expect(columns.buyerSignatureUrl.name).toBe("buyer_signature_url");
  });

  it("يفصل المراجعة والقائمة وطلب الاهتمام في NAQLA2", () => {
    expect(getTableColumns(naqla2VettingReviews).reviewerUserId.name).toBe("reviewerUserId");
    expect(getTableColumns(naqla2MarketplaceListings).ownerUserId.name).toBe("ownerUserId");
    expect(getTableColumns(naqla2InterestRequests).requesterUserId.name).toBe("requesterUserId");
    expect(getTableColumns(naqla2InterestRequests).ownerUserId.name).toBe("ownerUserId");
  });

  it("يفصل الأصل التجاري عن المعاملة في NAQLA3", () => {
    expect(getTableColumns(naqla3CommercialAssets).ownerUserId.name).toBe("ownerUserId");
    expect(getTableColumns(naqla3CommercialAssets).sourceListingId.name).toBe("sourceListingId");
    expect(getTableColumns(naqla3CommercialTransactions).assetId.name).toBe("assetId");
    expect(getTableColumns(naqla3CommercialTransactions).initiatorUserId.name).toBe("initiatorUserId");
    expect(getTableColumns(naqla3CommercialTransactions).counterpartyUserId.name).toBe("counterpartyUserId");
  });

  it("يثبت حدود المؤسسة والسياق النشط بمعرفات مستقلة", () => {
    expect(getTableColumns(organizationMemberships).organizationId.name).toBe("organizationId");
    expect(getTableColumns(organizationMemberships).userId.name).toBe("userId");
    expect(getTableColumns(organizationInvitations).invitedEmail.name).toBe("invitedEmail");
    expect(getTableColumns(userActiveContexts).organizationId.name).toBe("organizationId");
  });
});
