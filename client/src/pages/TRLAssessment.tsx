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

const trlLevels = [
  {
    level: 1,
    title: "مبادئ أساسية",
    titleEn: "Basic Principles",
    description: "تم رصد المبادئ العلمية الأساسية وإعداد التقارير حولها. أدنى مستوى من النضج التقني.",
    criteria: ["بحث نظري بحت", "لا يوجد نموذج أولي", "نتائج أولية منشورة"],
    color: "from-slate-600 to-slate-700",
    badgeColor: "bg-slate-600/20 text-slate-400 border-slate-600/30",
    stage: "بحث أساسي",
    fundingRange: "منح بحثية",
    qstpEligible: false,
    icon: "🔬",
  },
  {
    level: 2,
    title: "مفهوم التقنية",
    titleEn: "Technology Concept",
    description: "تمت صياغة مفهوم التطبيق التقني. لا يزال المفهوم تخمينياً ولا يوجد دليل تجريبي.",
    criteria: ["تحديد التطبيق المحتمل", "دراسة الجدوى النظرية", "لا يوجد نموذج مادي"],
    color: "from-red-700 to-red-800",
    badgeColor: "bg-red-700/20 text-red-400 border-red-700/30",
    stage: "بحث تطبيقي",
    fundingRange: "منح بحثية",
    qstpEligible: false,
    icon: "💡",
  },
  {
    level: 3,
    title: "إثبات المفهوم",
    titleEn: "Proof of Concept",
    description: "تم إجراء أبحاث وظيفية تجريبية وإثبات المفهوم. التحقق التحليلي والمعملي للتنبؤات الحرجة.",
    criteria: ["تجارب معملية أولية", "إثبات المفهوم نظرياً", "تحليل الجدوى التقنية"],
    color: "from-orange-600 to-orange-700",
    badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    stage: "تطوير مبكر",
    fundingRange: "تمويل بذري",
    qstpEligible: false,
    icon: "⚗️",
  },
  {
    level: 4,
    title: "التحقق في المختبر",
    titleEn: "Lab Validation",
    description: "تم التحقق من المكونات التقنية في بيئة مختبرية. تكامل المكونات الأساسية لإثبات الجدوى.",
    criteria: ["نموذج أولي منخفض الدقة", "اختبارات مختبرية", "تكامل المكونات الأساسية"],
    color: "from-yellow-600 to-yellow-700",
    badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    stage: "نموذج أولي",
    fundingRange: "تمويل بذري - Series A",
    qstpEligible: true,
    icon: "🧪",
  },
  {
    level: 5,
    title: "التحقق في بيئة ذات صلة",
    titleEn: "Relevant Environment Validation",
    description: "تم التحقق من التقنية في بيئة ذات صلة (محاكاة). دقة عالية للنموذج الأولي.",
    criteria: ["نموذج أولي عالي الدقة", "اختبار في بيئة محاكاة", "تكامل النظام الكامل"],
    color: "from-lime-600 to-lime-700",
    badgeColor: "bg-lime-600/20 text-lime-400 border-lime-600/30",
    stage: "تطوير متقدم",
    fundingRange: "Series A",
    qstpEligible: true,
    icon: "🔧",
  },
  {
    level: 6,
    title: "التجريب في بيئة حقيقية",
    titleEn: "Relevant Environment Demo",
    description: "تم تجريب نموذج أولي للنظام في بيئة ذات صلة. تجريب في بيئة تشغيلية محاكاة.",
    criteria: ["نموذج أولي كامل", "اختبار ميداني محدود", "تقييم الأداء الأولي"],
    color: "from-green-600 to-green-700",
    badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
    stage: "تجريب ميداني",
    fundingRange: "Series A - B",
    qstpEligible: true,
    icon: "🌍",
  },
  {
    level: 7,
    title: "نموذج في بيئة تشغيلية",
    titleEn: "Operational Environment Demo",
    description: "تم تجريب النموذج الأولي في بيئة تشغيلية حقيقية. يمثل قفزة كبيرة من TRL 6.",
    criteria: ["اختبار في بيئة حقيقية", "أداء مثبت ميدانياً", "جاهز للتجريب التجاري"],
    color: "from-teal-600 to-teal-700",
    badgeColor: "bg-teal-600/20 text-teal-400 border-teal-600/30",
    stage: "جاهز للسوق",
    fundingRange: "Series B - C",
    qstpEligible: true,
    icon: "🚀",
  },
  {
    level: 8,
    title: "النظام مكتمل ومؤهل",
    titleEn: "System Complete & Qualified",
    description: "اكتمل النظام وتأهل من خلال الاختبارات والتجريب. في معظم الحالات، يمثل نهاية التطوير الحقيقي.",
    criteria: ["نظام مكتمل ومختبر", "شهادات الجودة", "جاهز للإنتاج"],
    color: "from-blue-600 to-blue-700",
    badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    stage: "ما قبل الإطلاق",
    fundingRange: "Series C+",
    qstpEligible: true,
    icon: "✅",
  },
  {
    level: 9,
    title: "النظام مثبت في بيئة تشغيلية",
    titleEn: "Actual System Proven",
    description: "التقنية الفعلية مثبتة من خلال التشغيل الناجح في بيئة تشغيلية. أعلى مستوى من النضج.",
    criteria: ["منتج تجاري ناجح", "مبيعات فعلية", "توسع في السوق"],
    color: "from-violet-600 to-violet-700",
    badgeColor: "bg-violet-600/20 text-violet-400 border-violet-600/30",
    stage: "تجاري ناجح",
    fundingRange: "IPO / استحواذ",
    qstpEligible: true,
    icon: "🏆",
  },
];

const assessmentQuestions = [
  { id: 1, question: "هل لديك دليل تجريبي على أن مفهوم تقنيتك يعمل؟", weight: 1 },
  { id: 2, question: "هل أجريت اختبارات في بيئة مختبرية خاضعة للرقابة؟", weight: 1 },
  { id: 3, question: "هل لديك نموذج أولي (Prototype) يعمل؟", weight: 2 },
  { id: 4, question: "هل اختبرت تقنيتك في بيئة مشابهة للتطبيق الفعلي؟", weight: 2 },
  { id: 5, question: "هل حصلت على بيانات أداء من بيئة تشغيلية حقيقية؟", weight: 2 },
  { id: 6, question: "هل اكتمل تطوير النظام وحصل على شهادات الجودة؟", weight: 1 },
  { id: 7, question: "هل لديك مبيعات أو عملاء فعليون يستخدمون التقنية؟", weight: 1 },
];

export default function TRLAssessment() {
  const [selectedTRL, setSelectedTRL] = useState<number | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "assess">("browse");

  const calculateTRL = () => {
    const yesCount = Object.values(assessmentAnswers).filter(Boolean).length;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      <SEOHead
        title="تقييم مستوى النضج التقني (TRL) - نقلة 5.0"
        description="قيّم مستوى نضج ابتكارك التقني باستخدام مقياس TRL المعتمد دولياً من NASA وESA وQSTP. اعرف مكانك في رحلة الابتكار من البحث الأساسي إلى التجاري."
        keywords="TRL, مستوى النضج التقني, ابتكار, QSTP, براءة اختراع, تقنية"
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
                نقلة 5.0
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <a href="https://qstp.qa" target="_blank" rel="noopener noreferrer">
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/40 gap-1.5">
                <Globe className="w-3 h-3" />
                معتمد QSTP
              </Badge>
            </a>
            <Link href="/naqla3">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <ArrowRight className="w-4 h-4 ml-1" />
                نقلة 3
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
            <span className="text-teal-400 text-sm font-medium">نقلة 3 - تقييم النضج التقني</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            مقياس النضج التقني
            <span className="block text-2xl md:text-3xl bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mt-2">
              Technology Readiness Level (TRL)
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            المقياس المعتمد دولياً من NASA وESA وواحة قطر للعلوم والتكنولوجيا (QSTP) لتصنيف مستوى نضج الابتكارات التقنية من البحث الأساسي إلى التجاري
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 gap-1.5">
              <Award className="w-3 h-3" />
              معتمد من NASA
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 gap-1.5">
              <Award className="w-3 h-3" />
              معتمد من ESA
            </Badge>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 gap-1.5">
              <Globe className="w-3 h-3" />
              معتمد من QSTP
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit mx-auto">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "browse"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            استعراض المستويات
          </button>
          <button
            onClick={() => setActiveTab("assess")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "assess"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            قيّم ابتكارك
          </button>
        </div>

        {activeTab === "browse" && (
          <>
            {/* TRL Scale Visual */}
            <div className="mb-8 bg-slate-800/30 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-white font-bold mb-4 text-center">مقياس TRL - من البحث إلى السوق</h2>
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
              <div className="flex justify-between mt-3 text-xs text-slate-500">
                <span>← بحث أساسي</span>
                <span>تجاري ناجح →</span>
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
                            {level.qstpEligible && (
                              <Badge className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30 gap-1">
                                <Globe className="w-2.5 h-2.5" />
                                مؤهل QSTP
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
                              معايير التصنيف
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
                          {level.qstpEligible && (
                            <div className="bg-violet-900/20 rounded-xl p-4 border border-violet-500/20">
                              <div className="text-violet-300 text-xs font-medium mb-2 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                مؤهل لبرامج QSTP
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                                ابتكارك في TRL {level.level} مؤهل للتقدم لبرامج واحة قطر للعلوم والتكنولوجيا، بما فيها حاضنة الأعمال وبرنامج The 300 وصندوق التمويل بـ 30M$.
                              </p>
                              <a href="https://qstp.qa/ar/programs/incubate/" target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1.5">
                                  <Globe className="w-3 h-3" />
                                  التقدم لـ QSTP
                                </Button>
                              </a>
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
                  <h2 className="text-xl font-bold text-white mb-2">قيّم مستوى نضج ابتكارك</h2>
                  <p className="text-slate-400 text-sm mb-6">أجب على الأسئلة التالية بصدق للحصول على تقييم دقيق لمستوى TRL الخاص بك</p>
                  
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
                            نعم
                          </button>
                          <button
                            onClick={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: false }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              assessmentAnswers[q.id] === false
                                ? "bg-red-600 text-white"
                                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                            }`}
                          >
                            لا
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
                    احسب مستوى TRL الخاص بي
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                  {Object.keys(assessmentAnswers).length < assessmentQuestions.length && (
                    <p className="text-slate-500 text-xs text-center mt-2">
                      أجب على جميع الأسئلة ({Object.keys(assessmentAnswers).length}/{assessmentQuestions.length})
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : selectedLevel && (
              <div className="space-y-6">
                <Card className={`bg-gradient-to-br ${selectedLevel.color} border-0`}>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{selectedLevel.icon}</div>
                    <div className="text-white/80 text-sm mb-2">مستوى نضج ابتكارك</div>
                    <div className="text-7xl font-black text-white mb-2">TRL {selectedLevel.level}</div>
                    <div className="text-white text-2xl font-bold mb-1">{selectedLevel.title}</div>
                    <div className="text-white/70 text-lg">{selectedLevel.titleEn}</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <h3 className="text-white font-bold mb-3">ماذا يعني هذا؟</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selectedLevel.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">مرحلتك الحالية</div>
                        <div className="text-white font-bold">{selectedLevel.stage}</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">نطاق التمويل المناسب</div>
                        <div className="text-white font-bold">{selectedLevel.fundingRange}</div>
                      </div>
                    </div>

                    {selectedLevel.qstpEligible ? (
                      <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-500/30 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-violet-400" />
                          <span className="text-violet-300 font-semibold text-sm">مؤهل لبرامج QSTP!</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed mb-3">
                          ابتكارك في TRL {selectedLevel.level} مؤهل للتقدم لبرامج واحة قطر للعلوم والتكنولوجيا، بما فيها حاضنة الأعمال وبرنامج The 300 وصندوق التمويل بـ 30 مليون دولار.
                        </p>
                        <a href="https://qstp.qa/ar/programs/" target="_blank" rel="noopener noreferrer">
                          <Button className="bg-violet-600 hover:bg-violet-700 text-white text-sm gap-2">
                            <Globe className="w-4 h-4" />
                            التقدم لبرامج QSTP الآن
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 font-semibold text-sm">تحتاج مزيداً من التطوير</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          ابتكارك في مرحلة مبكرة. ركز على إثبات المفهوم وبناء نموذج أولي للوصول إلى TRL 4+ والتأهل لبرامج QSTP.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => { setShowResult(false); setAssessmentAnswers({}); }}
                      >
                        إعادة التقييم
                      </Button>
                      <Link href="/naqla3">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                          <TrendingUp className="w-4 h-4" />
                          اعرض ابتكارك في نقلة 3
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
          <h2 className="text-2xl font-bold text-white mb-3">هل ابتكارك في TRL 4 أو أعلى؟</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto text-sm">
            اعرض ابتكارك في سوق نقلة 3 للملكية الفكرية وتواصل مع المستثمرين والشركات الباحثة عن حلول تقنية متقدمة
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/naqla3">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                <Rocket className="w-4 h-4" />
                اعرض ابتكارك في نقلة 3
              </Button>
            </Link>
            <a href="https://qstp.qa/ar/programs/incubate/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-violet-600 text-violet-300 hover:bg-violet-900/30 gap-2">
                <Globe className="w-4 h-4" />
                برنامج حاضنة QSTP
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
