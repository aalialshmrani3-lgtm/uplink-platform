# تدقيق الواجهة وإتاحة الوصول — NAQLA Platform RC1

| السطح | الأدلة | النتيجة |
|---|---|---|
| الصفحة الرئيسية | Chromium ولقطات desktop/mobile/tablet؛ توضح QUALIFY → CONNECT → COMMERCIALIZE من دون ادعاء تكامل خارجي | PASS |
| رحلة NAQLA | `server/naqla-workspace.behavior.test.tsx` و`server/naqla-workspace-accessibility.test.ts` يغطيان التحميل والخطأ والفراغ وfocus وتسميات عناصر التحكم | PASS |
| Matching Hub | `MatchingIntelligenceHub.test.tsx` وHarness HTTP يغطيان الطلب والنتيجة المحكومة وحالات الوصول | PASS |
| Reviewer/Applicant | `ApplicationCopilotWorkspace.test.tsx` وHarness 2.2D يغطيان loading/error/empty وredaction وعدم اتخاذ قرار آلي | PASS |
| NAQLA3 | `CommercializeWorkspace.test.tsx` يغطي الحواجز العامة وRTL والجوال وerror/refetch وتفاعلات DD/Data Room/Contract/Execution/Scale | PASS |
| RTL/LTR | `LanguageContext.test.tsx` يثبت `documentElement.dir/lang` للإنجليزية والعربية؛ المكونات الحرجة تضبط `dir` محليًا | PASS |
| الجوال واللوحي | لقطات 375×812 و768×1024 للحالات العامة؛ عناصر التحكم الأساسية ضمن الحاويات بلا overflow مرئي | PASS للحالات العامة |
| لوحة المفاتيح وARIA | اختبارات workspace والمكونات تفحص labels وfocus وbuttons؛ لا توجد modal mutation مضافة في هذا الإصدار | PASS للسطوح المختبرة |

> لا يُجرى فحص متصفح حي لبيانات مصادق عليها أو لمستخدم إنتاجي. بدلاً من ذلك، تُختبر الحالات المصرح بها عبر rendered tests وHTTP E2E مع fixtures synthetic فقط.
