import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, Brain } from "lucide-react";
import AIAnalysisResults from "@/components/AIAnalysisResults";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubmitIdea() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    targetMarket: "",
    uniqueValue: "",
    challengeId: undefined as number | undefined,
  });
  
  // Fetch active challenges
  const { data: challenges } = trpc.challenge.getActiveChallenges.useQuery();
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const submitMutation = trpc.naqla1.submitIdea.useMutation({
    onSuccess: (data: any) => {
      setAnalysisResult(data);
    },
    onError: (error: any) => {
      alert(`خطأ: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('يجب تسجيل الدخول أولاً لتقديم فكرتك. سيتم توجيهك إلى صفحة تسجيل الدخول.');
      window.location.href = getLoginUrl();
      return;
    }
    
    submitMutation.mutate(formData);
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
        <div className="max-w-5xl mx-auto py-12">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => {
                setAnalysisResult(null);
                setFormData({
                  title: "",
                  description: "",
                  problem: "",
                  solution: "",
                  targetMarket: "",
                  uniqueValue: "",
                  challengeId: undefined,
                });
              }}
              className="border-gray-700 hover:bg-gray-800"
            >
              ← إرسال فكرة جديدة
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">نتائج التحليل</h1>
            <p className="text-gray-400">تم تحليل فكرتك باستخدام الذكاء الاصطناعي</p>
          </div>

          <AIAnalysisResults analysis={analysisResult} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto py-12">
        <Card className="glass-card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">قدّم فكرتك</h1>
              <p className="text-gray-400">سنحللها بالذكاء الاصطناعي خلال ثوانٍ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-white">
                عنوان الفكرة *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="مثال: منصة ذكية لإدارة الطاقة المنزلية"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">
                وصف الفكرة *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="اشرح فكرتك بالتفصيل..."
                rows={4}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="problem" className="text-white">
                المشكلة التي تحلها *
              </Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                required
                placeholder="ما المشكلة التي تعالجها فكرتك؟"
                rows={3}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="solution" className="text-white">
                الحل المقترح *
              </Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                required
                placeholder="كيف تحل فكرتك هذه المشكلة؟"
                rows={3}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="targetMarket" className="text-white">
                السوق المستهدف
              </Label>
              <Input
                id="targetMarket"
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="مثال: الأسر في المدن الكبرى"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="uniqueValue" className="text-white">
                القيمة الفريدة
              </Label>
              <Textarea
                id="uniqueValue"
                value={formData.uniqueValue}
                onChange={(e) => setFormData({ ...formData, uniqueValue: e.target.value })}
                placeholder="ما الذي يميز فكرتك عن الحلول الموجودة؟"
                rows={3}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            {/* Optional: Link to a challenge */}
            <div>
              <Label className="text-white">
                هل تريد ربط فكرتك بتحدٍ معين؟ (اختياري)
              </Label>
              <Select
                value={formData.challengeId?.toString() || "none"}
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    challengeId: value === "none" ? undefined : parseInt(value) 
                  });
                }}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="اختر تحدياً (اختياري)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="none" className="text-white">لا يوجد تحدٍ محدد</SelectItem>
                  {challenges?.map((challenge) => (
                    <SelectItem 
                      key={challenge.id} 
                      value={challenge.id.toString()}
                      className="text-white"
                    >
                      {challenge.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-400 mt-1">
                ربط فكرتك بتحدٍ يزيد من فرص ظهورها للمهتمين بهذا المجال
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  جاري التحليل بالذكاء الاصطناعي...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  تحليل الفكرة بالذكاء الاصطناعي
                </>
              )}
            </Button>
          </form>

          {submitMutation.isPending && (
            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                <h3 className="text-lg font-semibold text-white">جاري التحليل...</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ تحليل النص باستخدام NLP</p>
                <p>✓ مقارنة مع قاعدة البيانات</p>
                <p>✓ تقييم الجدة والابتكار</p>
                <p>✓ حساب إمكانات السوق</p>
                <p>✓ إنشاء التوصيات...</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
