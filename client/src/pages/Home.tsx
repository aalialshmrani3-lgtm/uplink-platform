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
  MessageSquare, PenTool, Target, Layers, CheckCircle2,
  Menu, X, ArrowUp
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeEngine, setActiveEngine] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEngine((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const engines = [
    {
      id: 'naqla1',
      name: 'NAQLA1',
      title: t.engines.naqla1.title,
      description: t.engines.naqla1.description,
      icon: Shield,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-900/60',
      borderColor: 'border-emerald-500/30',
      features: t.engines.naqla1.features,
      link: '/naqla1',
      stats: { value: '145+', label: t.home.stats.innovations }
    },
    {
      id: 'naqla2',
      name: 'NAQLA2',
      title: t.engines.naqla2.title,
      description: t.engines.naqla2.description,
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-900/60',
      borderColor: 'border-blue-500/30',
      features: t.engines.naqla2.features,
      link: '/naqla2',
      stats: { value: '50+', label: t.home.stats.partnerships }
    },
    {
      id: 'naqla3',
      name: 'NAQLA3',
      title: t.engines.naqla3.title,
      description: t.engines.naqla3.description,
      icon: Globe,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-900/60',
      borderColor: 'border-purple-500/30',
      features: t.engines.naqla3.features,
      link: '/naqla3',
      stats: { value: '60M+', label: t.home.stats.funding }
    }
  ];

  // Features data
  const features = [
    {
      icon: Brain,
      title: isAr ? 'تقييم AI متقدم' : 'Advanced AI Assessment',
      description: isAr
        ? 'نظام تقييم ثلاثي المحاور يحلل الابتكار والجدوى التجارية والإرشاد المطلوب'
        : 'A tri-axis evaluation system analyzing innovation, commercial viability, and required mentorship',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Shield,
      title: isAr ? 'حماية الملكية الفكرية' : 'Intellectual Property Protection',
      description: isAr
        ? 'تكامل مع SAIP و WIPO لتسجيل براءات الاختراع والعلامات التجارية'
        : 'Integration with SAIP & WIPO for patent and trademark registration',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Handshake,
      title: isAr ? 'عقود ذكية' : 'Smart Contracts',
      description: isAr
        ? 'نظام عقود ذكية مع Escrow لضمان حقوق جميع الأطراف'
        : 'Smart contract system with Escrow to protect the rights of all parties',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: BarChart3,
      title: isAr ? 'تحليلات متقدمة' : 'Advanced Analytics',
      description: isAr
        ? 'لوحة تحكم شاملة مع مؤشرات أداء وتقارير تفصيلية'
        : 'Comprehensive dashboard with KPIs and detailed reports',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: MessageSquare,
      title: isAr ? 'تواصل آمن' : 'Secure Communication',
      description: isAr
        ? 'نظام رسائل مشفر للتواصل المباشر بين المبتكرين والمستثمرين'
        : 'Encrypted messaging system for direct communication between innovators and investors',
      color: 'from-rose-500 to-red-600'
    },
    {
      icon: PenTool,
      title: isAr ? 'لوحة أفكار تفاعلية' : 'Interactive Idea Board',
      description: isAr
        ? 'أداة تعاون بصرية لتطوير الأفكار مع الفريق في الوقت الحقيقي'
        : 'Visual collaboration tool for developing ideas with your team in real time',
      color: 'from-indigo-500 to-violet-600'
    }
  ];

  // Strategic areas data
  const strategicAreas = [
    {
      icon: Zap,
      title: isAr ? 'الطاقة المتجددة' : 'Renewable Energy',
      description: isAr
        ? 'حلول مبتكرة في الطاقة الشمسية، طاقة الرياح، والهيدروجين الأخضر لتحقيق الاستدامة الطاقية'
        : 'Innovative solutions in solar, wind, and green hydrogen energy for sustainable energy goals',
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-500/30',
      highlights: isAr
        ? ['روبوتات تنظيف الألواح الشمسية', 'أنظمة تبريد البطاريات المتقدمة', 'دمج الطاقة الشمسية في المباني (BIPV)', 'إنتاج وتخزين الهيدروجين الأخضر']
        : ['Solar panel cleaning robots', 'Advanced battery cooling systems', 'Building-integrated photovoltaics (BIPV)', 'Green hydrogen production & storage'],
      link: '/naqla2/national-challenges'
    },
    {
      icon: Sparkles,
      title: isAr ? 'الاستدامة البيئية' : 'Environmental Sustainability',
      description: isAr
        ? 'تقنيات احتجاز الكربون، كفاءة الطاقة، وإدارة الموارد المستدامة للحفاظ على البيئة'
        : 'Carbon capture technologies, energy efficiency, and sustainable resource management',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500/30',
      highlights: isAr
        ? ['تقنيات احتجاز وتخزين الكربون', 'كفاءة الطاقة في المباني والصناعة', 'إدارة المياه والطاقة المتكاملة', 'حلول الاقتصاد الدائري']
        : ['Carbon capture & storage technologies', 'Energy efficiency in buildings & industry', 'Integrated water & energy management', 'Circular economy solutions'],
      link: '/naqla2/national-challenges'
    },
    {
      icon: Brain,
      title: isAr ? 'الذكاء الاصطناعي' : 'Artificial Intelligence',
      description: isAr
        ? 'تطبيقات AI المتقدمة في تحليل المدن، تحسين الطاقة، والذكاء الاصطناعي الفيزيائي'
        : 'Advanced AI applications in city analysis, energy optimization, and physics-based AI',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/30',
      highlights: isAr
        ? ['Physics-based AI لتحسين أنظمة الطاقة', 'تحليل ثلاثي الأبعاد للمدن', 'لوحات تحكم تفاعلية مع Gamification', 'التنبؤ بالأعطال والصيانة الاستباقية']
        : ['Physics-based AI for energy systems', '3D city analysis', 'Interactive dashboards with Gamification', 'Fault prediction & proactive maintenance'],
      link: '/naqla2/national-challenges'
    },
    {
      icon: Building2,
      title: isAr ? 'المدن الذكية' : 'Smart Cities',
      description: isAr
        ? 'تقنيات البنية التحتية الذكية، الشبكات الذكية، وإدارة الموارد الحضرية المستدامة'
        : 'Smart infrastructure technologies, smart grids, and sustainable urban resource management',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      highlights: isAr
        ? ['الشبكات الذكية للطاقة المتجددة', 'أنظمة النقل الذكي', 'إدارة المباني الذكية', 'حلول IoT للمدن المستدامة']
        : ['Smart grids for renewable energy', 'Intelligent transportation systems', 'Smart building management', 'IoT solutions for sustainable cities'],
      link: '/naqla2/national-challenges'
    }
  ];

  // Registration options
  const registrationOptions = [
    {
      type: 'government',
      title: isAr ? 'حكومة' : 'Government',
      description: isAr ? 'للجهات الحكومية والهيئات الرسمية' : 'For government entities and official bodies',
      icon: Building2,
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/30',
    },
    {
      type: 'company',
      title: isAr ? 'شركة قطاع خاص' : 'Private Sector Company',
      description: isAr ? 'للشركات والمؤسسات الخاصة' : 'For private companies and enterprises',
      icon: Building2,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
    },
    {
      type: 'international',
      title: isAr ? 'منظمة دولية' : 'International Organization',
      description: isAr ? 'للمنظمات والهيئات الدولية' : 'For international organizations and bodies',
      icon: Globe,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500/30',
    },
    {
      type: 'innovator',
      title: isAr ? 'مبتكر فردي' : 'Individual Innovator',
      description: isAr ? 'للمبتكرين والمخترعين الأفراد' : 'For individual innovators and inventors',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-500/30',
    },
    {
      type: 'university',
      title: isAr ? 'جامعة/مؤسسة بحثية' : 'University / Research Institution',
      description: isAr ? 'للجامعات والمراكز البحثية' : 'For universities and research centers',
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/30',
    },
    {
      type: 'investor',
      title: isAr ? 'مستثمر' : 'Investor',
      description: isAr ? 'للمستثمرين وصناديق الاستثمار' : 'For investors and investment funds',
      icon: Crown,
      color: 'from-amber-500 to-yellow-600',
      borderColor: 'border-amber-500/30',
    },
  ];

  // International partners
  const internationalPartners = [
    { name: 'MIT Enterprise Forum', country: isAr ? '🇺🇸 الولايات المتحدة' : '🇺🇸 United States', desc: isAr ? 'شبكة ريادة الأعمال التقنية العالمية' : 'Global tech entrepreneurship network', link: 'https://www.mitef.org/', color: 'border-red-500/20 hover:border-red-500/40' },
    { name: 'Fraunhofer Institute', country: isAr ? '🇩🇪 ألمانيا' : '🇩🇪 Germany', desc: isAr ? 'أبحاث تطبيقية في المواد المتقدمة والطاقة' : 'Applied research in advanced materials & energy', link: 'https://www.fraunhofer.de/', color: 'border-green-500/20 hover:border-green-500/40' },
    { name: 'KAIST', country: isAr ? '🇰🇷 كوريا الجنوبية' : '🇰🇷 South Korea', desc: isAr ? 'معهد العلوم والتكنولوجيا المتقدمة' : 'Korea Advanced Institute of Science & Technology', link: 'https://www.kaist.ac.kr/', color: 'border-blue-500/20 hover:border-blue-500/40' },
    { name: 'Skolkovo Foundation', country: isAr ? '🇷🇺 روسيا' : '🇷🇺 Russia', desc: isAr ? 'مركز الابتكار والتكنولوجيا الروسي' : 'Russian innovation & technology center', link: 'https://sk.ru/', color: 'border-yellow-500/20 hover:border-yellow-500/40' },
    { name: 'EIT InnoEnergy', country: isAr ? '🇪🇺 أوروبا' : '🇪🇺 Europe', desc: isAr ? 'مسرّع الطاقة المستدامة الأوروبي' : 'European sustainable energy accelerator', link: 'https://www.innoenergy.com/', color: 'border-teal-500/20 hover:border-teal-500/40' },
    { name: 'Plug and Play Tech', country: isAr ? '🇺🇸 سيليكون فالي' : '🇺🇸 Silicon Valley', desc: isAr ? 'أكبر مسرّع ابتكار في العالم' : "World's largest innovation accelerator", link: 'https://www.plugandplaytechcenter.com/', color: 'border-orange-500/20 hover:border-orange-500/40' },
    { name: 'Nanyang TU', country: isAr ? '🇸🇬 سنغافورة' : '🇸🇬 Singapore', desc: isAr ? 'جامعة نانيانغ للتكنولوجيا' : 'Nanyang Technological University', link: 'https://www.ntu.edu.sg/', color: 'border-pink-500/20 hover:border-pink-500/40' },
    { name: 'CERN IdeaSquare', country: isAr ? '🇨🇭 سويسرا' : '🇨🇭 Switzerland', desc: isAr ? 'مركز الابتكار في مختبر CERN' : 'Innovation center at CERN laboratory', link: 'https://ideasquare.cern/', color: 'border-cyan-500/20 hover:border-cyan-500/40' },
  ];

  // Local partners
  const localPartners = [
    { name: 'KAUST', src: '/partners/kaust.png', alt: isAr ? 'جامعة الملك عبدالله للعلوم والتقنية' : 'King Abdullah University of Science & Technology' },
    { name: isAr ? 'أرامكو' : 'Aramco', src: '/partners/aramco.png', alt: isAr ? 'أرامكو السعودية' : 'Saudi Aramco' },
    { name: isAr ? 'وزارة الاتصالات' : 'MCIT', src: '/partners/mcit.png', alt: isAr ? 'وزارة الاتصالات وتقنية المعلومات' : 'Ministry of Communications & IT' },
    { name: 'STC', src: '/partners/stc.jpg', alt: isAr ? 'الاتصالات السعودية' : 'Saudi Telecom Company' },
    { name: 'SABIC', src: '/partners/sabic.png', alt: isAr ? 'سابك' : 'SABIC' },
    { name: 'NEOM', src: '/partners/neom.jpg', alt: 'NEOM' },
    { name: isAr ? 'منشآت' : "Monsha'at", src: '/partners/monshaat.jpg', alt: isAr ? 'منشآت' : "Monsha'at" },
    { name: 'RDEA', src: '/partners/rdea.jpg', alt: isAr ? 'الهيئة الملكية لمدينة الرياض' : 'Royal Commission for Riyadh City' },
  ];

  // Global network tags
  const networkTags = isAr
    ? [
        { label: 'صناديق رأس المال', icon: '💰' },
        { label: 'برامج تسريع دولية', icon: '🏆' },
        { label: '500+ شركة تقنية', icon: '🌐' },
        { label: 'حاضنات عالمية', icon: '🚀' },
        { label: 'شبكة الابتكار العالمي', icon: '🔗' },
      ]
    : [
        { label: 'Venture Capital Funds', icon: '💰' },
        { label: 'International Accelerators', icon: '🏆' },
        { label: '500+ Tech Companies', icon: '🌐' },
        { label: 'Global Incubators', icon: '🚀' },
        { label: 'Global Innovation Network', icon: '🔗' },
      ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/3 rounded-full blur-[150px]" />
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
            <span className="text-xl font-bold text-gradient-cyan">NAQLA 5.0</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/why-naqla" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.whyNaqla}</Link>
            <Link href="/case-studies" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.caseStudies}</Link>
            <Link href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.integrations}</Link>
            <Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.testimonials}</Link>
            <Link href="/roi-calculator" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.roiCalculator}</Link>
            <Link href="/innovation-pipeline" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
              <Layers className="w-4 h-4" />
              {t.nav.pipeline}
            </Link>
            <Link href="/ai-insights" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
              <Brain className="w-4 h-4" />
              {t.nav.aiInsights}
            </Link>
            <Link href="/classification-paths" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.classificationPaths}</Link>
            <Link href="/strategic-partners" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.strategicPartners}</Link>
            <Link href="/value-footprints" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.valueFootprints}</Link>
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.help}</Link>
          </div>
          
          <div className="flex items-center gap-3">
            {user && <NotificationCenter />}
            <LanguageSwitcher />
            {user ? (
              <Link href="/dashboard">
                <Button className="hidden md:inline-flex bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border border-white/15">
                  {t.common.dashboard}
                </Button>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/register">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    {t.nav.register}
                  </Button>
                </Link>
                <a href={getLoginUrl()}>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border border-white/15">
                    {t.common.login}
                  </Button>
                </a>
              </div>
            )}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={isAr ? 'فتح القائمة' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl">
            <div className="container py-4 flex flex-col gap-1">
              <Link href="/why-naqla" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.whyNaqla}
              </Link>
              <Link href="/case-studies" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.caseStudies}
              </Link>
              <Link href="/integrations" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.integrations}
              </Link>
              <Link href="/testimonials" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.testimonials}
              </Link>
              <Link href="/roi-calculator" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.roiCalculator}
              </Link>
              <Link href="/innovation-pipeline" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50 flex items-center gap-2">
                <Layers className="w-4 h-4" />{t.nav.pipeline}
              </Link>
              <Link href="/ai-insights" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50 flex items-center gap-2">
                <Brain className="w-4 h-4" />{t.nav.aiInsights}
              </Link>
              <Link href="/classification-paths" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.classificationPaths}
              </Link>
              <Link href="/strategic-partners" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.strategicPartners}
              </Link>
              <Link href="/value-footprints" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.valueFootprints}
              </Link>
              <Link href="/help" onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm py-3 px-3 rounded-lg hover:bg-secondary/50">
                {t.nav.help}
              </Link>
              <div className="border-t border-border/50 pt-3 mt-2 flex flex-col gap-2">
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border border-white/15">
                      {t.common.dashboard}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                        {t.nav.register}
                      </Button>
                    </Link>
                    <a href={getLoginUrl()} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white border border-white/15">
                        {t.common.login}
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">{t.home.badge}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">{t.home.title}</span>
              <br />
              <span className="text-gradient-cyan">{t.home.titleHighlight}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.home.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {user ? (
                <Link href="/naqla1/submit">
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
      <section id="engines" className="py-12 px-6 relative">
        <div className="container">
          <div className="text-center mb-6">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              <Sparkles className="w-3 h-3 ml-1" />
              {t.engines.title}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.engines.subtitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.engines.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {engines.map((engine, index) => (
              <Card 
                key={engine.id}
                className={`relative overflow-hidden border border-white/10 bg-gradient-to-br ${engine.bgColor} to-card/80 backdrop-blur-sm transition-all duration-500 card-hover ${
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
                    <Badge className="bg-secondary/50 text-muted-foreground border border-white/15">
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
                      {isAr ? 'استكشف المزيد' : 'Explore More'}
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
      <section id="features" className="py-12 px-6 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-6">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30">
              <Target className="w-3 h-3 ml-1" />
              {isAr ? 'المميزات' : 'Features'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isAr ? 'لماذا NAQLA 5.0؟' : 'Why NAQLA 5.0?'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isAr
                ? 'مميزات فريدة تجعل منصتنا الخيار الأول للمبتكرين حول العالم'
                : 'Unique features that make our platform the first choice for innovators worldwide'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border border-white/15 bg-card/50 backdrop-blur-sm card-hover">
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

      {/* Strategic Innovation Areas Section */}
      <section id="strategic-areas" className="py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-background pointer-events-none" />
        <div className="container relative">
          <div className="text-center mb-6">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <Zap className="w-3 h-3 ml-1" />
              {isAr ? 'المجالات الاستراتيجية' : 'Strategic Areas'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isAr ? 'مجالات الابتكار الاستراتيجية' : 'Strategic Innovation Areas'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isAr
                ? 'نركز على المجالات الحيوية التي تدعم رؤية المملكة 2030 في الطاقة المتجددة والاستدامة والذكاء الاصطناعي'
                : 'We focus on vital areas supporting Vision 2030 in renewable energy, sustainability, and artificial intelligence'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {strategicAreas.map((area, i) => (
              <Card key={i} className={`group border-2 ${area.borderColor} hover:border-opacity-100 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer`}>
                <CardHeader>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <area.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-foreground mb-2">{area.title}</CardTitle>
                      <CardDescription className="text-base">{area.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {area.highlights.map((highlight, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={area.link}>
                    <Button className="w-full group-hover:bg-primary/90">
                      {isAr ? 'استكشف التحديات' : 'Explore Challenges'}
                      <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/naqla2/national-challenges">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg px-10 h-14">
                <Target className="w-5 h-5 ml-2" />
                {isAr ? 'عرض جميع التحديات الوطنية' : 'View All National Challenges'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-12 px-6 overflow-hidden">
        <div className="container">
          <div className="text-center mb-6">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/30">
              <Building2 className="w-3 h-3 ml-1" />
              {isAr ? 'شركاؤنا' : 'Our Partners'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isAr ? 'شركاء النجاح' : 'Partners in Success'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isAr
                ? 'نفخر بشراكاتنا مع أبرز الجهات والشركات السعودية الرائدة في الابتكار'
                : 'We are proud of our partnerships with the leading Saudi organizations and companies in innovation'}
            </p>
          </div>

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
              {[...localPartners, ...localPartners].map((partner, i) => (
                <div 
                  key={i}
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

      {/* Global Partners Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="container">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-4">
              <Globe className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-sm font-medium">
                {isAr ? 'شراكات دولية استراتيجية' : 'Strategic International Partnerships'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {isAr ? 'نقلة × الشركاء الدوليون' : 'NAQLA × International Partners'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isAr
                ? 'منصة نقلة شريك رسمي لأبرز مراكز الابتكار العالمية — وصول مباشر لشبكة 300+ شركة تقنية وبرامج تمويل دولية'
                : 'NAQLA is an official partner of the world\'s leading innovation centers — direct access to a network of 300+ tech companies and international funding programs'}
            </p>
          </div>

          {/* NEOM Featured Card */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-violet-500/30 bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-blue-900/30">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <Globe className="w-10 h-10 text-violet-400" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <span className="text-white font-bold text-xl">
                    {isAr ? 'شبكة الابتكار العالمية' : 'Global Innovation Network'}
                  </span>
                  <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                    {isAr ? 'دولي' : 'International'}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  {isAr
                    ? 'شراكات استراتيجية مع أبرز مراكز الابتكار العالمية تتيح لمبتكري نقلة الوصول إلى صناديق رأس المال المخاطر، وبرامج التحضين والتسريع، وشبكة من أكثر من 500 شركة تقنية عالمية وبرامج تسريع دولية.'
                    : 'Strategic partnerships with the world\'s leading innovation centers give NAQLA innovators access to venture capital funds, incubation and acceleration programs, and a network of more than 500 global tech companies and international acceleration programs.'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {networkTags.map((tag, i) => (
                    <span key={i} className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full">
                      {tag.icon} {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a href="/naqla2/national-challenges">
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition-colors w-full">
                    {isAr ? 'استكشف التحديات' : 'Explore Challenges'}
                  </button>
                </a>
                <a href="/trl-assessment">
                  <button className="border border-violet-500/40 text-violet-300 hover:bg-violet-900/30 text-sm px-5 py-2.5 rounded-lg font-medium transition-colors w-full">
                    {isAr ? 'تقييم TRL' : 'TRL Assessment'}
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Other International Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {internationalPartners.map((partner, i) => (
              <a key={i} href={partner.link} target="_blank" rel="noopener noreferrer">
                <div className={`border ${partner.color} bg-card/30 rounded-xl p-4 hover:bg-card/50 transition-all cursor-pointer h-full`}>
                  <div className="text-xs text-muted-foreground mb-1">{partner.country}</div>
                  <div className="text-white font-semibold text-sm mb-1">{partner.name}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{partner.desc}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-6">
            <a href="/strategic-partners">
              <button className="text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border px-5 py-2 rounded-lg transition-colors">
                {isAr ? 'عرض جميع الشركاء الاستراتيجيين ←' : 'View All Strategic Partners →'}
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-12 px-6 relative">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                <Users className="w-3 h-3 ml-1" />
                {isAr ? 'سجل الآن' : 'Register Now'}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {isAr ? 'سجل في NAQLA' : 'Register in NAQLA'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {isAr
                  ? 'اختر نوع حسابك وابدأ رحلتك في منظومة الابتكار العالمية'
                  : 'Choose your account type and start your journey in the global innovation ecosystem'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrationOptions.map((option) => (
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
                        {isAr ? 'سجل الآن' : 'Register Now'}
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
      <section className="py-12 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {isAr ? 'ابدأ رحلة الابتكار اليوم' : 'Start Your Innovation Journey Today'}
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              {isAr
                ? 'انضم إلى مجتمع المبتكرين العالمي واحصل على الدعم الكامل لتحويل فكرتك إلى واقع'
                : 'Join the global innovator community and get full support to turn your idea into reality'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/naqla1/submit">
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
                  {isAr ? 'المحركات الثلاثة' : 'Three Engines'}
                </Button>
              </Link>
              <Link href="/beta-programs">
                <Button size="lg" variant="outline" className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-white/15">
                  <Rocket className="ml-2" size={20} />
                  {isAr ? 'البرامج التجريبية' : 'Beta Programs'}
                </Button>
              </Link>
              <Link href="/unified-dashboard">
                <Button size="lg" variant="outline" className="text-lg">
                  <BarChart3 className="ml-2" size={20} />
                  {isAr ? 'لوحة التحكم الموحدة' : 'Unified Dashboard'}
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

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-200 border border-white/20"
          aria-label={isAr ? 'العودة للأعلى' : 'Back to top'}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
