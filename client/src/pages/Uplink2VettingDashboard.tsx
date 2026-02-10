import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Scale, 
  Cpu, 
  TrendingUp,
  Eye,
  Clock
} from "lucide-react";

export default function Uplink2VettingDashboard() {
  const [selectedIP, setSelectedIP] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState({
    score: 75,
    noveltyScore: 75,
    feasibilityScore: 75,
    marketPotentialScore: 75,
    comments: "",
    recommendation: "approve" as "approve" | "reject" | "needs_revision",
    revisionSuggestions: "",
  });

  // Fetch pending IPs for vetting
  const { data: pendingIPs, isLoading } = trpc.uplink2.vetting.getPendingIPs.useQuery();
  
  // Submit review mutation
  const submitReview = trpc.uplink2.vetting.submitReview.useMutation({
    onSuccess: () => {
      alert("تم تقديم المراجعة بنجاح!");
      setSelectedIP(null);
      setReviewForm({
        score: 75,
        noveltyScore: 75,
        feasibilityScore: 75,
        marketPotentialScore: 75,
        comments: "",
        recommendation: "approve",
        revisionSuggestions: "",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!selectedIP) return;
    
    submitReview.mutate({
      ipRegistrationId: selectedIP,
      score: reviewForm.score,
      noveltyScore: reviewForm.noveltyScore,
      feasibilityScore: reviewForm.feasibilityScore,
      marketPotentialScore: reviewForm.marketPotentialScore,
      comments: reviewForm.comments,
      recommendation: reviewForm.recommendation,
      revisionSuggestions: reviewForm.revisionSuggestions,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            UPLINK 2: لوحة مراجعة الملكية الفكرية
          </h1>
          <p className="text-xl text-blue-200">
            مراجعة وتقييم الملكيات الفكرية المسجلة من UPLINK1
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-yellow-400" />
              <div>
                <div className="text-3xl font-bold text-white">{pendingIPs?.length || 0}</div>
                <div className="text-sm text-blue-200">قيد الانتظار</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <Scale className="w-10 h-10 text-blue-400" />
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-blue-200">مراجعة قانونية</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <Cpu className="w-10 h-10 text-purple-400" />
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-blue-200">مراجعة فنية</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-green-400" />
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-blue-200">مراجعة تجارية</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Pending IPs List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              الملكيات الفكرية المنتظرة
            </h2>

            {pendingIPs && pendingIPs.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-white text-lg">لا توجد ملكيات فكرية منتظرة للمراجعة</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingIPs?.map((ip: any) => (
                  <Card
                    key={ip.id}
                    className={`bg-white/10 backdrop-blur-lg border-white/20 p-6 cursor-pointer transition-all ${
                      selectedIP === ip.id ? "ring-2 ring-blue-400" : ""
                    }`}
                    onClick={() => setSelectedIP(ip.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{ip.title}</h3>
                        <Badge className="bg-blue-500 text-white">
                          {ip.type === "patent" ? "براءة اختراع" :
                           ip.type === "trademark" ? "علامة تجارية" :
                           ip.type === "copyright" ? "حقوق نشر" :
                           ip.type === "trade_secret" ? "سر تجاري" : "تصميم صناعي"}
                        </Badge>
                      </div>
                      <Eye className="w-5 h-5 text-blue-300" />
                    </div>

                    <p className="text-blue-100 text-sm mb-3 line-clamp-2">{ip.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">
                        تاريخ التقديم: {new Date(ip.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        {ip.status === "submitted" ? "مقدم" : "قيد المراجعة"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right: Review Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">نموذج المراجعة</h2>

            {!selectedIP ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-white text-lg">اختر ملكية فكرية من القائمة لبدء المراجعة</p>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 space-y-6">
                {/* Overall Score */}
                <div>
                  <Label className="text-white text-lg mb-2 block">الدرجة الإجمالية (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={reviewForm.score}
                    onChange={(e) => setReviewForm({ ...reviewForm, score: parseInt(e.target.value) })}
                    className="bg-white/20 border-white/30 text-white text-2xl text-center"
                  />
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white text-sm mb-1 block">الجدة</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.noveltyScore}
                      onChange={(e) => setReviewForm({ ...reviewForm, noveltyScore: parseInt(e.target.value) })}
                      className="bg-white/20 border-white/30 text-white text-center"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm mb-1 block">الجدوى</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.feasibilityScore}
                      onChange={(e) => setReviewForm({ ...reviewForm, feasibilityScore: parseInt(e.target.value) })}
                      className="bg-white/20 border-white/30 text-white text-center"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm mb-1 block">السوق</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.marketPotentialScore}
                      onChange={(e) => setReviewForm({ ...reviewForm, marketPotentialScore: parseInt(e.target.value) })}
                      className="bg-white/20 border-white/30 text-white text-center"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Label className="text-white text-lg mb-2 block">ملاحظات المراجعة</Label>
                  <Textarea
                    value={reviewForm.comments}
                    onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                    placeholder="أدخل ملاحظاتك التفصيلية..."
                    className="bg-white/20 border-white/30 text-white min-h-[120px]"
                  />
                </div>

                {/* Recommendation */}
                <div>
                  <Label className="text-white text-lg mb-2 block">التوصية</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={reviewForm.recommendation === "approve" ? "default" : "outline"}
                      onClick={() => setReviewForm({ ...reviewForm, recommendation: "approve" })}
                      className={reviewForm.recommendation === "approve" 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-white/20 border-white/30 text-white hover:bg-white/30"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      موافقة
                    </Button>

                    <Button
                      variant={reviewForm.recommendation === "needs_revision" ? "default" : "outline"}
                      onClick={() => setReviewForm({ ...reviewForm, recommendation: "needs_revision" })}
                      className={reviewForm.recommendation === "needs_revision" 
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                        : "bg-white/20 border-white/30 text-white hover:bg-white/30"}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      يحتاج تعديل
                    </Button>

                    <Button
                      variant={reviewForm.recommendation === "reject" ? "default" : "outline"}
                      onClick={() => setReviewForm({ ...reviewForm, recommendation: "reject" })}
                      className={reviewForm.recommendation === "reject" 
                        ? "bg-red-600 hover:bg-red-700 text-white" 
                        : "bg-white/20 border-white/30 text-white hover:bg-white/30"}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      رفض
                    </Button>
                  </div>
                </div>

                {/* Revision Suggestions (if needs_revision) */}
                {reviewForm.recommendation === "needs_revision" && (
                  <div>
                    <Label className="text-white text-lg mb-2 block">اقتراحات التعديل</Label>
                    <Textarea
                      value={reviewForm.revisionSuggestions}
                      onChange={(e) => setReviewForm({ ...reviewForm, revisionSuggestions: e.target.value })}
                      placeholder="أدخل اقتراحاتك للتحسين..."
                      className="bg-white/20 border-white/30 text-white min-h-[100px]"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitReview}
                  disabled={submitReview.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6"
                >
                  {submitReview.isPending ? "جاري الإرسال..." : "تقديم المراجعة"}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
