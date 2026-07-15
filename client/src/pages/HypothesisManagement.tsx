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
import { useLanguage } from "@/contexts/LanguageContext";

export default function HypothesisManagement() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
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
      innovationTitle: isAr ? "منصة التعليم الذكية" : "Smart Learning Platform",
      statement: isAr ? "الطلاب مستعدون لدفع 50 ريال شهرياً مقابل محتوى تعليمي مخصص" : "Students are willing to pay 50 SAR monthly for personalized educational content",
      assumption: isAr ? "الطلاب يقدّرون التخصيص أكثر من السعر المنخفض" : "Students value personalization more than low price",
      metric: isAr ? "معدل التحويل من تجربة مجانية إلى اشتراك مدفوع" : "Conversion rate from free trial to paid subscription",
      successCriterion: isAr ? "20% من المستخدمين يشتركون بعد التجربة المجانية" : "20% of users subscribe after the free trial",
      testMethod: isAr ? "Landing page + تجربة مجانية 7 أيام" : "Landing page + 7-day free trial",
      riskLevel: "high" as const,
      uncertaintyLevel: "high" as const,
      impactIfWrong: "critical" as const,
      ratScore: 9.0,
      status: "testing" as const,
      testResult: isAr ? "جاري الاختبار - 45% من الهدف حالياً" : "Testing in progress - 45% of target currently",
      evidence: isAr ? "15 من 100 مستخدم اشتركوا بعد التجربة" : "15 out of 100 users subscribed after the trial",
      createdAt: "2026-01-20",
    },
    {
      id: 2,
      innovationId: 1,
      innovationTitle: isAr ? "منصة التعليم الذكية" : "Smart Learning Platform",
      statement: isAr ? "المعلمون سيستخدمون أدوات AI لإنشاء المحتوى" : "Teachers will use AI tools to create content",
      assumption: isAr ? "المعلمون يثقون في AI ولديهم المهارات لاستخدامه" : "Teachers trust AI and have the skills to use it",
      metric: isAr ? "نسبة المعلمين النشطين في استخدام أدوات AI" : "Percentage of active teachers using AI tools",
      successCriterion: isAr ? "60% من المعلمين يستخدمون الأدوات أسبوعياً" : "60% of teachers use the tools weekly",
      testMethod: isAr ? "Wizard of Oz - دعم بشري خلف الكواليس" : "Wizard of Oz - human support behind the scenes",
      riskLevel: "medium" as const,
      uncertaintyLevel: "high" as const,
      impactIfWrong: "major" as const,
      ratScore: 6.5,
      status: "validated" as const,
      testResult: isAr ? "تم التحقق - 72% من المعلمين استخدموا الأدوات" : "Validated - 72% of teachers used the tools",
      evidence: isAr ? "مقابلات مع 25 معلم + بيانات استخدام" : "Interviews with 25 teachers + usage data",
      createdAt: "2026-01-18",
    },
    {
      id: 3,
      innovationId: 2,
      innovationTitle: isAr ? "نظام إدارة المخزون الذكي" : "Smart Inventory Management System",
      statement: isAr ? "الشركات الصغيرة ستدفع $200/شهر لنظام إدارة مخزون متقدم" : "Small businesses will pay $200/month for an advanced inventory management system",
      assumption: isAr ? "الشركات الصغيرة تعاني من مشاكل مخزون تكلفها أكثر من $200/شهر" : "Small businesses suffer from inventory problems costing them more than $200/month",
      metric: isAr ? "عدد الاشتراكات المدفوعة" : "Number of paid subscriptions",
      successCriterion: isAr ? "50 شركة تشترك في أول 3 أشهر" : "50 companies subscribe in the first 3 months",
      testMethod: isAr ? "MVP + حملة إعلانية مستهدفة" : "MVP + targeted advertising campaign",
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
      innovationTitle: isAr ? "نظام إدارة المخزون الذكي" : "Smart Inventory Management System",
      statement: isAr ? "التكامل مع أنظمة المحاسبة الحالية ضروري للتبني" : "Integration with existing accounting systems is essential for adoption",
      assumption: isAr ? "الشركات لن تغير أنظمة المحاسبة الخاصة بها" : "Companies will not change their accounting systems",
      metric: isAr ? "نسبة العملاء الذين يطلبون التكامل" : "Percentage of customers requesting integration",
      successCriterion: isAr ? "أكثر من 70% من العملاء المحتملين يطلبون التكامل" : "More than 70% of potential customers request integration",
      testMethod: isAr ? "استبيان + مقابلات مع 30 شركة" : "Survey + interviews with 30 companies",
      riskLevel: "medium" as const,
      uncertaintyLevel: "low" as const,
      impactIfWrong: "major" as const,
      ratScore: 4.0,
      status: "invalidated" as const,
      testResult: isAr ? "تم الدحض - فقط 35% يطلبون التكامل" : "Invalidated - only 35% request integration",
      evidence: isAr ? "استبيان 50 شركة + 30 مقابلة" : "Survey of 50 companies + 30 interviews",
      createdAt: "2026-01-22",
    },
    {
      id: 5,
      innovationId: 3,
      innovationTitle: isAr ? "تطبيق الصحة الوقائية" : "Preventive Health App",
      statement: isAr ? "المستخدمون سيشاركون بياناتهم الصحية مقابل توصيات مخصصة" : "Users will share their health data for personalized recommendations",
      assumption: isAr ? "الخصوصية ليست عائقاً إذا كانت القيمة واضحة" : "Privacy is not a barrier if the value is clear",
      metric: isAr ? "نسبة المستخدمين الذين يكملون ملفهم الصحي" : "Percentage of users who complete their health profile",
      successCriterion: isAr ? "80% من المستخدمين يكملون الملف الصحي" : "80% of users complete their health profile",
      testMethod: isAr ? "Concierge - توصيات يدوية لأول 100 مستخدم" : "Concierge - manual recommendations for the first 100 users",
      riskLevel: "high" as const,
      uncertaintyLevel: "high" as const,
      impactIfWrong: "critical" as const,
      ratScore: 9.0,
      status: "testing" as const,
      testResult: isAr ? "جاري الاختبار - 65% أكملوا الملف" : "Testing in progress - 65% completed the profile",
      evidence: isAr ? "65 من 100 مستخدم أكملوا الملف الصحي" : "65 out of 100 users completed the health profile",
      createdAt: "2026-01-23",
    },
  ];

  const innovations = [
    { id: 1, title: isAr ? "منصة التعليم الذكية" : "Smart Learning Platform" },
    { id: 2, title: isAr ? "نظام إدارة المخزون الذكي" : "Smart Inventory Management System" },
    { id: 3, title: isAr ? "تطبيق الصحة الوقائية" : "Preventive Health App" },
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
      (riskMap[risk as keyof typeof riskMap] *
      uncertaintyMap[uncertainty as keyof typeof uncertaintyMap] *
      impactMap[impact as keyof typeof impactMap]) /
      3
    );
  };

  const handleCreateHypothesis = () => {
    if (!formData.statement || !formData.assumption || !formData.innovationId) {
      toast.error(isAr ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    const ratScore = calculateRATScore(
      formData.riskLevel,
      formData.uncertaintyLevel,
      formData.impactIfWrong
    );

    toast.success(isAr ? `تم إنشاء الفرضية بنجاح (RAT Score: ${ratScore.toFixed(1)})` : `Hypothesis created successfully (RAT Score: ${ratScore.toFixed(1)})`);

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
    if (score >= 7) return isAr ? "خطر عالي جداً" : "Very High Risk";
    if (score >= 4) return isAr ? "خطر متوسط" : "Medium Risk";
    return isAr ? "خطر منخفض" : "Low Risk";
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
        return isAr ? "تم التحقق ✅" : "Validated ✅";
      case "invalidated":
        return isAr ? "تم الدحض ❌" : "Invalidated ❌";
      case "testing":
        return isAr ? "قيد الاختبار 🔄" : "Testing 🔄";
      case "pending":
        return isAr ? "معلق ⏸️" : "Pending ⏸️";
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
              {isAr ? "إدارة الفرضيات واختبارات RAT" : "Hypothesis Management & RAT Testing"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAr ? "صياغة واختبار الفرضيات الحرجة لتقليل المخاطر وتسريع التعلم" : "Formulate and test critical hypotheses to reduce risk and accelerate learning"}
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-5 w-5 ml-2" />
                {isAr ? "فرضية جديدة" : "New Hypothesis"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isAr ? "إنشاء فرضية جديدة" : "Create New Hypothesis"}</DialogTitle>
                <DialogDescription>
                  {isAr ? "حدد الافتراض الذي تريد اختباره وكيف ستقيس نجاحه" : "Define the assumption you want to test and how you will measure its success"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="innovationId">{isAr ? "الابتكار المرتبط *" : "Associated Innovation *"}</Label>
                  <Select
                    value={formData.innovationId}
                    onValueChange={(value) => setFormData({ ...formData, innovationId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر الابتكار" : "Select Innovation"} />
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
                  <Label htmlFor="statement">{isAr ? "صياغة الفرضية *" : "Hypothesis Statement *"}</Label>
                  <Textarea
                    id="statement"
                    placeholder={isAr ? "مثال: العملاء مستعدون لدفع X مقابل Y" : "Example: Customers are willing to pay X for Y"}
                    rows={3}
                    value={formData.statement}
                    onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assumption">{isAr ? "الافتراض الأساسي *" : "Core Assumption *"}</Label>
                  <Textarea
                    id="assumption"
                    placeholder={isAr ? "ما الذي نفترضه ليكون صحيحاً؟" : "What do we assume to be true?"}
                    rows={3}
                    value={formData.assumption}
                    onChange={(e) => setFormData({ ...formData, assumption: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metric">{isAr ? "مقياس النجاح" : "Success Metric"}</Label>
                    <Input
                      id="metric"
                      placeholder={isAr ? "مثال: معدل التحويل" : "Example: Conversion Rate"}
                      value={formData.metric}
                      onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="successCriterion">{isAr ? "معيار النجاح" : "Success Criterion"}</Label>
                    <Input
                      id="successCriterion"
                      placeholder={isAr ? "مثال: 20% معدل تحويل" : "Example: 20% conversion rate"}
                      value={formData.successCriterion}
                      onChange={(e) => setFormData({ ...formData, successCriterion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testMethod">{isAr ? "طريقة الاختبار" : "Test Method"}</Label>
                  <Textarea
                    id="testMethod"
                    placeholder={isAr ? "كيف ستختبر هذه الفرضية؟" : "How will you test this hypothesis?"}
                    rows={3}
                    value={formData.testMethod}
                    onChange={(e) => setFormData({ ...formData, testMethod: e.target.value })}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    {isAr ? "حساب درجة RAT (Risk × Uncertainty × Impact)" : "Calculate RAT Score (Risk × Uncertainty × Impact)"}
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{isAr ? "مستوى المخاطرة" : "Risk Level"}</Label>
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
                          <SelectItem value="high">{isAr ? "عالي" : "High"}</SelectItem>
                          <SelectItem value="medium">{isAr ? "متوسط" : "Medium"}</SelectItem>
                          <SelectItem value="low">{isAr ? "منخفض" : "Low"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{isAr ? "مستوى عدم اليقين" : "Uncertainty Level"}</Label>
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
                          <SelectItem value="high">{isAr ? "عالي" : "High"}</SelectItem>
                          <SelectItem value="medium">{isAr ? "متوسط" : "Medium"}</SelectItem>
                          <SelectItem value="low">{isAr ? "منخفض" : "Low"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{isAr ? "التأثير إذا كان خاطئاً" : "Impact if Wrong"}</Label>
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
                          <SelectItem value="critical">{isAr ? "حرج" : "Critical"}</SelectItem>
                          <SelectItem value="major">{isAr ? "كبير" : "Major"}</SelectItem>
                          <SelectItem value="minor">{isAr ? "صغير" : "Minor"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-orange-900">{isAr ? "درجة RAT المحسوبة:" : "Calculated RAT Score:"}</span>
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
                        ? (isAr ? "⚠️ خطر عالي جداً - يجب اختبار هذه الفرضية فوراً" : "⚠️ Very High Risk - This hypothesis should be tested immediately")
                        : calculateRATScore(
                            formData.riskLevel,
                            formData.uncertaintyLevel,
                            formData.impactIfWrong
                          ) >= 4
                        ? (isAr ? "⚡ خطر متوسط - اختبر في المراحل المبكرة" : "⚡ Medium Risk - Test in early stages")
                        : (isAr ? "✅ خطر منخفض - يمكن اختباره لاحقاً" : "✅ Low Risk - Can be tested later")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleCreateHypothesis}>{isAr ? "إنشاء الفرضية" : "Create Hypothesis"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي الفرضيات" : "Total Hypotheses"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "معلقة" : "Pending"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "قيد الاختبار" : "Testing"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.testing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "تم التحقق" : "Validated"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.validated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "تم الدحض" : "Invalidated"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.invalidated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "متوسط RAT" : "Avg RAT Score"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.avgRATScore}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "خطر عالي" : "High Risk"}</CardTitle>
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
              <Label>{isAr ? "تصفية حسب الابتكار:" : "Filter by Innovation:"}</Label>
              <Select value={selectedInnovation} onValueChange={setSelectedInnovation}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? "جميع الابتكارات" : "All Innovations"}</SelectItem>
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
                        <strong>{isAr ? "الافتراض:" : "Assumption:"}</strong> {hypothesis.assumption}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">{isAr ? "مقياس النجاح" : "Success Metric"}</div>
                        <div className="text-sm text-gray-600">{hypothesis.metric}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">{isAr ? "معيار النجاح" : "Success Criterion"}</div>
                        <div className="text-sm text-gray-600">{hypothesis.successCriterion}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        {isAr ? "طريقة الاختبار" : "Test Method"}
                      </div>
                      <div className="text-sm text-gray-600">{hypothesis.testMethod}</div>
                    </div>

                    {hypothesis.testResult && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">{isAr ? "نتيجة الاختبار" : "Test Result"}</div>
                        <div className="text-sm text-blue-700">{hypothesis.testResult}</div>
                        {hypothesis.evidence && (
                          <div className="text-xs text-blue-600 mt-2">
                            <strong>{isAr ? "الدليل:" : "Evidence:"}</strong> {hypothesis.evidence}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-500">
                        {isAr ? "تم الإنشاء:" : "Created:"} {new Date(hypothesis.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                      </div>
                      <div className="flex gap-2">
                        {hypothesis.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <Beaker className="h-4 w-4 ml-1" />
                            {isAr ? "بدء الاختبار" : "Start Testing"}
                          </Button>
                        )}
                        {hypothesis.status === "testing" && (
                          <Button size="sm" variant="outline">
                            <TrendingUp className="h-4 w-4 ml-1" />
                            {isAr ? "تحديث النتائج" : "Update Results"}
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          {isAr ? "عرض التفاصيل" : "View Details"}
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{isAr ? "لا توجد فرضيات" : "No Hypotheses Found"}</h3>
              <p className="text-gray-500 mb-4">{isAr ? "ابدأ بإنشاء فرضيات لاختبار افتراضاتك الحرجة" : "Start by creating hypotheses to test your critical assumptions"}</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                {isAr ? "إنشاء فرضية جديدة" : "Create New Hypothesis"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}