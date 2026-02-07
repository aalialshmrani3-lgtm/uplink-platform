import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Lightbulb,
  ArrowRight,
  FileText,
  Handshake
} from "lucide-react";

export default function Uplink1Analysis() {
  const [, params] = useRoute("/uplink1/analysis/:id");
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    // Simulate loading analysis data
    setTimeout(() => {
      setAnalysis({
        id: params?.id,
        title: "نظام ذكي لإدارة الطاقة المنزلية",
        classification: "innovation",
        overallScore: 78,
        criteria: [
          { name: "الابتكار والأصالة", score: 85, status: "excellent" },
          { name: "الجدوى التقنية", score: 80, status: "good" },
          { name: "الجدوى التجارية", score: 75, status: "good" },
          { name: "حجم السوق", score: 82, status: "excellent" },
          { name: "الميزة التنافسية", score: 70, status: "good" },
          { name: "الفريق والخبرة", score: 65, status: "acceptable" },
          { name: "نموذج العمل", score: 78, status: "good" },
          { name: "الأثر الاجتماعي", score: 88, status: "excellent" },
          { name: "الملكية الفكرية", score: 72, status: "good" },
          { name: "الاستدامة المالية", score: 75, status: "good" },
        ],
        strengths: [
          "فكرة مبتكرة تحل مشكلة حقيقية في السوق السعودي",
          "تقنية قابلة للتطبيق باستخدام IoT و AI",
          "سوق كبير ومتنامي في قطاع الطاقة المتجددة",
          "أثر إيجابي على البيئة والاستدامة"
        ],
        weaknesses: [
          "يحتاج إلى تطوير الفريق وإضافة خبرات تقنية",
          "نموذج العمل يحتاج إلى مزيد من التفصيل",
          "لم يتم تسجيل براءة اختراع بعد"
        ],
        nextSteps: [
          {
            title: "انتقل إلى UPLINK2",
            description: "شارك في التحديات والهاكاثونات لتطوير فكرتك",
            action: "challenges",
            icon: Target
          },
          {
            title: "انتقل إلى UPLINK3",
            description: "ابحث عن مستثمرين وأنشئ عقود ذكية",
            action: "marketplace",
            icon: Handshake
          }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [params?.id]);

  const getClassificationBadge = (classification: string) => {
    const badges = {
      innovation: { label: "فكرة مبتكرة", color: "bg-green-500" },
      commercial: { label: "فكرة تجارية", color: "bg-blue-500" },
      weak: { label: "تحتاج تطوير", color: "bg-orange-500" }
    };
    return badges[classification as keyof typeof badges] || badges.weak;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    if (status === "excellent") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === "good") return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
    if (status === "acceptable") return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const handleNavigate = (action: string) => {
    if (action === "challenges") {
      setLocation("/uplink2/challenges");
    } else if (action === "marketplace") {
      setLocation("/uplink3/marketplace");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جاري تحليل فكرتك...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">لم يتم العثور على التحليل</h2>
            <p className="text-slate-600 mb-4">معرف التحليل غير صحيح</p>
            <Button onClick={() => setLocation("/uplink1")}>
              العودة إلى UPLINK1
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const badge = getClassificationBadge(analysis.classification);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className={`${badge.color} text-white mb-4`}>
            {badge.label}
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {analysis.title}
          </h1>
          <p className="text-slate-600">
            نتائج التحليل الشامل بواسطة AI
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">النتيجة الإجمالية</h3>
                <p className="text-sm text-muted-foreground">متوسط جميع المعايير</p>
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}%
              </div>
            </div>
            <Progress value={analysis.overallScore} className="h-3" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="criteria" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criteria">معايير التقييم</TabsTrigger>
            <TabsTrigger value="analysis">التحليل</TabsTrigger>
            <TabsTrigger value="next">الخطوات التالية</TabsTrigger>
          </TabsList>

          {/* Criteria Tab */}
          <TabsContent value="criteria" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معايير التقييم (10 معايير)</CardTitle>
                <CardDescription>
                  تقييم شامل لجميع جوانب الفكرة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.criteria.map((criterion: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(criterion.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{criterion.name}</span>
                          <span className={`font-bold ${getScoreColor(criterion.score)}`}>
                            {criterion.score}%
                          </span>
                        </div>
                        <Progress value={criterion.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    نقاط القوة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="w-5 h-5" />
                    نقاط التحسين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-orange-500">!</span>
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Next Steps Tab */}
          <TabsContent value="next" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الخطوات التالية المقترحة</CardTitle>
                <CardDescription>
                  اختر المسار المناسب لتطوير فكرتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.nextSteps.map((step: any, index: number) => {
                    const Icon = step.icon;
                    return (
                      <Card key={index} className="border-2 hover:border-blue-500 transition-all cursor-pointer group">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{step.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {step.description}
                              </p>
                              <Button 
                                onClick={() => handleNavigate(step.action)}
                                className="w-full"
                              >
                                انتقل الآن
                                <ArrowRight className="w-4 h-4 mr-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    ملاحظة هامة
                  </h4>
                  <p className="text-sm text-blue-800">
                    بناءً على تصنيف فكرتك كـ <strong>{badge.label}</strong>، ننصحك بالانتقال إلى UPLINK2 للمشاركة في التحديات وتطوير الفكرة، ثم الانتقال إلى UPLINK3 لإنشاء عقود ذكية مع المستثمرين والشركاء.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => setLocation("/uplink1")}>
            العودة إلى UPLINK1
          </Button>
          <Button onClick={() => setLocation("/uplink1/my-ideas")}>
            عرض جميع أفكاري
          </Button>
        </div>
      </div>
    </div>
  );
}
