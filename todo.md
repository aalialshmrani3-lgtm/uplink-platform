# UPLINK 5.0 - TODO

## NAQLA — Final Platform Completion & Acceptance

- [ ] تنفيذ فحوص القبول والحزم والنشر محلياً فقط مع `AI_EXTERNAL_PROVIDER_ENABLED=false` و`EXTERNAL_AI_DEFERRED`
- [x] إزالة أي حالة READY من نتائج القبول المرحلية حتى تكتمل البنود المفتوحة في دفتر العمل
- [x] تدقيق فجوات المستودعين مقابل Definition of Done مع تثبيت أقفال Phase 2.2B والذكاء الخارجي المغلق
- [x] إصلاح الاسترداد من ملفات lazy المنتهية في cache لمنع خطأ التحميل الديناميكي في الصفحة الرئيسية
- [ ] إكمال NAQLA1 لمسار التأهيل الحتمي والأدلة والإصدارات وInnovation Passport وNext Best Action
- [ ] إكمال NAQLA2 لمسار Challenge إلى Discovery/Match/Application/Interest/Engagement/Pilot
- [ ] إكمال NAQLA3 بفصل CommercialAsset وCommercialTransaction وحالات وأذونات التسويق
- [ ] إكمال الأشخاص والمنظمات والسياقات ودعوات العضوية والـonboarding والتبديل بين السياقات
- [ ] إكمال الواجهة الثنائية RTL/LTR والمتجاوبة وحالات الوصول وتجربة الـDashboard والـNext Best Action
- [x] إزالة الادعاءات الرقمية والتكاملات والشراكات غير الموثقة من الصفحة الرئيسية وإحلال مدخل تشغيل حتمي واضح
- [ ] بناء Demo اصطناعية وتغطية اختبارات الحرجة وE2E والأمن والخصوصية
- [ ] إنتاج تقرير القبول والحزم والتحقق من النشر الحالي ودخان الإنتاج
- [ ] منع cache لصفحات HTML وSPA fallback في النشر حتى يحمّل `uplink5.xyz` bundle checkpoint الحالية
- [x] تشديد default-deny لمسارات مراجعة NAQLA2 كي لا تعرض سجلات أو مراجعات خارج ملكية أو تفويض صريح
- [x] حصر القراءة العامة لفرص NAQLA2 في `teaser_only` وحجب نطاق `authorized_disclosure` دون تفويض مستقل
- [x] إصلاح اختبار حد الإفصاح العام ليقبل guards teaser-only الإضافية في MatchRun من دون إضعاف السياسة
- [x] تشديد اختبار الإفصاح ليثبت شرط teaser-only داخل `getApprovedIPs` و`getListingById` نفسهما مع السماح بguards MatchRun الإضافية
- [x] تصحيح تقسيم اختبار الإفصاح بحسب ترتيب endpoints الفعلي دون تخفيف تحقق teaser-only
- [x] إغلاق مسارات عقود NAQLA3 الوهمية fail-closed حتى يتوفر تنفيذ قانوني وتفويضات حقيقية
- [x] تصحيح تحقق أثر تحديثات MySQL في NAQLA2 وNAQLA3 لمنع نجاح حالة أو معاملة عند غياب الملكية
- [x] إضافة اختبار أثر تحديث NAQLA2 `setListingStatus` لحالتي الرفض والنجاح
- [x] إضافة اختبار أثر تحديث NAQLA3 `setTransactionStatus` لحالتي الرفض والنجاح
- [x] حجب مسارات التقييم المعتمدة على نموذج خارجي بقرار `EXTERNAL_AI_DEFERRED` واختبار رفضها
- [x] إزالة سجلات debug من مسارات NAQLA1 القديمة ومنع طباعة مخرجات التحليل أو معرفات التشغيل
- [x] إغلاق `auth.register` الوهمي fail-closed أو ربطه بحفظ فعلي قبل استخدامه كجزء من onboarding

## NAQLA — تنفيذ خادمي مطلوب قبل القبول

- [x] بناء طبقة بيانات وإجراءات tRPC حقيقية لـNAQLA1: Innovation Record وEvidence وVersions وPassport وTRL وNext Best Action
- [x] بناء كيانات NAQLA1 الصريحة: InnovationRecord وEvidence وImmutableVersion وPassport وReadinessGap وDeterministicAssessment
- [x] إضافة tRPC وتفويض owner-only لكتابة السجل والأدلة والنسخ وقراءة Passport وTRL/Gaps وNext Best Action
- [ ] إضافة اختبار تكامل NAQLA1 كامل للملكية والإصدار غير القابل للتعديل والدليل والتقييم الحتمي والجواز
- [x] ربط لوحة NAQLA1 في `/naqla` بالكيانات والعقود الصريحة مع حالات loading/error/empty/success
- [ ] إضافة اختبار تكاملي متسلسل لـNAQLA1: سجل ثم دليل ثم نسخة ثم تقييم ثم Passport مع TRL/Gaps/Next Best Action فعلية
- [ ] إضافة اختبار revokeEvidence يثبت الحجب وتحديث الفجوات وNext Best Action بعد سحب التفويض
- [ ] إنشاء اختبار NAQLA1 معزول للتخزين يمر بجميع العمليات ويثبت Passport وTRL/Gaps/Next Best Action بعد السحب دون لمس بيانات المشروع
- [ ] بناء طبقة بيانات وإجراءات tRPC حقيقية لـNAQLA2: Challenge وOpportunity وDiscovery وMatchRun وCandidate وFactors وApplicationVersion وInterest وEngagement وPilot
- [ ] بناء إجراءات MatchRun حتمية للمطابقة المفسرة فوق طلبات المطابقة والـteaser العامة مع Factors مسجلة وبدون AI
- [x] ربط MatchRun بطلب مطابقة محفوظ ومملوك في `matching_requests` بدلاً من `queryText` الحر فقط
- [x] إضافة اختبار تكاملي يثبت تشغيل MatchRun من طلب محفوظ ورفض غياب الملكية أو مصدر غير teaser-only
- [x] إضافة حالة تكاملية صريحة تستبعد listing غير `teaser_only` من مرشحي MatchRun المحفوظة
- [x] إزالة بيانات Router المطابقة الوهمية وردود النجاح الثابتة واستبدالها بسجل طلب مطابقة وتفويضات حقيقية
- [ ] بناء سجلات Engagement وPilot مملوكة لـNAQLA2 من Interest مقبولة وبإجراءات tRPC fail-closed
- [ ] بناء Application وImmutable ApplicationVersion مملوكتين لـNAQLA2 بترحيل يدوي ضيق وtRPC واختبارات ملكية
- [ ] ربط واجهة `/naqla` بقراءة وكتابة خادمية فعلية مع حالات loading وerror وempty وsuccess
- [ ] استبدال نموذج الدعوات والسياق المحلي بكيانات organization وmembership وinvitation وActiveContext مستقلة ومختبرة
- [x] إزالة الاعتماد المتبقي على دعوة محلية من `/naqla` أو عزلها بوضوح كعرض مستقل لا يحل محل الدعوة الخادمية
- [x] إضافة اختبارات خادمية وتكاملية لمسارات create وmyContexts وsetActive وinvite وacceptInvitation مع حالات الرفض
- [ ] إكمال onboarding خادمي: إنشاء مؤسسة وإرسال دعوة وقبولها من الحساب المدعو وتبديل ActiveContext في الواجهة
- [ ] ربط قرارات السياق والصلاحيات المتبقية في `/naqla` بعضوية وسياق خادميين بدلاً من persona محلية
- [x] إضافة اختبار تكاملي لرحلة onboarding الخادمية الكاملة وظهور السياق النشط بعد القبول
- [x] إضافة حالات loading/error/empty واضحة إلى لوحة السياق والدعوات في `/naqla`
- [x] ربط سجل العرض ومسار التأهيل في `/naqla` بقراءة CR01 `getBundle` الخادمية بعد إنشائه
- [x] ربط مسار NAQLA2 في `/naqla` بقراءة/إجراء listing وinterest خادميين أو إظهاره محجوباً بوضوح عند غياب التفويض
- [x] ربط حالة NAQLA3 في `/naqla` بقراءة الأصل والمعاملة الخادميين أو إظهار الحجب الصريح
- [ ] منع إعلان READY أو إنشاء حزمة نهائية جديدة قبل نجاح هذه البنود واختبارات الرحلة الكاملة
- [ ] تأجيل إعادة النشر إلى ما بعد اكتمال الربط والـonboarding والاختبارات، ثم تنفيذ محاولة نشر واحدة يتبعها smoke
- [x] استخدام migrations يدوية ضيقة فقط ومنع أي rename أو توليد Drizzle واسع غير مرتبط بكيانات NAQLA الجارية
- [x] إضافة اختبار وصول ثابت لمساحة `/naqla` يتحقق من التسميات والتنقل بالتركيز وحالات التعطيل
- [x] إضافة اختبار واجهة سلوكي لمساحة `/naqla` يتحقق من أسماء الوصول والتنقل بلوحة المفاتيح وحالات loading/error/empty
- [x] إضافة اختبار سلوكي لمساحة `/naqla` يتحقق من اتجاه LTR والنصوص الإنجليزية عند تبديل اللغة
- [x] تحديث mock اختبار واجهة `/naqla` ليغطي endpoints MatchRun وApplications الجديدة دون إخفاء حالات السلوك القائمة
- [x] إزالة التسميات الإنجليزية غير المقصودة من وضع RTL في لوحة الجواز والأصل والمعاملة التجارية
- [x] إزالة المفتاح الافتراضي من مسار NAQLA3 وإغلاق عمليات blockchain غير المهيأة بدلاً من تنفيذها بقيمة مضمّنة

## NAQLA Phase 2.1 Final Closure — تحقق واجهة Manager Funnel
- [x] إصلاح انتقال «طلبات المتقدمين» من التحدي ليعرض Manager Funnel بدلاً من نموذج المتقدم للمنظمة المالكة

## NAQLA Phase 2.1 — Final Acceptance Patch
- [x] توحيد تصنيف Applicant في Eligibility بين Individual وStartup وOrganization
- [x] إضافة Product/Commercial Readiness حتمية ومؤرشفة إلى Snapshot وبوابة Eligibility
- [x] إكمال مراجع Form Builder الآمنة لـInnovationRecord وEvidence مع تحقق خادمي
- [x] تمييز سلوك ReviewPanel بين visible وblinded_to_reviewers وanonymous_initial_review
- [x] إضافة اختبارات قبول مركزة وتحديث وثائق الاعتماد ثم تجميع Final Approved Candidate واحد
- [x] تثبيت Acceptance Patch في مستودع NAQLA المستقل عبر commit موثق
- [x] تجميع حزمة Final Approved Candidate محدثة واستخراج SHA-256 والتحقق من سلامتها
- [x] تسليم التقرير النهائي المرتبط بنتائج Domain وFinal Closure وFinal Acceptance ثم التوقف

## NAQLA Phase 2.1 — Two P0 Acceptance Fixes
- [x] إتاحة Application Setup آمن للمتقدم الخارجي فقط للتحديات المفتوحة والمتاحة وفق سياسة الرؤية
- [x] منع Application Setup عن التحديات الخاصة أو غير المفتوحة لغير فريق التحدي
- [x] تحويل Eligibility إلى استخدام Applicant Snapshot المجمد دون قراءة StartupProfile حي بعد الإرسال
- [x] إضافة HTTP/E2E مركزة للمسار العابر للمستأجر وانحدار اللقطة التاريخية
- [x] تحديث الوثائق المتأثرة وتجميع `NAQLA_PHASE_2_1_LOCKED_FINAL.zip` ثم التوقف

## NAQLA Phase 2.2 — Intelligence Blueprint Only
- [x] تثبيت baseline غير القابل للتعديل لـPhase 2.1 وحدود صلاحيات الذكاء الاصطناعي
- [x] تصميم مسار Challenge Understanding وTaxonomy وMatching القابل للتفسير فوق Hard Gates وEligibility
- [x] تصميم Evidence Confidence والضوابط البشرية وحواجز الهلوسة والتدقيق
- [x] تحديد عقود API/Domain والواجهات وخطة الاختبار ومجموعة التقييم دون تنفيذ
- [x] تسليم Blueprint Phase 2.2 فقط ثم التوقف للمراجعة المعمارية

## NAQLA Phase 2.2 — Architecture Lock v1.1 Only
- [x] فصل Match computation وEvidence Confidence وAI explanation كعقود مستقلة
- [x] تثبيت مصادر المرشحين بحسب مرحلة Discovery أو ApplicationVersion المرسلة
- [x] تحديد Data Classification Allowlist وRevocation/Re-index semantics
- [x] تحديد Provider/Model Adapter وAiAnalysisRun وTaxonomy Governance دون تنفيذ
- [x] تعريف بوابات Benchmark والمراحل المقفلة ثم تسليم PDF ومواصفة machine-readable فقط

## NAQLA Phase 2.2A — Intelligence Foundation Only
- [x] تثبيت عقود MatchRun وMatchCandidate وMatchFactor وEvidenceConfidenceResult وأنماط discovery/submitted_comparison
- [x] بناء Projection Engine خادمي immutable مع سياسة التصنيف والإبطال والـTaxonomy والتدقيق
- [x] بناء AiAnalysisRun محلي وواجهات Provider/Embedding وحافز Mock فقط بلا شبكة أو مزود إنتاجي
- [x] إضافة أسطح Stage تشخيصية محدودة لقراءة الحالة والسياسة والتدقيق مع وسم تجريبي صريح
- [x] إضافة Suites منفصلة للأمان والإبطال وفشل mock والتقييم وتشغيل انحدار Phase 2.1
- [x] تحديث الوثائق وتجميع `NAQLA_PHASE_2_2A_INTELLIGENCE_FOUNDATION_CANDIDATE.zip` ثم التوقف
- [x] إصلاح توافق Seed Taxonomy بعد إضافة حقول حوكمة 2.2A وإعادة تشغيل انحدار Phase 2.1
- [x] إصلاح استيراد واجهة Vitest في Suite Intelligence Foundation وإعادة تشغيلها
- [x] تجهيز Stage معزول قابل لإعادة الفحص والتقاط أدلة سياسة Intelligence والإبطال والتدقيق
- [x] إصلاح إظهار رابط Stage التشخيصي المصرح به بوسم `intelligence-stage=1` للمدير فقط

## NAQLA Phase 2.2A — Foundation Security Lock Patch Only
- [x] إصلاح canonical projection hashing العودي مع اختبارات ترتيب المفاتيح والمحتوى المتداخل
- [x] إنفاذ مصفوفة التصنيف قبل projection وembedding/vector وmodel context وlogs
- [x] منع downgrade للتصنيف في SubmittedApplicationProjection عبر processing manifest فعال
- [x] ربط الإبطال التلقائي بأحداث Discovery/Evidence/Application/Record/Challenge/Taxonomy
- [x] إعادة التفويض عند العرض وتحصين MatchRun stale من تسريب source/candidate metadata
- [x] إصدار مصدر حتمي للإسقاطات وإدارة retry/circuit breaker محلية لحافز Mock
- [x] إضافة Suites Security Lock مستقلة وتقارير الإبطال والهاش والـretry ثم تجميع Locked Candidate واحد
- [x] استعادة توافق Suite Foundation مع allow-by-policy المحلي وإصدارات source ذات البصمة وقاعدة breaker المتكررة
- [x] حجب Candidate/source metadata في MatchRun stale عند فشل إعادة التفويض
- [x] تصحيح اختبار التصنيف restricted ليتوافق مع قيد حالة vector في المخطط
- [x] ربط أو توثيق عدم وجود أحداث Taxonomy/Record تشغيلية إضافية تتطلب invalidation وإثباته باختبار
- [x] إضافة اختبار يثبت أن Taxonomy suggestion pending لا يغير Projection أو Match
- [x] توثيق أحداث Record المؤثرة المغطاة والإثبات النهائي قبل الحزمة المقفلة
- [x] تثبيت Security Lock وتجميع Locked Candidate واحد مع SHA-256 بعد إكمال hooks المتبقية

## NAQLA Phase 2.2A — Final Source-State Invalidation Patch Only
- [x] بناء حدث مركزي `applicationVersionCreated` لإبطال إسقاطات الإصدارات السابقة ونتائجها التابعة
- [x] ربط جميع مسارات ApplicationVersion والإفصاحات وInformation Request بالحدث المركزي
- [x] إبطال إسقاطات Application عند تغير Evidence مفصح عنه أو تصنيفه أو إصداره مع عزل التطبيقات غير ذات الصلة
- [x] تحصين Application projection re-authorization أمام انجراف النسخة والإفصاح وEvidence state
- [x] إضافة اختبارات Domain وHTTP/E2E مستقلة للسيناريوهات A–D وتحديث تقارير القفل
- [x] تثبيت وتجميع `NAQLA_PHASE_2_2A_FINAL_LOCKED.zip` مع SHA-256 ثم التوقف
- [x] إعادة تجميع الحزمة المقفلة بعد اختبار Disclosure drift وتقرير 47/47 ثم استخراج SHA-256 نهائي

## NAQLA Phase 2.2A — Final Invalidation-Scope Fix Only
- [x] فصل إبطال Discovery projection عن Submitted Application projection عند تغيّر Discovery Consent أو visibility
- [x] قصر تغيّر EvidenceVersion أو classification أو revocation على Applications التي تفصح عن Evidence نفسها
- [x] ضمان ألا يؤثر Evidence غير المفصح عنه على Submitted Application projection
- [x] إضافة اختبارات Unit وHTTP/E2E للحالات A–D: Evidence scope وundisclosed evidence وDiscovery isolation وDisclosure revocation
- [x] تحديث التقرير النهائي ووسم التقارير السابقة كمرحلية ثم تجميع `NAQLA_PHASE_2_2A_GOLDEN_LOCK.zip` والتوقف
- [x] إضافة HTTP/E2E مستقلة تغطي A/B على نفس السجل وEvidence غير المفصح وDiscovery isolation وDisclosure revocation بدقة
- [x] إعادة تجميع Golden Lock بعد Suite A–D HTTP/E2E واستخراج SHA-256 نهائي جديد
- [x] إضافة HTTP/E2E صريحة لعزل Discovery projection عن Submitted Application projection للسجل نفسه
- [x] إضافة HTTP/E2E صريحة لسحب Disclosure من A فقط مع بقاء B فعالاً
- [x] إعادة تجميع Golden Lock بعد اكتمال Suite A–D HTTP/E2E واستخراج SHA-256 نهائي
- [ ] تصحيح ترتيب Scenario Discovery في Suite A–D لتُبنى Projection قبل تغيير consent إلى private
- [x] إصلاح تهيئة Approver في Suite Source-State Invalidation المستقلة وإعادة تشغيلها
- [x] تصحيح تمثيل vector غير المادي للتصنيف المقيد ليتوافق مع قيد المخطط
- [x] توحيد مسار سحب Disclosure مع الحدث المركزي أو توثيق استثنائه تقنياً
- [x] إضافة Domain/Unit صريحة لمصفوفة Source-State A–D بجانب HTTP/E2E
- [x] استعادة lifecycle Approver الحقيقي في Suite Source-State بدلاً من فتح Challenge مباشرة في قاعدة البيانات
- [x] إضافة اختبارات Domain/Unit منفصلة للحالات A–D: نسخة Application وإفصاح ودليل وإعادة تفويض
- [x] توثيق مصفوفة A–D وربط كل حالة باختبار Unit وHTTP/E2E قبل الحزمة المقفلة
- [x] إضافة اختبار Unit صريح يفشل إعادة التفويض عند انجراف disclosure أو ApplicationVersion للحالة D
- [x] إضافة اختبار Unit فعلي يثبت redaction عند تغيير أو سحب Disclosure بعد بناء Application projection

## NAQLA Phase 2.2B — Provider & Data Activation Decision Pack Only
- [x] تثبيت Golden Baseline `49de7fd` وقيود عدم التنفيذ أو الاتصال الخارجي
- [x] جمع حقائق موثقة وحديثة عن OpenAI وAzure OpenAI وAnthropic وGoogle Gemini/Vertex AI وAWS Bedrock وخيارات enterprise ذات الصلة
- [x] تقييم الإقامة الإقليمية ومعالجة البيانات والاحتفاظ وعدم التدريب والـsubprocessors لكل خيار
- [x] تصميم سياسة Data-to-AI وتصنيف Challenge Draft وModel Allowlist وعقد ChallengeUnderstandingResult
- [x] تصميم حدود Prompt Injection وخطة benchmark العربية أولاً ونموذج الكلفة/الحصص وبوابة التفعيل
- [x] تسليم PDF ومصفوفة JSON تفرق بين الحقائق الموثقة والمقترحات والقرارات المعلقة ثم التوقف
- [ ] استكمال مصفوفة موثقة لكل مزود للاحتفاظ وعدم التدريب ومراقبة الإساءة والمعالجة/التخزين الإقليمي والـsubprocessors أو وسم الغياب صراحةً
- [ ] تحديث PDF وJSON بتمييز verified per-provider مقابل unresolved ثم إعادة تدقيق Decision Pack
- [x] استكمال مصفوفة موثقة لكل مزود للاحتفاظ وعدم التدريب ومراقبة الإساءة والمعالجة/التخزين الإقليمي والـsubprocessors أو وسم الغياب صراحةً
- [x] تحديث PDF وJSON بتمييز verified per-provider مقابل unresolved ثم إعادة تدقيق Decision Pack

## NAQLA Phase 2.2B — Challenge Understanding Stage Only
- [ ] تثبيت Azure Foundry/UAE North/Standard Regional/GPT-5.6 Sol وقيود Stage وعدم fallback كقرارات تشغيلية قابلة للتدقيق
- [ ] بناء Azure adapter خلف ModelProviderAdapter مع activation verification وkill switch وقيود token/cost/timeout/retry
- [ ] بناء processing manifest مع sanitization وdefault-deny للـRestricted وما فوق وEvidence وApplicant/Decision data
- [ ] بناء ChallengeUnderstandingResult المقيد وsource spans وguardrails لمنع claims/state changes غير المسموح بها
- [ ] إضافة واجهة مدير Stage لتحليل مسودة التحدي فقط من دون write-back أو نشر أو تعديل Eligibility
- [ ] إعداد benchmark عربي أولي وسجل prompt/config/model وتقرير cost/audit
- [ ] إضافة P0 security وHTTP/E2E والانحدار الكامل وتجميع Candidate واحد ثم التوقف

## NAQLA Phase 2.2B — Local Mock Delivery Constraint
- [ ] إبقاء Azure Provider Activation بحالة `BLOCKED_NOT_CONFIGURED` حتى إعداد أسرار المالك والتحقق الموثق
- [ ] منع أسرار Azure وendpoint وdeployment وAPI version من المصدر والتدقيق والحزمة واللقطات والـfixtures
- [ ] استخدام Mock حتمي فقط في جميع تدفقات Challenge Understanding والـbenchmark واختبارات 2.2B الحالية

## NAQLA Phase 2.2B — Review of New Approval Direction
- [ ] تحليل تعليمات الاعتماد الجديدة وتحديد النطاق المصرح به وحالة Azure المطلوبة
- [ ] تنفيذ أي متطلبات معتمدة والتحقق منها من دون تجاوز شرط التفعيل الخارجي
- [ ] تحديث تقرير المرشح أو التسليم وفق قرار المراجعة ثم التوقف

## NAQLA Phase 2.2B — Integration Security Lock Patch Only
- [ ] بناء ChallengeAnalysisInputSnapshot خادمي ومنع تصنيف أو قيمة AI معتمدة من المتصفح
- [ ] تمرير Challenge Understanding عبر AiAnalysisRun وprojection/hash وmanifest immutable وqueue/Mock/persistence
- [ ] إضافة Validator مستقل للـschema والـsource spans والـgrounding والـguardrails
- [ ] تنفيذ server allowlist وPII/Evidence sanitization وkill switch وحدود token/cost/retry
- [ ] إزالة self-certification من الواجهة وعرض processing manifest خادمي آمن
- [ ] توسيع benchmark وP0 HTTP/E2E والتقارير وتجميع Local Locked Candidate نظيف واحد

## NAQLA Phase 2.2B — Local Final Security Patch Only
- [ ] إضافة ChallengeAnalysisInputSnapshot خادمي immutable ومؤرشف بتصنيف مصدر موثوق وdefault-deny عند غيابه
- [ ] تمرير Challenge Understanding حصراً عبر ModelProviderAdapter وAiAnalysisRun وmanifest ثابت كامل
- [ ] تنفيذ sanitization بنيوي وPII/Evidence/path/disclosure policy من دون خفض التصنيف
- [ ] إنفاذ kill switch وtoken/cost/timeout/retry policy فعلياً وبمقدّر token حتمي مستقل عن عدد الحروف
- [x] ربط idempotency بـsourceVersion/sourceHash ومنع إعادة استخدام المفتاح مع مصدر متغير
- [ ] توسيع strict validator وSuite P0 HTTP/E2E كاملة قبل أي Golden Candidate نهائي

## NAQLA Phase 2.2B — Final Local Execution-Boundary Lock Only
- [ ] تمرير approved sanitized context فقط إلى provider adapter وإثبات غياب القيم المرفوضة عبر spy adapter
- [ ] تسجيل providerId وmodelVersion الفعليين من adapter المنفذ داخل AiAnalysisRun
- [ ] اعتماد immutable server Processing Manifest كمرجع Validator الوحيد ومنع provider من تعريف authorization
- [ ] استكمال Arabic/mixed injection وحواجز output وsuggestion source-derived versus suggestion
- [ ] إنفاذ token/cost/timeout/retry policy حتمياً مع usage مسجل واختبارات fail-closed
- [ ] إضافة عملية manager-only مدققة لإدارة تصنيف حقول Challenge وإبطال التحليلات السابقة
- [ ] بناء Suite P0 HTTP/E2E الكاملة وتقارير provenance/isolation/limits/governance ثم Golden Lock واحد
- [ ] تحديث Fixtures E2E لتعيين تصنيف خادمي صريح قبل اختبار المسار المسموح وdefault-deny
- [ ] إصلاح فشل E2E للمصدر الخادمي بعد ربط Validator وAiAnalysisRun دون تخفيف الحواجز
- [ ] إضافة ترحيل مقيد يدعم `challenge_understanding` في intelligence projections دون تغيير أنواع 2.2A القائمة
- [ ] تصحيح إدراج AiAnalysisRun لمصدر Challenge Understanding ليتطابق مع أعمدة المخطط كاملة
- [ ] استيراد Validator Challenge Understanding صراحةً داخل طبقة Intelligence قبل معالجته للنتيجة
- [ ] تشخيص وإصلاح فشل HTTP field-policy manager path في Suite Runtime Policy E2E

## NAQLA Phase 2.2B — Final Validator & Resilience Acceptance Patch Only
- [ ] تطبيق حواجز recursively على كل نص مولد وenums صارمة ورفض خصائص schema غير المعتمدة
- [ ] تنفيذ timeout/retry wrapper مستقل مع Mock timeout/unavailable وعدّاد محاولات دقيق
- [ ] جعل cost estimator إعدادياً وقابلاً لتجاوز سقف الكلفة في اختبار Mock قبل dispatch
- [ ] إضافة Mock oversized output وحد output-token بعد provider وعدم حفظ مخرج محجوب
- [ ] توسيع Source-span والتحقق من zero-call ومصفوفة P0 HTTP/E2E الكاملة
- [ ] تصحيح التقرير وتغليف snapshot نظيف بلا `.git` مع manifest commit/SHA ثم تسليم Final Lock واحد
- [ ] تصحيح assertion timeout في Runtime Policy E2E ليتحقق من حقل الحالة الخادمي الفعلي
- [ ] تقديم حد output token على validator للنواتج المتضخمة كي يُسجل policy denial الصحيح بلا حفظ output
- [ ] تصحيح assertion oversized output في Runtime Policy E2E لقراءة رمز الحجب الخادمي الفعلي

## NAQLA Phase 2.2B — Azure Pre-Activation & Provider Verification Harness Only
- [ ] بناء عقد async provider قابل للإلغاء مع timeout خادمي حقيقي واختبار fake provider محلي
- [ ] فرض additionalProperties=false فعلياً داخل كل كائن متداخل في ChallengeUnderstandingResult
- [ ] تثبيت آلة حالة Azure Activation محجوبة وverifier بلا أسرار أو نداء خارجي
- [ ] إعداد Synthetic Canary عام لا يحتوي بيانات NAQLA ومواصفة activation audit بلا أسرار
- [ ] إضافة مصفوفة P0 والتقارير وتجميع `NAQLA_PHASE_2_2B_AZURE_PREACTIVATION_LOCK.zip` ثم التوقف
- [ ] تصحيح ترتيب timeout abort لضمان أن رفض NAQLA يفوز على استجابة مزود متأخرة

## NAQLA Phase 2.2B — Azure Zero-Data Provider Activation Verification Only
- [ ] تأكيد حضور Endpoint/API key/Deployment/API version مع `AI_EXTERNAL_PROVIDER_ENABLED=false` ودون نداء شبكة
- [ ] بناء Zero-Data operational verifier منفصل يمرر AbortSignal ولا يرسل Challenge أو Evidence أو بيانات مستخدمين
- [ ] إصدار activation audit آمن ومصفوفة PASS/FAIL/UNVERIFIED دون تحويل UNVERIFIED إلى PASS
- [ ] تحديث Known Limitations وتقارير التفعيل وتجميع `NAQLA_PHASE_2_2B_AZURE_ZERO_DATA_VERIFICATION.zip` ثم التوقف
- [ ] تصحيح استهلاك قيمة executeProviderAttempt في Zero-Data verifier وإعادة تشغيل اختبار GET المحلي

## NAQLA Phase 2.2B — Single Synthetic Canary Only
- [ ] تثبيت استخدام fixture `NAQLA_PROVIDER_ACTIVATION_SYNTHETIC_CANARY` العام فقط ومنع أي مصدر NAQLA حقيقي
- [ ] تنفيذ inference Azure واحد عبر ModelProviderAdapter وAiAnalysisRun وtimeout/validator/guardrails
- [ ] تسجيل provenance وusage/cost آمنة بلا أسرار ولا write-back أو 2.2C
- [ ] إعادة `AI_EXTERNAL_PROVIDER_ENABLED=false` وتقديم تقرير canary واحد ثم التوقف

## NAQLA — Azure Canary HTTP_400 Forensic Analysis Only
- [ ] فحص URL وmodel/body/structured output وسجل HTTP_400 المحلي بلا شبكة أو أسرار
- [ ] تصنيف السبب وتقديم إصلاح محلي موصى به من دون إعادة canary أو تعديل بوابة

## NAQLA — Azure Structured Output Schema Compatibility Review Only
- [ ] تدقيق Provider-facing schema السابق محلياً للـkeywords والـrequired وadditionalProperties والتعقيد
- [ ] فصل Azure-compatible provider schema عن Domain validator وبناء Minimal Canary Schema محلي فقط
- [ ] تجهيز safe Azure error capture واختبارات schema compiler بلا شبكة أو inference
- [ ] تسليم تقرير compatibility محلي ثم التوقف بلا canary أو تعديل بوابة

## NAQLA — Synthetic Canary #2 Minimal Structured Output Only
- [ ] التحقق محلياً من Minimal Schema والـrun policy والتصنيف والبوابة والـdeployment قبل الاتصال
- [ ] تنفيذ Azure Responses stateless مرة واحدة فقط بـMinimal Schema وsafe error capture
- [ ] إعادة البوابة إلى false وتقديم تقرير Canary #2 ثم التوقف بلا benchmark أو 2.2C

## NAQLA Phase 2.2B — Arabic-First Benchmark Preparation Only
- [ ] إنشاء 30 حالة Benchmark اصطناعية عامة موزعة عربياً وإنجليزياً ومختلطاً وغامضاً وحقنياً
- [ ] إعداد Rubric من 100 ومعايير اعتماد وHard Fail مستقلة عن confidence النموذج
- [ ] بناء Benchmark Runner محلي يرفض التشغيل عند `AI_EXTERNAL_PROVIDER_ENABLED=false`
- [ ] التحقق من الحزمة محلياً ومنع أي تعديل على Domain أو Eligibility أو Evidence أو 2.2A locks

## 🔥 المهمة الحالية: تحسين صفحة Demo

### Phase 1: إضافة Animated Flow Diagrams لكل مسار ✅
- [x] إضافة Flow Diagram متحرك للمسار 1 (ابتكار: UPLINK 1 → 2 → 3) ✅
- [x] إضافة Flow Diagram متحرك للمسار 2 (تجاري: UPLINK 1 → 3) ✅
- [x] إضافة Flow Diagram متحرك للمسار 3 (ضعيف: رفض مع توصيات) ✅
- [x] إضافة animations باستخدام CSS (animate-pulse, hover:scale-105) ✅

### Phase 2: إضافة Interactive Examples قابلة للنقر ✅
- [x] إضافة أزرار "جرب الآن" لكل مسار ✅
- [x] ربط بأمثلة حقيقية في UPLINK 1 ✅
- [x] إضافة hover effects (hover:scale-105, hover:opacity-80) ✅
- [x] إضافة interactive cards للأمثلة ✅

### Phase 3: إضافة Visual Comparison Table ✅
- [x] إنشاء جدول مقارنة بصري للمسارات الثلاثة ✅
- [x] إضافة icons (Clock, Target, TrendingUp, Award) ✅
- [x] إضافة ألوان مميزة لكل مسار ✅
- [x] عرض الفروقات الرئيسية (الوقت، الخطوات، معدل النجاح) ✅

### Phase 4: حفظ checkpoint وتسليم ✅
- [x] حفظ checkpoint نهائي (b3566803) ✅
- [x] تسليم النتائج للمستخدم ✅


---

## 🆕 مهمة جديدة: إضافة صفحة "إضافة فعالية" في نقلة 2

### Phase 1: Database Schema
- [x] إنشاء جدول events في قاعدة البيانات (موجود مسبقاً)
- [x] إضافة حقول: title, description, type, date, location, organizer, etc.

### Phase 2: Backend (tRPC)
- [x] إنشاء procedure: events.create (موجود مسبقاً)
- [x] إنشاء procedure: events.list (موجود مسبقاً)
- [x] إنشاء procedure: events.getById (موجود مسبقاً)
- [x] توسيع أنواع الفعاليات في tRPC (9 أنواع)
- [ ] إنشاء procedure: events.update
- [ ] إنشاء procedure: events.delete

### Phase 3: Frontend
- [x] إنشاء صفحة AddEvent.tsx
- [x] إضافة نموذج إدخال الفعالية
- [x] إضافة dropdown لاختيار نوع الفعالية (9 أنواع)
- [x] إضافة زر "إضافة فعالية" في صفحة NAQLA 2
- [x] إضافة route للصفحة الجديدة
- [ ] إنشاء صفحة عرض الفعاليات

### Phase 4: Testing & Deployment
- [ ] اختبار إضافة فعالية
- [ ] اختبار عرض الفعاليات
- [ ] حفظ checkpoint


---

## 🆕 مهمة جديدة: تطوير نظام الفعاليات الكامل في نقلة 2

### Phase 1: صفحة عرض الفعاليات
- [x] إنشاء صفحة BrowseAllEvents.tsx
- [x] إضافة فلترة حسب نوع الفعالية (9 أنواع)
- [x] إضافة فلترة حسب الحالة (draft, published, ongoing, completed, cancelled)
- [x] إضافة بحث بالعنوان
- [x] عرض بطاقات الفعاليات مع التفاصيل الأساسية
- [x] إضافة route للصفحة في App.tsx
- [x] تحديث رابط "استعرض الفعاليات" في Naqla2.tsx

### Phase 2: نظام الإشعارات
- [x] إنشاء جدول notifications في قاعدة البيانات (موجود مسبقاً)
- [x] إنشاء tRPC procedures للإشعارات (موجود مسبقاً)
- [x] إضافة إشعار عند تسجيل مشارك في فعالية
- [x] إضافة إشعار عند تسجيل راعي في فعالية
- [x] إنشاء صفحة Notifications.tsx لعرض الإشعارات (موجودة مسبقاً)
- [x] إنشاء server/naqla2/notifications.ts للدوال المساعدة

### Phase 3: لوحة تحكم الفعاليات
- [x] إنشاء صفحة EventsDashboard.tsx
- [x] عرض جميع فعاليات المنظم
- [x] عرض إحصائيات الفعالية (عدد المشاركين، الرعاة، إلخ)
- [x] إضافة إمكانية تعديل الفعالية (تغيير الحالة)
- [x] إضافة إمكانية حذف الفعالية
- [x] عرض قائمة المسجلين في كل فعالية
- [x] إضافة tRPC procedures (getMyEvents, delete)
- [x] إضافة route للصفحة في App.tsx
- [x] إضافة زر "لوحة التحكم" في Naqla2.tsx
- [x] إنشاء server/naqla2/events-dashboard.ts

### Phase 4: Testing & Deployment
- [ ] اختبار صفحة عرض الفعاليات
- [ ] اختبار نظام الإشعارات
- [ ] اختبار لوحة التحكم
- [ ] حفظ checkpoint


---

## 🆕 مهمة جديدة: إصلاح زر "شاهد مثال حي" في نقلة 1

### المشكلة المبلغ عنها
- [ ] زر "شاهد مثال حي" في صفحة نقلة 1 لا يعمل
- [ ] يعطي خطأ عند الضغط عليه

### خطوات الإصلاح
- [x] فتح الموقع والتحقق من الخطأ
- [x] تحديد سبب المشكلة (routing - تضارب بين uplink1 و naqla1)
- [x] إصلاح الكود (إضافة routes لـ uplink1)
- [ ] اختبار الزر للتأكد من عمله
- [ ] حفظ checkpoint


---

## 🔥 مهمة عاجلة: تغيير UPLINK إلى نقلة + إصلاح زر "شاهد مثال حي"

### Phase 1: تغيير UPLINK إلى نقلة
- [ ] البحث عن جميع "UPLINK" في الملفات
- [ ] تغيير "UPLINK 5.0" إلى "نقلة 5.0"
- [ ] تغيير "UPLINK1" إلى "نقلة 1"
- [ ] تغيير "UPLINK2" إلى "نقلة 2"
- [ ] تغيير "UPLINK3" إلى "نقلة 3"
- [ ] تحديث جميع الملفات المتأثرة

### Phase 2: إصلاح زر "شاهد مثال حي"
- [x] إنشاء فكرة تجريبية كاملة مع تحليل
- [x] محاولة إصلاح الزر (تم تعطيله مؤقتاً لحين إصلاح المشكلة الأساسية)
- [x] إصلاح جميع أخطاء TypeScript

### Phase 3: حفظ checkpoint
- [x] حفظ checkpoint نهائي (baf4e790)
- [ ] تسليم الموقع للمستخدم


---

## 🔥 مهمة عاجلة: إصلاح زر "شاهد مثال حي" نهائياً

### Phase 1: فحص tRPC procedure وقاعدة البيانات
- [ ] فحص procedure `naqla1.getIdeaById` في server/routers.ts
- [ ] فحص دالة `getIdeaById` في server/db.ts
- [ ] التحقق من وجود الفكرة 120002 في قاعدة البيانات
- [ ] التحقق من وجود التحليل للفكرة 120002

### Phase 2: إصلاح المشكلة في جلب البيانات
- [ ] إصلاح الـ procedure إذا كان هناك خطأ
- [ ] إصلاح الدالة في server/db.ts إذا كان هناك خطأ
- [ ] إنشاء فكرة تجريبية صحيحة إذا لزم الأمر

### Phase 3: اختبار الزر وحفظ checkpoint
- [ ] اختبار الزر "شاهد مثال حي" في المتصفح
- [ ] التأكد من عرض التحليل بشكل صحيح
- [ ] حفظ checkpoint نهائي


---

## 🔥 مهمة جديدة: تحويل صفحة النتائج إلى صفحة تفاعلية مع توجيه الأفكار

### Phase 1: تحليل المتطلبات وتحديث قاعدة البيانات
- [x] إضافة حقل routing_status في جدول ideas (قيم: null, 'naqla2', 'naqla3', 'returned')
- [x] إضافة حقل routed_at في جدول ideas (تاريخ التوجيه)
- [x] إضافة حقل routed_by في جدول ideas (معرف المستخدم الذي قام بالتوجيه)
- [x] تنفيذ db:push لتطبيق التغييرات

### Phase 2: إنشاء tRPC procedures لتوجيه الأفكار
- [x] إنشاء procedure naqla1.routeToNaqla2 (يحدث routing_status إلى 'naqla2')
- [x] إنشاء procedure naqla1.routeToNaqla3 (يحدث routing_status إلى 'naqla3')
- [x] إنشاء procedure naqla1.returnToSender (يحدث routing_status إلى 'returned')

### Phase 3: تحديث واجهة المستخدم لصفحة النتائج
- [x] تحديث صفحة IdeaResult.tsx لتصبح تفاعلية
- [x] إضافة أزرار التوجيه حسب نتيجة التحليل:
  - ابتكار حقيقي (≥ 70%): زرين (NAQLA 2 و NAQLA 3)
  - مشروع تجاري (50-70%): زرين (NAQLA 2 و NAQLA 3)
  - تحتاج تطوير (<50%): زر واحد (إعادة للمرسل)
- [x] إضافة رسائل تأكيد (toast) عند التوجيه
- [x] تعطيل الأزرار بعد التوجيه لمنع التكرار

### Phase 4: اختبار الميزة وحفظ checkpoint
- [x] اختبار الصفحة التجريبية /naqla1/result (تعمل بشكل صحيح)
- [x] التحقق من ظهور الأزرار بشكل صحيح
- [x] إصلاح زر "شاهد مثال حي" في نقلة 1
- [ ] حفظ checkpoint نهائي


---

## 🔥 مهمة جديدة: صفحة عرض الأفكار الموجهة إلى نقلة 2

### Phase 1: إنشاء tRPC procedure لجلب الأفكار الموجهة
- [x] إنشاء procedure naqla2.getRoutedIdeas في server/routers.ts
- [x] إضافة فلترة حسب routing_status = 'naqla2'
- [x] إضافة فلترة حسب التصنيف (innovation, commercial)
- [x] إضافة بحث بالعنوان
- [x] إضافة ترتيب حسب التاريخ

### Phase 2: تصميم صفحة RoutedIdeas.tsx مع نظام الفلترة
- [x] إنشاء صفحة RoutedIdeas.tsx في client/src/pages/
- [x] إضافة نظام فلترة تفاعلي (tabs للتصنيف)
- [x] إضافة بحث بالعنوان
- [x] عرض بطاقات الأفكار مع التفاصيل الأساسية
- [x] إضافة زر لعرض تفاصيل الفكرة
- [x] إضافة ملخص إحصائي

### Phase 3: إضافة route وربط الصفحة بنقلة 2
- [x] إضافة route /naqla2/routed-ideas في App.tsx
- [x] إضافة زر "الأفكار الموجهة" في صفحة Naqla2.tsx
- [x] تحديث navigation في نقلة 2

### Phase 4: اختبار الصفحة وحفظ checkpoint
- [x] إنشاء الصفحة والميزات الأساسية
- [x] حفظ checkpoint نهائي


---

## 🔥 مهمة جديدة: حذف زر "شاهد مثال حي" من نقلة 1

### Phase 1: حذف الزر من Naqla1.tsx
- [x] البحث عن زر "شاهد مثال حي" في Naqla1.tsx
- [x] حذف الزر والكود المرتبط به
- [x] التحقق من عدم وجود أخطاء

### Phase 2: حفظ checkpoint
- [x] حفظ checkpoint نهائي


---

## 🔥 مهمة جديدة: تطوير نظام تفاعلي لأزرار التوجيه مع عرض خيارات محددة

### Phase 1: تحديث واجهة المستخدم لعرض الخيارات
- [x] قراءة ملف IdeaResult.tsx الحالي
- [x] تصميم dialog component لعرض الخيارات بعد التوجيه

### Phase 2: إضافة dialog لخيارات نقلة 2
- [x] إنشاء dialog يعرض بعد توجيه الفكرة إلى نقلة 2
- [x] إضافة خيار "مطابقة فكرتك مع التحديات المتاحة"
- [x] إضافة خيار "استعرض الهاكاثونات ذات الصلة"
- [x] إضافة خيار "تصفح الفعاليات القادمة"

### Phase 3: إضافة dialog لخيارات نقلة 3
- [x] إنشاء dialog يعرض بعد توجيه الفكرة إلى نقلة 3
- [x] إضافة خيار "عرض فكرتك للبيع في البورصة"
- [x] إضافة خيار "إعداد فكرتك لدخول السوق"
- [x] إضافة خيار "استعرض الأصول المشابهة"

### Phase 4: اختبار الميزة وحفظ checkpoint
- [x] إصلاح أخطاء TypeScript
- [x] حفظ checkpoint نهائي


---

## 🚨 مهمة عاجلة جداً: إصلاح جميع المشاكل قبل الإطلاق العام (المرة 50)

### المشاكل الحرجة 🔴
- [x] **إصلاح أزرار التوجيه في IdeaResult.tsx** - يجب فتح dialogs حتى مع البيانات التجريبية

### المشاكل المتوسطة 🟡
- [x] تصحيح "مكالس التجربة" إلى "مجالس التجربة" في Dashboard (غير موجودة)
- [x] توضيح نص "أفضل المشاريع" في Dashboard (غير موجودة)  
- [x] تحسين شعارات الشركاء في الصفحة الرئيسية (تم إضافة alt text)

### الفحص النهائي ✅
- [x] إعادة فحص جميع الصفحات
- [x] اختبار جميع الأزرار والروابط
- [x] التأكد من عدم وجود أخطاء في console
- [x] اختبار تجربة المستخدم الكاملة
- [x] تأكيد الجاهزية 100% للإطلاق


---

## 🚀 مهمة جديدة: إضافة محتوى الطاقة والاستدامة

### Phase 1: إضافة صفحة التحديات الوطنية في نقلة 2
- [x] إنشاء صفحة `/naqla2/national-challenges`
- [x] إضافة تحدي: روبوتات تنظيف الألواح الشمسية
- [x] إضافة تحدي: حلول تبريد البطاريات في الحرارة العالية
- [x] إضافة تحدي: دمج الطاقة الشمسية في واجهات المباني (BIPV)
- [x] إضافة تحدي: تطبيقات الذكاء الاصطناعي في الطاقة المتجددة
- [x] إضافة تحدي: الهيدروجين الأخضر
- [x] إضافة تحدي: ترابط المياه والطاقة
- [x] إضافة تحدي: احتجاز الكربون
- [x] إضافة تحدي: الشبكات الذكية
- [x] إضافة زر "التحديات الوطنية" في صفحة نقلة 2

### Phase 2: تحديث صفحة الهاكاثونات في نقلة 2
- [ ] إضافة هاكاثون: الهيدروجين الأخضر
- [ ] إضافة هاكاثون: المدن الذكية
- [ ] إضافة هاكاثون: احتجاز الكربون
- [ ] إضافة هاكاثون: Physics-based AI للطاقة

### Phase 3: إضافة قسم الابتكارات الجاهزة في نقلة 3
- [ ] إنشاء صفحة `/naqla3/ready-innovations`
- [ ] إضافة نظام عرض الابتكارات الجاهزة للتسويق (TRL 7-9)
- [ ] إضافة زر "الابتكارات الجاهزة" في صفحة نقلة 3

### Phase 4: إضافة قسم مجالات الابتكار في الصفحة الرئيسية
- [x] إضافة قسم "مجالات الابتكار الاستراتيجية"
- [x] إضافة مجال: الطاقة المتجددة
- [x] إضافة مجال: الاستدامة
- [x] إضافة مجال: الذكاء الاصطناعي
- [x] إضافة مجال: المدن الذكية

### Phase 5: ربط جميع الصفحات وحفظ checkpoint
- [x] إضافة routes في App.tsx
- [x] اختبار جميع الصفحات الجديدة
- [ ] حفظ checkpoint نهائي


---

## 🌟 التحسينات الشاملة للإطلاق العالمي

- [ ] إصلاح صفحة قياس الأثر (/value-footprints) بلوحة بيانات احترافية
- [ ] ربط التسجيل بالـ backend وإكمال إجراء register في routers.ts
- [ ] إضافة تحديات وهاكاثونات حقيقية في /challenges
- [ ] تحسين contrast الـ Home Page (قسم المحركات الثلاثة)
- [ ] إضافة SEO meta tags و Open Graph لجميع الصفحات الرئيسية
- [ ] تطبيق Lazy Loading للصور والمحتوى الثقيل


---

## 🌐 تعديلات التوافق مع QSTP (100%+)

- [ ] إضافة Language Switcher (عربي/English) في الـ Navbar
- [ ] إضافة خيار "International Registration" في /register
- [ ] إضافة قطاع التكنولوجيا الحيوية (Biotechnology) في /challenges
- [ ] إضافة قطاع المواد المتقدمة (Advanced Materials) في /challenges
- [ ] إضافة قطاع Clean Tech المتقدم في /challenges
- [ ] إنشاء صفحة TRL Assessment في نقلة 3
- [ ] إضافة ميزة الترشيح الرسمي للبرامج الدولية في /admin
- [ ] تحسين /value-footprints بمؤشرات KPI متوافقة مع QSTP
- [ ] إضافة قسم "الشركاء الدوليون" في الصفحة الرئيسية مع روابط QSTP
- [ ] إضافة صفحة IP Framework الدولي في نقلة 3
- [ ] إضافة بانر QSTP Partnership في الصفحة الرئيسية


---

## 🚀 مهمة جديدة: تطوير 3 ميزات متقدمة (يوليو 2026)

### Phase 1: توليد العقود/NDA في غرفة التفاوض ✅
- [x] إضافة procedure `naqla2.generateContract` في server/routers.ts
- [x] دعم 3 أنواع: عقد ابتدائي، اتفاقية NDA، اتفاقية تعاون
- [x] توليد العقود بالذكاء الاصطناعي (عربي وإنجليزي)
- [x] تحديث Naqla2DealRoom.tsx بواجهة توليد العقود
- [x] إضافة نسخ وتحميل وطباعة العقد المولّد

### Phase 2: لوحة NAQLA 3 الكاملة ✅
- [x] إنشاء Naqla3Dashboard.tsx بـ 4 تبويبات
- [x] تبويب نظرة عامة: KPIs + آخر النشاطات + إجراءات سريعة + تنبيهات التجديد
- [x] تبويب التصاريح والملكية الفكرية: قائمة + تفاصيل + تنبيهات التجديد
- [x] تبويب عمليات البيع: بيع/ترخيص/استحواذ مع تتبع التقدم
- [x] تبويب الاستحواذ: مراحل الاستحواذ الكاملة (6 مراحل)
- [x] إضافة route `/naqla3/dashboard` في App.tsx

### Phase 3: نظام الفلترة المتقدم في لوحة الفعاليات ✅
- [x] إضافة 7 فلاتر: النوع، القطاع، الحالة، المدينة، الجائزة، التاريخ، البحث
- [x] فلاتر سريعة للقطاعات (chips)
- [x] لوحة فلاتر متقدمة قابلة للطي
- [x] ترتيب حسب: التاريخ، الجائزة، نسبة الامتلاء
- [x] عرض شبكي/قائمة (Grid/List view)
- [x] عرض الفلاتر النشطة كـ tags قابلة للحذف
- [x] زر إعادة ضبط الفلاتر
- [x] حالة فارغة عند عدم وجود نتائج


---

## 🚀 تحسينات مستلهَمة من StartFast - 2026-08-01
- [ ] بناء صفحة Case Studies لنقلة ONE تعرض أفكاراً حقيقية مقيّمة
- [ ] تحويل نقطة دخول نقلة ONE إلى مجانية مع تقرير أولي فوري
- [ ] إضافة Stage-gated: عرض التفاصيل تدريجياً حسب جودة الفكرة

---

## 🔧 مهمة: إصلاح الأزرار المعطلة وإضافة صفحة ملف المستثمر

### Phase 1: إصلاح الأزرار المعطلة
- [x] إصلاح زر "ابدأ الآن مجاناً" في صفحة /why-naqla
- [x] التحقق من زر "سجل دخول لتحليل فكرتك" في NAQLA 1 (يعمل بشكل صحيح)

### Phase 2: إضافة صفحة ملف المستثمر
- [x] إنشاء صفحة Naqla2InvestorProfile.tsx
- [x] إضافة procedures createInvestorProfile, getMyInvestorProfile, listInvestorProfiles في naqla2 router
- [x] إضافة procedures createSponsorshipRequest, listSponsorshipRequests, getMySponsorshipRequests في naqla2 router
- [x] إضافة route /naqla2/investor-profile في App.tsx
- [x] إصلاح أخطاء TypeScript في routers.ts (استعادة من git checkpoint)

### Phase 3: حفظ checkpoint
- [ ] حفظ checkpoint نهائي


---

## 📊 مهمة: بناء Dashboards لكل محرك

- [x] بناء Dashboard نقلة ONE (/naqla1/dashboard) - إحصائيات الأفكار والمستخدمين والتوجيه
- [x] بناء Dashboard نقلة TWO (/naqla2/dashboard) - المستثمرين والفعاليات والتحديات والشراكات
- [x] بناء Dashboard نقلة THREE (/naqla3/dashboard-new) - الأصول الرقمية والعقود والإيرادات
- [x] إضافة procedures getDashboardStats لكل نقلة في routers.ts
- [x] إضافة روابط "لوحة التحكم" في صفحات نقلة 1 و 2 و 3 الرئيسية
- [x] ربط المسارات في App.tsx

---

## 🔍 مهمة: فحص شامل للمنصة قبل التسليم

- [x] فحص صحة TypeScript والبناء والاختبارات الآلية
- [x] اختبار الخادم وواجهات tRPC وقاعدة البيانات
- [x] اختبار الصفحة الرئيسية والتنقل العام
- [x] اختبار صفحات نقلة ONE ووظائف التحليل والتوجيه
- [x] اختبار صفحات نقلة TWO والفعاليات والمستثمرين والتفاوض
- [x] اختبار صفحات نقلة THREE والأصول والعقود ولوحة التحكم
- [x] اختبار الروابط والأزرار العامة ومسارات الخطأ
- [x] اختبار الموقع المنشور على نطاق الإنتاج
- [x] معالجة العيوب المؤكدة وإعادة اختبارها
- [x] حفظ checkpoint موثق بنتائج الفحص

---

## 🔁 مهمة: إعادة فحص المنصة المنشورة

- [x] إعادة فحص البناء والاختبارات الآلية والخادم
- [x] إعادة فحص إجراءات بيانات المحركات وقاعدة البيانات
- [x] إعادة فحص الصفحات والأزرار والمسارات على الإنتاج
- [x] معالجة أي عيب مؤكد وإعادة اختبار الإصلاح
- [x] توثيق نتيجة إعادة الفحص وحفظ نسخة مستقرة

---

## 🎬 مهمة: الفيلم التعريفي السينمائي لمنصة NAQLA 5.0

- [x] تأكيد لغة وأسلوب التعليق الصوتي وخيارات الإنتاج النهائية
- [x] استكشاف الخدمات الرئيسية وجمع لقطات حقيقية من المنصة
- [x] إعداد مخطط 12 مقطعاً متصلاً ومدته 120 ثانية
- [x] إعداد النص الصوتي والمخطط الموسيقي والانتقالات
- [x] إنتاج المقاطع والتعليق الصوتي والموسيقى وتجميع الفيلم النهائي
- [x] مراجعة الجودة وتسليم الفيلم وملفات المقاطع

### معيار جودة إضافي معتمد

- [x] اعتماد لقطات واجهات مكتملة التحميل فقط واستبعاد أي شاشة تحميل
- [x] إعادة إنتاج المقاطع بحركة بصرية لا تعيد توليد النصوص العربية أو تشوهها

---

## 🎞️ مهمة: إعادة مونتاج الإعلان من تسجيلات متصفح حقيقية

- [ ] تسجيل واجهات المنصة المكتملة التحميل بدقة 1920×1080 على الأقل
- [ ] إعداد 40–50 لقطة استخدام قصيرة بمتوسط 2–3 ثوانٍ لكل لقطة
- [ ] توثيق تسلسل استخدام حقيقي لكل خدمة: ظهور ثم مؤشر ثم إجراء ثم نتيجة
- [ ] استخدام شاشة المتصفح الطبيعية دون تصغير الصفحة الطويلة بالكامل
- [ ] إضافة العناوين الخارجية كنصوص مونتاج حقيقية فقط
- [ ] إعادة توزيع التعليق الصوتي بلا فراغات طويلة
- [ ] إعداد موسيقى متصلة بتصاعد تدريجي ونهاية قوية
- [ ] إنشاء مونتاج النهاية السريع وشاشة دعوة سوداء أنيقة
- [ ] مراجعة النسخة الجديدة بدقة 1080p وتسليمها

### مرحلة اعتماد تجريبية — NAQLA 1 فقط

- [x] إعداد مسجل بديل لالتقاط المتصفح الحقيقي بدقة 1920×1080 أو أعلى
- [x] تسجيل تسلسل NAQLA 1: صفحة مكتملة ثم تفاعل ثم تحليل ثم نتيجة ثم انتقال
- [x] إنتاج مقطع تجريبي واحد مدته 10 ثوانٍ بعناوين مونتاج خارجية
- [x] مراجعة النصوص والتحميل والصوت قبل طلب اعتماد المستخدم

### إصلاحات إلزامية — NAQLA1 Test V2

- [x] التحقق من أن ملف التسليم الأصلي 1920×1080 و30fps أو أعلى قبل الإرسال
- [x] تعبئة جميع الحقول الإلزامية ببيانات Demo محلية غير مرسلة قبل التصوير
- [x] إزالة أي رسالة تحقق أو Loading أو Skeleton من كل لقطة
- [x] استخدام مؤشر Desktop صغير طبيعي مع نبضة نقر خفيفة فقط
- [x] تطبيق الإيقاع المحدد: نموذج ثم زر ثم قطع نظيف ثم نتيجة ثم تركيز ثم انتقال
- [x] إرسال NAQLA1 Test V2 فقط للمراجعة، مع حزمة تحافظ على الدقة الأصلية

---

## 🛡️ Final Master V3 — امتثال الأرقام والتأطير الآمن

- [x] إضافة وسم بيانات تجريبية للقطات 20–30 ثانية ذات الأرقام غير الموثقة
- [x] إضافة وسم بيانات تجريبية للقطات 60–70 ثانية ذات أرقام المعاملات والصفقات والأمان
- [x] إضافة وسم بيانات تجريبية للقطات 70–80 ثانية ذات الإيرادات والأصول والعقود
- [x] إضافة وسم بيانات تجريبية للقطات 80–90 ثانية ذات قيمة الملكية الفكرية والعمليات
- [x] توحيد تصميم وموقع الوسم مع مقاطع 90–110 ثانية
- [x] تخفيف تأطير مقطعي المستشار والتحليلات التنبؤية داخل Safe Area
- [x] التحقق من الحفاظ على الصوت والمدة والبنية والجودة التقنية دون تغيير
- [x] تصدير وتسليم Final Master V3 فقط

---

## 🎯 Final Master V4 — تأطير المستشار واستمرار موسيقى النهاية

- [x] إعادة تأطير لقطة Innovation Confidence من مصدر متصفح كامل أو إعادة التقاطها عند الحاجة
- [x] ضمان ظهور كل العناوين والبطاقات في 90–100 ثانية دون قص
- [x] تمديد موسيقى الخلفية حتى 120.000 ثانية مع قفلة سينمائية نظيفة
- [x] الإبقاء على التعليق الصوتي وبقية المشاهد والأوسمة والجودة كما هي
- [x] التحقق من مدة مسار الصوت الاستيريو ومطابقته لمدة الفيديو
- [x] تصدير وتسليم Final Master V4 فقط

---

## 🧭 مهمة: فيديو الاستعراض الإرشادي للمنصة الحقيقية

- [x] إعداد NAQLA Platform Coverage Map للصفحات والوظائف والرحلات الرئيسية
- [x] اعتماد سيناريو Demo موحّد ومسارات تسجيل المتصفح الصامتة
- [x] تسجيل رحلة NAQLA 1 من تقديم الفكرة إلى التقييم والتصنيف والتوجيه
- [x] تسجيل رحلة NAQLA 2 للتحديات والفعاليات والمطابقة وغرفة الصفقة
- [x] تسجيل رحلة NAQLA 3 للسوق والعقود والضمان والتنفيذ
- [x] تسجيل المستشار الاستراتيجي والتحليلات والابتكار التنبؤي والأنظمة المساندة
- [x] تجميع Master Visual Walkthrough صامت بجودة 1080p أو أعلى للمراجعة
- [x] تحديد مدة الفيلم من التسجيلات الفعلية قبل كتابة التعليق
- [ ] كتابة التعليق الصوتي وفق ما يظهر فعلياً بعد اعتماد الفيديو الصامت
- [ ] مزج التعليق والموسيقى والمؤثرات الخفيفة ثم تسليم الفيلم النهائي

---

## ✦ مهمة: NAQLA Product Explainer Film — المعالجة الإخراجية الجديدة

- [x] إيقاف استخدام Master Visual / Screen Walkthrough كفيلم نهائي
- [x] إعداد Storyboard كامل لرحلة IDEA → AI → OPPORTUNITY → MATCH → DEAL → MARKET → IMPACT
- [x] توثيق عناصر واجهة NAQLA الحقيقية المختارة لكل مشهد دون إعادة تصميم المنصة
- [x] إعداد Visual Style Frame لمشهد NAQLA 1 AI Assessment
- [x] إعداد Visual Style Frame لمشهد Smart Matching
- [x] إعداد Visual Style Frame لمشهد NAQLA 1 → 2 → 3 Architecture
- [x] الحصول على اعتماد المستخدم للـ Storyboard والـ Frames قبل إنتاج الفيديو الصامت
- [x] إنتاج Silent Motion Graphics Cut بعد الاعتماد فقط
- [x] مراجعة Silent Motion Graphics Cut الصامتة بدقة 1920×1080 و30fps ومدته 135 ثانية
- [ ] كتابة Voice Over وموسيقى بعد اعتماد النسخة الصامتة فقط

### Visual Style V2 قبل إنتاج النسخة الصامتة

- [x] تقليص المدة المستهدفة إلى 135–150 ثانية عبر دمج المشاهد المتقاربة
- [x] استبدال افتتاحية الفيلم برسالة المشكلة ثم «هنا تبدأ نقلة»
- [x] إعادة بناء إطار NAQLA 1 كرحلة IDEA → ASSESSMENT → SCORE → IMPROVE/QUALIFY → ROUTE
- [x] توحيد نظام العربية والعلامات الإنجليزية المصغرة وإزالة التزاحم في إطار NAQLA 1
- [x] تكبير نتيجة 78% وإزالة REAL NAQLA RESULT وربط الطبقات بعناصر محددة
- [x] إعادة بناء إطار Smart Matching ببطاقات وظيفية وتأثير ظهور تدريجي ونقطة 95% واحدة
- [x] إزالة صفحة المطابقة الكاملة من الإطار واستبدالها بعناصر UI مختارة واضحة فقط
- [x] تثبيت إطار Architecture: NAQLA 1 → NAQLA 2 → NAQLA 3 مع AI/Data وتحول بطاقة الفكرة
- [x] تقديم Storyboard مختصر وVisual Style V2 للاعتماد قبل إنتاج الفيديو الصامت

### Visual Style V2.1 — تعديلات الاعتماد الأخيرة

- [x] ربط نتيجة 95% في Smart Matching بمصدر Best Match Found واضح
- [x] تقوية بطاقة Selected Partner لتظهر كأعلى توافق نهائي
- [x] تصغير وتنظيف نافذة NAQLA UI Excerpt لتبقى دليلاً بصرياً مساعداً
- [x] توحيد اتجاه رحلة Architecture من اليمين إلى اليسار في البطاقات والشريط السفلي
- [x] تخفيف حجم عنوان Architecture وتحسين ترتيب NAQLA ECOSYSTEM ثم العنوان ثم طبقات الذكاء والبيانات
- [x] بدء Silent Motion Graphics Cut بعد تنفيذ تعديلات V2.1 فقط

### مرحلة Clean Silent Master — رحلة حياة الابتكار

- [x] حذف كل شاشات وإطارات التحميل والانتقال من Rough Cut دون استثناء
- [x] استبدال البداية بـ Logo Reveal نظيف مدته 1–1.5 ثانية
- [x] اختصار عرض Hero الخاص بـ NAQLA 2 إلى 3–4 ثوانٍ مركزة
- [x] إعادة تسجيل Global / ESG / AI Strategic Advisor بعد اكتمال التحميل فقط
- [x] إضافة لقطات قصيرة حقيقية لـ TRL وSAIP/IP Assessment وContracts وEscrow عند توفرها
- [x] إضافة Analytics Dashboard فقط من واجهة فعلية مكتملة ومخوّلة، دون بديل مصطنع
- [x] إعادة ترتيب اللقطات لتروي: فكرة ثم تحليل ثم تصنيف ثم فرصة ثم مطابقة ثم تفاوض ثم سوق ثم قرار ثم أثر
- [x] استخدام تأطير Focus/Crop على الإجراء الذي يشرحه الفيلم دون تصغير الصفحات كاملة
- [x] اعتماد مدة Clean Silent Master من التسجيلات الفعلية ضمن نطاق 150–180 ثانية
- [x] تصدير Clean Silent Master بدقة 1920×1080 و30fps وبمعدل 8–12 Mbps
- [x] تقديم Clean Silent Master للمراجعة قبل كتابة أي تعليق أو موسيقى

---

## 🎬 مهمة: إعادة إخراج Arabic/English Silent Preview وفق ملف المراجعة

- [x] إيقاف اعتماد النسخة الصامتة الحالية وعدم إضافة تعليق صوتي أو موسيقى إليها
- [x] إيقاف اعتماد النسخة الصامتة الحالية وعدم إضافة تعليق صوتي أو موسيقى إليها
- [x] إعادة تصميم المعاينة العربية RTL بتركيبة Full 16:9 وتدرجات وخطوط اتصال وحركة بيانات هادئة
- [x] إعادة تصميم المعاينة الإنجليزية LTR بتركيبة مستقلة وليست مجرد استبدال نص عربي
- [x] تكبير مشاهد NAQLA 1 وSmart Matching وDeal Room وNAQLA 3 وفق قاعدة 70–90% من Safe Frame
- [x] استخدام لقطات NAQLA الحقيقية كمصادر إثبات محدودة وكبيرة وواضحة، لا كواجهات مصغرة
- [x] إنتاج Preview صامت عربي مدته 20–30 ثانية بدقة 1920×1080 و30fps وبمعدل 12–20Mbps
- [x] إنتاج Preview صامت إنجليزي مدته 20–30 ثانية بدقة 1920×1080 و30fps وبمعدل 12–20Mbps
- [ ] مراجعة المعاينتين وتقديمهما للاعتماد قبل أي إنتاج كامل أو صوت أو موسيقى

---

## 🎞️ مهمة: Cinematic Proof of Concept عربي — إعادة تصميم من الصفر

- [x] استبعاد النسختين التجريبيتين السابقتين والـSilent Cut السابق من أي أساس بصري جديد
- [x] إعداد مخطط إعلان سينمائي عربي مدته 30 ثانية لمسار المشكلة ← الفكرة ← NAQLA ← التقييم ← 78% ← NAQLA 2 ← 95%
- [x] إعداد أصل بصري سينمائي لبيئة ابتكار سعودية حديثة وخلفية تقنية غير خيالية
- [x] بناء Composition عربي RTL جديد كلياً من دون بطاقات عرض ثابتة أو واجهات مصغرة أو مساحات ميتة
- [x] إبراز 78% و95% كعناصر Hero كبيرة مع انتقالات حركة واضحة
- [x] دمج مقتطفات UI حقيقية مكبرة بوصفها Macro UI وبنسبة لا تتجاوز 25% من المعاينة
- [x] تصدير Cinematic Proof of Concept عربي صامت لمدة 30 ثانية بدقة 1920×1080 و30fps
- [x] مراجعة الاختبار مقابل معيار Cinematic Technology Commercial قبل عرضه للاعتماد
- [ ] انتظار اعتماد المستخدم قبل بناء النسخة الإنجليزية أو أي ماستر كامل أو صوت أو موسيقى

---

## 🎬 مهمة: Cinematic Product Story عربي — إعادة بناء قصصي ثانية

- [x] رفض معاينة Cinematic Proof السابقة وعدم استخدامها أو تعديلها أو إضافة صوت إليها
- [x] إعداد Preview عربي صامت جديد لمدة 35–45 ثانية بعنوان «من فكرة… إلى شركة تصنع أثرًا»
- [x] تصميم إيقاع قصصي إنساني: مبتكر ← فكرة ← NAQLA ← تقييم ← 78% ← فكرة مؤهلة ← NAQLA 2 ← 95%
- [x] تطبيق قاعدة طبقة نص رئيسية واحدة ونص مساند واحد فقط في كل لحظة، مع منع التراكب نهائياً
- [x] إنشاء أصول بصرية جديدة لفريق أو مبتكر في بيئة أعمال سعودية حديثة مع عمق وإضاءة سينمائية
- [x] بناء مشهد NAQLA 1 كعملية تحليل متتابعة بلا صناديق أو بطاقات ثابتة
- [x] بناء 78% و95% كـHero Moments تسيطر على الكادر وتستخدم وسم بيانات تجريبية
- [x] بناء انتقال قصة إنساني من الفكرة المؤهلة إلى فضاء NAQLA 2 والمطابقة الذكية
- [x] استخدام واجهة NAQLA الواقعية كـMacro UI فقط لا كشاشة مصغرة أو تسجيل متصفح
- [x] تصدير المعاينة العربية الجديدة بدقة 1920×1080 و30fps من دون صوت
- [x] مراجعة منع التراكب والمقروئية والكادر قبل تقديمها لاعتماد المستخدم
- [ ] عدم بدء الإنجليزية أو الفيلم الكامل أو التعليق أو الموسيقى قبل اعتماد المعاينة العربية الجديدة

---

## 🎥 مهمة: الفيلم القصصي العربي الكامل — منظومة متعددة المداخل

- [x] رفض المعاينة القصصية ذات الأربعين ثانية كأساس للفيلم الكامل وعدم إضافة صوت إليها
- [x] تدقيق سيناريو 180 ثانية مقابل وظائف NAQLA الحالية وحدود الادعاء التشغيلي
- [x] إبراز مسارات الدخول المستقلة: مبتكر وطلب ملكية فكرية في NAQLA 1، شركة أو فعالية أو مستثمر في NAQLA 2، وأصل تجاري جاهز في NAQLA 3
- [x] بناء افتتاحية إنسانية لثلاثة مداخل: مشكلة شركة، تحدٍ تشغيلي، ومبتكر صاحب فكرة أو طلب ملكية فكرية
- [x] بناء فصل NAQLA 1 بتحليل متتابع وثلاثة مصائر: أقل من 50%، 50–69%، و70% فأعلى مع نتيجة 78% تجريبية
- [x] بناء إشارة ربط رقم طلب ملكية فكرية قائم بالسجل من دون ادعاء تحقق حكومي حي أو تقديم رسمي مباشر
- [x] بناء فصل NAQLA 2 بمداخل الشركات والتحديات والهاكاثونات والجهات والمسرعات والمستثمرين
- [x] بناء Hero Smart Matching مع 95% وأسباب التوافق وإشارات اهتمام من دون الادعاء بتطابق أو إشعارات إنتاجية حية
- [x] بناء Deal Room كمساحة تفاوض ومستندات وخيارات اتفاق من دون الادعاء بتنفيذ قانوني أو توقيع حكومي فوري
- [x] بناء فصل NAQLA 3 للأصل التجاري والترخيص والاستثمار والاستحواذ والشراكة والعقد الرقمي والمراحل والضمان
- [x] بناء نهاية سوقية سعودية تؤكد المساهمة في الأثر والنمو دون ادعاء تأسيس أو ترخيص حكومي من NAQLA
- [x] الحفاظ على نص عربي بصري مختصر ومنع التراكب واستخدام UI حقيقية مكبرة كدليل فقط
- [x] إنتاج الفيلم العربي الصامت لمدة 180 ثانية بدقة 1920×1080 و30fps
- [ ] مراجعة النسخة الصامتة واعتمادها قبل إنتاج النسخة الإنجليزية أو التعليق أو الموسيقى

---

## 🎬 مهمة: اختبار سينمائي عربي 45 ثانية — تنفيذ حرفي للمشاهد الإنسانية

- [x] استبعاد فيلم 180 ثانية من أساس هذا الاختبار وعدم إعادة استخدام كرات أو بطاقات أو تصميم عرض منه
- [x] استخراج كل توقيت ولقطة ونص من ملف التعليمات الحرفي المرفق
- [x] تثبيت شخصية مبتكر سعودي واحدة بعمر 28–38 عاماً عبر كل مشاهد الاختبار
- [x] إنتاج افتتاحية المشكلة: منشأة سعودية حديثة ← شاشة تشغيل ← لقطة قريبة للمبتكر خلال 3 ثوانٍ
- [x] إنتاج انتقال التفكير وولادة الابتكار والنموذج الرقمي لحل إدارة الطاقة وفق الثواني 3–10
- [x] إنتاج الأسئلة الثلاثة منفصلة زمنياً: كيف أحولها إلى منتج؟ كيف أعرف قيمتها؟ من يحتاجها؟
- [x] إنتاج دخول NAQLA وNAQLA 1 ثم إرسال الفكرة بلمسة طبيعية بلا مؤشر أو تسجيل شاشة
- [x] إنتاج تحليل NAQLA 1 وثلاثة الاحتمالات و78% بوسم بيانات تجريبية وفق توقيت الملف
- [x] إنتاج انتقال الفكرة المؤهلة إلى NAQLA 2 ثم الجهات المهتمة وSmart Matching و95%
- [x] تطبيق العربية RTL ومنع ظهور أكثر من نص رئيسي واحد في أي لحظة
- [x] ملء إطار 16:9 بالكامل بمشاهد بشرية أو تقنية كبيرة ومنع الصور الصغيرة والفراغات السوداء
- [x] تصدير اختبار صامت عربي مدته 45 ثانية تقريباً، لا تتجاوز 47 ثانية، بدقة 1920×1080 و30fps
- [ ] مراجعة الاختبار وتقديمه للاعتماد قبل أي فيلم كامل أو صوت أو موسيقى

---

## 🎬 مهمة: NAQLA Cinematic Action Test AR V2 — تصحيح الإخراج

- [x] الحفاظ على قصة V1 وتسلسلها ومدتها مع منع الفيلم الكامل والإنجليزية والصوت والموسيقى
- [x] إزالة أي Black Frame من 00:00 وبدء Full Frame بمنشأة سعودية واضحة
- [x] إعادة Hero «ابتكار» كاملاً في مركز الكادر بين 00:07–00:10 ثم تحويله للنموذج
- [x] فصل الأسئلة الثلاثة ضمن مساحة نظيفة وإخفاء كل سؤال قبل التالي
- [x] تكبير معايير التحليل في مركز Focus بالتتابع: الجدة ثم الجدوى ثم الجاهزية ثم TRL ثم الملكية الفكرية
- [x] إعادة بناء نتائج 00:25–00:31 إلى ثلاث لقطات مستقلة لا تتداخل فيها أي نسب أو مسارات
- [x] إبقاء 78% Hero وإزالتها بالكامل عند Cut إلى المبتكر
- [x] نقل «فكرتك مؤهلة» إلى Glass Notification Card في المساحة الفارغة بعيداً عن الوجه
- [x] تقوية بوابة NAQLA 2 لتفتح أمام الشخصين وتعبرها الكاميرا
- [x] إبراز أفعال المستثمر ومدير الابتكار وفريق المسرعة ضمن الثواني 37–43
- [x] تحويل تنبيهات الجهات إلى بطاقات مقروءة كبيرة ومتتابعة بجانب المستلم
- [x] إظهار 76% ثم 82% ثم 88% في موضع Hero واحد ثم الحفاظ على نهاية 95%
- [x] تصدير NAQLA_Cinematic_Action_Test_AR_V2.mp4 صامتاً بدقة 1920×1080 و30fps
- [x] مراجعة فريمات V2 الحرجة قبل إرسالها للاعتماد

---

## 🧪 مهمة: NAQLA AUDIT STAGING — Baseline خارجي صادق

- [x] حصر الصفحات والمسارات وtRPC procedures ومخطط البيانات والميزات الحالية كما هي
- [x] إنشاء صفحة NAQLA AUDIT STAGING مستقلة ومسار `/audit` لا يعرض بيانات أو أسرار إنتاجية
- [x] إضافة Role Switcher تدقيقي للأدوار المتاحة من دون إنشاء حسابات أو تغيير صلاحيات الإنتاج
- [x] توفير Demo Story مترابطة لإدارة كفاءة الطاقة عبر NAQLA 1 و2 و3 مع الحالات الثلاث للتقييم
- [x] إنشاء ROUTE_MAP.md وAPI_MAP.md وDATA_MODEL.md وROLE_MATRIX.md من الأدلة الموجودة في الكود
- [x] إنشاء BUTTON_MATRIX.csv يسجل كل زر وحالته الفعلية ومساره وأثره ولقطته ومشكلته إن وجدت
- [x] إنشاء KNOWN_GAPS.md وDEMO_DATA_GUIDE.md من الأدلة التقنية، بلا حلول أو إصلاحات أو تقييم نهائي
- [x] إنشاء اختبارات Browser E2E ورحلات المراجعة مع لقطات وتتبعات وسجل console/network
- [x] إنشاء AUDIT_MANIFEST.json منظم لكل مسار وميزة وزر وAPI وجدول ودور واختبار
- [x] تجميع NAQLA_FULL_AUDIT_PACKAGE.zip متضمناً المصدر والوثائق والاختبارات واللقطات والسجلات بلا أسرار
- [x] تسليم رابط Audit Staging والحزمة ثم إيقاف أي تطوير أو إصلاح حتى Change Request جديد

---

## 🧭 Change Request: إعادة بناء منطق NAQLA ونموذج الجاهزية والطلب

- [ ] استخراج وثيقة التغيير كاملة وتحويلها إلى متطلبات قابلة للاختبار ومراحل تنفيذ
- [ ] تدقيق توافق منطق NAQLA الحالي مع فصل الفكرة والتقنية والحل التجاري والشركة والأصل الملكي
- [ ] تصميم مدخل تصنيف نوع المشروع وتحديد متى ينطبق TRL ومتى يستخدم Readiness Passport
- [ ] تصميم نموذج أدلة TRL المعلن والمقدّر آلياً والموثق، مع تصريح المستخدم لرقم طلب الملكية الفكرية
- [ ] تصميم Innovation Index وCommercial Potential وخطة التحسين وإصدارات التقدم
- [ ] تصميم Challenge/Innovation schema وExplainable Matching بقواعد صلبة وأوزان قابلة للمراجعة
- [ ] تصميم تنبيهات محفوظة وخط مراحل NAQLA 2 ولوحات مختلفة حسب الدور
- [ ] تصميم أصول NAQLA 3 ومسار الاتفاق وMilestones والضمانات التشغيلية
- [ ] تنفيذ التغييرات المرحلية مع اختبارات وحدات وE2E وبيانات تجريبية موسومة
- [ ] توثيق الحدود: لا تحقق SAIP حي ولا إيداع رسمي ولا تحويل أموال أو ضمان نقدي بلا تكاملات موثقة
- [ ] تسليم Change Request موثق وخطة نشر مرحلية بعد تحقق المستخدم

---

## 🧩 CR-01: Submission Types + Evidence Vault + Innovation Passport + TRL Evidence Engine

- [x] توثيق معايير قبول CR-01 واستبعاد CR-02 إلى CR-05 والتكاملات الخارجية
- [x] إضافة تصنيف نوع المدخل: فكرة أولية، ابتكار/تقنية، ناتج بحثي، حل تجاري، منتج رقمي/AI، شركة ناشئة، أصل ملكية فكرية، تحدٍ، جهة، فعالية، أصل جاهز
- [x] توجيه أنواع التحدي والجهة والفعالية إلى NAQLA 2، والأصل الجاهز إلى NAQLA 3، مع إبقاء CR-01 ضمن NAQLA 1 للمشاريع المؤهلة
- [x] إضافة نموذج Submission ديناميكي يطلب حقول التقنية أو الحل التجاري أو الشركة بحسب النوع
- [x] إضافة Evidence Vault ببيانات وصفية للملفات ومصدر الدليل ونوعه وحالته، من دون تكامل تخزين خارجي جديد
- [x] تسجيل رقم طلب ملكية فكرية كتصريح مستخدم فقط مع منع أي وسم تحقق SAIP
- [x] إضافة TRL المعلن وTRL المقدر وTRL الموثق وحالة الأدلة ومصادرها للمشروعات التقنية المنطبقة
- [x] منع ظهور TRL للمشروعات غير التقنية وإظهار Technology Readiness غير منطبق داخل Passport
- [x] تنفيذ متطلبات الأدلة العملية لمستويات TRL 1–9 وخريطة أدلة المستوى التالي
- [x] إضافة NAQLA Innovation Passport: Innovation Index وCommercial Readiness وMarket Validation وIP وRegulatory وTeam وSaudi Strategic Fit
- [x] إضافة بيانات Demo موصولة لمشروع AI Energy Optimizer مع «TRL معلن 5 / دليل يدعم 4» ووسم Demo Data
- [x] إضافة Procedures آمنة وإذن المالك للمشروع لقراءة وتحديث Submission وEvidence وPassport
- [x] إضافة اختبارات وحدة وعقد وE2E لمسارات تقني وتجاري وملكية فكرية وتحدٍ
- [x] توثيق حدود CR-01 والنتائج ومنع بدء CR-02 إلى CR-05 قبل اعتماد المستخدم

---

## 🏗️ NAQLA NEW BUILD — Innovation Operating System مستقل

- [ ] استخراج المواصفات الكاملة من التوجيه الرئيسي وتحديد معايير الاستقلال عن المشروع القديم
- [ ] إنشاء مشروع ومستودع وقاعدة بيانات وهوية NAQLA مستقلة تماماً عن UPLINK Platform
- [ ] بناء هوية متعددة الأدوار وOrganization Profiles وSaudi Innovation Graph جديد
- [ ] بناء بوابة النوايا والرحلات المتعددة ونموذج NAQLA 1 الديناميكي وEvidence Vault من الصفر
- [ ] بناء NAQLA 2 للطلب والاكتشاف والمطابقة والبرامج والصفقات من الصفر
- [ ] بناء NAQLA 3 للجاهزية التجارية والعقد والتنفيذ والتوسع من الصفر
- [ ] بناء طبقة NAQLA Intelligence والتحليلات والتدقيق والحدود التشغيلية من الصفر
- [ ] إنشاء بيانات تجريبية مترابطة وموسومة فقط واختبار الأدوار والرحلات والأمان
- [ ] تسليم المشروع المستقل وملف التشغيل وخطة الإطلاق دون نقل منطق أو بيانات أو تكاملات قديمة

---

## 🧱 NAQLA Phase 0.1 — تصحيحات معمارية قبل Backend

- [x] استبدال الكيان الجذري Project بـ Innovation Record/Case ذي subject_type وفصل Journey عنه
- [x] فصل Persona/Actor عن Organization Type وعن Permission Role في وثائق الهوية وRBAC
- [x] تحويل Lifecycle في NAQLA 2 وNAQLA 3 إلى Core Lifecycle مع Conditional Subflows حسب Engagement/Transaction Type
- [x] إضافة NAQLA Taxonomy & Ontology كطبقة مرجعية للقطاعات والتقنيات والطلبات والأدلة والجغرافيا والأنواع
- [x] تعميق Evidence Vault إلى Requirement وItem وClaim وReview وDecision وVersion وProvenance وHash
- [x] إضافة Evaluation Framework وCriterion وAssessment Run ونتيجة ومعايير وإصدارات وHuman Override
- [x] استكمال Innovation Passport بملخص تنفيذي وأقسام قابلة للتوسيع وTRL معلن/مدعوم/موثق وثقة أدلة واضحة
- [x] تصحيح سياق الدور وOrganization Switcher والـGlobal CTA وفق Persona/Organization Context
- [x] تصحيح Challenge وMatch Decision وMutual Interest وWorkspace وDraft/Published وHard Gates مقابل Soft Score
- [x] إعادة تعريف Saudi Innovation Graph كـDerived Projection لا مصدر حقيقة ثانٍ
- [x] فصل Demand عن Program وEcosystem Opportunity وتصحيح مصطلحات NAQLA 3 إلى «التسويق التجاري»
- [x] اختبار اللقطات والحزمة المحدثة والتوقف لاعتماد Phase 0.1

---

## 🔒 NAQLA Phase 0.2 — Domain & Foundation Lock

- [x] تثبيت InnovationRecord كاسم canonical واستبعاد Startup من subject_type مع Journey منفصل
- [x] إضافة نموذج Startup Organization وStartupProfile وملكية السجلات والأصول
- [x] إعادة تعريف subject_type وأنواع الابتكار المستقلة وقواعد مطابقة المنظمة مقابل السجل
- [x] إضافة ReadinessFrameworkApplicability لتقرير انطباق TRL أو Product/Commercial Readiness وفق السؤال لا النوع فقط
- [x] توثيق UserAccount وPerson وTenant وOrganization وMembership وPermissionRole وActiveContext
- [x] إضافة RouteContextPolicy وربط Active Context بالملاحة وCTA والبيانات وصلاحية المسار
- [x] إضافة AccessGrant وVisibilityPolicy وDataClassification وConsent وDisclosurePermission
- [x] إضافة DiscoveryConsent ومنع ظهور السجل أو Evidence في الربط من دون إذن مستقل
- [x] فصل NAQLA 3 إلى Commercial Asset Layer وTransaction Layer ومسارين Asset Ready وTransaction Ready
- [x] توثيق Conditional Match Lifecycle وDemand/Program/Opportunity وGraph Projection دون تغيير المعمارية المعتمدة
- [x] تحديث النموذج التفاعلي للحالات الشخصية والمؤسسية وغير المسموحة والسجل الجاهز للتسويق
- [x] تحديث الوثائق واللقطات والحزمة والتوقف لاعتماد Phase 0.2 قبل أي Backend

---

## 🔐 PHASE 0.2 FINAL LOCK PATCH

- [x] إزالة Startup من أي subject_type أو InnovationRecord Intake في جميع الوثائق والنموذج
- [x] تصحيح INFORMATION_ARCHITECTURE.md ووصف NAQLA 1 إلى فكرة أو بحث أو تقنية أو منتج أو حل
- [x] تصحيح USER_JOURNEYS.md إلى Organization Onboarding وStartupProfile وOrganization Verification دون Startup Passport
- [x] تعديل Asset-driven Transaction Gate إلى CounterpartyInterest ثم AssetOwnerReview ثم MutualInterest ثم TransactionReadyCheck
- [x] تحديث STATE_MACHINES.md وCOMMERCIAL_ARCHITECTURE.md وDATA_MODEL.md وأي Journey أو prototype copy متأثر
- [x] إجراء فحص شامل لعبارات Startup وPassport وتأهيل الشركة ومسار CounterpartyInterest
- [x] إنشاء PHASE0_2_FINAL_CONSISTENCY_REPORT.md وتجميع NAQLA_PHASE_0_2_FINAL_PACKAGE.zip
- [x] تسليم الملفات المصححة والتوقف قبل Phase 1

---

## 🚀 NAQLA Phase 1 — Independent Application Foundation

- [x] توثيق نطاق ومعايير قبول Phase 1 واستبعاد Phase 2–5 والتكاملات الخارجية
- [x] تهيئة تطبيق مستقل جديد وقاعدة بيانات مستقلة من دون استيراد مصدر أو بيانات UPLINK
- [x] تنفيذ Canonical Domain Schema لـInnovationRecord وJourney وStartupProfile وCommercialAsset
- [x] تنفيذ UserAccount وPerson وTenant وOrganization وMembership وPermissionRole وActiveContext
- [x] تنفيذ RouteContextPolicy وAccessGrant وVisibilityPolicy وDiscoveryConsent وEvidence-level permission
- [x] تنفيذ InnovationRecord Intake وJourney وVersioning وReadinessFrameworkApplicability
- [x] تنفيذ Evidence Vault وEvidence Requirement وItem وClaim وReview وDecision وProvenance/Hash
- [x] تنفيذ Innovation Passport وAssessment framework وTRL المعلن والمدعوم والمراجع
- [x] بناء واجهات سياق الدور وإنشاء السجل ورفع الدليل والجواز وOrganization/Startup onboarding
- [x] إضافة بيانات Demo موسومة واختبارات عزل tenant والأذونات وTRL applicability
- [x] توثيق وتسليم Phase 1 والتوقف قبل Phase 2

---

## 🛡️ NAQLA Phase 1 Final Foundation Hardening

- [x] فصل authorize(ctx, action, resource) للقراءة والكتابة ومنع استخدام canRead في أي Write
- [x] إضافة اختبار AccessGrant للقراءة فقط ومنع Evidence وReadiness وRecord وClaim/Review writes بـ403
- [x] فصل كشف Evidence عن الوصول إلى InnovationRecord ومنع metadata وclaims السرية بلا إذن مستقل
- [x] تقييد DataClassification بالقيم المعتمدة وإضافة DisclosurePermission صريح للأدلة الحساسة
- [x] تطبيق RBAC/ABAC فعلياً على Person وMembership وRole وTenant وOwnership وClassification وGrants وAction
- [x] إنفاذ assertContextPolicy من الخادم وتوليد navigation وCTA من capabilities لا من قائمة ثابتة
- [x] إضافة EvidenceItem وEvidenceVersion وحفظ الإصدارات والـhash وعدم حذف النسخ السابقة
- [x] ربط Claim وReview بدليل فعلي أو إظهار insufficient_evidence وEvidence-supported TRL غير محدد
- [x] فصل Claimed وEvidence-supported وReviewed TRL وإضافة version لقواعد Readiness Applicability
- [x] تقييد Framework وsubject type ومدخلات السجل والدليل بخدمات تحقق خادمية
- [x] إضافة AuditEvent لجميع العمليات الحساسة وتجربة Client mutation مستقلة بمعرّف idempotency
- [ ] إضافة إجراءات الحذف والإلغاء والتراجع وحماية البيانات بصلاحيات صريحة
- [x] إجراء فحص أمني وE2E وnegative tests وتسليم Final Foundation Hardening قبل Phase 2
- [x] تجميع حزمة `NAQLA_PHASE_1_FINAL_PACKAGE.zip` وتوثيق تقرير الاختبار وسجل التغييرات قبل طلب اعتماد Phase 2

---

## 🔒 NAQLA Phase 1 — Final Review Last Lock Patch

- [x] منع وراثة وصول Evidence عالي السرية داخل tenant، بما يشمل org_viewer وadmin، من دون DisclosurePermission أو Evidence-level Grant صريح
- [x] إضافة دورة تشغيلية لـClaimed TRL ضمن قرار الجاهزية مع منع مستوى TRL عندما لا ينطبق الإطار
- [x] ربط Idempotency-Key ببصمة الطلب وإرجاع 409 عند إعادة استخدام المفتاح مع محتوى مختلف
- [x] إخفاء حقول TRL من Domain وPassport UI عندما يكون Framework هو PRODUCT_COMMERCIAL أو تكون الجاهزية غير منطبقة
- [x] توسيع اختبارات الوحدة وE2E للسرية داخل tenant وadmin وClaimed TRL وعدم انطباق TRL وتعارض بصمة idempotency
- [x] إعداد EVIDENCE_AUTHORIZATION_MATRIX.md وتحديث التقارير وسجل Patch القفل وتجميع `NAQLA_PHASE_1_LOCKED_PACKAGE.zip`

---

## 🧷 NAQLA Phase 1 — Final Evidence Ownership Patch

- [x] منع org_editor وadmin وغير منشئ Evidence من إنشاء Version أو تغيير metadata أو مشاركة Evidence لا يملكونه
- [x] قصر Evidence version وmetadata management وsharing على منشئ Evidence في tenant المالكة مع تسجيل النجاح والرفض
- [x] إبقاء Evidence create حقاً مستقلاً لمن يملك كتابة السجل، مع تثبيت ملكية الدليل للمنشئ عند الرفع
- [x] توسيع اختبارات الوحدة وE2E لمسار Person A/Person B داخل المنظمة وDisclosure grantees وتدقيق عمليات المنع
- [x] تحديث مصفوفة التفويض وتقارير E2E وسجل Patch الملكية وتجميع `NAQLA_PHASE_1_FINAL_LOCKED_PACKAGE.zip`

---

## 🚀 NAQLA Phase 2 — Matching & Challenges Foundation

- [x] استخراج نطاق Phase 2 ومعايير القبول من المعمارية المقفلة وتوثيق الحدود غير المسموح بها
- [x] تصميم نموذج Challenges وProfiles وMatching مع عزل tenant والتفويض وربط InnovationRecord دون كشف Evidence
- [x] تنفيذ ترحيلات البيانات وعمليات الخادم وواجهة Phase 2 ضمن نطاق المطابقة والتحديات المعتمد
- [x] إضافة اختبارات Domain وE2E للإنشاء والظهور والتفويض والعزل والسيناريوهات السلبية
- [x] إعداد توثيق وحزمة تسليم Phase 2 للاعتماد قبل أي معاملات أو تكاملات لاحقة

### توسعة Demand Exchange المقيدة

- [x] توثيق قاعدة اكتشاف Phase 2: DiscoveryConsent فقط وteaser محدود ومنع أي Evidence أو هوية مخفية من التسرب
- [x] تنفيذ مصدر API لاكتشاف InnovationRecords المصرح بها لسياق Organization مخول مع عزل tenant ومنع Personal/Viewer
- [x] إضافة واجهة Demand Exchange لاختيار teaser وإنشاء مرشح Challenge من دون إدخال معرّف يدوي أو Overall Score
- [x] توسيع اختبارات Domain وE2E للتحقق من private وanonymous teaser وtenant isolation ومنع Evidence
- [x] توثيق وحزم توسعة Demand Exchange ضمن Phase 2 قبل أي AI أو Interest أو Transaction

### Interest اختياري بلا Workspace أو صفقة

- [x] توثيق حالات Interest المقيدة ومبدأ عدم كشف Evidence أو هوية إضافية أو إنشاء Workspace تلقائياً
- [x] تنفيذ Interest بعد مرشح eligible فقط مع تفويض المنظمة ومالك السجل وidempotency وAudit Events
- [x] إضافة واجهة طلب Interest وصندوق رد المالك (Accept/Decline) يعرضان الحالة فقط
- [x] توسيع اختبارات Domain وE2E لحالات الطلب والقبول والرفض والعزل وتعارض الطلبات
- [x] توثيق وحزم توسعة Interest ضمن Phase 2 قبل Workspaces أو معاملات لاحقة

### اكتشاف موجّه لمنظمات محددة

- [x] توثيق Grant للاكتشاف الموجّه لمنظمة محددة وحقول teaser المسموحة مع استمرار عزل Evidence
- [x] تنفيذ أهداف Discovery لاستقبال tenant منظمة محدد من مالك السجل ورفض أي سياق أو هدف غير مؤهل
- [x] عرض السجل ذي `selected_organizations` للمنظمة المستهدفة فقط عبر Demand Exchange
- [x] إضافة واجهة المالك لإدارة target واختبارات Domain وE2E للعزل والتدقيق
- [x] توثيق وحزم توسعة الاكتشاف الموجّه قبل أي AI أو Workspace أو معاملة

---

## 🧩 NAQLA Phase 2 — Challenge & Applicant Lifecycle

- [ ] توثيق حالات Challenge وApplication وقواعد الانتقال والمالكين وسجل Audit مع فصل Match وInterest وApplication
- [ ] تصميم وتنفيذ Eligibility Engine وApplication snapshots وForm Builder ديناميكي وطلبات المعلومات الآمنة
- [ ] تنفيذ Reviewer workflow وRubrics وConflict-of-Interest وقرار مؤسسي منفصل عن Match Score
- [ ] إضافة Challenge Dashboard وApplicant Dashboard ومؤشرات Funnel مبنية على حالات قاعدة البيانات
- [ ] توسيع اختبارات Domain وE2E للانتقالات والأهلية والعزل وEvidence references والمراجعات والقرارات
- [ ] توثيق وحزم دورة التحدي والمتقدمين قبل بدء AI Matching Copilot

---

## 🛠️ NAQLA Phase 2 — UI Stabilization Patch

- [x] تشخيص سبب تعليق NAQLA 5.0 في الإقلاع وتوثيق مسار bootstrap المتعطل
- [x] تنفيذ حالات booting وready وerror وcontext_required مع حد زمني وشاشة استرداد عملية
- [x] إزالة تسمية NAQLA 5.0 من واجهة المستخدم الرئيسية وحصر الإصدار في التشخيص/حول المنتج
- [ ] تنظيف ملاحة سياق الجهة إلى الربط: نظرة عامة، التحديات، الطلبات، الاكتشاف، المطابقات، الاهتمامات فقط
- [ ] ضبط CTA الإنشاء وبطاقات Match وشاشة Challenge والوسم الصريح للبيانات التجريبية دون إعادة تصميم الهوية
- [ ] إضافة اختبارات E2E للخروج من التحميل وفشل Bootstrap وrefresh وتبديل السياق، وتوثيق المسارات والأزرار والفجوات

---

## 🧭 NAQLA Phase 2.1 — Challenge & Applicant Lifecycle

- [x] تثبيت وثيقة النطاق وفصل Demand وChallenge وMatch وInterest وApplication ومنع AI وNAQLA 3
- [x] تصميم مخطط البيانات وحالات Challenge وApplication وPermission Matrix لفريق التحدي والمراجعة
- [x] تنفيذ فريق التحدي والأدوار والانتقالات المدققة والمهل والتعليق والإلغاء والأرشفة
- [x] تنفيذ Eligibility Engine وApplication snapshots والإصدارات وإعادة التقديم ونماذج التقديم المتغيرة
- [x] تنفيذ كشف Evidence الصريح وطلبات المعلومات داخل Application من دون تجاوز أقفال Phase 1
- [x] تنفيذ Review Panel والتعيين وتعارض المصالح والـRubrics والدرجات والتوصيات العمياء
- [x] تنفيذ Shortlist وFinal Selection المؤسسيين ومسار المتابعة الموصى به من دون NAQLA 3
- [x] تطوير واجهات RTL للمتقدم ومدير التحدي والمراجع وتفاصيل Application مع الحالة والخطوة التالية
- [x] إضافة Unit وDomain وHTTP وE2E لرحلات A–G، والتحقق البصري والتقارير
- [x] توثيق المصفوفات والمخططات والقيود وتجميع NAQLA_PHASE_2_1_CHALLENGE_LIFECYCLE_PACKAGE.zip ثم إيقاف العمل قبل AI
- [x] إضافة حالات المهل والتنبيهات والسحب والاستبعاد مع Audit Trail وNext Best Action بحسب الدور
- [x] إجراء تحقق مرحلي وإنتاجي وإرفاق اللقطات ومسارات الواجهة ومصفوفة الأزرار في تسليم Phase 2.1

### 🔒 Phase 2.1 Lock Patch — Required Before AI

- [x] تعطيل أو توجيه مسارات publish/close القديمة إلى State Machine ومنع أي lifecycle bypass مع فصل Approver عن org_owner/admin
- [x] استكمال Eligibility بأربع نتائج وقواعد النوع والجغرافيا والقطاع وTRL/Readiness والكيان السعودي والمستندات والأدلة والفئات المستبعدة
- [x] تجميد Submission Snapshot الكامل وتوسيع Form Builder والتحقق الخادمي لجميع الأنواع وإصدارات التطبيق
- [x] تفعيل ReviewPanel وReview Mode والـblind/anonymous review وCOI غير المحلول وInformation Request lifecycle الكامل
- [x] استكمال Applicant/Organization وChallenge Manager Dashboards وApplication Detail والتنبيهات DB-backed
- [x] إنشاء Suite Lock Patch مستقلة لاختبارات bypass والأهلية والـsnapshot والـblind review وCOI وطلبات المعلومات وعزل Evidence
- [x] تحديث الوثائق وتجميع `NAQLA_PHASE_2_1_LOCKED_PACKAGE.zip` ثم التوقف قبل AI وNAQLA 3

### مراجعة اعتماد Lock Patch اللاحقة

- [x] مطابقة تطبيق Lock Patch الحالي مع ملاحظات الاعتماد وتوثيق أي فجوة فعلية فقط
- [x] تفعيل أو إثبات استخدام ChallengeOwnerOrganization وReviewPanel ضمن عقد Domain لا كمخططات خاملة
- [x] إنشاء Suite E2E مستقلة لLock Patch تثبت lifecycle والـApprover والأهلية واللقطات والـblind review والـCOI وطلبات المعلومات وعزل Evidence
- [x] تحديث التقارير وإعادة تجميع `NAQLA_PHASE_2_1_LOCKED_PACKAGE.zip` ثم التوقف قبل AI وNAQLA 3

### 🔐 Phase 2.1 Final Lock Patch

- [x] تمكين Startup/Organization Applicant كاملاً مع فصل Applicant Organization عن Challenge Owner Organization
- [x] تشغيل Reviewer Application Detail والأدلة المفصح عنها للتطبيق فقط وعزل ReviewPanel/Blind Review
- [x] استكمال Eligibility للجغرافيا والقطاع والتقنية والجاهزية والكيان السعودي وعدم احتساب Evidence غير المفصح عنها
- [x] تصحيح Evidence Requests لطلب فئات وأوصاف أدلة غير مفصح عنها وربط الرد بإفصاح اختياري لاحق
- [x] تشغيل حقول Form Builder المرجعية والقيم المنطقية وTRL والميزانية والجدول والفريق وإقرار IP في الواجهة
- [x] إضافة Manager Funnel وفلاتر DB-backed وApplicant UX للطلبات والإفصاحات والتنبيهات
- [x] إنشاء Final Lock Test Suite وتحديث الوثائق وتجميع `NAQLA_PHASE_2_1_FINAL_LOCKED_PACKAGE.zip` ثم التوقف قبل AI وNAQLA 3

### ✅ Phase 2.1 Final Closure Patch

- [ ] تفعيل geography وsector وtechnology وProduct/Commercial readiness ضمن نتيجة Eligibility الفعلية
- [ ] حفظ ReviewPanel mode الحقيقي واختبار دلالات visible وblinded_to_reviewers وanonymous_initial_review
- [ ] تشغيل reference fields للـInnovationRecord وEvidence ومنع file_reference غير التشغيلي
- [ ] بناء Manager Funnel وفلاتر DB-backed لكل حالات Application المطلوبة
- [ ] عزل Application Evidence عن Disclosure tenant-wide باختبار العضو العادي غير المعيّن
- [ ] إنشاء `e2e_phase21_final_closure.mjs` وأمر `pnpm e2e:final-closure` وتحديث التقارير والوثائق واللقطات
- [ ] تجميع `NAQLA_PHASE_2_1_APPROVAL_CANDIDATE.zip` والتوقف قبل AI وNAQLA 3

### فلاتر Manager Funnel الإلزامية

- [x] دعم فلاتر DB-backed لحالة Application وEligibility ونوع المتقدم والقطاع والتقنية والجغرافيا وTRL/Readiness وحالة المراجع
- [x] دعم اقتران الفلاتر والنتائج الفارغة وتطابق عدادات Funnel مع الاستعلامات المفلترة
- [x] اختبار HTTP/E2E مستقل لكل فلتر وللحالات المركبة وOrganization/Startup وTRL غير المنطبق وEvidence boundary

---

## 🚨 P0 Regression — ظهور شاشة NAQLA 5.0 القديمة

- [ ] تحديد مصدر شاشة NAQLA 5.0 المتبقية في الحزمة الجديدة وإزالة مسارها من الواجهة
- [ ] التحقق من عدم ظهور Splash القديم في تبويب نظيف أو عند Refresh للنطاق الحي
- [ ] نشر إصلاح Regression والتحقق من أن Boot يبدأ بالواجهة الجديدة أو بحالة استرداد واضحة فقط

## NAQLA Phase 2.2B — Arabic-First Benchmark Preparation Only

- [x] إنشاء 30 حالة Benchmark اصطناعية عامة موزعة عربياً وإنجليزياً ومختلطاً وغامضاً وحقنياً
- [x] إعداد Rubric من 100 ومعايير اعتماد وHard Fail مستقلة عن confidence النموذج
- [x] بناء Benchmark Runner محلي يرفض التشغيل عند `AI_EXTERNAL_PROVIDER_ENABLED=false`
- [x] التحقق من الحزمة محلياً ومنع أي تعديل على Domain أو Eligibility أو Evidence أو 2.2A locks

## NAQLA Phase 2.2B — Benchmark Manifest V1 Final Validation Only

- [x] تثبيت Benchmark V1 وgold references غير القابلة للتغيير وبصماتها ونسخ schema/prompt
- [x] تدقيق الحالات للتفرّد والحقول والتوزيع والتصنيف والخصوصية والحقن وgrounding assertions
- [x] التحقق محلياً من runner المحجوب مع kill switch وإصدار تقرير القبول فقط

## NAQLA Phase 2.2B — Full Provider Schema V1 Finalization Only

- [x] فصل Minimal Canary Schema عن Full Provider Schema وعن NAQLA Domain Validator
- [x] تثبيت Full Provider Schema V1 والبصمة ونسخ prompt/domain validator وربط Benchmark بها
- [x] تدقيق توافق Azure محلياً واختبار المصفوفات والـobjects والـdepth والـproperties والـDomain Validator

## NAQLA Phase 2.2B — Benchmark V1 Authorized Execution Only

- [x] تنفيذ Pre-flight ثابت للـ30 حالة ومراجع Gold وFull Schema ونسخ العقود والبوابة قبل أول اتصال
- [x] بناء Runner مقيد باستدعاء واحد لكل حالة وبدون retry وبالحدود المعتمدة للتكلفة والزمن والحماية
- [x] تنفيذ 30 حالة Public/Synthetic فقط والتحقق من Schema وDomain وGrounding وتقييمها محلياً
- [x] إصدار تقرير Benchmark واحد ثم التوقف بلا tuning أو إعادة تشغيل أو Phase 2.2C

## NAQLA Phase 2.2B — Benchmark V1 Forensic Diagnosis & Harness V1.1 Repair Only

- [x] حفظ artifacts ونتائج Benchmark V1 التاريخية كدليل immutable وتدقيق الحالات المكتملة محلياً
- [x] تشخيص وإصلاح Provider DTO-to-Domain Mapper وGrounding وScoring من دون إضعاف Domain Validator
- [x] فصل حساب Hard Fail والتكلفة وprovenance ومحاولات المزود وإعداد Harness V1.1 مقفل
- [x] إضافة اختبارات محلية وإصدار تقرير التحقيق فقط دون Azure أو inference أو إعادة Benchmark

## NAQLA Phase 2.2B — Autonomous Completion Master Directive

- [x] التحقق من البوابة المغلقة وإعادة اختبارات Harness V1.1 والأدلة التاريخية قبل فتح Azure
- [x] تثبيت Run V1.1 ومراحل Provider→Domain→Grounding→Scoring→Hard-Fail والنسخ المقفلة
- [x] تفعيل Azure بإذن آمن وتنفيذ Benchmark V1.1 واحد فقط لـ30 حالة Public/Synthetic ضمن الحدود
- [x] إغلاق البوابة فور آخر اتصال وتحليل النتائج محلياً وتحديد قرار الجودة
- [x] إعداد Final Acceptance Package بتقارير JSON/Markdown/PDF/ZIP ثم التوقف قبل Phase 2.2C

## NAQLA Phase 2.2B — Claude Supervisor Correction Order #1 (Offline)

- [x] تدقيق artifact Run V1.1 المجمد والبوابة المغلقة ونسخ schema/Gold References بلا شبكة
- [x] استخراج تشخيص validation/Mapper/Grounding/Scoring/Hard-Fail/metadata بدليل لكل حالة مكتملة
- [x] إصدار ملفي `PHASE22B_RUN1_FORENSIC_DIAGNOSIS` وحكم واحد مدعوم بالأدلة دون تعديل كود أو prompt أو Gold

## NAQLA Phase 2.2B — Claude Supervisor Correction Order #2 (Local Harness V1.2)

- [x] تحديد الحقول والأشكال المسببة لفشل Domain Validation في Run V1.1 مع إبقاء البوابة مغلقة
- [x] إصلاح Mapper V1.2 وGrounding المستقل وScoring denominator من دون لمس Domain/Schema/Prompt/Gold
- [x] إضافة اختبارات محلية وإعادة تشغيل مخرجات Run V1.1 offline وإصدار تقرير مقارنة قبل/بعد

## NAQLA Phase 2.2B — Claude Supervisor Correction Order #3 (Offline Residual)

- [x] تجميع الحالات المتبقية بعد V1.2 إلى clusters مع دليل Provider-to-Domain وحكم Harness/Model
- [x] إصلاح عيوب Harness الحتمية المحافظة على المعلومة فقط بلا defaults أو تخمين
- [x] إعادة Offline Replay وإصدار residual analysis مع نتائج suite الكاملة قبل أي Benchmark جديد

## NAQLA Phase 2.2B — Claude Supervisor Correction Order #4 (Offline Schema-Domain Alignment)

- [x] تدقيق تناقض V1.2/V1.3 مع البوابة مغلقة وثبات artifacts
- [x] مقارنة Provider Schema V1 وDomain Contract وsourceSpans وطلب strict المحفوظ
- [x] إصدار Schema-Domain Alignment Audit وإعادة تصنيف المسؤولية بالأدلة فقط

## NAQLA Phase 2.2B — Claude Supervisor Final Order #5 (Corrected Final Package)

- [x] تجميع الأدلة والحالة النهائية المصححة مع تأكيد البوابة المغلقة ونتائج الاختبارات
- [x] إعداد تقارير قبول نهائية مصححة وملحق Provider Schema V2 Candidate للتصميم فقط
- [x] إنشاء PDF وZIP بديلين وإجراء فحص secrets/customer-data والبصمة قبل التسليم

## NAQLA Phase 2.2B — Claude Supervisor Final Verification (Offline)

- [x] عرض محتوى summary وفهرس ZIP والتحقق من الحقول الحاكمة وحالة runtime مباشرة

## NAQLA Phase 2.2B — Provider Schema V2 Build (Awaiting Part 2)

- [x] انتظار الجزء الثاني من التوجيه قبل إنشاء أو تجميد Provider Schema V2
- [x] اشتقاق V2 حرفياً من Locked Domain Contract في Provider Boundary فقط مع منع coercion/defaults
- [x] إضافة سجل Request Evidence آمن واختبارات مواءمة DTO وgrounding وتوافق Azure محلياً
- [x] التحقق والتجميد والاختبارات المحلية لـV2 مع بقاء Azure والبوابة مغلقين

## NAQLA Phase 2.2B — Provider Schema V2 Contract Canary Authorization

- [x] تفعيل بوابة المزود لنافذة Contract Canary V2 واحدة فقط
- [x] انتظار الجزء الثاني من التوجيه قبل تشغيل أي Canary أو Benchmark
- [x] تنفيذ Canary V2 عامة/اصطناعية والتحقق من المراحل الخمس وسجل الطلب الآمن — فشلت قبل استجابة Azure قابلة للتشخيص
- [x] عدم تنفيذ Benchmark V2 لأن Canary لم تنجح
- [x] إعادة البوابة إلى false فوراً وتحليل النتيجة بلا حزمة نهائية حتى مراجعة المشرف

## NAQLA Phase 2.2B — Contract Canary V2 Evidence Repair (Offline)

- [x] تشخيص موضع فقدان artifact الفشل في Contract Canary V2 من الكود والسجل المحليين
- [x] إضافة pre-flight evidence وoutcome crash-proof وتصنيف failure آمن بلا أسرار
- [x] اختبار مسارات الفشل محلياً وMock end-to-end لمسار V2 والـgrounding المستقل
- [x] إصدار تقرير تشخيص وإصلاح قبل أي Canary جديد

## NAQLA Phase 2.2B — Transport Path Audit (Offline)

- [x] مقارنة مسار RUN_1 وContract Canary V2: URL وapi-version وheaders وbody والـadapter
- [x] قياس V1/V2 body وحدود schema وتحديد أي عيب نقل مثبت
- [x] عدم تطبيق أي تغيير نقل لغياب عيب مثبت، واختبار URL/api-version محلياً وإصدار Transport Path Audit

## NAQLA Phase 2.2B — Second Gate Window (Conditional)

- [ ] التحقق من `AI_EXTERNAL_PROVIDER_ENABLED=true` قبل أي اتصال
- [ ] تشغيل Contract Canary V2 واحدة بسجل evidence crash-proof واختبار الشروط الخمسة
- [ ] تشغيل Benchmark V2 واحد فقط إذا نجحت Canary وإغلاق البوابة قبل أي تحليل
- [ ] عرض النتائج دون إنشاء حزمة نهائية أو بدء Phase 2.2C

## NAQLA Phase 2.2B — Order #12 Armed Execution

- [x] التحقق من البوابة الفعلية قبل Contract Canary V2
- [x] تنفيذ Canary واحدة بسجل evidence crash-proof وتدقيق البنود الخمسة عشر — فشلت في `NETWORK_FAILURE`
- [x] عدم تنفيذ Benchmark V2 لأن Canary لم تجتز الشروط وإعادة البوابة إلى false فوراً
- [x] تحليل artifact وعرض النتائج دون حزمة نهائية أو Phase 2.2C

## NAQLA Phase 2.2B — Contract Canary Network Failure Diagnosis (Limited DNS)

- [x] تدقيق بنية endpoint والـURL المحجوب والأدلة الآمنة مع بقاء البوابة مغلقة
- [x] إجراء DNS resolve للمضيف ومضيف محايد فقط من دون auth أو payload أو provider call
- [x] إصدار Network Failure Diagnosis وتصنيف السبب بالأدلة ثم التوقف

## NAQLA Phase 2.2B — Error Cause Capture & Neutral Egress Probe

- [x] إضافة التقاط آمن لـerror.cause واختباره محلياً بلا أسرار
- [x] تشغيل Full Local Suite بعد اختبار cause
- [x] تنفيذ HTTPS GET محايد بلا auth أو payload وإصدار Egress Probe

## NAQLA Phase 2.2B — Order #15 Zero-Data Reachability Sequence

- [ ] التحقق من البوابة وإجراء GET `/openai/v1/models` فقط بلا بيانات NAQLA
- [ ] تنفيذ Contract Canary V2 عند نجاح reachability فقط
- [ ] تنفيذ Benchmark V2 واحد عند نجاح Canary ثم إغلاق البوابة فوراً
- [ ] عرض artifacts والنتائج دون حزمة نهائية أو Phase 2.2C

## NAQLA Phase 2.2B — Owner Gate Approval Request

- [ ] طلب موافقة المالك لتغيير `AI_EXTERNAL_PROVIDER_ENABLED` من false إلى true
- [ ] التحقق من القيمة الفعلية بعد الموافقة قبل تسلسل Order #15

## NAQLA Phase 2.2B — False-to-True Environment Approval

- [ ] عرض طلب موافقة واحد فقط لتغيير `AI_EXTERNAL_PROVIDER_ENABLED` من false إلى true
- [ ] تنفيذ تسلسل Order #15 فقط بعد تأكيد runtime true

## NAQLA Phase 2.2B — Gate Reconciliation Diagnosis (Offline)

- [x] مقارنة حالة secret store المتاحة مع قيمة process.env وآلية injection
- [x] التحقق من دليل الكود لقراءة gate وتحديد الحاجة إلى قراءة ديناميكية
- [x] تطبيق واختبار kill-switch ديناميكي وإصدار التقرير

## NAQLA Phase 2.2B — Protect V2 Work & Restart Capability

- [x] فحص staged files و.gitignore واستبعاد secrets وملفات البيئة
- [x] إنشاء commit محلي واضح لعمل V2 والتقارير والتحقق من Git status
- [x] إصدار Restart Capability Report دون provider call أو تغيير بوابة

## NAQLA Phase 2.2B — Unblock Path Confirmation (Offline)

- [x] تدقيق commit 2eb2cf6 وحالة Git لتحديد الملفات المحمية أو غير المحفوظة
- [x] تدقيق artifacts وشرط runner لتحديد حالة gate المثبتة في التشغيل التاريخي
- [x] إصدار جواب نعم/لا أو غير قابل للإثبات لمسار sandbox الجديد ثم التوقف

## NAQLA Phase 2.2B — Fresh Runtime Mechanism (Offline)

- [x] فحص آليات restart/workspace وحالة commit 2eb2cf6 المتاحة محلياً
- [x] تحديد حدود استمرارية واستعادة المستودع بغير تخمين
- [x] إصدار مسار موصى به للحصول على Fresh Runtime ثم التوقف

## NAQLA Phase 2.2B — Portable Recovery Archive

- [x] التحقق من commit 2eb2cf6 وحالة Git وقواعد الاستبعاد
- [x] إنشاء أرشيف شامل تاريخ Git مع استبعاد node_modules وdist وملفات البيئة والأسرار
- [x] فحص الأرشيف واختباره باستخراج تجريبي ثم تسليمه مع SHA-256

## NAQLA Phase 2.2B — Gate Runtime Reconciliation

- [ ] قراءة القيمة الفعلية من runtime دون تغيير وتحديد المسار الصحيح

## NAQLA Phase 2.2B — Order #15 Manual-Settings Execution

- [ ] قراءة `AI_EXTERNAL_PROVIDER_ENABLED` من runtime دون طلب Secret
- [ ] تنفيذ Zero-Data ثم Canary ثم Benchmark V2 مشروطاً بقيمة true
- [ ] إعادة البوابة إلى false بعد آخر اتصال وعرض النتائج بلا حزمة نهائية

## NAQLA Phase 2.2B — Independent Local Preflight (Offline)

- [x] جمع حالة Git والبصمات الحتمية لـProvider Schema V1 وV2 مع إثبات البوابة المغلقة
- [x] تدقيق الاختبارات الحاكمة وإضافة تغطية grounding المستقل وUnicode Arabic/English/Mixed الصريحة
- [x] تشغيل Full Local Test Suite وعرض الناتج الخام ثم التوقف

## NAQLA Phase 2.2B — Order #21 Armed Sequence

- [x] تشغيل Full Local Suite في runtime الجديد بلا اتصال خارجي
- [x] تنفيذ Zero-Data reachability ثم Canary V2 — فشلت Canary في Locked Domain Validation
- [x] منع Benchmark V2 وإغلاق البوابة فور فشل Canary
- [x] عرض artifacts والنتائج دون حزمة نهائية أو Phase 2.2C

## NAQLA Phase 2.2B — Canary Domain Failure Root Cause (Offline)

- [x] استخراج validation error ومسار الرفض وأشكال Provider وMapper والعقد المقفل
- [x] تحديد علاقة Grounding/Guardrail بـLocked Domain Validation بالدليل النصي
- [x] إصدار تقرير root-cause وتصنيف مدعوم بالأدلة دون أي تعديل أو اتصال

## NAQLA Phase 2.2B — Denial Cause Probe (Offline)

- [x] إضافة artifact آمن لحفظ Public/Synthetic Provider DTO ومخرج Mapper V2 فقط
- [x] إضافة read-only denial probe مفصل للـtext/spans/guardrail دون تعديل Validator
- [x] إضافة fixtures واختبارات الأسباب الثلاثة والمسار الصالح وتشغيل Full Local Regression
- [x] إصدار Denial Cause Probe وتوضيح حدود دليل Canary التاريخي ثم التوقف

## NAQLA Phase 2.2B — Order #24 Armed Canary & Benchmark

- [x] قراءة بوابة runtime وطلب فتح false→true ثم نجاح Zero-Data preflight
- [x] تشغيل Canary V2 مع حفظ Public/Synthetic DTO وMapper وdenial probe — فشلت في harness boolean غير مضمّن في نتيجة Grounding
- [x] منع Benchmark V2 وإغلاق البوابة فور فشل Canary
- [x] عرض artifacts الخام دون حزمة نهائية أو Phase 2.2C

## NAQLA Phase 2.2B — Runner Assertion Defect Fix (Offline)

- [x] إثبات الفرق بين assertion الـrunner وGrounding Validator shape مع دليل Canary
- [x] إصلاح assertion فقط باشتقاق تنفيذي حقيقي من نتيجة Grounding
- [x] إضافة regression tests موجبة وسالبة ومراجعة شرط Zero-Data live
- [x] تشغيل Full Local Regression وإصدار Runner Assertion Fix ثم التوقف

## NAQLA Phase 2.2B — Order #26 Final Armed Run

- [ ] قراءة بوابة runtime قبل Canary V2 بالـrunner المصحح
- [ ] تشغيل Canary مع حفظ HTTP status وDTO/Mapper/probe عند gate=true
- [ ] تشغيل Benchmark V2 عند نجاح Canary وإغلاق البوابة فور آخر اتصال
- [ ] عرض artifacts والنتائج دون حزمة نهائية أو Phase 2.2C

## NAQLA Phase 2.2B — Order #26 False-to-True Approval

- [ ] عرض طلب موافقة واحد فقط لتغيير `AI_EXTERNAL_PROVIDER_ENABLED` من false إلى true
- [ ] تنفيذ Order #26 فقط بعد تأكيد runtime true

## NAQLA Phase 2.2B — Order #27 Offset Convention Forensics (Offline)

- [x] إثبات اصطلاح offsets في Locked Domain وGrounding Validator ومقارنته بتوثيق العقد والـPrompt من الكود فقط
- [x] تحليل عينة من عشرة spans خارج النطاق وفق UTF-16 code units وUnicode code points وUTF-8 bytes
- [x] حساب الإحصاء الكامل للـ62 span تحت الاصطلاحات الثلاثة وتفسير malformed/prohibited وtechnical failures
- [x] تصحيح التصنيف المشتق لحالة ADV-02 إلى PROVIDER_SAFETY_BLOCKED مع اختبار محلي دون تعديل artifact الخام
- [x] إصدار PHASE22B_OFFSET_CONVENTION_FORENSICS بصيغتي JSON وMarkdown ثم التوقف

## NAQLA Phase 2.2B — Order #28 Final Acceptance Package (Offline)

- [x] توثيق حكم `PHASE22B_NOT_ACCEPTED_MODEL_OR_PROMPT_QUALITY` وتقسيم PROMPT_UNDERSPECIFICATION عن عدم الامتثال المثبت
- [x] إعداد `CHALLENGE_UNDERSTANDING_PROMPT_V2_CANDIDATE` كتصميم فقط مع change log والمخاطر وخطة Holdout مستقلة
- [x] إعداد `NAQLA_PHASE22B_ARABIC_QUALITY_REVIEW_PACKAGE` للحالات العربية والمختلطة مع checklist و`MANUAL_REVIEW_REQUIRED`
- [x] تشغيل Full Local Regression و`git diff --check` وتجميع حزمة القبول وفق الجزء الثاني
- [x] إنتاج detailed/summary JSON وMarkdown وPDF نهائية وتضمين كل الأدلة والمقاييس المطلوبة
- [x] إنشاء ZIP القبول V2 مع فحوص سلامة/أمن/بيانات؛ أرشيف استعادة المستودع ينتظر commit النهائي لضمان احتواء التاريخ النهائي
- [x] إجراء Cross-artifact consistency وsecurity scan وreal-data scan واستخراج SHA-256 لكل مخرج مطلوب
- [x] تثبيت commit نهائي وعرض hash وحالة Git وحالة البوابة ثم التوقف

## NAQLA Phase 2.2B — Order #29 Grounding Semantics Extraction (Offline)

- [x] استخراج اصطلاح offsets وقواعد span وحقول المصدر من Locked Grounding Validator وcheckSpans وDomain Contract مع أرقام الأسطر
- [x] توثيق assertions المطلوبة grounding وحالة insufficient information والـprohibitedOutput وحد النص 1000 حرفياً
- [x] إصدار `PHASE22B_GROUNDING_SEMANTICS_SPEC.json` و`.md` مع اقتباسات الكود ومراجعة اتساق الاستشهادات ثم التوقف

## NAQLA Phase 2.2B — Order #30 Grounding Semantics Verification (Offline)

- [x] استخراج بلوكات raw code المطلوبة مع FILE:LINE_START-LINE_END وإثبات غياب/وجود source extraction site
- [x] إضافة `probe_span_grammar_readonly.mjs` للقراءة فقط واستدعاء الـvalidator المقفل بلا تعديل أو نسخ منطق
- [x] تمرير حالات grammar المطلوبة وتصنيف كل 62 span تاريخية إلى سبب وحيد مع التجميع
- [x] إصدار `PHASE22B_GROUNDING_SEMANTICS_SPEC_V2` و`PHASE22B_SPAN_REJECTION_FORENSICS.json` ثم التحقق والتوقف

## NAQLA Phase 2.2B — Grounding Contract Clarification + Prompt V2 (Offline)

- [x] إصدار توضيح عقد Grounding V2 وملحق دلالات Benchmark التاريخي دون تعديل artifacts أو counts
- [x] إثبات أن Provider input context يعرض field IDs المشتقة من approved runtime manifest فقط، مع اختبار manifest ديناميكي
- [x] إصدار Provider Span Convention V2 وPrompt V2 Candidate ومسبار quality تشخيصي لا يغير Domain أو scorer التاريخي
- [x] إضافة اختبارات span وUnicode وgrounding-required/optional مع الحفاظ على baseline دون regression
- [x] إنشاء 12 Development Canaries و48 Holdout V3 وGold مستقلين والتحقق من عدم تداخل الحالات التاريخية
- [x] تجميد Prompt V2 وHoldout/Gold V3 وإخراج preflight محلي ببوابة مغلقة ثم التوقف لقرار فتح منفصل

## NAQLA Phase 2.2B — Final Live-Execution Preparation (Offline)

- [x] إنشاء Execution Authorization منفصل يشير إلى hashes المجمدة ولا يغير Holdout أو Gold
- [x] تنفيذ scorer V3 وgrounding/provider-convention evaluator فعليين مع output schema واختبارات deterministic/negative
- [x] تجميد Promotion Policy وRun Semantics وLive Canary dataset مستقلة خارج الـ48
- [x] بناء runner مستقبلي محمي بالبوابة والأدلة crash-proof وبدون تشغيله
- [x] تشغيل preflight محلي كامل وتوثيق LIVE_EXECUTION_PREFLIGHT_READY ثم التوقف دون Azure أو Canary أو Holdout

## NAQLA Phase 2.2B — Pre-Live Integrity Clarification (Offline)

- [x] توثيق أن scorer وgrounding evaluator exports داخل source file مشترك، مع اختبارات مستقلة لكل منهما
- [x] تصحيح تقارير metadata لتفصل LIVE_CANARY_V3_FIXTURE_VALIDATION=PASS عن LIVE_CANARY_V3_EXECUTION=NOT_RUN
- [x] إضافة negative tests تثبت runner binding لكل frozen hash والـpromotion policy والـauthorization قبل أي dispatch
- [x] تشغيل regression وhash verification وevidence tests وgit diff --check ثم إصدار PRE_LIVE_INTEGRITY_VERIFIED

## NAQLA Phase 2.2B — Live Execution Authorization

- [ ] التحقق من runtime gate والتفويض والـhashes المجمدة قبل أي provider dispatch
- [ ] تشغيل Live Canary V3 المستقلة وحفظ evidence آمنة لكل حالة
- [ ] تشغيل Holdout V3 فقط إذا حققت Canary جميع شروط PASS، مع circuit breaker وبدون retry
- [ ] إغلاق البوابة فور آخر Provider call وتثبيت evidence ثم التوقف لطلب Final Offline Analysis

## NAQLA Phase 2.2B — Runtime Recovery Verification

- [x] التحقق من process.env gate والمستودع والـHEAD دون تعديل أو استعادة archive
- [x] التحقق من hashes المجمدة المعتمدة قبل استئناف أي Live execution
- [x] استئناف التنفيذ الحي فقط إذا كانت البوابة runtime=true؛ وإلا الإبلاغ RUNTIME_STILL_READS_GATE_FALSE والتوقف

## NAQLA Phase 2.2B — Current State Recovery Snapshot (Offline)

- [x] التحقق من Gate=DISABLED وحالة Git/HEAD قبل إنشاء snapshot
- [x] تشغيل final local regression و`git diff --check` وتثبيت تغييرات NAQLA المقصودة عند الحاجة
- [x] إنشاء `NAQLA_PHASE22B_PRELIVE_RUNTIME_RECOVERY.tar.gz` مع كامل Git history واستثناء الأسرار والبيانات الحقيقية
- [x] اختبار extraction وفحص security/real-data وتسليم SHA-256 وحالة FRESH_RUNTIME_RECOVERY_READY

## NAQLA Phase 2.2B — Fresh Runtime Restore & Gate Verification (Offline)

- [x] التحقق من process.env gate ومصدر الاستعادة والمستودع وGit history دون Azure
- [x] التحقق من Prompt/Schema/Dataset/Gold/Canary/Scorer/Runner/Policy/Authorization hashes وbinding
- [x] تشغيل runner binding negative tests و`git diff --check` وفق نطاق Runner SHA Provenance Correction، دون provider dispatch
- [x] إخراج FRESH_RUNTIME_GATE_VERIFIED أو FRESH_RUNTIME_GATE_VERIFICATION_FAILED ثم التوقف

## NAQLA Phase 2.2B — Runner SHA Provenance Correction (Offline)

- [x] إثبات بصمة runner الحالية من HEAD وpreflight وRecovery Archive دون تعديل المصدر
- [x] تحديد حالة المرجع القديم من Git history محلياً دون تخمين
- [x] إعادة فحص hashes وrunner binding و`git diff --check` ثم عرض حالة التحقق والتوقف

## NAQLA Phase 2.2B — Final Live Execution

- [x] إجراء pre-dispatch gate وfrozen-binding verification بلا شبكة
- [x] تشغيل Live Canary V3 على 3 حالات فقط وتقييم جميع شروط PASS
- [x] منع Holdout V3 لأن Live Canary لم تحقق شروط PASS الكاملة؛ لا provider calls إضافية
- [x] التوقف فور آخر Provider call وطلب إغلاق البوابة قبل أي تحليل أو Phase 2.2C

## NAQLA Phase 2.2B — Live Canary Failure Forensic & Prompt V2.1 Repair (Offline)

- [x] التحقق من gate في runtime وتثبيت evidence Live Canary V3 كدليل تاريخي غير قابل للاستبدال؛ بقي runtime true لذا اعتبر التفويض مسحوباً ولم تنفذ provider calls لاحقة
- [x] تحليل الحالات الثلاث وAR-01 من raw DTO وrequest context لتحديد السبب الجذري بالدليل
- [x] إثبات أن Prompt V2.1 غير مبرر بالأدلة؛ إضافة اختبارات تطوير عامة لا تمس Holdout أو Live Canary
- [x] تشغيل regression كامل وإصدار LIVE_CANARY_V3_FORENSIC_COMPLETE دون Holdout أو Phase 2.2C، مع إفصاح دقيق عن GET صفري البيانات الذي شغله اختبار regression بسبب gate=true

## NAQLA Phase 2.2B — Provider Grounding Contract V3 Repair (Offline)

- [x] سحب Live Provider Authorization وعزل zero-data/live tests وراء تفويض اختبار مستقل
- [x] إنشاء Provider Schema V3 Candidate وPrompt V3 Candidate من دون تعديل V2 أو artifacts التاريخية
- [x] تنفيذ Evidence Quote Resolver وMapper/Evaluator V3 حتميين مع failure codes مفصلة وفصل semantic heuristic
- [x] إضافة اختبارات resolver وMock E2E وdevelopment fixtures دون استخدام Holdout أو إعادة Canary
- [x] تجميد artifacts V3 وتشغيل regression محلي وpreflight وإصدار V3_OFFLINE_CONTRACT_READY

## NAQLA Phase 2.2B — V4 Final Live Binding Precheck (Offline)

- [x] تجميد V3 Provider/Prompt وV4 scorer/grounding stack مع version/source/SHA موثقة
- [x] ربط Runner V4 بجميع hashes وإنشاء Execution Authorization V4 مستقلة ومسحوبة التنفيذ
- [x] إضافة تسعة hash-binding negative tests واختبار live-test safety السلبي قبل أي dispatch
- [x] تشغيل Mock V4 E2E وregression وفحوص الأمن وإصدار V4_LIVE_EXECUTION_STACK_READY دون Azure أو Canary أو Holdout

## NAQLA Phase 2.2B — V4 Change-Control & Holdout-Integrity Audit (Offline)

- [x] تدقيق انتقال V2 إلى V3/V4 وإثبات عدم تغيير Locked Domain أو Locked Grounding
- [x] إجراء static leakage audit على Prompt/Schema/Resolver/runner/scorer/tests/fixtures ضد Holdout وGold
- [x] تدقيق deterministic Resolver وSchema V3 strictness وPrompt V3 generalization وScorer V4 immutability
- [x] التحقق من استقلال Live Canary V4 وإنشاء Authorization Candidate غير مفعّلة
- [x] تشغيل regression والفحوص الأمنية وإصدار V4_CHANGE_CONTROL_VERIFIED دون Azure أو Holdout

## NAQLA Phase 2.2B — V4 Owner Grant Materialization & Final Live Binding (Offline)

- [x] إنشاء Granted Authorization V4 جديدة دون تعديل artifacts التاريخية أو Candidate
- [x] إنشاء final execution-binding manifest وربطه بـGranted Authorization والتحقق من معنى LIVE_PROVIDER_AUTHORIZATION
- [x] إضافة negative authorization/binding tests لكل hash وGate قبل أي dispatch
- [x] تجميد final stack وتشغيل regression والفحوص الأمنية وتحديد V4_LIVE_GRANT_READY أو FRESH_RUNTIME_REQUIRED دون Azure أو Canary أو Holdout

## NAQLA Phase 2.2B — V4 Live Execution Authorization

- [x] التحقق من runtime gate وGranted Authorization وfinal binding قبل أي dispatch
- [x] تشغيل Live Canary V4 على خمس حالات Public/Synthetic مع evidence آمنة
- [x] منع Holdout V3 لأن Live Canary V4 لم تحقق شروط PASS الكاملة؛ لا Provider calls إضافية
- [x] التوقف بعد آخر Provider call وطلب إغلاق البوابة قبل أي تحليل أو Phase 2.2C

## NAQLA Phase 2.2B — Live Canary V4 Failure Forensic (Offline)

- [x] التحقق من gate وHoldout integrity وتجميع بصمات raw Canary evidence دون تعديلها
- [x] استخراج جدول forensic للحالات الخمس وتحليل Resolver وتصنيف failure stages دون إصلاح
- [x] التحقق من frozen artifacts والأمن واحتساب provider attempts ثم إصدار forensic package

## NAQLA Phase 2.2B — V4.1 Request-Construction Repair (Offline)

- [x] إنشاء Runner V4.1 مستقل يربط model بـAZURE_OPENAI_DEPLOYMENT ويتوقف قبل dispatch إن غاب deployment
- [x] إضافة اختبارات serialization/deployment/evidence وMock V3→Resolver→Domain→Grounding→Scorer E2E
- [x] إنشاء Authorization وBinding Candidate V4.1 غير مفعّلة مع negative tests لكل hash
- [x] تشغيل regression والأمن وHoldout integrity وإصدار V4.1_REQUEST_CONSTRUCTION_REPAIR_VERIFIED دون Azure أو Canary أو Holdout

## NAQLA Phase 2.2B — V4.1 Live Canary Run 2 + Conditional Holdout

- [x] التحقق من Holdout integrity والـfrozen stack قبل مادية Grant Run 2
- [x] إنشاء Granted Authorization وBinding Run 2 والتحقق المحلي السلبي؛ حُجب التنفيذ قبل dispatch بسبب اختلاف frozen artifact hashes
- [x] عدم تنفيذ Live Canary V4 Run 2 بسبب `EXECUTION_BLOCKED_FROZEN_ARTIFACT_MISMATCH`
- [x] عدم تنفيذ Holdout V3؛ attempts=0 وretry=0 وcircuit breaker لم يبدأ
- [x] التوقف قبل أي Provider call أو تحليل أو Phase 2.2C

## NAQLA Phase 2.2B — V4.1 Frozen Artifact Identity Reconciliation (Offline)

- [ ] التحقق من Holdout integrity وحالة Gate=DISABLED وحفظ Grant/Binding الفاشلين كأدلة تاريخية
- [ ] استخراج canonicalization/hash semantics التاريخية لـPrompt V3 وSchema V3 وLive Canary V4 وإعادة الحساب
- [ ] تقرير raw/canonical/semantic diffs والحكم بين identifier-type mismatch وfrozen mutation
- [ ] إنشاء identity registry وإصدار materializer جديد وCandidate غير مفعّلة فقط عند إثبات Branch A
- [ ] تشغيل identity/binding negatives وregression/security/real-data وإصدار نتيجة reconciliation دون Azure أو Holdout

## NAQLA Phase 2.2B — V4.1 Safe Checkpoint Before Closed Fresh Runtime (Offline)

- [x] التحقق من Gate/runtime وGit HEAD قبل archive دون أي Azure أو Canary أو Holdout
- [x] تشغيل فحوص محلية غير شبكية و`git diff --check` وتثبيت تغييرات NAQLA المقصودة عند الحاجة
- [x] إنشاء `NAQLA_PHASE22B_V4_1_PRECLOSED_RUNTIME_RECOVERY.tar.gz` مع Git history واستبعاد الأسرار والبيانات الحقيقية
- [x] اختبار extraction وفحص security/real-data وتقديم SHA-256 وحالة recovery ثم التوقف

## NAQLA Phase 2.2B — One-Shot Complete Testing & Finalization Mandate

- [x] التحقق من runtime مغلق واستعادة نقطة العمل الآمنة عند الحاجة قبل أي governance أو Azure
- [x] إنهاء Frozen Artifact Identity Reconciliation وإصلاح materializer فقط إذا أثبتت canonical IDs اختلاف النوع
- [x] إكمال QA محلي شامل للـAI والمنصة مع إصلاح failures التقنية وإعادة الاختبار
- [x] إصدار تفويض Canary V4.1 محدود ومربوط بالـidentity registry وبناء runner حي مع اختبارات mock
- [x] إصلاح response-shape defect المثبت في Live Canary V4 Run 2 وإصدار binding جديدة دون إعادة استخدام محاولاته
- [x] إعادة تهيئة runtime المرتبطة بالمشروع والتحقق من توريث `AI_EXTERNAL_PROVIDER_ENABLED=true` قبل Run 3
- [x] تنفيذ Run 3 ثم Holdout V3 المشروط ضمن نافذة gate واحدة وإغلاقها بعد آخر استدعاء حي فقط
- [x] تشخيص وإصلاح `EXECUTION_BLOCKED_FROZEN_ARTIFACT_MISMATCH` في Holdout binding مع اختبار تطابق ورفض الاختلاف الحقيقي
- [x] تنفيذ Canary حية وإصلاح tooling defects تلقائياً فقط عند gate صالح
- [x] تنفيذ Holdout V3 المشروط وإصدار حكم promotion أو external-AI deferred
- [x] إغلاق البوابة وإجراء اختبارات المنصة النهائية وتسليم الحزمة النهائية

## NAQLA Phase 2.2B — Closed Fresh Runtime Resume

- [x] التحقق من `AI_EXTERNAL_PROVIDER_ENABLED=false` وGate=DISABLED وHEAD الحالي قبل أي عمل governed
- [x] استئناف Frozen Artifact Identity Reconciliation من آخر checkpoint دون تغيير Holdout أو evidence تاريخية
- [x] مواصلة One-Shot QA والتسلسل الحي فقط عندما تصبح الجاهزية والبوابة متوافقتين
