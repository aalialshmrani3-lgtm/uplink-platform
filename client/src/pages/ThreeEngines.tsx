import { Shield, Brain, Globe, ArrowRight, Check, Zap, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ThreeEngines() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const engines = [
    {
      id: 1,
      name: "NAQLA1",
      title: "محرك توليد الملكية الفكرية",
      subtitle: "IP Generation Engine",
      icon: Shield,
      color: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-500/20",
      description: "نظام متكامل لتتبع الأفكار من المفهوم إلى براءة الاختراع مع تقييم AI لقابلية التسجيل",
      features: [
        {
          title: "تتبع الأفكار",
          description: "من المفهوم الأولي إلى براءة الاختراع المسجلة",
          icon: "📝",
        },
        {
          title: "تقييم AI",
          description: "تقييم قابلية براءة الاختراع باستخدام الذكاء الاصطناعي",
          icon: "🤖",
        },
        {
          title: "إدارة محفظة IP",
          description: "إدارة شاملة لجميع الملكيات الفكرية",
          icon: "📊",
        },
        {
          title: "توثيق Blockchain",
          description: "حماية الملكية بتقنية البلوكتشين الآمنة",
          icon: "⛓️",
        },
        {
          title: "تكامل SAIP & WIPO",
          description: "تسجيل مباشر مع الجهات الرسمية",
          icon: "🏛️",
        },
        {
          title: "تقارير تفصيلية",
          description: "تقارير شاملة عن حالة كل ملكية فكرية",
          icon: "📄",
        },
      ],
      stats: [
        { label: "براءة مسجلة", value: "145+" },
        { label: "علامة تجارية", value: "89+" },
        { label: "معدل النجاح", value: "92%" },
      ],
      link: "/ip/register",
      cta: "سجل ملكيتك الفكرية",
    },
    {
      id: 2,
      name: "NAQLA2",
      title: "محرك التحديات والمطابقة",
      subtitle: "Challenge Matching Engine",
      icon: Brain,
      color: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-500/10",
      borderColor: "border-blue-500/20",
      description: "خوارزمية مطابقة ذكية تربط المبتكرين بالمستثمرين والشركات المناسبة",
      features: [
        {
          title: "مطابقة ذكية",
          description: "خوارزمية AI متقدمة للمطابقة المثالية",
          icon: "🎯",
        },
        {
          title: "توصيات الخبراء",
          description: "توصيات AI للخبراء المناسبين",
          icon: "👥",
        },
        {
          title: "تشكيل فريق تلقائي",
          description: "بناء فرق متكاملة بناءً على المهارات",
          icon: "🤝",
        },
        {
          title: "تحديات ومسابقات",
          description: "منصة للتحديات والمسابقات الابتكارية",
          icon: "🏆",
        },
        {
          title: "تقييم متعدد المعايير",
          description: "تقييم شامل بناءً على معايير متعددة",
          icon: "⭐",
        },
        {
          title: "تحليلات متقدمة",
          description: "رؤى عميقة حول فرص المطابقة",
          icon: "📈",
        },
      ],
      stats: [
        { label: "مطابقة ناجحة", value: "2,500+" },
        { label: "تحدي نشط", value: "50+" },
        { label: "معدل الرضا", value: "95%" },
      ],
      link: "/challenges",
      cta: "استكشف التحديات",
    },
    {
      id: 3,
      name: "NAQLA3",
      title: "محرك السوق المفتوح",
      subtitle: "Open Market Engine",
      icon: Globe,
      color: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      description: "سوق مفتوح لتبادل الابتكارات مع عقود ذكية ونظام ضمان آمن",
      features: [
        {
          title: "سوق الابتكارات",
          description: "منصة لعرض وشراء الابتكارات",
          icon: "🛒",
        },
        {
          title: "نظام عطاءات",
          description: "نظام عطاءات شفاف وعادل",
          icon: "💰",
        },
        {
          title: "عقود ذكية",
          description: "عقود آمنة وقابلة للتنفيذ تلقائياً",
          icon: "📜",
        },
        {
          title: "نظام Escrow",
          description: "ضمان مالي آمن لجميع المعاملات",
          icon: "🔒",
        },
        {
          title: "إدارة المعاملات",
          description: "تتبع كامل لجميع المعاملات",
          icon: "💳",
        },
        {
          title: "تقييمات ومراجعات",
          description: "نظام تقييم شفاف للبائعين والمشترين",
          icon: "⭐",
        },
      ],
      stats: [
        { label: "معاملة ناجحة", value: "1,200+" },
        { label: "قيمة التداول", value: "$60M+" },
        { label: "معدل الأمان", value: "100%" },
      ],
      link: "/marketplace",
      cta: "تصفح السوق",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            ما يميز NAQLA
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            المحركات الثلاثة
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ثلاثة محركات متكاملة تشكل النظام البيئي الأكثر تقدماً لإدارة الابتكار في العالم
          </p>
        </div>

        {/* Engines Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => {
            const Icon = engine.icon;
            return (
              <Card key={engine.id} className={`p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 ${engine.borderColor}`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${engine.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={32} />
                </div>
                <Badge className="mb-3" variant="secondary">{engine.name}</Badge>
                <h3 className="text-2xl font-bold mb-2">{engine.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{engine.subtitle}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {engine.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {engine.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-xl font-bold bg-gradient-to-r ${engine.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Link href={engine.link}>
                  <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${engine.color} text-white rounded-lg hover:opacity-90 transition-all font-semibold`}>
                    {engine.cta}
                    <ArrowRight size={20} />
                  </button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Detailed Features */}
        {engines.map((engine, index) => {
          const Icon = engine.icon;
          return (
            <div key={engine.id} className="mb-16">
              <Card className={`overflow-hidden border-2 ${engine.borderColor}`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${engine.bgGradient} p-8 border-b`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${engine.color} flex items-center justify-center`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <div>
                      <Badge className="mb-2">{engine.name}</Badge>
                      <h2 className="text-3xl font-bold">{engine.title}</h2>
                      <p className="text-muted-foreground">{engine.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {engine.features.map((feature, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                        <div>
                          <h4 className="font-bold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}

        {/* Integration Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="text-5xl mb-6">🔗</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? "المحركات الثلاثة تعمل معاً" : "المحركات الثNoثة تعمل معاً"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            التكامل السلس بين المحركات الثلاثة يخلق نظاماً بيئياً متكاملاً يغطي دورة حياة الابتكار بالكامل - من الفكرة إلى التسويق
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Shield className="text-emerald-600" size={24} />
              </div>
              <p className="text-sm font-semibold">{isAr ? "احمِ فكرتك" : "[احمِ فكرتك]"}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Brain className="text-blue-600" size={24} />
              </div>
              <p className="text-sm font-semibold">{isAr ? "اعثر على شركاء" : "[اعثر على شركاء]"}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Globe className="text-purple-600" size={24} />
              </div>
              <p className="text-sm font-semibold">{isAr ? "سوّق ابتكارك" : "[سوّق ابتكارك]"}</p>
            </div>
          </div>

          <Link href="/dashboard">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              ابدأ رحلتك الآن
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
