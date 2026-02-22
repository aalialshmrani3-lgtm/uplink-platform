import { Link } from "wouter";
import { 
  Target, Users, Lightbulb, Calendar, Trophy, 
  Building2, Globe, GraduationCap, Briefcase,
  ArrowRight, Sparkles, Award, Zap, Brain, Rocket, 
  Search, Clock, ChevronRight, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import SEOHead from "@/components/SEOHead";

export default function Naqla2() {
  const { user } = useAuth();

  const organizerOptions = [
    {
      id: 'submit-challenge',
      title: 'قدّم تحدي',
      description: 'قدم تحدي حقيقي من مؤسستك واحصل على حلول مبتكرة من المجتمع العالمي',
      icon: Target,
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500/30',
      link: '/naqla2/challenges/create',
    },
    {
      id: 'host-hackathon',
      title: 'استضف هاكاثون',
      description: 'نظم هاكاثون واجذب أفضل المواهب لحل تحديات مؤسستك',
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      link: '/naqla2/hackathons/create',
    },
    {
      id: 'host-conference',
      title: 'استضف مؤتمر',
      description: 'نظم مؤتمر عالمي واجمع الخبراء والمبتكرين في مجالك',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500/30',
      link: '/naqla2/events/create?type=conference',
    },
    {
      id: 'host-workshop',
      title: 'استضف ورشة عمل',
      description: 'قدم ورشة عمل تفاعلية وشارك خبراتك مع المجتمع',
      icon: GraduationCap,
      color: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-500/30',
      link: '/naqla2/events/create?type=workshop',
    },
    {
      id: 'add-event',
      title: 'أضف فعالية',
      description: 'أضف أي نوع فعالية: ورشة، هاكاثون، مؤتمر، ندوة، ويبينار، لقاء علمي',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-500/30',
      link: '/naqla2/add-event',
      badge: 'جديد',
    },
  ];

  const innovatorOptions = [
    {
      id: 'browse-challenges',
      title: 'استعرض التحديات',
      description: 'تصفح التحديات الحقيقية من الشركات والمؤسسات الرائدة',
      icon: Search,
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/30',
      link: '/naqla2/challenges',
      count: '200+',
    },
    {
      id: 'browse-hackathons',
      title: 'استعرض الهاكاثونات',
      description: 'اكتشف الهاكاثونات القادمة وشارك في المنافسات العالمية',
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      link: '/naqla2/hackathons',
      count: '50+',
    },
    {
      id: 'browse-events',
      title: 'استعرض الفعاليات',
      description: 'تصفح المؤتمرات وورش العمل والفعاليات القادمة',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500/30',
      link: '/naqla2/events',
      count: '100+',
    },
    {
      id: 'submit-solutions',
      title: 'قدّم حلولك',
      description: 'قدم حلولك المبتكرة للتحديات واحصل على جوائز ضخمة',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-500/30',
      link: '/naqla2/solutions/submit',
      count: '500K+',
    },
  ];

  const stats = [
    { value: '200+', label: 'تحدٍ نشط', icon: Target },
    { value: '50+', label: 'هاكاثون', icon: Trophy },
    { value: '100+', label: 'فعالية', icon: Calendar },
    { value: '1000+', label: 'مبتكر', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEOHead 
        title="NAQLA 2 - Events & Challenges Matching"
        description="Connect innovators with real-world challenges through hackathons, events, and AI-powered matching"
      />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">NAQLA 2 - منظومة الفعاليات والتحديات</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">حوّل أفكارك إلى</span>
              <br />
              <span className="text-gradient-blue">شراكات عالمية</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة متكاملة تربط المبتكرين بالمستثمرين والشركات من خلال الهاكاثونات والفعاليات والتحديات الحقيقية
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Options Section */}
      <section className="py-24 px-6 relative">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Organizers Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
                  <Building2 className="w-3 h-3 ml-1" />
                  للمنظمين
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  استضف فعاليتك القادمة
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  نظم تحديات وهاكاثونات ومؤتمرات عالمية واجذب أفضل المواهب والحلول المبتكرة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {organizerOptions.map((option) => (
                  <Link key={option.id} href={option.link}>
                    <Card className={`group h-full bg-card/50 backdrop-blur-sm border ${option.borderColor} hover:border-opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer`}>
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <option.icon className="w-7 h-7 text-white" />
                        </div>
                        <CardTitle className="text-foreground text-2xl">{option.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                          {option.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full group-hover:bg-secondary/50">
                          ابدأ الآن
                          <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Innovators Section */}
            <div>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30">
                  <Lightbulb className="w-3 h-3 ml-1" />
                  للمبتكرين
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  اكتشف الفرص المتاحة
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  تصفح التحديات والهاكاثونات والفعاليات وقدم حلولك المبتكرة للمؤسسات الرائدة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {innovatorOptions.map((option) => (
                  <Link key={option.id} href={option.link}>
                    <Card className={`group h-full bg-card/50 backdrop-blur-sm border ${option.borderColor} hover:border-opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer`}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <option.icon className="w-7 h-7 text-white" />
                          </div>
                          {option.count && (
                            <Badge className="bg-secondary/50 text-foreground border-border/50">
                              {option.count}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-foreground text-2xl">{option.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                          {option.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full group-hover:bg-secondary/50">
                          استكشف الآن
                          <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative bg-secondary/20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                <Sparkles className="w-3 h-3 ml-1" />
                المميزات
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                لماذا NAQLA 2؟
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                منصة متكاملة تجمع المبتكرين والمستثمرين والشركات في مكان واحد
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'مطابقة ذكية',
                  description: 'خوارزمية AI تطابق المبتكرين مع التحديات المناسبة',
                  color: 'from-purple-500 to-pink-600',
                },
                {
                  icon: Award,
                  title: 'جوائز ضخمة',
                  description: 'جوائز مالية وفرص استثمارية للحلول الفائزة',
                  color: 'from-yellow-500 to-orange-600',
                },
                {
                  icon: Rocket,
                  title: 'تسريع النمو',
                  description: 'برامج دعم وتسريع لتحويل الأفكار إلى منتجات',
                  color: 'from-green-500 to-emerald-600',
                },
                {
                  icon: Globe,
                  title: 'شبكة عالمية',
                  description: 'تواصل مع مبتكرين ومستثمرين من جميع أنحاء العالم',
                  color: 'from-blue-500 to-cyan-600',
                },
              ].map((feature, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-cyan-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              انضم إلى مجتمع المبتكرين العالمي وابدأ رحلتك نحو النجاح
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/naqla2/challenges">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-10 h-14">
                      <Target className="w-5 h-5 ml-2" />
                      استعرض التحديات
                    </Button>
                  </Link>
                  <Link href="/naqla2/hackathons">
                    <Button size="lg" variant="outline" className="text-lg px-10 h-14">
                      <Trophy className="w-5 h-5 ml-2" />
                      استعرض الهاكاثونات
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-10 h-14">
                      <Users className="w-5 h-5 ml-2" />
                      سجل الدخول
                    </Button>
                  </a>
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="text-lg px-10 h-14">
                      إنشاء حساب
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
