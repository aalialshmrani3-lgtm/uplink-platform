import { useState } from "react";
import { Plus, Search, Filter, TrendingUp, Users, Target, CheckCircle2, Clock, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChallengeLibrary() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessImpact: "",
    stakeholders: "",
    constraints: "",
    successCriteria: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  // Mock data - will be replaced with real API
  const challenges = [
    {
      id: 1,
      title: "Enhance Digital Customer Experience",
      description: "15% drop in Q3 customer satisfaction due to slow digital platform",
      businessImpact: "Potential $2M annual revenue loss",
      stakeholders: isAr ? [isAr ? "فريق المنتج" : "Product Team", isAr ? "خدمة العملاء" : "Customer Service", isAr ? "التسويق" : "Marketing"] : ["Product Team", "Customer Service", "Marketing"],
      priority: "high" as const,
      status: "active" as const,
      linkedInnovations: 5,
      createdAt: "2026-01-15",
    },
    {
      id: 2,
      title: "Reduce Supply Chain Cost",
      description: "25% increase in shipping & storage costs last year",
      businessImpact: "Potential $1.5M annual savings",
      stakeholders: isAr ? [isAr ? "العمليات" : "Operations", isAr ? "المشتريات" : "Procurement", isAr ? "المالية" : "Finance"] : ["Operations", "Procurement", "Finance"],
      priority: "high" as const,
      status: "in_progress" as const,
      linkedInnovations: 8,
      createdAt: "2026-01-10",
    },
    {
      id: 3,
      title: "Increase Employee Productivity",
      description: "Avg. 3 hours/day spent on administrative tasks",
      businessImpact: "Potential 20% productivity increase",
      stakeholders: isAr ? [isAr ? "الموارد البشرية" : "Human Resources", "IT", isAr ? "جميع الأقسام" : "All Departments"] : ["Human Resources", "IT", "All Departments"],
      priority: "medium" as const,
      status: "active" as const,
      linkedInnovations: 3,
      createdAt: "2026-01-05",
    },
    {
      id: 4,
      title: "Improve Operational Sustainability",
      description: "Need to reduce carbon footprint by 30% by 2027",
      businessImpact: "Environmental compliance + improved reputation",
      stakeholders: isAr ? [isAr ? "الاستدامة" : "Sustainability", isAr ? "العمليات" : "Operations", isAr ? "الإدارة العليا" : "Senior Management"] : ["Sustainability", "Operations", "Senior Management"],
      priority: "medium" as const,
      status: "active" as const,
      linkedInnovations: 2,
      createdAt: "2025-12-20",
    },
    {
      id: 5,
      title: "Develop New Products for Emerging Market",
      description: "Opportunity to enter $500M market with limited competition",
      businessImpact: "Potential $50M revenue in first year",
      stakeholders: isAr ? ["R&D", isAr ? "التسويق" : "Marketing", isAr ? "المبيعات" : "Sales"] : ["R&D", "Marketing", "Sales"],
      priority: "high" as const,
      status: "active" as const,
      linkedInnovations: 12,
      createdAt: "2025-12-15",
    },
    {
      id: 6,
      title: "Enhance Data Security",
      description: "Increased cyber threats, need for stronger protection",
      businessImpact: "Avoid potential $10M losses from breaches",
      stakeholders: isAr ? ["IT Security", isAr ? "القانونية" : "Legal", isAr ? "جميع الأقسام" : "All Departments"] : ["IT Security", "Legal", "All Departments"],
      priority: "high" as const,
      status: "solved" as const,
      linkedInnovations: 4,
      createdAt: "2025-11-30",
    },
  ];

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || challenge.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: challenges.length,
    active: challenges.filter((c) => c.status === "active").length,
    inProgress: challenges.filter((c) => c.status === "in_progress").length,
    solved: challenges.filter((c) => c.status === "solved").length,
    totalInnovations: challenges.reduce((sum, c) => sum + c.linkedInnovations, 0),
  };

  const handleCreateChallenge = () => {
    // Validation
    if (!formData.title || !formData.description) {
      toast.error(isAr ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    // TODO: Call API to create challenge
    toast.success(isAr ? `تم إنشاء التحدي "${formData.title}" بنجاح` : `Challenge "${formData.title}" created successfully`);

    // Reset form
    setFormData({
      title: "",
      description: "",
      businessImpact: "",
      stakeholders: "",
      constraints: "",
      successCriteria: "",
      priority: "medium",
    });
    setIsCreateDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Target className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "solved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "archived":
        return <Archive className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return isAr ? "نشط" : "Active";
      case "in_progress":
        return isAr ? "قيد التنفيذ" : "In Progress";
      case "solved":
        return isAr ? "محلول" : "Resolved";
      case "archived":
        return isAr ? "مؤرشف" : "Archived";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isAr ? "مكتبة التحديات الاستراتيجية" : "Strategic Challenges Library"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAr ? "حدد التحديات الحقيقية لتوجيه الابتكار نحو حلول فعّالة" : "Identify real challenges to guide innovation towards effective solutions"}
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-5 w-5 ml-2" />
                {isAr ? "تحدٍ جديد" : "New Challenge"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isAr ? "إنشاء تحدٍ استراتيجي جديد" : "Create New Strategic Challenge"}</DialogTitle>
                <DialogDescription>
                  {isAr ? "حدد التحدي الذي تواجهه المؤسسة لتوجيه الابتكارات نحو حلول فعّالة" : "Define the organizational challenge to guide innovations towards effective solutions"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{isAr ? "عنوان التحدي *" : "Challenge Title *"}</Label>
                  <Input
                    id="title"
                    placeholder={isAr ? "مثال: تحسين تجربة العملاء الرقمية" : "Example: Enhance Digital Customer Experience"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{isAr ? "وصف المشكلة *" : "Problem Description *"}</Label>
                  <Textarea
                    id="description"
                    placeholder={isAr ? "صف المشكلة بالتفصيل..." : "Describe the problem in detail..."}
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessImpact">{isAr ? "تأثير الأعمال" : "Business Impact"}</Label>
                  <Textarea
                    id="businessImpact"
                    placeholder={isAr ? "ما هو التأثير المالي أو الاستراتيجي؟ (كمي إن أمكن)" : "What is the financial or strategic impact? (Quantify if possible)"}
                    rows={3}
                    value={formData.businessImpact}
                    onChange={(e) => setFormData({ ...formData, businessImpact: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stakeholders">{isAr ? "أصحاب المصلحة المتأثرين" : "Affected Stakeholders"}</Label>
                  <Input
                    id="stakeholders"
                    placeholder={isAr ? "مثال: فريق المنتج، خدمة العملاء، التسويق" : "Example: Product Team, Customer Service, Marketing"}
                    value={formData.stakeholders}
                    onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints">{isAr ? "القيود والموارد" : "Constraints & Resources"}</Label>
                  <Textarea
                    id="constraints"
                    placeholder={isAr ? "ما هي القيود (الميزانية، الوقت، الموارد)؟" : "What are the constraints (budget, time, resources)?"}
                    rows={3}
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successCriteria">{isAr ? "معايير النجاح" : "Success Criteria"}</Label>
                  <Textarea
                    id="successCriteria"
                    placeholder={isAr ? "كيف سنعرف أننا حللنا التحدي؟" : "How will we know we've solved the challenge?"}
                    rows={3}
                    value={formData.successCriteria}
                    onChange={(e) => setFormData({ ...formData, successCriteria: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">{isAr ? "الأولوية" : "Priority"}</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "high" | "medium" | "low") =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">{isAr ? "عالية" : "High"}</SelectItem>
                      <SelectItem value="medium">{isAr ? "متوسطة" : "Medium"}</SelectItem>
                      <SelectItem value="low">{isAr ? "منخفضة" : "Low"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleCreateChallenge}>{isAr ? "إنشاء التحدي" : "Create Challenge"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "إجمالي التحديات" : "Total Challenges"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "نشط" : "Active"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "قيد التنفيذ" : "In Progress"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "محلول" : "Resolved"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.solved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{isAr ? "الابتكارات المرتبطة" : "Related Innovations"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{stats.totalInnovations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder={isAr ? "ابحث في التحديات..." : "Search Challenges..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder={isAr ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? "جميع الحالات" : "All Statuses"}</SelectItem>
                  <SelectItem value="active">{isAr ? "نشط" : "Active"}</SelectItem>
                  <SelectItem value="in_progress">{isAr ? "قيد التنفيذ" : "In Progress"}</SelectItem>
                  <SelectItem value="solved">{isAr ? "محلول" : "Resolved"}</SelectItem>
                  <SelectItem value="archived">{isAr ? "مؤرشف" : "Archived"}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <TrendingUp className="h-4 w-4 ml-2" />
                  <SelectValue placeholder={isAr ? "الأولوية" : "Priority"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? "جميع الأولويات" : "All Priorities"}</SelectItem>
                  <SelectItem value="high">{isAr ? "عالية" : "High"}</SelectItem>
                  <SelectItem value="medium">{isAr ? "متوسطة" : "Medium"}</SelectItem>
                  <SelectItem value="low">{isAr ? "منخفضة" : "Low"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Challenges List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-r-4"
              style={{
                borderRightColor:
                  challenge.priority === "high"
                    ? "#ef4444"
                    : challenge.priority === "medium"
                    ? "#eab308"
                    : "#22c55e",
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <Badge className={getPriorityColor(challenge.priority)}>
                        {challenge.priority === "high"
                          ? (isAr ? "عالية" : "High")
                          : challenge.priority === "medium"
                          ? (isAr ? "متوسطة" : "Medium")
                          : (isAr ? "منخفضة" : "Low")}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        {getStatusIcon(challenge.status)}
                        {getStatusLabel(challenge.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{challenge.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{isAr ? "تأثير الأعمال" : "Business Impact"}</div>
                      <div className="text-sm text-gray-600">{challenge.businessImpact}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{isAr ? "أصحاب المصلحة" : "Stakeholders"}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {challenge.stakeholders.map((stakeholder, idx) => (
                          <Badge key={idx} variant="secondary">
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-500">
                      {isAr ? "تم الإنشاء:" : "Created:"} {new Date(challenge.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      {challenge.linkedInnovations} {isAr ? "ابتكار مرتبط" : "Related Innovation"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{isAr ? "لا توجد تحديات" : "No Challenges"}</h3>
              <p className="text-gray-500 mb-4">{isAr ? "لم يتم العثور على تحديات تطابق معايير البحث" : "No challenges found matching search criteria"}</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}>
                {isAr ? "إعادة تعيين الفلاتر" : "Reset Filters"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}