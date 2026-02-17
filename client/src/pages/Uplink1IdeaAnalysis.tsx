import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Brain, TrendingUp, AlertTriangle, CheckCircle2,
  Target, Lightbulb, Users, DollarSign, Shield, Zap
} from "lucide-react";
import { Link } from "wouter";

export default function Uplink1IdeaAnalysis() {
  const [, params] = useRoute("/uplink1/ideas/:id/analysis");
  const ideaId = params?.id ? parseInt(params.id) : 0;

  const { data: idea, isLoading } = trpc.uplink1.getIdeaById.useQuery({ ideaId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">جاري تحليل الفكرة بالذكاء الاصطناعي...</p>
        </div>
      </div>
    );
  }

  if (!idea || !idea.analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">لم يتم العثور على تحليل للفكرة</p>
          <Link href="/uplink1">
            <Button className="mt-4">العودة إلى UPLINK 1</Button>
          </Link>
        </div>
      </div>
    );
  }

  const analysis = idea.analysis;
  
  // Parse JSON fields if they are strings (with defensive checks)
  const strengths = analysis?.strengths ? (typeof analysis.strengths === 'string' ? JSON.parse(analysis.strengths) : analysis.strengths) : [];
  const weaknesses = analysis?.weaknesses ? (typeof analysis.weaknesses === 'string' ? JSON.parse(analysis.weaknesses) : analysis.weaknesses) : [];
  const opportunities = analysis?.opportunities ? (typeof analysis.opportunities === 'string' ? JSON.parse(analysis.opportunities) : analysis.opportunities) : [];
  const threats = analysis?.threats ? (typeof analysis.threats === 'string' ? JSON.parse(analysis.threats) : analysis.threats) : [];
  const recommendations = analysis?.recommendations ? (typeof analysis.recommendations === 'string' ? JSON.parse(analysis.recommendations) : analysis.recommendations) : [];
  const nextSteps = analysis?.nextSteps ? (typeof analysis.nextSteps === 'string' ? JSON.parse(analysis.nextSteps) : analysis.nextSteps) : [];
  const similarInnovations = analysis?.similarInnovations ? (typeof analysis.similarInnovations === 'string' ? JSON.parse(analysis.similarInnovations) : analysis.similarInnovations) : [];
  const extractedKeywords = analysis?.extractedKeywords ? (typeof analysis.extractedKeywords === 'string' ? JSON.parse(analysis.extractedKeywords) : analysis.extractedKeywords) : [];
  const marketTrends = analysis?.marketTrends ? (typeof analysis.marketTrends === 'string' ? JSON.parse(analysis.marketTrends) : analysis.marketTrends) : [];

  const getInnovationColor = (level: string) => {
    switch (level) {
      case 'breakthrough': return 'from-purple-500 to-pink-600';
      case 'high': return 'from-blue-500 to-cyan-600';
      case 'medium': return 'from-green-500 to-emerald-600';
      case 'low': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getInnovationLabel = (level: string) => {
    switch (level) {
      case 'breakthrough': return 'ابتكار جذري';
      case 'high': return 'ابتكار عالي';
      case 'medium': return 'ابتكار متوسط';
      case 'low': return 'ابتكار منخفض';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-b border-border/50">
        <div className="container py-8">
          <Link href={`/uplink1/ideas/${ideaId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة إلى تفاصيل الفكرة
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">تحليل الفكرة بالذكاء الاصطناعي</h1>
              <p className="text-muted-foreground">{idea.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Overall Score */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">التقييم الشامل</CardTitle>
                  <CardDescription>تقييم شامل للفكرة بناءً على 10 معايير</CardDescription>
                </div>
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center`}>
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Badge className={`text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0`}>
                  {analysis.classification === 'innovation' ? 'ابتكار حقيقي' : analysis.classification === 'commercial' ? 'مشروع تجاري' : 'تحتاج تطوير'}
                </Badge>
                <span className="text-3xl font-bold text-foreground">{analysis.overallScore}%</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{analysis.aiAnalysis}</p>
            </CardContent>
          </Card>

          {/* TRL & Stage Gate */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                مستوى النضج التقني
              </CardTitle>
              <CardDescription>Technology Readiness Level & Stage Gate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">TRL Level</p>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    Level {analysis.trlLevel}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{analysis.trlDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Stage Gate</p>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {analysis.currentStageGate}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{analysis.stageGateRecommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                تحليل SWOT
              </CardTitle>
              <CardDescription>نقاط القوة والضعف والفرص والتهديدات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    نقاط القوة
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((strength: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    نقاط الضعف
                  </h3>
                  <ul className="space-y-2">
                    {weaknesses.map((weakness: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    الفرص
                  </h3>
                  <ul className="space-y-2">
                    {opportunities.map((opportunity: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    التهديدات
                  </h3>
                  <ul className="space-y-2">
                    {threats.map((threat: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-cyan-400" />
                التوصيات
              </CardTitle>
              <CardDescription>خطوات مقترحة لتطوير فكرتك</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.map((recommendation: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Market Potential */}
          {analysis.marketSize && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-cyan-400" />
                  إمكانات السوق
                </CardTitle>
                <CardDescription>تقييم الفرص التجارية والسوقية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">حجم السوق</p>
                    <p className="text-xl font-bold text-foreground">{analysis.marketSize}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">مستوى المنافسة</p>
                    <p className="text-xl font-bold text-foreground">{analysis.competitionLevel}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">مستوى التعقيد</p>
                    <p className="text-xl font-bold text-foreground">{analysis.complexityLevel}</p>
                  </div>
                </div>
                {marketTrends && marketTrends.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">اتجاهات السوق:</p>
                    <ul className="space-y-1">
                      {marketTrends.map((trend: string, i: number) => (
                        <li key={i} className="text-muted-foreground">• {trend}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-2xl">الخطوات التالية</CardTitle>
              <CardDescription>ماذا بعد التحليل؟</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/uplink2">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <Users className="w-4 h-4 ml-2" />
                    انتقل إلى UPLINK 2 (الفعاليات والتحديات)
                  </Button>
                </Link>
                <Link href={`/uplink1/ideas/${ideaId}`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    العودة إلى تفاصيل الفكرة
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
