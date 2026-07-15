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
import { useLanguage } from "@/contexts/LanguageContext"; // Rule 1: Add import

export default function ProjectNew() {
  const { language } = useLanguage(); // Rule 2: Add language context
  const isAr = language === 'ar'; // Rule 2: Add isAr

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
      toast.success(isAr ? "تم إنشاء المشروع بنجاح!" : "Project created successfully!", { // Rule 3
        description: isAr ? "يمكنك الآن تقديمه للتقييم" : "You can now submit it for evaluation", // Rule 3
      });
      setLocation(`/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(isAr ? "حدث خطأ" : "An error occurred", { description: error.message }); // Rule 3
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
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields"); // Rule 3
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

  // Rule 5: Conditional array for progress steps
  const progressSteps = isAr
    ? [
        { id: 1, title: "المعلومات الأساسية" },
        { id: 2, title: "التفاصيل" },
        { id: 3, title: "المراجعة" },
      ]
    : [
        { id: 1, title: "Basic Information" },
        { id: 2, title: "Details" },
        { id: 3, title: "Review" },
      ];

  // Rule 5: Conditional array for categories
  const categories = isAr
    ? [
        { value: "technology", label: "تقنية المعلومات" },
        { value: "healthcare", label: "الرعاية الصحية" },
        { value: "fintech", label: "التقنية المالية" },
        { value: "education", label: "التعليم" },
        { value: "energy", label: "الطاقة" },
        { value: "agriculture", label: "الزراعة" },
        { value: "manufacturing", label: "التصنيع" },
        { value: "logistics", label: "اللوجستيات" },
        { value: "entertainment", label: "الترفيه" },
        { value: "other", label: "أخرى" },
      ]
    : [
        { value: "technology", label: "Information Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "fintech", label: "Fintech" },
        { value: "education", label: "Education" },
        { value: "energy", label: "Energy" },
        { value: "agriculture", label: "Agriculture" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "logistics", label: "Logistics" },
        { value: "entertainment", label: "Entertainment" },
        { value: "other", label: "Other" },
      ];

  // Rule 5: Conditional array for stages
  const stages = isAr
    ? [
        { value: "idea", label: "فكرة" },
        { value: "prototype", label: "نموذج أولي" },
        { value: "mvp", label: "منتج قابل للتطبيق (MVP)" },
        { value: "growth", label: "نمو" },
        { value: "scale", label: "توسع" },
      ]
    : [
        { value: "idea", label: "Idea" },
        { value: "prototype", label: "Prototype" },
        { value: "mvp", label: "Minimum Viable Product (MVP)" },
        { value: "growth", label: "Growth" },
        { value: "scale", label: "Scale" },
      ];


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
              {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm">
              {isAr ? "تسجيل ابتكار جديد" : "Register a New Innovation"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isAr ? "مشروع جديد" : "New Project"}
          </h1>
          <p className="text-slate-400">
            {isAr ? "سجّل ابتكارك واحصل على تقييم AI متقدم" : "Register your innovation and get advanced AI evaluation"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {progressSteps.map((step, index) => ( // Rule 5: Use conditional array
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
                    <Label className="text-slate-300">
                      {isAr ? "عنوان المشروع (عربي) *" : "Project Title (Arabic) *"}
                    </Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={isAr ? "عنوان ابتكارك" : "Your innovation title"}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      {isAr ? "عنوان المشروع (إنجليزي)" : "Project Title (English)"}
                    </Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Project title in English" // Already English, keep as is.
                      className="bg-slate-900 border-slate-700 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {isAr ? "وصف المشروع (عربي) *" : "Project Description (Arabic) *"}
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={isAr ? "اشرح فكرتك بالتفصيل... ما المشكلة التي تحلها؟ كيف يعمل الحل؟" : "Explain your idea in detail... What problem does it solve? How does the solution work?"}
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {isAr ? "وصف المشروع (إنجليزي)" : "Project Description (English)"}
                  </Label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Describe your project in English..." // Already English, keep as is.
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                    dir="ltr"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      {isAr ? "التصنيف" : "Category"}
                    </Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder={isAr ? "اختر التصنيف" : "Select Category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => ( // Rule 5: Use conditional array
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      {isAr ? "مرحلة المشروع" : "Project Stage"}
                    </Label>
                    <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v as any })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder={isAr ? "اختر المرحلة" : "Select Stage"} />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => ( // Rule 5: Use conditional array
                          <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                        ))}
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
                    <Label className="text-slate-300">
                      {isAr ? "حجم الفريق" : "Team Size"}
                    </Label>
                    <Input
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      placeholder={isAr ? "عدد أعضاء الفريق" : "Number of team members"}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      {isAr ? "التمويل المطلوب (ريال)" : "Funding Needed (SAR)"}
                    </Label>
                    <Input
                      value={formData.fundingNeeded}
                      onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                      placeholder={isAr ? "مثال: 500000" : "Example: 500000"}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {isAr ? "السوق المستهدف" : "Target Market"}
                  </Label>
                  <Textarea
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                    placeholder={isAr ? "من هم عملاؤك المستهدفون؟ ما حجم السوق؟" : "Who are your target customers? What is the market size?"}
                    className="bg-slate-900 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {isAr ? "الميزة التنافسية" : "Competitive Advantage"}
                  </Label>
                  <Textarea
                    value={formData.competitiveAdvantage}
                    onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
                    placeholder={isAr ? "ما الذي يميز مشروعك عن المنافسين؟" : "What distinguishes your project from competitors?"}
                    className="bg-slate-900 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {isAr ? "نموذج العمل" : "Business Model"}
                  </Label>
                  <Textarea
                    value={formData.businessModel}
                    onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                    placeholder={isAr ? "كيف ستحقق الإيرادات؟" : "How will you generate revenue?"}
                    className="bg-slate-900 border-slate-700 text-white min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {isAr ? "الوسوم" : "Tags"}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      placeholder={isAr ? "أضف وسم" : "Add tag"}
                      className="bg-slate-900 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="border-slate-700">
                      {isAr ? "إضافة" : "Add"}
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
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {isAr ? "مراجعة المشروع" : "Project Review"}
                  </h2>
                  <p className="text-slate-400">
                    {isAr ? "راجع المعلومات قبل الإنشاء" : "Review information before creation"}
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">
                      {isAr ? "عنوان المشروع" : "Project Title"}
                    </p>
                    <p className="text-white text-lg font-medium">{formData.title}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isAr ? "التصنيف" : "Category"}
                      </p>
                      <p className="text-white">
                        {formData.category
                          ? categories.find(c => c.value === formData.category)?.label || formData.category
                          : (isAr ? "غير محدد" : "Not specified")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isAr ? "المرحلة" : "Stage"}
                      </p>
                      <p className="text-white">
                        {formData.stage
                          ? stages.find(s => s.value === formData.stage)?.label || formData.stage
                          : (isAr ? "غير محدد" : "Not specified")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isAr ? "حجم الفريق" : "Team Size"}
                      </p>
                      <p className="text-white">
                        {formData.teamSize || (isAr ? "غير محدد" : "Not specified")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">
                      {isAr ? "الوصف" : "Description"}
                    </p>
                    <p className="text-white text-sm">{formData.description}</p>
                  </div>

                  {formData.fundingNeeded && (
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isAr ? "التمويل المطلوب" : "Funding Needed"}
                      </p>
                      <p className="text-white">
                        {parseInt(formData.fundingNeeded).toLocaleString()} {isAr ? "ريال" : "SAR"}
                      </p>
                    </div>
                  )}

                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">
                        {isAr ? "الوسوم" : "Tags"}
                      </p>
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
                      <p className="text-cyan-400 font-medium">
                        {isAr ? "تقييم AI متقدم" : "Advanced AI Evaluation"}
                      </p>
                      <p className="text-slate-300 text-sm">
                        {isAr
                          ? "بعد إنشاء المشروع، يمكنك تقديمه للحصول على تقييم ذكاء اصطناعي شامل يحدد مسار ابتكارك"
                          : "After creating the project, you can submit it for a comprehensive AI evaluation that defines your innovation's path."}
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
                {isAr ? "السابق" : "Previous"}
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && (!formData.title || !formData.description)}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  {isAr ? "التالي" : "Next"}
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
                      {isAr ? "جاري الإنشاء..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 ml-2" />
                      {isAr ? "إنشاء المشروع" : "Create Project"}
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