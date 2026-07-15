import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, Brain, Trophy, Calendar, Users, 
  DollarSign, Zap, ArrowLeft, Filter, Search, Clock,
  Dna, Atom, Leaf, Cpu, Globe, Award, Star, Building2,
  FlaskConical, Layers, Droplets, Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Sector Icons mapping
const sectorIcons: Record<string, React.ReactNode> = {
  biotechnology: <Dna className="w-4 h-4" />,
  advanced_materials: <Atom className="w-4 h-4" />,
  clean_tech: <Leaf className="w-4 h-4" />,
  quantum_computing: <Cpu className="w-4 h-4" />,
  healthcare: <FlaskConical className="w-4 h-4" />,
  energy: <Zap className="w-4 h-4" />,
  technology: <Shield className="w-4 h-4" />,
  environment: <Droplets className="w-4 h-4" />,
  agriculture: <Leaf className="w-4 h-4" />,
  fintech: <DollarSign className="w-4 h-4" />,
  education: <Brain className="w-4 h-4" />,
};

export default function Challenges() {
  const { data: challenges, isLoading } = trpc.challenge.getAll.useQuery();
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const demoChallenges = [
    {
      id: 1,
      title: isAr ? "هاكاثون الهيدروجين الأخضر - أرامكو" : "Green Hydrogen Hackathon - Aramco",
      description: isAr ? "طوّر حلولاً مبتكرة لإنتاج وتخزين ونقل الهيدروجين الأخضر بكفاءة عالية. الفائز يحصل على عقد تجريبي مع أرامكو السعودية." : "Develop innovative solutions for producing, storing, and transporting green hydrogen efficiently. Winner gets a pilot contract with Saudi Aramco.",
      type: "hackathon",
      category: "energy",
      prize: "2000000",
      status: "open",
      participants: 312,
      endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "أرامكو السعودية" : "Saudi Aramco",
      badge: isAr ? "🏆 جائزة كبرى" : "🏆 Grand Prize",
      badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      globalPartner: false,
    },
    {
      id: 2,
      title: isAr ? "تحدي تبريد البطاريات في الحرارة العالية" : "Battery Cooling in Extreme Heat Challenge",
      description: isAr ? "ابتكر نظام تبريد فعّال للبطاريات الكهربائية في درجات حرارة تتجاوز 50°م. الحل الفائز سيُطبَّق في مشاريع نيوم." : "Innovate an effective cooling system for electric batteries in temperatures exceeding 50°C. The winning solution will be implemented in NEOM projects.",
      type: "challenge",
      category: "energy",
      prize: "1500000",
      status: "open",
      participants: 189,
      endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      sponsor: "NEOM",
      badge: isAr ? "🌟 تحدي نيوم" : "🌟 NEOM Challenge",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      globalPartner: false,
    },
    {
      id: 3,
      title: isAr ? "مسابقة الذكاء الاصطناعي للتشخيص الطبي" : "AI Medical Diagnosis Competition",
      description: isAr ? "طوّر نموذج AI لتشخيص الأمراض المزمنة من صور الأشعة بدقة تفوق 95%. الفائز يحصل على تمويل أولي من وزارة الصحة." : "Develop an AI model to diagnose chronic diseases from X-ray images with over 95% accuracy. Winner receives seed funding from the Ministry of Health.",
      type: "competition",
      category: "healthcare",
      prize: "1000000",
      status: "open",
      participants: 267,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "وزارة الصحة" : "Ministry of Health",
      badge: isAr ? "🏥 رعاية صحية" : "🏥 Healthcare",
      badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      globalPartner: false,
    },
    {
      id: 4,
      title: isAr ? "هاكاثون المدن الذكية - رؤية 2030" : "Smart Cities Hackathon - Vision 2030",
      description: isAr ? "ابتكر حلولاً لتحسين إدارة حركة المرور وتقليل استهلاك الطاقة في المدن السعودية باستخدام إنترنت الأشياء والذكاء الاصطناعي." : "Innovate solutions to improve traffic management and reduce energy consumption in Saudi cities using IoT and AI.",
      type: "hackathon",
      category: "technology",
      prize: "750000",
      status: "open",
      participants: 445,
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "وزارة الاتصالات" : "Ministry of Communications",
      badge: isAr ? "🏙️ مدن ذكية" : "🏙️ Smart Cities",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      globalPartner: false,
    },
    {
      id: 5,
      title: isAr ? "تحدي روبوتات تنظيف الألواح الشمسية" : "Solar Panel Cleaning Robots Challenge",
      description: isAr ? "صمّم روبوتاً ذاتياً لتنظيف الألواح الشمسية في البيئات الصحراوية بتكلفة تشغيل أقل من 0.5 ريال/م². الفائز يحصل على عقد توريد." : "Design an autonomous robot for cleaning solar panels in desert environments at an operating cost below 0.5 SAR/m². Winner gets a supply contract.",
      type: "challenge",
      category: "energy",
      prize: "800000",
      status: "open",
      participants: 134,
      endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "الشركة السعودية للكهرباء" : "Saudi Electricity Company",
      badge: isAr ? "☀️ طاقة شمسية" : "☀️ Solar Energy",
      badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      globalPartner: false,
    },
    {
      id: 6,
      title: isAr ? "مسابقة الزراعة الذكية بالمياه المُعالجة" : "Smart Agriculture with Treated Water Competition",
      description: isAr ? "طوّر نظاماً متكاملاً للزراعة المائية يستخدم المياه المُعالجة ويقلل الاستهلاك بنسبة 70%. مدعوم من وزارة البيئة والمياه." : "Develop an integrated hydroponics system using treated water that reduces consumption by 70%. Supported by the Ministry of Environment and Water.",
      type: "competition",
      category: "agriculture",
      prize: "600000",
      status: "open",
      participants: 98,
      endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "وزارة البيئة والمياه" : "Ministry of Environment & Water",
      badge: isAr ? "🌱 زراعة مستدامة" : "🌱 Sustainable Agriculture",
      badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
      globalPartner: false,
    },
    {
      id: 7,
      title: isAr ? "هاكاثون البلوكتشين للملكية الفكرية" : "Blockchain IP Hackathon",
      description: isAr ? "ابتكر منصة لحماية وتسجيل براءات الاختراع باستخدام تقنية البلوكتشين. الفائز يحصل على تمويل من صندوق الاستثمارات العامة." : "Innovate a platform for protecting and registering patents using blockchain technology. Winner receives funding from the Public Investment Fund.",
      type: "hackathon",
      category: "technology",
      prize: "500000",
      status: "open",
      participants: 203,
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "صندوق الاستثمارات العامة" : "Public Investment Fund",
      badge: isAr ? "🔗 بلوكتشين" : "🔗 Blockchain",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      globalPartner: false,
    },
    {
      id: 8,
      title: isAr ? "تحدي احتجاز الكربون في الصناعة" : "Industrial Carbon Capture Challenge",
      description: isAr ? "طوّر تقنية فعّالة لاحتجاز وتخزين انبعاثات CO₂ من المصانع بتكلفة أقل من 50 دولار/طن. جائزة مقدمة من مبادرة السعودية الخضراء." : "Develop an effective technology for capturing and storing CO₂ emissions from factories at a cost below $50/ton. Prize offered by the Green Saudi Initiative.",
      type: "challenge",
      category: "environment",
      prize: "3000000",
      status: "open",
      participants: 156,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "مبادرة السعودية الخضراء" : "Green Saudi Initiative",
      badge: isAr ? "🌍 جائزة المناخ" : "🌍 Climate Prize",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      globalPartner: false,
    },
    {
      id: 9,
      title: isAr ? "هاكاثون التقنية المالية اللامركزية" : "Decentralized FinTech Hackathon",
      description: isAr ? "ابتكارات في مجال DeFi والدفع الرقمي والخدمات المصرفية الإسلامية المتوافقة مع الشريعة." : "Innovations in DeFi, digital payments, and Shariah-compliant Islamic banking services.",
      type: "hackathon",
      category: "fintech",
      prize: "400000",
      status: "closed",
      participants: 512,
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      sponsor: "SAMA",
      badge: isAr ? "💰 تقنية مالية" : "💰 FinTech",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      globalPartner: false,
    },
    {
      id: 10,
      title: isAr ? "مسابقة التعليم بالواقع المعزز" : "Augmented Reality Education Competition",
      description: isAr ? "طوّر تجارب تعليمية تفاعلية باستخدام AR/VR لتعليم العلوم والرياضيات للطلاب في المراحل الابتدائية والمتوسطة." : "Develop interactive educational experiences using AR/VR to teach science and math to primary and middle school students.",
      type: "competition",
      category: "education",
      prize: "350000",
      status: "closed",
      participants: 289,
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "وزارة التعليم" : "Ministry of Education",
      badge: isAr ? "📚 تعليم" : "📚 Education",
      badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      globalPartner: false,
    },
    {
      id: 11,
      title: isAr ? "تحدي التكنولوجيا الحيوية - علاج السرطان بالنانو" : "Biotech Challenge - Nano Cancer Treatment",
      description: isAr ? "طوّر جسيمات نانوية ذكية لاستهداف الخلايا السرطانية وتوصيل الأدوية بدقة تفوق 98% دون أضرار جانبية." : "Develop smart nanoparticles to target cancer cells and deliver drugs with over 98% precision without side effects.",
      type: "challenge",
      category: "biotechnology",
      prize: "5000000",
      status: "open",
      participants: 87,
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      sponsor: "KACST × Weill Cornell Medicine",
      badge: "🧬 Biotech Challenge",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      globalPartner: true,
    },
    {
      id: 12,
      title: isAr ? "هاكاثون المواد المتقدمة - بدائل الكربون الفائق" : "Advanced Materials Hackathon - Super Carbon Alternatives",
      description: isAr ? "اكتشف مواد جديدة أخف وأقوى من الكربون الفائق لتطبيقات الفضاء والطاقة." : "Discover new materials lighter and stronger than super carbon for space and energy applications.",
      type: "hackathon",
      category: "advanced_materials",
      prize: "4000000",
      status: "open",
      participants: 63,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      sponsor: "KFUPM × MIT Materials Lab",
      badge: "⚗️ Advanced Materials",
      badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
      globalPartner: true,
    },
    {
      id: 13,
      title: isAr ? "تحدي Clean Tech - تحلية المياه بالطاقة الشمسية" : "Clean Tech Challenge - Solar Water Desalination",
      description: isAr ? "صمّم منظومة تحلية مياه تعمل 100% بالطاقة الشمسية بتكلفة أقل من 0.3 دولار/م³." : "Design a water desalination system powered 100% by solar energy at a cost below $0.3/m³.",
      type: "challenge",
      category: "clean_tech",
      prize: "6000000",
      status: "open",
      participants: 142,
      endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "NEOM × صندوق التنمية الخليجي" : "NEOM × Gulf Development Fund",
      badge: "💧 Clean Tech",
      badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      globalPartner: true,
    },
    {
      id: 14,
      title: isAr ? "مسابقة الحوسبة الكمية للأدوية" : "Quantum Computing for Drug Discovery Competition",
      description: isAr ? "استخدم الحوسبة الكمية لاكتشاف أدوية جديدة لمرض الزهايمر في وقت قياسي." : "Use quantum computing to discover new drugs for Alzheimer's disease in record time.",
      type: "competition",
      category: "quantum_computing",
      prize: "3500000",
      status: "open",
      participants: 45,
      endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
      sponsor: "KACST × IBM Quantum",
      badge: "⚛️ Quantum Computing",
      badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
      globalPartner: true,
    },
    {
      id: 15,
      title: isAr ? "هاكاثون الذكاء الاصطناعي للأمن السيبراني" : "AI Cybersecurity Hackathon",
      description: isAr ? "طوّر نظام AI لاكتشاف التهديدات السيبرانية في الوقت الفعلي بدقة 99.9%." : "Develop an AI system for real-time cybersecurity threat detection with 99.9% accuracy.",
      type: "hackathon",
      category: "technology",
      prize: "2500000",
      status: "open",
      participants: 198,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      sponsor: isAr ? "STC × وزارة الداخلية" : "STC × Ministry of Interior",
      badge: "🔐 Cybersecurity",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      globalPartner: true,
    },
  ];

  const displayChallenges = challenges && challenges.length > 0 ? challenges : demoChallenges;

  const filtered = displayChallenges.filter((c: any) => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
    const matchSearch = !search || c.title.includes(search) || c.description.includes(search);
    return matchFilter && matchCategory && matchSearch;
  });

  const getTypeText = (type: string) => {
    const types: Record<string, string> = {
      hackathon: isAr ? "هاكاثون" : "Hackathon",
      competition: isAr ? "مسابقة" : "Competition",
      challenge: isAr ? "تحدي" : "Challenge",
      open_problem: isAr ? "مشكلة مفتوحة" : "Open Problem",
      conference: isAr ? "مؤتمر" : "Conference",
    };
    return types[type] || type;
  };

  const getCategoryText = (category: string) => {
    const cats: Record<string, string> = {
      healthcare: isAr ? "الرعاية الصحية" : "Healthcare",
      energy: isAr ? "الطاقة" : "Energy",
      technology: isAr ? "التقنية" : "Technology",
      fintech: isAr ? "التقنية المالية" : "FinTech",
      education: isAr ? "التعليم" : "Education",
      agriculture: isAr ? "الزراعة" : "Agriculture",
      environment: isAr ? "البيئة" : "Environment",
      biotechnology: isAr ? "التكنولوجيا الحيوية" : "Biotechnology",
      advanced_materials: isAr ? "المواد المتقدمة" : "Advanced Materials",
      clean_tech: isAr ? "التقنية النظيفة" : "Clean Tech",
      quantum_computing: isAr ? "الحوسبة الكمية" : "Quantum Computing",
    };
    return cats[category] || category;
  };

  const getDaysLeft = (endDate: Date) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const totalPrize = displayChallenges
    .filter((c: any) => c.status === "open")
    .reduce((sum: number, c: any) => sum + Number(c.prize), 0);

  const globalPartnerCount = displayChallenges.filter((c: any) => c.globalPartner).length;

  const categories = [
    { id: "all", label: isAr ? "الكل" : "All" },
    { id: "biotechnology", label: "🧬 Biotech" },
    { id: "advanced_materials", label: isAr ? "⚗️ مواد متقدمة" : "⚗️ Advanced Materials" },
    { id: "clean_tech", label: "💧 Clean Tech" },
    { id: "quantum_computing", label: isAr ? "⚛️ كمية" : "⚛️ Quantum" },
    { id: "energy", label: isAr ? "⚡ طاقة" : "⚡ Energy" },
    { id: "technology", label: isAr ? "💻 تقنية" : "💻 Technology" },
    { id: "healthcare", label: isAr ? "🏥 صحة" : "🏥 Healthcare" },
    { id: "environment", label: isAr ? "🌍 بيئة" : "🌍 Environment" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NAQLA 5.0
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/40 gap-1.5">
                <Globe className="w-3 h-3" />
                {isAr ? "تحديات دولية" : "International Challenges"}
              </Badge>
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                {t.sidebar.dashboard}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Global Innovation Banner */}
        <div className="mb-8 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-blue-900/40 border border-violet-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center border border-violet-500/30">
              <Globe className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{isAr ? "منصة الابتكار الوطنية" : "National Innovation Platform"}</div>
              <div className="text-violet-300 text-xs">{isAr ? "تحديات محلية ودولية متخصصة" : "Local and international specialized challenges"}</div>
            </div>
          </div>
          <div className="flex-1 text-slate-300 text-sm text-center md:text-right">
            {isAr
              ? `NAQLA 5.0 — ${globalPartnerCount} تحديات دولية متخصصة بجوائز تتجاوز 21 مليون ريال، مع إمكانية التسجيل لأي مبتكر من أي دولة.`
              : `NAQLA 5.0 — ${globalPartnerCount} specialized international challenges with prizes exceeding 21 million SAR, open to innovators from any country.`
            }
          </div>
          <Link href="/naqla2/national-challenges" className="shrink-0">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Globe className="w-3.5 h-3.5" />
              {isAr ? "التحديات الوطنية" : "National Challenges"}
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">{isAr ? "نقلة 2 - التحديات الوطنية والدولية" : "NAQLA2 - National & International Challenges"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isAr ? "التحديات والمسابقات الوطنية" : "National Challenges & Competitions"}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {isAr
              ? "شارك في تحديات الابتكار الاستراتيجية وتنافس على جوائز بملايين الريالات مع أبرز المبتكرين في المملكة والخليج والعالم"
              : "Participate in strategic innovation challenges and compete for prizes worth millions with top innovators from Saudi Arabia, the Gulf, and the world"
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: isAr ? "تحدي نشط" : "Active Challenge", value: String(displayChallenges.filter((c: any) => c.status === "open").length), icon: Zap, color: "text-cyan-400" },
            { label: isAr ? "مشارك مسجل" : "Registered Participant", value: "3,940+", icon: Users, color: "text-blue-400" },
            { label: isAr ? "إجمالي الجوائز" : "Total Prizes", value: `${(totalPrize / 1000000).toFixed(1)}M ${isAr ? "ريال" : "SAR"}`, icon: DollarSign, color: "text-yellow-400" },
            { label: isAr ? "تحدي دولي" : "International Challenge", value: String(globalPartnerCount), icon: Globe, color: "text-violet-400" },
            { label: isAr ? "فائز سابق" : "Past Winner", value: "150+", icon: Trophy, color: "text-emerald-400" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
              <CardContent className="pt-5 pb-4 text-center">
                <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Filters */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">{isAr ? "تصفية حسب القطاع" : "Filter by Sector"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  categoryFilter === cat.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={isAr ? "ابحث عن تحدي..." : "Search for a challenge..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: isAr ? "الكل" : "All" },
              { id: "open", label: isAr ? "مفتوح" : "Open" },
              { id: "closed", label: isAr ? "منتهي" : "Closed" },
            ].map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.id as typeof filter)}
                className={filter === f.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Challenges Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((challenge: any) => {
              const daysLeft = getDaysLeft(challenge.endDate);
              return (
                <Card
                  key={challenge.id}
                  className={`border transition-all duration-200 group relative ${
                    challenge.status === "open"
                      ? "bg-slate-800/60 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80"
                      : "bg-slate-900/40 border-slate-800 opacity-70"
                  } ${challenge.globalPartner ? "ring-1 ring-violet-500/30" : ""}`}
                >
                  {/* Global Partner Badge */}
                  {challenge.globalPartner && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-violet-600/90 text-white border-0 text-[10px] gap-1 px-2 py-0.5">
                        <Globe className="w-2.5 h-2.5" />
                        {isAr ? "دولي" : "Global"}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-5">
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`text-xs border ${challenge.badgeColor || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                          {challenge.badge || getTypeText(challenge.type)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          challenge.status === "open"
                            ? "border-emerald-500/40 text-emerald-400"
                            : "border-slate-600 text-slate-500"
                        }`}>
                          {challenge.status === "open" ? (isAr ? "● مفتوح" : "● Open") : (isAr ? "● منتهي" : "● Closed")}
                        </Badge>
                      </div>
                      <div className="text-left shrink-0">
                        <div className="text-xl font-bold text-white leading-tight">
                          {Number(challenge.prize).toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-xs">{isAr ? "ريال جائزة" : "SAR Prize"}</div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {challenge.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{challenge.participants?.toLocaleString()} {isAr ? "مشارك" : "participants"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {challenge.status === "open"
                            ? daysLeft > 0
                              ? isAr ? `${daysLeft} يوم متبقي` : `${daysLeft} days left`
                              : isAr ? "آخر يوم!" : "Last day!"
                            : isAr ? "انتهى التحدي" : "Challenge ended"
                          }
                        </span>
                      </div>
                      {challenge.sponsor && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">{isAr ? "الراعي:" : "Sponsor:"}</span>
                          <span className="text-slate-300 font-medium">{challenge.sponsor}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">{sectorIcons[challenge.category]}</span>
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {getCategoryText(challenge.category)}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        disabled={challenge.status === "closed"}
                        className={challenge.status === "open"
                          ? "bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          : "bg-slate-700 text-slate-500 cursor-not-allowed text-xs"
                        }
                      >
                        {challenge.status === "open" ? (isAr ? "شارك الآن" : "Join Now") : (isAr ? "انتهى التحدي" : "Challenge Ended")}
                        {challenge.status === "open" && <ArrowLeft className="w-3 h-3 mr-1" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">{isAr ? "لا توجد تحديات تطابق بحثك" : "No challenges match your search"}</p>
            <Button variant="outline" className="mt-4 border-slate-700 text-slate-300" onClick={() => { setSearch(""); setFilter("all"); setCategoryFilter("all"); }}>
              {isAr ? "إعادة تعيين الفلتر" : "Reset Filter"}
            </Button>
          </div>
        )}

        {/* Innovation Sectors Section */}
        <div className="mt-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{isAr ? "قطاعات الابتكار المتخصصة" : "Specialized Innovation Sectors"}</h2>
            <Link href="/naqla2/national-challenges" className="text-violet-400 text-xs hover:underline mr-auto">
              {isAr ? "عرض التحديات الوطنية ←" : "View National Challenges →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Dna className="w-6 h-6" />, title: isAr ? "التكنولوجيا الحيوية" : "Biotechnology", desc: isAr ? "علم الجينوم، الأدوية الدقيقة، النانو الطبي" : "Genomics, precision medicine, medical nano", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", link: "/naqla2/national-challenges" },
              { icon: <Atom className="w-6 h-6" />, title: isAr ? "المواد المتقدمة" : "Advanced Materials", desc: isAr ? "الكربون الفائق، المواد النانوية، السيراميك الذكي" : "Super carbon, nanomaterials, smart ceramics", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", link: "/challenges" },
              { icon: <Leaf className="w-6 h-6" />, title: isAr ? "التقنية النظيفة" : "Clean Tech", desc: isAr ? "تحلية المياه، الطاقة المتجددة، إدارة النفايات" : "Water desalination, renewable energy, waste management", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", link: "/challenges" },
              { icon: <Cpu className="w-6 h-6" />, title: isAr ? "الحوسبة الكمية" : "Quantum Computing", desc: isAr ? "خوارزميات كمية، تشفير ما بعد الكم، محاكاة" : "Quantum algorithms, post-quantum encryption, simulation", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", link: "/challenges" },
            ].map((sector, i) => (
              <Link key={i} href={sector.link}>
                <Card className={`border ${sector.bg} hover:scale-105 transition-transform cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className={`${sector.color} mb-3`}>{sector.icon}</div>
                    <div className="text-white font-semibold text-sm mb-1">{sector.title}</div>
                    <div className="text-slate-400 text-xs leading-relaxed">{sector.desc}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-8 text-center border border-blue-800/40">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-3">{isAr ? "هل لديك تحدي لطرحه؟" : "Have a Challenge to Post?"}</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto text-sm">
            {isAr
              ? "إذا كنت شركة أو جهة حكومية وتريد طرح تحدي للمبتكرين والحصول على أفضل الحلول، تواصل معنا الآن."
              : "If you are a company or government entity and want to post a challenge for innovators and get the best solutions, contact us now."
            }
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              {isAr ? "طرح تحدي جديد" : "Post a New Challenge"}
            </Button>
            <Link href="/admin">
              <Button variant="outline" className="border-violet-600 text-violet-300 hover:bg-violet-900/30 gap-2">
                <Globe className="w-4 h-4" />
                {isAr ? "البرامج الدولية" : "International Programs"}
              </Button>
            </Link>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              {isAr ? "تعرف على الشروط" : "Learn the Terms"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
