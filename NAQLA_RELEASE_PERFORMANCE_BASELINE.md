# NAQLA Platform RC1 — Practical Performance Baseline

**Method:** anonymous, read-only requests to production; no production authentication or mutation; UTC `2026-08-24T11:42:27Z`.

| Route | HTTP | TTFB | Total |
|---|---:|---:|---:|
| `/` | 200 | 5.049 s | 5.420 s |
| `/naqla` | 200 | 2.615 s | 2.848 s |
| `/naqla2/matching-hub` | 200 | 3.274 s | 3.285 s |
| `/naqla3` | 200 | 3.191 s | 3.581 s |

The observed requests completed without an HTTP error. These values are a cold/anonymous point-in-time baseline, not an SLA or authenticated workload benchmark. The relevant Matching pagination input is bounded to a maximum of 50 in the server router. The final production build completed without a bundle-build error. The package-manager warnings only state that the legacy `pnpm.overrides` location is ignored; they do not indicate a runtime failure.

> **Status:** baseline observed; ongoing production monitoring is a non-blocking operational follow-up. No performance claim beyond the measured read-only results is made.
