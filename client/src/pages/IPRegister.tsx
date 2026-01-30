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

const steps = [
  { id: 1, title: "نوع الملكية", icon: FileText },
  { id: 2, title: "المعلومات الأساسية", icon: Shield },
  { id: 3, title: "المخترعين", icon: Users },
  { id: 4, title: "المراجعة والتقديم", icon: Check },
];

export default function IPRegister() {
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
    organizationIds: [] as number[],
  });

  // Fetch organizations for selector
  const { data: organizations = [] } = trpc.organizations.getAll.useQuery({ isActive: true });

  const createIPMutation = trpc.ip.create.useMutation({
    onSuccess: (data) => {
      toast.success("تم تسجيل الملكية الفكرية بنجاح!", {
        description: `رقم التوثيق: ${data.blockchainHash.substring(0, 16)}...`,
      });
      setLocation("/ip/list");
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
      toast.error("يرجى ملء جميع الحقول المطلوبة");
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
      organizationIds: formData.organizationIds.length > 0 ? formData.organizationIds : undefined,
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
                UPLINK 5.0
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">UPLINK1 - توليد الملكية الفكرية</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">تسجيل ملكية فكرية جديدة</h1>
          <p className="text-slate-400">سجّل ابتكارك واحصل على حماية فورية مع توثيق البلوكتشين</p>
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
                  <h2 className="text-xl font-semibold text-white mb-2">اختر نوع الملكية الفكرية</h2>
                  <p className="text-slate-400">حدد نوع الحماية المناسب لابتكارك</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { value: "patent", label: "براءة اختراع", desc: "اختراع تقني جديد", icon: Zap },
                    { value: "trademark", label: "علامة تجارية", desc: "شعار أو اسم تجاري", icon: Shield },
                    { value: "copyright", label: "حقوق نشر", desc: "محتوى إبداعي أو برمجي", icon: FileText },
                    { value: "industrial_design", label: "تصميم صناعي", desc: "تصميم منتج فريد", icon: Globe },
                  ].map((type) => (
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
                  <h2 className="text-xl font-semibold text-white mb-2">المعلومات الأساسية</h2>
                  <p className="text-slate-400">أدخل تفاصيل ملكيتك الفكرية</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">العنوان (عربي) *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="عنوان الملكية الفكرية"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">العنوان (إنجليزي)</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Title in English"
                      className="bg-slate-900 border-slate-700 text-white"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">الوصف التفصيلي (عربي) *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اشرح ملكيتك الفكرية بالتفصيل..."
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">الوصف (إنجليزي)</Label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Detailed description in English..."
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
                        <SelectItem value="technology">تقنية</SelectItem>
                        <SelectItem value="healthcare">رعاية صحية</SelectItem>
                        <SelectItem value="energy">طاقة</SelectItem>
                        <SelectItem value="agriculture">زراعة</SelectItem>
                        <SelectItem value="manufacturing">تصنيع</SelectItem>
                        <SelectItem value="software">برمجيات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">نوع مقدم الطلب</Label>
                    <Select value={formData.applicantType} onValueChange={(v) => setFormData({ ...formData, applicantType: v as any })}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">فرد</SelectItem>
                        <SelectItem value="company">شركة</SelectItem>
                        <SelectItem value="university">جامعة</SelectItem>
                        <SelectItem value="government">جهة حكومية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">الكلمات المفتاحية</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.keywordInput}
                      onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                      placeholder="أضف كلمة مفتاحية"
                      className="bg-slate-900 border-slate-700 text-white"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline" className="border-slate-700">
                      إضافة
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
                  <h2 className="text-xl font-semibold text-white mb-2">المخترعين / المؤلفين</h2>
                  <p className="text-slate-400">أضف معلومات المساهمين في هذه الملكية الفكرية</p>
                </div>
                {formData.inventors.map((inventor, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">الاسم</Label>
                          <Input
                            value={inventor.name}
                            onChange={(e) => updateInventor(index, "name", e.target.value)}
                            placeholder="اسم المخترع"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">البريد الإلكتروني</Label>
                          <Input
                            value={inventor.email}
                            onChange={(e) => updateInventor(index, "email", e.target.value)}
                            placeholder="email@example.com"
                            className="bg-slate-800 border-slate-700 text-white"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">نسبة المساهمة</Label>
                          <Input
                            value={inventor.contribution}
                            onChange={(e) => updateInventor(index, "contribution", e.target.value)}
                            placeholder="مثال: 50%"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" onClick={addInventor} variant="outline" className="w-full border-slate-700 border-dashed">
                  <Users className="w-4 h-4 ml-2" />
                  إضافة مخترع آخر
                </Button>

                {/* Organizations Selector */}
                <Card className="bg-slate-900/50 border-slate-700 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white">الجهات المشاركة</CardTitle>
                    <CardDescription className="text-slate-400">
                      اختر الجهات المشاركة في هذه الملكية الفكرية (اختياري)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {organizations.map((org) => (
                        <label key={org.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.organizationIds.includes(org.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  organizationIds: [...formData.organizationIds, org.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  organizationIds: formData.organizationIds.filter(id => id !== org.id),
                                });
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                          />
                          <div className="flex-1">
                            <div className="text-white font-medium">{org.nameAr}</div>
                            <div className="text-slate-400 text-sm">{org.nameEn}</div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                            {org.type === 'government' && 'حكومية'}
                            {org.type === 'academic' && 'أكاديمية'}
                            {org.type === 'private' && 'قطاع خاص'}
                            {org.type === 'supporting' && 'داعمة'}
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">مراجعة وتقديم</h2>
                  <p className="text-slate-400">راجع المعلومات قبل التقديم</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">توثيق البلوكتشين</p>
                      <p className="text-slate-400 text-sm">سيتم إنشاء توقيع رقمي فريد لحماية ملكيتك</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">نوع الملكية</p>
                      <p className="text-white">
                        {formData.type === "patent" && "براءة اختراع"}
                        {formData.type === "trademark" && "علامة تجارية"}
                        {formData.type === "copyright" && "حقوق نشر"}
                        {formData.type === "industrial_design" && "تصميم صناعي"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">التصنيف</p>
                      <p className="text-white">{formData.category || "غير محدد"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">العنوان</p>
                    <p className="text-white">{formData.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">الوصف</p>
                    <p className="text-white text-sm">{formData.description.substring(0, 200)}...</p>
                  </div>
                  
                  {formData.keywords.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">الكلمات المفتاحية</p>
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
                      <p className="text-slate-400 text-sm mb-2">المخترعين</p>
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
                      <p className="text-emerald-400 font-medium">حماية فورية</p>
                      <p className="text-slate-300 text-sm">
                        بمجرد التقديم، سيتم توثيق ملكيتك الفكرية على البلوكتشين وإرسال طلب إلى SAIP للمراجعة
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
              
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !formData.type}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  التالي
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 ml-2" />
                      تقديم الطلب
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
