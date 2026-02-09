/**
 * Seed Demo Data for UPLINK Platform
 * This script populates the database with realistic test data for all three engines
 */

import { getDb } from '../server/db';
import { ideas, events, contracts, ideaTransitions, users } from '../drizzle/schema';

async function seedDemoData() {
  console.log('🌱 Starting to seed demo data...');

  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Get current user (owner)
    const currentUser = await db.select().from(users).limit(1);
    const userId = currentUser[0]?.id || 1;

    console.log('👤 Using user ID:', userId);

    // ============================================
    // UPLINK 1: IDEAS WITH AI ANALYSIS
    // ============================================
    console.log('\n📝 Seeding UPLINK 1 - Ideas...');

    const ideasData = [
      {
        userId,
        title: 'نظام ذكاء اصطناعي لإدارة الطاقة المتجددة',
        description: 'منصة تستخدم الذكاء الاصطناعي لتحسين استهلاك الطاقة الشمسية في المباني السكنية والتجارية من خلال التنبؤ بأنماط الاستهلاك وتحسين التخزين',
        category: 'تقنية',
        status: 'approved' as const,
        innovationLevel: 'عالي',
        classification: 'innovation' as const,
        marketPotential: 'واعد جداً',
        swotAnalysis: JSON.stringify({
          strengths: ['تقنية متقدمة', 'سوق متنامي', 'دعم حكومي للطاقة المتجددة'],
          weaknesses: ['تكلفة تطوير عالية', 'يحتاج خبرة تقنية متخصصة'],
          opportunities: ['رؤية 2030', 'الاستثمار في الطاقة النظيفة', 'توسع سوق الطاقة الشمسية'],
          threats: ['منافسة عالمية', 'تغير الأنظمة والتشريعات']
        }),
        recommendations: JSON.stringify([
          'التركيز على السوق السعودي أولاً',
          'بناء شراكات مع شركات الطاقة',
          'الحصول على شهادات الجودة الدولية'
        ]),
        score: 85
      },
      {
        userId,
        title: 'تطبيق ذكي للتشخيص الطبي المبكر',
        description: 'تطبيق يستخدم الذكاء الاصطناعي وتحليل الصور الطبية للكشف المبكر عن الأمراض المزمنة مثل السكري وأمراض القلب',
        category: 'صحة',
        status: 'approved' as const,
        innovationLevel: 'عالي جداً',
        classification: 'innovation' as const,
        marketPotential: 'ممتاز',
        swotAnalysis: JSON.stringify({
          strengths: ['حاجة ملحة في السوق', 'تقنية AI متقدمة', 'يوفر تكاليف العلاج'],
          weaknesses: ['يحتاج موافقات طبية', 'مسؤولية قانونية عالية'],
          opportunities: ['التحول الرقمي الصحي', 'دعم وزارة الصحة', 'سوق خليجي كبير'],
          threats: ['أنظمة صارمة', 'منافسة من شركات عالمية']
        }),
        recommendations: JSON.stringify([
          'الحصول على اعتمادات طبية',
          'بناء فريق طبي استشاري',
          'التعاون مع المستشفيات الكبرى'
        ]),
        score: 88
      },
      {
        userId,
        title: 'منصة تعليمية تفاعلية للأطفال',
        description: 'منصة تعليمية تستخدم الألعاب والواقع المعزز لتعليم الأطفال المهارات الأساسية بطريقة ممتعة وتفاعلية',
        category: 'تعليم',
        status: 'approved' as const,
        innovationLevel: 'متوسط',
        classification: 'innovation' as const,
        marketPotential: 'جيد',
        swotAnalysis: JSON.stringify({
          strengths: ['سوق كبير', 'سهولة التسويق للأهالي', 'محتوى عربي نادر'],
          weaknesses: ['منافسة عالية', 'يحتاج محتوى مستمر'],
          opportunities: ['التعليم عن بعد', 'دعم وزارة التعليم', 'سوق الخليج'],
          threats: ['منصات عالمية مجانية', 'تغير اهتمامات الأطفال']
        }),
        recommendations: JSON.stringify([
          'التركيز على المحتوى العربي المميز',
          'بناء شراكات مع المدارس',
          'نموذج freemium للتسويق'
        ]),
        score: 72
      },
      {
        userId,
        title: 'نظام أمن سيبراني متقدم للشركات الصغيرة',
        description: 'حل أمني متكامل يحمي الشركات الصغيرة من الهجمات السيبرانية باستخدام الذكاء الاصطناعي والتعلم الآلي',
        category: 'أمن سيبراني',
        status: 'approved' as const,
        innovationLevel: 'عالي',
        classification: 'innovation' as const,
        marketPotential: 'واعد',
        swotAnalysis: JSON.stringify({
          strengths: ['حاجة ملحة', 'تقنية متقدمة', 'سوق متنامي'],
          weaknesses: ['تكلفة تطوير عالية', 'يحتاج فريق متخصص'],
          opportunities: ['زيادة الهجمات السيبرانية', 'أنظمة حماية البيانات', 'التحول الرقمي'],
          threats: ['منافسة من شركات عالمية', 'تطور سريع في التهديدات']
        }),
        recommendations: JSON.stringify([
          'الحصول على شهادات أمنية دولية',
          'بناء فريق أمن سيبراني قوي',
          'التركيز على الشركات المتوسطة'
        ]),
        score: 80
      },
      {
        userId,
        title: 'تطبيق توصيل طعام صحي',
        description: 'تطبيق يربط المطاعم الصحية بالعملاء مع نظام توصيات غذائية مخصصة بناءً على الحالة الصحية',
        category: 'خدمات',
        status: 'revision_needed' as const,
        innovationLevel: 'منخفض',
        classification: 'commercial' as const,
        marketPotential: 'متوسط',
        swotAnalysis: JSON.stringify({
          strengths: ['وعي صحي متزايد', 'سهولة التنفيذ'],
          weaknesses: ['منافسة شديدة', 'هوامش ربح منخفضة'],
          opportunities: ['اتجاه الحياة الصحية', 'زيادة الطلب على الطعام الصحي'],
          threats: ['منافسة من تطبيقات كبيرة', 'تكاليف تشغيل عالية']
        }),
        recommendations: JSON.stringify([
          'التركيز على niche محدد',
          'بناء شراكات حصرية',
          'تقديم قيمة مضافة فريدة'
        ]),
        score: 58
      },
      {
        userId,
        title: 'نظام إدارة المخزون الذكي',
        description: 'نظام يستخدم IoT والذكاء الاصطناعي لإدارة المخزون تلقائياً في المستودعات والمتاجر',
        category: 'تقنية',
        status: 'approved' as const,
        innovationLevel: 'عالي',
        classification: 'innovation' as const,
        marketPotential: 'ممتاز',
        swotAnalysis: JSON.stringify({
          strengths: ['توفير تكاليف', 'دقة عالية', 'تقنية متقدمة'],
          weaknesses: ['تكلفة أجهزة IoT', 'يحتاج تدريب'],
          opportunities: ['التحول الرقمي للشركات', 'e-commerce growth', 'أتمتة العمليات'],
          threats: ['منافسة من حلول عالمية', 'تكاليف صيانة']
        }),
        recommendations: JSON.stringify([
          'البدء بالمتاجر المتوسطة',
          'نموذج SaaS للاشتراكات',
          'دعم فني ممتاز'
        ]),
        score: 82
      },
      {
        userId,
        title: 'منصة تمويل جماعي للمشاريع الإبداعية',
        description: 'منصة تربط المبدعين بالممولين لتمويل المشاريع الإبداعية والفنية في المنطقة',
        category: 'مالية',
        status: 'approved' as const,
        innovationLevel: 'متوسط',
        classification: 'commercial' as const,
        marketPotential: 'جيد',
        swotAnalysis: JSON.stringify({
          strengths: ['نموذج عمل مجرب', 'حاجة في السوق العربي'],
          weaknesses: ['يحتاج ثقة المستخدمين', 'أنظمة مالية معقدة'],
          opportunities: ['دعم المحتوى العربي', 'نمو الاقتصاد الإبداعي'],
          threats: ['أنظمة مالية صارمة', 'منافسة من منصات عالمية']
        }),
        recommendations: JSON.stringify([
          'الحصول على تراخيص مالية',
          'بناء ثقة المجتمع',
          'التركيز على المحتوى المحلي'
        ]),
        score: 70
      },
      {
        userId,
        title: 'تقنية تحلية المياه بالطاقة الشمسية',
        description: 'نظام تحلية مياه مبتكر يعمل بالطاقة الشمسية بتكلفة منخفضة للمناطق النائية',
        category: 'بيئة',
        status: 'approved' as const,
        innovationLevel: 'عالي جداً',
        classification: 'innovation' as const,
        marketPotential: 'ممتاز',
        swotAnalysis: JSON.stringify({
          strengths: ['حاجة ملحة', 'تقنية مستدامة', 'دعم حكومي'],
          weaknesses: ['تكلفة تطوير عالية', 'يحتاج بنية تحتية'],
          opportunities: ['أزمة المياه العالمية', 'دعم البيئة', 'رؤية 2030'],
          threats: ['تقنيات منافسة', 'تكاليف صيانة']
        }),
        recommendations: JSON.stringify([
          'التعاون مع وزارة البيئة',
          'تجارب ميدانية في مناطق نائية',
          'الحصول على براءة اختراع'
        ]),
        score: 90
      },
      {
        userId,
        title: 'روبوت خدمة عملاء ذكي',
        description: 'روبوت محادثة يستخدم معالجة اللغة الطبيعية لتقديم خدمة عملاء بالعربية على مدار الساعة',
        category: 'تقنية',
        status: 'approved' as const,
        innovationLevel: 'متوسط',
        classification: 'innovation' as const,
        marketPotential: 'جيد جداً',
        swotAnalysis: JSON.stringify({
          strengths: ['توفير تكاليف', 'خدمة 24/7', 'دعم عربي قوي'],
          weaknesses: ['يحتاج تدريب مستمر', 'قد لا يفهم سياقات معقدة'],
          opportunities: ['التحول الرقمي', 'نمو التجارة الإلكترونية'],
          threats: ['منافسة من حلول عالمية', 'تطور سريع في التقنية']
        }),
        recommendations: JSON.stringify([
          'التركيز على اللغة العربية',
          'نموذج SaaS',
          'تكامل مع منصات شائعة'
        ]),
        score: 75
      },
      {
        userId,
        title: 'منصة حجز مواقف السيارات الذكية',
        description: 'تطبيق يساعد السائقين في إيجاد وحجز مواقف السيارات في المدن الكبرى',
        category: 'خدمات',
        status: 'revision_needed' as const,
        innovationLevel: 'منخفض',
        classification: 'weak' as const,
        marketPotential: 'متوسط',
        swotAnalysis: JSON.stringify({
          strengths: ['مشكلة حقيقية', 'سهولة الاستخدام'],
          weaknesses: ['يحتاج شراكات مع مواقف', 'منافسة موجودة'],
          opportunities: ['ازدحام المدن', 'نمو عدد السيارات'],
          threats: ['حلول مجانية من البلديات', 'تكاليف تشغيل']
        }),
        recommendations: JSON.stringify([
          'البدء بمدينة واحدة',
          'شراكات مع مراكز تجارية',
          'نموذج عمولة بسيط'
        ]),
        score: 55
      }
    ];

    await db.insert(ideas).values(ideasData);
    console.log(`✅ Inserted ${ideasData.length} ideas`);

    // ============================================
    // UPLINK 2: EVENTS (Hackathons, Workshops, Conferences)
    // ============================================
    console.log('\n🏆 Seeding UPLINK 2 - Events...');

    const eventsData = [
      {
        userId,
        title: 'هاكاثون الذكاء الاصطناعي السعودي 2026',
        description: 'هاكاثون وطني لتطوير حلول ذكاء اصطناعي تخدم رؤية 2030. جوائز قيمة وفرص استثمارية.',
        type: 'hackathon' as const,
        startDate: new Date('2026-03-15'),
        endDate: new Date('2026-03-17'),
        location: 'الرياض - مركز الملك عبدالله المالي',
        isVirtual: false,
        capacity: 200,
        budget: 500000,
        needSponsors: true,
        needInnovators: true,
        status: 'published' as const,
        registrations: 145,
        sponsors: 5
      },
      {
        userId,
        title: 'هاكاثون الصحة الرقمية',
        description: 'تطوير حلول تقنية لتحسين الرعاية الصحية والتشخيص المبكر للأمراض.',
        type: 'hackathon' as const,
        startDate: new Date('2026-04-10'),
        endDate: new Date('2026-04-12'),
        location: 'جدة - مدينة الملك عبدالله الطبية',
        isVirtual: false,
        capacity: 150,
        budget: 300000,
        needSponsors: true,
        needInnovators: true,
        status: 'published' as const,
        registrations: 98,
        sponsors: 3
      },
      {
        userId,
        title: 'هاكاثون الطاقة المتجددة',
        description: 'ابتكار حلول للطاقة النظيفة والمستدامة لمستقبل أخضر.',
        type: 'hackathon' as const,
        startDate: new Date('2026-05-20'),
        endDate: new Date('2026-05-22'),
        location: 'الدمام - مدينة الملك عبدالله للطاقة الذرية',
        isVirtual: false,
        capacity: 100,
        budget: 400000,
        needSponsors: true,
        needInnovators: true,
        status: 'published' as const,
        registrations: 67,
        sponsors: 4
      },
      {
        userId,
        title: 'ورشة عمل: تطوير تطبيقات الذكاء الاصطناعي',
        description: 'ورشة عملية لتعلم بناء تطبيقات AI من الصفر باستخدام أحدث التقنيات.',
        type: 'workshop' as const,
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-04-15'),
        location: 'جدة - جامعة الملك عبدالعزيز',
        isVirtual: false,
        capacity: 50,
        budget: 25000,
        needSponsors: false,
        needInnovators: false,
        status: 'published' as const,
        registrations: 42,
        sponsors: 1
      },
      {
        userId,
        title: 'مؤتمر الابتكار السعودي 2026',
        description: 'مؤتمر وطني يجمع المبتكرين والمستثمرين ورواد الأعمال لتبادل الخبرات والفرص.',
        type: 'conference' as const,
        startDate: new Date('2026-03-20'),
        endDate: new Date('2026-03-22'),
        location: 'الرياض - مركز الملك فهد الثقافي',
        isVirtual: false,
        capacity: 500,
        budget: 1000000,
        needSponsors: true,
        needInnovators: false,
        status: 'published' as const,
        registrations: 387,
        sponsors: 8
      },
      {
        userId,
        title: 'معرض التقنية والابتكار',
        description: 'معرض سنوي لعرض أحدث الابتكارات التقنية والشركات الناشئة.',
        type: 'conference' as const,
        startDate: new Date('2026-05-10'),
        endDate: new Date('2026-05-12'),
        location: 'الدمام - مركز المعارض الدولي',
        isVirtual: false,
        capacity: 1000,
        budget: 1500000,
        needSponsors: true,
        needInnovators: true,
        status: 'published' as const,
        registrations: 756,
        sponsors: 12
      },
      {
        userId,
        title: 'ورشة عمل: ريادة الأعمال التقنية',
        description: 'تعلم كيفية بناء وتطوير شركة تقنية ناشئة من الصفر حتى النجاح.',
        type: 'workshop' as const,
        startDate: new Date('2026-06-20'),
        endDate: new Date('2026-06-21'),
        location: 'افتراضي - عبر الإنترنت',
        isVirtual: true,
        capacity: 200,
        budget: 30000,
        needSponsors: false,
        needInnovators: false,
        status: 'published' as const,
        registrations: 178,
        sponsors: 2
      }
    ];

    await db.insert(events).values(eventsData);
    console.log(`✅ Inserted ${eventsData.length} events`);

    // ============================================
    // IDEA TRANSITIONS (UPLINK 1 → 2)
    // ============================================
    console.log('\n🔄 Seeding Idea Transitions...');

    // Note: We'll use sequential IDs for transitions (assuming auto-increment starts at 1)
    const transitionsData = [
      {
        ideaId: 1, // AI Energy Management (score: 85)
        userId,
        fromEngine: 'uplink1' as const,
        toEngine: 'uplink2' as const,
        reason: 'تحليل AI إيجابي - درجة 85%',
        score: 85,
        metadata: JSON.stringify({
          autoTransferred: true,
          matchingResults: [
            { entityType: 'government', entityName: 'وزارة الطاقة', matchScore: 92 },
            { entityType: 'company', entityName: 'أرامكو السعودية', matchScore: 88 }
          ]
        })
      },
      {
        ideaId: 2, // Medical AI (score: 88)
        userId,
        fromEngine: 'uplink1' as const,
        toEngine: 'uplink2' as const,
        reason: 'تحليل AI إيجابي - درجة 88%',
        score: 88,
        metadata: JSON.stringify({
          autoTransferred: true,
          matchingResults: [
            { entityType: 'government', entityName: 'وزارة الصحة', matchScore: 95 },
            { entityType: 'university', entityName: 'جامعة الملك سعود', matchScore: 85 }
          ]
        })
      },
      {
        ideaId: 4, // Cybersecurity (score: 80)
        userId,
        fromEngine: 'uplink1' as const,
        toEngine: 'uplink2' as const,
        reason: 'تحليل AI إيجابي - درجة 80%',
        score: 80,
        metadata: JSON.stringify({
          autoTransferred: true,
          matchingResults: [
            { entityType: 'government', entityName: 'الهيئة الوطنية للأمن السيبراني', matchScore: 90 },
            { entityType: 'company', entityName: 'STC', matchScore: 82 }
          ]
        })
      }
    ];

    await db.insert(ideaTransitions).values(transitionsData);
    console.log(`✅ Inserted ${transitionsData.length} idea transitions`);

    // ============================================
    // UPLINK 3: SMART CONTRACTS
    // ============================================
    console.log('\n📜 Seeding UPLINK 3 - Smart Contracts...');

    const contractsData = [
      {
        projectId: 1,
        title: 'ترخيص تقنية إدارة الطاقة الذكية',
        description: 'ترخيص استخدام نظام الذكاء الاصطناعي لإدارة الطاقة المتجددة لمدة 3 سنوات',
        type: 'license' as const,
        partyA: userId,
        partyB: 2, // Mock investor
        totalValue: 150000,
        currency: 'SAR',
        status: 'active' as const,
        startDate: new Date('2026-02-10'),
        endDate: new Date('2029-02-10'),
        terms: 'ترخيص حصري للسوق السعودي مع إمكانية التجديد. يشمل الدعم الفني والتحديثات.',
        milestones: JSON.stringify([
          { id: 1, title: 'تسليم النظام الأساسي', amount: 50000, status: 'completed', dueDate: '2026-03-10' },
          { id: 2, title: 'التدريب والتكامل', amount: 50000, status: 'in_progress', dueDate: '2026-04-10' },
          { id: 3, title: 'الدعم والصيانة', amount: 50000, status: 'pending', dueDate: '2027-02-10' }
        ]),
        blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'
      },
      {
        projectId: 2,
        title: 'بيع نظام التشخيص الطبي الذكي',
        description: 'بيع كامل لنظام التشخيص الطبي المبكر مع التدريب والدعم الفني',
        type: 'acquisition' as const,
        partyA: userId,
        partyB: 3,
        totalValue: 500000,
        currency: 'SAR',
        status: 'active' as const,
        startDate: new Date('2026-02-12'),
        endDate: new Date('2026-08-12'),
        terms: 'بيع كامل للنظام مع نقل جميع الحقوق. دعم فني لمدة سنة.',
        milestones: JSON.stringify([
          { id: 1, title: 'تسليم الكود المصدري', amount: 150000, status: 'completed', dueDate: '2026-03-12' },
          { id: 2, title: 'الاختبارات والتحقق', amount: 150000, status: 'in_progress', dueDate: '2026-04-12' },
          { id: 3, title: 'التدريب والنشر', amount: 100000, status: 'pending', dueDate: '2026-06-12' },
          { id: 4, title: 'الدعم الفني', amount: 100000, status: 'pending', dueDate: '2026-08-12' }
        ]),
        blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef123'
      },
      {
        projectId: 3,
        title: 'استحواذ على شركة الأمن السيبراني',
        description: 'استحواذ كامل على شركة متخصصة في حلول الأمن السيبراني مع جميع الأصول',
        type: 'acquisition' as const,
        partyA: userId,
        partyB: 4,
        totalValue: 2000000,
        currency: 'SAR',
        status: 'active' as const,
        startDate: new Date('2026-02-15'),
        endDate: new Date('2026-12-15'),
        terms: 'استحواذ 100% مع الاحتفاظ بالفريق الإداري. فترة انتقالية 6 أشهر.',
        milestones: JSON.stringify([
          { id: 1, title: 'العناية الواجبة', amount: 400000, status: 'completed', dueDate: '2026-03-15' },
          { id: 2, title: 'نقل الأصول', amount: 400000, status: 'in_progress', dueDate: '2026-05-15' },
          { id: 3, title: 'انتقال الموظفين', amount: 400000, status: 'pending', dueDate: '2026-07-15' },
          { id: 4, title: 'دمج الأنظمة', amount: 400000, status: 'pending', dueDate: '2026-09-15' },
          { id: 5, title: 'الإغلاق النهائي', amount: 400000, status: 'pending', dueDate: '2026-12-15' }
        ]),
        blockchainHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234'
      },
      {
        projectId: 4,
        title: 'ترخيص نظام إدارة المخزون الذكي',
        description: 'ترخيص SaaS لنظام إدارة المخزون بالذكاء الاصطناعي',
        type: 'license' as const,
        partyA: userId,
        partyB: 5,
        totalValue: 80000,
        currency: 'SAR',
        status: 'active' as const,
        startDate: new Date('2026-02-20'),
        endDate: new Date('2027-02-20'),
        terms: 'ترخيص سنوي قابل للتجديد. يشمل التحديثات والدعم الفني.',
        milestones: JSON.stringify([
          { id: 1, title: 'إعداد النظام', amount: 30000, status: 'completed', dueDate: '2026-03-01' },
          { id: 2, title: 'التدريب', amount: 20000, status: 'in_progress', dueDate: '2026-03-15' },
          { id: 3, title: 'الدعم السنوي', amount: 30000, status: 'pending', dueDate: '2027-02-20' }
        ]),
        blockchainHash: '0x4d5e6f7890abcdef1234567890abcdef12345'
      },
      {
        projectId: 5,
        title: 'بيع تقنية تحلية المياه بالطاقة الشمسية',
        description: 'بيع براءة اختراع وتقنية تحلية المياه المبتكرة',
        type: 'acquisition' as const,
        partyA: userId,
        partyB: 6,
        totalValue: 1500000,
        currency: 'SAR',
        status: 'active' as const,
        startDate: new Date('2026-02-25'),
        endDate: new Date('2026-11-25'),
        terms: 'نقل كامل للتقنية وبراءة الاختراع مع التدريب الفني.',
        milestones: JSON.stringify([
          { id: 1, title: 'نقل براءة الاختراع', amount: 500000, status: 'completed', dueDate: '2026-03-25' },
          { id: 2, title: 'تسليم التقنية', amount: 500000, status: 'in_progress', dueDate: '2026-06-25' },
          { id: 3, title: 'التدريب والدعم', amount: 500000, status: 'pending', dueDate: '2026-11-25' }
        ]),
        blockchainHash: '0x5e6f7890abcdef1234567890abcdef123456'
      },
      {
        projectId: 6,
        title: 'ترخيص روبوت خدمة العملاء الذكي',
        description: 'ترخيص استخدام روبوت المحادثة بالذكاء الاصطناعي',
        type: 'license' as const,
        partyA: userId,
        partyB: 7,
        totalValue: 60000,
        currency: 'SAR',
        status: 'pending_signatures' as const,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2027-03-01'),
        terms: 'ترخيص سنوي مع تحديثات مجانية وتكامل مع الأنظمة الحالية.',
        milestones: JSON.stringify([
          { id: 1, title: 'التكامل الأولي', amount: 20000, status: 'pending', dueDate: '2026-03-15' },
          { id: 2, title: 'التدريب', amount: 15000, status: 'pending', dueDate: '2026-04-01' },
          { id: 3, title: 'الدعم السنوي', amount: 25000, status: 'pending', dueDate: '2027-03-01' }
        ]),
        blockchainHash: null
      },
      {
        projectId: 7,
        title: 'بيع منصة التمويل الجماعي',
        description: 'بيع منصة التمويل الجماعي بالكامل مع قاعدة المستخدمين',
        type: 'acquisition' as const,
        partyA: userId,
        partyB: 8,
        totalValue: 800000,
        currency: 'SAR',
        status: 'completed' as const,
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-02-08'),
        terms: 'بيع كامل للمنصة مع قاعدة المستخدمين. فترة انتقالية 3 أشهر.',
        milestones: JSON.stringify([
          { id: 1, title: 'نقل الملكية', amount: 300000, status: 'completed', dueDate: '2026-01-20' },
          { id: 2, title: 'نقل قاعدة البيانات', amount: 250000, status: 'completed', dueDate: '2026-01-30' },
          { id: 3, title: 'الدعم الانتقالي', amount: 250000, status: 'completed', dueDate: '2026-02-08' }
        ]),
        blockchainHash: '0x6f7890abcdef1234567890abcdef1234567'
      },
      {
        projectId: 8,
        title: 'استحواذ على منصة التعليم التفاعلية',
        description: 'استحواذ على منصة تعليمية للأطفال مع المحتوى التعليمي',
        type: 'acquisition' as const,
        partyA: userId,
        partyB: 9,
        totalValue: 1200000,
        currency: 'SAR',
        status: 'active' as const,
        startDate: new Date('2026-02-18'),
        endDate: new Date('2026-10-18'),
        terms: 'استحواذ 80% مع بقاء المؤسس كمستشار لمدة سنتين.',
        milestones: JSON.stringify([
          { id: 1, title: 'الاتفاقية الأولية', amount: 300000, status: 'completed', dueDate: '2026-03-01' },
          { id: 2, title: 'نقل الأصول', amount: 400000, status: 'in_progress', dueDate: '2026-05-18' },
          { id: 3, title: 'التكامل', amount: 300000, status: 'pending', dueDate: '2026-08-18' },
          { id: 4, title: 'الإغلاق النهائي', amount: 200000, status: 'pending', dueDate: '2026-10-18' }
        ]),
        blockchainHash: '0x7890abcdef1234567890abcdef12345678'
      }
    ];

    await db.insert(contracts).values(contractsData);
    console.log(`✅ Inserted ${contractsData.length} contracts`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n✅ Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Ideas: ${ideasData.length}`);
    console.log(`   - Events: ${eventsData.length}`);
    console.log(`   - Transitions: ${transitionsData.length}`);
    console.log(`   - Contracts: ${contractsData.length}`);
    console.log('\n🎉 Platform is now fully populated with demo data!');
    console.log('\n🔗 The three engines are connected:');
    console.log('   UPLINK 1 (Ideas) → UPLINK 2 (Events & Matching) → UPLINK 3 (Smart Contracts)');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}

// Run the seed function
seedDemoData()
  .then(() => {
    console.log('\n✅ Seeding process finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });
