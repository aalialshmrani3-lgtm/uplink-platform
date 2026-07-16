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
import { toast } from 'sonner';
import { useLanguage } from "@/contexts/LanguageContext";

export default function SubmitIdea() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
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
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً لتقديم فكرتك');
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
            <h1 className="text-4xl font-bold text-white mb-2">{isAr ? isAr ? "نتائج التحليل" : "Analysis Results" : "Analysis Results"}</h1>
            <p className="text-gray-400">{isAr ? isAr ? "تم تحليل فكرتك باستخدام الذكاء الاصطناعي" : "Your idea has been analyzed by AI" : "Your idea has been analyzed by AI"}</p>
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
              <h1 className="text-3xl font-bold text-white">{isAr ? isAr ? "قدّم فكرتك" : "Submit Your Idea" : "Submit Your Idea"}</h1>
              <p className="text-gray-400">{isAr ? isAr ? "سنحللها بالذكاء الاصطناعي خلال ثوانٍ" : "We'll analyze it with AI in seconds" : "We'll analyze it with AI in seconds"}</p>
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
                placeholder={isAr ? "مثال: منصة ذكية لإدارة الطاقة المنزلية" : "Example: Smart home energy management platform"}
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
                placeholder={isAr ? "اشرح فكرتك بالتفصيل..." : "Describe your idea in detail..."}
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
                placeholder={isAr ? "ما المشكلة التي تعالجها فكرتك؟" : "What problem does your idea solve?"}
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
                placeholder={isAr ? "كيف تحل فكرتك هذه المشكلة؟" : "How does your idea solve this problem?"}
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
                placeholder={isAr ? "مثال: الأسر في المدن الكبرى" : "Example: Families in major cities"}
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
                placeholder={isAr ? "ما الذي يميز فكرتك عن الحلول الموجودة؟" : "What makes your idea unique?"}
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
                  <SelectValue placeholder={isAr ? "اختر تحدياً (اختياري)" : "Select a Challenge (Optional)"} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="none" className="text-white">{isAr ? isAr ? "لا يوجد تحدٍ محدد" : "No specific challenge" : "No specific challenge"}</SelectItem>
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
                <h3 className="text-lg font-semibold text-white">{isAr ? isAr ? "جاري التحليل..." : "Analyzing..." : "Analyzing..."}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p>{isAr ? isAr ? "✓ تحليل النص باستخدام NLP" : "✓ Text analysis using NLP" : "✓ Text analysis using NLP"}</p>
                <p>{isAr ? isAr ? "✓ مقارنة مع قاعدة البيانات" : "✓ Database comparison" : "✓ Database comparison"}</p>
                <p>{isAr ? isAr ? "✓ تقييم الجدة والابتكار" : "✓ Novelty & innovation assessment" : "✓ Novelty & innovation assessment"}</p>
                <p>{isAr ? isAr ? "✓ حساب إمكانات السوق" : "✓ Market potential calculation" : "✓ Market potential calculation"}</p>
                <p>{isAr ? isAr ? "✓ إنشاء التوصيات..." : "✓ Generating recommendations..." : "✓ Generating recommendations..."}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
