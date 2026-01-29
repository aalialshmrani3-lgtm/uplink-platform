import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  ThumbsUp,
  ThumbsDown,
  Star,
  TrendingUp,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Sparkles,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LearningKnowledgeBase() {
  const [activeTab, setActiveTab] = useState("log");
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [isAddKnowledgeOpen, setIsAddKnowledgeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Learning Log form
  const [logData, setLogData] = useState({
    innovationId: "",
    stage: "",
    learningType: "success" as "success" | "failure" | "insight" | "risk",
    title: "",
    description: "",
    impact: "medium" as "high" | "medium" | "low",
    actionable: "",
  });

  // Knowledge Base form
  const [knowledgeData, setKnowledgeData] = useState({
    category: "",
    title: "",
    description: "",
    bestPractice: "",
    pitfalls: "",
    resources: "",
    tags: "",
  });

  // Mock data
  const learningLogs = [
    {
      id: 1,
      innovationTitle: "منصة التعليم الذكية",
      stage: "Validation",
      learningType: "success" as const,
      title: "المحتوى المرئي يزيد التفاعل بنسبة 40%",
      description:
        "اكتشفنا أن الطلاب يفضلون المحتوى المرئي (فيديوهات، رسوم متحركة) على المحتوى النصي. بعد إضافة 50 فيديو تعليمي، ارتفع معدل التفاعل من 45% إلى 72%.",
      impact: "high" as const,
      actionable: "إعطاء أولوية للمحتوى المرئي في جميع المشاريع التعليمية المستقبلية",
      date: "2026-01-24",
      author: "فريق المنتج",
    },
    {
      id: 2,
      innovationTitle: "منصة التعليم الذكية",
      stage: "Validation",
      learningType: "failure" as const,
      title: "السعر المنخفض لا يضمن معدل تحويل عالي",
      description:
        "افترضنا أن تخفيض السعر من 50 إلى 30 ريال سيزيد معدل التحويل. النتيجة: معدل التحويل انخفض من 15% إلى 12%. السبب: السعر المنخفض أعطى انطباعاً بجودة منخفضة.",
      impact: "high" as const,
      actionable: "التركيز على إظهار القيمة والجودة بدلاً من التنافس على السعر",
      date: "2026-01-22",
      author: "فريق التسويق",
    },
    {
      id: 3,
      innovationTitle: "نظام إدارة المخزون الذكي",
      stage: "Ideation",
      learningType: "insight" as const,
      title: "الشركات الصغيرة ليست السوق المستهدف الصحيح",
      description:
        "بعد 30 مقابلة مع شركات صغيرة، اكتشفنا أن إدارة المخزون ليست أولوية لهم. الشركات المتوسطة (50-200 موظف) هي السوق الأفضل.",
      impact: "high" as const,
      actionable: "إعادة توجيه جميع جهود التسويق والتطوير نحو الشركات المتوسطة",
      date: "2026-01-20",
      author: "فريق البحث",
    },
    {
      id: 4,
      innovationTitle: "تطبيق الصحة الوقائية",
      stage: "Validation",
      learningType: "success" as const,
      title: "الشفافية حول استخدام البيانات تزيد الثقة بنسبة 50%",
      description:
        "أضفنا صفحة شفافية توضح بالتفصيل كيف نستخدم البيانات الصحية. النتيجة: معدل إكمال الملف الصحي ارتفع من 45% إلى 65%.",
      impact: "high" as const,
      actionable: "إضافة صفحات شفافية في جميع المشاريع التي تتعامل مع بيانات حساسة",
      date: "2026-01-25",
      author: "فريق المنتج",
    },
    {
      id: 5,
      innovationTitle: "منصة التجارة الإلكترونية B2B",
      stage: "Ideation",
      learningType: "risk" as const,
      title: "تكلفة اكتساب العميل B2B أعلى بـ 10 مرات من B2C",
      description:
        "اكتشفنا أن تكلفة اكتساب عميل B2B واحد تتجاوز $5000، مقارنة بـ $50 في B2C. هذا يجعل نموذج الأعمال غير مستدام.",
      impact: "high" as const,
      actionable: "تجنب مشاريع B2B إلا إذا كان هناك نموذج ربحية واضح ومستدام",
      date: "2026-01-18",
      author: "فريق الاستراتيجية",
    },
  ];

  const knowledgeBase = [
    {
      id: 1,
      category: "Validation",
      title: "كيفية اختبار الفرضيات بفعالية",
      description:
        "دليل شامل لاختبار الفرضيات باستخدام منهجية Lean Startup، بما في ذلك MVP، Landing Pages، و Wizard of Oz.",
      bestPractice:
        "ابدأ بالفرضيات الأكثر خطورة (RAT Score عالي)، استخدم أقل الموارد الممكنة، وحدد معايير نجاح واضحة قبل البدء.",
      pitfalls:
        "تجنب: الاختبار بدون معايير نجاح واضحة، الاستثمار الزائد في المرحلة المبكرة، تجاهل النتائج السلبية.",
      resources: "Lean Startup by Eric Ries, Running Lean by Ash Maurya",
      tags: "validation, hypothesis, lean startup, mvp",
      rating: 4.8,
      usefulCount: 45,
      date: "2026-01-15",
    },
    {
      id: 2,
      category: "Ideation",
      title: "تحديد السوق المستهدف الصحيح",
      description:
        "منهجية لتحديد وتقييم الأسواق المستهدفة باستخدام TAM/SAM/SOM وتحليل الشخصيات (Personas).",
      bestPractice:
        "ابدأ بسوق محدد جداً (Niche)، تحدث مع 20-30 عميل محتمل قبل البناء، وتحقق من حجم السوق وإمكانية الوصول.",
      pitfalls:
        "تجنب: استهداف 'الجميع'، الاعتماد على بيانات السوق القديمة، تجاهل تكلفة اكتساب العميل.",
      resources: "The Mom Test by Rob Fitzpatrick, Crossing the Chasm by Geoffrey Moore",
      tags: "market, target audience, personas, tam sam som",
      rating: 4.6,
      usefulCount: 38,
      date: "2026-01-10",
    },
    {
      id: 3,
      category: "Prototyping",
      title: "بناء MVP فعال بأقل التكاليف",
      description:
        "استراتيجيات لبناء Minimum Viable Product يحقق الهدف التعليمي بأقل الموارد والوقت.",
      bestPractice:
        "ركز على الميزة الأساسية الواحدة، استخدم أدوات No-Code/Low-Code، واختبر مع 10-20 مستخدم حقيقي.",
      pitfalls:
        "تجنب: إضافة ميزات 'لطيفة' (Nice-to-have)، الكمالية في التصميم، التطوير بدون تغذية راجعة مستمرة.",
      resources: "The Lean Startup, Sprint by Jake Knapp",
      tags: "mvp, prototyping, no-code, lean",
      rating: 4.9,
      usefulCount: 52,
      date: "2026-01-12",
    },
    {
      id: 4,
      category: "Business Model",
      title: "نماذج التسعير للمنتجات SaaS",
      description:
        "دليل شامل لنماذج التسعير المختلفة (Freemium, Tiered, Usage-based) ومتى تستخدم كل منها.",
      bestPractice:
        "ابدأ بنموذج بسيط (مثلاً: خطة واحدة)، اختبر حساسية السعر مبكراً، وراقب معدل التحويل والـ LTV.",
      pitfalls:
        "تجنب: التسعير المنخفض جداً (يعطي انطباع جودة منخفضة)، الخطط المعقدة (تربك العميل)، عدم اختبار السعر.",
      resources: "Monetizing Innovation by Madhavan Ramanujam",
      tags: "pricing, saas, business model, monetization",
      rating: 4.7,
      usefulCount: 41,
      date: "2026-01-18",
    },
    {
      id: 5,
      category: "Growth",
      title: "استراتيجيات النمو المستدام",
      description:
        "أساليب لتحقيق نمو مستدام دون حرق الميزانية، بما في ذلك Growth Hacking و Viral Loops.",
      bestPractice:
        "ركز على قناة واحدة حتى تتقنها، قس كل شيء، واستثمر في الاحتفاظ (Retention) قبل الاستحواذ (Acquisition).",
      pitfalls:
        "تجنب: تجربة كل القنوات في وقت واحد، تجاهل معدل الاحتفاظ، الإنفاق الزائد على الإعلانات.",
      resources: "Traction by Gabriel Weinberg, Hacking Growth by Sean Ellis",
      tags: "growth, marketing, retention, viral loops",
      rating: 4.5,
      usefulCount: 35,
      date: "2026-01-20",
    },
  ];

  const aiRecommendations = [
    {
      id: 1,
      title: "توصية بناءً على مشروعك الحالي",
      description:
        "بناءً على مشروع 'منصة التعليم الذكية' في مرحلة Validation، نوصي بقراءة: 'كيفية اختبار الفرضيات بفعالية'",
      relevance: 95,
      knowledgeId: 1,
    },
    {
      id: 2,
      title: "درس من مشروع مشابه",
      description:
        "مشروع 'نظام إدارة المخزون الذكي' واجه تحدياً مشابهاً في تحديد السوق المستهدف. راجع: 'تحديد السوق المستهدف الصحيح'",
      relevance: 88,
      knowledgeId: 2,
    },
    {
      id: 3,
      title: "تجنب خطأ شائع",
      description:
        "75% من المشاريع الفاشلة أنفقت أكثر من اللازم على MVP. راجع: 'بناء MVP فعال بأقل التكاليف'",
      relevance: 82,
      knowledgeId: 3,
    },
  ];

  const stats = {
    totalLogs: learningLogs.length,
    totalKnowledge: knowledgeBase.length,
    avgRating: (
      knowledgeBase.reduce((sum, k) => sum + k.rating, 0) / knowledgeBase.length
    ).toFixed(1),
    totalUseful: knowledgeBase.reduce((sum, k) => sum + k.usefulCount, 0),
  };

  const filteredKnowledge =
    categoryFilter === "all"
      ? knowledgeBase
      : knowledgeBase.filter((k) => k.category === categoryFilter);

  const searchedKnowledge = searchQuery
    ? filteredKnowledge.filter(
        (k) =>
          k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.tags.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredKnowledge;

  const handleAddLog = () => {
    if (!logData.title || !logData.description || !logData.innovationId) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    toast.success("تم إضافة الدرس المستفاد بنجاح");

    setLogData({
      innovationId: "",
      stage: "",
      learningType: "success",
      title: "",
      description: "",
      impact: "medium",
      actionable: "",
    });
    setIsAddLogOpen(false);
  };

  const handleAddKnowledge = () => {
    if (!knowledgeData.title || !knowledgeData.description || !knowledgeData.category) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    toast.success("تم إضافة المعرفة إلى قاعدة البيانات بنجاح");

    setKnowledgeData({
      category: "",
      title: "",
      description: "",
      bestPractice: "",
      pitfalls: "",
      resources: "",
      tags: "",
    });
    setIsAddKnowledgeOpen(false);
  };

  const getLearningTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failure":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "insight":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case "risk":
        return <Target className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getLearningTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-300";
      case "failure":
        return "bg-red-100 text-red-700 border-red-300";
      case "insight":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "risk":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "";
    }
  };

  const getLearningTypeLabel = (type: string) => {
    switch (type) {
      case "success":
        return "نجاح";
      case "failure":
        return "فشل";
      case "insight":
        return "رؤية";
      case "risk":
        return "خطر";
      default:
        return type;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "";
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return "عالي";
      case "medium":
        return "متوسط";
      case "low":
        return "منخفض";
      default:
        return impact;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              حلقة التعلم المستمر وقاعدة المعرفة
            </h1>
            <p className="text-gray-600 mt-2">
              وثّق الدروس المستفادة وابنِ قاعدة معرفة مؤسسية متنامية
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">سجلات التعلم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{stats.totalLogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">قاعدة المعرفة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalKnowledge}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">متوسط التقييم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 flex items-center gap-1">
                <Star className="h-6 w-6 fill-current" />
                {stats.avgRating}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المفيدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalUseful}</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Brain className="h-6 w-6" />
              توصيات AI الذكية
            </CardTitle>
            <CardDescription>توصيات مخصصة بناءً على مشاريعك الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiRecommendations.map((rec) => (
                <Card key={rec.id} className="bg-white">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{rec.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rec.relevance}% ملاءمة
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                          اقرأ المزيد →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log">سجل التعلم</TabsTrigger>
            <TabsTrigger value="knowledge">قاعدة المعرفة</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Dialog open={isAddLogOpen} onOpenChange={setIsAddLogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Plus className="h-5 w-5 ml-2" />
                    إضافة درس مستفاد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>إضافة درس مستفاد جديد</DialogTitle>
                    <DialogDescription>
                      وثّق ما تعلمته من هذا المشروع لمساعدة الفريق في المستقبل
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="innovationId">المشروع *</Label>
                        <Select
                          value={logData.innovationId}
                          onValueChange={(value) => setLogData({ ...logData, innovationId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المشروع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">منصة التعليم الذكية</SelectItem>
                            <SelectItem value="2">نظام إدارة المخزون الذكي</SelectItem>
                            <SelectItem value="3">تطبيق الصحة الوقائية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stage">المرحلة</Label>
                        <Select
                          value={logData.stage}
                          onValueChange={(value) => setLogData({ ...logData, stage: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المرحلة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ideation">Ideation</SelectItem>
                            <SelectItem value="Validation">Validation</SelectItem>
                            <SelectItem value="Prototyping">Prototyping</SelectItem>
                            <SelectItem value="Testing">Testing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="learningType">نوع الدرس *</Label>
                        <Select
                          value={logData.learningType}
                          onValueChange={(value: "success" | "failure" | "insight" | "risk") =>
                            setLogData({ ...logData, learningType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="success">نجاح ✅</SelectItem>
                            <SelectItem value="failure">فشل ❌</SelectItem>
                            <SelectItem value="insight">رؤية 💡</SelectItem>
                            <SelectItem value="risk">خطر ⚠️</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="impact">مستوى التأثير</Label>
                        <Select
                          value={logData.impact}
                          onValueChange={(value: "high" | "medium" | "low") =>
                            setLogData({ ...logData, impact: value })
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان الدرس *</Label>
                      <Input
                        id="title"
                        placeholder="مثال: المحتوى المرئي يزيد التفاعل بنسبة 40%"
                        value={logData.title}
                        onChange={(e) => setLogData({ ...logData, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">الوصف التفصيلي *</Label>
                      <Textarea
                        id="description"
                        placeholder="اشرح بالتفصيل ما حدث، ما تعلمته، والبيانات الداعمة..."
                        rows={5}
                        value={logData.description}
                        onChange={(e) => setLogData({ ...logData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actionable">الإجراء القابل للتطبيق</Label>
                      <Textarea
                        id="actionable"
                        placeholder="ما الذي يجب فعله بناءً على هذا الدرس؟"
                        rows={3}
                        value={logData.actionable}
                        onChange={(e) => setLogData({ ...logData, actionable: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddLogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddLog}>إضافة الدرس</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {learningLogs.map((log) => (
                <Card key={log.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {log.innovationTitle}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {log.stage}
                          </Badge>
                          <Badge className={getLearningTypeColor(log.learningType)}>
                            {getLearningTypeIcon(log.learningType)}
                            <span className="mr-1">{getLearningTypeLabel(log.learningType)}</span>
                          </Badge>
                          <Badge className={getImpactColor(log.impact)}>
                            تأثير {getImpactLabel(log.impact)}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{log.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">{log.description}</p>

                      {log.actionable && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            الإجراء القابل للتطبيق
                          </div>
                          <p className="text-sm text-blue-700">{log.actionable}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          {new Date(log.date).toLocaleDateString("ar-SA")} • {log.author}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="h-4 w-4 ml-1" />
                            مفيد
                          </Button>
                          <Button size="sm" variant="outline">
                            مشاركة
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="ابحث في قاعدة المعرفة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="Ideation">Ideation</SelectItem>
                  <SelectItem value="Validation">Validation</SelectItem>
                  <SelectItem value="Prototyping">Prototyping</SelectItem>
                  <SelectItem value="Business Model">Business Model</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddKnowledgeOpen} onOpenChange={setIsAddKnowledgeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Plus className="h-5 w-5 ml-2" />
                    إضافة معرفة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>إضافة معرفة جديدة</DialogTitle>
                    <DialogDescription>
                      أضف دليل، أفضل ممارسة، أو مورد مفيد إلى قاعدة المعرفة
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">الفئة *</Label>
                      <Select
                        value={knowledgeData.category}
                        onValueChange={(value) =>
                          setKnowledgeData({ ...knowledgeData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ideation">Ideation</SelectItem>
                          <SelectItem value="Validation">Validation</SelectItem>
                          <SelectItem value="Prototyping">Prototyping</SelectItem>
                          <SelectItem value="Business Model">Business Model</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="knowledgeTitle">العنوان *</Label>
                      <Input
                        id="knowledgeTitle"
                        placeholder="مثال: كيفية اختبار الفرضيات بفعالية"
                        value={knowledgeData.title}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, title: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="knowledgeDescription">الوصف *</Label>
                      <Textarea
                        id="knowledgeDescription"
                        placeholder="وصف موجز للمحتوى..."
                        rows={3}
                        value={knowledgeData.description}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bestPractice">أفضل الممارسات</Label>
                      <Textarea
                        id="bestPractice"
                        placeholder="ما هي أفضل الممارسات المتبعة؟"
                        rows={4}
                        value={knowledgeData.bestPractice}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, bestPractice: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pitfalls">الأخطاء الشائعة</Label>
                      <Textarea
                        id="pitfalls"
                        placeholder="ما الذي يجب تجنبه؟"
                        rows={4}
                        value={knowledgeData.pitfalls}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, pitfalls: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resources">الموارد والمراجع</Label>
                      <Textarea
                        id="resources"
                        placeholder="كتب، مقالات، دورات، إلخ..."
                        rows={3}
                        value={knowledgeData.resources}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, resources: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">الوسوم (مفصولة بفواصل)</Label>
                      <Input
                        id="tags"
                        placeholder="validation, hypothesis, lean startup"
                        value={knowledgeData.tags}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, tags: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddKnowledgeOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddKnowledge}>إضافة المعرفة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {searchedKnowledge.map((knowledge) => (
                <Card key={knowledge.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{knowledge.category}</Badge>
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-semibold">{knowledge.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            • {knowledge.usefulCount} وجدوها مفيدة
                          </span>
                        </div>
                        <CardTitle className="text-xl">{knowledge.title}</CardTitle>
                        <CardDescription className="mt-2">{knowledge.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {knowledge.bestPractice && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm font-semibold text-green-900 mb-1 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            أفضل الممارسات
                          </div>
                          <p className="text-sm text-green-700">{knowledge.bestPractice}</p>
                        </div>
                      )}

                      {knowledge.pitfalls && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm font-semibold text-red-900 mb-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            تجنب
                          </div>
                          <p className="text-sm text-red-700">{knowledge.pitfalls}</p>
                        </div>
                      )}

                      {knowledge.resources && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            الموارد والمراجع
                          </div>
                          <p className="text-sm text-blue-700">{knowledge.resources}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex flex-wrap gap-2">
                          {knowledge.tags.split(",").map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="h-4 w-4 ml-1" />
                            مفيد
                          </Button>
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

            {searchedKnowledge.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-500">جرب تغيير معايير البحث أو الفلترة</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
