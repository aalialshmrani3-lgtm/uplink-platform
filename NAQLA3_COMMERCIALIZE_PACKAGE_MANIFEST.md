# NAQLA3 COMMERCIALIZE Acceptance Package Manifest

This package contains the final local acceptance evidence and implementation files for NAQLA3 COMMERCIALIZE. It intentionally excludes dependency trees, build output, Git internals, environment files, secrets, and temporary database files.

| Path | Purpose |
|---|---|
| `NAQLA3_COMMERCIALIZE_FINAL_REPORT.md` | Local acceptance report and scope statement |
| `naqla3_commercialize_final_summary.json` | Machine-readable local acceptance summary |
| `drizzle/0031_naqla3_governed_commercial_records.sql` | Governed commercial records migration |
| `server/naqla3/commercialize-router.ts` | Server-enforced commercial workflow contracts |
| `client/src/components/CommercializeWorkspace.tsx` | RTL commercial workspace integration |
| `client/src/components/ContractActionsPanel.tsx` | Term, agreement, and external execution controls |
| `client/src/components/ExecutionActionsPanel.tsx` | Execution records and separation-aware controls |
| `client/src/components/ScaleActionsPanel.tsx` | Scale approval and follow-on controls |
| `client/src/components/CommercializeWorkspace.test.tsx` | Rendered UI and authorization-boundary checks |
| `scripts/phase3_http_harness.ts` | Isolated Express/tRPC/Drizzle HTTP journey |
| `scripts/run_phase3_http_harness.mjs` | Random localhost MariaDB harness runner and cleanup |
| `.manus-naqla3-visual-notes.txt` | Honest visual verification notes |
