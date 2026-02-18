# UPLINK 5.0 - TODO

## 🔥 المهمة الحالية: تنفيذ الخطوات الثلاثة المقترحة

### Phase 1: إضافة Timeline component لتتبع رحلة المستخدم
- [ ] إنشاء Timeline component جديد في `client/src/components/IdeaJourneyTimeline.tsx`
- [ ] إضافة database table `ideaJourneyEvents` لتخزين الأحداث
- [ ] إضافة procedure `getIdeaJourney` في routers.ts
- [ ] إضافة Timeline في صفحة Uplink1IdeaAnalysis.tsx
- [ ] عرض الأحداث: تقديم الفكرة، التحليل، الانتقال لـ UPLINK 2/3
- [ ] إضافة timestamps وحالة كل مرحلة

### Phase 1: إضافة حقل ملاحظات في dialog التأكيد ✅
- [x] إضافة userChoices و ideaJourneyEvents tables ✅
- [x] إضافة Textarea في AlertDialog ✅
- [x] إضافة state لتخزين ملاحظات المستخدم (userNotes) ✅
- [x] تحديث `setUserChoice` mutation لإرسال الملاحظات ✅
- [x] حفظ الملاحظات في userChoices table ✅
- [x] حفظ حدث في ideaJourneyEvents ✅
- [ ] عرض الملاحظات في صفحة المشروع/الأصل

### Phase 3: إضافة إحصائيات الانتقال المتقدمة في Dashboard
- [ ] إنشاء صفحة `/analytics/transition-stats`
- [ ] إضافة procedure `getTransitionStats` في routers.ts
- [ ] عرض معدل التحويل (UPLINK 1 → 2 vs 1 → 3)
- [ ] عرض الوقت المستغرق في كل مرحلة
- [ ] عرض المسارات الأكثر شيوعاً (Sankey Diagram)
- [ ] إضافة فلاتر زمنية (آخر 7/30/90 يوم)

### Phase 4: حفظ checkpoint نهائي
- [ ] حفظ checkpoint نهائي
