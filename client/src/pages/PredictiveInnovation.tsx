import { TrendingUp, Brain, Globe, Sparkles, Target, BarChart3, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PredictiveInnovation() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const features = [
    {
      icon: <TrendingUp className="text-blue-600" size={32} />,
      title: "تحليل اتجاهات السوق",
      description: "مراقبة وتحليل اتجاهات السوق العالمية في الوقت الفعلي عبر 50+ صناعة",
      stats: "50+ صناعة",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Brain className="text-purple-600" size={32} />,
      title: "تتبع براءات الاختراع",
      description: "رصد براءات الاختراع الناشئة من USPTO, EPO, WIPO وتحديد الفجوات",
      stats: "3M+ براءة",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <Globe className="text-green-600" size={32} />,
      title: "الأبحاث الأكاديمية",
      description: "تتبع أحدث الأبحاث من IEEE, Nature, Science وقواعد البيانات الأكاديمية",
      stats: "100K+ بحث/شهر",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Sparkles className="text-orange-600" size={32} />,
      title: "تحليل وسائل التواصل",
      description: "استخلاص رؤى من محادثات وسائل التواصل الاجتماعي والمنتديات المتخصصة",
      stats: "10M+ منشور/يوم",
      color: "from-orange-500 to-red-600",
    },
  ];

  const predictions = [
    {
      id: 1,
      title: "فرصة في الطاقة المتجددة",
      category: "طاقة",
      confidence: 94,
      trend: "صاعد",
      description: "تزايد الطلب على حلول تخزين الطاقة الشمسية بتقنية الجرافين",
      insights: [
        "زيادة 340% في براءات الاختراع المرتبطة بالجرافين",
        "45 بحث أكاديمي جديد في الربع الأخير",
        "استثمارات بقيمة $2.3B في الشركات الناشئة",
      ],
      action: "استكشف الفرصة",
      timeframe: "6-12 شهر",
    },
    {
      id: 2,
      title: "ثورة في الرعاية الصحية الرقمية",
      category: "صحة",
      confidence: 89,
      trend: "صاعد",
      description: "تشخيص الأمراض المبكر باستخدام AI والتصوير الطبي المتقدم",
      insights: [
        "معدل دقة 98% في الكشف المبكر عن السرطان",
        "تمويل حكومي بقيمة $1.8B للبحث والتطوير",
        "نمو السوق المتوقع: 28% سنوياً",
      ],
      action: "ابدأ مشروع",
      timeframe: "3-6 أشهر",
    },
    {
      id: 3,
      title: "تقنيات الزراعة الذكية",
      category: "زراعة",
      confidence: 87,
      trend: "صاعد",
      description: "أنظمة الري الذكي المدعومة بـ IoT والذكاء الاصطناعي",
      insights: [
        "توفير 60% من استهلاك المياه",
        "زيادة الإنتاجية بنسبة 45%",
        "اعتماد متزايد في منطقة الشرق الأوسط",
      ],
      action: "تقييم الجدوى",
      timeframe: "9-18 شهر",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            NAQLA 6.0 Preview
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            الابتكار التنبؤي
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف فرص الابتكار قبل المنافسين من خلال تحليل ذكي لاتجاهات السوق، براءات الاختراع، الأبحاث الأكاديمية، ووسائل التواصل الاجتماعي
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {feature.description}
              </p>
              <Badge variant="secondary">{feature.stats}</Badge>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "كيف يعمل النظام" : "[كيف يعمل النظام]"}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? "جمع البيانات" : "جمع Data"}</h4>
              <p className="text-sm text-muted-foreground">
                جمع بيانات من مصادر عالمية متعددة في الوقت الفعلي
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? "التحليل الذكي" : "Analysis الذكي"}</h4>
              <p className="text-sm text-muted-foreground">
                تحليل متقدم باستخدام خوارزميات AI وML
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? "التنبؤ بالفرص" : "التنبؤ بOpportunities"}</h4>
              <p className="text-sm text-muted-foreground">
                تحديد فجوات السوق والفرص الناشئة
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? "التوصيات" : "Recommendations"}</h4>
              <p className="text-sm text-muted-foreground">
                توصيات قابلة للتنفيذ مع خطط عمل
              </p>
            </div>
          </div>
        </Card>

        {/* Predictions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "توقعات الابتكار الحالية" : "توقعات اNoبتكار الحالية"}</h2>
          <div className="space-y-6">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge>{prediction.category}</Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                          {prediction.trend} ↗
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{prediction.title}</h3>
                      <p className="text-muted-foreground">{prediction.description}</p>
                    </div>
                    <div className="text-center ml-6">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {prediction.confidence}%
                      </div>
                      <div className="text-xs text-muted-foreground">{isAr ? "ثقة" : "[ثقة]"}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {prediction.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={16} />
                        <p className="text-sm text-muted-foreground">{insight}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      الإطار الزمني: <span className="font-semibold">{prediction.timeframe}</span>
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                      {prediction.action}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="text-5xl mb-6">🔮</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? "كن أول من يكتشف الفرص" : "كن أول من يكتشف Opportunities"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى البرنامج التجريبي للابتكار التنبؤي واحصل على ميزة تنافسية لا تُضاهى
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center gap-2">
                انضم للبرنامج التجريبي
                <ArrowRight size={20} />
              </button>
            </Link>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              اعرف المزيد
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
