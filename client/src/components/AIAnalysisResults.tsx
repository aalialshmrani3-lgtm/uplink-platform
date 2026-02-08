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

interface AIAnalysisResultsProps {
  analysis: {
    innovationScore: number;
    feasibilityScore: number;
    marketPotentialScore: number;
    overallScore: number;
    classification: "innovation" | "commercial" | "needs_development";
    tags: string[];
    recommendations: string[];
    nextSteps: string;
  };
}

export default function AIAnalysisResults({ analysis }: AIAnalysisResultsProps) {
  const [, setLocation] = useLocation();

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
      case "needs_development":
        return {
          icon: XCircle,
          title: "تحتاج تطوير",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          description: "راجع التوصيات للتحسين",
          action: "راجع التوصيات",
          actionLink: "#recommendations",
        };
    }
  };

  const config = getClassificationConfig();
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Status Card */}
      <Card className={`glass-card p-8 border-2 ${config.borderColor}`}>
        <div className="flex items-start gap-6">
          <div className={`w-20 h-20 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
            <StatusIcon className={`w-10 h-10 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">{config.title}</h3>
            <p className="text-gray-400 mb-4">{config.description}</p>
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
              <div className="text-2xl font-bold text-white">{analysis.innovationScore}%</div>
            </div>
          </div>
          <Progress value={analysis.innovationScore} className="h-2" />
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">الجدوى التقنية</div>
              <div className="text-2xl font-bold text-white">{analysis.feasibilityScore}%</div>
            </div>
          </div>
          <Progress value={analysis.feasibilityScore} className="h-2" />
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">إمكانات السوق</div>
              <div className="text-2xl font-bold text-white">{analysis.marketPotentialScore}%</div>
            </div>
          </div>
          <Progress value={analysis.marketPotentialScore} className="h-2" />
        </Card>
      </div>

      {/* Tags */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">التصنيفات</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-500/10 text-blue-300 border border-blue-500/30"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="glass-card p-6" id="recommendations">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h4 className="text-lg font-semibold text-white">التوصيات</h4>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-300">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-400">{index + 1}</span>
              </div>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Next Steps */}
      <Card className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <h4 className="text-lg font-semibold text-white mb-3">الخطوات التالية</h4>
        <p className="text-gray-300">{analysis.nextSteps}</p>
      </Card>
    </div>
  );
}
