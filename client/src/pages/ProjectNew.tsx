import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Rocket, Lightbulb, ArrowRight, ArrowLeft, Check, 
  Target, Users, DollarSign, Zap
} from "lucide-react";

export default function ProjectNew() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    category: "",
    subCategory: "",
    stage: "" as "idea" | "prototype" | "mvp" | "growth" | "scale" | "",
    teamSize: "",
    fundingNeeded: "",
    targetMarket: "",
    competitiveAdvantage: "",
    businessModel: "",
    tags: [] as string[],
    tagInput: "",
  });

  const createProjectMutation = trpc.project.create.useMutation({
    onSuccess: (data) => {
      toast.success("تم إنشاء المشروع بنجاح!", {
        description: "يمكنك الآن تقديمه للتقييم",
      });
      setLocation(`/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error("حدث خطأ", { description: error.message });
    },
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addTag = () => {
    if (formData.tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: "",
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    createProjectMutation.mutate({
      title: formData.title,
      titleEn: formData.titleEn || undefined,
      description: formData.description,
      descriptionEn: formData.descriptionEn || undefined,
      category: formData.category || undefined,
      subCategory: formData.subCategory || undefined,
      stage: formData.stage as any || undefined,
      teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined,
      fundingNeeded: formData.fundingNeeded || undefined,
      targetMarket: formData.targetMarket || undefined,
      competitiveAdvantage: formData.competitiveAdvantage || undefined,
      businessModel: formData.businessModel || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NAQLA 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              العودة للوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm">تسجيل ابتكار جديد</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">مشروع جديد</h1>
          <p className="text-slate-400">سجّل ابتكارك واحصل على تقييم AI متقدم</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { id: 1, title: "المعلومات الأساسية" },
            { id: 2, title: "التفاصيل" },
            { id: 3, title: "المراجعة" },
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentStep >= step.id 
                  ? "bg-cyan-500/20 border border-cyan-500/50" 
                  : "bg-slate-800/50 border border-slate-700"
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  currentStep >= step.id ? "bg-cyan-500 text-white" : "bg-slate-700 text-slate-400"
                }`}>
                  {step.id}
                </span>
                <span className={`text-sm ${currentStep >= step.id ? "text-cyan-400" : "text-slate-500"}`}>
                  {step.title}
                </span>
              </div>
              {index < 2 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? "bg-cyan-500" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">عنوان المشروع (عربي) *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="عنوان ابتكارك"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">عنوان المشروع (إنجليزي)</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Project title in English"
                      className="bg-slate-900 border-slate-700 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">وصف المشروع (عربي) *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اشرح فكرتك بالتفصيل... ما المشكلة التي تحلها؟ كيف يعمل الحل؟"
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">وصف المشروع (إنجليزي)</Label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Describe your project in English..."
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                    dir="ltr"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">التصنيف</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">تقنية المعلومات</SelectItem>
                        <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
                        <SelectItem value="fintech">التقنية المالية</SelectItem>
                        <SelectItem value="education">التعليم</SelectItem>
                        <SelectItem value="energy">الطاقة</SelectItem>
                        <SelectItem value="agriculture">الزراعة</SelectItem>
                        <SelectItem value="manufacturing">التصنيع</SelectItem>
                        <SelectItem value="logistics">اللوجستيات</SelectItem>
                        <SelectItem value="entertainment">الترفيه</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">مرحلة المشروع</Label>
                    <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v as any })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="اختر المرحلة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">فكرة</SelectItem>
                        <SelectItem value="prototype">نموذج أولي</SelectItem>
                        <SelectItem value="mvp">منتج قابل للتطبيق (MVP)</SelectItem>
                        <SelectItem value="growth">نمو</SelectItem>
                        <SelectItem value="scale">توسع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">حجم الفريق</Label>
                    <Input
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      placeholder="عدد أعضاء الفريق"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">التمويل المطلوب (ريال)</Label>
                    <Input
                      value={formData.fundingNeeded}
                      onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                      placeholder="مثال: 500000"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">السوق المستهدف</Label>
                  <Textarea
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                    placeholder="من هم عملاؤك المستهدفون؟ ما حجم السوق؟"
                    className="bg-slate-900 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">الميزة التنافسية</Label>
                  <Textarea
                    value={formData.competitiveAdvantage}
                    onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
                    placeholder="ما الذي يميز مشروعك عن المنافسين؟"
                    className="bg-slate-900 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">نموذج العمل</Label>
                  <Textarea
                    value={formData.businessModel}
                    onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                    placeholder="كيف ستحقق الإيرادات؟"
                    className="bg-slate-900 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">الوسوم</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      placeholder="أضف وسم"
                      className="bg-slate-900 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="border-slate-700">
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">مراجعة المشروع</h2>
                  <p className="text-slate-400">راجع المعلومات قبل الإنشاء</p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">عنوان المشروع</p>
                    <p className="text-white text-lg font-medium">{formData.title}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">التصنيف</p>
                      <p className="text-white">{formData.category || "غير محدد"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">المرحلة</p>
                      <p className="text-white">
                        {formData.stage === "idea" && "فكرة"}
                        {formData.stage === "prototype" && "نموذج أولي"}
                        {formData.stage === "mvp" && "MVP"}
                        {formData.stage === "growth" && "نمو"}
                        {formData.stage === "scale" && "توسع"}
                        {!formData.stage && "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">حجم الفريق</p>
                      <p className="text-white">{formData.teamSize || "غير محدد"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">الوصف</p>
                    <p className="text-white text-sm">{formData.description}</p>
                  </div>

                  {formData.fundingNeeded && (
                    <div>
                      <p className="text-slate-400 text-sm">التمويل المطلوب</p>
                      <p className="text-white">{parseInt(formData.fundingNeeded).toLocaleString()} ريال</p>
                    </div>
                  )}

                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">الوسوم</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-cyan-400 mt-1" />
                    <div>
                      <p className="text-cyan-400 font-medium">تقييم AI متقدم</p>
                      <p className="text-slate-300 text-sm">
                        بعد إنشاء المشروع، يمكنك تقديمه للحصول على تقييم ذكاء اصطناعي شامل يحدد مسار ابتكارك
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="border-slate-700 text-slate-300"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                السابق
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && (!formData.title || !formData.description)}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  التالي
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createProjectMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {createProjectMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 ml-2" />
                      إنشاء المشروع
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
