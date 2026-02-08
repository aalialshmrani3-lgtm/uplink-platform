# UPLINK1 AI Integration TODO

## Phase 1: تحديث صفحة UPLINK1 Submit

- [ ] قراءة Uplink1Submit.tsx الحالي
- [ ] تحديث form submission لاستخدام trpc.uplink1.submitIdeaWithAnalysis
- [ ] إضافة Loading State مع Animation أثناء التحليل
- [ ] عرض AI Analysis Results بعد التحليل

## Phase 2: بناء AI Results Display Component

- [ ] إنشاء /client/src/components/AIAnalysisResults.tsx
- [ ] عرض Innovation Score (0-100) مع Progress Bar
- [ ] عرض Feasibility Score (0-100)
- [ ] عرض Market Potential Score (0-100)
- [ ] عرض Classification Tags (badges)
- [ ] عرض Recommendations (list)
- [ ] عرض Status Badge (Pending/Approved/Moved to UPLINK2)

## Phase 3: إضافة endpoints في routers.ts

- [ ] التأكد من وجود trpc.uplink1.submitIdeaWithAnalysis
- [ ] التأكد من وجود trpc.uplink1.getMyIdeas
- [ ] إضافة trpc.uplink1.getIdeaAnalysis (إذا لم يكن موجود)

## Phase 4: Build & Test

- [ ] بناء المشروع (pnpm build)
- [ ] اختبار Submit Idea + AI Analysis
- [ ] اختبار عرض النتائج
- [ ] حفظ checkpoint نهائي
