# Bug Fixes TODO - NAQLA Platform

## Phase 1: فحص الأخطاء البرمجية ✅
- [x] فحص TypeScript errors (21 خطأ)
- [x] فحص Build errors
- [x] فحص Console errors

## Phase 2: فحص UI
- [ ] فحص الصفحة الرئيسية
- [ ] فحص صفحات NAQLA 1, 2, 3
- [ ] فحص الروابط المكسورة
- [ ] فحص الصور المفقودة

## Phase 3: إصلاح الأخطاء ✅
- [x] إصلاح ملفات mock (mockNAQLA1, mockNAQLA2, mockNAQLA3)
- [x] إصلاح null safety في IdeaClusters.tsx (5 أخطاء)
- [x] إصلاح any type في IdeaJourney.tsx
- [x] إصلاح المقارنة في Naqla1IdeaAnalysis.tsx (2 أخطاء)
- [x] إصلاح database في server/routers.ts (6 أخطاء)
- [x] إصلاح Project interface في aiMatchingEngine.ts
- [x] إصلاح fundingRequired type
- [x] إصلاح timeline في IdeaJourney.tsx
- [x] إصلاح الأخطاء المتبقية ✅
  - [x] Challenge interface (titleEn, descriptionEn, category, prize, requirements)
  - [x] Accelerator interface (nameEn, descriptionEn, focusAreas, supportTypes)
  - [x] Incubator interface (nameEn, descriptionEn, focusAreas, supportTypes)
  - [x] Partner interface (nameEn, descriptionEn, industry, focusAreas)
  - [x] MatchResult interface (titleEn, descriptionEn, prize)
  - [x] prize type conversion في getAllOpportunitiesForProject

## Phase 4: اختبار ✅
- [x] اختبار البناء (pnpm build) - نجح بدون أخطاء ✅
- [x] حفظ checkpoint نهائي ✅

## الأخطاء المتبقية (6):
- [ ] إصلاح Challenge interface (titleEn: string | null)
- [ ] إصلاح timeline property في IdeaJourney
- [ ] إصلاح باقي type incompatibilities
