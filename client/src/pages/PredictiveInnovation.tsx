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
      title: "Market Trend Analysis",
      description: "Monitor and analyze global market trends in real-time across 50+ industries",
      stats: "50+ Industries",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Brain className="text-purple-600" size={32} />,
      title: "Patent Tracking",
      description: "Monitor emerging patents from USPTO, EPO, WIPO and identify gaps",
      stats: "3M+ Patents",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <Globe className="text-green-600" size={32} />,
      title: "Academic Research",
      description: "Track latest research from IEEE, Nature, Science, and academic databases",
      stats: "100K+ Research/Month",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Sparkles className="text-orange-600" size={32} />,
      title: "Social Media Analysis",
      description: "Extract insights from social media conversations and specialized forums",
      stats: "10M+ Posts/Day",
      color: "from-orange-500 to-red-600",
    },
  ];

  const predictions = [
    {
      id: 1,
      title: "Renewable Energy Opportunity",
      category: "Energy",
      confidence: 94,
      trend: "Rising",
      description: "Growing demand for graphene-based solar energy storage solutions",
      insights: [
        isAr ? "زيادة 340% في براءات الاختراع المرتبطة بالجرافين" : "340% increase in graphene-related patents",
        isAr ? "45 بحث أكاديمي جديد في الربع الأخير" : "45 new academic papers in the last quarter",
        isAr ? "استثمارات بقيمة $2.3B في الشركات الناشئة" : "$2.3B investments in startups",
      ],
      action: "Explore Opportunity",
      timeframe: "6-12 Months",
    },
    {
      id: 2,
      title: "Digital Healthcare Revolution",
      category: "Health",
      confidence: 89,
      trend: "Rising",
      description: "Early disease diagnosis using AI and advanced medical imaging",
      insights: [
        isAr ? "معدل دقة 98% في الكشف المبكر عن السرطان" : "98% accuracy in early cancer detection",
        isAr ? "تمويل حكومي بقيمة $1.8B للبحث والتطوير" : "$1.8B government funding for R&D",
        isAr ? "نمو السوق المتوقع: 28% سنوياً" : "Expected market growth: 28% annually",
      ],
      action: "Start Project",
      timeframe: "3-6 Months",
    },
    {
      id: 3,
      title: "Smart Farming Technologies",
      category: "Agriculture",
      confidence: 87,
      trend: "Rising",
      description: "Smart IoT & AI Irrigation Systems",
      insights: [
        isAr ? "توفير 60% من استهلاك المياه" : "60% Water Saving",
        isAr ? "زيادة الإنتاجية بنسبة 45%" : "45% Productivity Increase",
        isAr ? "اعتماد متزايد في منطقة الشرق الأوسط" : "Growing Adoption in MENA",
      ],
      action: "Feasibility Assessment",
      timeframe: "9-18 Months",
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "كيف يعمل النظام" : "How it Works" : "How it Works"}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? isAr ? "جمع البيانات" : "Data Collection" : "Data Collection"}</h4>
              <p className="text-sm text-muted-foreground">
                جمع بيانات من مصادر عالمية متعددة في الوقت الفعلي
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? isAr ? "التحليل الذكي" : "Smart Analysis" : "Smart Analysis"}</h4>
              <p className="text-sm text-muted-foreground">
                تحليل متقدم باستخدام خوارزميات AI وML
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-bold mb-2">{isAr ? isAr ? "التنبؤ بالفرص" : "Opportunity Prediction" : "Opportunity Prediction"}</h4>
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "توقعات الابتكار الحالية" : "Current Innovation Forecasts" : "Current Innovation Forecasts"}</h2>
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
                      <div className="text-xs text-muted-foreground">{isAr ? isAr ? "ثقة" : "Trust" : "Trust"}</div>
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
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "كن أول من يكتشف الفرص" : "Be First to Discover Opportunities" : "Be First to Discover Opportunities"}</h2>
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
