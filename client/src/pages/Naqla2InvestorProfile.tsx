import { useState } from "react";
import { useLocation } from "wouter";
import { 
  User, Building2, Globe, DollarSign, Briefcase, 
  CheckCircle, ArrowRight, Sparkles, Shield, TrendingUp,
  Linkedin, Link as LinkIcon, Upload, ChevronDown, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const SECTORS = [
  { id: 'energy', label: 'الطاقة المتجددة', icon: '⚡' },
  { id: 'health', label: 'الصحة والتقنية الحيوية', icon: '🏥' },
  { id: 'tech', label: 'التقنية والذكاء الاصطناعي', icon: '🤖' },
  { id: 'water', label: 'المياه والبيئة', icon: '💧' },
  { id: 'sustainability', label: 'الاستدامة', icon: '🌱' },
  { id: 'smart_cities', label: 'المدن الذكية', icon: '🏙️' },
  { id: 'fintech', label: 'التقنية المالية', icon: '💳' },
  { id: 'agri', label: 'الزراعة الذكية', icon: '🌾' },
  { id: 'education', label: 'التعليم والتدريب', icon: '📚' },
  { id: 'logistics', label: 'اللوجستيات والنقل', icon: '🚚' },
];

export default function Naqla2InvestorProfile() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const [step, setStep] = useState(1);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    profileType: 'individual_investor' as const,
    displayName: '',
    organization: '',
    country: 'Saudi Arabia',
    city: '',
    bio: '',
    investmentRange: '' as any,
    sponsorshipBudget: '' as any,
    linkedinUrl: '',
    websiteUrl: '',
  });

  const createProfile = trpc.naqla2.createInvestorProfile.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء ملفك الشخصي بنجاح!');
      navigate('/naqla2/dashboard');
    },
    onError: (err) => {
      toast.error(err.message || 'حدث خطأ أثناء إنشاء الملف الشخصي');
    },
  });

  const toggleSector = (sectorId: string) => {
    setSelectedSectors(prev =>
      prev.includes(sectorId)
        ? prev.filter(s => s !== sectorId)
        : [...prev, sectorId]
    );
  };

  const handleSubmit = () => {
    if (!formData.displayName.trim()) {
      toast.error('يرجى إدخال اسمك أو اسم مؤسستك');
      return;
    }
    if (selectedSectors.length === 0) {
      toast.error('يرجى اختيار قطاع واحد على الأقل');
      return;
    }
    createProfile.mutate({
      ...formData,
      sectors: selectedSectors,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-card/50 border-border/50 text-center p-8">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground mb-6">
            يجب تسجيل الدخول لإنشاء ملف مستثمر على منصة NAQLA
          </p>
          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            <a href={getLoginUrl()}>
              <Sparkles className="w-4 h-4 mr-2" />
              سجل الدخول الآن
            </a>
          </Button>
        </Card>
      </div>
    );
  }

  const profileTypes = [
    { value: 'individual_investor', label: 'مستثمر فردي', icon: User, desc: 'استثمار شخصي في الابتكارات' },
    { value: 'institutional_investor', label: 'مستثمر مؤسسي', icon: Building2, desc: 'صناديق استثمار وشركات رأس المال المغامر' },
    { value: 'sponsor', label: 'راعٍ', icon: Star, desc: 'رعاية الفعاليات والهاكاثونات' },
    { value: 'corporate_partner', label: 'شريك مؤسسي', icon: Briefcase, desc: 'شراكات استراتيجية مع الشركات' },
    { value: 'foreign_investor', label: 'مستثمر أجنبي', icon: Globe, desc: 'استثمار دولي في السوق السعودي' },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEOHead title="إنشاء ملف مستثمر - NAQLA 2" description="أنشئ ملفك الشخصي كمستثمر أو راعٍ في منصة NAQLA" />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container py-12 max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
            <TrendingUp className="w-3 h-3 ml-1" />
            ملف المستثمر
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            أنشئ ملفك الشخصي كمستثمر
          </h1>
          <p className="text-lg text-muted-foreground">
            انضم إلى شبكة المستثمرين والرعاة في منصة NAQLA وتواصل مع أفضل الابتكارات
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-secondary text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-0.5 transition-all ${step > s ? 'bg-blue-600' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Profile Type */}
        {step === 1 && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">اختر نوع ملفك الشخصي</CardTitle>
              <CardDescription>حدد كيف تريد المشاركة في منظومة NAQLA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, profileType: type.value as any }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.profileType === type.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <type.icon className={`w-5 h-5 ${formData.profileType === type.value ? 'text-blue-400' : 'text-muted-foreground'}`} />
                      <span className="font-semibold text-foreground">{type.label}</span>
                      {formData.profileType === type.value && (
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-auto" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{type.desc}</p>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-4"
                onClick={() => setStep(2)}
              >
                التالي
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">المعلومات الشخصية</CardTitle>
              <CardDescription>أدخل تفاصيل ملفك الشخصي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>الاسم الكامل / اسم المؤسسة *</Label>
                <Input
                  placeholder="مثال: أحمد المحمد / شركة الاستثمار السعودي"
                  value={formData.displayName}
                  onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الدولة</Label>
                  <Select
                    value={formData.country}
                    onValueChange={v => setFormData(prev => ({ ...prev, country: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saudi Arabia">🇸🇦 المملكة العربية السعودية</SelectItem>
                      <SelectItem value="UAE">🇦🇪 الإمارات العربية المتحدة</SelectItem>
                      <SelectItem value="Kuwait">🇰🇼 الكويت</SelectItem>
                      <SelectItem value="Qatar">🇶🇦 قطر</SelectItem>
                      <SelectItem value="Bahrain">🇧🇭 البحرين</SelectItem>
                      <SelectItem value="Oman">🇴🇲 عُمان</SelectItem>
                      <SelectItem value="Other">🌍 أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Input
                    placeholder="الرياض، جدة، الدمام..."
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>نبذة تعريفية</Label>
                <Textarea
                  placeholder="اكتب نبذة مختصرة عن خبرتك الاستثمارية وأهدافك..."
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نطاق الاستثمار</Label>
                  <Select
                    value={formData.investmentRange}
                    onValueChange={v => setFormData(prev => ({ ...prev, investmentRange: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النطاق" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_100k">أقل من 100,000 ريال</SelectItem>
                      <SelectItem value="100k_500k">100,000 - 500,000 ريال</SelectItem>
                      <SelectItem value="500k_1m">500,000 - 1,000,000 ريال</SelectItem>
                      <SelectItem value="1m_5m">1 - 5 مليون ريال</SelectItem>
                      <SelectItem value="above_5m">أكثر من 5 مليون ريال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ميزانية الرعاية</Label>
                  <Select
                    value={formData.sponsorshipBudget}
                    onValueChange={v => setFormData(prev => ({ ...prev, sponsorshipBudget: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الميزانية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_50k">أقل من 50,000 ريال</SelectItem>
                      <SelectItem value="50k_200k">50,000 - 200,000 ريال</SelectItem>
                      <SelectItem value="200k_500k">200,000 - 500,000 ريال</SelectItem>
                      <SelectItem value="above_500k">أكثر من 500,000 ريال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رابط LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pr-9"
                      placeholder="linkedin.com/in/..."
                      value={formData.linkedinUrl}
                      onChange={e => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الموقع الإلكتروني</Label>
                  <div className="relative">
                    <LinkIcon className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pr-9"
                      placeholder="www.example.com"
                      value={formData.websiteUrl}
                      onChange={e => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  السابق
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => {
                    if (!formData.displayName.trim()) {
                      toast.error('يرجى إدخال الاسم');
                      return;
                    }
                    setStep(3);
                  }}
                >
                  التالي
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Sectors of Interest */}
        {step === 3 && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">القطاعات المفضلة</CardTitle>
              <CardDescription>اختر القطاعات التي تهتم بالاستثمار فيها (يمكن اختيار أكثر من قطاع)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SECTORS.map((sector) => (
                  <div
                    key={sector.id}
                    onClick={() => toggleSector(sector.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                      selectedSectors.includes(sector.id)
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <div className="text-2xl mb-1">{sector.icon}</div>
                    <div className={`text-sm font-medium ${selectedSectors.includes(sector.id) ? 'text-blue-400' : 'text-foreground'}`}>
                      {sector.label}
                    </div>
                    {selectedSectors.includes(sector.id) && (
                      <CheckCircle className="w-4 h-4 text-blue-400 mx-auto mt-1" />
                    )}
                  </div>
                ))}
              </div>

              {selectedSectors.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-xl">
                  <span className="text-sm text-muted-foreground">القطاعات المختارة:</span>
                  {selectedSectors.map(id => {
                    const sector = SECTORS.find(s => s.id === id);
                    return (
                      <Badge key={id} className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {sector?.icon} {sector?.label}
                      </Badge>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  السابق
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={handleSubmit}
                  disabled={createProfile.isPending}
                >
                  {createProfile.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      إنشاء الملف الشخصي
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: 'تطابق ذكي', desc: 'نربطك تلقائياً بأفضل الابتكارات في قطاعاتك' },
            { icon: Shield, title: 'بيانات آمنة', desc: 'معلوماتك محمية ولا تُشارك إلا بموافقتك' },
            { icon: TrendingUp, title: 'فرص حصرية', desc: 'وصول مبكر لأفضل الفرص الاستثمارية' },
          ].map((benefit, i) => (
            <div key={i} className="p-4 rounded-xl bg-card/30 border border-border/30 text-center">
              <benefit.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="font-semibold text-foreground text-sm mb-1">{benefit.title}</div>
              <div className="text-xs text-muted-foreground">{benefit.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
