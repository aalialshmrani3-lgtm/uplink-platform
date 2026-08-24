# تقرير الهجرات والإقلاع النظيف — NAQLA Platform RC1

شغّل مشغل Release Candidate قاعدة MariaDB محلية تحت مسار `/tmp`، باسم ومنفذ عشوائيين، ثم طبّق ملفات `drizzle/NNNN_*.sql` المرتبة كاملةً قبل تشغيل رحلة HTTP الحقيقية. أنهى المشغل `finally` بإيقاف MariaDB وحذف المسار المؤقت.

| الفحص | النتيجة |
|---|---|
| حارس قاعدة غير محلية | PASS؛ يقبل `127.0.0.1` واسم `naqla_final_rc_test_*` فقط |
| سلسلة migrations كاملة | PASS |
| Drizzle عبر HTTP | PASS |
| رحلة Cross-engine | PASS |
| تنظيف قاعدة ومسار مؤقت | PASS |

لا عُدّلت migrations تاريخية؛ أضيفت هياكل NAQLA3 الحاكمة سابقًا عبر migration ضيقة `0031_naqla3_governed_commercial_records.sql`.
