# TODO: Demo Flow - رحلة المستخدم الكاملة

## Phase 1: بناء Demo Flow Visualization Page
- [x] إنشاء صفحة `/demo` لعرض رحلة المستخدم الكاملة
- [x] Flowchart تفاعلي يوضح:
  - [x] التسجيل (6 أنواع مستخدمين)
  - [x] UPLINK 1: تقديم الفكرة + التقييم
  - [x] سيناريو ≥70%: ابتكار عالي → UPLINK 2 (مستثمرين + هاكاثونات)
  - [x] سيناريو 50-69%: حل تجاري → UPLINK 2 (تحديات تجارية)
  - [x] سيناريو <50%: رفض + نصائح → إعادة تحسين
  - [x] UPLINK 2: المطابقة مع الجهات المناسبة
  - [x] UPLINK 3: Smart Contract + Milestones + Escrow
- [x] إضافة أزرار تفاعلية لكل خطوة (زر "المرحلة التالية")
- [x] عرض الحالة الحالية للمستخدم في الرحلة (Expandable Cards)

## Phase 2: تحديث Backend Logic للتقييم والانتقال التلقائي
- [ ] تحديث `server/uplink1/idea-workflow.ts`:
  - [ ] إضافة logic للتقييم التلقائي:
    - [ ] ≥70%: status = "approved_innovation" → redirect to UPLINK 2 (investors)
    - [ ] 50-69%: status = "approved_commercial" → redirect to UPLINK 2 (challenges)
    - [ ] <50%: status = "rejected" → show feedback + allow resubmit
  - [ ] إضافة `getRecommendations()` function لتوليد نصائح مخصصة
- [ ] إضافة حقول جديدة في `ideas` table:
  - [ ] `status`: enum (pending, approved_innovation, approved_commercial, rejected)
  - [ ] `rejectionReason`: text
  - [ ] `recommendations`: text
- [ ] إضافة `pnpm db:push` لتحديث schema

## Phase 3: ربط UPLINK 1 → 2 → 3 بشكل تلقائي
- [ ] إضافة Auto-redirect في Uplink1IdeaAnalysis.tsx:
  - [ ] إذا ≥70%: زر "انتقل إلى UPLINK 2 - المستثمرين"
  - [ ] إذا 50-69%: زر "انتقل إلى UPLINK 2 - التحديات"
  - [ ] إذا <50%: زر "تحسين الفكرة" + عرض النصائح
- [ ] تحديث UPLINK 2 لعرض الأفكار المناسبة:
  - [ ] Filter حسب Innovation Level
  - [ ] Matching Algorithm (AI-powered)
- [ ] إضافة Auto-transition من UPLINK 2 → UPLINK 3:
  - [ ] عند قبول المستثمر/الجهة → إنشاء Smart Contract تلقائياً

## Phase 4: إضافة User Journey Tracking System
- [ ] إنشاء `userJourney` table:
  - [ ] userId
  - [ ] currentStage: enum (registration, uplink1, uplink2, uplink3, completed)
  - [ ] ideaId (nullable)
  - [ ] eventId (nullable)
  - [ ] contractId (nullable)
  - [ ] progress: json (تفاصيل التقدم)
  - [ ] createdAt, updatedAt
- [ ] إضافة Progress Bar في Dashboard
- [ ] إضافة Notifications عند الانتقال بين المراحل

## Phase 5: بناء واختبار وحفظ checkpoint
- [ ] اختبار التدفق الكامل:
  - [ ] تسجيل مستخدم جديد
  - [ ] تقديم فكرة (3 سيناريوهات)
  - [ ] الانتقال التلقائي لـ UPLINK 2
  - [ ] المطابقة مع جهة
  - [ ] إنشاء Smart Contract في UPLINK 3
- [ ] حفظ checkpoint نهائي
