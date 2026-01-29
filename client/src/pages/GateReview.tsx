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

export default function GateReview() {
  const [selectedInnovation, setSelectedInnovation] = useState<number | null>(null);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"continue" | "park" | "kill" | null>(null);
  const [rationale, setRationale] = useState("");

  // Mock data
  const innovations = [
    {
      id: 1,
      title: "منصة التعليم الذكية",
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
        { level: "high", description: "معدل التحويل أقل من المتوقع (15% vs 20% مستهدف)" },
        { level: "medium", description: "تكلفة اكتساب العميل أعلى من المتوقع" },
      ],
      learnings: [
        "الطلاب يفضلون المحتوى المرئي على النصي",
        "السعر ليس العائق الأساسي، بل جودة المحتوى",
        "المعلمون يحتاجون لتدريب أولي بسيط",
      ],
      recommendation: "continue" as const,
      recommendationReason:
        "على الرغم من أن معدل التحويل أقل من المستهدف، إلا أن مستوى التفاعل عالٍ جداً (72%) والدروس المستفادة قيّمة. يُنصح بالاستمرار مع تعديل استراتيجية التسعير.",
    },
    {
      id: 2,
      title: "نظام إدارة المخزون الذكي",
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
        { level: "high", description: "الطلب في السوق أقل من المتوقع (45% vs 70% مستهدف)" },
        { level: "high", description: "الميزة التنافسية ضعيفة مقارنة بالحلول الموجودة" },
        { level: "medium", description: "التكامل مع الأنظمة الحالية معقد" },
      ],
      learnings: [
        "الشركات الصغيرة لا تعتبر إدارة المخزون أولوية",
        "التكامل مع أنظمة المحاسبة ليس ضرورياً كما كنا نعتقد",
        "السوق المستهدف يجب أن يكون الشركات المتوسطة، ليس الصغيرة",
      ],
      recommendation: "park" as const,
      recommendationReason:
        "الطلب في السوق المستهدف (الشركات الصغيرة) أقل بكثير من المتوقع، والميزة التنافسية ضعيفة. يُنصح بإيقاف المشروع مؤقتاً وإعادة تقييم السوق المستهدف.",
    },
    {
      id: 3,
      title: "تطبيق الصحة الوقائية",
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
        { level: "low", description: "معدل إكمال البيانات أقل قليلاً من المستهدف (65% vs 80%)" },
      ],
      learnings: [
        "المستخدمون يثقون في النظام إذا كانت الشفافية واضحة",
        "التوصيات المخصصة تزيد معدل الاحتفاظ بشكل كبير",
        "الخصوصية ليست عائقاً إذا كانت القيمة واضحة",
      ],
      recommendation: "continue" as const,
      recommendationReason:
        "جميع المؤشرات إيجابية جداً، خاصة معدل التفاعل (85%) والاحتفاظ (78%). الفرضيات الرئيسية تم التحقق منها. يُنصح بالانتقال إلى مرحلة Prototyping.",
    },
    {
      id: 4,
      title: "منصة التجارة الإلكترونية B2B",
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
        { level: "critical", description: "4 من 6 فرضيات رئيسية تم دحضها" },
        { level: "critical", description: "الطلب في السوق ضعيف جداً (25%)" },
        { level: "high", description: "لا توجد ميزة تنافسية واضحة" },
        { level: "high", description: "نموذج الربحية غير مستدام" },
      ],
      learnings: [
        "الشركات B2B تفضل العلاقات المباشرة على المنصات",
        "تكلفة اكتساب العميل عالية جداً ($5000+)",
        "المنافسون الحاليون يقدمون خدمات مجانية",
        "الحاجة للمنصة غير موجودة في السوق المحلي",
      ],
      recommendation: "kill" as const,
      recommendationReason:
        "المشروع فشل في إثبات جدواه. 4 من 6 فرضيات رئيسية تم دحضها، والطلب في السوق ضعيف جداً. استمرار المشروع سيهدر موارد كبيرة دون عائد متوقع. يُنصح بإيقاف المشروع نهائياً.",
    },
  ];

  const selectedInnovationData = innovations.find((i) => i.id === selectedInnovation);

  const stats = {
    total: innovations.length,
    active: innovations.filter((i) => i.status === "active").length,
    parked: innovations.filter((i) => i.status === "parked").length,
    killed: innovations.filter((i) => i.status === "killed").length,
    totalResources: innovations.reduce((sum, i) => sum + i.resourcesConsumed, 0),
  };

  const handleDecision = (type: "continue" | "park" | "kill") => {
    setDecisionType(type);
    setIsDecisionDialogOpen(true);
  };

  const handleSubmitDecision = () => {
    if (!rationale) {
      toast.error("الرجاء توضيح سبب القرار");
      return;
    }

    const decisionLabels = {
      continue: "الاستمرار",
      park: "الإيقاف المؤقت",
      kill: "الإيقاف النهائي",
    };

    toast.success(`تم تسجيل قرار ${decisionLabels[decisionType!]} بنجاح`);

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
        return "حرج";
      case "high":
        return "عالي";
      case "medium":
        return "متوسط";
      case "low":
        return "منخفض";
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
        return "الاستمرار";
      case "park":
        return "إيقاف مؤقت";
      case "kill":
        return "إيقاف نهائي";
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
            مراجعة البوابات (Gate Review)
          </h1>
          <p className="text-gray-600 mt-2">
            اتخذ قرارات حاسمة: الاستمرار، الإيقاف المؤقت، أو الإيقاف النهائي
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المشاريع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">نشط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">موقوف مؤقتاً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.parked}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">موقوف نهائياً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.killed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الموارد</CardTitle>
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
                المشاريع للمراجعة
              </CardTitle>
              <CardDescription>اختر مشروعاً لعرض التفاصيل واتخاذ القرار</CardDescription>
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
                        الموارد: {(innovation.resourcesConsumed / 1000).toFixed(0)}K ريال
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
                <h3 className="text-lg font-semibold text-gray-700 mb-2">اختر مشروعاً</h3>
                <p className="text-gray-500">
                  اختر مشروعاً من القائمة لعرض التفاصيل واتخاذ قرار البوابة
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
                            توصية: {getRecommendationLabel(selectedInnovationData.recommendation)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="summary">ملخص</TabsTrigger>
                      <TabsTrigger value="validation">التحقق</TabsTrigger>
                      <TabsTrigger value="risks">المخاطر</TabsTrigger>
                      <TabsTrigger value="decision">القرار</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">تاريخ البدء</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold">
                              {new Date(selectedInnovationData.startDate).toLocaleDateString("ar-SA")}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">الموارد المستهلكة</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold flex items-center gap-1">
                              <DollarSign className="h-5 w-5" />
                              {selectedInnovationData.resourcesConsumed.toLocaleString()} ريال
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">المؤشرات الرئيسية</CardTitle>
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
                            الدروس المستفادة
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
                            <CardTitle className="text-sm text-gray-600">الفرضيات</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>الإجمالي</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.total}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-green-600">
                                <span>تم التحقق</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.validated}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-red-600">
                                <span>تم الدحض</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.invalidated}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-blue-600">
                                <span>قيد الاختبار</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.hypotheses.testing}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600">اختبارات RAT</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>الإجمالي</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.rats.total}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-green-600">
                                <span>مكتملة</span>
                                <span className="font-semibold">
                                  {selectedInnovationData.rats.completed}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-orange-600">
                                <span>متبقية</span>
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
                          <p className="text-gray-600">لا توجد مخاطر محددة</p>
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
                            التوصية: {getRecommendationLabel(selectedInnovationData.recommendation)}
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
                          الاستمرار
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50"
                          onClick={() => handleDecision("park")}
                        >
                          <Pause className="h-4 w-4 ml-2" />
                          إيقاف مؤقت
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-red-600 text-red-700 hover:bg-red-50"
                          onClick={() => handleDecision("kill")}
                        >
                          <XCircle className="h-4 w-4 ml-2" />
                          إيقاف نهائي
                        </Button>
                      </div>

                      <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              تأكيد القرار:{" "}
                              {decisionType && getRecommendationLabel(decisionType)}
                            </DialogTitle>
                            <DialogDescription>
                              الرجاء توضيح سبب هذا القرار. سيتم توثيق هذا القرار في سجل المشروع.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="rationale">سبب القرار *</Label>
                              <Textarea
                                id="rationale"
                                placeholder="اشرح بالتفصيل لماذا اتخذت هذا القرار..."
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
                              إلغاء
                            </Button>
                            <Button onClick={handleSubmitDecision}>تأكيد القرار</Button>
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
