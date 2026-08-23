import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("NAQLA2 public marketplace disclosure boundary", () => {
  it("يحصر كل استعلام قراءة عام في نطاق teaser_only", () => {
    const source = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    const marketplaceSource = source.slice(source.indexOf("marketplace: router({"), source.indexOf("// Hackathons"));
    const getApprovedStart = marketplaceSource.indexOf("getApprovedIPs: publicProcedure");
    const getListingStart = marketplaceSource.indexOf("getListingById: publicProcedure");
    const createListingStart = marketplaceSource.indexOf("createListing: protectedProcedure");
    expect(getApprovedStart).toBeGreaterThanOrEqual(0);
    expect(createListingStart).toBeGreaterThan(getApprovedStart);
    expect(getListingStart).toBeGreaterThan(createListingStart);

    const getApprovedSource = marketplaceSource.slice(getApprovedStart, getListingStart);
    const getListingSource = marketplaceSource.slice(getListingStart);
    const teaserOnlyGuard = /eq\(naqla2MarketplaceListings\.disclosureScope, 'teaser_only'\)/;
    expect(getApprovedSource).toMatch(teaserOnlyGuard);
    expect(getListingSource).toMatch(teaserOnlyGuard);
  });
});
