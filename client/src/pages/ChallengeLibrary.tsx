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

export default function ChallengeLibrary() {
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
      title: "تحسين تجربة العملاء الرقمية",
      description: "انخفاض رضا العملاء بنسبة 15% في Q3 بسبب بطء المنصة الرقمية",
      businessImpact: "خسارة محتملة $2M من الإيرادات السنوية",
      stakeholders: ["فريق المنتج", "خدمة العملاء", "التسويق"],
      priority: "high" as const,
      status: "active" as const,
      linkedInnovations: 5,
      createdAt: "2026-01-15",
    },
    {
      id: 2,
      title: "تقليل تكلفة سلسلة التوريد",
      description: "ارتفاع تكاليف الشحن والتخزين بنسبة 25% خلال العام الماضي",
      businessImpact: "توفير محتمل $1.5M سنوياً",
      stakeholders: ["العمليات", "المشتريات", "المالية"],
      priority: "high" as const,
      status: "in_progress" as const,
      linkedInnovations: 8,
      createdAt: "2026-01-10",
    },
    {
      id: 3,
      title: "زيادة إنتاجية الموظفين",
      description: "متوسط الوقت المستغرق في المهام الإدارية 3 ساعات يومياً",
      businessImpact: "زيادة محتملة 20% في الإنتاجية",
      stakeholders: ["الموارد البشرية", "IT", "جميع الأقسام"],
      priority: "medium" as const,
      status: "active" as const,
      linkedInnovations: 3,
      createdAt: "2026-01-05",
    },
    {
      id: 4,
      title: "تحسين استدامة العمليات",
      description: "الحاجة لتقليل البصمة الكربونية بنسبة 30% بحلول 2027",
      businessImpact: "الامتثال للمعايير البيئية + تحسين السمعة",
      stakeholders: ["الاستدامة", "العمليات", "الإدارة العليا"],
      priority: "medium" as const,
      status: "active" as const,
      linkedInnovations: 2,
      createdAt: "2025-12-20",
    },
    {
      id: 5,
      title: "تطوير منتجات جديدة للسوق الناشئة",
      description: "فرصة دخول سوق بقيمة $500M مع منافسة محدودة",
      businessImpact: "إيرادات محتملة $50M في السنة الأولى",
      stakeholders: ["R&D", "التسويق", "المبيعات"],
      priority: "high" as const,
      status: "active" as const,
      linkedInnovations: 12,
      createdAt: "2025-12-15",
    },
    {
      id: 6,
      title: "تحسين أمن البيانات",
      description: "زيادة التهديدات السيبرانية وضرورة تعزيز الحماية",
      businessImpact: "تجنب خسائر محتملة $10M من الاختراقات",
      stakeholders: ["IT Security", "القانونية", "جميع الأقسام"],
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
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    // TODO: Call API to create challenge
    toast.success(`تم إنشاء التحدي "${formData.title}" بنجاح`);

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
        return "نشط";
      case "in_progress":
        return "قيد التنفيذ";
      case "solved":
        return "محلول";
      case "archived":
        return "مؤرشف";
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
              مكتبة التحديات الاستراتيجية
            </h1>
            <p className="text-gray-600 mt-2">
              حدد التحديات الحقيقية لتوجيه الابتكار نحو حلول فعّالة
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-5 w-5 ml-2" />
                تحدٍ جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء تحدٍ استراتيجي جديد</DialogTitle>
                <DialogDescription>
                  حدد التحدي الذي تواجهه المؤسسة لتوجيه الابتكارات نحو حلول فعّالة
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان التحدي *</Label>
                  <Input
                    id="title"
                    placeholder="مثال: تحسين تجربة العملاء الرقمية"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">وصف المشكلة *</Label>
                  <Textarea
                    id="description"
                    placeholder="صف المشكلة بالتفصيل..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessImpact">تأثير الأعمال</Label>
                  <Textarea
                    id="businessImpact"
                    placeholder="ما هو التأثير المالي أو الاستراتيجي؟ (كمي إن أمكن)"
                    rows={3}
                    value={formData.businessImpact}
                    onChange={(e) => setFormData({ ...formData, businessImpact: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stakeholders">أصحاب المصلحة المتأثرين</Label>
                  <Input
                    id="stakeholders"
                    placeholder="مثال: فريق المنتج، خدمة العملاء، التسويق"
                    value={formData.stakeholders}
                    onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints">القيود والموارد</Label>
                  <Textarea
                    id="constraints"
                    placeholder="ما هي القيود (الميزانية، الوقت، الموارد)؟"
                    rows={3}
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successCriteria">معايير النجاح</Label>
                  <Textarea
                    id="successCriteria"
                    placeholder="كيف سنعرف أننا حللنا التحدي؟"
                    rows={3}
                    value={formData.successCriteria}
                    onChange={(e) => setFormData({ ...formData, successCriteria: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">الأولوية</Label>
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
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="low">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateChallenge}>إنشاء التحدي</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي التحديات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">نشط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">قيد التنفيذ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">محلول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.solved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الابتكارات المرتبطة</CardTitle>
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
                  placeholder="ابحث في التحديات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="solved">محلول</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <TrendingUp className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="low">منخفضة</SelectItem>
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
                          ? "عالية"
                          : challenge.priority === "medium"
                          ? "متوسطة"
                          : "منخفضة"}
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
                      <div className="text-sm font-medium text-gray-700">تأثير الأعمال</div>
                      <div className="text-sm text-gray-600">{challenge.businessImpact}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">أصحاب المصلحة</div>
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
                      تم الإنشاء: {new Date(challenge.createdAt).toLocaleDateString("ar-SA")}
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      {challenge.linkedInnovations} ابتكار مرتبط
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد تحديات</h3>
              <p className="text-gray-500 mb-4">لم يتم العثور على تحديات تطابق معايير البحث</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}>
                إعادة تعيين الفلاتر
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
