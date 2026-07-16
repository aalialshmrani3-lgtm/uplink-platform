import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Rocket, Shield, ArrowRight, ArrowLeft, Check,
  FileText, Users, Globe, Lock, Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IPRegister() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "" as "patent" | "trademark" | "copyright" | "trade_secret" | "industrial_design" | "",
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    category: "",
    subCategory: "",
    keywords: [] as string[],
    keywordInput: "",
    applicantType: "" as "individual" | "company" | "university" | "government" | "",
    inventors: [{ name: "", email: "", contribution: "" }],
  });

  const createIPMutation = trpc.ip.create.useMutation({
    onSuccess: (data) => {
      toast.success(isAr ? "تم تسجيل الملكية الفكرية بنجاح!" : "IP Registered Successfully!", {
        description: `${isAr ? "رقم التوثيق" : "Documentation ID"}: ${data.blockchainHash.substring(0, 16)}...`,
      });
      setLocation("/ip/list");
    },
    onError: (error) => {
      toast.error(isAr ? "حدث خطأ" : "An Error Occurred", { description: error.message });
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
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addKeyword = () => {
    if (formData.keywordInput.trim()) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, formData.keywordInput.trim()],
        keywordInput: "",
      });
    }
  };

  const addInventor = () => {
    setFormData({
      ...formData,
      inventors: [...formData.inventors, { name: "", email: "", contribution: "" }],
    });
  };

  const updateInventor = (index: number, field: string, value: string) => {
    const newInventors = [...formData.inventors];
    newInventors[index] = { ...newInventors[index], [field]: value };
    setFormData({ ...formData, inventors: newInventors });
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.title || !formData.description) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    createIPMutation.mutate({
      type: formData.type as any,
      title: formData.title,
      titleEn: formData.titleEn || undefined,
      description: formData.description,
      descriptionEn: formData.descriptionEn || undefined,
      category: formData.category || undefined,
      subCategory: formData.subCategory || undefined,
      keywords: formData.keywords.length > 0 ? formData.keywords : undefined,
      applicantType: formData.applicantType as any || undefined,
      inventors: formData.inventors.filter(i => i.name).length > 0
        ? formData.inventors.filter(i => i.name)
        : undefined,
    });
  };

  const steps = [
    { id: 1, title: "IP Type", icon: FileText },
    { id: 2, title: "Basic Information", icon: Shield },
    { id: 3, title: "Inventors", icon: Users },
    { id: 4, title: "Review & Submit", icon: Check },
  ];

  const ipTypes = [
    { value: "patent", label: "Patent", desc: "New Technical Invention", icon: Zap },
    { value: "trademark", label: "Trademark", desc: "Logo or Brand Name", icon: Shield },
    { value: "copyright", label: "Copyright", desc: "Creative or Software Content", icon: FileText },
    { value: "industrial_design", label: "Industrial Design", desc: "Unique Product Design", icon: Globe },
  ];

  const categories = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "energy", label: "Energy" },
    { value: "agriculture", label: "Agriculture" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "software", label: "Software" },
  ];

  const applicantTypes = [
    { value: "individual", label: "Individual" },
    { value: "company", label: "Company" },
    { value: "university", label: "University" },
    { value: "government", label: "Government Entity" },
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">{isAr ? "NAQLA1 - توليد الملكية الفكرية" : "NAQLA1 - IP Generation"}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{isAr ? "تسجيل ملكية فكرية جديدة" : "Register New IP"}</h1>
          <p className="text-slate-400">{isAr ? "سجّل ابتكارك واحصل على حماية فورية مع توثيق البلوكتشين" : "Register your innovation and get instant protection with blockchain documentation"}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentStep >= step.id
                  ? "bg-emerald-500/20 border border-emerald-500/50"
                  : "bg-slate-800/50 border border-slate-700"
              }`}>
                <step.icon className={`w-4 h-4 ${currentStep >= step.id ? "text-emerald-400" : "text-slate-500"}`} />
                <span className={`text-sm ${currentStep >= step.id ? "text-emerald-400" : "text-slate-500"}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? "bg-emerald-500" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            {/* Step 1: IP Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{isAr ? "اختر نوع الملكية الفكرية" : "Select IP Type"}</h2>
                  <p className="text-slate-400">{isAr ? "حدد نوع الحماية المناسب لابتكارك" : "Choose the appropriate protection for your innovation"}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {ipTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.type === type.value
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                      }`}
                    >
                      <type.icon className={`w-8 h-8 mb-3 ${formData.type === type.value ? "text-emerald-400" : "text-slate-400"}`} />
                      <h3 className="text-white font-semibold mb-1">{type.label}</h3>
                      <p className="text-slate-400 text-sm">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{isAr ? "المعلومات الأساسية" : "Basic Information"}</h2>
                  <p className="text-slate-400">{isAr ? "أدخل تفاصيل ملكيتك الفكرية" : "Enter IP Details"}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">{isAr ? "العنوان (عربي) *" : "Title (Arabic) *"}</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={isAr ? "عنوان الملكية الفكرية" : "IP Title"}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder={isAr ? "Title in English" : "Title in English"}
                      className="bg-slate-900 border-slate-700 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">{isAr ? "الوصف التفصيلي (عربي) *" : "Detailed Description (Arabic) *"}</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={isAr ? "اشرح ملكيتك الفكرية بالتفصيل..." : "Describe your IP in detail..."}
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">{isAr ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder={isAr ? "Detailed description in English..." : "Detailed description in English..."}
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                    dir="ltr"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">{isAr ? "التصنيف" : "Category"}</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder={isAr ? "اختر التصنيف" : "Select Category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">{isAr ? "نوع مقدم الطلب" : "Applicant Type"}</Label>
                    <Select value={formData.applicantType} onValueChange={(v) => setFormData({ ...formData, applicantType: v as any })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder={isAr ? "اختر النوع" : "Select Type"} />
                      </SelectTrigger>
                      <SelectContent>
                        {applicantTypes.map(appType => (
                          <SelectItem key={appType.value} value={appType.value}>{appType.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">{isAr ? "الكلمات المفتاحية" : "Keywords"}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.keywordInput}
                      onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                      placeholder={isAr ? "أضف كلمة مفتاحية" : "Add Keyword"}
                      className="bg-slate-900 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline" className="border-slate-700">
                      {isAr ? "إضافة" : "Add"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Inventors */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{isAr ? "المخترعين / المؤلفين" : "Inventors / Authors"}</h2>
                  <p className="text-slate-400">{isAr ? "أضف معلومات المساهمين في هذه الملكية الفكرية" : "Add contributors' information for this IP"}</p>
                </div>
                {formData.inventors.map((inventor, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">{isAr ? "الاسم" : "Name"}</Label>
                          <Input
                            value={inventor.name}
                            onChange={(e) => updateInventor(index, "name", e.target.value)}
                            placeholder={isAr ? "اسم المخترع" : "Inventor Name"}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
                          <Input
                            value={inventor.email}
                            onChange={(e) => updateInventor(index, "email", e.target.value)}
                            placeholder="email@example.com"
                            className="bg-slate-800 border-slate-700 text-white"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">{isAr ? "نسبة المساهمة" : "Contribution Percentage"}</Label>
                          <Input
                            value={inventor.contribution}
                            onChange={(e) => updateInventor(index, "contribution", e.target.value)}
                            placeholder={isAr ? "مثال: 50%" : "Example: 50%"}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" onClick={addInventor} variant="outline" className="w-full border-slate-700 border-dashed">
                  <Users className="w-4 h-4 ml-2" />
                  {isAr ? "إضافة مخترع آخر" : "Add Another Inventor"}
                </Button>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{isAr ? "مراجعة وتقديم" : "Review & Submit"}</h2>
                  <p className="text-slate-400">{isAr ? "راجع المعلومات قبل التقديم" : "Review information before submission"}</p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">{isAr ? "توثيق البلوكتشين" : "Blockchain Documentation"}</p>
                      <p className="text-slate-400 text-sm">{isAr ? "سيتم إنشاء توقيع رقمي فريد لحماية ملكيتك" : "A unique digital signature will be created to protect your property"}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">{isAr ? "نوع الملكية" : "IP Type"}</p>
                      <p className="text-white">
                        {formData.type === "patent" && (isAr ? "براءة اختراع" : "Patent")}
                        {formData.type === "trademark" && (isAr ? "علامة تجارية" : "Trademark")}
                        {formData.type === "copyright" && (isAr ? "حقوق نشر" : "Copyright")}
                        {formData.type === "industrial_design" && (isAr ? "تصميم صناعي" : "Industrial Design")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{isAr ? "التصنيف" : "Category"}</p>
                      <p className="text-white">{formData.category || (isAr ? "غير محدد" : "Not Specified")}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">{isAr ? "العنوان" : "Title"}</p>
                    <p className="text-white">{formData.title}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">{isAr ? "الوصف" : "Description"}</p>
                    <p className="text-white text-sm">{formData.description.substring(0, 200)}...</p>
                  </div>

                  {formData.keywords.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">{isAr ? "الكلمات المفتاحية" : "Keywords"}</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.inventors.filter(i => i.name).length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">{isAr ? "المخترعين" : "Inventors"}</p>
                      <div className="space-y-2">
                        {formData.inventors.filter(i => i.name).map((inv, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-white">{inv.name}</span>
                            {inv.contribution && <span className="text-slate-400">({inv.contribution})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-emerald-400 mt-1" />
                    <div>
                      <p className="text-emerald-400 font-medium">{isAr ? "حماية فورية" : "Instant Protection"}</p>
                      <p className="text-slate-300 text-sm">
                        {isAr
                          ? isAr ? "بمجرد التقديم، سيتم توثيق ملكيتك الفكرية على البلوكتشين وإرسال طلب إلى SAIP للمراجعة" : "Upon submission, your IP will be blockchain-registered and a request sent to SAIP for review."
                          : "Upon submission, your intellectual property will be notarized on the blockchain and a request will be sent to SAIP for review"}
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
                {isAr ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {isAr ? "السابق" : "Previous"}
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !formData.type}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  {isAr ? "التالي" : "Next"}
                  {isAr ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createIPMutation.isPending}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  {createIPMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      {isAr ? "جاري التسجيل..." : "Registering..."}
                    </>
                  ) : (
                    <>
                      {isAr ? <Check className="w-4 h-4 ml-2" /> : <Check className="w-4 h-4 mr-2" />}
                      {isAr ? "تقديم الطلب" : "Submit Application"}
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