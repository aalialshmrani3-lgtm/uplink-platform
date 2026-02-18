# UPLINK 5.0 - TODO

## 🔥 المهمة الحالية: تنفيذ الانتقال الفعلي من UPLINK 1 إلى UPLINK 2 و UPLINK 3

### Phase 1: إضافة procedures للانتقال في routers.ts ✅
- [x] `setUserChoice` procedure موجود مسبقاً في routers.ts ✅
- [x] يستدعي `promoteToUplink2` عند choice='uplink2' ✅
- [x] يستدعي `promoteToUplink3` عند choice='uplink3' ✅
- [x] ينشئ project في UPLINK 2 تلقائياً ✅
- [x] ينشئ asset في UPLINK 3 تلقائياً ✅

### Phase 2: تحديث الأزرار في Uplink1IdeaAnalysis.tsx ✅
- [x] استبدال Link بـ Button مع onClick handler ✅
- [x] استدعاء setUserChoice مع choice='uplink2' ✅
- [x] استدعاء setUserChoice مع choice='uplink3' ✅
- [x] إضافة loading states (isPromoting + Loader2) ✅
- [x] إضافة error handling (try/catch) ✅
- [x] إضافة toast notifications (success/error) ✅
- [x] الانتقال إلى الصفحة المناسبة بعد النجاح ✅

### Phase 3: اختبار وحفظ checkpoint
- [ ] اختبار الانتقال من UPLINK 1 → UPLINK 2
- [ ] اختبار الانتقال من UPLINK 1 → UPLINK 3
- [ ] التحقق من إنشاء project/asset بنجاح
- [ ] حفظ checkpoint نهائي
