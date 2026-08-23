# NAQLA Platform Completion & Local Acceptance Report

**Scope:** Deterministic NAQLA operating workspace and connected platform services in UPLINK.  
**Acceptance mode:** Local only. No Azure, Gemini, or other external AI/provider action was invoked.  
**External AI decision:** `EXTERNAL_AI_DEFERRED`; `AI_EXTERNAL_PROVIDER_ENABLED=false` remains required.

## Delivered operating surface

The primary `/naqla` route presents an Arabic-first, responsive operating workspace with an explicit Synthetic Demo boundary. It exposes the three platform engines as a controlled sequence: NAQLA1 Qualify, NAQLA2 Connect, and NAQLA3 Commercialize. The route avoids unsupported numerical, partnership, and external-integration claims.

| Area | Delivered local capability | Boundary retained |
|---|---|---|
| NAQLA1 | Deterministic journey controls for record versioning, evidence authorization, readiness/gap controls, qualification, Passport/TRL display, and Next Best Action. | No external AI inference or autonomous decisioning. |
| NAQLA2 | Server-side manual vetting with explicit reviewer assignments, teaser-only listing, interest request data contracts, and deterministic match/pilot journey controls. | No price, automated ranking, or undisclosed evidence release. |
| NAQLA3 | Separate Commercial Asset and Commercial Transaction records, with no automatic legal, payment, or smart-contract execution. | Blockchain actions are fail-closed when unconfigured. |
| Organization context | Server-side organization creation, active memberships, pending invitations, acceptance, and active-context switching. | Every switch and invitation is role/active-membership checked; no admin bypass. |
| User experience | Arabic RTL baseline, English toggle, desktop/mobile verification, loading/error/empty context messaging, keyboard-focusable controls, and stale-lazy-chunk recovery. | The Synthetic Demo is visibly labelled and cannot be represented as real customer data. |

## Verification evidence

| Verification | Result |
|---|---|
| TypeScript | `pnpm check` passed. |
| Unit and integration regression | `pnpm test`: **26 test files, 98 tests passed**. |
| Context authorization | Eight tRPC tests cover create, active-context denial/success, invitation denial/success, pending-invitation listing, and invitation acceptance. |
| Production build | `pnpm build` passed in 16.73 seconds. |
| Source diff quality | `git diff --check` passed. |
| Modified-source secret scan | `modified_diff_secret_pattern_matches=0`. |
| Responsive visual QA | `/` and `/naqla` captured successfully on desktop RTL and `/naqla` on 390×844 RTL with no horizontal overflow. |
| External AI | Deferred. No provider request was part of the acceptance run. |

## Security and privacy controls

The platform enforces default-deny behavior for evidence exposure in the deterministic operating model. NAQLA2 review submission now requires an active reviewer assignment created by the record owner; an unassigned account cannot view the review work queue or submit a review. Public NAQLA2 listing reads are constrained to `teaser_only`; records marked for authorized disclosure are not exposed through public endpoints. Organization context transitions require active membership, invitation issuance requires an owner or manager role, and acceptance requires the invited account email. A deterministic synthetic end-to-end journey test covers the gates from an immutable record version and evidence authorization through match/application/pilot to a separated commercial asset and transaction tracker. The workspace now has a jsdom behavioral accessibility test covering keyboard navigation to named controls and its loading, error, and empty context states. Update APIs now check the affected row count across MySQL/SQLite result shapes so missing ownership fails closed. Every existing router-level model invocation is now forced through an `EXTERNAL_AI_DEFERRED` gate while `AI_EXTERNAL_PROVIDER_ENABLED=false`; the guard is covered by a local no-dispatch test. The legacy embedded blockchain private-key fallback was removed; unconfigured blockchain work now fails closed. The new synthetic demo code does not seed real NAQLA/customer records.

## Acceptance status

> **`IN_PROGRESS_NOT_READY`** applies while the remaining NAQLA1 storage-isolation, NAQLA2 lifecycle, onboarding, and final acceptance items in `todo.md` remain open. This is not an approval to enable a provider, infer on customer data, or start Phase 2.2C.

The separate Phase 2.2B conclusion remains immutable: `EXTERNAL_AI_NOT_PROMOTED` / `DEFERRED`.

## Operational handoff

The deployed primary entry points are `/` and `/naqla`. Create an organization context after sign-in, invite a member through the server-side invitation control, accept only from the invited account, then switch to the active context. Use the deterministic workspace for synthetic demonstration and operating-flow review. Any future external-AI activation requires a separate explicit governance decision and is outside this acceptance package.
