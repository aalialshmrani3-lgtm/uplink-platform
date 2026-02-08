import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, TrendingUp, Tag, Lightbulb } from "lucide-react";

interface MatchCardProps {
  match: {
    matchId: number;
    userId: number;
    userName: string;
    score: number;
    reasons: string[];
    aiTags?: string[];
    status: string;
  };
  onAccept: (matchId: number) => void;
  onReject: (matchId: number) => void;
}

export default function MatchCard({ match, onAccept, onReject }: MatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 50) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'توافق ممتاز';
    if (score >= 50) return 'توافق جيد';
    return 'توافق ضعيف';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 50) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-cyan-500/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-xl mb-2">{match.userName}</CardTitle>
            
            {/* AI Match Score Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreColor(match.score)} ${getScoreBg(match.score)}`}>
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="text-2xl font-bold">{match.score}%</div>
                <div className="text-xs opacity-75">{getScoreLabel(match.score)}</div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={
              match.status === 'accepted' ? 'default' :
              match.status === 'rejected' ? 'destructive' :
              'secondary'
            }
            className="text-xs"
          >
            {match.status === 'accepted' && 'مقبول'}
            {match.status === 'rejected' && 'مرفوض'}
            {match.status === 'pending' && 'قيد الانتظار'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Tags Section */}
        {match.aiTags && match.aiTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <Tag className="w-4 h-4" />
              <span>علامات الذكاء الاصطناعي المشتركة</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {match.aiTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Match Reasons */}
        <div className="space-y-2">
          <div className="text-slate-400 text-sm font-semibold">لماذا تم المطابقة؟</div>
          <ul className="space-y-1">
            {match.reasons.map((reason, index) => (
              <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        {match.status === 'pending' && (
          <div className="flex gap-2 pt-4 border-t border-slate-800">
            <Button
              onClick={() => onAccept(match.matchId)}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              قبول المطابقة
            </Button>
            <Button
              onClick={() => onReject(match.matchId)}
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <XCircle className="w-4 h-4 mr-2" />
              رفض
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
