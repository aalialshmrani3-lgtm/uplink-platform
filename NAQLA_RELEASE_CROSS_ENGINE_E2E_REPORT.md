# NAQLA Platform RC1 — Cross-engine HTTP E2E

**Scope:** local, isolated MariaDB only; synthetic fixtures only; Express + tRPC + Drizzle transport.  
**External AI:** `AI_EXTERNAL_PROVIDER_ENABLED=false`; provider calls: `0`.

| Control | Verified result |
|---|---|
| Database boundary | Random localhost database name guarded by `NAQLA_TEST_DATABASE_URL`; project/production database is refused. |
| Bootstrap and cleanup | Full migration chain applied; `finally` closes HTTP/DB resources and deletes the temporary MariaDB directory: **PASS**. |
| NAQLA1 | InnovationRecord → authorised Evidence → immutable version → deterministic assessment/passport: **PASS**. |
| NAQLA2 | Request → MatchRun/factors/confidence/rank band → Interest → human acceptance → Engagement → Pilot: **PASS**. |
| NAQLA3 | Eligible source → CommercialAsset → idempotent CommercialTransaction → DD → human agreement record → execution → milestone/deliverable → scale/follow-on: **PASS**. |
| Cross-tenant/IDOR | Foreign tenant is denied an Innovation Passport and Transaction workspace: **PASS**. |
| ActiveContext | Cross-organization context switch is denied; ten synthetic persona contexts resolve only to their own active organization: **PASS**. |
| Admin boundary | Synthetic `admin` user without explicit evidence access is denied the foreign Innovation Passport: **PASS**. |
| Immutability/idempotency/audit | Immutable qualification version, idempotent transaction creation, guarded stages, and 20 commercial audit events: **PASS**. |

The full reproducible command is `AI_EXTERNAL_PROVIDER_ENABLED=false pnpm test:final-platform`. The final local gate transcript is retained as `NAQLA_RELEASE_FINAL_GATE.txt`.
