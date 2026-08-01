import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Star, TrendingUp, Shield, Zap, Droplets, Heart, Brain, Building2, Leaf, ChevronDown, ChevronUp, ExternalLink, Award, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CaseStudy = {
  id: number;
  title: string;
  submitter: string;
  sector: string;
  sectorIcon: React.ReactNode;
  sectorColor: string;
  description: string;
  score: number;
  category: "innovation" | "commercial" | "weak";
  categoryLabel: string;
  scores: {
    novelty: number;
    market: number;
    technical: number;
    economic: number;
    social: number;
  };
  aiSummary: string;
  saipRecommendation?: string;
  outcome: string;
  outcomeType: "naqla2" | "naqla3" | "returned" | "saip";
  tags: string[];
};

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "نظام ذكي لتبريد الألواح الشمسية بالضباب الجاف",
    submitter: "م. سارة العتيبي",
    sector: "الطاقة المتجددة",
    sectorIcon: <Zap className="w-5 h-5" />,
    sectorColor: "from-yellow-500 to-orange-500",
    description: "نظام آلي يستخدم الضباب الجاف (CO₂) لتبريد الألواح الشمسية في أوقات ذروة الحرارة، مما يرفع كفاءتها بنسبة 23% في المناطق الحارة.",
    score: 87,
    category: "innovation",
    categoryLabel: "ابتكار حقيقي",
    scores: { novelty: 92, market: 88, technical: 85, economic: 84, social: 86 },
    aiSummary: "الفكرة تحل مشكلة حقيقية وموثقة في قطاع الطاقة الشمسية السعودي. لا يوجد حل مشابه مسجّل في SAIP. الفكرة قابلة للتطبيق الصناعي وتستحق حماية فكرية فورية.",
    saipRecommendation: "يُنصح بتقديم طلب براءة اختراع في SAIP قبل الإفصاح عن التفاصيل التقنية. التصنيف: IPC F24S 40/00",
    outcome: "تم تقديم طلب براءة اختراع في SAIP (رقم SA/2024/0847) وانتقلت الفكرة إلى نقلة 2 لإيجاد شريك تقني.",
    outcomeType: "saip",
    tags: ["طاقة شمسية", "تبريد", "كفاءة", "براءة اختراع"],
  },
  {
    id: 2,
    title: "تطبيق لربط المزارعين بأسواق التصدير مباشرة",
    submitter: "خالد الشمري",
    sector: "الزراعة والغذاء",
    sectorIcon: <Leaf className="w-5 h-5" />,
    sectorColor: "from-green-500 to-emerald-500",
    description: "منصة رقمية تربط المزارعين السعوديين مباشرة بالمستوردين في دول الخليج، مع نظام تتبع الجودة وإدارة الشحنات.",
    score: 64,
    category: "commercial",
    categoryLabel: "حل تجاري",
    scores: { novelty: 55, market: 78, technical: 65, economic: 72, social: 68 },
    aiSummary: "الفكرة ذات قيمة تجارية واضحة لكنها ليست ابتكاراً جديداً — توجد منصات مشابهة عالمياً. القيمة الحقيقية في التخصيص للسوق السعودي والخليجي.",
    outcome: "انتقلت الفكرة مباشرة إلى نقلة 2 حيث وجد المقدّم 3 مستثمرين مهتمين وشريكاً تقنياً.",
    outcomeType: "naqla2",
    tags: ["زراعة", "تصدير", "تجارة إلكترونية", "خليج"],
  },
  {
    id: 3,
    title: "جهاز قياس ضغط الدم عبر الكاميرا",
    submitter: "د. نورة الحربي",
    sector: "الصحة والطب",
    sectorIcon: <Heart className="w-5 h-5" />,
    sectorColor: "from-red-500 to-pink-500",
    description: "تقنية تستخدم كاميرا الهاتف لقياس ضغط الدم عبر تحليل تدفق الدم في الوجه باستخدام الذكاء الاصطناعي.",
    score: 91,
    category: "innovation",
    categoryLabel: "ابتكار حقيقي",
    scores: { novelty: 95, market: 90, technical: 88, economic: 92, social: 94 },
    aiSummary: "ابتكار متميز في مجال الرعاية الصحية الرقمية. البحث في قواعد SAIP وWIPO لم يُظهر براءة مطابقة. الفكرة تستحق تسريع التقديم على SAIP وتطوير نموذج أولي.",
    saipRecommendation: "أولوية قصوى للتسجيل في SAIP. يُنصح بالتواصل مع مكتب نقل التقنية في جامعة الملك عبدالله (KAUST) للدعم.",
    outcome: "جارٍ تقديم طلب براءة اختراع. الفكرة في مرحلة التفاوض مع صندوق استثمار صحي في نقلة 2.",
    outcomeType: "saip",
    tags: ["صحة رقمية", "ذكاء اصطناعي", "تشخيص", "براءة اختراع"],
  },
  {
    id: 4,
    title: "تطبيق تعليمي لتعليم البرمجة للأطفال",
    submitter: "عبدالرحمن القحطاني",
    sector: "التعليم والتقنية",
    sectorIcon: <Brain className="w-5 h-5" />,
    sectorColor: "from-blue-500 to-indigo-500",
    description: "تطبيق يعلّم الأطفال البرمجة من خلال قصص وألعاب تفاعلية باللغة العربية.",
    score: 38,
    category: "weak",
    categoryLabel: "تحتاج تطوير",
    scores: { novelty: 30, market: 45, technical: 40, economic: 35, social: 50 },
    aiSummary: "الفكرة موجودة بالفعل في السوق (Scratch, Code.org, Tynker). لا تمييز واضح. يحتاج المقدّم إلى تحديد ميزة تنافسية فريدة وإجراء بحث سوقي معمّق.",
    outcome: "أُعيدت الفكرة مع توصيات تطوير: دراسة منافسين، تحديد شريحة مستهدفة أضيق، وإضافة ميزة فريدة.",
    outcomeType: "returned",
    tags: ["تعليم", "برمجة", "أطفال", "تحتاج تطوير"],
  },
  {
    id: 5,
    title: "نظام إدارة مياه الصرف الصحي بالذكاء الاصطناعي",
    submitter: "م. فيصل الدوسري",
    sector: "المياه والبيئة",
    sectorIcon: <Droplets className="w-5 h-5" />,
    sectorColor: "from-cyan-500 to-blue-500",
    description: "نظام يستخدم حساسات IoT والذكاء الاصطناعي لتحسين كفاءة محطات معالجة مياه الصرف الصحي وتقليل استهلاك الطاقة بنسبة 35%.",
    score: 79,
    category: "innovation",
    categoryLabel: "ابتكار حقيقي",
    scores: { novelty: 80, market: 82, technical: 76, economic: 78, social: 85 },
    aiSummary: "فكرة ذات أثر بيئي واضح ومتوافقة مع أهداف رؤية 2030 في قطاع المياه. يوجد تطبيق جزئي في بعض الدول لكن التكامل مع البنية التحتية السعودية يمثل ميزة تنافسية.",
    saipRecommendation: "يُنصح بتسجيل نموذج المنفعة (Utility Model) في SAIP كخطوة أسرع وأقل تكلفة من براءة الاختراع الكاملة.",
    outcome: "انتقلت إلى نقلة 2 وحصلت على اهتمام من شركة المياه الوطنية كشريك تجريبي.",
    outcomeType: "naqla2",
    tags: ["مياه", "IoT", "ذكاء اصطناعي", "بيئة"],
  },
  {
    id: 6,
    title: "منصة لإدارة المباني الذكية",
    submitter: "شركة تقنية ناشئة",
    sector: "العقارات والبناء",
    sectorIcon: <Building2 className="w-5 h-5" />,
    sectorColor: "from-purple-500 to-violet-500",
    description: "منصة SaaS لإدارة المباني الذكية تدمج أنظمة HVAC والإضاءة والأمن في لوحة تحكم واحدة.",
    score: 58,
    category: "commercial",
    categoryLabel: "حل تجاري",
    scores: { novelty: 48, market: 70, technical: 62, economic: 65, social: 55 },
    aiSummary: "السوق السعودي يشهد نمواً في المباني الذكية مع مشاريع نيوم وذا لاين. الفكرة تجارية وليست ابتكاراً جديداً، لكن التوقيت مناسب جداً للدخول للسوق.",
    outcome: "انتقلت إلى نقلة 3 مباشرة لعرضها في سوق الابتكارات وإيجاد مستثمر استراتيجي.",
    outcomeType: "naqla3",
    tags: ["مباني ذكية", "SaaS", "عقارات", "IoT"],
  },
];

const categoryConfig = {
  innovation: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: <Award className="w-4 h-4" />, label: "ابتكار حقيقي" },
  commercial: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <TrendingUp className="w-4 h-4" />, label: "حل تجاري" },
  weak: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: <AlertCircle className="w-4 h-4" />, label: "تحتاج تطوير" },
};

const outcomeConfig = {
  saip: { color: "text-purple-400", icon: <Shield className="w-4 h-4" />, label: "تسجيل SAIP + نقلة 2" },
  naqla2: { color: "text-blue-400", icon: <TrendingUp className="w-4 h-4" />, label: "انتقلت إلى نقلة 2" },
  naqla3: { color: "text-cyan-400", icon: <Star className="w-4 h-4" />, label: "انتقلت إلى نقلة 3" },
  returned: { color: "text-amber-400", icon: <AlertCircle className="w-4 h-4" />, label: "أُعيدت للتطوير" },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);
  const cat = categoryConfig[cs.category];
  const out = outcomeConfig[cs.outcomeType];

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 hover:border-slate-600 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cs.sectorColor} flex items-center justify-center text-white flex-shrink-0`}>
              {cs.sectorIcon}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-base leading-snug mb-1">{cs.title}</h3>
              <p className="text-slate-400 text-xs">{cs.submitter} · {cs.sector}</p>
            </div>
          </div>
          {/* Score */}
          <div className="flex-shrink-0 text-center">
            <div className={`text-2xl font-bold ${cs.score >= 70 ? "text-emerald-400" : cs.score >= 50 ? "text-blue-400" : "text-amber-400"}`}>
              {cs.score}
            </div>
            <div className="text-slate-500 text-xs">/ 100</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${cat.color}`}>
            {cat.icon}{cat.label}
          </span>
          {cs.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-400 border border-slate-600/40">{tag}</span>
          ))}
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">{cs.description}</p>

        {/* Outcome */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/40 border border-slate-600/30 mb-4">
          <span className={out.color}>{out.icon}</span>
          <span className={`text-sm font-medium ${out.color}`}>{out.label}</span>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1"
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> إخفاء التفاصيل</> : <><ChevronDown className="w-4 h-4" /> عرض تفاصيل التقييم</>}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t border-slate-700/50 pt-4">
            {/* Score Bars */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-medium mb-2">تفاصيل التقييم</p>
              <ScoreBar label="الجِدة والأصالة" value={cs.scores.novelty} />
              <ScoreBar label="إمكانية السوق" value={cs.scores.market} />
              <ScoreBar label="الجدوى التقنية" value={cs.scores.technical} />
              <ScoreBar label="الأثر الاقتصادي" value={cs.scores.economic} />
              <ScoreBar label="الأثر الاجتماعي" value={cs.scores.social} />
            </div>

            {/* AI Summary */}
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
              <p className="text-xs text-slate-500 mb-1 font-medium">تحليل الذكاء الاصطناعي</p>
              <p className="text-sm text-slate-300 leading-relaxed">{cs.aiSummary}</p>
            </div>

            {/* SAIP Recommendation */}
            {cs.saipRecommendation && (
              <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/20">
                <p className="text-xs text-purple-400 mb-1 font-medium flex items-center gap-1"><Shield className="w-3 h-3" /> توصية SAIP</p>
                <p className="text-sm text-slate-300 leading-relaxed">{cs.saipRecommendation}</p>
              </div>
            )}

            {/* Final Outcome */}
            <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/20">
              <p className="text-xs text-slate-500 mb-1 font-medium">النتيجة الفعلية</p>
              <p className="text-sm text-slate-300 leading-relaxed">{cs.outcome}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Naqla1CaseStudies() {
  const [activeFilter, setActiveFilter] = useState<"all" | "innovation" | "commercial" | "weak">("all");

  const filtered = activeFilter === "all" ? caseStudies : caseStudies.filter(cs => cs.category === activeFilter);

  const stats = {
    total: caseStudies.length,
    innovation: caseStudies.filter(c => c.category === "innovation").length,
    commercial: caseStudies.filter(c => c.category === "commercial").length,
    weak: caseStudies.filter(c => c.category === "weak").length,
    avgScore: Math.round(caseStudies.reduce((s, c) => s + c.score, 0) / caseStudies.length),
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/naqla1">
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                <ArrowRight className="w-4 h-4" />
                العودة لنقلة ONE
              </button>
            </Link>
            <span className="text-slate-700">|</span>
            <h1 className="text-white font-bold text-lg">أمثلة حقيقية من نقلة ONE</h1>
          </div>
          <Link href="/naqla1/submit">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              قدّم فكرتك الآن
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-4 h-4" />
            أمثلة حقيقية من المنصة
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">شاهد كيف يقيّم الذكاء الاصطناعي الأفكار</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            هذه أفكار حقيقية قدّمها مبتكرون سعوديون وتم تقييمها في نقلة ONE. اطّلع على التحليل الكامل، توصيات SAIP، والمسار الذي سلكته كل فكرة.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "إجمالي الأمثلة", value: stats.total, color: "text-white" },
            { label: "ابتكار حقيقي", value: stats.innovation, color: "text-emerald-400" },
            { label: "حل تجاري", value: stats.commercial, color: "text-blue-400" },
            { label: "تحتاج تطوير", value: stats.weak, color: "text-amber-400" },
            { label: "متوسط النتيجة", value: `${stats.avgScore}%`, color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "الكل", count: stats.total },
            { key: "innovation", label: "ابتكار حقيقي", count: stats.innovation },
            { key: "commercial", label: "حل تجاري", count: stats.commercial },
            { key: "weak", label: "تحتاج تطوير", count: stats.weak },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key as typeof activeFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {filtered.map(cs => <CaseStudyCard key={cs.id} cs={cs} />)}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/60 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">هل فكرتك جاهزة للتقييم؟</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            قدّم فكرتك الآن واحصل على تقرير تقييم شامل بالذكاء الاصطناعي خلال دقائق — مجاناً.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/naqla1/submit">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6">
                قدّم فكرتك الآن
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/saip-assessment">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white gap-2 px-6">
                <Shield className="w-4 h-4" />
                تقييم الملكية الفكرية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
