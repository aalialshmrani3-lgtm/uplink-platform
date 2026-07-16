import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, FlaskConical, Cpu, Globe, CheckCircle2, 
  ArrowLeft, ArrowRight, Star, Zap, TrendingUp,
  Building2, DollarSign, Award, Info, ChevronDown, ChevronUp
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const assessmentQuestions = [
  { id: 1, question: "Do you have experimental proof that your tech concept works?", weight: 1 },
  { id: 2, question: "Have you conducted tests in a controlled lab environment?", weight: 1 },
  { id: 3, question: "Do you have a working prototype?", weight: 2 },
  { id: 4, question: "Have you tested your technology in a relevant environment?", weight: 2 },
  { id: 5, question: "Have you obtained performance data from a real operational environment?", weight: 2 },
  { id: 6, question: "Is the system development complete and has it received quality certifications?", weight: 1 },
  { id: 7, question: "Do you have actual sales or customers using the technology?", weight: 1 },
];

export default function TRLAssessment() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [selectedTRL, setSelectedTRL] = useState<number | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "assess">("browse");

  const trlLevels = [
    {
      level: 1,
      title: isAr ? "المبادئ الأساسية" : "Basic Principles",
      titleEn: "Basic Principles",
      description: isAr ? "المبادئ العلمية الأساسية ملاحظة ومُبلَّغ عنها. أدنى مستوى من النضج التقني." : "Basic scientific principles observed & reported. Lowest level of tech maturity.",
      criteria: [isAr ? "بحث نظري بحت" : "Pure Theoretical Research", isAr ? "لا يوجد نموذج أولي" : "No Prototype", isAr ? "نتائج أولية منشورة" : "Preliminary Results Published"],
      color: "from-slate-600 to-slate-700",
      badgeColor: "bg-slate-600/20 text-slate-400 border-slate-600/30",
      stage: isAr ? "بحث أساسي" : "Basic Research",
      fundingRange: isAr ? "منح بحثية" : "Research Grants",
      globalEligible: false,
      icon: "🔬",
    },
    {
      level: 2,
      title: isAr ? "مفهوم التقنية" : "Technology Concept",
      titleEn: "Technology Concept",
      description: isAr ? "تمت صياغة مفهوم تطبيق التقنية. المفهوم تخميني، لا يوجد إثبات تجريبي." : "Tech application concept formulated. Concept is speculative, no experimental proof.",
      criteria: [isAr ? "تحديد التطبيق المحتمل" : "Potential Application Identified", isAr ? "دراسة الجدوى النظرية" : "Theoretical Feasibility Study", isAr ? "لا يوجد نموذج مادي" : "No Physical Model"],
      color: "from-red-700 to-red-800",
      badgeColor: "bg-red-700/20 text-red-400 border-red-700/30",
      stage: isAr ? "بحث تطبيقي" : "Applied Research",
      fundingRange: isAr ? "منح بحثية" : "Research Grants",
      globalEligible: false,
      icon: "💡",
    },
    {
      level: 3,
      title: isAr ? "إثبات المفهوم" : "Proof of Concept",
      titleEn: "Proof of Concept",
      description: isAr ? "إجراء بحث وظيفي تجريبي وإثبات مفهوم. التحقق التحليلي والمختبري من التنبؤات الحرجة." : "Experimental functional research & PoC conducted. Analytical & lab verification of critical predictions.",
      criteria: [isAr ? "تجارب معملية أولية" : "Preliminary Lab Experiments", isAr ? "إثبات المفهوم نظرياً" : "Theoretical Proof of Concept", isAr ? "تحليل الجدوى التقنية" : "Technical Feasibility Analysis"],
      color: "from-orange-600 to-orange-700",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      stage: isAr ? "تطوير مبكر" : "Early Development",
      fundingRange: isAr ? "تمويل أولي" : "Seed Funding",
      globalEligible: false,
      icon: "⚗️",
    },
    {
      level: 4,
      title: isAr ? "التحقق في المختبر" : "Validation in Lab",
      titleEn: "Lab Validation",
      description: isAr ? "مكونات التقنية مُتحقق منها في المختبر. تكامل المكونات الأساسية لإثبات الجدوى." : "Tech components validated in lab. Integration of basic components to show feasibility.",
      criteria: [isAr ? "نموذج أولي منخفض الدقة" : "Low-Fidelity Prototype", isAr ? "اختبارات مختبرية" : "Lab Tests", isAr ? "تكامل المكونات الأساسية" : "Basic Component Integration"],
      color: "from-yellow-600 to-yellow-700",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      stage: isAr ? "نموذج أولي" : "Prototype",
      fundingRange: "Seed Funding - Series A",
      globalEligible: true,
      icon: "🧪",
    },
    {
      level: 5,
      title: isAr ? "التحقق في بيئة ذات صلة" : "Validation in Relevant Environment",
      titleEn: "Relevant Environment Validation",
      description: isAr ? "التقنية مُتحقق منها في بيئة ذات صلة (محاكاة). نموذج أولي عالي الدقة." : "Tech validated in relevant (simulated) environment. High-fidelity prototype.",
      criteria: [isAr ? "نموذج أولي عالي الدقة" : "High-Fidelity Prototype", isAr ? "اختبار في بيئة محاكاة" : "Simulated Environment Testing", isAr ? "تكامل النظام الكامل" : "Full System Integration"],
      color: "from-lime-600 to-lime-700",
      badgeColor: "bg-lime-600/20 text-lime-400 border-lime-600/30",
      stage: isAr ? "تطوير متقدم" : "Advanced Development",
      fundingRange: "Series A",
      globalEligible: true,
      icon: "🔧",
    },
    {
      level: 6,
      title: isAr ? "النمذجة في العالم الحقيقي" : "Real-World Prototyping",
      titleEn: "Relevant Environment Demo",
      description: isAr ? "تم عرض نموذج أولي للنظام في بيئة ذات صلة. النمذجة في بيئة تشغيلية محاكاة." : "System prototype demonstrated in relevant environment. Prototyping in simulated operational environment.",
      criteria: [isAr ? "نموذج أولي كامل" : "Full Prototype", isAr ? "اختبار ميداني محدود" : "Limited Field Testing", isAr ? "تقييم الأداء الأولي" : "Initial Performance Assessment"],
      color: "from-green-600 to-green-700",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      stage: isAr ? "نمذجة ميدانية" : "Field Prototyping",
      fundingRange: "Series A - B",
      globalEligible: true,
      icon: "🌍",
    },
    {
      level: 7,
      title: isAr ? "النموذج في البيئة التشغيلية" : "Prototype in Operational Environment",
      titleEn: "Operational Environment Demo",
      description: isAr ? "تم عرض النموذج الأولي في البيئة التشغيلية الفعلية. يمثل قفزة كبيرة من TRL 6." : "Prototype demonstrated in actual operational environment. Represents a major jump from TRL 6.",
      criteria: [isAr ? "اختبار في بيئة حقيقية" : "Real-World Testing", isAr ? "أداء مثبت ميدانياً" : "Field-Proven Performance", isAr ? "جاهز للتجريب التجاري" : "Ready for Commercial Prototyping"],
      color: "from-teal-600 to-teal-700",
      badgeColor: "bg-teal-600/20 text-teal-400 border-teal-600/30",
      stage: isAr ? "جاهز للسوق" : "Market Ready",
      fundingRange: "Series B - C",
      globalEligible: true,
      icon: "🚀",
    },
    {
      level: 8,
      title: isAr ? "النظام مكتمل ومؤهل" : "System Complete & Qualified",
      titleEn: "System Complete & Qualified",
      description: isAr ? "النظام مكتمل ومؤهل من خلال الاختبار والعرض. في معظم الحالات، هذه نهاية تطوير النظام الحقيقي." : "System complete and qualified through test and demonstration. In most cases, this is the end of true system development.",
      criteria: [isAr ? "نظام مكتمل ومختبر" : "Complete & Tested System", isAr ? "شهادات الجودة" : "Quality Certifications", isAr ? "جاهز للإنتاج" : "Ready for Production"],
      color: "from-blue-600 to-blue-700",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      stage: isAr ? "ما قبل الإطلاق" : "Pre-Launch",
      fundingRange: "Series C+",
      globalEligible: true,
      icon: "✅",
    },
    {
      level: 9,
      title: isAr ? "النظام مُثبَت في البيئة التشغيلية" : "System Proven in Operational Environment",
      titleEn: "Actual System Proven",
      description: isAr ? "التقنية الفعلية مُثبَتة من خلال عمليات مهمة ناجحة في بيئة تشغيلية. أعلى مستوى من النضج." : "Actual technology proven through successful mission operations in an operational environment. Highest level of maturity.",
      criteria: [isAr ? "منتج تجاري ناجح" : "Successful Commercial Product", isAr ? "مبيعات فعلية" : "Actual Sales", isAr ? "توسع في السوق" : "Market Expansion"],
      color: "from-violet-600 to-violet-700",
      badgeColor: "bg-violet-600/20 text-violet-400 border-violet-600/30",
      stage: isAr ? "نجاح تجاري" : "Commercially Successful",
      fundingRange: "IPO / Acquisition",
      globalEligible: true,
      icon: "🏆",
    },
  ];

  const calculateTRL = () => {
    const weightedScore = assessmentQuestions.reduce((sum, q) => {
      return sum + (assessmentAnswers[q.id] ? q.weight : 0);
    }, 0);
    const maxScore = assessmentQuestions.reduce((sum, q) => sum + q.weight, 0);
    const percentage = weightedScore / maxScore;
    
    if (percentage < 0.15) return 1;
    if (percentage < 0.25) return 2;
    if (percentage < 0.35) return 3;
    if (percentage < 0.45) return 4;
    if (percentage < 0.55) return 5;
    if (percentage < 0.65) return 6;
    if (percentage < 0.75) return 7;
    if (percentage < 0.9) return 8;
    return 9;
  };

  const handleAssess = () => {
    const result = calculateTRL();
    setSelectedTRL(result);
    setShowResult(true);
  };

  const selectedLevel = trlLevels.find(l => l.level === selectedTRL);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir={isAr ? "rtl" : "ltr"}>
      <SEOHead
        title={isAr ? "تقييم مستوى النضج التقني (TRL) - نقلة 5.0" : "Technology Readiness Level (TRL) Assessment - Naqla 5.0"}
        description={isAr ? "قيّم مستوى نضج ابتكارك التقني باستخدام مقياس TRL المعتمد دولياً من NASA وESA." : "Assess your innovation's TRL using the internationally recognized NASA & ESA scale."}
        keywords={isAr ? "TRL, مستوى النضج التقني, ابتكار" : "TRL, Technology Readiness Level, Innovation"}
      />

      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {isAr ? "نقلة 5.0" : "Naqla 5.0"}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/40 gap-1.5">
              <Globe className="w-3 h-3" />
              {isAr ? "معتمد دولياً" : "Internationally Certified"}
            </Badge>
            <Link href="/naqla3">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <ArrowRight className="w-4 h-4 ml-1" />
                {isAr ? "نقلة 3" : "Naqla 3"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full mb-4">
            <FlaskConical className="w-4 h-4 text-teal-400" />
            <span className="text-teal-400 text-sm font-medium">{isAr ? "نقلة 3 - تقييم النضج التقني" : "Naqla 3 - TRL Assessment"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isAr ? "مقياس النضج التقني" : "Technology Readiness Level"}
            <span className="block text-2xl md:text-3xl bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mt-2">
              Technology Readiness Level (TRL)
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            {isAr
              ? "المقياس المعتمد دولياً من NASA وESA والاتحاد الأوروبي لتصنيف مستوى نضج الابتكارات التقنية من البحث الأساسي إلى التجاري"
              : "The internationally recognized scale from NASA, ESA and the EU for classifying the maturity level of technological innovations from basic research to commercialization."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 gap-1.5">
              <Award className="w-3 h-3" />
              {isAr ? "معتمد من NASA" : "NASA Certified"}
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 gap-1.5">
              <Award className="w-3 h-3" />
              {isAr ? "معتمد من ESA" : "ESA Certified"}
            </Badge>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 gap-1.5">
              <Globe className="w-3 h-3" />
              {isAr ? "معتمد من الاتحاد الأوروبي" : "EU Certified"}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit mx-auto">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "browse" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {isAr ? "استعراض المستويات" : "Browse Levels"}
          </button>
          <button
            onClick={() => setActiveTab("assess")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "assess" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {isAr ? "قيّم ابتكارك" : "Assess Your Innovation"}
          </button>
        </div>

        {activeTab === "browse" && (
          <>
            {/* TRL Scale Visual */}
            <div className="mb-8 bg-slate-800/30 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-white font-bold mb-4 text-center">
                {isAr ? "مقياس TRL - من البحث إلى السوق" : "TRL Scale - From Research to Market"}
              </h2>
              <div className="flex gap-1 items-end justify-center flex-wrap">
                {trlLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setSelectedTRL(level.level === selectedTRL ? null : level.level)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      selectedTRL === level.level ? "bg-slate-700 scale-105" : "hover:bg-slate-700/50"
                    }`}
                  >
                    <div
                      className={`w-8 rounded-t-sm bg-gradient-to-t ${level.color} transition-all`}
                      style={{ height: `${level.level * 12 + 20}px` }}
                    />
                    <span className="text-white font-bold text-sm">{level.level}</span>
                    <span className="text-slate-400 text-[10px] text-center max-w-[60px] leading-tight">{level.icon}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-slate-500">
                <span>{isAr ? "← بحث أساسي" : "← Basic Research"}</span>
                <span>{isAr ? "تجاري ناجح →" : "Successful Commercialization →"}</span>
              </div>
            </div>

            {/* TRL Cards */}
            <div className="space-y-3">
              {trlLevels.map((level) => (
                <Card
                  key={level.level}
                  className={`border transition-all ${
                    selectedTRL === level.level
                      ? "bg-slate-700/60 border-blue-500/50"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <CardContent className="p-0">
                    <button
                      className="w-full p-5 text-right"
                      onClick={() => setExpandedLevel(expandedLevel === level.level ? null : level.level)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center shrink-0 text-2xl`}>
                          {level.icon}
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-white font-bold text-lg">TRL {level.level}</span>
                            <span className="text-white font-semibold">{level.title}</span>
                            <span className="text-slate-400 text-sm">{level.titleEn}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`text-xs border ${level.badgeColor}`}>
                              {level.stage}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              💰 {level.fundingRange}
                            </Badge>
                            {level.globalEligible && (
                              <Badge className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30 gap-1">
                                <Globe className="w-2.5 h-2.5" />
                                {isAr ? "مؤهل للتمويل الدولي" : "Eligible for International Funding"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-slate-400">
                          {expandedLevel === level.level ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </button>

                    {expandedLevel === level.level && (
                      <div className="px-5 pb-5 border-t border-slate-700/50 pt-4">
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{level.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isAr ? "معايير التصنيف" : "Classification Criteria"}
                            </div>
                            <ul className="space-y-1">
                              {level.criteria.map((c, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {level.globalEligible && (
                            <div className="bg-violet-900/20 rounded-xl p-4 border border-violet-500/20">
                              <div className="text-violet-300 text-xs font-medium mb-2 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                {isAr ? "مؤهل للبرامج الدولية" : "Eligible for International Programs"}
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                                {isAr
                                  ? `ابتكارك في TRL ${level.level} مؤهل للتقدم لبرامج التمويل والتسريع الدولية، بما فيها حاضنات الأعمال العالمية وصناديق رأس المال المخاطر.`
                                  : `Your TRL ${level.level} innovation is eligible for international funding programs, including global business incubators and venture capital funds.`}
                              </p>
                              <Link href="/naqla3">
                                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5">
                                  <Globe className="w-3 h-3" />
                                  {isAr ? "اعرض في نقلة 3" : "List on Naqla 3"}
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "assess" && (
          <div className="max-w-2xl mx-auto">
            {!showResult ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {isAr ? "قيّم مستوى نضج ابتكارك" : "Assess Your Innovation's Maturity"}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6">
                    {isAr
                      ? "أجب على الأسئلة التالية بصدق للحصول على تقييم دقيق لمستوى TRL الخاص بك"
                      : "Answer the following questions honestly for an accurate TRL assessment."}
                  </p>
                  
                  <div className="space-y-4">
                    {assessmentQuestions.map((q) => (
                      <div key={q.id} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{q.question}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: true }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              assessmentAnswers[q.id] === true
                                ? "bg-green-600 text-white"
                                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                            }`}
                          >
                            {isAr ? "نعم" : "Yes"}
                          </button>
                          <button
                            onClick={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: false }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              assessmentAnswers[q.id] === false
                                ? "bg-red-600 text-white"
                                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                            }`}
                          >
                            {isAr ? "لا" : "No"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleAssess}
                    disabled={Object.keys(assessmentAnswers).length < assessmentQuestions.length}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isAr ? "احسب مستوى TRL الخاص بي" : "Calculate My TRL Level"}
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                  {Object.keys(assessmentAnswers).length < assessmentQuestions.length && (
                    <p className="text-slate-500 text-xs text-center mt-2">
                      {isAr
                        ? `أجب على جميع الأسئلة (${Object.keys(assessmentAnswers).length}/${assessmentQuestions.length})`
                        : `Answer all questions (${Object.keys(assessmentAnswers).length}/${assessmentQuestions.length})`}
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : selectedLevel && (
              <div className="space-y-6">
                <Card className={`bg-gradient-to-br ${selectedLevel.color} border-0`}>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{selectedLevel.icon}</div>
                    <div className="text-white/80 text-sm mb-2">
                      {isAr ? "مستوى نضج ابتكارك" : "Your Innovation's Maturity Level"}
                    </div>
                    <div className="text-7xl font-black text-white mb-2">TRL {selectedLevel.level}</div>
                    <div className="text-white text-2xl font-bold mb-1">{selectedLevel.title}</div>
                    <div className="text-white/70 text-lg">{selectedLevel.titleEn}</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <h3 className="text-white font-bold mb-3">
                      {isAr ? "ماذا يعني هذا؟" : "What does this mean?"}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selectedLevel.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">
                          {isAr ? "مرحلتك الحالية" : "Your Current Stage"}
                        </div>
                        <div className="text-white font-bold">{selectedLevel.stage}</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">
                          {isAr ? "نطاق التمويل المناسب" : "Suitable Funding Range"}
                        </div>
                        <div className="text-white font-bold">{selectedLevel.fundingRange}</div>
                      </div>
                    </div>

                    {selectedLevel.globalEligible ? (
                      <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-500/30 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-violet-400" />
                          <span className="text-violet-300 font-semibold text-sm">
                            {isAr ? "مؤهل للتمويل الدولي!" : "Eligible for International Funding!"}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed mb-3">
                          {isAr
                            ? `ابتكارك في TRL ${selectedLevel.level} مؤهل للتقدم لبرامج التمويل الدولية وحاضنات الأعمال العالمية وصناديق رأس المال المخاطر.`
                            : `Your TRL ${selectedLevel.level} innovation is eligible for international funding programs, global incubators, and venture capital funds.`}
                        </p>
                        <Link href="/naqla3">
                          <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                            <Globe className="w-4 h-4" />
                            {isAr ? "اعرض ابتكارك في نقلة 3" : "List Your Innovation on Naqla 3"}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 font-semibold text-sm">
                            {isAr ? "تحتاج مزيداً من التطوير" : "Needs Further Development"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {isAr
                            ? "ابتكارك في مرحلة مبكرة. ركز على إثبات المفهوم وبناء نموذج أولي للوصول إلى TRL 4+ والتأهل للتمويل الدولي."
                            : "Your innovation is in an early stage. Focus on proof of concept and building a prototype to reach TRL 4+ and qualify for international funding."}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => { setShowResult(false); setAssessmentAnswers({}); }}
                      >
                        {isAr ? "إعادة التقييم" : "Reassess"}
                      </Button>
                      <Link href="/naqla3">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                          <TrendingUp className="w-4 h-4" />
                          {isAr ? "اعرض ابتكارك في نقلة 3" : "List on Naqla 3"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-teal-900/40 to-blue-900/40 rounded-2xl p-8 text-center border border-teal-800/40">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {isAr ? "هل ابتكارك في TRL 4 أو أعلى؟" : "Is your innovation TRL 4 or higher?"}
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto text-sm">
            {isAr
              ? "اعرض ابتكارك في سوق نقلة 3 للملكية الفكرية وتواصل مع المستثمرين والشركات الباحثة عن حلول تقنية متقدمة"
              : "List your innovation on Naqla 3's IP marketplace and connect with investors and companies looking for advanced tech solutions."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/naqla3">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                <Rocket className="w-4 h-4" />
                {isAr ? "اعرض ابتكارك في نقلة 3" : "List Your Innovation on Naqla 3"}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-violet-600 text-violet-300 hover:bg-violet-900/30 gap-2">
                <Globe className="w-4 h-4" />
                {isAr ? "سجّل ابتكارك في نقلة" : "Register Your Innovation"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
