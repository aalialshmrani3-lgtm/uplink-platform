import { useState } from "react";
import { Rocket, CheckCircle2, Users, Target, TrendingUp, Globe, Leaf, ArrowRight, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast as showToast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BetaPrograms() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  // Using sonner toast
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    program: "",
    reason: "",
  });

  const programs = [
    {
      id: "predictive-innovation",
      title: "Predictive Innovation",
      icon: <TrendingUp className="text-blue-600" size={40} />,
      description: "Be the first to use our innovation opportunity prediction system before competitors",
      features: [
        isAr ? "تحليل اتجاهات السوق العالمية في الوقت الفعلي" : "Real-time global market trend analysis",
        isAr ? "تتبع براءات الاختراع الناشئة من USPTO, EPO, WIPO" : "Track emerging patents from USPTO, EPO, WIPO",
        isAr ? "مراقبة الأبحاث الأكاديمية من IEEE, Nature, Science" : "Monitor academic research from IEEE, Nature, Science",
        isAr ? "توصيات ابتكار تنبؤية بالذكاء الاصطناعي" : "AI-powered predictive innovation recommendations",
      ],
      benefits: [
        isAr ? "وصول مبكر لمدة 6 أشهر" : "6-month early access",
        isAr ? "تدريب مخصص من فريق NAQLA" : "Custom training from NAQLA team",
        isAr ? "دعم فني أولوية" : "Priority technical support",
        isAr ? "خصم 50% على الاشتراك السنوي" : "50% off annual subscription",
      ],
      slots: "15 seats remaining",
      duration: "6 months",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "global-networks",
      title: "Global Networking",
      icon: <Globe className="text-green-600" size={40} />,
      description: "Join a network of 25,000+ experts and innovators from 120+ countries",
      features: [
        isAr ? "وصول حصري لشبكة الخبراء العالمية" : "Exclusive access to global expert network",
        isAr ? "مطابقة ذكية مع الخبراء المناسبين" : "Smart matching with relevant experts",
        isAr ? "حماية متقدمة للملكية الفكرية" : "Advanced IP protection",
        isAr ? "أدوات تعاون عالمية متكاملة" : "Integrated global collaboration tools",
      ],
      benefits: [
        isAr ? "3 استشارات مجانية مع خبراء" : "3 free expert consultations",
        isAr ? "أولوية في المطابقة" : "Priority matching",
        isAr ? "وصول لفعاليات حصرية" : "Access to exclusive events",
        isAr ? "خصم 40% على خدمات الخبراء" : "40% off expert services",
      ],
      slots: "20 seats remaining",
      duration: "4 months",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "sustainability-ai-ethics",
      title: "Sustainability & AI Ethics",
      icon: <Leaf className="text-purple-600" size={40} />,
      description: "Assess and improve your projects according to ESG standards and AI ethics",
      features: [
        isAr ? "تقييم شامل لمعايير ESG" : "Comprehensive ESG assessment",
        isAr ? "إطار عمل أخلاقيات AI المتقدم" : "Advanced AI ethics framework",
        isAr ? "شهادات استدامة معترف بها" : "Recognized sustainability certifications",
        isAr ? "تقارير امتثال تفصيلية" : "Detailed compliance reports",
      ],
      benefits: [
        isAr ? "تقييم ESG مجاني (قيمة $5,000)" : "Free ESG Assessment ($5,000 value)",
        isAr ? "استشارة أخلاقيات AI" : "AI Ethics Consultation",
        isAr ? "شهادة استدامة" : "Sustainability Certificate",
        isAr ? "خصم 60% على التقييمات المستقبلية" : "60% off future assessments",
      ],
      slots: "10 seats left",
      duration: "3 months",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.program || !formData.reason) {
    showToast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your backend
    showToast.success(isAr ? "تم التسجيل بنجاح! 🎉\nسنتواصل معك خلال 48 ساعة لتأكيد مشاركتك" : "Registration successful! 🎉\nWe will contact you within 48 hours to confirm your participation.");

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      company: "",
      role: "",
      program: "",
      reason: "",
    });
    setSelectedProgram(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <Rocket className="mr-2" size={16} />
            NAQLA 6.0 Beta Programs
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            كن من الرواد
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            انضم إلى البرامج التجريبية لميزات NAQLA 6.0 واحصل على وصول مبكر، تدريب مخصص، وخصومات حصرية
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {programs.map((program) => (
            <Card
              key={program.id}
              className={`p-6 hover:shadow-2xl transition-all cursor-pointer ${
                selectedProgram === program.id ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => {
                setSelectedProgram(program.id);
                setFormData({ ...formData, program: program.id });
              }}
            >
              <div className="mb-4">{program.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{program.title}</h3>
              <p className="text-muted-foreground mb-6">{program.description}</p>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm">{isAr ? isAr ? "الميزات الرئيسية:" : "Key Features:" : "Home Features:"}</h4>
                <div className="space-y-2">
                  {program.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm">{isAr ? isAr ? "فوائد المشاركين:" : "Participant Benefits:" : "Participant Benefits:"}</h4>
                <div className="space-y-2">
                  {program.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Star className="text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">{isAr ? isAr ? "المدة" : "Duration" : "Duration"}</div>
                  <div className="font-semibold">{program.duration}</div>
                </div>
                <Badge variant="secondary">{program.slots}</Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">{isAr ? isAr ? "نموذج التسجيل" : "Registration Form" : "Registration Form"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@company.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{isAr ? isAr ? "الشركة/المؤسسة" : "Company/Organization" : "Company/Organization"}</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={isAr ? "اسم الشركة" : "Company Name"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{isAr ? isAr ? "المسمى الوظيفي" : "Job Title" : "Job Title"}</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder={isAr ? "مدير الابتكار" : "Innovation Manager"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                البرنامج التجريبي <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.program}
                onValueChange={(value) => {
                  setFormData({ ...formData, program: value });
                  setSelectedProgram(value);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={isAr ? "اختر البرنامج" : "Select Program"} />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                لماذا ترغب في الانضمام؟ <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder={isAr ? "أخبرنا عن اهتمامك وكيف ستستفيد من البرنامج..." : "Tell us about your interest and how you'll benefit from the program..."}
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg py-6"
            >
              سجّل الآن
              <ArrowRight className="mr-2" size={20} />
            </Button>
          </form>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "أسئلة شائعة" : "FAQ" : "FAQ"}</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-2">{isAr ? isAr ? "ما هي متطلبات الانضمام؟" : "What are the admission requirements?" : "What are the admission requirements?"}</h3>
              <p className="text-muted-foreground">
                نبحث عن مبتكرين وشركات ومؤسسات جادة في استكشاف ميزات NAQLA 6.0 وتقديم تغذية راجعة بناءة.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">{isAr ? isAr ? "هل البرنامج التجريبي مجاني؟" : "Is the pilot program free?" : "Is the pilot program free?"}</h3>
              <p className="text-muted-foreground">
                نعم، المشاركة في البرنامج التجريبي مجانية بالكامل، بالإضافة إلى الحصول على خصومات حصرية عند الإطلاق الرسمي.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">{isAr ? isAr ? "متى يبدأ البرنامج؟" : "When does the program start?" : "[When does the program start?]"}</h3>
              <p className="text-muted-foreground">
                سيتم الإعلان عن تاريخ البدء للمشاركين المقبولين عبر البريد الإلكتروني خلال أسبوعين من التسجيل.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
