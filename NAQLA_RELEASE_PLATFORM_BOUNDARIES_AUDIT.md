# تدقيق حدود المنصة — NAQLA Platform RC1

| الحد | دليل التنفيذ | النتيجة |
|---|---|---|
| الكيانات القانونية | اختبار Cross-engine يفصل `InnovationRecord` ثم `CommercialAsset` ثم `CommercialTransaction`، ويثبت أن المطابقة وInterest وEngagement وPilot مراحل مستقلة | PASS |
| النسخ الثابتة | Harness النهائي ينشئ `naqla1Qualification.createImmutableVersion` قبل التقييم؛ Harnessات NAQLA2 وNAQLA3 تغطي Application/Term/Asset/Deliverable history | PASS |
| synthetic auth | `server/test-auth-guard.test.ts` يغطي تجاهل الرأس خارج الاختبار وحل المستخدم داخل `NODE_ENV=test` فقط | PASS |
| ActiveContext | HTTP Cross-engine ينشئ عضوية وسياقًا نشطًا ويثبت الرفض للمستخدم/المنظمة الأجنبية؛ Harnessات NAQLA2/2.2D تغطي سحب السياق | PASS |
| tenant isolation | NAQLA1 passport أجنبي يعيد 404؛ MatchRun أجنبي لا يقرأ؛ Workspace تجاري أجنبي يعيد 403 | PASS |
| evidence/revocation | التقييم والمراجعة وData Room تعيد التحقق؛ سحب الدليل/المشاركة يحجب القراءة أو التنزيل | PASS |
| reviewer/applicant privacy | Harness 2.2D يثبت redaction لملاحظات المراجع وعدم كتابة Copilot فوق النسخة المقدمة | PASS |
| SoD التجاري | DD والشروط والاتفاق والمخرجات والتغيير والمخاطر وقرار التوسع ترفض الاعتماد الذاتي | PASS |
| السجل | Harnessات NAQLA2 وNAQLA3 وCross-engine تثبت عدادات audit للأحداث الحساسة | PASS |

> تغطي هذه الأدلة الشخصيات التقنية الفعلية في الطبقات الخادمية: المالك/المبتكر والطرف المقابل والمراجع والمتقدم والمستخدم الأجنبي. لا تحول تسمية Persona في الواجهة إلى صلاحية ضمنية؛ التفويض يبقى عضوية وسياقًا وقدرة خادمية صريحة.
