# بناء المنظومة الداخلية الكاملة - UPLINK Platform

## الهدف النهائي:
بناء منظومة متكاملة تبدأ من التسجيل وتنتهي بالعقود الذكية مع ترابط تلقائي كامل بين UPLINK1 → UPLINK2 → UPLINK3

---

## Phase 1: نظام التسجيل الكامل (نقطة البداية)

### 1.1 صفحة التسجيل الرئيسية
- [ ] إنشاء /register - صفحة اختيار نوع المستخدم
- [ ] 6 خيارات: مبتكر، مستثمر، شركة، فرد/مواطن، جهة حكومية، قطاع خاص
- [ ] كل نوع له أيقونة ووصف مختصر

### 1.2 صفحات التسجيل المخصصة
- [ ] /register/innovator - نموذج تسجيل المبتكر (المهارات، المجالات، Portfolio)
- [ ] /register/investor - نموذج تسجيل المستثمر (الميزانية، المجالات المفضلة، نوع الاستثمار)
- [ ] /register/company - نموذج تسجيل الشركة (نوع الشركة، الحجم، المجال)
- [ ] /register/individual - نموذج تسجيل الفرد/المواطن
- [ ] /register/government - نموذج تسجيل الجهة الحكومية
- [ ] /register/private-sector - نموذج تسجيل القطاع الخاص

### 1.3 Backend - Registration System
- [ ] إنشاء server/auth/registration.ts
- [ ] endpoint: trpc.auth.register.useMutation (يحفظ في users + profile المناسب)
- [ ] endpoint: trpc.auth.completeProfile.useMutation
- [ ] إضافة validation لكل نوع مستخدم

---

## Phase 2: UPLINK1 Internal System (AI + Auto-transition)

### 2.1 تحديث صفحة Submit Idea
- [ ] ربط /uplink1/submit بـ submitIdeaWithAnalysis()
- [ ] عرض AI Analysis Results فوراً (Innovation Score, Feasibility, Market Potential)
- [ ] عرض Classification (ابتكار/تجاري/تحتاج تطوير)
- [ ] عرض Recommendations من AI

### 2.2 Auto-transition Logic
- [ ] إذا Innovation Score >= 70% → انتقال تلقائي لـ UPLINK2
- [ ] إنشاء notification للمستخدم
- [ ] إنشاء سجل في uplink2_challenges (تحويل الفكرة لتحدي)
- [ ] تحديث حالة الفكرة في ideas table

### 2.3 Backend - UPLINK1 Workflow
- [ ] تحديث server/uplink1/idea-workflow.ts
- [ ] إضافة autoTransitionToUplink2() function
- [ ] ربط AI Analysis Engine بـ workflow
- [ ] إضافة endpoint: trpc.uplink1.submitWithAnalysis.useMutation

---

## Phase 3: UPLINK2 Internal System (Events + Auto-transition)

### 3.1 صفحة "قدّم طلب لإقامة فعالية"
- [ ] إنشاء /uplink2/host-event (موجودة - تحديث)
- [ ] Form: نوع الفعالية (معرض/مؤتمر/هاكاثون/نشاط علمي)
- [ ] Form: التفاصيل (التاريخ، المكان، الميزانية، عدد الحضور المتوقع)
- [ ] Form: هل تبحث عن رعاة؟ (نعم/لا)
- [ ] Form: هل تبحث عن مبتكرين/حضور؟ (نعم/لا)

### 3.2 صفحة "تصفح الفعاليات"
- [ ] إنشاء /uplink2/browse-events
- [ ] عرض جميع الفعاليات (معارض، مؤتمرات، هاكاثونات)
- [ ] Filters: نوع الفعالية، التاريخ، المكان
- [ ] زر "سجّل كحضور" أو "سجّل كراعي"

### 3.3 Smart Matching للفعاليات
- [ ] عند إنشاء فعالية → تشغيل Matching Engine
- [ ] إيجاد رعاة مناسبين (حسب المجال + الميزانية)
- [ ] إيجاد مبتكرين مهتمين (حسب AI Tags)
- [ ] إرسال notifications للمطابقات

### 3.4 Auto-transition to UPLINK3
- [ ] عند انتهاء الفعالية (تاريخ انتهاء + confirmation)
- [ ] إنشاء عقد ذكي تلقائياً في UPLINK3
- [ ] ربط الرعاة + المبتكرين + المنظم في العقد
- [ ] إنشاء notification للجميع

### 3.5 Backend - UPLINK2 Workflow
- [ ] تحديث server/uplink2/events.ts
- [ ] إضافة autoMatchSponsors() function
- [ ] إضافة autoMatchInnovators() function
- [ ] إضافة autoTransitionToUplink3() function
- [ ] endpoint: trpc.uplink2.events.complete.useMutation

---

## Phase 4: UPLINK3 Internal System (Smart Contracts + Escrow)

### 4.1 Smart Contract Creation
- [ ] عند انتقال من UPLINK2 → إنشاء عقد تلقائياً
- [ ] العقد يحتوي: الأطراف (منظم + رعاة + مبتكرين)
- [ ] العقد يحتوي: المبلغ (من الرعاة)
- [ ] العقد يحتوي: Milestones (مراحل الدفع)
- [ ] العقد يحتوي: شروط الإلغاء

### 4.2 Escrow System
- [ ] إيداع المبلغ في Escrow عند توقيع العقد
- [ ] Release المبلغ عند إكمال Milestone
- [ ] Dispute Resolution (إذا حدث خلاف)

### 4.3 صفحة العقود
- [ ] تحديث /uplink3/contracts
- [ ] عرض جميع العقود (Active, Completed, Cancelled)
- [ ] زر "توقيع العقد"
- [ ] زر "طلب Release للدفعة"
- [ ] زر "إلغاء العقد"

### 4.4 Backend - UPLINK3 Smart Contracts
- [ ] تحديث server/uplink3/contracts.ts
- [ ] إضافة createContractFromEvent() function
- [ ] إضافة signContract() function
- [ ] إضافة releaseMilestonePayment() function
- [ ] endpoint: trpc.uplink3.contracts.createFromEvent.useMutation

---

## Phase 5: ربط المنظومة الكاملة

### 5.1 Workflow Connector
- [ ] تحديث server/workflow/uplink-flow.ts
- [ ] إضافة completeWorkflow() function (من التسجيل → العقد)
- [ ] إضافة tracking لكل مرحلة
- [ ] إضافة notifications في كل انتقال

### 5.2 Dashboard شامل
- [ ] إنشاء /dashboard
- [ ] عرض رحلة المستخدم الكاملة (أين هو الآن؟)
- [ ] عرض الأفكار في UPLINK1
- [ ] عرض التحديات/الفعاليات في UPLINK2
- [ ] عرض العقود في UPLINK3

### 5.3 Testing الكامل
- [ ] اختبار: تسجيل → إرسال فكرة → AI Analysis → UPLINK2
- [ ] اختبار: إنشاء فعالية → Matching → UPLINK3
- [ ] اختبار: توقيع عقد → Escrow → Release
- [ ] اختبار: Notifications في كل مرحلة

### 5.4 Build & Deploy
- [ ] pnpm build
- [ ] حل جميع الأخطاء
- [ ] حفظ checkpoint نهائي
- [ ] اختبار الموقع الكامل

---

## ملاحظات مهمة:

- **الترابط التلقائي** هو الأساس: كل مرحلة تنتقل تلقائياً للتالية
- **AI Analysis** هو القلب: يحدد مصير الفكرة
- **Smart Matching** هو المحرك: يربط المبتكرين بالمستثمرين/الرعاة
- **Smart Contracts** هو الضمان: يحمي حقوق الجميع
- **Notifications** هي الجسر: تُعلم المستخدم بكل خطوة

---

## الأولوية:
1. Phase 1 (التسجيل) - نقطة البداية
2. Phase 2 (UPLINK1 AI + Auto-transition)
3. Phase 3 (UPLINK2 Events + Auto-transition)
4. Phase 4 (UPLINK3 Smart Contracts)
5. Phase 5 (الربط الكامل + Testing)
