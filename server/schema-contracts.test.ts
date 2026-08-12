import { describe, expect, it } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { contracts, events } from "../drizzle/schema";

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
});
