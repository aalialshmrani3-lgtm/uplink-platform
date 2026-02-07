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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Users, Video, DollarSign, Target, Award } from "lucide-react";

type EventType = 'conference' | 'workshop' | 'hackathon' | 'seminar' | 'webinar' | 'networking' | 'exhibition' | 'competition' | 'training';
type DeliveryMode = 'online' | 'in_person' | 'hybrid';

export default function Uplink2SubmitEvent() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '' as EventType | '',
    deliveryMode: '' as DeliveryMode | '',
    category: '',
    startDate: '',
    endDate: '',
    location: '',
    onlinePlatform: '',
    capacity: '',
    registrationDeadline: '',
    registrationFee: '',
    targetAudience: '',
    objectives: '',
    sponsorsNeeded: false,
    innovatorsNeeded: false,
    requiredSkills: '',
  });

  const progress = (step / 4) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.eventType || !formData.deliveryMode) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      toast.success('تم تقديم طلب الفعالية بنجاح! سيتم مراجعته قريباً');
      setTimeout(() => {
        setLocation('/uplink2');
      }, 2000);
    } catch (error) {
      toast.error('حدث خطأ أثناء تقديم الطلب');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            قدّم طلب فعالية
          </h1>
          <p className="text-slate-600">
            نظّم مؤتمراً، ورشة عمل، أو هاكاثون واجمع المبتكرين والرعاة
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-slate-600">
            <span>الخطوة {step} من 4</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
              <CardDescription>
                حدد نوع الفعالية والمعلومات الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الفعالية *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="مثال: مؤتمر الابتكار السعودي 2026"
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الفعالية *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="اكتب وصفاً شاملاً للفعالية وأهدافها..."
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventType">نوع الفعالية *</Label>
                  <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الفعالية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">مؤتمر</SelectItem>
                      <SelectItem value="workshop">ورشة عمل</SelectItem>
                      <SelectItem value="hackathon">هاكاثون</SelectItem>
                      <SelectItem value="seminar">ندوة</SelectItem>
                      <SelectItem value="webinar">ندوة عبر الإنترنت</SelectItem>
                      <SelectItem value="networking">فعالية تواصل</SelectItem>
                      <SelectItem value="exhibition">معرض</SelectItem>
                      <SelectItem value="competition">مسابقة</SelectItem>
                      <SelectItem value="training">تدريب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="تقنية، صحة، تعليم..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryMode">طريقة التنفيذ *</Label>
                <Select value={formData.deliveryMode} onValueChange={(value) => handleInputChange('deliveryMode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة التنفيذ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">عبر الإنترنت</SelectItem>
                    <SelectItem value="in_person">حضوري</SelectItem>
                    <SelectItem value="hybrid">هجين (حضوري وعن بُعد)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  التالي
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date, Time & Location */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                التاريخ والموقع
              </CardTitle>
              <CardDescription>
                حدد موعد ومكان الفعالية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">تاريخ البداية *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">تاريخ النهاية *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              {(formData.deliveryMode === 'in_person' || formData.deliveryMode === 'hybrid') && (
                <div>
                  <Label htmlFor="location">الموقع *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="مثال: فندق الريتز كارلتون، الرياض"
                  />
                </div>
              )}

              {(formData.deliveryMode === 'online' || formData.deliveryMode === 'hybrid') && (
                <div>
                  <Label htmlFor="onlinePlatform">المنصة الإلكترونية</Label>
                  <Input
                    id="onlinePlatform"
                    value={formData.onlinePlatform}
                    onChange={(e) => handleInputChange('onlinePlatform', e.target.value)}
                    placeholder="Zoom, Microsoft Teams, Google Meet..."
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">السعة (عدد المشاركين)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">آخر موعد للتسجيل</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="registrationFee">رسوم التسجيل (ريال سعودي)</Label>
                <Input
                  id="registrationFee"
                  type="number"
                  value={formData.registrationFee}
                  onChange={(e) => handleInputChange('registrationFee', e.target.value)}
                  placeholder="0 (مجاني)"
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

        {/* Step 3: Target Audience & Objectives */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                الجمهور المستهدف والأهداف
              </CardTitle>
              <CardDescription>
                حدد من تستهدف وما تريد تحقيقه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="targetAudience">الجمهور المستهدف</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="مثال: المبتكرون، رواد الأعمال، المستثمرون، الباحثون..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="objectives">أهداف الفعالية</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  placeholder="اذكر الأهداف الرئيسية للفعالية..."
                  rows={4}
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

        {/* Step 4: Support Needed */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                الدعم المطلوب
              </CardTitle>
              <CardDescription>
                هل تحتاج إلى رعاة أو مبتكرين للفعالية؟
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox
                  id="sponsorsNeeded"
                  checked={formData.sponsorsNeeded}
                  onCheckedChange={(checked) => handleInputChange('sponsorsNeeded', checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="sponsorsNeeded"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    أحتاج إلى رعاة للفعالية
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    سنساعدك في إيجاد رعاة مناسبين للفعالية
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox
                  id="innovatorsNeeded"
                  checked={formData.innovatorsNeeded}
                  onCheckedChange={(checked) => handleInputChange('innovatorsNeeded', checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="innovatorsNeeded"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    أبحث عن مبتكرين وموهوبين
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    سنساعدك في إيجاد مبتكرين مناسبين للمشاركة
                  </p>
                </div>
              </div>

              {formData.innovatorsNeeded && (
                <div>
                  <Label htmlFor="requiredSkills">المهارات المطلوبة</Label>
                  <Textarea
                    id="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
                    placeholder="مثال: برمجة، تصميم، ذكاء اصطناعي، تسويق..."
                    rows={3}
                  />
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">ملاحظة هامة</h4>
                <p className="text-sm text-blue-800">
                  بعد الموافقة على طلبك، سيتم إنشاء عقد ذكي تلقائياً في UPLINK3 لإدارة جميع الاتفاقيات مع الرعاة والمشاركين.
                </p>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button variant="outline" onClick={handleBack}>
                  رجوع
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  تقديم الطلب
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
