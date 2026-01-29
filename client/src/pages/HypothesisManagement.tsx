import { useState } from "react";
import { Plus, AlertTriangle, CheckCircle2, XCircle, Clock, TrendingUp, Target, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HypothesisManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInnovation, setSelectedInnovation] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    innovationId: "",
    statement: "",
    assumption: "",
    metric: "",
    successCriterion: "",
    testMethod: "",
    riskLevel: "medium" as "high" | "medium" | "low",
    uncertaintyLevel: "medium" as "high" | "medium" | "low",
    impactIfWrong: "major" as "critical" | "major" | "minor",
  });

  // Mock data
  const hypotheses = [
    {
      id: 1,
      innovationId: 1,
      innovationTitle: "منصة التعليم الذكية",
      statement: "الطلاب مستعدون لدفع 50 ريال شهرياً مقابل محتوى تعليمي مخصص",
      assumption: "الطلاب يقدّرون التخصيص أكثر من السعر المنخفض",
      metric: "معدل التحويل من تجربة مجانية إلى اشتراك مدفوع",
      successCriterion: "20% من المستخدمين يشتركون بعد التجربة المجانية",
      testMethod: "Landing page + تجربة مجانية 7 أيام",
      riskLevel: "high" as const,
      uncertaintyLevel: "high" as const,
      impactIfWrong: "critical" as const,
      ratScore: 9.0,
      status: "testing" as const,
      testResult: "جاري الاختبار - 45% من الهدف حالياً",
      evidence: "15 من 100 مستخدم اشتركوا بعد التجربة",
      createdAt: "2026-01-20",
    },
    {
      id: 2,
      innovationId: 1,
      innovationTitle: "منصة التعليم الذكية",
      statement: "المعلمون سيستخدمون أدوات AI لإنشاء المحتوى",
      assumption: "المعلمون يثقون في AI ولديهم المهارات لاستخدامه",
      metric: "نسبة المعلمين النشطين في استخدام أدوات AI",
      successCriterion: "60% من المعلمين يستخدمون الأدوات أسبوعياً",
      testMethod: "Wizard of Oz - دعم بشري خلف الكواليس",
      riskLevel: "medium" as const,
      uncertaintyLevel: "high" as const,
      impactIfWrong: "major" as const,
      ratScore: 6.5,
      status: "validated" as const,
      testResult: "تم التحقق - 72% من المعلمين استخدموا الأدوات",
      evidence: "مقابلات مع 25 معلم + بيانات استخدام",
      createdAt: "2026-01-18",
    },
    {
      id: 3,
      innovationId: 2,
      innovationTitle: "نظام إدارة المخزون الذكي",
      statement: "الشركات الصغيرة ستدفع $200/شهر لنظام إدارة مخزون متقدم",
      assumption: "الشركات الصغيرة تعاني من مشاكل مخزون تكلفها أكثر من $200/شهر",
      metric: "عدد الاشتراكات المدفوعة",
      successCriterion: "50 شركة تشترك في أول 3 أشهر",
      testMethod: "MVP + حملة إعلانية مستهدفة",
      riskLevel: "high" as const,
      uncertaintyLevel: "medium" as const,
      impactIfWrong: "critical" as const,
      ratScore: 7.5,
      status: "pending" as const,
      testResult: "",
      evidence: "",
      createdAt: "2026-01-25",
    },
    {
      id: 4,
      innovationId: 2,
      innovationTitle: "نظام إدارة المخزون الذكي",
      statement: "التكامل مع أنظمة المحاسبة الحالية ضروري للتبني",
      assumption: "الشركات لن تغير أنظمة المحاسبة الخاصة بها",
      metric: "نسبة العملاء الذين يطلبون التكامل",
      successCriterion: "أكثر من 70% من العملاء المحتملين يطلبون التكامل",
      testMethod: "استبيان + مقابلات مع 30 شركة",
      riskLevel: "medium" as const,
      uncertaintyLevel: "low" as const,
      impactIfWrong: "major" as const,
      ratScore: 4.0,
      status: "invalidated" as const,
      testResult: "تم الدحض - فقط 35% يطلبون التكامل",
      evidence: "استبيان 50 شركة + 30 مقابلة",
      createdAt: "2026-01-22",
    },
    {
      id: 5,
      innovationId: 3,
      innovationTitle: "تطبيق الصحة الوقائية",
      statement: "المستخدمون سيشاركون بياناتهم الصحية مقابل توصيات مخصصة",
      assumption: "الخصوصية ليست عائقاً إذا كانت القيمة واضحة",
      metric: "نسبة المستخدمين الذين يكملون ملفهم الصحي",
      successCriterion: "80% من المستخدمين يكملون الملف الصحي",
      testMethod: "Concierge - توصيات يدوية لأول 100 مستخدم",
      riskLevel: "high" as const,
      uncertaintyLevel: "high" as const,
      impactIfWrong: "critical" as const,
      ratScore: 9.0,
      status: "testing" as const,
      testResult: "جاري الاختبار - 65% أكملوا الملف",
      evidence: "65 من 100 مستخدم أكملوا الملف الصحي",
      createdAt: "2026-01-23",
    },
  ];

  const innovations = [
    { id: 1, title: "منصة التعليم الذكية" },
    { id: 2, title: "نظام إدارة المخزون الذكي" },
    { id: 3, title: "تطبيق الصحة الوقائية" },
  ];

  const filteredHypotheses =
    selectedInnovation === "all"
      ? hypotheses
      : hypotheses.filter((h) => h.innovationId.toString() === selectedInnovation);

  const stats = {
    total: hypotheses.length,
    pending: hypotheses.filter((h) => h.status === "pending").length,
    testing: hypotheses.filter((h) => h.status === "testing").length,
    validated: hypotheses.filter((h) => h.status === "validated").length,
    invalidated: hypotheses.filter((h) => h.status === "invalidated").length,
    avgRATScore: (hypotheses.reduce((sum, h) => sum + h.ratScore, 0) / hypotheses.length).toFixed(1),
    highRisk: hypotheses.filter((h) => h.ratScore >= 7).length,
  };

  const calculateRATScore = (
    risk: string,
    uncertainty: string,
    impact: string
  ): number => {
    const riskMap = { high: 3, medium: 2, low: 1 };
    const uncertaintyMap = { high: 3, medium: 2, low: 1 };
    const impactMap = { critical: 3, major: 2, minor: 1 };

    return (
      riskMap[risk as keyof typeof riskMap] *
      uncertaintyMap[uncertainty as keyof typeof uncertaintyMap] *
      impactMap[impact as keyof typeof impactMap] /
      3
    );
  };

  const handleCreateHypothesis = () => {
    if (!formData.statement || !formData.assumption || !formData.innovationId) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    const ratScore = calculateRATScore(
      formData.riskLevel,
      formData.uncertaintyLevel,
      formData.impactIfWrong
    );

    toast.success(`تم إنشاء الفرضية بنجاح (RAT Score: ${ratScore.toFixed(1)})`);

    setFormData({
      innovationId: "",
      statement: "",
      assumption: "",
      metric: "",
      successCriterion: "",
      testMethod: "",
      riskLevel: "medium",
      uncertaintyLevel: "medium",
      impactIfWrong: "major",
    });
    setIsCreateDialogOpen(false);
  };

  const getRATColor = (score: number) => {
    if (score >= 7) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getRATLabel = (score: number) => {
    if (score >= 7) return "خطر عالي جداً";
    if (score >= 4) return "خطر متوسط";
    return "خطر منخفض";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "invalidated":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "testing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Target className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "validated":
        return "تم التحقق ✅";
      case "invalidated":
        return "تم الدحض ❌";
      case "testing":
        return "قيد الاختبار 🔄";
      case "pending":
        return "معلق ⏸️";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-700 border-green-300";
      case "invalidated":
        return "bg-red-100 text-red-700 border-red-300";
      case "testing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              إدارة الفرضيات واختبارات RAT
            </h1>
            <p className="text-gray-600 mt-2">
              صياغة واختبار الفرضيات الحرجة لتقليل المخاطر وتسريع التعلم
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-5 w-5 ml-2" />
                فرضية جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء فرضية جديدة</DialogTitle>
                <DialogDescription>
                  حدد الافتراض الذي تريد اختباره وكيف ستقيس نجاحه
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="innovationId">الابتكار المرتبط *</Label>
                  <Select
                    value={formData.innovationId}
                    onValueChange={(value) => setFormData({ ...formData, innovationId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الابتكار" />
                    </SelectTrigger>
                    <SelectContent>
                      {innovations.map((innovation) => (
                        <SelectItem key={innovation.id} value={innovation.id.toString()}>
                          {innovation.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statement">صياغة الفرضية *</Label>
                  <Textarea
                    id="statement"
                    placeholder="مثال: العملاء مستعدون لدفع X مقابل Y"
                    rows={3}
                    value={formData.statement}
                    onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assumption">الافتراض الأساسي *</Label>
                  <Textarea
                    id="assumption"
                    placeholder="ما الذي نفترضه ليكون صحيحاً؟"
                    rows={3}
                    value={formData.assumption}
                    onChange={(e) => setFormData({ ...formData, assumption: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metric">مقياس النجاح</Label>
                    <Input
                      id="metric"
                      placeholder="مثال: معدل التحويل"
                      value={formData.metric}
                      onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="successCriterion">معيار النجاح</Label>
                    <Input
                      id="successCriterion"
                      placeholder="مثال: 20% معدل تحويل"
                      value={formData.successCriterion}
                      onChange={(e) => setFormData({ ...formData, successCriterion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testMethod">طريقة الاختبار</Label>
                  <Textarea
                    id="testMethod"
                    placeholder="كيف ستختبر هذه الفرضية؟"
                    rows={3}
                    value={formData.testMethod}
                    onChange={(e) => setFormData({ ...formData, testMethod: e.target.value })}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    حساب درجة RAT (Risk × Uncertainty × Impact)
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>مستوى المخاطرة</Label>
                      <Select
                        value={formData.riskLevel}
                        onValueChange={(value: "high" | "medium" | "low") =>
                          setFormData({ ...formData, riskLevel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">عالي</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="low">منخفض</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>مستوى عدم اليقين</Label>
                      <Select
                        value={formData.uncertaintyLevel}
                        onValueChange={(value: "high" | "medium" | "low") =>
                          setFormData({ ...formData, uncertaintyLevel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">عالي</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="low">منخفض</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>التأثير إذا كان خاطئاً</Label>
                      <Select
                        value={formData.impactIfWrong}
                        onValueChange={(value: "critical" | "major" | "minor") =>
                          setFormData({ ...formData, impactIfWrong: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">حرج</SelectItem>
                          <SelectItem value="major">كبير</SelectItem>
                          <SelectItem value="minor">صغير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-orange-900">درجة RAT المحسوبة:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {calculateRATScore(
                          formData.riskLevel,
                          formData.uncertaintyLevel,
                          formData.impactIfWrong
                        ).toFixed(1)}
                        /9
                      </span>
                    </div>
                    <p className="text-sm text-orange-700 mt-2">
                      {calculateRATScore(
                        formData.riskLevel,
                        formData.uncertaintyLevel,
                        formData.impactIfWrong
                      ) >= 7
                        ? "⚠️ خطر عالي جداً - يجب اختبار هذه الفرضية فوراً"
                        : calculateRATScore(
                            formData.riskLevel,
                            formData.uncertaintyLevel,
                            formData.impactIfWrong
                          ) >= 4
                        ? "⚡ خطر متوسط - اختبر في المراحل المبكرة"
                        : "✅ خطر منخفض - يمكن اختباره لاحقاً"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateHypothesis}>إنشاء الفرضية</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الفرضيات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">معلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">قيد الاختبار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.testing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">تم التحقق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.validated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">تم الدحض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.invalidated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">متوسط RAT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.avgRATScore}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">خطر عالي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label>تصفية حسب الابتكار:</Label>
              <Select value={selectedInnovation} onValueChange={setSelectedInnovation}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الابتكارات</SelectItem>
                  {innovations.map((innovation) => (
                    <SelectItem key={innovation.id} value={innovation.id.toString()}>
                      {innovation.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Hypotheses List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredHypotheses
            .sort((a, b) => b.ratScore - a.ratScore)
            .map((hypothesis) => (
              <Card
                key={hypothesis.id}
                className="hover:shadow-lg transition-shadow border-r-4"
                style={{
                  borderRightColor:
                    hypothesis.ratScore >= 7
                      ? "#dc2626"
                      : hypothesis.ratScore >= 4
                      ? "#eab308"
                      : "#22c55e",
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {hypothesis.innovationTitle}
                        </Badge>
                        <Badge className={getRATColor(hypothesis.ratScore)}>
                          RAT: {hypothesis.ratScore.toFixed(1)} - {getRATLabel(hypothesis.ratScore)}
                        </Badge>
                        <Badge className={getStatusColor(hypothesis.status)}>
                          {getStatusIcon(hypothesis.status)}
                          <span className="mr-1">{getStatusLabel(hypothesis.status)}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{hypothesis.statement}</CardTitle>
                      <CardDescription className="text-base">
                        <strong>الافتراض:</strong> {hypothesis.assumption}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">مقياس النجاح</div>
                        <div className="text-sm text-gray-600">{hypothesis.metric}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">معيار النجاح</div>
                        <div className="text-sm text-gray-600">{hypothesis.successCriterion}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        طريقة الاختبار
                      </div>
                      <div className="text-sm text-gray-600">{hypothesis.testMethod}</div>
                    </div>

                    {hypothesis.testResult && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">نتيجة الاختبار</div>
                        <div className="text-sm text-blue-700">{hypothesis.testResult}</div>
                        {hypothesis.evidence && (
                          <div className="text-xs text-blue-600 mt-2">
                            <strong>الدليل:</strong> {hypothesis.evidence}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-500">
                        تم الإنشاء: {new Date(hypothesis.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex gap-2">
                        {hypothesis.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <Beaker className="h-4 w-4 ml-1" />
                            بدء الاختبار
                          </Button>
                        )}
                        {hypothesis.status === "testing" && (
                          <Button size="sm" variant="outline">
                            <TrendingUp className="h-4 w-4 ml-1" />
                            تحديث النتائج
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {filteredHypotheses.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد فرضيات</h3>
              <p className="text-gray-500 mb-4">ابدأ بإنشاء فرضيات لاختبار افتراضاتك الحرجة</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إنشاء فرضية جديدة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
