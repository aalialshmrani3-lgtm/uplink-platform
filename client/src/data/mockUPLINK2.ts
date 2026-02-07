/**
 * Mock Data for UPLINK2 - Hackathons, Events & Matching
 */

export const mockHackathons = [
  {
    id: 1,
    title: "هاكاثون الذكاء الاصطناعي للصحة 2026",
    description: "تحدي لتطوير حلول AI مبتكرة في مجال الرعاية الصحية",
    type: "hackathon",
    format: "hybrid", // online, in-person, hybrid
    startDate: new Date("2026-03-15"),
    endDate: new Date("2026-03-17"),
    location: "الرياض، المملكة العربية السعودية",
    onlineLink: "https://zoom.us/j/example",
    status: "upcoming",
    participants: 250,
    maxParticipants: 500,
    prizes: [
      { place: "الأول", amount: 100000, currency: "SAR" },
      { place: "الثاني", amount: 50000, currency: "SAR" },
      { place: "الثالث", amount: 25000, currency: "SAR" },
    ],
    sponsors: [
      { name: "وزارة الصحة", logo: "/sponsors/moh.png", tier: "gold" },
      { name: "شركة أرامكو", logo: "/sponsors/aramco.png", tier: "gold" },
      { name: "STC", logo: "/sponsors/stc.png", tier: "silver" },
    ],
    challenges: [
      {
        id: 1,
        title: "تشخيص الأمراض بالذكاء الاصطناعي",
        description: "تطوير نموذج AI لتشخيص الأمراض من الصور الطبية",
        difficulty: "متقدم",
      },
      {
        id: 2,
        title: "مساعد صحي افتراضي",
        description: "chatbot ذكي للإجابة على الاستفسارات الطبية",
        difficulty: "متوسط",
      },
    ],
    organizer: {
      name: "وزارة الصحة",
      contact: "health.hackathon@moh.gov.sa",
    },
    registrationDeadline: new Date("2026-03-10"),
    tags: ["AI", "Healthcare", "Innovation"],
  },
  {
    id: 2,
    title: "مؤتمر الابتكار الوطني 2026",
    description: "مؤتمر سنوي يجمع المبتكرين والمستثمرين ورواد الأعمال",
    type: "conference",
    format: "in-person",
    startDate: new Date("2026-04-20"),
    endDate: new Date("2026-04-22"),
    location: "جدة، المملكة العربية السعودية",
    status: "upcoming",
    participants: 1500,
    maxParticipants: 2000,
    agenda: [
      {
        day: 1,
        sessions: [
          { time: "09:00", title: "كلمة افتتاحية", speaker: "د. محمد العلي" },
          { time: "10:30", title: "مستقبل الذكاء الاصطناعي", speaker: "أ. سارة أحمد" },
        ],
      },
    ],
    sponsors: [
      { name: "NEOM", logo: "/sponsors/neom.png", tier: "platinum" },
      { name: "PIF", logo: "/sponsors/pif.png", tier: "gold" },
    ],
    organizer: {
      name: "هيئة المنشآت الصغيرة والمتوسطة",
      contact: "conference@monshaat.gov.sa",
    },
    registrationDeadline: new Date("2026-04-15"),
    tags: ["Innovation", "Entrepreneurship", "Networking"],
  },
  {
    id: 3,
    title: "ورشة عمل: تطوير المنتجات الرقمية",
    description: "ورشة عمل عملية لتعلم أساسيات تطوير المنتجات الرقمية",
    type: "workshop",
    format: "online",
    startDate: new Date("2026-03-25"),
    endDate: new Date("2026-03-25"),
    onlineLink: "https://teams.microsoft.com/example",
    status: "open",
    participants: 45,
    maxParticipants: 100,
    instructor: {
      name: "م. خالد السعيد",
      bio: "خبير في تطوير المنتجات مع 15 سنة خبرة",
      photo: "/instructors/khaled.jpg",
    },
    organizer: {
      name: "أكاديمية الابتكار",
      contact: "workshops@innovation-academy.sa",
    },
    registrationDeadline: new Date("2026-03-20"),
    tags: ["Product Development", "Digital", "Training"],
  },
];

export const mockChallenges = [
  {
    id: 1,
    title: "تحدي تحسين كفاءة الطاقة في المباني",
    description: "نبحث عن حلول مبتكرة لتقليل استهلاك الطاقة في المباني الحكومية بنسبة 30%",
    issuer: {
      name: "وزارة الطاقة",
      type: "government",
      logo: "/issuers/moe.png",
    },
    category: "الطاقة والاستدامة",
    budget: 500000,
    currency: "SAR",
    deadline: new Date("2026-06-30"),
    status: "open",
    submissions: 23,
    requirements: [
      "حل قابل للتطبيق على نطاق واسع",
      "تكلفة تنفيذ معقولة",
      "ROI واضح خلال 3 سنوات",
    ],
    evaluationCriteria: [
      { name: "الابتكار", weight: 30 },
      { name: "الجدوى الاقتصادية", weight: 25 },
      { name: "الأثر البيئي", weight: 25 },
      { name: "قابلية التنفيذ", weight: 20 },
    ],
    tags: ["Energy", "Sustainability", "Government"],
  },
  {
    id: 2,
    title: "تحدي تطوير منصة تعليمية تفاعلية",
    description: "شركة تعليمية كبرى تبحث عن منصة تعليمية مبتكرة تستخدم الذكاء الاصطناعي",
    issuer: {
      name: "مجموعة التعليم المتقدم",
      type: "company",
      logo: "/issuers/edu-group.png",
    },
    category: "التعليم والتدريب",
    budget: 300000,
    currency: "SAR",
    deadline: new Date("2026-05-15"),
    status: "open",
    submissions: 15,
    requirements: [
      "دعم اللغة العربية والإنجليزية",
      "تكامل مع أنظمة LMS موجودة",
      "تحليلات متقدمة للأداء",
    ],
    evaluationCriteria: [
      { name: "تجربة المستخدم", weight: 35 },
      { name: "الابتكار التقني", weight: 30 },
      { name: "قابلية التوسع", weight: 20 },
      { name: "السعر", weight: 15 },
    ],
    tags: ["Education", "AI", "Platform"],
  },
];

export const mockMatches = [
  {
    id: 1,
    innovator: {
      id: 1,
      name: "أحمد محمد",
      idea: "منصة ذكية لإدارة النفايات باستخدام IoT",
      score: 85,
    },
    investor: {
      id: 10,
      name: "صندوق الاستثمارات البيئية",
      type: "fund",
      focus: ["البيئة", "المدن الذكية"],
    },
    matchScore: 92,
    status: "pending",
    matchedAt: new Date("2026-02-01"),
    reasons: [
      "توافق كبير في المجال (البيئة والاستدامة)",
      "المستثمر يبحث عن حلول IoT",
      "حجم الاستثمار المطلوب يتناسب مع ميزانية الصندوق",
    ],
  },
  {
    id: 2,
    innovator: {
      id: 2,
      name: "سارة أحمد",
      idea: "تطبيق للتعليم التفاعلي بالواقع المعزز",
      score: 72,
    },
    company: {
      id: 20,
      name: "شركة التقنيات التعليمية",
      type: "company",
      focus: ["التعليم", "التكنولوجيا"],
    },
    matchScore: 88,
    status: "accepted",
    matchedAt: new Date("2026-01-28"),
    meetingScheduled: new Date("2026-02-15"),
    reasons: [
      "الشركة تبحث عن حلول AR في التعليم",
      "خبرة الشركة في السوق التعليمي",
      "إمكانية شراكة استراتيجية",
    ],
  },
];

export const mockEventStats = {
  totalEvents: 45,
  upcomingEvents: 12,
  ongoingEvents: 3,
  completedEvents: 30,
  totalParticipants: 5420,
  byType: {
    hackathons: 15,
    conferences: 8,
    workshops: 22,
  },
  byFormat: {
    online: 18,
    inPerson: 12,
    hybrid: 15,
  },
};
