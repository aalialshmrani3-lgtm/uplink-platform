import { Leaf, Shield, Award, TrendingUp, CheckCircle2, ArrowRight, Target, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SustainabilityAIEthics() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const esgMetrics = [
    {
      category: "البيئة",
      icon: "🌱",
      color: "from-green-500 to-emerald-600",
      metrics: [
        "انبعاثات الكربون",
        "استهلاك الطاقة",
        "إدارة النفايات",
        "استخدام المياه",
        "الاقتصاد الدائري",
      ],
    },
    {
      category: "المجتمع",
      icon: "👥",
      color: "from-blue-500 to-cyan-600",
      metrics: [
        "تأثير المجتمع",
        "حقوق العمال",
        "التنوع والشمول",
        "سلامة المنتج",
        "المسؤولية الاجتماعية",
      ],
    },
    {
      category: "الحوكمة",
      icon: "⚖️",
      color: "from-purple-500 to-pink-600",
      metrics: [
        "أخلاقيات الأعمال",
        "الشفافية",
        "حقوق المساهمين",
        "إدارة المخاطر",
        "الامتثال التنظيمي",
      ],
    },
  ];

  const aiEthicsPrinciples = [
    {
      title: "الشفافية والقابلية للتفسير",
      icon: "🔍",
      description: "جميع قرارات AI يجب أن تكون قابلة للتفسير والفهم من قبل المستخدمين",
      practices: [
        "توثيق كامل لنماذج AI المستخدمة",
        "تفسير واضح لكيفية اتخاذ القرارات",
        "شفافية في البيانات المستخدمة للتدريب",
      ],
    },
    {
      title: "العدالة وعدم التحيز",
      icon: "⚖️",
      description: "ضمان عدم وجود تحيز في نماذج AI وتحقيق العدالة في جميع القرارات",
      practices: [
        "اختبار منتظم للتحيز في النماذج",
        "تنوع في بيانات التدريب",
        "مراجعة مستقلة للخوارزميات",
      ],
    },
    {
      title: "الخصوصية وحماية البيانات",
      icon: "🔒",
      description: "حماية صارمة لبيانات المستخدمين والامتثال لجميع قوانين الخصوصية",
      practices: [
        "تشفير شامل للبيانات",
        "الحد الأدنى من جمع البيانات",
        "حق المستخدم في حذف بياناته",
      ],
    },
    {
      title: "المساءلة والمسؤولية",
      icon: "👤",
      description: "مسؤولية واضحة عن قرارات وتأثيرات أنظمة AI",
      practices: [
        "آليات واضحة للمساءلة",
        "مراجعة دورية للأنظمة",
        "قنوات للإبلاغ عن المشاكل",
      ],
    },
  ];

  const certifications = [
    {
      name: "ISO 14001",
      category: "بيئي",
      description: "نظام إدارة بيئية",
      icon: "🌍",
    },
    {
      name: "B Corp",
      category: "استدامة",
      description: "شهادة الأعمال المستدامة",
      icon: "🏆",
    },
    {
      name: "LEED",
      category: "بيئي",
      description: "الريادة في الطاقة والتصميم البيئي",
      icon: "🏢",
    },
    {
      name: "AI Ethics Certified",
      category: "أخلاقيات AI",
      description: "شهادة أخلاقيات الذكاء الاصطناعي",
      icon: "🤖",
    },
  ];

  const impactMetrics = [
    { label: "تقليل انبعاثات CO₂", value: "-45%", icon: "🌱" },
    { label: "مشاريع مستدامة", value: "3,200+", icon: "♻️" },
    { label: "امتثال أخلاقيات AI", value: "100%", icon: "✓" },
    { label: "شهادات استدامة", value: "850+", icon: "🏆" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
            NAQLA 6.0 Preview
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            الاستدامة وأخلاقيات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            دمج معايير ESG وأخلاقيات AI في صميم عملية الابتكار لضمان مستقبل مستدام ومسؤول
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {impactMetrics.map((metric, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-all">
              <div className="text-4xl mb-3">{metric.icon}</div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </Card>
          ))}
        </div>

        {/* ESG Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "معايير ESG المتكاملة" : "[معايير ESG المتكاملة]"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {esgMetrics.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4 text-center">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-center">{category.category}</h3>
                <div className="space-y-3">
                  {category.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                      <span className="text-sm">{metric}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Ethics Principles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "مبادئ أخلاقيات الذكاء الاصطناعي" : "مبادئ أخNoقيات الذكاء اNoصطناعي"}</h2>
          <div className="space-y-6">
            {aiEthicsPrinciples.map((principle, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{principle.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{principle.title}</h3>
                    <p className="text-muted-foreground mb-4">{principle.description}</p>
                    <div className="grid md:grid-cols-3 gap-3">
                      {principle.practices.map((practice, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={16} />
                          <span className="text-sm">{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "الشهادات والامتثال" : "الشهادات واNoمتثال"}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="text-5xl mb-4">{cert.icon}</div>
                <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                <Badge variant="secondary" className="mb-3">{cert.category}</Badge>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Assessment Tool */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/20">
          <h2 className="text-3xl font-bold mb-6 text-center">{isAr ? "أداة تقييم الاستدامة وأخلاقيات AI" : "أداة تقييم اNoستدامة وأخNoقيات AI"}</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            قيّم مشروعك الابتكاري بناءً على معايير ESG وأخلاقيات AI واحصل على تقرير شامل مع توصيات للتحسين
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Target className="text-green-600" size={32} />
              </div>
              <h4 className="font-bold mb-2">{isAr ? "تقييم شامل" : "[تقييم شامل]"}</h4>
              <p className="text-sm text-muted-foreground">
                تقييم متعدد الأبعاد يغطي جميع جوانب ESG وأخلاقيات AI
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="text-blue-600" size={32} />
              </div>
              <h4 className="font-bold mb-2">{isAr ? "تقرير تفصيلي" : "[تقرير تفصيلي]"}</h4>
              <p className="text-sm text-muted-foreground">
                تقرير مفصل مع نقاط القوة والضعف والمقارنة مع المعايير
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <h4 className="font-bold mb-2">{isAr ? "توصيات عملية" : "[توصيات عملية]"}</h4>
              <p className="text-sm text-muted-foreground">
                خطة عمل واضحة لتحسين أداء الاستدامة والأخلاقيات
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all inline-flex items-center gap-2">
                ابدأ التقييم الآن
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/20">
          <div className="text-5xl mb-6">🌍</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? "ابتكر بمسؤولية" : "Innovate بمسؤولية"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى حركة الابتكار المسؤول وكن جزءاً من بناء مستقبل مستدام للجميع
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center gap-2">
                ابدأ رحلتك المستدامة
                <ArrowRight size={20} />
              </button>
            </Link>
            <button className="px-8 py-4 bg-background border-2 border-green-600 text-green-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              اعرف المزيد
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
