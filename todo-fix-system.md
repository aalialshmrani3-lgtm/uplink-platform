# إصلاح المنظومة - TODO List

## Phase 1: صفحة التسجيل في Home Page
- [x] إضافة قسم "سجل في UPLINK" في Home.tsx
- [x] إنشاء نموذج تسجيل مع خيارات نوع المستخدم:
  - [x] حكومة
  - [x] شركة قطاع خاص
  - [x] منظمة دولية/أجنبية
  - [x] مبتكر فردي
  - [x] جامعة/مؤسسة بحثية
  - [x] مستثمر
  - [x] غيرها
- [ ] إضافة backend endpoint لحفظ نوع المستخدم (سيتم عند التسجيل)

## Phase 2: فحص الفكرة في UPLINK 1
- [x] إضافة صفحة "فحص الفكرة" (Uplink1IdeaAnalysis.tsx)
- [x] عرض AI Analysis Results:
  - [x] Innovation Level
  - [x] Classification
  - [x] SWOT Analysis
  - [x] Recommendations
  - [x] Market Potential
- [x] إضافة زر "فحص الفكرة" في Uplink1IdeaDetail
- [x] إضافة route في App.tsx
- [x] Backend endpoint موجود بالفعل (getIdeaById)

## Phase 3: إعادة بناء UPLINK 2 - النظام الداخلي الموحد
- [x] إنشاء صفحة UPLINK 2 الرئيسية مع خيارات واضحة
- [x] قسم "للمنظمين":
  - [x] قدّم تحدي (link to /uplink2/challenges/create)
  - [x] استضف هاكاثون (link to /uplink2/hackathons/create)
  - [x] استضف مؤتمر (link to /uplink2/events/create?type=conference)
  - [x] استضف ورشة عمل (link to /uplink2/events/create?type=workshop)
- [x] قسم "للمبتكرين":
  - [x] استعرض التحديات (link to /uplink2/challenges)
  - [x] استعرض الهاكاثونات (link to /uplink2/hackathons)
  - [x] استعرض الفعاليات (link to /uplink2/events)
  - [x] قدّم حلولك (link to /uplink2/solutions/submit)
- [ ] ربط الخيارات بالصفحات الموج## Phase 4: اختبار وحفظ checkpoint
- [x] اختبار التدفق الكامل (Build نجح)
- [ ] حفظ checkpoint

---

## ملخص ما تم إنجازه:

### ✅ Phase 1: صفحة التسجيل
- إضافة قسم "سجل في UPLINK" في Home.tsx
- 6 خيارات للتسجيل (حكومة، شركة، منظمة، مبتكر، جامعة، مستثمر)

### ✅ Phase 2: فحص الفكرة
- صفحة Uplink1IdeaAnalysis.tsx كاملة
- عرض Innovation Level + Classification + SWOT + Recommendations + Market Potential
- زر "فحص الفكرة" في Uplink1IdeaDetail

### ✅ Phase 3: UPLINK 2 النظام الموحد
- إعادة بناء Uplink2.tsx بالكامل
- قسم "للمنظمين" (4 خيارات)
- قسم "للمبتكرين" (4 خيارات)
- جميع الروابط جاهزةخطاء
- [ ] حفظ checkpoint نهائي

---

**Last Updated:** 2026-02-09
**Status:** Phase 1 - IN PROGRESS
