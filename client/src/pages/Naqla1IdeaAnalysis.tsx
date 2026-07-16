import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Brain, TrendingUp, AlertTriangle, CheckCircle2,
  Target, Lightbulb, Users, DollarSign, Shield, Zap, Loader2
} from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import { toast } from "sonner";
import { useState } from "react";
import IdeaJourneyTimeline from "@/components/IdeaJourneyTimeline";
import { useLanguage } from "@/contexts/LanguageContext"; // ADDED

export default function Naqla1IdeaAnalysis() {
  const { language } = useLanguage(); // ADDED
  const isAr = language === 'ar'; // ADDED
  const [, params] = useRoute("/naqla1/ideas/:id/analysis");
  const ideaId = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const [isPromoting, setIsPromoting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [targetNaqla, setTargetNaqla] = useState<'naqla2' | 'naqla3' | null>(null);
  const [userNotes, setUserNotes] = useState('');

  const { data: idea, isLoading } = trpc.naqla1.getIdeaById.useQuery({ ideaId });
  const setUserChoiceMutation = trpc.naqla1.setUserChoice.useMutation();

  const handlePromote = async () => {
    if (!targetNaqla) return;
    
    setIsPromoting(true);
    setShowConfirmDialog(false);
    
    try {
      const result = await setUserChoiceMutation.mutateAsync({
        ideaId,
        choice: targetNaqla,
        notes: userNotes || undefined,
      });
      
      if (targetNaqla === 'naqla2') {
        toast.success(isAr ? 'تم الانتقال إلى NAQLA 2 بنجاح!' : 'Successfully moved to NAQLA 2!');
        setLocation(`/naqla2/projects/${result.projectId}`);
      } else {
        toast.success(isAr ? 'تم الانتقال إلى NAQLA 3 بنجاح!' : 'Successfully moved to NAQLA 3!');
        setLocation(`/naqla3/assets/${result.assetId}`);
      }
    } catch (error: any) {
      toast.error(isAr ? (error.message || `فشل الانتقال إلى ${targetNaqla === 'naqla2' ? 'NAQLA 2' : 'NAQLA 3'}`) : (error.message || `Failed to move to ${targetNaqla === 'naqla2' ? 'NAQLA 2' : 'NAQLA 3'}`));
    } finally {
      setIsPromoting(false);
      setTargetNaqla(null);
      setUserNotes('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">{isAr ? "جاري تحليل الفكرة بالذكاء الاصطناعي..." : "Analyzing idea with AI..."}</p>
        </div>
      </div>
    );
  }

  if (!idea || !idea.analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">{isAr ? "لم يتم العثور على تحليل للفكرة" : "No analysis found for idea"}</p>
          <Link href="/naqla1">
            <Button className="mt-4">{isAr ? "العودة إلى NAQLA 1" : "Back to NAQLA 1"}</Button>
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
      case 'breakthrough': return isAr ? 'ابتكار جذري' : 'Breakthrough Innovation';
      case 'high': return isAr ? 'ابتكار عالي' : 'High Innovation';
      case 'medium': return isAr ? 'ابتكار متوسط' : 'Medium Innovation';
      case 'low': return isAr ? 'ابتكار منخفض' : 'Low Innovation';
      default: return isAr ? 'غير محدد' : 'Undefined';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-b border-border/50">
        <div className="container py-8">
          <Link href={`/naqla1/ideas/${ideaId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 ml-2" />
              {isAr ? "العودة إلى تفاصيل الفكرة" : "Back to Idea Details"}
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{isAr ? "تحليل الفكرة بالذكاء الاصطناعي" : "AI Idea Analysis"}</h1>
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
                  <CardTitle className="text-2xl">{isAr ? "التقييم الشامل" : "Overall Assessment"}</CardTitle>
                  <CardDescription>{isAr ? "تقييم شامل للفكرة بناءً على 10 معايير" : "Comprehensive idea assessment based on 10 criteria"}</CardDescription>
                </div>
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center`}>
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Badge className={`text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0`}>
                  {analysis.classification === 'innovation' ? (isAr ? 'ابتكار حقيقي' : 'True Innovation') : analysis.classification === 'commercial' ? (isAr ? 'مشروع تجاري' : 'Commercial Project') : (isAr ? 'تحتاج تطوير' : 'Needs Development')}
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
                {isAr ? "مستوى النضج التقني" : "Technical Maturity Level"}
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
                {isAr ? "تحليل SWOT" : "SWOT Analysis"}
              </CardTitle>
              <CardDescription>{isAr ? "نقاط القوة والضعف والفرص والتهديدات" : "Strengths, Weaknesses, Opportunities, and Threats"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    {isAr ? "نقاط القوة" : "Strengths"}
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
                    {isAr ? "نقاط الضعف" : "Weaknesses"}
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
                    {isAr ? "الفرص" : "Opportunities"}
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
                    {isAr ? "التهديدات" : "Threats"}
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
                {isAr ? "التوصيات" : "Recommendations"}
              </CardTitle>
              <CardDescription>{isAr ? "خطوات مقترحة لتطوير فكرتك" : "Suggested steps to develop your idea"}</CardDescription>
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
                  {isAr ? "إمكانات السوق" : "Market Potential"}
                </CardTitle>
                <CardDescription>{isAr ? "تقييم الفرص التجارية والسوقية" : "Assessment of commercial and market opportunities"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">{isAr ? "حجم السوق" : "Market Size"}</p>
                    <p className="text-xl font-bold text-foreground">{analysis.marketSize}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">{isAr ? "مستوى المنافسة" : "Competition Level"}</p>
                    <p className="text-xl font-bold text-foreground">{analysis.competitionLevel}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground mb-1">{isAr ? "مستوى التعقيد" : "Complexity Level"}</p>
                    <p className="text-xl font-bold text-foreground">{analysis.complexityLevel}</p>
                  </div>
                </div>
                {marketTrends && marketTrends.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{isAr ? "اتجاهات السوق:" : "Market Trends:"}</p>
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

          {/* Next Steps - Based on Classification */}
          <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-2xl">{isAr ? "الخطوات التالية" : "Next Steps"}</CardTitle>
              <CardDescription>
                {analysis.classification === 'weak' 
                  ? (isAr ? 'يرجى إعادة الإرسال مع تحسين النقاط التالية' : 'Please resubmit with the following improvements')
                  : (isAr ? 'اختر المسار المناسب لفكرتك' : 'Choose the appropriate path for your idea')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* إذا كانت ضعيفة (Guidance Path) */}
              {analysis.classification === 'weak' && (
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{isAr ? "الفكرة تحتاج إلى تطوير" : "Idea needs development"}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {isAr ? "نقدر جهدك في تقديم هذه الفكرة، لكنها تحتاج إلى مزيد من التطوير قبل الانتقال للمراحل التالية." : "We appreciate your effort in submitting this idea, but it requires further development before proceeding to the next stages."}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">{isAr ? "التوصيات والتوجيهات:" : "Recommendations and Guidance:"}</p>
                          <ul className="space-y-1">
                            {recommendations.map((rec: string, i: number) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/naqla1/submit">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                      <Lightbulb className="w-4 h-4 ml-2" />
                      {isAr ? "إعادة تقديم الفكرة بعد التحسين" : "Resubmit idea after improvement"}
                    </Button>
                  </Link>
                </div>
              )}

              {/* إذا كانت تجارية 50-70% */}
              {analysis.classification === 'commercial' && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {isAr ? "مبروك! فكرتك تناسب أن تكون حل تجاري" : "Congratulations! Your idea is suitable as a commercial solution"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isAr ? "فكرتك حصلت على تقييم 50-70%. هل ترغب في الذهاب إلى:" : "Your idea scored 50-70%. Would you like to go to:"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* خيار 1: NAQLA 2 */}
                    <Button 
                      onClick={() => {
                        setTargetNaqla('naqla2');
                        setShowConfirmDialog(true);
                      }}
                      disabled={isPromoting}
                      className="w-full h-auto py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col items-start gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {isPromoting && targetNaqla === 'naqla2' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                        <span className="font-semibold">NAQLA 2</span>
                      </div>
                      <span className="text-xs text-white/80 text-right">
                        {isAr ? "مطابقة مع التحديات والفعاليات" : "Match with Challenges & Events"}
                      </span>
                    </Button>

                    {/* خيار 2: NAQLA 3 */}
                    <Button 
                      onClick={() => {
                        setTargetNaqla('naqla3');
                        setShowConfirmDialog(true);
                      }}
                      disabled={isPromoting}
                      className="w-full h-auto py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex flex-col items-start gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {isPromoting && targetNaqla === 'naqla3' ? <Loader2 className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                        <span className="font-semibold">NAQLA 3</span>
                      </div>
                      <span className="text-xs text-white/80 text-right">
                        {isAr ? "الذهاب مباشرة إلى سوق الابتكارات" : "Go to Innovation Marketplace"}
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              {/* إذا كانت ابتكار > 70% */}
              {analysis.classification === 'innovation' && (
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {isAr ? "مبروك! فكرتك تناسب أن تكون ابتكار" : "Congratulations! Your idea qualifies as an innovation."}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isAr ? "فكرتك حصلت على تقييم أعلى من 70%. هل ترغب في الذهاب إلى:" : "Your idea scored over 70%. Would you like to proceed to:"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* خيار 1: NAQLA 2 */}
                    <Button 
                      onClick={() => {
                        setTargetNaqla('naqla2');
                        setShowConfirmDialog(true);
                      }}
                      disabled={isPromoting}
                      className="w-full h-auto py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col items-start gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {isPromoting && targetNaqla === 'naqla2' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                        <span className="font-semibold">NAQLA 2</span>
                      </div>
                      <span className="text-xs text-white/80 text-right">
                        {isAr ? "مطابقة مع التحديات والفعاليات" : "Match with Challenges & Events"}
                      </span>
                    </Button>

                    {/* خيار 2: NAQLA 3 */}
                    <Button 
                      onClick={() => {
                        setTargetNaqla('naqla3');
                        setShowConfirmDialog(true);
                      }}
                      disabled={isPromoting}
                      className="w-full h-auto py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex flex-col items-start gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {isPromoting && targetNaqla === 'naqla3' ? <Loader2 className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                        <span className="font-semibold">NAQLA 3</span>
                      </div>
                      <span className="text-xs text-white/80 text-right">
                        {isAr ? "الذهاب مباشرة إلى سوق الابتكارات" : "Go to Innovation Marketplace"}
                      </span>
                    </Button>
                  </div>

                  {/* Confirmation Dialog */}
                  <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">
                          {isAr ? `تأكيد الانتقال إلى ${targetNaqla === 'naqla2' ? 'NAQLA 2' : 'NAQLA 3'}` : `Confirm Transition to ${targetNaqla === 'naqla2' ? 'NAQLA 2' : 'NAQLA 3'}`}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                          {targetNaqla === 'naqla2' ? (
                            isAr ? (
                              <>
                                سيتم إنشاء <strong>{isAr ? "مشروع جديد" : "New Project"}</strong> في NAQLA 2 بناءً على هذه الفكرة.
                                <br />
                                سيتم مطابقة المشروع مع التحديات والفعاليات المتاحة.
                              </>
                            ) : (
                              <>
                                A <strong>new project</strong> will be created in NAQLA 2 based on this idea.
                                <br />
                                The project will be matched with available challenges and events.
                              </>
                            )
                          ) : (
                            isAr ? (
                              <>
                                سيتم إنشاء <strong>{isAr ? isAr ? "أصل جديد" : "New Asset" : "New Asset"}</strong> في NAQLA 3 بناءً على هذه الفكرة.
                                <br />
                                سيتم عرض الأصل مباشرة في سوق الابتكارات للمستثمرين والشركاء.
                              </>
                            ) : (
                              <>
                                A <strong>new asset</strong> will be created in NAQLA 3 based on this idea.
                                <br />
                                The asset will be directly displayed in the innovation market for investors and partners.
                              </>
                            )
                          )}
                          <br />
                          <br />
                          {isAr ? "هل أنت متأكد من المتابعة؟" : "Are you sure you want to proceed?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      {/* User Notes Field */}
                      <div className="space-y-2 my-4">
                        <Label htmlFor="userNotes" className="text-right block">
                          {isAr ? "ملاحظات (اختياري)" : "Notes (optional)"}
                        </Label>
                        <Textarea
                          id="userNotes"
                          placeholder={isAr ? "اكتب سبب اختيارك لهذا المسار أو أي ملاحظات إضافية..." : "Enter reason for choosing this path or any additional notes..."}
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          className="min-h-[100px] text-right"
                          disabled={isPromoting}
                        />
                      </div>
                      
                      <AlertDialogFooter className="flex-row-reverse gap-2">
                        <AlertDialogAction onClick={handlePromote} disabled={isPromoting}>
                          {isPromoting ? (
                            <>
                              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                              {isAr ? "جاري الانتقال..." : "Redirecting..."}
                            </>
                          ) : (
                            isAr ? 'نعم، انتقل الآن' : 'Yes, proceed now'
                          )}
                        </AlertDialogAction>
                        <AlertDialogCancel disabled={isPromoting}>{isAr ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Timeline */}
                  <div className="mt-8">
                    <IdeaJourneyTimeline ideaId={ideaId} />
                  </div>

                  <div className="text-center mt-6">
                    <Link href={`/naqla1/ideas/${ideaId}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 ml-2" />
                        {isAr ? "العودة إلى تفاصيل الفكرة" : "Back to Idea Details"}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
