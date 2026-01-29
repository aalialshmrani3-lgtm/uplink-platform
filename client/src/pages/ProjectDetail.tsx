import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Rocket, Lightbulb, Brain, ArrowRight, CheckCircle, 
  Target, Users, DollarSign, TrendingUp, AlertTriangle,
  Zap, BarChart3, Shield, Globe
} from "lucide-react";

export default function ProjectDetail() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const params = useParams();
  const projectId = parseInt(params.id || "0");
  
  const { data: project, isLoading, refetch } = trpc.project.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId }
  );
  
  const { data: evaluation } = trpc.evaluation.getByProjectId.useQuery(
    { projectId },
    { enabled: !!projectId && !!project?.evaluationId }
  );

  const submitMutation = trpc.project.submit.useMutation({
    onSuccess: () => {
      toast.success("تم تقديم المشروع للتقييم");
      refetch();
    },
    onError: (error) => {
      toast.error("حدث خطأ", { description: error.message });
    },
  });

  const evaluateMutation = trpc.evaluation.evaluate.useMutation({
    onSuccess: (data) => {
      toast.success("تم التقييم بنجاح!", {
        description: `النتيجة: ${data.overallScore}% - ${
          data.classification === "innovation" ? "ابتكار حقيقي" :
          data.classification === "commercial" ? "حل تجاري" : "يحتاج تطوير"
        }`,
      });
      refetch();
    },
    onError: (error) => {
      toast.error("حدث خطأ في التقييم", { description: error.message });
    },
  });

  if (loading || !user || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">المشروع غير موجود</h2>
          <Link href="/projects">
            <Button>العودة للمشاريع</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "innovation": return "emerald";
      case "commercial": return "blue";
      case "guidance": return "amber";
      default: return "slate";
    }
  };

  const getClassificationText = (classification: string) => {
    switch (classification) {
      case "innovation": return "ابتكار حقيقي";
      case "commercial": return "حل تجاري";
      case "guidance": return "يحتاج تطوير";
      default: return classification;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                UPLINK 5.0
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة للمشاريع
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    {project.engine && (
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                        {project.engine.toUpperCase()}
                      </span>
                    )}
                    {project.category && (
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                        {project.category}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                      project.status === "evaluating" ? "bg-blue-500/20 text-blue-400" :
                      project.status === "rejected" ? "bg-red-500/20 text-red-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {project.status === "draft" && "مسودة"}
                      {project.status === "submitted" && "مُقدّم"}
                      {project.status === "evaluating" && "قيد التقييم"}
                      {project.status === "approved" && "مُعتمد"}
                      {project.status === "rejected" && "مرفوض"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {project.status === "draft" && (
                <Button 
                  onClick={() => submitMutation.mutate({ id: projectId })}
                  disabled={submitMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  تقديم للتقييم
                </Button>
              )}
              {project.status === "submitted" && !evaluation && (
                <Button 
                  onClick={() => evaluateMutation.mutate({ projectId })}
                  disabled={evaluateMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {evaluateMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري التقييم...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 ml-2" />
                      تقييم AI
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">وصف المشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">تفاصيل المشروع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.targetMarket && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">السوق المستهدف</p>
                    <p className="text-white">{project.targetMarket}</p>
                  </div>
                )}
                {project.competitiveAdvantage && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">الميزة التنافسية</p>
                    <p className="text-white">{project.competitiveAdvantage}</p>
                  </div>
                )}
                {project.businessModel && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">نموذج العمل</p>
                    <p className="text-white">{project.businessModel}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Evaluation Results */}
            {evaluation && (
              <Card className={`bg-gradient-to-br from-${getClassificationColor(evaluation.classification)}-950/50 to-slate-900 border-${getClassificationColor(evaluation.classification)}-800/50`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      نتائج تقييم AI
                    </CardTitle>
                    <div className={`px-4 py-2 rounded-full bg-${getClassificationColor(evaluation.classification)}-500/20 text-${getClassificationColor(evaluation.classification)}-400 font-bold`}>
                      {Number(evaluation.overallScore).toFixed(0)}%
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Classification */}
                  <div className={`p-4 rounded-xl bg-${getClassificationColor(evaluation.classification)}-500/10 border border-${getClassificationColor(evaluation.classification)}-500/30`}>
                    <div className="flex items-center gap-3">
                      {evaluation.classification === "innovation" && <Zap className="w-8 h-8 text-emerald-400" />}
                      {evaluation.classification === "commercial" && <TrendingUp className="w-8 h-8 text-blue-400" />}
                      {evaluation.classification === "guidance" && <Target className="w-8 h-8 text-amber-400" />}
                      <div>
                        <p className={`text-${getClassificationColor(evaluation.classification)}-400 font-bold text-lg`}>
                          {getClassificationText(evaluation.classification)}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {evaluation.classification === "innovation" && "مسار سريع إلى UPLINK3 - السوق المفتوح"}
                          {evaluation.classification === "commercial" && "دعم حاضنات الأعمال والتطوير التجاري"}
                          {evaluation.classification === "guidance" && "برنامج إرشاد وتطوير مكثف"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "الابتكار", score: evaluation.innovationScore, icon: Lightbulb },
                      { label: "إمكانية السوق", score: evaluation.marketPotentialScore, icon: TrendingUp },
                      { label: "الجدوى التقنية", score: evaluation.technicalFeasibilityScore, icon: Zap },
                      { label: "قدرة الفريق", score: evaluation.teamCapabilityScore, icon: Users },
                      { label: "قوة IP", score: evaluation.ipStrengthScore, icon: Shield },
                      { label: "قابلية التوسع", score: evaluation.scalabilityScore, icon: Globe },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-white">{Number(item.score).toFixed(0)}</span>
                          <span className="text-slate-500 text-sm mb-1">/ 100</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                          <div 
                            className={`h-full rounded-full ${
                              Number(item.score) >= 70 ? "bg-emerald-500" :
                              Number(item.score) >= 50 ? "bg-blue-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 rounded-xl p-4">
                      <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        نقاط القوة
                      </h4>
                      <ul className="space-y-2">
                        {(JSON.parse(evaluation.strengths as string) || []).map((s: string, i: number) => (
                          <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-500/10 rounded-xl p-4">
                      <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        نقاط الضعف
                      </h4>
                      <ul className="space-y-2">
                        {(JSON.parse(evaluation.weaknesses as string) || []).map((w: string, i: number) => (
                          <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <h4 className="text-cyan-400 font-semibold mb-3">التوصيات</h4>
                    <ul className="space-y-2">
                      {(JSON.parse(evaluation.recommendations as string) || []).map((r: string, i: number) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">{i + 1}.</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Market Analysis */}
                  {evaluation.marketAnalysis && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">تحليل السوق</h4>
                      <p className="text-slate-300 text-sm">{evaluation.marketAnalysis}</p>
                    </div>
                  )}

                  {/* Risk Assessment */}
                  {evaluation.riskAssessment && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">تقييم المخاطر</h4>
                      <p className="text-slate-300 text-sm">{evaluation.riskAssessment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">معلومات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">المرحلة</span>
                  <span className="text-white">
                    {project.stage === "idea" && "فكرة"}
                    {project.stage === "prototype" && "نموذج أولي"}
                    {project.stage === "mvp" && "MVP"}
                    {project.stage === "growth" && "نمو"}
                    {project.stage === "scale" && "توسع"}
                  </span>
                </div>
                {project.teamSize && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">حجم الفريق</span>
                    <span className="text-white">{project.teamSize} أعضاء</span>
                  </div>
                )}
                {project.fundingNeeded && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">التمويل المطلوب</span>
                    <span className="text-white">{Number(project.fundingNeeded).toLocaleString()} ريال</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">تاريخ الإنشاء</span>
                  <span className="text-white">{new Date(project.createdAt).toLocaleDateString("ar-SA")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">الإجراءات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/ip/register">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 justify-start">
                    <Shield className="w-4 h-4 ml-2" />
                    تسجيل ملكية فكرية
                  </Button>
                </Link>
                <Link href="/challenges">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 justify-start">
                    <Target className="w-4 h-4 ml-2" />
                    المشاركة في تحدي
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 justify-start">
                    <Globe className="w-4 h-4 ml-2" />
                    عرض في السوق
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
