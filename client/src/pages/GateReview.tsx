import { useState } from "react";
import {
  Play,
  Pause,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  FileText,
  Users,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GateReview() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const [selectedInnovation, setSelectedInnovation] = useState<number | null>(null);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"continue" | "park" | "kill" | null>(null);
  const [rationale, setRationale] = useState("");

  // Mock data
  const innovations = [
    {
      id: 1,
      title: isAr ? "منصة التعليم الذكية" : "Smart Education Platform",
      stage: "Validation",
      status: "active" as const,
      startDate: "2026-01-15",
      resourcesConsumed: 45000,
      hypotheses: {
        total: 5,
        validated: 2,
        invalidated: 1,
        testing: 2,
      },
      rats: {
        total: 8,
        completed: 5,
        remaining: 3,
      },
      keyMetrics: {
        userEngagement: 72,
        conversionRate: 15,
        customerSatisfaction: 8.5,
      },
      risks: [
        { level: "high", description: isAr ? "معدل التحويل أقل من المتوقع (15% vs 20% مستهدف)" : "Conversion rate below target (15% vs 20% target)" },
        { level: "medium", description: isAr ? "تكلفة اكتساب العميل أعلى من المتوقع" : "Customer acquisition cost higher than expected" },
      ],
      learnings: isAr ? [
        "الطلاب يفضلون المحتوى المرئي على النصي",
        "السعر ليس العائق الأساسي، بل جودة المحتوى",
        "المعلمون يحتاجون لتدريب أولي بسيط",
      ] : [
        "Students prefer visual content over text",
        "Price is not the main barrier, content quality is",
        "Teachers need simple initial training",
      ],
      recommendation: "continue" as const,
      recommendationReason: isAr
        ? "على الرغم من أن معدل التحويل أقل من المستهدف، إلا أن مستوى التفاعل عالٍ جداً (72%) والدروس المستفادة قيّمة. يُنصح بالاستمرار مع تعديل استراتيجية التسعير."
        : "Although conversion rate is below target, engagement level is very high (72%) and learnings are valuable. Recommended to continue with pricing strategy adjustment.",
    },
    {
      id: 2,
      title: isAr ? "نظام إدارة المخزون الذكي" : "Smart Inventory Management System",
      stage: "Ideation",
      status: "active" as const,
      startDate: "2026-01-10",
      resourcesConsumed: 15000,
      hypotheses: {
        total: 3,
        validated: 0,
        invalidated: 1,
        testing: 2,
      },
      rats: {
        total: 4,
        completed: 1,
        remaining: 3,
      },
      keyMetrics: {
        marketDemand: 45,
        competitiveAdvantage: 30,
        technicalFeasibility: 65,
      },
      risks: [
        { level: "high", description: isAr ? "الطلب في السوق أقل من المتوقع (45% vs 70% مستهدف)" : "Market demand below target (45% vs 70% target)" },
        { level: "high", description: isAr ? "الميزة التنافسية ضعيفة مقارنة بالحلول الموجودة" : "Competitive advantage weak compared to existing solutions" },
        { level: "medium", description: isAr ? "التكامل مع الأنظمة الحالية معقد" : "Integration with existing systems is complex" },
      ],
      learnings: isAr ? [
        "الشركات الصغيرة لا تعتبر إدارة المخزون أولوية",
        "التكامل مع أنظمة المحاسبة ليس ضرورياً كما كنا نعتقد",
        "السوق المستهدف يجب أن يكون الشركات المتوسطة، ليس الصغيرة",
      ] : [
        "Small businesses don't prioritize inventory management",
        "Integration with accounting systems is not as necessary as we thought",
        "Target market should be medium businesses, not small ones",
      ],
      recommendation: "park" as const,
      recommendationReason: isAr
        ? "الطلب في السوق المستهدف (الشركات الصغيرة) أقل بكثير من المتوقع، والميزة التنافسية ضعيفة. يُنصح بإيقاف المشروع مؤقتاً وإعادة تقييم السوق المستهدف."
        : "Demand in target market (small businesses) is much lower than expected, and competitive advantage is weak. Recommended to park the project and re-evaluate target market.",
    },
    {
      id: 3,
      title: isAr ? "تطبيق الصحة الوقائية" : "Preventive Health App",
      stage: "Validation",
      status: "active" as const,
      startDate: "2026-01-20",
      resourcesConsumed: 32000,
      hypotheses: {
        total: 4,
        validated: 3,
        invalidated: 0,
        testing: 1,
      },
      rats: {
        total: 6,
        completed: 5,
        remaining: 1,
      },
      keyMetrics: {
        userEngagement: 85,
        dataCompletionRate: 65,
        retentionRate: 78,
      },
      risks: [
        { level: "low", description: isAr ? "معدل إكمال البيانات أقل قليلاً من المستهدف (65% vs 80%)" : "Data completion rate slightly below target (65% vs 80%)" },
      ],
      learnings: isAr ? [
        "المستخدمون يثقون في النظام إذا كانت الشفافية واضحة",
        "التوصيات المخصصة تزيد معدل الاحتفاظ بشكل كبير",
        "الخصوصية ليست عائقاً إذا كانت القيمة واضحة",
      ] : [
        "Users trust the system when transparency is clear",
        "Personalized recommendations significantly increase retention rate",
        "Privacy is not a barrier when value is clear",
      ],
      recommendation: "continue" as const,
      recommendationReason: isAr
        ? "جميع المؤشرات إيجابية جداً، خاصة معدل التفاعل (85%) والاحتفاظ (78%). الفرضيات الرئيسية تم التحقق منها. يُنصح بالانتقال إلى مرحلة Prototyping."
        : "All indicators are very positive, especially engagement rate (85%) and retention (78%). Main hypotheses have been validated. Recommended to move to Prototyping stage.",
    },
    {
      id: 4,
      title: isAr ? "منصة التجارة الإلكترونية B2B" : "B2B E-commerce Platform",
      stage: "Ideation",
      status: "active" as const,
      startDate: "2025-12-15",
      resourcesConsumed: 55000,
      hypotheses: {
        total: 6,
        validated: 1,
        invalidated: 4,
        testing: 1,
      },
      rats: {
        total: 10,
        completed: 9,
        remaining: 1,
      },
      keyMetrics: {
        marketDemand: 25,
        competitiveAdvantage: 15,
        profitability: 10,
      },
      risks: [
        { level: "critical", description: isAr ? "4 من 6 فرضيات رئيسية تم دحضها" : "4 of 6 main hypotheses were invalidated" },
        { level: "critical", description: isAr ? "الطلب في السوق ضعيف جداً (25%)" : "Market demand is very weak (25%)" },
        { level: "high", description: isAr ? "لا توجد ميزة تنافسية واضحة" : "No clear competitive advantage" },
        { level: "high", description: isAr ? "نموذج الربحية غير مستدام" : "Profitability model is unsustainable" },
      ],
      learnings: isAr ? [
        "الشركات B2B تفضل العلاقات المباشرة على المنصات",
        "تكلفة اكتساب العميل عالية جداً ($5000+)",
        "المنافسون الحاليون يقدمون خدمات مجانية",
        "الحاجة للمنصة غير موجودة في السوق المحلي",
      ] : [
        "B2B companies prefer direct relationships over platforms",
        "Customer acquisition cost is very high ($5000+)",
        "Current competitors offer free services",
        "Need for the platform doesn't exist in local market",
      ],
      recommendation: "kill" as const,
      recommendationReason: isAr
        ? "المشروع فشل في إثبات جدواه. 4 من 6 فرضيات رئيسية تم دحضها، والطلب في السوق ضعيف جداً. استمرار المشروع سيهدر موارد كبيرة دون عائد متوقع. يُنصح بإيقاف المشروع نهائياً."
        : "The project failed to prove its viability. 4 of 6 main hypotheses were invalidated, and market demand is very weak. Continuing the project will waste significant resources with no expected return. Recommended to terminate the project.",
    },
  ];

  const selectedInnovationData = innovations.find((i) => i.id === selectedInnovation);

  const stats = {
    total: innovations.length,
    active: innovations.filter((i) => i.status === "active").length,
    parked: innovations.filter((i) => i.recommendation === "park").length,
    killed: innovations.filter((i) => i.recommendation === "kill").length,
    totalResources: innovations.reduce((sum, i) => sum + i.resourcesConsumed, 0),
  };

  const handleDecision = (type: "continue" | "park" | "kill") => {
    setDecisionType(type);
    setIsDecisionDialogOpen(true);
  };

  const handleSubmitDecision = () => {
    if (!rationale) {
      toast.error(isAr ? "الرجاء توضيح سبب القرار" : "Please provide a rationale for the decision");
      return;
    }

    const decisionLabels = {
      continue: isAr ? "الاستمرار" : "Continue",
      park: isAr ? "الإيقاف المؤقت" : "Park",
      kill: isAr ? "الإيقاف النهائي" : "Kill",
    };

    toast.success(isAr ? `تم تسجيل قرار ${decisionLabels[decisionType!]} بنجاح` : `Decision to ${decisionLabels[decisionType!]} recorded successfully`);

    setRationale("");
    setIsDecisionDialogOpen(false);
    setDecisionType(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "critical":
        return isAr ? "حرج" : "Critical";
      case "high":
        return isAr ? "عالي" : "High";
      case "medium":
        return isAr ? "متوسط" : "Medium";
      case "low":
        return isAr ? "منخفض" : "Low";
      default:
        return level;
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case "continue":
        return <Play className="h-5 w-5 text-green-600" />;
      case "park":
        return <Pause className="h-5 w-5 text-yellow-600" />;
      case "kill":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "continue":
        return "bg-green-100 text-green-700 border-green-300";
      case "park":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "kill":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "";
    }
  };

  const getRecommendationLabel = (rec: string) => {
    switch (rec) {
      case "continue":
        return isAr ? "الاستمرار" : "Continue";
      case "park":
        return isAr ? "إيقاف مؤقت" : "Park";
      case "kill":
        return isAr ? "إيقاف نهائي" : "Kill";
      default:
        return rec;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {isAr ? "مراجعة البوابات (Gate Review)" : "Gate Review"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAr ? "اتخذ قرارات حاسمة: الاستمرار، الإيقاف المؤقت، أو الإيقاف النهائي" : "Make critical decisions: Continue, Park, or Kill"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي المشاريع" : "Total Projects"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "نشط" : "Active"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "موقوف مؤقتاً" : "Parked"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.parked}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "موقوف نهائياً" : "Killed"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.killed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي الموارد" : "Total Resources"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {(stats.totalResources / 1000).toFixed(0)}K
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Innovations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                {isAr ? "المشاريع للمراجعة" : "Projects for Review"}
              </CardTitle>
              <CardDescription>{isAr ? "اختر مشروعاً لعرض التفاصيل واتخاذ القرار" : "Select a project to view details and make a decision"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {innovations.map((innovation) => (
                  <Card
                    key={innovation.id}
                    className={`cursor-pointer transition-all ${
                      selectedInnovation === innovation.id
                        ? "ring-2 ring-green-500 shadow-md"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedInnovation(innovation.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-2">{innovation.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {innovation.stage}
                            </Badge>
                            <Badge className={getRecommendationColor(innovation.recommendation)}>
                              {getRecommendationIcon(innovation.recommendation)}
                              <span className="mr-1">
                                {getRecommendationLabel(innovation.recommendation)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500">
                        {isAr ? "الموارد:" : "Resources:"} {(innovation.resourcesConsumed / 1000).toFixed(0)}K {isAr ? "ريال" : "SAR"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right: Innovation Details */}
          <Card className="lg:col-span-2">
            {!selectedInnovationData ? (
              <CardContent className="py-12 text-center">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{isAr ? "اختر مشروعاً" : "Select a Project"}</h3>
                <p className="text-gray-500">
                  {isAr ? "اختر مشروعاً من القائمة لعرض التفاصيل واتخاذ قرار البوابة" : "Select a project from the list to view details and make a gate decision"}
                </p>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{selectedInnovationData.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{selectedInnovationData.stage}</Badge>
                        <Badge className={getRecommendationColor(selectedInnovationData.recommendation)}>
                          {getRecommendationIcon(selectedInnovationData.recommendation)}
                          <span className="mr-1">
                            {isAr ? "توصية:" : "Recommendation:"} {getRecommendationLabel(selectedInnovationData.recommendation)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="summary">{isAr ? "ملخص" : "Summary"}</TabsTrigger>
                      <TabsTrigger value="validation">{isAr ? "التحقق" : "Validation"}</TabsTrigger>
                      <TabsTrigger value="risks">{isAr ? "المخاطر" : "Risks"}</TabsTrigger>
                      <TabsTrigger value="decision">{isAr ? "القرار" : "Decision"}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">{isAr ? "تاريخ البدء" : "Start Date"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold">
                              {new Date(selectedInnovationData.startDate).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">{isAr ? "الموارد المستهلكة" : "Resources Consumed"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold flex items-center gap-1">
                              <DollarSign className="h-5 w-5" />
                              {selectedInnovationData.resourcesConsumed.toLocaleString()} {isAr ? "ريال" : "SAR"}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{isAr ? "المؤشرات الرئيسية" : "Key Metrics"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(selectedInnovationData.keyMetrics).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-sm font-semibold">{value}%</span>
                              </div>
                              <Progress value={value} className="h-2" />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                            <Lightbulb className="h-5 w-5" />
                            {isAr ? "الدروس المستفادة" : "Learnings"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedInnovationData.learnings.map((learning, idx) => (
                              <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{learning}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="validation" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">{isAr ? "الفرضيات" : "Hypotheses"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{isAr ? "الإجمالي" : "Total"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.total}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-green-600">
                                <span>{isAr ? "تم التحقق" : "Validated"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.validated}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-red-600">
                                <span>{isAr ? "تم الدحض" : "Invalidated"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.invalidated}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-blue-600">
                                <span>{isAr ? "قيد الاختبار" : "Testing"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.testing}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">{isAr ? "اختبارات RAT" : "RAT Tests"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{isAr ? "الإجمالي" : "Total"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.rats.total}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-green-600">
                                <span>{isAr ? "مكتملة" : "Completed"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.rats.completed}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-orange-600">
                                <span>{isAr ? "متبقية" : "Remaining"}</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.rats.remaining}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Progress
                                value={
                                  (selectedInnovationData.rats.completed /
                                    selectedInnovationData.rats.total) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="risks" className="space-y-4 mt-4">
                      {selectedInnovationData.risks.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <p className="text-gray-600">{isAr ? "لا توجد مخاطر محددة" : "No identified risks"}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedInnovationData.risks.map((risk, idx) => (
                            <Card key={idx} className={getRiskColor(risk.level)}>
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">
                                        {getRiskLabel(risk.level)}
                                      </Badge>
                                    </div>
                                    <div className="text-sm">{risk.description}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="decision" className="space-y-4 mt-4">
                      <Card className={getRecommendationColor(selectedInnovationData.recommendation)}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            {getRecommendationIcon(selectedInnovationData.recommendation)}
                            {isAr ? "التوصية:" : "Recommendation:"} {getRecommendationLabel(selectedInnovationData.recommendation)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedInnovationData.recommendationReason}</p>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleDecision("continue")}
                        >
                          <Play className="h-4 w-4 ml-2" />
                          {isAr ? "الاستمرار" : "Continue"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50"
                          onClick={() => handleDecision("park")}
                        >
                          <Pause className="h-4 w-4 ml-2" />
                          {isAr ? "إيقاف مؤقت" : "Park"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-red-600 text-red-700 hover:bg-red-50"
                          onClick={() => handleDecision("kill")}
                        >
                          <XCircle className="h-4 w-4 ml-2" />
                          {isAr ? "إيقاف نهائي" : "Kill"}
                        </Button>
                      </div>

                      <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {isAr ? "تأكيد القرار:" : "Confirm Decision:"}{" "}
                              {decisionType && getRecommendationLabel(decisionType)}
                            </DialogTitle>
                            <DialogDescription>
                              {isAr ? "الرجاء توضيح سبب هذا القرار. سيتم توثيق هذا القرار في سجل المشروع." : "Please explain the rationale for this decision. This decision will be documented in the project log."}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="rationale">{isAr ? "سبب القرار *" : "Decision Rationale *"}</Label>
                              <Textarea
                                id="rationale"
                                placeholder={isAr ? "اشرح بالتفصيل لماذا اتخذت هذا القرار..." : "Explain in detail why you made this decision..."}
                                rows={6}
                                value={rationale}
                                onChange={(e) => setRationale(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setIsDecisionDialogOpen(false)}
                            >
                              {isAr ? "إلغاء" : "Cancel"}
                            </Button>
                            <Button onClick={handleSubmitDecision}>{isAr ? "تأكيد القرار" : "Confirm Decision"}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}