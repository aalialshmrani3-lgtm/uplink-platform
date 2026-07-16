import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Clock, TrendingUp, FileText, Calendar, DollarSign, Users, Beaker, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RATTesting() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [selectedHypothesis, setSelectedHypothesis] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("plan");

  // Test form state
  const [testData, setTestData] = useState({
    testName: "",
    testDescription: "",
    plannedDate: "",
    budget: "",
    resources: "",
    methodology: "",
  });

  // Result form state
  const [resultData, setResultData] = useState({
    result: "",
    learnings: "",
    outcome: "pending" as "supports" | "rejects" | "inconclusive" | "pending",
    nextSteps: "",
  });

  // Mock data
  const hypotheses = [
    {
      id: 1,
      innovationTitle: "Smart Education Platform",
      statement: "Students willing to pay 50 SAR/month for personalized content",
      ratScore: 9.0,
      status: "testing" as const,
      tests: [
        {
          id: 1,
          testName: "Landing Page + Free Trial",
          status: "in_progress" as const,
          plannedDate: "2026-01-25",
          completedDate: null,
          budget: 5000,
          progress: 65,
          result: "15 out of 100 users subscribed after trial (15%)",
          learnings: "Price not main barrier, content quality is",
        },
      ],
    },
    {
      id: 2,
      innovationTitle: "Smart Education Platform",
      statement: "Teachers will use AI tools to create content",
      ratScore: 6.5,
      status: "validated" as const,
      tests: [
        {
          id: 2,
          testName: "Wizard of Oz - Human Support",
          status: "completed" as const,
          plannedDate: "2026-01-18",
          completedDate: "2026-01-24",
          budget: 3000,
          progress: 100,
          result: "72% of teachers actively used tools",
          learnings: "Teachers need simple initial training (30 min)",
        },
      ],
    },
    {
      id: 3,
      innovationTitle: "Smart Inventory Management System",
      statement: "Small businesses will pay $200/month for advanced inventory system",
      ratScore: 7.5,
      status: "pending" as const,
      tests: [],
    },
    {
      id: 5,
      innovationTitle: "Preventative Health App",
      statement: "Users will share health data for personalized recommendations",
      ratScore: 9.0,
      status: "testing" as const,
      tests: [
        {
          id: 3,
          testName: "Concierge - Manual Recommendations",
          status: "in_progress" as const,
          plannedDate: "2026-01-23",
          completedDate: null,
          budget: 2000,
          progress: 45,
          result: "65 out of 100 users completed health profile",
          learnings: "Data usage transparency increases trust",
        },
      ],
    },
  ];

  const selectedHypothesisData = hypotheses.find((h) => h.id === selectedHypothesis);

  const stats = {
    totalTests: hypotheses.reduce((sum, h) => sum + h.tests.length, 0),
    planned: hypotheses.filter((h) => h.tests.length === 0).length,
    inProgress: hypotheses.reduce(
      (sum, h) => sum + h.tests.filter((t) => t.status === "in_progress").length,
      0
    ),
    completed: hypotheses.reduce(
      (sum, h) => sum + h.tests.filter((t) => t.status === "completed").length,
      0
    ),
    totalBudget: hypotheses.reduce(
      (sum, h) => sum + h.tests.reduce((tSum, t) => tSum + t.budget, 0),
      0
    ),
  };

  const handleCreateTest = () => {
    if (!testData.testName || !testData.plannedDate) {
      toast.error(isAr ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    toast.success(isAr ? "تم إنشاء خطة الاختبار بنجاح" : "Test plan created successfully");

    setTestData({
      testName: "",
      testDescription: "",
      plannedDate: "",
      budget: "",
      resources: "",
      methodology: "",
    });
    setActiveTab("results");
  };

  const handleSubmitResults = () => {
    if (!resultData.result) {
      toast.error(isAr ? "الرجاء إدخال نتائج الاختبار" : "Please enter test results");
      return;
    }

    toast.success(isAr ? "تم تسجيل نتائج الاختبار بنجاح" : "Test results recorded successfully");

    setResultData({
      result: "",
      learnings: "",
      outcome: "pending",
      nextSteps: "",
    });
  };

  const getRATColor = (score: number) => {
    if (score >= 7) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "planned":
        return <Calendar className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return isAr ? "مكتمل" : "Completed";
      case "in_progress":
        return isAr ? "قيد التنفيذ" : "In Progress";
      case "planned":
        return isAr ? "مخطط" : "Planned";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "planned":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {isAr ? "اختبار الافتراضات الخطرة (RAT Testing)" : "Riskiest Assumption Test (RAT Testing)"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAr ? "اختبر الافتراضات الأكثر خطورة أولاً لتقليل المخاطر وتوفير الموارد" : "Test riskiest assumptions first to reduce risk and save resources"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي الاختبارات" : "Total Tests"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalTests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "مخطط لها" : "Planned"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{stats.planned}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "قيد التنفيذ" : "In Progress"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "مكتملة" : "Completed"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي الميزانية" : "Total Budget"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {(stats.totalBudget / 1000).toFixed(0)}K
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Hypotheses List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                {isAr ? "الفرضيات حسب الأولوية" : "Assumptions by Priority"}
              </CardTitle>
              <CardDescription>{isAr ? "مرتبة حسب درجة RAT (الأعلى أولاً)" : "Sorted by RAT Score (Highest First)"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hypotheses
                  .sort((a, b) => b.ratScore - a.ratScore)
                  .map((hypothesis) => (
                    <Card
                      key={hypothesis.id}
                      className={`cursor-pointer transition-all ${
                        selectedHypothesis === hypothesis.id
                          ? "ring-2 ring-orange-500 shadow-md"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedHypothesis(hypothesis.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Badge variant="outline" className="text-xs mb-2">
                              {hypothesis.innovationTitle}
                            </Badge>
                            <div className="text-sm font-medium line-clamp-2">
                              {hypothesis.statement}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <Badge className={getRATColor(hypothesis.ratScore)}>
                            RAT: {hypothesis.ratScore.toFixed(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {hypothesis.tests.length} {isAr ? "اختبار" : "Test"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Right: Test Details */}
          <Card className="lg:col-span-2">
            {!selectedHypothesisData ? (
              <CardContent className="py-12 text-center">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{isAr ? "اختر فرضية" : "Select Hypothesis"}</h3>
                <p className="text-gray-500">{isAr ? "اختر فرضية من القائمة لعرض التفاصيل وإدارة الاختبارات" : "Select a hypothesis from the list to view details and manage tests."}</p>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        {selectedHypothesisData.innovationTitle}
                      </Badge>
                      <CardTitle className="text-xl">{selectedHypothesisData.statement}</CardTitle>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={getRATColor(selectedHypothesisData.ratScore)}>
                          RAT Score: {selectedHypothesisData.ratScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="plan">{isAr ? "خطة الاختبار" : "Test Plan"}</TabsTrigger>
                      <TabsTrigger value="progress">{isAr ? "التقدم" : "Progress"}</TabsTrigger>
                      <TabsTrigger value="results">{isAr ? "النتائج" : "Results"}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="plan" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="testName">{isAr ? "اسم الاختبار *" : "Test Name *"}</Label>
                          <Input
                            id="testName"
                            placeholder={isAr ? "مثال: Landing Page + تجربة مجانية" : "Example: Landing Page + Free Trial"}
                            value={testData.testName}
                            onChange={(e) => setTestData({ ...testData, testName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="testDescription">{isAr ? "وصف الاختبار" : "Test Description"}</Label>
                          <Textarea
                            id="testDescription"
                            placeholder={isAr ? "صف كيف ستختبر هذه الفرضية..." : "Describe how you will test this hypothesis..."}
                            rows={4}
                            value={testData.testDescription}
                            onChange={(e) =>
                              setTestData({ ...testData, testDescription: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="plannedDate">{isAr ? "تاريخ البدء المخطط *" : "Planned Start Date *"}</Label>
                            <Input
                              id="plannedDate"
                              type="date"
                              value={testData.plannedDate}
                              onChange={(e) =>
                                setTestData({ ...testData, plannedDate: e.target.value })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="budget">{isAr ? "الميزانية (ريال)" : "Budget (SAR)"}</Label>
                            <Input
                              id="budget"
                              type="number"
                              placeholder="5000"
                              value={testData.budget}
                              onChange={(e) => setTestData({ ...testData, budget: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="resources">{isAr ? "الموارد المطلوبة" : "Resources Required"}</Label>
                          <Textarea
                            id="resources"
                            placeholder={isAr ? "مثال: مصمم UI، مطور frontend، 100 مستخدم تجريبي" : "Example: UI Designer, Frontend Dev, 100 Beta Users"}
                            rows={3}
                            value={testData.resources}
                            onChange={(e) => setTestData({ ...testData, resources: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="methodology">{isAr ? "المنهجية والخطوات" : "Methodology & Steps"}</Label>
                          <Textarea
                            id="methodology"
                            placeholder={isAr ? "1. إنشاء landing page\n2. إطلاق حملة إعلانية\n3. قياس معدل التحويل" : "1. Create landing page\n2. Launch ad campaign\n3. Measure conversion rate"}
                            rows={5}
                            value={testData.methodology}
                            onChange={(e) =>
                              setTestData({ ...testData, methodology: e.target.value })
                            }
                          />
                        </div>

                        <Button onClick={handleCreateTest} className="w-full">
                          <Beaker className="h-4 w-4 ml-2" />
                          {isAr ? "إنشاء خطة الاختبار" : "Create Test Plan"}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-4 mt-4">
                      {selectedHypothesisData.tests.length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">{isAr ? "لا توجد اختبارات بعد" : "No tests yet"}</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setActiveTab("plan")}
                          >
                            {isAr ? "إنشاء خطة اختبار" : "Create Test Plan"}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedHypothesisData.tests.map((test) => (
                            <Card key={test.id}>
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{test.testName}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className={getStatusColor(test.status)}>
                                        {getStatusIcon(test.status)}
                                        <span className="mr-1">{getStatusLabel(test.status)}</span>
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <div className="text-gray-600 mb-1">{isAr ? "تاريخ البدء" : "Start Date"}</div>
                                      <div className="font-medium">
                                        {new Date(test.plannedDate).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                                      </div>
                                    </div>
                                    {test.completedDate && (
                                      <div>
                                        <div className="text-gray-600 mb-1">{isAr ? "تاريخ الإكمال" : "Completion Date"}</div>
                                        <div className="font-medium">
                                          {new Date(test.completedDate).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                                        </div>
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-gray-600 mb-1">{isAr ? "الميزانية" : "Budget"}</div>
                                      <div className="font-medium flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        {test.budget.toLocaleString()} {isAr ? "ريال" : "SAR"}
                                      </div>
                                    </div>
                                  </div>

                                  {test.status !== "completed" && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{isAr ? "التقدم" : "Progress"}</span>
                                        <span className="font-medium">{test.progress}%</span>
                                      </div>
                                      <Progress value={test.progress} className="h-2" />
                                    </div>
                                  )}

                                  {test.result && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                      <div className="text-sm font-medium text-blue-900 mb-1">
                                        {isAr ? "النتيجة الحالية" : "Current Outcome"}
                                      </div>
                                      <div className="text-sm text-blue-700">{test.result}</div>
                                    </div>
                                  )}

                                  {test.learnings && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                      <div className="text-sm font-medium text-green-900 mb-1">
                                        {isAr ? "الدروس المستفادة" : "Lessons Learned"}
                                      </div>
                                      <div className="text-sm text-green-700">{test.learnings}</div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="results" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="result">{isAr ? "نتائج الاختبار *" : "Test Results *"}</Label>
                          <Textarea
                            id="result"
                            placeholder={isAr ? "صف النتائج بالتفصيل مع الأرقام والبيانات..." : "Describe results in detail with numbers and data..."}
                            rows={5}
                            value={resultData.result}
                            onChange={(e) => setResultData({ ...resultData, result: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="outcome">{isAr ? "الخلاصة" : "Conclusion"}</Label>
                          <Select
                            value={resultData.outcome}
                            onValueChange={(value: "supports" | "rejects" | "inconclusive" | "pending") =>
                              setResultData({ ...resultData, outcome: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{isAr ? "معلق" : "Pending"}</SelectItem>
                              <SelectItem value="supports">{isAr ? "يدعم الفرضية ✅" : "Supports Hypothesis ✅"}</SelectItem>
                              <SelectItem value="rejects">{isAr ? "يدحض الفرضية ❌" : "Refutes Hypothesis ❌"}</SelectItem>
                              <SelectItem value="inconclusive">{isAr ? "غير حاسم 🤔" : "Inconclusive 🤔"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="learnings">{isAr ? "الدروس المستفادة" : "Lessons Learned"}</Label>
                          <Textarea
                            id="learnings"
                            placeholder={isAr ? "ما الذي تعلمته من هذا الاختبار؟" : "What did you learn from this test?"}
                            rows={4}
                            value={resultData.learnings}
                            onChange={(e) =>
                              setResultData({ ...resultData, learnings: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nextSteps">{isAr ? "الخطوات التالية" : "Next Steps"}</Label>
                          <Textarea
                            id="nextSteps"
                            placeholder={isAr ? "ما هي الخطوات التالية بناءً على هذه النتائج؟" : "What are the next steps based on these results?"}
                            rows={4}
                            value={resultData.nextSteps}
                            onChange={(e) =>
                              setResultData({ ...resultData, nextSteps: e.target.value })
                            }
                          />
                        </div>

                        <Button onClick={handleSubmitResults} className="w-full">
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                          {isAr ? "تسجيل النتائج" : "Record Results"}
                        </Button>
                      </div>
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