# UPLINK 5.0 - الرحلة الكاملة (Full Journey)

**المهمة:** تنفيذ الرحلة الكاملة من التسجيل → UPLINK 1 → UPLINK 2 → UPLINK 3

---

## 🎯 **نظرة عامة على الرحلة:**

```
التسجيل (6 أنواع)
    ↓
UPLINK 1: قدّم ابتكارك + تقييم AI
    ↓
    ├─→ <60% → ترجع للمقدم (Guidance)
    │
    └─→ ≥60% → خيار المستخدم:
            ├─→ UPLINK 2 (البحث عن فرص)
            └─→ UPLINK 3 (البيع مباشرة)
    ↓
UPLINK 2: المطابقة والتوافق
    ↓
    عند نجاح الاتفاق
    ↓
UPLINK 3: البورصة والاستحواذ
```

---

## ✅ Phase 1: تحديث todo.md بالخطة الكاملة
- [x] إنشاء todo.md جديد مع الخطة الكاملة ✅

---

## 📝 Phase 2: UPLINK 1 - إضافة خيار المستخدم بعد التقييم

### Backend Tasks:
- [ ] تحديث schema: إضافة `user_choice` في ideas table (enum: 'uplink2', 'uplink3', null)
- [ ] تطبيق db:push
- [ ] إنشاء procedure `setUserChoice` في routers.ts
  - Input: ideaId, choice ('uplink2' أو 'uplink3')
  - Output: success, message
- [ ] تحديث submitIdea procedure:
  - إذا overallScore < 60% → status = 'revision_needed', إرجاع توصيات
  - إذا overallScore ≥ 60% → status = 'analyzed', انتظار اختيار المستخدم

### Frontend Tasks:
- [ ] تحديث AIAnalysisResults.tsx:
  - إذا <60% → عرض "فكرتك تحتاج تطوير" + التوصيات
  - إذا ≥60% → عرض خيارين:
    - "الانتقال إلى UPLINK 2 للبحث عن فرص"
    - "الانتقال مباشرة إلى UPLINK 3 للبيع"
- [ ] إضافة أزرار الاختيار مع icons
- [ ] إضافة modal تأكيد الاختيار
- [ ] استدعاء setUserChoice عند الاختيار

### Testing:
- [ ] اختبار <60% → revision_needed
- [ ] اختبار ≥60% → عرض الخيارات
- [ ] اختبار اختيار UPLINK 2
- [ ] اختبار اختيار UPLINK 3

---

## 🔄 Phase 3: UPLINK 1 → UPLINK 2 (الانتقال التلقائي)

### Backend Tasks:
- [ ] تحديث server/uplink1-to-uplink2.ts:
  - إصلاح promoteToUplink2() function
  - إضافة createProject() في db.ts إذا لم يكن موجوداً
  - إضافة updateIdea() في db.ts لتحديث uplink2ProjectId
- [ ] إنشاء procedure `promoteToUplink2` في routers.ts:
  - Input: ideaId
  - Logic: استدعاء promoteToUplink2() من uplink1-to-uplink2.ts
  - Output: projectId, suggestedChallenges, message
- [ ] تحديث setUserChoice procedure:
  - إذا choice === 'uplink2' → استدعاء promoteToUplink2()
  - حفظ user_choice في ideas table
  - إرجاع projectId

### Frontend Tasks:
- [ ] إنشاء صفحة /uplink2/project/:id (عرض المشروع الجديد)
- [ ] عرض التحديات المقترحة (suggestedChallenges)
- [ ] إضافة زر "تقديم على تحدي"
- [ ] إضافة progress tracker: UPLINK 1 ✅ → UPLINK 2 (أنت هنا) → UPLINK 3

### Testing:
- [ ] اختبار إنشاء project في UPLINK 2
- [ ] اختبار البحث عن التحديات المناسبة
- [ ] اختبار عرض suggestedChallenges
- [ ] اختبار uplink2ProjectId في ideas table

---

## 🚀 Phase 4: UPLINK 1 → UPLINK 3 (الانتقال المباشر)

### Backend Tasks:
- [ ] إنشاء server/uplink1-to-uplink3.ts:
  - function promoteToUplink3Direct(ideaId, userId)
  - إنشاء asset في marketplace_assets
  - تحديث idea status إلى 'commercial'
  - إضافة uplink3AssetId في ideas table
- [ ] تحديث schema: إضافة `uplink3AssetId` في ideas table
- [ ] تطبيق db:push
- [ ] إنشاء procedure `promoteToUplink3Direct` في routers.ts
- [ ] تحديث setUserChoice procedure:
  - إذا choice === 'uplink3' → استدعاء promoteToUplink3Direct()
  - حفظ user_choice في ideas table
  - إرجاع assetId

### Frontend Tasks:
- [ ] تحديث AIAnalysisResults.tsx:
  - عند اختيار UPLINK 3 → redirect إلى /uplink3/assets/:id
- [ ] إضافة badge "من UPLINK 1" في صفحة Asset Details
- [ ] إضافة progress tracker: UPLINK 1 ✅ → UPLINK 3 (أنت هنا)

### Testing:
- [ ] اختبار إنشاء asset مباشرة من UPLINK 1
- [ ] اختبار uplink3AssetId في ideas table
- [ ] اختبار عرض Asset في UPLINK 3

---

## 🤝 Phase 5: UPLINK 2 → UPLINK 3 (الانتقال بعد الاتفاق)

### Backend Tasks:
- [ ] إنشاء server/uplink2-to-uplink3.ts:
  - function promoteToUplink3FromMatch(projectId, matchId)
  - قراءة project details
  - إنشاء asset في marketplace_assets
  - تحديث project status إلى 'contracted'
  - ربط asset بـ project
- [ ] تحديث schema: إضافة `uplink3AssetId` في projects table
- [ ] تطبيق db:push
- [ ] إنشاء procedure `promoteToUplink3FromMatch` في routers.ts
- [ ] إضافة زر "الانتقال إلى UPLINK 3" في صفحة المشروع (عند نجاح المطابقة)

### Frontend Tasks:
- [ ] إنشاء modal "تأكيد الانتقال إلى UPLINK 3"
- [ ] إضافة شرط: يجب أن يكون هناك match ناجح
- [ ] redirect إلى /uplink3/assets/:id بعد الانتقال
- [ ] إضافة badge "من UPLINK 2" في صفحة Asset Details
- [ ] إضافة progress tracker: UPLINK 1 ✅ → UPLINK 2 ✅ → UPLINK 3 (أنت هنا)

### Testing:
- [ ] اختبار إنشاء asset من UPLINK 2
- [ ] اختبار uplink3AssetId في projects table
- [ ] اختبار ربط asset بـ project

---

## 🎨 Phase 6: تحديث Frontend - عرض الخيارات والتدفق

### صفحات جديدة:
- [ ] إنشاء /journey/:ideaId - صفحة رحلة الفكرة الكاملة
  - عرض progress tracker تفاعلي
  - عرض الحالة الحالية
  - عرض الخطوات التالية
  - روابط مباشرة لكل مرحلة

### تحديثات UI:
- [ ] إضافة progress tracker component (مكون قابل لإعادة الاستخدام)
- [ ] تحديث IdeaDetails.tsx:
  - إضافة زر "عرض الرحلة"
  - عرض الحالة الحالية (UPLINK 1/2/3)
  - عرض الخطوات التالية
- [ ] تحديث Uplink2ProjectDetails.tsx:
  - إضافة progress tracker
  - إضافة زر "الانتقال إلى UPLINK 3" (عند نجاح المطابقة)
- [ ] تحديث Uplink3AssetDetails.tsx:
  - إضافة badge "المصدر: UPLINK 1" أو "المصدر: UPLINK 2"
  - عرض معلومات الفكرة الأصلية

### إشعارات:
- [ ] إضافة toast notifications عند كل انتقال
- [ ] إضافة email notifications (اختياري)

---

## 🧪 Phase 7: الاختبار الشامل للتدفق الكامل

### اختبار السيناريو 1: UPLINK 1 → UPLINK 2 → UPLINK 3
- [ ] تسجيل دخول كمستخدم
- [ ] تقديم فكرة جديدة
- [ ] انتظار التقييم (≥60%)
- [ ] اختيار "الانتقال إلى UPLINK 2"
- [ ] التحقق من إنشاء project في UPLINK 2
- [ ] التحقق من suggestedChallenges
- [ ] محاكاة نجاح المطابقة
- [ ] الضغط على "الانتقال إلى UPLINK 3"
- [ ] التحقق من إنشاء asset في UPLINK 3

### اختبار السيناريو 2: UPLINK 1 → UPLINK 3 (مباشر)
- [ ] تسجيل دخول كمستخدم
- [ ] تقديم فكرة جديدة
- [ ] انتظار التقييم (≥60%)
- [ ] اختيار "الانتقال مباشرة إلى UPLINK 3"
- [ ] التحقق من إنشاء asset في UPLINK 3
- [ ] التحقق من عدم إنشاء project في UPLINK 2

### اختبار السيناريو 3: فكرة ضعيفة (<60%)
- [ ] تسجيل دخول كمستخدم
- [ ] تقديم فكرة ضعيفة
- [ ] انتظار التقييم (<60%)
- [ ] التحقق من عرض "فكرتك تحتاج تطوير"
- [ ] التحقق من عرض التوصيات
- [ ] التحقق من عدم عرض خيارات UPLINK 2/3

### اختبار قاعدة البيانات:
- [ ] التحقق من uplink2ProjectId في ideas table
- [ ] التحقق من uplink3AssetId في ideas table
- [ ] التحقق من user_choice في ideas table
- [ ] التحقق من uplink3AssetId في projects table

### اختبار Unit Tests:
- [ ] إنشاء unit test لـ promoteToUplink2()
- [ ] إنشاء unit test لـ promoteToUplink3Direct()
- [ ] إنشاء unit test لـ promoteToUplink3FromMatch()
- [ ] إنشاء unit test لـ setUserChoice()
- [ ] تشغيل جميع الـ tests والتأكد من نجاحها

---

## 💾 Phase 8: حفظ checkpoint نهائي

- [ ] مراجعة جميع التغييرات
- [ ] التأكد من نجاح جميع الاختبارات
- [ ] حفظ checkpoint مع وصف شامل
- [ ] تسليم المشروع للمستخدم

---

**آخر تحديث:** بدء التنفيذ - Phase 1 مكتمل
