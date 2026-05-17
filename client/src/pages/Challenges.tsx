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

  const demoChallenges = [
    {
      id: 1,
      title: "هاكاثون الهيدروجين الأخضر - أرامكو",
      description: "طوّر حلولاً مبتكرة لإنتاج وتخزين ونقل الهيدروجين الأخضر بكفاءة عالية. الفائز يحصل على عقد تجريبي مع أرامكو السعودية.",
      type: "hackathon",
      category: "energy",
      prize: "2000000",
      status: "open",
      participants: 312,
      endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      sponsor: "أرامكو السعودية",
      badge: "🏆 جائزة كبرى",
      badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      globalPartner: false,
    },
    {
      id: 2,
      title: "تحدي تبريد البطاريات في الحرارة العالية",
      description: "ابتكر نظام تبريد فعّال للبطاريات الكهربائية في درجات حرارة تتجاوز 50°م. الحل الفائز سيُطبَّق في مشاريع نيوم.",
      type: "challenge",
      category: "energy",
      prize: "1500000",
      status: "open",
      participants: 189,
      endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      sponsor: "نيوم",
      badge: "🌟 تحدي نيوم",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      globalPartner: false,
    },
    {
      id: 3,
      title: "مسابقة الذكاء الاصطناعي للتشخيص الطبي",
      description: "طوّر نموذج AI لتشخيص الأمراض المزمنة من صور الأشعة بدقة تفوق 95%. الفائز يحصل على تمويل أولي من وزارة الصحة.",
      type: "competition",
      category: "healthcare",
      prize: "1000000",
      status: "open",
      participants: 267,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sponsor: "وزارة الصحة",
      badge: "🏥 رعاية صحية",
      badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      globalPartner: false,
    },
    {
      id: 4,
      title: "هاكاثون المدن الذكية - رؤية 2030",
      description: "ابتكر حلولاً لتحسين إدارة حركة المرور وتقليل استهلاك الطاقة في المدن السعودية باستخدام إنترنت الأشياء والذكاء الاصطناعي.",
      type: "hackathon",
      category: "technology",
      prize: "750000",
      status: "open",
      participants: 445,
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      sponsor: "وزارة الاتصالات",
      badge: "🏙️ مدن ذكية",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      globalPartner: false,
    },
    {
      id: 5,
      title: "تحدي روبوتات تنظيف الألواح الشمسية",
      description: "صمّم روبوتاً ذاتياً لتنظيف الألواح الشمسية في البيئات الصحراوية بتكلفة تشغيل أقل من 0.5 ريال/م². الفائز يحصل على عقد توريد.",
      type: "challenge",
      category: "energy",
      prize: "800000",
      status: "open",
      participants: 134,
      endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
      sponsor: "الشركة السعودية للكهرباء",
      badge: "☀️ طاقة شمسية",
      badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      globalPartner: false,
    },
    {
      id: 6,
      title: "مسابقة الزراعة الذكية بالمياه المُعالجة",
      description: "طوّر نظاماً متكاملاً للزراعة المائية يستخدم المياه المُعالجة ويقلل الاستهلاك بنسبة 70%. مدعوم من وزارة البيئة والمياه.",
      type: "competition",
      category: "agriculture",
      prize: "600000",
      status: "open",
      participants: 98,
      endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      sponsor: "وزارة البيئة والمياه",
      badge: "🌱 زراعة مستدامة",
      badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
      globalPartner: false,
    },
    {
      id: 7,
      title: "هاكاثون البلوكتشين للملكية الفكرية",
      description: "ابتكر منصة لحماية وتسجيل براءات الاختراع باستخدام تقنية البلوكتشين. الفائز يحصل على تمويل من صندوق الاستثمارات العامة.",
      type: "hackathon",
      category: "technology",
      prize: "500000",
      status: "open",
      participants: 203,
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      sponsor: "صندوق الاستثمارات العامة",
      badge: "🔗 بلوكتشين",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      globalPartner: false,
    },
    {
      id: 8,
      title: "تحدي احتجاز الكربون في الصناعة",
      description: "طوّر تقنية فعّالة لاحتجاز وتخزين انبعاثات CO₂ من المصانع بتكلفة أقل من 50 دولار/طن. جائزة مقدمة من مبادرة السعودية الخضراء.",
      type: "challenge",
      category: "environment",
      prize: "3000000",
      status: "open",
      participants: 156,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      sponsor: "مبادرة السعودية الخضراء",
      badge: "🌍 جائزة المناخ",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      globalPartner: false,
    },
    {
      id: 9,
      title: "هاكاثون التقنية المالية اللامركزية",
      description: "ابتكارات في مجال DeFi والدفع الرقمي والخدمات المصرفية الإسلامية المتوافقة مع الشريعة.",
      type: "hackathon",
      category: "fintech",
      prize: "400000",
      status: "closed",
      participants: 512,
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      sponsor: "ساما",
      badge: "💰 تقنية مالية",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      globalPartner: false,
    },
    {
      id: 10,
      title: "مسابقة التعليم بالواقع المعزز",
      description: "طوّر تجارب تعليمية تفاعلية باستخدام AR/VR لتعليم العلوم والرياضيات للطلاب في المراحل الابتدائية والمتوسطة.",
      type: "competition",
      category: "education",
      prize: "350000",
      status: "closed",
      participants: 289,
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sponsor: "وزارة التعليم",
      badge: "📚 تعليم",
      badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      globalPartner: false,
    },
    // ===== قطاعات دولية متخصصة =====
    {
      id: 11,
      title: "تحدي التكنولوجيا الحيوية - علاج السرطان بالنانو",
      description: "طوّر جسيمات نانوية ذكية لاستهداف الخلايا السرطانية وتوصيل الأدوية بدقة تفوق 98% دون أضرار جانبية. شراكة مع كلية طب وايل كورنيل ومركز الابتكار الصحي.",
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
      title: "هاكاثون المواد المتقدمة - بدائل الكربون الفائق",
      description: "اكتشف مواد جديدة أخف وأقوى من الكربون الفائق لتطبيقات الفضاء والطاقة. الفائز يحصل على براءة اختراع مسجّلة دولياً وتمويل بحثي 3 سنوات.",
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
      title: "تحدي Clean Tech - تحلية المياه بالطاقة الشمسية",
      description: "صمّم منظومة تحلية مياه تعمل 100% بالطاقة الشمسية بتكلفة أقل من 0.3 دولار/م³. يُطبَّق الحل في 5 دول خليجية بدعم من صندوق التنمية الخليجي.",
      type: "challenge",
      category: "clean_tech",
      prize: "6000000",
      status: "open",
      participants: 142,
      endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      sponsor: "NEOM × صندوق التنمية الخليجي",
      badge: "💧 Clean Tech",
      badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      globalPartner: true,
    },
    {
      id: 14,
      title: "مسابقة الحوسبة الكمية للأدوية",
      description: "استخدم الحوسبة الكمية لاكتشاف أدوية جديدة لمرض الزهايمر في وقت قياسي. شراكة مع IBM Quantum لتوفير بيئة حوسبة كمية مجانية للمتسابقين.",
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
      title: "هاكاثون الذكاء الاصطناعي للأمن السيبراني",
      description: "طوّر نظام AI لاكتشاف التهديدات السيبرانية في الوقت الفعلي بدقة 99.9%. الفائز يحصل على عقد مع وزارة الداخلية وشهادة دولية للابتكار الأمني.",
      type: "hackathon",
      category: "technology",
      prize: "2500000",
      status: "open",
      participants: 198,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      sponsor: "STC × وزارة الداخلية",
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
    switch (type) {
      case "hackathon": return "هاكاثون";
      case "competition": return "مسابقة";
      case "challenge": return "تحدي";
      case "open_problem": return "مشكلة مفتوحة";
      case "conference": return "مؤتمر";
      default: return type;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "healthcare": return "الرعاية الصحية";
      case "energy": return "الطاقة";
      case "technology": return "التقنية";
      case "fintech": return "التقنية المالية";
      case "education": return "التعليم";
      case "agriculture": return "الزراعة";
      case "environment": return "البيئة";
      case "biotechnology": return "التكنولوجيا الحيوية";
      case "advanced_materials": return "المواد المتقدمة";
      case "clean_tech": return "التقنية النظيفة";
      case "quantum_computing": return "الحوسبة الكمية";
      default: return category;
    }
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
    { id: "all", label: "الكل" },
    { id: "biotechnology", label: "🧬 Biotech" },
    { id: "advanced_materials", label: "⚗️ مواد متقدمة" },
    { id: "clean_tech", label: "💧 Clean Tech" },
    { id: "quantum_computing", label: "⚛️ كمية" },
    { id: "energy", label: "⚡ طاقة" },
    { id: "technology", label: "💻 تقنية" },
    { id: "healthcare", label: "🏥 صحة" },
    { id: "environment", label: "🌍 بيئة" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                نقلة 5.0
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/40 gap-1.5">
                <Globe className="w-3 h-3" />
                تحديات دولية
              </Badge>
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                لوحة التحكم
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
              <div className="text-white font-bold text-sm">منصة الابتكار الوطنية</div>
              <div className="text-violet-300 text-xs">تحديات محلية ودولية متخصصة</div>
            </div>
          </div>
          <div className="flex-1 text-slate-300 text-sm text-center md:text-right">
            نقلة 5.0 — {globalPartnerCount} تحديات دولية متخصصة بجوائز تتجاوز 21 مليون ريال، مع إمكانية التسجيل لأي مبتكر من أي دولة.
          </div>
          <Link href="/naqla2/national-challenges" className="shrink-0">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Globe className="w-3.5 h-3.5" />
              التحديات الوطنية
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">نقلة 2 - التحديات الوطنية والدولية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            التحديات والمسابقات الوطنية
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            شارك في تحديات الابتكار الاستراتيجية وتنافس على جوائز بملايين الريالات مع أبرز المبتكرين في المملكة والخليج والعالم
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: "تحدي نشط", value: String(displayChallenges.filter((c: any) => c.status === "open").length), icon: Zap, color: "text-cyan-400" },
            { label: "مشارك مسجل", value: "3,940+", icon: Users, color: "text-blue-400" },
            { label: "إجمالي الجوائز", value: `${(totalPrize / 1000000).toFixed(1)}M ريال`, icon: DollarSign, color: "text-yellow-400" },
            { label: "تحدي دولي", value: String(globalPartnerCount), icon: Globe, color: "text-violet-400" },
            { label: "فائز سابق", value: "150+", icon: Trophy, color: "text-emerald-400" },
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
            <span className="text-slate-400 text-sm">تصفية حسب القطاع</span>
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
              placeholder="ابحث عن تحدي..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: "الكل" },
              { id: "open", label: "مفتوح" },
              { id: "closed", label: "منتهي" },
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
                        دولي
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
                          {challenge.status === "open" ? "● مفتوح" : "● منتهي"}
                        </Badge>
                      </div>
                      <div className="text-left shrink-0">
                        <div className="text-xl font-bold text-white leading-tight">
                          {Number(challenge.prize).toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-xs">ريال جائزة</div>
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
                        <span>{challenge.participants?.toLocaleString()} مشارك</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {challenge.status === "open"
                            ? daysLeft > 0 ? `${daysLeft} يوم متبقي` : "آخر يوم!"
                            : "انتهى التحدي"
                          }
                        </span>
                      </div>
                      {challenge.sponsor && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">الراعي:</span>
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
                        {challenge.status === "open" ? "شارك الآن" : "انتهى التحدي"}
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
            <p className="text-slate-400 text-lg">لا توجد تحديات تطابق بحثك</p>
            <Button variant="outline" className="mt-4 border-slate-700 text-slate-300" onClick={() => { setSearch(""); setFilter("all"); setCategoryFilter("all"); }}>
              إعادة تعيين الفلتر
            </Button>
          </div>
        )}

        {/* Innovation Sectors Section */}
        <div className="mt-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white">قطاعات الابتكار المتخصصة</h2>
            <Link href="/naqla2/national-challenges" className="text-violet-400 text-xs hover:underline mr-auto">
              عرض التحديات الوطنية ←
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Dna className="w-6 h-6" />, title: "التكنولوجيا الحيوية", desc: "علم الجينوم، الأدوية الدقيقة، النانو الطبي", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", link: "/naqla2/national-challenges" },
              { icon: <Atom className="w-6 h-6" />, title: "المواد المتقدمة", desc: "الكربون الفائق، المواد النانوية، السيراميك الذكي", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", link: "/challenges" },
              { icon: <Leaf className="w-6 h-6" />, title: "التقنية النظيفة", desc: "تحلية المياه، الطاقة المتجددة، إدارة النفايات", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", link: "/challenges" },
              { icon: <Cpu className="w-6 h-6" />, title: "الحوسبة الكمية", desc: "خوارزميات كمية، تشفير ما بعد الكم، محاكاة", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", link: "/challenges" },
            ].map((sector, i) => (
              <Link key={i} href={sector.link}>
                <Card className={`border ${sector.bg} hover:scale-105 transition-transform cursor-pointer h-full`}>
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
          <h2 className="text-2xl font-bold text-white mb-3">هل لديك تحدي لطرحه؟</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto text-sm">
            إذا كنت شركة أو جهة حكومية وتريد طرح تحدي للمبتكرين والحصول على أفضل الحلول، تواصل معنا الآن. يمكنك أيضاً التقدم لبرامج التسريع والتمويل الدولية عبر نقلة.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              طرح تحدي جديد
            </Button>
            <Link href="/admin">
              <Button variant="outline" className="border-violet-600 text-violet-300 hover:bg-violet-900/30 gap-2">
                <Globe className="w-4 h-4" />
                البرامج الدولية
              </Button>
            </Link>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              تعرف على الشروط
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
