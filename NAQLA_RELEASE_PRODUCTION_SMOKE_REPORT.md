# NAQLA Platform RC1 — Production Smoke Report

**Method:** anonymous, read-only Chromium and HTTP `HEAD` verification against `https://uplink5.xyz`. No human account, production mutation, synthetic seed, or customer record was used.

| Route | HTTP | HTML cache policy | Anonymous result |
|---|---:|---|---|
| `/` | 200 | `no-cache, no-store, must-revalidate` | RC home explains QUALIFY → CONNECT → COMMERCIALIZE without unsupported capability claims. |
| `/naqla` | 200 | `no-cache, no-store, must-revalidate` | Safe sign-in boundary; no demo data. |
| `/naqla1` | 200 | `no-cache, no-store, must-revalidate` | Safe sign-in boundary; no synthetic actions. |
| `/naqla2` | 200 | `no-cache, no-store, must-revalidate` | Safe sign-in boundary; no synthetic actions. |
| `/naqla2/matching-hub` | 200 | `no-cache, no-store, must-revalidate` | Safe sign-in boundary; no MatchRun/result/factor payload. |
| `/naqla2/review-assistance` | 200 | `no-cache, no-store, must-revalidate` | Safe anonymous boundary. |
| `/naqla2/application-assistance` | 200 | `no-cache, no-store, must-revalidate` | Safe anonymous boundary. |
| `/naqla3` | 200 | `no-cache, no-store, must-revalidate` | Safe anonymous boundary. |
| `/naqla3/assets/77` | 200 | `no-cache, no-store, must-revalidate` | Safe deep-link boundary; no asset payload. |
| `/naqla3/transactions/77` | 200 | `no-cache, no-store, must-revalidate` | Safe deep-link boundary; no transaction payload. |

The browser evidence is intentionally limited to anonymous/read-only behavior. Authenticated journeys are demonstrated by the isolated HTTP E2E suites, not a human production session. A short repeated header smoke is required after the final evidence publication and is recorded in the delivery metadata.

> **Scan boundary:** release and recovery artifacts exclude `.env`, generated bundles, temporary databases, and local logs. The repository-wide lexical scan found no credential-shaped literal. It also found legacy instructional strings such as `Authorization: Bearer naqla_your_api_key`; these are non-secret placeholders, are not claimed as credentials, and are excluded from the curated release candidate ZIP.
