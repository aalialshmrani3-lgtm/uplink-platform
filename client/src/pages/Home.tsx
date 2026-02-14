import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { NotificationCenter } from "@/components/NotificationCenter";
import { 
  Rocket, Shield, Brain, Users, Globe, Award, 
  ChevronRight, Lightbulb, Building2, Handshake,
  GraduationCap, Crown, Code, BarChart3, Zap,
  ArrowUpRight, Sparkles, Play, Star, TrendingUp,
  MessageSquare, PenTool, Target, Layers, CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import ImprovedFooter from "@/components/ImprovedFooter";
import { InnovationHubsSection } from "@/components/InnovationHubsSection";
import { ClassificationPathsSection } from "@/components/ClassificationPathsSection";
import { StrategicPartnersSection } from "@/components/StrategicPartnersSection";
import { ValueFootprintsSection } from "@/components/ValueFootprintsSection";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeEngine, setActiveEngine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEngine((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const engines = [
    {
      id: 'uplink1',
      name: 'UPLINK1',
      title: t.engines.uplink1.title,
      description: t.engines.uplink1.description,
      icon: Shield,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-950/50',
      borderColor: 'border-emerald-500/30',
      features: t.engines.uplink1.features,
      link: '/uplink1',
      stats: { value: '145+', label: t.home.stats.innovations }
    },
    {
      id: 'uplink2',
      name: 'UPLINK2',
      title: t.engines.uplink2.title,
      description: t.engines.uplink2.description,
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-950/50',
      borderColor: 'border-blue-500/30',
      features: t.engines.uplink2.features,
      link: '/uplink2',
      stats: { value: '50+', label: t.home.stats.partnerships }
    },
    {
      id: 'uplink3',
      name: 'UPLINK3',
      title: t.engines.uplink3.title,
      description: t.engines.uplink3.description,
      icon: Globe,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-950/50',
      borderColor: 'border-purple-500/30',
      features: t.engines.uplink3.features,
      link: '/uplink3',
      stats: { value: '60M+', label: t.home.stats.funding }
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEOHead />
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient-cyan">UPLINK 5.0</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/why-uplink" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.whyUplink}</Link>
            <Link href="/case-studies" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.caseStudies}</Link>
            <Link href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.integrations}</Link>
            <Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.testimonials}</Link>
            <Link href="/roi-calculator" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.roiCalculator}</Link>
            <Link href="/pipeline" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
              <Layers className="w-4 h-4" />
              {t.nav.pipeline}
            </Link>
            <Link href="/ai-insights" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
              <Brain className="w-4 h-4" />
              {t.nav.aiInsights}
            </Link>
            <Link href="/classification-paths" className="text-muted-foreground hover:text-foreground transition-colors text-sm">المسارات</Link>
            <Link href="/strategic-partners" className="text-muted-foreground hover:text-foreground transition-colors text-sm">الشركاء</Link>
            <Link href="/value-footprints" className="text-muted-foreground hover:text-foreground transition-colors text-sm">قياس الأثر</Link>
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.help}</Link>
          </div>
          
          <div className="flex items-center gap-3">
            {user && <NotificationCenter />}
            <LanguageSwitcher />
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border-0">
                  {t.common.dashboard}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    تسجيل
                  </Button>
                </Link>
                <a href={getLoginUrl()}>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border-0">
                    {t.common.login}
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">{t.home.badge}</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">{t.home.title}</span>
              <br />
              <span className="text-gradient-cyan">{t.home.titleHighlight}</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.home.description}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link href="/uplink1/submit">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-8 h-14 glow">
                    <Lightbulb className="w-5 h-5 ml-2" />
                    {t.home.cta}
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-8 h-14 glow">
                    <Lightbulb className="w-5 h-5 ml-2" />
                    {t.home.cta}
                  </Button>
                </a>
              )}
              <a href="#engines">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-border/50 bg-secondary/30">
                  {t.home.exploreEngines}
                  <ChevronRight className="w-5 h-5 mr-2" />
                </Button>
              </a>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: 500, suffix: '+', label: t.home.stats.innovations, icon: Lightbulb },
                { value: 150, suffix: '+', label: t.home.stats.investors, icon: Building2 },
                { value: 50, suffix: '+', label: t.home.stats.partnerships, icon: Handshake },
                { value: 60, suffix: 'M+', label: t.home.stats.funding, icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three Engines Section */}
      <section id="engines" className="py-24 px-6 relative">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              <Sparkles className="w-3 h-3 ml-1" />
              المحركات الثلاثة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              منظومة متكاملة للابتكار
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              من الفكرة إلى السوق العالمي، نوفر لك كل ما تحتاجه لتحويل ابتكارك إلى نجاح
            </p>
          </div>

          {/* Engine Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {engines.map((engine, index) => (
              <Card 
                key={engine.id}
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${engine.bgColor} to-card/50 backdrop-blur-sm transition-all duration-500 card-hover ${
                  activeEngine === index ? 'ring-2 ring-cyan-500/50' : ''
                }`}
                onMouseEnter={() => setActiveEngine(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${engine.color} opacity-5`} />
                <CardHeader className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${engine.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <engine.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={engine.borderColor}>
                      {engine.name}
                    </Badge>
                    <Badge className="bg-secondary/50 text-muted-foreground border-0">
                      {engine.stats.value} {engine.stats.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-foreground">{engine.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{engine.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2 mb-6">
                    {engine.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={engine.link}>
                    <Button className={`w-full bg-gradient-to-r ${engine.color} text-white`}>
                      استكشف المزيد
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30">
              <Target className="w-3 h-3 ml-1" />
              المميزات
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              لماذا UPLINK 5.0؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مميزات فريدة تجعل منصتنا الخيار الأول للمبتكرين حول العالم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'تقييم AI متقدم',
                description: 'نظام تقييم ثلاثي المحاور يحلل الابتكار والجدوى التجارية والإرشاد المطلوب',
                color: 'from-cyan-500 to-blue-600'
              },
              {
                icon: Shield,
                title: 'حماية الملكية الفكرية',
                description: 'تكامل مع SAIP و WIPO لتسجيل براءات الاختراع والعلامات التجارية',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: Handshake,
                title: 'عقود ذكية',
                description: 'نظام عقود ذكية مع Escrow لضمان حقوق جميع الأطراف',
                color: 'from-purple-500 to-pink-600'
              },
              {
                icon: BarChart3,
                title: 'تحليلات متقدمة',
                description: 'لوحة تحكم شاملة مع مؤشرات أداء وتقارير تفصيلية',
                color: 'from-amber-500 to-orange-600'
              },
              {
                icon: MessageSquare,
                title: 'تواصل آمن',
                description: 'نظام رسائل مشفر للتواصل المباشر بين المبتكرين والمستثمرين',
                color: 'from-rose-500 to-red-600'
              },
              {
                icon: PenTool,
                title: 'لوحة أفكار تفاعلية',
                description: 'أداة تعاون بصرية لتطوير الأفكار مع الفريق في الوقت الحقيقي',
                color: 'from-indigo-500 to-violet-600'
              }
            ].map((feature, i) => (
              <Card key={i} className="border-0 bg-card/50 backdrop-blur-sm card-hover">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 px-6 overflow-hidden">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/30">
              <Building2 className="w-3 h-3 ml-1" />
              شركاؤنا
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              شركاء النجاح
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نفخر بشراكاتنا مع أبرز الجهات والشركات السعودية الرائدة في الابتكار
            </p>
          </div>

          {/* Horizontal Scrolling Logos */}
          <div className="relative">
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes scroll-rtl {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll-rtl {
                  animation: scroll-rtl 30s linear infinite;
                }
                .animate-scroll-rtl:hover {
                  animation-play-state: paused;
                }
              `
            }} />
            
            <div className="flex gap-12 animate-scroll-rtl">
              {/* First set of logos */}
              {[
                { name: 'KAUST', src: '/partners/kaust.png', alt: 'جامعة الملك عبدالله للعلوم والتقنية' },
                { name: 'أرامكو', src: '/partners/aramco.png', alt: 'أرامكو السعودية' },
                { name: 'وزارة الاتصالات', src: '/partners/mcit.png', alt: 'وزارة الاتصالات وتقنية المعلومات' },
                { name: 'STC', src: '/partners/stc.jpg', alt: 'الاتصالات السعودية' },
                { name: 'SABIC', src: '/partners/sabic.png', alt: 'سابك' },
                { name: 'NEOM', src: '/partners/neom.jpg', alt: 'نيوم' },
                { name: 'Monsha\'at', src: '/partners/monshaat.jpg', alt: 'منشآت' },
                { name: 'RDEA', src: '/partners/rdea.jpg', alt: 'الهيئة الملكية لمدينة الرياض' },
              ].map((partner, i) => (
                <div 
                  key={`first-${i}`}
                  className="flex-shrink-0 w-48 h-24 flex items-center justify-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
                >
                  <img 
                    src={partner.src} 
                    alt={partner.alt}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'KAUST', src: '/partners/kaust.png', alt: 'جامعة الملك عبدالله للعلوم والتقنية' },
                { name: 'أرامكو', src: '/partners/aramco.png', alt: 'أرامكو السعودية' },
                { name: 'وزارة الاتصالات', src: '/partners/mcit.png', alt: 'وزارة الاتصالات وتقنية المعلومات' },
                { name: 'STC', src: '/partners/stc.jpg', alt: 'الاتصالات السعودية' },
                { name: 'SABIC', src: '/partners/sabic.png', alt: 'سابك' },
                { name: 'NEOM', src: '/partners/neom.jpg', alt: 'نيوم' },
                { name: 'Monsha\'at', src: '/partners/monshaat.jpg', alt: 'منشآت' },
                { name: 'RDEA', src: '/partners/rdea.jpg', alt: 'الهيئة الملكية لمدينة الرياض' },
              ].map((partner, i) => (
                <div 
                  key={`second-${i}`}
                  className="flex-shrink-0 w-48 h-24 flex items-center justify-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
                >
                  <img 
                    src={partner.src} 
                    alt={partner.alt}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-24 px-6 relative">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                <Users className="w-3 h-3 ml-1" />
                سجل الآن
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                سجل في UPLINK
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                اختر نوع حسابك وابدأ رحلتك في منظومة الابتكار العالمية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  type: 'government',
                  title: 'حكومة',
                  description: 'للجهات الحكومية والهيئات الرسمية',
                  icon: Building2,
                  color: 'from-blue-500 to-indigo-600',
                  borderColor: 'border-blue-500/30',
                },
                {
                  type: 'company',
                  title: 'شركة قطاع خاص',
                  description: 'للشركات والمؤسسات الخاصة',
                  icon: Building2,
                  color: 'from-purple-500 to-pink-600',
                  borderColor: 'border-purple-500/30',
                },
                {
                  type: 'international',
                  title: 'منظمة دولية',
                  description: 'للمنظمات والهيئات الدولية',
                  icon: Globe,
                  color: 'from-green-500 to-emerald-600',
                  borderColor: 'border-green-500/30',
                },
                {
                  type: 'innovator',
                  title: 'مبتكر فردي',
                  description: 'للمبتكرين والمخترعين الأفراد',
                  icon: Lightbulb,
                  color: 'from-yellow-500 to-orange-600',
                  borderColor: 'border-yellow-500/30',
                },
                {
                  type: 'university',
                  title: 'جامعة/مؤسسة بحثية',
                  description: 'للجامعات والمراكز البحثية',
                  icon: GraduationCap,
                  color: 'from-cyan-500 to-blue-600',
                  borderColor: 'border-cyan-500/30',
                },
                {
                  type: 'investor',
                  title: 'مستثمر',
                  description: 'للمستثمرين وصناديق الاستثمار',
                  icon: Crown,
                  color: 'from-amber-500 to-yellow-600',
                  borderColor: 'border-amber-500/30',
                },
              ].map((option) => (
                <div key={option.type} onClick={() => window.location.href = `/register/${option.type}`}>
                  <Card className={`group h-full bg-card/50 backdrop-blur-sm border ${option.borderColor} hover:border-opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer`}>
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-foreground text-xl">{option.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full group-hover:bg-secondary/50">
                        سجل الآن
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              ابدأ رحلة الابتكار اليوم
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              انضم إلى مجتمع المبتكرين العالمي واحصل على الدعم الكامل لتحويل فكرتك إلى واقع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/uplink1/submit">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-10 h-14">
                    {t.home.cta}
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-10 h-14">
                    {t.home.cta}
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                  </Button>
                </a>
              )}
                 <Link href="/three-engines">
                <Button size="lg" variant="outline" className="text-lg">
                  <Zap className="ml-2" size={20} />
                  المحركات الثلاثة
                </Button>
              </Link>
              <Link href="/beta-programs">
                <Button size="lg" variant="outline" className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  <Rocket className="ml-2" size={20} />
                  البرامج التجريبية
                </Button>
              </Link>
              <Link href="/unified-dashboard">
                <Button size="lg" variant="outline" className="text-lg">
                  <BarChart3 className="ml-2" size={20} />
                  لوحة التحكم الموحدة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Hubs Section */}
      <InnovationHubsSection />

      {/* Classification Paths Section */}
      <ClassificationPathsSection />

      {/* Strategic Partners Section */}
      <StrategicPartnersSection />

      {/* Value Footprints Section */}
      <ValueFootprintsSection />

      {/* Footer */}
      <ImprovedFooter />
    </div>
  );
}
