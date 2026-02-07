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
import { Building2, Globe, GraduationCap, Landmark, User, Users, Briefcase, Heart, Rocket } from "lucide-react";

type EntityType = 
  | 'individual_innovator'
  | 'individual_investor'
  | 'local_company'
  | 'foreign_company'
  | 'government_entity'
  | 'international_organization'
  | 'research_institution'
  | 'university'
  | 'startup'
  | 'ngo';

const entityTypeOptions = [
  { value: 'individual_innovator', label: 'مبتكر فردي', icon: User, color: 'text-blue-500' },
  { value: 'individual_investor', label: 'مستثمر فردي', icon: Briefcase, color: 'text-green-500' },
  { value: 'local_company', label: 'شركة محلية', icon: Building2, color: 'text-purple-500' },
  { value: 'foreign_company', label: 'شركة أجنبية', icon: Globe, color: 'text-orange-500' },
  { value: 'government_entity', label: 'جهة حكومية', icon: Landmark, color: 'text-red-500' },
  { value: 'international_organization', label: 'منظمة دولية', icon: Globe, color: 'text-indigo-500' },
  { value: 'research_institution', label: 'مؤسسة بحثية', icon: GraduationCap, color: 'text-cyan-500' },
  { value: 'university', label: 'جامعة', icon: GraduationCap, color: 'text-teal-500' },
  { value: 'startup', label: 'شركة ناشئة', icon: Rocket, color: 'text-pink-500' },
  { value: 'ngo', label: 'منظمة غير ربحية', icon: Heart, color: 'text-rose-500' },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState<EntityType | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Saudi Arabia',
    city: '',
    bio: '',
    website: '',
    linkedIn: '',
    organizationName: '',
    commercialRegistration: '',
    licenseNumber: '',
    taxNumber: '',
    entityCountry: '',
    entityCity: '',
    entityAddress: '',
    entityPhone: '',
    entityEmail: '',
    authorizedPersonName: '',
    authorizedPersonPosition: '',
  });

  const progress = (step / 3) * 100;

  const handleEntityTypeSelect = (type: EntityType) => {
    setEntityType(type);
    setStep(2);
  };

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
    if (!entityType) {
      toast.error('يرجى اختيار الصفة الاعتبارية');
      return;
    }

    // Validation
    if (!formData.name || !formData.email) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      toast.success('تم التسجيل بنجاح! جاري تحويلك...');
      setTimeout(() => {
        setLocation('/');
      }, 2000);
    } catch (error) {
      toast.error('حدث خطأ أثناء التسجيل');
    }
  };

  const requiresOrganizationInfo = [
    'local_company',
    'foreign_company',
    'government_entity',
    'international_organization',
    'research_institution',
    'university',
    'startup',
    'ngo'
  ].includes(entityType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            انضم إلى منظومة UPLINK
          </h1>
          <p className="text-slate-600">
            سجل الآن وكن جزءاً من أكبر منظومة وطنية للابتكار
          </p>
        </div>

        {/* Progress Bar */}
        {step > 1 && (
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-slate-600">
              <span>الخطوة {step} من 3</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Step 1: Entity Type Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>اختر صفتك الاعتبارية</CardTitle>
              <CardDescription>
                حدد نوع الجهة أو الصفة التي تمثلها للحصول على تجربة مخصصة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entityTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleEntityTypeSelect(option.value as EntityType)}
                      className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className={`p-3 rounded-full bg-slate-100 group-hover:bg-white ${option.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="font-semibold text-slate-900">{option.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal/Basic Information */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
              <CardDescription>
                أدخل معلوماتك الشخصية أو معلومات الجهة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="الرياض، جدة، الدمام..."
                  />
                </div>
              </div>

              {requiresOrganizationInfo && (
                <>
                  <div>
                    <Label htmlFor="organizationName">اسم الجهة/المؤسسة *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="أدخل اسم الجهة"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commercialRegistration">رقم السجل التجاري</Label>
                      <Input
                        id="commercialRegistration"
                        value={formData.commercialRegistration}
                        onChange={(e) => handleInputChange('commercialRegistration', e.target.value)}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                      <Input
                        id="taxNumber"
                        value={formData.taxNumber}
                        onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                        placeholder="3XXXXXXXXXX"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="bio">نبذة تعريفية</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="اكتب نبذة مختصرة عنك أو عن جهتك..."
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

        {/* Step 3: Additional Information */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>معلومات إضافية</CardTitle>
              <CardDescription>
                أكمل ملفك الشخصي للحصول على أفضل تجربة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">الموقع الإلكتروني</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedIn">حساب LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    value={formData.linkedIn}
                    onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {requiresOrganizationInfo && (
                <>
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">معلومات الشخص المفوض</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="authorizedPersonName">اسم الشخص المفوض</Label>
                        <Input
                          id="authorizedPersonName"
                          value={formData.authorizedPersonName}
                          onChange={(e) => handleInputChange('authorizedPersonName', e.target.value)}
                          placeholder="الاسم الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="authorizedPersonPosition">المنصب</Label>
                        <Input
                          id="authorizedPersonPosition"
                          value={formData.authorizedPersonPosition}
                          onChange={(e) => handleInputChange('authorizedPersonPosition', e.target.value)}
                          placeholder="المدير التنفيذي، مدير الابتكار..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="entityAddress">عنوان الجهة</Label>
                    <Textarea
                      id="entityAddress"
                      value={formData.entityAddress}
                      onChange={(e) => handleInputChange('entityAddress', e.target.value)}
                      placeholder="العنوان الكامل للجهة"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 justify-end pt-4">
                <Button variant="outline" onClick={handleBack}>
                  رجوع
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  إنهاء التسجيل
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
