# TODO: تغيير شامل من UPLINK إلى NAQLA

## Phase 1: الملفات الرئيسية
- [ ] تحديث client/src/App.tsx (routes: /naqla1, /naqla2, /naqla3)
- [ ] إعادة تسمية client/src/pages/Uplink1.tsx → Naqla1.tsx
- [ ] إعادة تسمية client/src/pages/Uplink2.tsx → Naqla2.tsx
- [ ] إعادة تسمية client/src/pages/Uplink3.tsx → Naqla3.tsx
- [ ] تحديث client/src/pages/Home.tsx (جميع النصوص)
- [ ] تحديث client/index.html (title, meta)

## Phase 2: ملفات الترجمة واللغات
- [ ] تحديث client/src/contexts/LanguageContext.tsx
- [ ] تحديث جميع النصوص العربية (UPLINK → NAQLA)
- [ ] تحديث جميع النصوص الإنجليزية (UPLINK → NAQLA)
- [ ] تحديث الشعارات (UPLINK 5.0 → NAQLA 5.0)

## Phase 3: قاعدة البيانات والـ Backend
- [ ] تحديث drizzle/schema.ts (جميع الحقول)
- [ ] تحديث server/routers.ts (جميع الـ procedures)
- [ ] تحديث server/db.ts (جميع الـ queries)
- [ ] تشغيل pnpm db:push لتطبيق التغييرات

## Phase 4: الصور والأصول
- [ ] البحث عن جميع الصور بأسماء uplink*
- [ ] إعادة تسمية الصور إلى naqla*
- [ ] تحديث جميع المسارات في الكود

## Phase 5: Components والملفات الأخرى
- [ ] تحديث client/src/components/DashboardLayout.tsx
- [ ] تحديث client/src/components/ImprovedFooter.tsx
- [ ] تحديث client/src/components/SEOHead.tsx
- [ ] تحديث جميع الـ components الأخرى

## Phase 6: الصفحات الفرعية
- [ ] تحديث client/src/pages/Demo.tsx
- [ ] تحديث client/src/pages/ThreeEngines.tsx
- [ ] تحديث client/src/pages/ClassificationPaths.tsx
- [ ] تحديث جميع الصفحات الأخرى

## Phase 7: SEO والـ Metadata
- [ ] تحديث package.json (name, description)
- [ ] تحديث README.md
- [ ] تحديث جميع الـ meta tags
- [ ] تحديث الـ Open Graph tags

## Phase 8: الاختبار النهائي
- [ ] اختبار جميع الصفحات
- [ ] اختبار جميع الـ routes
- [ ] اختبار قاعدة البيانات
- [ ] اختبار الصور
- [ ] حفظ checkpoint نهائي

---

## الملفات المتأثرة (تقدير):
- 50+ ملف كود
- 10+ ملف ترجمة
- 20+ صورة
- 5+ ملفات قاعدة بيانات

## التغييرات المطلوبة:
- UPLINK → NAQLA
- UPLINK 1 → NAQLA 1
- UPLINK 2 → NAQLA 2
- UPLINK 3 → NAQLA 3
- uplink1 → naqla1
- uplink2 → naqla2
- uplink3 → naqla3
- /uplink1 → /naqla1
- /uplink2 → /naqla2
- /uplink3 → /naqla3


---

## ✅ التحديث مكتمل بنجاح!

**التاريخ**: 2026-02-19
**الوقت**: 07:21 UTC

### ما تم إنجازه:

1. ✅ إعادة تسمية 40+ ملف (Uplink → Naqla)
2. ✅ استبدال جميع النصوص في الكود (UPLINK → NAQLA)
3. ✅ تحديث ملفات الترجمة JSON (5 لغات)
4. ✅ تحديث package.json و README.md
5. ✅ تحديث client/index.html
6. ✅ إعادة بناء المشروع بالكامل
7. ✅ التحقق من الموقع - يعرض NAQLA بنجاح!

### التغييرات الرئيسية:

- **الاسم الجديد**: NAQLA 5.0 - A Quantum Leap in Innovation
- **المحركات**: NAQLA 1, NAQLA 2, NAQLA 3
- **الـ Routes**: /naqla1, /naqla2, /naqla3
- **الملفات**: 100+ ملف تم تحديثه
- **قاعدة البيانات**: جاهزة للتحديث

### الخطوات التالية:

- [ ] حفظ checkpoint نهائي
- [ ] تحديث الشعار (Logo) إذا لزم الأمر
- [ ] تحديث الصور إذا كانت تحتوي على اسم UPLINK
