/**
 * Mock Data for UPLINK1 - AI-Powered Idea Analysis
 */

export const mockIdeas = [
  {
    id: 1,
    title: "منصة ذكية لإدارة النفايات باستخدام IoT",
    description: "نظام متكامل يستخدم أجهزة استشعار IoT لمراقبة مستويات النفايات في الحاويات وتحسين مسارات جمع النفايات باستخدام الذكاء الاصطناعي",
    problem: "عدم كفاءة جمع النفايات يؤدي إلى تكاليف عالية وتلوث بيئي",
    solution: "أجهزة استشعار ذكية + خوارزميات AI لتحسين المسارات",
    category: "البيئة والاستدامة",
    status: "analyzed",
    score: 85,
    classification: "real_innovation",
    createdAt: new Date("2026-01-15"),
    userId: 1,
  },
  {
    id: 2,
    title: "تطبيق للتعليم التفاعلي بالواقع المعزز",
    description: "منصة تعليمية تستخدم AR لتحويل الكتب المدرسية إلى تجارب تفاعلية ثلاثية الأبعاد",
    problem: "التعليم التقليدي غير جذاب للطلاب",
    solution: "محتوى AR تفاعلي + ألعاب تعليمية",
    category: "التعليم والتدريب",
    status: "analyzed",
    score: 72,
    classification: "real_innovation",
    createdAt: new Date("2026-01-20"),
    userId: 2,
  },
  {
    id: 3,
    title: "نظام مراقبة صحة المسنين عن بُعد",
    description: "أجهزة قابلة للارتداء تراقب العلامات الحيوية وترسل تنبيهات للعائلة والأطباء",
    problem: "صعوبة مراقبة صحة المسنين بشكل مستمر",
    solution: "أجهزة ذكية + تطبيق موبايل + نظام تنبيهات",
    category: "الصحة والرعاية",
    status: "analyzed",
    score: 68,
    classification: "business_solution",
    createdAt: new Date("2026-01-25"),
    userId: 3,
  },
  {
    id: 4,
    title: "منصة تجارة إلكترونية للمنتجات المحلية",
    description: "سوق إلكتروني يربط المنتجين المحليين بالمستهلكين مباشرة",
    problem: "صعوبة وصول المنتجين الصغار للأسواق",
    solution: "منصة e-commerce + logistics + دعم تسويقي",
    category: "التجارة والأعمال",
    status: "analyzed",
    score: 58,
    classification: "business_solution",
    createdAt: new Date("2026-02-01"),
    userId: 4,
  },
  {
    id: 5,
    title: "تطبيق لحجز مواقف السيارات الذكية",
    description: "نظام يسمح للمستخدمين بحجز ودفع رسوم مواقف السيارات مسبقاً",
    problem: "صعوبة إيجاد مواقف سيارات في المدن المزدحمة",
    solution: "تطبيق موبايل + نظام دفع + خرائط",
    category: "النقل والمواصلات",
    status: "pending",
    score: 45,
    classification: "needs_development",
    createdAt: new Date("2026-02-05"),
    userId: 5,
  },
];

export const mockAnalysis = {
  id: 1,
  ideaId: 1,
  // 10 معايير جديدة
  technicalNoveltyScore: 88,
  socialImpactScore: 92,
  technicalFeasibilityScore: 85,
  commercialValueScore: 78,
  scalabilityScore: 90,
  sustainabilityScore: 95,
  technicalRiskScore: 70,
  timeToMarketScore: 75,
  competitiveAdvantageScore: 82,
  organizationalReadinessScore: 68,
  
  overallScore: 85,
  classification: "real_innovation",
  
  // TRL Assessment
  trlLevel: 4,
  trlDescription: "Technology validated in lab - النموذج الأولي تم اختباره في بيئة معملية",
  
  // Stage Gate
  currentStageGate: "business_case",
  stageGateRecommendation: "الانتقال إلى مرحلة التطوير بعد تأمين التمويل الأولي",
  
  // Detailed Analysis
  aiAnalysis: "فكرة مبتكرة تجمع بين IoT والذكاء الاصطناعي لحل مشكلة حقيقية في إدارة النفايات. التكنولوجيا متوفرة والسوق واعد.",
  
  strengths: [
    "تكنولوجيا IoT ناضجة ومتوفرة",
    "توفير كبير في التكاليف التشغيلية",
    "أثر بيئي إيجابي واضح",
    "قابلية للتوسع في مدن متعددة"
  ],
  
  weaknesses: [
    "تكلفة استثمار أولية عالية",
    "يحتاج شراكات مع البلديات",
    "صيانة الأجهزة في الظروف القاسية"
  ],
  
  opportunities: [
    "دعم حكومي للمبادرات البيئية",
    "نمو سوق المدن الذكية",
    "إمكانية التوسع الإقليمي",
    "بيانات قيمة للتحليل والتخطيط"
  ],
  
  threats: [
    "منافسة من شركات عالمية كبيرة",
    "تغييرات في اللوائح البيئية",
    "مقاومة التغيير من الجهات التقليدية"
  ],
  
  recommendations: [
    "البدء بمشروع تجريبي في منطقة محدودة",
    "تأمين شراكة مع بلدية رائدة",
    "تطوير نموذج عمل B2G واضح",
    "بناء فريق تقني متخصص في IoT"
  ],
  
  nextSteps: [
    "إعداد دراسة جدوى تفصيلية",
    "تطوير MVP (Minimum Viable Product)",
    "التواصل مع البلديات المحتملة",
    "البحث عن مستثمرين أو تمويل حكومي"
  ],
  
  similarInnovations: [
    {
      name: "Bigbelly Smart Waste",
      description: "حاويات نفايات ذكية بالطاقة الشمسية",
      url: "https://bigbelly.com"
    },
    {
      name: "Sensoneo",
      description: "منصة إدارة نفايات ذكية",
      url: "https://sensoneo.com"
    }
  ],
  
  keywords: ["IoT", "Smart Cities", "Waste Management", "AI", "Sustainability"],
  sentiment: 0.85,
  complexityLevel: "متوسط إلى عالي",
  marketSize: "كبير - سوق عالمي بمليارات الدولارات",
  competitionLevel: "متوسط - منافسة موجودة لكن السوق ينمو",
  trends: ["المدن الذكية", "الاقتصاد الدائري", "الاستدامة البيئية"],
  
  createdAt: new Date("2026-01-15"),
};

export const mockClassificationStats = {
  total: 150,
  realInnovation: 45,
  businessSolution: 68,
  needsDevelopment: 37,
  byCategory: {
    "البيئة والاستدامة": 28,
    "التعليم والتدريب": 32,
    "الصحة والرعاية": 25,
    "التجارة والأعمال": 35,
    "النقل والمواصلات": 18,
    "الطاقة": 12,
  },
  byMonth: [
    { month: "يناير", count: 42 },
    { month: "فبراير", count: 58 },
    { month: "مارس", count: 50 },
  ],
};
