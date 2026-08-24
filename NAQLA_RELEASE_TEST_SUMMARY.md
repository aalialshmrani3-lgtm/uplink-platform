# ملخص الاختبارات — NAQLA Platform RC1

| المجموعة | التنفيذ | النتيجة |
|---|---|---|
| Unit وRendered UI | `pnpm test` | `43` ملفات، `160` اختبارًا: PASS |
| TypeScript | `pnpm check` | PASS |
| NAQLA2 | `run_phase22c_http_harness.mjs` | PASS؛ مطابقة ومشاركة وتفاعل وPilot وعزل وتنظيف |
| Reviewer/Applicant | `run_phase22d_http_harness.mjs` | PASS؛ advisory محلي وفصل وredaction وimmutability وrevocation |
| NAQLA3 | `run_phase3_http_harness.mjs` | PASS؛ DD وData Room وContract وExecute وScale وSoD |
| Cross-engine | `pnpm run test:final-platform` | PASS؛ HTTP/tRPC/Drizzle/MariaDB محلية عشوائية وتنظيف |

> كل الـfixtures المستخدمة في Harnessات HTTP تحمل بيانات synthetic وعناوين `example.invalid` فقط.
