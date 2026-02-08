# UPLINK Final Phase - تنفيذ الاقتراحات الثلاثة

## Phase 1: بناء 6 صفحات تسجيل مخصصة + endpoints

### Frontend Pages
- [ ] /register/innovator (مهارات، تعليم، خبرة، portfolio)
- [ ] /register/investor (نطاق الاستثمار، الصناعات، المرحلة المفضلة)
- [ ] /register/company (حجم الشركة، الصناعة، الإيرادات، المقر)
- [ ] /register/government (القسم، الوزارة، الميزانية، مجالات التركيز)
- [ ] /register/private-sector (القطاع، نوع المنظمة، الخدمات)
- [ ] /register/other (نموذج عام + وصف مخصص)

### Backend Endpoints
- [ ] trpc.auth.registerInnovator
- [ ] trpc.auth.registerInvestor
- [ ] trpc.auth.registerCompany
- [ ] trpc.auth.registerGovernment
- [ ] trpc.auth.registerPrivateSector
- [ ] trpc.auth.registerOther

### Routes
- [ ] إضافة routes في App.tsx

## Phase 2: ربط UPLINK1 Frontend بـ AI Analysis Engine

- [ ] تحديث Uplink1Submit.tsx: استخدام trpc.uplink1.submitIdeaWithAnalysis
- [ ] عرض AI Analysis Results (Innovation Score, Feasibility, Market)
- [ ] عرض Classification Tags
- [ ] عرض Recommendations
- [ ] عرض Status Badge (Pending, Approved, Moved to UPLINK2)
- [ ] إضافة real-time progress indicator أثناء التحليل
- [ ] إضافة loading state مع animation

## Phase 3: بناء NotificationBell component + WebSocket

### NotificationBell Component
- [ ] إنشاء /client/src/components/NotificationBell.tsx
- [ ] عرض عدد الإشعارات غير المقروءة (badge)
- [ ] Dropdown مع آخر 5 إشعارات
- [ ] زر "عرض الكل" → /notifications
- [ ] Sound/Toast عند وصول إشعار جديد

### Notifications Page
- [ ] إنشاء /notifications page (جميع الإشعارات)
- [ ] Tabs: الكل، غير المقروءة، المقروءة
- [ ] زر "تعليم الكل كمقروء"
- [ ] Filters حسب النوع

### WebSocket Integration
- [ ] ربط WebSocket في NotificationBell
- [ ] استقبال الإشعارات الفورية
- [ ] تحديث UI تلقائياً

### Backend
- [ ] إضافة trpc.notifications.getMyNotifications
- [ ] إضافة trpc.notifications.markAsRead
- [ ] إضافة trpc.notifications.markAllAsRead
- [ ] إضافة trpc.notifications.getUnreadCount

## Phase 4: Build & Test

- [ ] بناء المشروع (pnpm build)
- [ ] اختبار التسجيل لكل نوع
- [ ] اختبار UPLINK1 مع AI Analysis
- [ ] اختبار نظام الإشعارات
- [ ] حفظ checkpoint نهائي
