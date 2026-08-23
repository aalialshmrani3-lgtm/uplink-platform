import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const routerSource = readFileSync(resolve(process.cwd(), 'server/routers.ts'), 'utf8');

describe('NAQLA2 opportunity discovery contract', () => {
  it('exposes a dedicated teaser-only discovery query with no disclosure-scope field', () => {
    const discoveryStart = routerSource.indexOf('discovery: router({');
    const matchingStart = routerSource.indexOf('deterministicMatching: router({', discoveryStart);
    const discoverySource = routerSource.slice(discoveryStart, matchingStart);

    expect(discoveryStart).toBeGreaterThan(-1);
    expect(discoverySource).toContain('getOpportunityTeasers: publicProcedure');
    expect(discoverySource).toContain("eq(naqla2MarketplaceListings.disclosureScope, 'teaser_only')");
    expect(discoverySource).not.toContain('disclosureScope: naqla2MarketplaceListings.disclosureScope');
  });
});
