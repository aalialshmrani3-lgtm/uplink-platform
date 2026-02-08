import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, ArrowLeft, Star, TrendingUp, 
  CheckCircle, Target, AlertTriangle, Zap,
  Eye, Calendar, User
} from 'lucide-react';

export default function Uplink1IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const ideaId = parseInt(id || '0');
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: idea, isLoading } = trpc.uplink1.getIdeaById.useQuery({ ideaId });
  const { data: analysis } = trpc.uplink1.getAnalysisResult.useQuery({ ideaId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 text-lg">الفكرة غير موجودة</p>
            <Button onClick={() => navigate('/uplink1/browse')} className="mt-4">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInnovationLevelBadge = (score: number) => {
    if (score >= 80) return { label: 'عالي جداً', color: 'bg-purple-500' };
    if (score >= 60) return { label: 'عالي', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'متوسط', color: 'bg-yellow-500' };
    return { label: 'منخفض', color: 'bg-gray-500' };
  };

  const innovationScore = parseFloat(idea.innovationScore || '0');
  const innovationLevel = getInnovationLevelBadge(innovationScore);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="container max-w-5xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/uplink1/browse')}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة إلى الأفكار
        </Button>

        {/* Idea Header */}
        <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-3xl mb-2">{idea.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(idea.submittedAt).toLocaleDateString('ar-SA')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {idea.views || 0} مشاهدة
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={`${innovationLevel.color} text-white border-0 text-lg px-4 py-2`}>
                <Star className="w-4 h-4 ml-2" />
                {innovationLevel.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300 text-lg leading-relaxed">
              {idea.description}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-emerald-950/30 backdrop-blur-xl border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-emerald-400 text-sm">الابتكار</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-400">
                {innovationScore.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/30 backdrop-blur-xl border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm">السوق</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-400">
                {parseFloat(idea.marketScore || '0').toFixed(0)}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-purple-950/30 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">الجدوى</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-400">
                {parseFloat(idea.feasibilityScore || '0').toFixed(0)}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-cyan-950/30 backdrop-blur-xl border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 text-sm">الإجمالي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-cyan-400">
                {parseFloat(idea.overallScore || '0').toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis */}
        {analysis && (
          <div className="space-y-6">
            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    نقاط القوة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    نقاط الضعف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-500" />
                    التوصيات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-500 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            {analysis.nextSteps && analysis.nextSteps.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    الخطوات التالية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.nextSteps.map((step: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-purple-500 font-bold mt-1">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
