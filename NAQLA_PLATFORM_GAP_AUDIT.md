# NAQLA Platform Gap Audit

## Baseline and scope boundary

The independent repository at `/home/ubuntu/naqla-phase1` remains the immutable operational evidence base for Phase 1, Phase 2.1, and the concluded Phase 2.2B work. Its external-AI gate remains closed. The published UPLINK application contains extensive NAQLA-oriented routes and database tables, but its review identified incomplete account workflows, no organization membership/context model, and several presentation routes that do not implement the locked deterministic operating controls.

## Completion approach

Platform completion is implemented as a deterministic NAQLA operating journey inside the UPLINK application. It uses only explicitly marked Synthetic Demo data, contains no provider inference or external integration, and keeps the three engine stages visible and operable in one responsive interface. It does not change any frozen artifact in the independent repository.

## Findings addressed first

| Finding | Disposition |
|---|---|
| Stale lazy asset URLs could raise a dynamic-import failure at the root route. | Add one-time safe stale-chunk recovery and a regression test. |
| Existing routes present NAQLA1/2/3 separately but do not offer one deterministic end-to-end operating flow. | Add a unified journey workspace with a deterministic state machine and synthetic-only scenario. |
| Existing profile registration has placeholder server paths and does not model active organizational context. | Present explicit demo context and persona selection without asserting operational enrollment. |
| Phase 2.2B artifacts cannot be used as a product API and external AI is deferred. | Keep all decisions deterministic and show the AI status as deferred rather than calling a provider. |
