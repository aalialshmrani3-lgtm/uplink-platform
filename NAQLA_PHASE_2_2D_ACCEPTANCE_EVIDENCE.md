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

Publication freshness is verified on `https://www.uplink5.xyz/` with public build `mt6a4y3kq65m`, built at `2026-08-23T20:48:41.888Z`. `version.json` returned `Cache-Control: no-cache, no-store, must-revalidate` and a matching `Last-Modified` timestamp.

Anonymous read-only HTTP smoke returned `200` for `/`, `/naqla2/review-assistance`, `/naqla2/application-assistance`, `/naqla2/matching-hub`, and the reviewer deep link `?application=1`. The reviewer route was visually opened without a user session; the initial dark splash appeared and no reviewer/application content was visible before the protected boundary completed.

After the splash completed, both reviewer and applicant routes displayed only the safe Arabic sign-in boundary: `سجّل الدخول للوصول إلى مساحة الطلب أو المراجعة المصرح بها فقط.` The new Reviewer and Applicant navigation entries are present within the existing NAQLA2 shell. No reviewer, applicant, application, evidence, score, or private review content was exposed in either anonymous capture.
