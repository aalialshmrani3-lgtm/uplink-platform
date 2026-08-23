# NAQLA Phase 2.2D — Acceptance Evidence

## Architecture and data boundaries

Phase 2.2D adds a deterministic advisory layer for reviewers and applicants. `CopilotRun`, suggestions, clarification drafts, applicant response drafts, source references, and audit events are separate from the canonical application lifecycle. The implementation does not produce acceptance, rejection, eligibility, hard-gate, legal, IP, or institutional decisions.

The schema extension is the narrow migration `drizzle/0029_naqla2_copilot_advisory.sql`. It introduces tenant-bound, ActiveContext-bound advisory records, reviewer assignment, source references, redaction-oriented payloads, stale/revoked state, and idempotency. Historical `ApplicationVersion` records are never modified; an applicant's explicit action creates a new immutable version that preserves its requirement snapshot, provenance, and currently authorized evidence references.

## Local acceptance results

| Control | Result |
|---|---|
| Unit, integration, rendered, and regression tests | PASS — 38 files / 136 tests |
| TypeScript | PASS |
| Production build | PASS — build `mt6a018igwu5` |
| Real HTTP E2E | PASS — Express/tRPC/Drizzle/isolated MariaDB, synthetic-only, cleanup PASS |
| Reviewer / applicant separation | PASS |
| ActiveContext, tenant, and evidence authorization | PASS |
| Redaction, stale/revocation, idempotency, immutability, audit | PASS |
| Mobile browser smoke | PASS — Chromium 375×812, no horizontal overflow in either Copilot path |
| Secret scan / real-data scan | PASS — 0 matches / 0 real-data findings |
| External AI | Disabled — `AI_EXTERNAL_PROVIDER_ENABLED=false`, provider calls 0 |

## Production smoke

Pending publication freshness verification for the Phase 2.2D checkpoint. This section is completed only after the public build ID and reviewer/applicant routes reflect this release.
