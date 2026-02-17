import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import UserChoiceDialog from "@/components/UserChoiceDialog";

interface AIAnalysisResultsProps {
  analysis: {
    technicalNoveltyScore: number;
    technicalFeasibilityScore: number;
    commercialValueScore: number;
    overallScore: number;
    classification: "innovation" | "commercial" | "guidance";
    classificationPath?: string;
    suggestedPartner?: string;
    tags: string[];
    recommendations: string[];
    nextSteps: string;
    recommendedPath?: "uplink2" | "uplink3" | "both" | "guidance";
    pathRecommendations?: {
      uplink2?: string;
      uplink3?: string;
      guidance?: string;
    };
  };
  ideaId?: number;
}

export default function AIAnalysisResults({ analysis, ideaId }: AIAnalysisResultsProps) {
  const [, setLocation] = useLocation();
  const [showChoiceDialog, setShowChoiceDialog] = useState(false);

  // إظهار dialog عند الدرجة ≥ 60%
  useEffect(() => {
    if (analysis.overallScore >= 60 && ideaId) {
      setShowChoiceDialog(true);
    }
  }, [analysis.overallScore, ideaId]);

  const getClassificationConfig = () => {
    switch (analysis.classification) {
      case "innovation":
        return {
          icon: CheckCircle2,
          title: "ابتكار حقيقي",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          description: "تحقق معايير الابتكار الصارمة",
          action: "انتقل إلى UPLINK 2",
          actionLink: "/uplink2",
        };
      case "commercial":
        return {
          icon: AlertCircle,
          title: "مشروع تجاري / حل جزئي",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          description: "قيمة تجارية واضحة",
          action: "انتقل إلى شبكة المطابقة",
          actionLink: "/uplink2/matching",
        };
      case "guidance":
        return {
          icon: AlertCircle,
          title: "مسار التوجيه والإرشاد",
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          description: "نوصي بالحصول على توجيه ودعم إضافي",
          action: "احصل على توجيه",
          actionLink: "/strategic-partners",
        };
      default:
        return {
          icon: AlertCircle,
          title: "غير محدد",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          description: "تحليل غير مكتمل",
          action: "إعادة المحاولة",
          actionLink: "/uplink1/submit",
        };
    }
  };

  const config = getClassificationConfig();
  const StatusIcon = config.icon;

  return (
    <>
      <UserChoiceDialog
        open={showChoiceDialog}
        onOpenChange={setShowChoiceDialog}
        ideaId={ideaId || 0}
        overallScore={analysis.overallScore}
        recommendedPath={analysis.recommendedPath}
        pathRecommendations={analysis.pathRecommendations}
      />
      <div className="space-y-6 animate-fade-in">
      {/* Overall Status Card */}
      <Card className={`glass-card p-8 border-2 ${config.borderColor}`}>
        <div className="flex items-start gap-6">
          <div className={`w-20 h-20 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
            <StatusIcon className={`w-10 h-10 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">{config.title}</h3>
            <p className="text-gray-400 mb-2">{config.description}</p>
            {analysis.suggestedPartner && (
              <p className="text-sm text-blue-300 mb-4">
                <span className="font-semibold">الشريك المقترح:</span> {analysis.suggestedPartner}
              </p>
            )}
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">التقييم الإجمالي</div>
                <div className="text-4xl font-bold text-white">{analysis.overallScore}%</div>
              </div>
              <Button
                onClick={() => setLocation(config.actionLink)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {config.action}
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Scores Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">الجدة والابتكار</div>
              <div className="text-2xl font-bold text-white">{analysis.technicalNoveltyScore}%</div>
            </div>
          </div>
          <Progress value={analysis.technicalNoveltyScore} className="h-2" />
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">الجدوى التقنية</div>
              <div className="text-2xl font-bold text-white">{analysis.technicalFeasibilityScore}%</div>
            </div>
          </div>
          <Progress value={analysis.technicalFeasibilityScore} className="h-2" />
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">القيمة التجارية</div>
              <div className="text-2xl font-bold text-white">{analysis.commercialValueScore}%</div>
            </div>
          </div>
          <Progress value={analysis.commercialValueScore} className="h-2" />
        </Card>
      </div>

      {/* Tags */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">التصنيفات</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.tags && analysis.tags.length > 0 ? (
            analysis.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-500/10 text-blue-300 border border-blue-500/30"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <p className="text-gray-400 text-sm">لا توجد تصنيفات متاحة</p>
          )}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="glass-card p-6" id="recommendations">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h4 className="text-lg font-semibold text-white">التوصيات</h4>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-400">{index + 1}</span>
                </div>
                <span>{recommendation}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-sm">لا توجد توصيات متاحة</p>
          )}
        </ul>
      </Card>

      {/* Next Steps */}
      <Card className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <h4 className="text-lg font-semibold text-white mb-3">الخطوات التالية</h4>
        <p className="text-gray-300">{analysis.nextSteps}</p>
      </Card>
    </div>
    </>
  );
}
