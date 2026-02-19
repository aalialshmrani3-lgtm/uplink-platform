import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Database,
  Cpu,
  BarChart3
} from 'lucide-react';
import { getLoginUrl } from '@/const';
import { useAuth } from '@/_core/hooks/useAuth';
import SEOHead from '@/components/SEOHead';
import { mockIdeas, mockClassificationStats } from '@/data/mockNAQLA1';

export default function Naqla1() {
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const analysisSteps = [
    {
      icon: Lightbulb,
      title: 'استقبال الفكرة',
      description: 'يقوم المبتكر بإدخال فكرته مع جميع التفاصيل والمستندات الداعمة'
    },
    {
      icon: Brain,
      title: 'التحليل بالذكاء الاصطناعي',
      description: 'تحليل الفكرة باستخدام خوارزميات ML/NLP المتقدمة والبيانات التاريخية'
    },
    {
      icon: Database,
      title: 'المقارنة مع قاعدة البيانات',
      description: 'مقارنة الفكرة مع الابتكارات السابقة والتحديات الحالية'
    },
    {
      icon: BarChart3,
      title: 'التقييم والتصنيف',
      description: 'تقييم الفكرة بناءً على معايير متعددة وتصنيفها إلى 3 مستويات'
    },
    {
      icon: CheckCircle2,
      title: 'النتيجة والتوجيه',
      description: 'إصدار تقرير شامل وتوجيه الفكرة للمسار المناسب'
    }
  ];

  const classificationLevels = [
    {
      icon: CheckCircle2,
      level: 'ابتكار حقيقي',
      score: '≥70%',
      color: 'from-green-500 to-emerald-600',
      description: 'فكرة تحقق معايير الابتكار الصارمة',
      criteria: [
        'جدة تقنية عالية (Novelty)',
        'أثر اقتصادي واجتماعي كبير',
        'جدوى تقنية وتجارية مثبتة',
        'قابلية للتطوير (Scalability)'
      ],
      nextStep: 'تنتقل تلقائياً إلى NAQLA 2 للمطابقة مع التحديات والمستثمرين'
    },
    {
      icon: AlertCircle,
      level: 'مشروع تجاري / حل جزئي',
      score: '50-70%',
      color: 'from-yellow-500 to-orange-600',
      description: 'فكرة لها قيمة تجارية لكن لا تصنف كابتكار',
      criteria: [
        'حل لمشكلة محددة',
        'قيمة تجارية واضحة',
        'تحسين على حلول موجودة',
        'سوق محدد ومعروف'
      ],
      nextStep: 'توجيه إلى شبكة المطابقة في NAQLA 2 للربط مع المستثمرين'
    },
    {
      icon: XCircle,
      level: 'تحتاج تطوير',
      score: '<50%',
      color: 'from-red-500 to-rose-600',
      description: 'فكرة لا تحقق المعايير المطلوبة',
      criteria: [
        'نقص في الجدة أو الأصالة',
        'جدوى تقنية أو تجارية ضعيفة',
        'أثر محدود أو غير واضح',
        'تحديات تنفيذية كبيرة'
      ],
      nextStep: 'إرجاع للمرسل مع تقرير مفصل وتوجيهات للتحسين'
    }
  ];

  const evaluationCriteria = [
    {
      name: 'الجدة التقنية',
      weight: '15%',
      description: 'مدى أصالة الفكرة وتميزها عن الحلول الموجودة'
    },
    {
      name: 'الأثر المجتمعي',
      weight: '15%',
      description: 'التأثير الاجتماعي والبيئي والاقتصادي المحتمل'
    },
    {
      name: 'الجدوى التقنية',
      weight: '12%',
      description: 'إمكانية التنفيذ باستخدام التقنيات المتاحة'
    },
    {
      name: 'القيمة التجارية',
      weight: '12%',
      description: 'حجم السوق والطلب المتوقع والعائد على الاستثمار'
    },
    {
      name: 'قابلية التوسع',
      weight: '10%',
      description: 'إمكانية توسيع الحل ليشمل أسواق وقطاعات أكبر'
    },
    {
      name: 'الاستدامة',
      weight: '10%',
      description: 'قدرة الحل على الاستمرار والتطور على المدى البعيد'
    },
    {
      name: 'المخاطر التقنية',
      weight: '8%',
      description: 'تقييم المخاطر والتحديات التقنية المحتملة'
    },
    {
      name: 'سرعة التنفيذ',
      weight: '8%',
      description: 'الوقت المتوقع للوصول إلى السوق (Time to Market)'
    },
    {
      name: 'الميزة التنافسية',
      weight: '5%',
      description: 'ما يميز الحل عن المنافسين في السوق'
    },
    {
      name: 'الاستعداد التنظيمي',
      weight: '5%',
      description: 'جاهزية الفريق والمؤسسة لتنفيذ الفكرة'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'فكرة تم تحليلها', icon: Lightbulb },
    { number: '3,200+', label: 'ابتكار حقيقي', icon: Sparkles },
    { number: '95%', label: 'دقة التحليل', icon: Brain },
    { number: '< 24h', label: 'وقت التحليل', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <SEOHead 
        title="NAQLA1 - محرك تحليل الأفكار بالذكاء الاصطناعي"
        description="تحليل الأفكار والابتكارات باستخدام الذكاء الاصطناعي المتقدم. تصنيف ذكي إلى 3 مستويات: ابتكار حقيقي، مشروع تجاري، أو فكرة تحتاج تطوير."
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 animate-fade-in">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">محرك التحليل بالذكاء الاصطناعي</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in-up">
              NAQLA 1
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-fade-in-up animation-delay-100">
              تحليل الأفكار بالذكاء الاصطناعي
            </p>
            
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              نحلل فكرتك باستخدام خوارزميات الذكاء الاصطناعي المتقدمة والبيانات التاريخية لتحديد مستوى الابتكار وتوجيهها للمسار المناسب
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-300">
              {user ? (
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/naqla1/submit">
                    <Sparkles className="w-5 h-5 mr-2" />
                    ابدأ تحليل فكرتك
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <a href={getLoginUrl()}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    سجل دخول لتحليل فكرتك
                  </a>
                </Button>
              )}
              <Link href="/naqla1/ideas/120002/analysis">
                <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
                  شاهد مثال حي
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-purple-700 hover:bg-purple-800">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  وجّه الفكرة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">كيف يعمل التحليل؟</h2>
            <p className="text-xl text-gray-400">خمس خطوات لتحليل فكرتك بدقة عالية</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {analysisSteps.map((step, index) => (
              <Card 
                key={index}
                className="glass-card p-6 hover:scale-105 transition-all duration-300 relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <step.icon className={`w-12 h-12 mb-4 transition-colors duration-300 ${hoveredCard === index ? 'text-blue-400' : 'text-gray-400'}`} />
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Classification Levels */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">مستويات التصنيف</h2>
            <p className="text-xl text-gray-400">نصنف الأفكار إلى 3 مستويات بناءً على معايير دقيقة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {classificationLevels.map((level, index) => (
              <Card 
                key={index}
                className="glass-card p-8 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500/50"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mb-6`}>
                  <level.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{level.level}</h3>
                <div className="text-sm text-gray-400 mb-4">نقاط التقييم: {level.score}</div>
                <p className="text-gray-300 mb-6">{level.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">المعايير:</h4>
                  <ul className="space-y-2">
                    {level.criteria.map((criterion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">الخطوة التالية:</h4>
                  <p className="text-sm text-gray-300">{level.nextStep}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">معايير التقييم</h2>
            <p className="text-xl text-gray-400">نقيّم الأفكار بناءً على 10 معايير رئيسية محدثة بأوزان مختلفة</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {evaluationCriteria.map((criterion, index) => (
              <Card 
                key={index}
                className="glass-card p-6 hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{criterion.weight}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{criterion.name}</h3>
                    <p className="text-gray-400">{criterion.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-card p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-white mb-4">
              جاهز لتحليل فكرتك؟
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              ابدأ الآن واحصل على تقرير تحليل شامل خلال 24 ساعة
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  ابدأ التحليل الآن
                </Button>
              ) : (
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <a href={getLoginUrl()}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    سجل دخول للبدء
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild className="border-gray-700 hover:bg-gray-800">
                <Link href="/">
                  <ArrowRight className="w-5 h-5 ml-2" />
                  العودة للرئيسية
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
