# تقرير الإصدار النهائي — NAQLA Platform RC1

**معرّف الإصدار:** `NAQLA_PLATFORM_RC1`  
**حالة الذكاء الخارجي:** `DEFERRED`؛ `AI_EXTERNAL_PROVIDER_ENABLED=false`؛ استدعاءات المزود أثناء التحقق `0`.

## قرار الإصدار

تُغلق هذه الدورة باعتبارها Release Candidate لمنصة NAQLA الحالية. تعتمد الرحلة التشغيلية على **QUALIFY → CONNECT → COMMERCIALIZE**، مع فصل سجل الابتكار عن الأصل التجاري والمعاملة، وعدم اتخاذ أي قرار قانوني أو مالي أو تنظيمي أو تعاقدي تلقائيًا.

| بوابة القبول | الدليل | النتيجة |
|---|---|---|
| الانحدار | `44` ملفات و`162` اختبار Vitest | PASS |
| التكامل الكامل | HTTP حقيقي: سجل → دليل → نسخة ثابتة → تقييم → مطابقة → Pilot → أصل → معاملة → DD → عقد → تنفيذ → تسليم → توسع | PASS |
| MariaDB النظيفة | قاعدة محلية عشوائية، تطبيق كامل migrations، وتنظيف `finally` | PASS |
| الشخصيات/السياق | 10 شخصيات synthetic مع ActiveContext خاص بكل منها وحد الإدارة الصريحة | PASS |
| الأمان والخصوصية | عزل مستأجر وسياق نشط ورفض غير مصادق وIDOR وrevocation وفصل DD/SoD وData Room | PASS |
| الواجهة | RTL وLTR، سطح المكتب، 375×812 و768×1024 للحالات العامة المتاحة | PASS |
| المسارات الموروثة | عناوين NAQLA3 القديمة للـpayment/escrow/contracts تحيل إلى مساحة الحوكمة ولا تقدم القدرة غير المدمجة | PASS |
| البناء | `pnpm build`، build ID `mt75mxed3vdr` | PASS |
| lint | لا يوجد script lint في المشروع | NOT_CONFIGURED |

كما اجتاز جرد console الآلي `37` ملفًا مصنفًا دون ملف غير مصنف، وفحص الأسرار والبيانات غير التركيبية وعلامات تعارض Git و`git diff --check`. والـproduction smoke المجهول read-only يعيد HTTP 200 وسياسة `no-cache, no-store, must-revalidate` للمسارات المطلوبة؛ التفصيل في `NAQLA_RELEASE_PRODUCTION_SMOKE_REPORT.md`.

## حدود صريحة

لا يقدّم هذا الإصدار تكامل blockchain أو escrow أو دفع أو توقيع إلكتروني أو تحقق حكومي/SAIP/MISA/RDIA. اتفاقات NAQLA3 تسجل مراجعات بشرية ومرجع تنفيذ خارجي فقط. لا تعتمد الرحلات الحرجة على الذكاء الخارجي.

**Functional release checkpoint/commit:** يُختم في checkpoint النشر التالي بعد تضمين هذه الأدلة.
**Evidence-only publication:** لا يغير منطق المنصة؛ يربط تقرير smoke والحزم والبصمات بمحتوى التسليم.
