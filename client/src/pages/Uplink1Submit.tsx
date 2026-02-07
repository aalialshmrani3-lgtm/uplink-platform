import { useState } from "react";
import { useLocation } from "wouter";
import { Lightbulb, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Uplink1Submit() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  // Using toast from sonner

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    targetMarket: "",
    uniqueValue: "",
    category: "technology",
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const submitIdea = trpc.uplink1.submitIdea.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ تم إرسال الفكرة بنجاح",
        description: "جاري تحليل فكرتك بواسطة الذكاء الاصطناعي...",
      });
      
      // Start analysis
      analyzeIdea.mutate({ ideaId: data.ideaId });
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في إرسال الفكرة",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeIdea = trpc.uplink1.analyzeIdea.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ تم التحليل بنجاح",
        description: "يمكنك الآن عرض نتائج التحليل",
      });
      
      // Navigate to analysis results
      setLocation(`/uplink1/analysis/${data.analysisId}`);
    },
    onError: (error) => {
      toast({
        title: "❌ فشل في التحليل",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }

    // Validate step 1
    if (step === 1) {
      if (!formData.title || formData.title.length < 10) {
        toast({
          title: "⚠️ العنوان قصير جداً",
          description: "يجب أن يكون العنوان 10 أحرف على الأقل",
          variant: "destructive",
        });
        return;
      }
      if (!formData.description || formData.description.length < 50) {
        toast({
          title: "⚠️ الوصف قصير جداً",
          description: "يجب أن يكون الوصف 50 حرفاً على الأقل",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      return;
    }

    // Validate step 2
    if (step === 2) {
      if (!formData.problem || formData.problem.length < 30) {
        toast({
          title: "⚠️ وصف المشكلة قصير جداً",
          description: "يجب أن يكون وصف المشكلة 30 حرفاً على الأقل",
          variant: "destructive",
        });
        return;
      }
      if (!formData.solution || formData.solution.length < 30) {
        toast({
          title: "⚠️ وصف الحل قصير جداً",
          description: "يجب أن يكون وصف الحل 30 حرفاً على الأقل",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
      return;
    }

    // Submit idea
    submitIdea.mutate(formData);
  };

  const isLoading = submitIdea.isPending || analyzeIdea.isPending;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white/5 backdrop-blur-xl border-white/10">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold text-white mb-4">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-300 mb-6">
            يجب عليك تسجيل الدخول لإرسال فكرتك والحصول على تحليل ذكي مجاني
          </p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            تسجيل الدخول
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            أرسل فكرتك الآن
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            احصل على تحليل ذكي مجاني لفكرتك خلال دقائق
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? "bg-green-500 text-white"
                      : s === step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                {s < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? "bg-green-500" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>المعلومات الأساسية</span>
            <span>المشكلة والحل</span>
            <span>التفاصيل الإضافية</span>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <Label htmlFor="title" className="text-white text-lg mb-2 block">
                    عنوان الفكرة *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="مثال: تطبيق ذكي لإدارة النفايات"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg h-14"
                    required
                    minLength={10}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.title.length}/10 حرف على الأقل
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white text-lg mb-2 block">
                    وصف مختصر للفكرة *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="اشرح فكرتك بشكل مختصر وواضح..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg min-h-32"
                    required
                    minLength={50}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.description.length}/50 حرف على الأقل
                  </p>
                </div>

                <div>
                  <Label htmlFor="category" className="text-white text-lg mb-2 block">
                    التصنيف
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-4 py-3 text-lg"
                  >
                    <option value="technology">تقنية</option>
                    <option value="health">صحة</option>
                    <option value="education">تعليم</option>
                    <option value="environment">بيئة</option>
                    <option value="energy">طاقة</option>
                    <option value="transportation">نقل</option>
                    <option value="agriculture">زراعة</option>
                    <option value="finance">مالية</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Problem & Solution */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <Label htmlFor="problem" className="text-white text-lg mb-2 block">
                    ما هي المشكلة التي تحلها؟ *
                  </Label>
                  <Textarea
                    id="problem"
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    placeholder="اشرح المشكلة بالتفصيل..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg min-h-40"
                    required
                    minLength={30}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.problem.length}/30 حرف على الأقل
                  </p>
                </div>

                <div>
                  <Label htmlFor="solution" className="text-white text-lg mb-2 block">
                    كيف تحل هذه المشكلة؟ *
                  </Label>
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    placeholder="اشرح الحل المقترح بالتفصيل..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg min-h-40"
                    required
                    minLength={30}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.solution.length}/30 حرف على الأقل
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <Label htmlFor="targetMarket" className="text-white text-lg mb-2 block">
                    السوق المستهدف (اختياري)
                  </Label>
                  <Input
                    id="targetMarket"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleChange}
                    placeholder="مثال: الشركات الصغيرة والمتوسطة في السعودية"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg h-14"
                  />
                </div>

                <div>
                  <Label htmlFor="uniqueValue" className="text-white text-lg mb-2 block">
                    القيمة الفريدة (اختياري)
                  </Label>
                  <Textarea
                    id="uniqueValue"
                    name="uniqueValue"
                    value={formData.uniqueValue}
                    onChange={handleChange}
                    placeholder="ما الذي يميز فكرتك عن الحلول الموجودة؟"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg min-h-32"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-2">ملاحظة مهمة</h3>
                      <p className="text-gray-300">
                        سيتم تحليل فكرتك بواسطة الذكاء الاصطناعي بناءً على <strong>10 معايير</strong> شاملة.
                        النتيجة ستحدد مستوى فكرتك وتوجهك للخطوات التالية.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="flex-1 h-14 text-lg border-white/20 text-white hover:bg-white/10"
                  disabled={isLoading}
                >
                  السابق
                </Button>
              )}
              
              <Button
                type="submit"
                className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {submitIdea.isPending ? "جاري الإرسال..." : "جاري التحليل..."}
                  </>
                ) : step < totalSteps ? (
                  "التالي"
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    إرسال وتحليل الفكرة
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">تحليل ذكي</h3>
              <p className="text-sm text-gray-400">
                تحليل شامل بـ 10 معايير تقييم
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-2">نتائج فورية</h3>
              <p className="text-sm text-gray-400">
                احصل على النتائج خلال دقائق
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">خطوات واضحة</h3>
              <p className="text-sm text-gray-400">
                توجيه دقيق للخطوات التالية
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
