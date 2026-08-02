import { Link } from "wouter";
import {
  Brain, Lightbulb, BarChart3, ArrowRight, Users, TrendingUp,
  Zap, CheckCircle2, Clock, Target, Rocket, FileText,
  Search, Plus, Eye, Star, ChevronRight, Activity,
  FlaskConical, Building2, Globe, Award, Sparkles, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import SEOHead from "@/components/SEOHead";

export default function Naqla1() {
  const { user } = useAuth();
  const { data: stats } = trpc.naqla1.getDashboardStats.useQuery();

  const quickActions = [
    {
      title: "حلل فكرتك الآن",
      desc: "قدّم فكرتك وستحصل على تحليل شامل خلال دقائق",
      icon: Sparkles,
      color: "from-violet-600 to-purple-700",
      border: "border-violet-500/30",
      link: user ? "/naqla1/submit" : getLoginUrl(),
      external: !user,
      badge: "مجاناً",
    },
    {
      title: "استعرض الأفكار",
      desc: "تصفح الأفكار المحللة والموجهة من المبتكرين",
      icon: Search,
      color: "from-blue-600 to-cyan-700",
      border: "border-blue-500/30",
      link: "/naqla1/browse",
      external: false,
      badge: `${stats?.totalIdeas?.toLocaleString() ?? "847+"}`,
    },
    {
      title: "الفرص المتاحة",
      desc: "اكتشف الفرص الاستثمارية والتعاون المتاحة",
      icon: TrendingUp,
      color: "from-emerald-600 to-teal-700",
      border: "border-emerald-500/30",
      link: "/naqla1/opportunities",
      external: false,
      badge: "جديد",
    },
    {
      title: "دراسات الحالة",
      desc: "تعلم من تجارب المبتكرين الناجحين",
      icon: FileText,
      color: "from-amber-600 to-orange-700",
      border: "border-amber-500/30",
      link: "/naqla1/case-studies",
      external: false,
      badge: "12 حالة",
    },
  ];

  const classificationPaths = [
    {
      score: "≥ 70%",
      label: "ابتكار حقيقي",
      desc: "فكرة جديدة كلياً بإمكانية براءة اختراع وتأثير عالمي",
      color: "from-violet-600 to-purple-700",
      border: "border-violet-500/40",
      icon: Star,
      destination: "نقلة 2 + نقلة 3",
      destColor: "text-violet-300",
      count: stats?.innovationIdeas ?? 198,
    },
    {
      score: "50–70%",
      label: "مشروع تجاري",
      desc: "حل تجاري ذكي يحتاج تطوير وشراكات استراتيجية",
      color: "from-blue-600 to-cyan-700",
      border: "border-blue-500/40",
      icon: Building2,
      destination: "نقلة 2",
      destColor: "text-blue-300",
      count: stats?.commercialIdeas ?? 287,
    },
    {
      score: "< 50%",
      label: "تحتاج تطوير",
      desc: "فكرة واعدة تحتاج إرشاداً وتحسيناً قبل الإطلاق",
      color: "from-amber-600 to-orange-700",
      border: "border-amber-500/40",
      icon: FlaskConical,
      destination: "برنامج الإرشاد",
      destColor: "text-amber-300",
      count: stats?.weakIdeas ?? 138,
    },
  ];

  const statCards = [
    { label: "إجمالي الأفكار", value: stats?.totalIdeas?.toLocaleString() ?? "847+", icon: Lightbulb, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "تم تحليلها", value: stats?.analyzedIdeas?.toLocaleString() ?? "623+", icon: Brain, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "موجهة لنقلة 2", value: stats?.routedToNaqla2?.toLocaleString() ?? "312+", icon: ArrowRight, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "موجهة لنقلة 3", value: stats?.routedToNaqla3?.toLocaleString() ?? "89+", icon: Rocket, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "قيد المراجعة", value: stats?.pendingIdeas?.toLocaleString() ?? "124", icon: Clock, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "المبتكرون", value: stats?.innovatorCount?.toLocaleString() ?? "876+", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <>
      <SEOHead title="نقلة ONE - محرك التحليل بالذكاء الاصطناعي" description="حلل فكرتك بالذكاء الاصطناعي واكتشف مسارها نحو النجاح" />
      <div className="min-h-screen bg-background text-foreground" dir="rtl">

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-background to-background" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

          <div className="container relative max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left: Text */}
              <div className="flex-1 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  <span className="text-sm text-violet-300">NAQLA ONE — محرك التحليل بالذكاء الاصطناعي</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-foreground">حوّل فكرتك إلى</span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                    ابتكار موثّق
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  نحلل فكرتك بخوارزميات الذكاء الاصطناعي المتقدمة لتحديد مستوى الابتكار وتوجيهها للمسار المناسب — من الفكرة إلى الواقع
                </p>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {user ? (
                    <Link href="/naqla1/submit">
                      <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 text-base px-8">
                        <Plus className="w-5 h-5" />
                        حلل فكرتك الآن
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 text-base px-8">
                        <Sparkles className="w-5 h-5" />
                        سجل دخول لتحليل فكرتك
                      </Button>
                    </a>
                  )}
                  <Link href="/naqla1/browse">
                    <Button size="lg" variant="outline" className="border-violet-500/40 text-violet-300 hover:bg-violet-900/20 gap-2 text-base px-8 bg-transparent">
                      <Eye className="w-5 h-5" />
                      استعرض الأفكار
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Stats Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm w-full">
                {statCards.map((s, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${s.bg} border border-border/30 backdrop-blur-sm`}>
                    <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 px-6">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">ماذا تريد أن تفعل؟</h2>
              <p className="text-muted-foreground">اختر الإجراء المناسب لك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                action.external ? (
                  <a key={i} href={action.link}>
                    <Card className={`group h-full bg-card/50 backdrop-blur-sm border ${action.border} hover:border-opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="mb-3 text-xs bg-card/80">{action.badge}</Badge>
                        <h3 className="font-bold text-foreground mb-2">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.desc}</p>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Link key={i} href={action.link}>
                    <Card className={`group h-full bg-card/50 backdrop-blur-sm border ${action.border} hover:border-opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="mb-3 text-xs bg-card/80">{action.badge}</Badge>
                        <h3 className="font-bold text-foreground mb-2">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 px-6 bg-card/20">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/30">
                <Activity className="w-3 h-3 ml-1" />
                كيف يعمل المحرك
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">ثلاث خطوات للتحليل الشامل</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "تقديم الفكرة", desc: "أدخل فكرتك بالتفاصيل الكاملة — المجال، المشكلة، الحل المقترح", icon: Lightbulb, color: "from-violet-500 to-purple-600" },
                { step: "02", title: "التحليل بالذكاء الاصطناعي", desc: "خوارزميات متقدمة تحلل الابتكار، الجدوى، والسوق المستهدف", icon: Brain, color: "from-blue-500 to-cyan-600" },
                { step: "03", title: "التصنيف والتوجيه", desc: "تُصنَّف فكرتك وتُوجَّه للمسار المناسب: نقلة 2 أو نقلة 3", icon: Target, color: "from-emerald-500 to-teal-600" },
              ].map((step, i) => (
                <Card key={i} className="bg-card/60 backdrop-blur-sm border border-border/40 hover:border-violet-500/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-4xl font-black text-muted-foreground/20">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Classification Paths */}
        <section className="py-16 px-6">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
                <Target className="w-3 h-3 ml-1" />
                مسارات التصنيف
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">إلى أين ستذهب فكرتك؟</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                بناءً على نتيجة التحليل، تُوجَّه فكرتك تلقائياً للمسار الأنسب
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classificationPaths.map((path, i) => (
                <Card key={i} className={`bg-card/60 backdrop-blur-sm border ${path.border} hover:scale-105 transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center`}>
                        <path.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="text-lg font-bold bg-card/80 px-3">{path.score}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{path.label}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{path.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">الوجهة</div>
                        <div className={`text-sm font-bold ${path.destColor}`}>{path.destination}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">المصنفة</div>
                        <div className="text-lg font-bold text-foreground">{path.count.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Ideas */}
        {stats?.recentIdeas && stats.recentIdeas.length > 0 && (
          <section className="py-12 px-6 bg-card/20">
            <div className="container max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">آخر الأفكار المقدمة</h2>
                <Link href="/naqla1/browse">
                  <Button variant="ghost" className="gap-2 text-violet-400 hover:text-violet-300">
                    عرض الكل <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.recentIdeas.map((idea: any, i: number) => (
                  <Card key={i} className="bg-card/60 backdrop-blur-sm border border-border/40 hover:border-violet-500/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`text-xs ${idea.status === 'analyzed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {idea.status === 'analyzed' ? 'محللة' : 'قيد المراجعة'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{idea.category}</span>
                      </div>
                      <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">{idea.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {idea.submittedAt ? new Date(idea.submittedAt).toLocaleDateString('ar-SA') : ''}
                        </span>
                        <Link href={`/naqla1/ideas/${idea.id}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-violet-400 hover:text-violet-300 gap-1">
                            عرض <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="container max-w-4xl mx-auto text-center">
            <div className="p-10 rounded-3xl bg-gradient-to-br from-violet-900/30 to-purple-900/20 border border-violet-500/20">
              <Globe className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">جاهز لتحليل فكرتك؟</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                انضم لأكثر من {stats?.innovatorCount?.toLocaleString() ?? "876"} مبتكر يستخدمون نقلة ONE لتحويل أفكارهم إلى واقع
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {user ? (
                  <Link href="/naqla1/submit">
                    <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 px-10">
                      <Plus className="w-5 h-5" />
                      ابدأ التحليل الآن
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 px-10">
                      <Sparkles className="w-5 h-5" />
                      سجل دخول وابدأ مجاناً
                    </Button>
                  </a>
                )}
                <Link href="/naqla1/case-studies">
                  <Button size="lg" variant="outline" className="border-violet-500/40 text-violet-300 hover:bg-violet-900/20 gap-2 px-10 bg-transparent">
                    <Award className="w-5 h-5" />
                    قصص النجاح
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
