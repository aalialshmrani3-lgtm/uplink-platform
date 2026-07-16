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
import { useLanguage } from "@/contexts/LanguageContext";

export default function LearningKnowledgeBase() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

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
      innovationTitle: "Smart Learning Platform",
      stage: "Validation",
      learningType: "success" as const,
      title: "Visual Content Boosts Engagement by 40%",
      description: "Students prefer visual content (videos, animations) over text. After adding 50 educational videos, engagement rose from 45% to 72%.",
      impact: "high" as const,
      actionable: "Prioritize visual content in all future educational projects.",
      date: "2026-01-24",
      author: "Product Team",
    },
    {
      id: 2,
      innovationTitle: "Smart Learning Platform",
      stage: "Validation",
      learningType: "failure" as const,
      title: "Low Price Doesn't Guarantee High Conversion",
      description: "We assumed reducing the price from 50 to 30 SAR would increase conversion. Result: Conversion dropped from 15% to 12%. Reason: Low price implied low quality.",
      impact: "high" as const,
      actionable: "Focus on demonstrating value and quality instead of competing on price.",
      date: "2026-01-22",
      author: "Marketing Team",
    },
    {
      id: 3,
      innovationTitle: "Smart Inventory Management System",
      stage: "Ideation",
      learningType: "insight" as const,
      title: "Small Businesses Are Not the Right Target Market",
      description: "After 30 interviews with small businesses, we found inventory management isn't a priority for them. Mid-sized companies (50-200 employees) are a better market.",
      impact: "high" as const,
      actionable: "Redirect all marketing and development efforts towards mid-sized companies.",
      date: "2026-01-20",
      author: "Research Team",
    },
    {
      id: 4,
      innovationTitle: "Preventive Health App",
      stage: "Validation",
      learningType: "success" as const,
      title: "Data Usage Transparency Increases Trust by 50%",
      description: "We added a transparency page detailing how we use health data. Result: Health profile completion rate rose from 45% to 65%.",
      impact: "high" as const,
      actionable: "Add transparency pages to all projects handling sensitive data.",
      date: "2026-01-25",
      author: "Product Team",
    },
    {
      id: 5,
      innovationTitle: "B2B E-commerce Platform",
      stage: "Ideation",
      learningType: "risk" as const,
      title: "B2B Customer Acquisition Cost is 10x Higher Than B2C",
      description: "We found B2B customer acquisition cost exceeds $5000, compared to $50 in B2C. This makes the business model unsustainable.",
      impact: "high" as const,
      actionable: "Avoid B2B projects unless there's a clear, sustainable profitability model.",
      date: "2026-01-18",
      author: "Strategy Team",
    },
  ];

  const knowledgeBase = [
    {
      id: 1,
      category: "Validation",
      title: "How to Effectively Test Hypotheses",
      description: "A comprehensive guide to hypothesis testing using Lean Startup methodology, including MVP, Landing Pages, and Wizard of Oz.",
      bestPractice: "Start with the riskiest hypotheses (high RAT Score), use minimal resources, and define clear success metrics before starting.",
      pitfalls: "Avoid: Testing without clear success metrics, over-investing early, ignoring negative results.",
      resources: "Lean Startup by Eric Ries, Running Lean by Ash Maurya",
      tags: "validation, hypothesis, lean startup, mvp",
      rating: 4.8,
      usefulCount: 45,
      date: "2026-01-15",
    },
    {
      id: 2,
      category: "Ideation",
      title: "Identifying the Right Target Market",
      description: "A methodology for identifying and evaluating target markets using TAM/SAM/SOM and Persona analysis.",
      bestPractice: "Start with a very specific niche, talk to 20-30 potential customers before building, and verify market size and accessibility.",
      pitfalls: "Avoid: Targeting 'everyone', relying on outdated market data, ignoring customer acquisition cost.",
      resources: "The Mom Test by Rob Fitzpatrick, Crossing the Chasm by Geoffrey Moore",
      tags: "market, target audience, personas, tam sam som",
      rating: 4.6,
      usefulCount: 38,
      date: "2026-01-10",
    },
    {
      id: 3,
      category: "Prototyping",
      title: "Build an Effective MVP at Minimal Cost",
      description: "Strategies for building an MVP that achieves educational goals with minimal resources and time.",
      bestPractice: "Focus on one core feature, use No-Code/Low-Code tools, and test with 10-20 real users.",
      pitfalls: "Avoid: Adding 'nice-to-have' features, design perfectionism, development without continuous feedback.",
      resources: "The Lean Startup, Sprint by Jake Knapp",
      tags: "mvp, prototyping, no-code, lean",
      rating: 4.9,
      usefulCount: 52,
      date: "2026-01-12",
    },
    {
      id: 4,
      category: "Business Model",
      title: "SaaS Pricing Models",
      description: "A comprehensive guide to different pricing models (Freemium, Tiered, Usage-based) and when to use each.",
      bestPractice: "Start with a simple model (e.g., one plan), test price sensitivity early, and monitor conversion rate and LTV.",
      pitfalls: "Avoid: Very low pricing (implies low quality), complex plans (confuse customers), not testing prices.",
      resources: "Monetizing Innovation by Madhavan Ramanujam",
      tags: "pricing, saas, business model, monetization",
      rating: 4.7,
      usefulCount: 41,
      date: "2026-01-18",
    },
    {
      id: 5,
      category: "Growth",
      title: "Sustainable Growth Strategies",
      description: "Methods for achieving sustainable growth without burning budget, including Growth Hacking and Viral Loops.",
      bestPractice: "Focus on one channel until mastered, measure everything, and invest in Retention before Acquisition.",
      pitfalls: "Avoid: Trying all channels at once, ignoring retention rate, overspending on ads.",
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
      title: "Recommendation based on your current project",
      description: "Based on the 'Smart Learning Platform' project in the Validation phase, we recommend reading: 'How to Effectively Test Hypotheses'",
      relevance: 95,
      knowledgeId: 1,
    },
    {
      id: 2,
      title: "Lesson from a similar project",
      description: "The 'Smart Inventory Management System' project faced a similar challenge in defining its target market. See: 'Defining the Right Target Market'",
      relevance: 88,
      knowledgeId: 2,
    },
    {
      id: 3,
      title: "Avoid a common mistake",
      description: "75% of failed projects overspent on their MVP. See: 'Build an Effective MVP at Minimal Cost'",
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
      toast.error(isAr ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    toast.success(isAr ? "تم إضافة الدرس المستفاد بنجاح" : "Lesson learned added successfully");

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
      toast.error(isAr ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    toast.success(isAr ? "تم إضافة المعرفة إلى قاعدة البيانات بنجاح" : "Knowledge added to database successfully");

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
        return isAr ? "نجاح" : "Success";
      case "failure":
        return isAr ? "فشل" : "Failure";
      case "insight":
        return isAr ? "رؤية" : "Insight";
      case "risk":
        return isAr ? "خطر" : "Risk";
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
        return isAr ? "عالي" : "High";
      case "medium":
        return isAr ? "متوسط" : "Medium";
      case "low":
        return isAr ? "منخفض" : "Low";
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
              {isAr ? "حلقة التعلم المستمر وقاعدة المعرفة" : "Continuous Learning Loop & Knowledge Base"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAr ? "وثّق الدروس المستفادة وابنِ قاعدة معرفة مؤسسية متنامية" : "Document lessons learned and build a growing organizational knowledge base"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "سجلات التعلم" : "Learning Logs"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{stats.totalLogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "قاعدة المعرفة" : "Knowledge Base"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalKnowledge}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "متوسط التقييم" : "Avg. Rating"}</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي المفيدة" : "Total Helpful"}</CardTitle>
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
              {isAr ? "توصيات AI الذكية" : "Smart AI Recommendations"}
            </CardTitle>
            <CardDescription>{isAr ? "توصيات مخصصة بناءً على مشاريعك الحالية" : "Personalized recommendations based on your current projects"}</CardDescription>
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
                            {isAr ? `${rec.relevance}% ملاءمة` : `${rec.relevance}% Relevance`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                          {isAr ? "اقرأ المزيد →" : "Read More →"}
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
            <TabsTrigger value="log">{isAr ? "سجل التعلم" : "Learning Log"}</TabsTrigger>
            <TabsTrigger value="knowledge">{isAr ? "قاعدة المعرفة" : "Knowledge Base"}</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Dialog open={isAddLogOpen} onOpenChange={setIsAddLogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <Plus className="h-5 w-5 ml-2" />
                    {isAr ? "إضافة درس مستفاد" : "Add Lesson Learned"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isAr ? "إضافة درس مستفاد جديد" : "Add New Lesson Learned"}</DialogTitle>
                    <DialogDescription>
                      {isAr ? "وثّق ما تعلمته من هذا المشروع لمساعدة الفريق في المستقبل" : "Document what you learned from this project to help the team in the future"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="innovationId">{isAr ? "المشروع *" : "Project *"}</Label>
                        <Select
                          value={logData.innovationId}
                          onValueChange={(value) => setLogData({ ...logData, innovationId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isAr ? "اختر المشروع" : "Select Project"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">{isAr ? "منصة التعليم الذكية" : "Smart Learning Platform"}</SelectItem>
                            <SelectItem value="2">{isAr ? "نظام إدارة المخزون الذكي" : "Smart Inventory Management System"}</SelectItem>
                            <SelectItem value="3">{isAr ? "تطبيق الصحة الوقائية" : "Preventive Health App"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stage">{isAr ? "المرحلة" : "Phase"}</Label>
                        <Select
                          value={logData.stage}
                          onValueChange={(value) => setLogData({ ...logData, stage: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isAr ? "اختر المرحلة" : "Select Phase"} />
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
                        <Label htmlFor="learningType">{isAr ? "نوع الدرس *" : "Lesson Type *"}</Label>
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
                            <SelectItem value="success">{isAr ? "نجاح ✅" : "Success ✅"}</SelectItem>
                            <SelectItem value="failure">{isAr ? "فشل ❌" : "Failure ❌"}</SelectItem>
                            <SelectItem value="insight">{isAr ? "رؤية 💡" : "Insight 💡"}</SelectItem>
                            <SelectItem value="risk">{isAr ? "خطر ⚠️" : "Risk ⚠️"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="impact">{isAr ? "مستوى التأثير" : "Impact Level"}</Label>
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
                            <SelectItem value="high">{isAr ? "عالي" : "High"}</SelectItem>
                            <SelectItem value="medium">{isAr ? "متوسط" : "Medium"}</SelectItem>
                            <SelectItem value="low">{isAr ? "منخفض" : "Low"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">{isAr ? "عنوان الدرس *" : "Lesson Title *"}</Label>
                      <Input
                        id="title"
                        placeholder={isAr ? "مثال: المحتوى المرئي يزيد التفاعل بنسبة 40%" : "Example: Visual content increases engagement by 40%"}
                        value={logData.title}
                        onChange={(e) => setLogData({ ...logData, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{isAr ? "الوصف التفصيلي *" : "Detailed Description *"}</Label>
                      <Textarea
                        id="description"
                        placeholder={isAr ? "اشرح بالتفصيل ما حدث، ما تعلمته، والبيانات الداعمة..." : "Explain in detail what happened, what you learned, and supporting data..."}
                        rows={5}
                        value={logData.description}
                        onChange={(e) => setLogData({ ...logData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actionable">{isAr ? "الإجراء القابل للتطبيق" : "Actionable Item"}</Label>
                      <Textarea
                        id="actionable"
                        placeholder={isAr ? "ما الذي يجب فعله بناءً على هذا الدرس؟" : "What should be done based on this lesson?"}
                        rows={3}
                        value={logData.actionable}
                        onChange={(e) => setLogData({ ...logData, actionable: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddLogOpen(false)}>
                      {isAr ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button onClick={handleAddLog}>{isAr ? "إضافة الدرس" : "Add Lesson"}</Button>
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
                            {isAr ? `تأثير ${getImpactLabel(log.impact)}` : `${getImpactLabel(log.impact)} Impact`}
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
                            {isAr ? "الإجراء القابل للتطبيق" : "Actionable Item"}
                          </div>
                          <p className="text-sm text-blue-700">{log.actionable}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          {new Date(log.date).toLocaleDateString(isAr ? "ar-SA" : "en-US")} • {log.author}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="h-4 w-4 ml-1" />
                            {isAr ? "مفيد" : "Helpful"}
                          </Button>
                          <Button size="sm" variant="outline">
                            {isAr ? "مشاركة" : "Share"}
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
                  placeholder={isAr ? "ابحث في قاعدة المعرفة..." : "Search knowledge base..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={isAr ? "جميع الفئات" : "All Categories"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? "جميع الفئات" : "All Categories"}</SelectItem>
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
                    {isAr ? "إضافة معرفة" : "Add Knowledge"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isAr ? "إضافة معرفة جديدة" : "Add New Knowledge"}</DialogTitle>
                    <DialogDescription>
                      {isAr ? "أضف دليل، أفضل ممارسة، أو مورد مفيد إلى قاعدة المعرفة" : "Add a guide, best practice, or useful resource to the knowledge base"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">{isAr ? "الفئة *" : "Category *"}</Label>
                      <Select
                        value={knowledgeData.category}
                        onValueChange={(value) =>
                          setKnowledgeData({ ...knowledgeData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isAr ? "اختر الفئة" : "Select Category"} />
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
                      <Label htmlFor="knowledgeTitle">{isAr ? "العنوان *" : "Title *"}</Label>
                      <Input
                        id="knowledgeTitle"
                        placeholder={isAr ? "مثال: كيفية اختبار الفرضيات بفعالية" : "Example: How to effectively test hypotheses"}
                        value={knowledgeData.title}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, title: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="knowledgeDescription">{isAr ? "الوصف *" : "Description *"}</Label>
                      <Textarea
                        id="knowledgeDescription"
                        placeholder={isAr ? "وصف موجز للمحتوى..." : "Brief description of content..."}
                        rows={3}
                        value={knowledgeData.description}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bestPractice">{isAr ? "أفضل الممارسات" : "Best Practices"}</Label>
                      <Textarea
                        id="bestPractice"
                        placeholder={isAr ? "ما هي أفضل الممارسات المتبعة؟" : "What are the best practices?"}
                        rows={4}
                        value={knowledgeData.bestPractice}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, bestPractice: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pitfalls">{isAr ? "الأخطاء الشائعة" : "Common Pitfalls"}</Label>
                      <Textarea
                        id="pitfalls"
                        placeholder={isAr ? "ما الذي يجب تجنبه؟" : "What to avoid?"}
                        rows={4}
                        value={knowledgeData.pitfalls}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, pitfalls: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resources">{isAr ? "الموارد والمراجع" : "Resources & References"}</Label>
                      <Textarea
                        id="resources"
                        placeholder={isAr ? "كتب، مقالات، دورات، إلخ..." : "Books, articles, courses, etc..."}
                        rows={3}
                        value={knowledgeData.resources}
                        onChange={(e) =>
                          setKnowledgeData({ ...knowledgeData, resources: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">{isAr ? "الوسوم (مفصولة بفواصل)" : "Tags (comma-separated)"}</Label>
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
                      {isAr ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button onClick={handleAddKnowledge}>{isAr ? "إضافة المعرفة" : "Add Knowledge"}</Button>
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
                            • {isAr ? `${knowledge.usefulCount} وجدوها مفيدة` : `${knowledge.usefulCount} found useful`}
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
                            {isAr ? "أفضل الممارسات" : "Best Practices"}
                          </div>
                          <p className="text-sm text-green-700">{knowledge.bestPractice}</p>
                        </div>
                      )}

                      {knowledge.pitfalls && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm font-semibold text-red-900 mb-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {isAr ? "تجنب" : "Avoid"}
                          </div>
                          <p className="text-sm text-red-700">{knowledge.pitfalls}</p>
                        </div>
                      )}

                      {knowledge.resources && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {isAr ? "الموارد والمراجع" : "Resources & References"}
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
                            {isAr ? "مفيد" : "Helpful"}
                          </Button>
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

            {searchedKnowledge.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{isAr ? "لا توجد نتائج" : "No results found"}</h3>
                  <p className="text-gray-500">{isAr ? "جرب تغيير معايير البحث أو الفلترة" : "Try changing search or filter criteria"}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}