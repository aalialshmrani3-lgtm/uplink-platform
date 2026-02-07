import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, DollarSign, Calendar } from "lucide-react";

export default function Uplink2SubmitChallenge() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    prizeAmount: '',
    deadline: '',
    requirements: '',
    evaluationCriteria: '',
    expectedOutcome: '',
  });

  const progress = (step / 3) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      toast.success('تم تقديم التحدي بنجاح! سيتم مراجعته ونشره قريباً');
      setTimeout(() => {
        setLocation('/uplink2/challenges');
      }, 2000);
    } catch (error) {
      toast.error('حدث خطأ أثناء تقديم التحدي');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            قدّم تحدي جديد
          </h1>
          <p className="text-slate-600">
            أطلق تحدياً لإيجاد حلول مبتكرة لمشكلة تواجهها
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-slate-600">
            <span>الخطوة {step} من 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step 1: Challenge Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                تفاصيل التحدي
              </CardTitle>
              <CardDescription>
                اشرح التحدي والمشكلة التي تريد حلها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان التحدي *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="مثال: تطوير نظام ذكي لإدارة النفايات"
                />
              </div>

              <div>
                <Label htmlFor="description">وصف التحدي *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="اشرح المشكلة بالتفصيل والسياق والأثر المتوقع..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">تقنية</SelectItem>
                      <SelectItem value="health">صحة</SelectItem>
                      <SelectItem value="education">تعليم</SelectItem>
                      <SelectItem value="environment">بيئة</SelectItem>
                      <SelectItem value="energy">طاقة</SelectItem>
                      <SelectItem value="transportation">نقل</SelectItem>
                      <SelectItem value="agriculture">زراعة</SelectItem>
                      <SelectItem value="finance">مالية</SelectItem>
                      <SelectItem value="social">اجتماعي</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">مبتدئ</SelectItem>
                      <SelectItem value="intermediate">متوسط</SelectItem>
                      <SelectItem value="advanced">متقدم</SelectItem>
                      <SelectItem value="expert">خبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  التالي
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Requirements & Criteria */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                المتطلبات ومعايير التقييم
              </CardTitle>
              <CardDescription>
                حدد ما تتوقعه من الحلول المقترحة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="requirements">المتطلبات والشروط</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="مثال: يجب أن يكون الحل قابل للتطبيق، يستخدم تقنيات حديثة، يراعي التكلفة..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="evaluationCriteria">معايير التقييم</Label>
                <Textarea
                  id="evaluationCriteria"
                  value={formData.evaluationCriteria}
                  onChange={(e) => handleInputChange('evaluationCriteria', e.target.value)}
                  placeholder="مثال: الابتكار (30%)، القابلية للتطبيق (30%)، الأثر (25%)، التكلفة (15%)"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="expectedOutcome">النتائج المتوقعة</Label>
                <Textarea
                  id="expectedOutcome"
                  value={formData.expectedOutcome}
                  onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                  placeholder="ماذا تتوقع من الحل الناجح؟"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={handleBack}>
                  رجوع
                </Button>
                <Button onClick={handleNext}>
                  التالي
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Prize & Timeline */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                الجوائز والمواعيد
              </CardTitle>
              <CardDescription>
                حدد قيمة الجوائز والمواعيد النهائية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prizeAmount">قيمة الجائزة (ريال سعودي)</Label>
                <Input
                  id="prizeAmount"
                  type="number"
                  value={formData.prizeAmount}
                  onChange={(e) => handleInputChange('prizeAmount', e.target.value)}
                  placeholder="100000"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  يمكنك تحديد جوائز متعددة للمراكز الأولى
                </p>
              </div>

              <div>
                <Label htmlFor="deadline">الموعد النهائي للتقديم</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">ملاحظة هامة</h4>
                <p className="text-sm text-blue-800 mb-2">
                  بعد الموافقة على التحدي:
                </p>
                <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                  <li>سيتم نشر التحدي للمبتكرين في المنصة</li>
                  <li>سيتم تقييم الحلول المقدمة بواسطة AI</li>
                  <li>عند اختيار الفائز، سيتم إنشاء عقد ذكي تلقائياً في UPLINK3</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button variant="outline" onClick={handleBack}>
                  رجوع
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  تقديم التحدي
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
