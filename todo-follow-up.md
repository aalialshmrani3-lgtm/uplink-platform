# UPLINK Platform - Follow-up Tasks

## Phase 1: ربط صفحة Register بالـ Navbar
- [ ] تحديث Home.tsx - إضافة زر "تسجيل" بارز في الصفحة الرئيسية
- [ ] تحديث Navbar (إذا موجود) - إضافة رابط /register
- [ ] إضافة routes في App.tsx للصفحات الجديدة

## Phase 2: إكمال صفحات التسجيل المتبقية
- [ ] إنشاء RegisterCompany.tsx
- [ ] إنشاء RegisterIndividual.tsx
- [ ] إنشاء RegisterGovernment.tsx
- [ ] إنشاء RegisterPrivateSector.tsx
- [ ] إضافة lazy imports في App.tsx
- [ ] إضافة routes في App.tsx

## Phase 3: تفعيل Auto-transition (UPLINK1 → UPLINK2)
- [ ] ربط SubmitIdea.tsx بـ submitIdeaWithAnalysis()
- [ ] تحديث server/uplink1/idea-workflow.ts - إضافة auto-transition logic
- [ ] إنشاء notification عند الانتقال لـ UPLINK2
- [ ] تحديث ideas table status عند الانتقال
- [ ] إنشاء سجل في uplink2_challenges تلقائياً

## Phase 4: Build & Test
- [ ] pnpm build
- [ ] اختبار التسجيل لجميع الأنواع
- [ ] اختبار Auto-transition
- [ ] حفظ checkpoint نهائي
