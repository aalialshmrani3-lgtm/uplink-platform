# TODO - التكامل الكامل بين UPLINK 1 → 2 → 3

## Phase 1: نظام النقل التلقائي من UPLINK 1 → UPLINK 2
- [x] إضافة حقل `status` في جدول `ideas` (pending, approved, rejected, transferred_to_uplink2)
- [x] إنشاء workflow تلقائي: عند تقييم الفكرة (≥70%) → نقلها تلقائياً لـ UPLINK 2
- [x] إنشاء جدول `idea_transitions` لتتبع الانتقالات
- [ ] إضافة notification للمستخدم عند النقل التلقائي

## Phase 2: نظام المطابقة الذكي (AI-powered Matching) في UPLINK 2
- [x] إنشاء جدول `organizations` (الجهات الحكومية، الشركات، الجمعيات، الهيئات)
- [ ] إنشاء جدول `matching_profiles` (ملفات المطابقة)
- [ ] إنشاء جدول `matches` (المطابقات)
- [x] بناء AI Matching Engine باستخدام Claude API
- [ ] المطابقة التلقائية مع:
  * الجهات الحكومية المهتمة
  * الشركات المناسبة
  * الجمعيات والهيئات
  * المستثمرين
  * القطاع المناسب
- [ ] إضافة صفحة "المطابقات" للمستخدم
- [ ] إضافة notification عند حدوث مطابقة

## Phase 3: نظام النقل التلقائي من UPLINK 2 → UPLINK 3
- [x] إضافة حقل `match_status` في جدول `matches` (pending, approved, rejected, transferred_to_uplink3)
- [x] إنشاء workflow تلقائي: عند موافقة الطرفين → نقل تلقائي لـ UPLINK 3
- [ ] إنشاء Smart Contract تلقائياً عند النقل
- [ ] إضافة notification للطرفين عند النقل

## Phase 4: نظام العقود والدفع الكامل في UPLINK 3
- [x] إضافة أنواع العقود:
  * شراء الحل (Solution Purchase)
  * شراء التصريح/الترخيص (License)
  * الاستحواذ الكامل (Full Acquisition)
- [x] إضافة نظام الدفع:
  * Milestone-based Payment
  * Escrow Release
  * Smart Contract Execution
- [ ] إضافة صفحة اختيار نوع العقد
- [ ] إضافة صفحة تفاصيل الدفع

## Phase 5: Dashboard موحد لتتبع التقدم
- [x] إنشاء صفحة "رحلتي" (My Journey)
- [x] عرض التقدم الحالي (UPLINK 1/2/3)
- [ ] عرض المطابقات الحالية
- [ ] عرض العقود النشطة
- [ ] عرض Milestones والدفعات

## Phase 6: اختبار وحفظ Checkpoint
- [x] اختبار التدفق الكامل من البداية للنهاية
- [ ] إصلاح أي أخطاء
- [ ] حفظ checkpoint نهائي
