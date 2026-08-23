# NAQLA Phase 2.2D — Final Acceptance Package Manifest

## Scope

This package is a focused, reviewable acceptance bundle for the deterministic local Reviewer & Applicant Copilot delivered in Phase 2.2D. It is not a complete deployment archive.

## Included paths

| Group | Paths |
|---|---|
| Acceptance evidence | `NAQLA_PHASE_2_2D_FINAL_REPORT.md`, `NAQLA_PHASE_2_2D_FINAL_RESULTS.json`, `NAQLA_PHASE_2_2D_ACCEPTANCE_EVIDENCE.md`, this manifest |
| Migration and contracts | `drizzle/0029_naqla2_copilot_advisory.sql`, `drizzle/schema.ts`, `server/routers.ts` |
| Deterministic advisory implementation | `server/naqla2/copilot-deterministic.ts`, `server/naqla2/copilot-router.ts` |
| User interface | `client/src/components/ApplicationCopilotWorkspace.tsx`, `client/src/pages/Naqla2ReviewerCopilot.tsx`, `client/src/pages/Naqla2ApplicantCopilot.tsx`, `client/src/App.tsx`, `client/src/components/InternalSidebar.tsx` |
| Tests | `server/naqla2/copilot-deterministic.test.ts`, `server/naqla2-applications.test.ts`, `client/src/components/ApplicationCopilotWorkspace.test.tsx`, `vitest.config.ts` |
| Real test harness and browser proof | `scripts/phase22d_http_harness.ts`, `scripts/run_phase22d_http_harness.mjs`, `scripts/verify_phase22d_mobile_browser.mjs` |

## Explicit exclusions

The bundle excludes `node_modules`, `dist`, `.git`, `.env`, secrets, logs, screenshots, browser profiles, temporary files, temporary MariaDB data, test databases, and production data. All acceptance fixtures are synthetic and are cleaned up by the isolated harness.
