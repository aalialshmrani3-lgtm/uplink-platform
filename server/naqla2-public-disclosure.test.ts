import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("NAQLA2 public marketplace disclosure boundary", () => {
  it("يحصر كل استعلام قراءة عام في نطاق teaser_only", () => {
    const source = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    const marketplaceSource = source.slice(source.indexOf("marketplace: router({"), source.indexOf("// Hackathons"));
    const teaserOnlyGuards = marketplaceSource.match(/eq\(naqla2MarketplaceListings\.disclosureScope, 'teaser_only'\)/g) ?? [];
    expect(teaserOnlyGuards).toHaveLength(2);
    expect(marketplaceSource).toContain("getApprovedIPs: publicProcedure");
    expect(marketplaceSource).toContain("getListingById: publicProcedure");
  });
});
