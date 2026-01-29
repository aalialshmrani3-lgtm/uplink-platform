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

export default function BetaPrograms() {
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
      title: "الابتكار التنبؤي",
      icon: <TrendingUp className="text-blue-600" size={40} />,
      description: "كن أول من يستخدم نظام التنبؤ بفرص الابتكار قبل المنافسين",
      features: [
        "تحليل اتجاهات السوق العالمية في الوقت الفعلي",
        "تتبع براءات الاختراع الناشئة من USPTO, EPO, WIPO",
        "مراقبة الأبحاث الأكاديمية من IEEE, Nature, Science",
        "توصيات ابتكار تنبؤية بالذكاء الاصطناعي",
      ],
      benefits: [
        "وصول مبكر لمدة 6 أشهر",
        "تدريب مخصص من فريق UPLINK",
        "دعم فني أولوية",
        "خصم 50% على الاشتراك السنوي",
      ],
      slots: "15 مقعد متبقي",
      duration: "6 أشهر",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "global-networks",
      title: "الشبكات العالمية",
      icon: <Globe className="text-green-600" size={40} />,
      description: "انضم إلى شبكة 25,000+ خبير ومبتكر من 120+ دولة",
      features: [
        "وصول حصري لشبكة الخبراء العالمية",
        "مطابقة ذكية مع الخبراء المناسبين",
        "حماية متقدمة للملكية الفكرية",
        "أدوات تعاون عالمية متكاملة",
      ],
      benefits: [
        "3 استشارات مجانية مع خبراء",
        "أولوية في المطابقة",
        "وصول لفعاليات حصرية",
        "خصم 40% على خدمات الخبراء",
      ],
      slots: "20 مقعد متبقي",
      duration: "4 أشهر",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "sustainability-ai-ethics",
      title: "الاستدامة وأخلاقيات AI",
      icon: <Leaf className="text-purple-600" size={40} />,
      description: "قيّم وحسّن مشاريعك وفقاً لمعايير ESG وأخلاقيات الذكاء الاصطناعي",
      features: [
        "تقييم شامل لمعايير ESG",
        "إطار عمل أخلاقيات AI المتقدم",
        "شهادات استدامة معترف بها",
        "تقارير امتثال تفصيلية",
      ],
      benefits: [
        "تقييم ESG مجاني (قيمة $5,000)",
        "استشارة أخلاقيات AI",
        "شهادة استدامة",
        "خصم 60% على التقييمات المستقبلية",
      ],
      slots: "10 مقاعد متبقية",
      duration: "3 أشهر",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.program || !formData.reason) {
    showToast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Here you would typically send the data to your backend
    showToast.success("تم التسجيل بنجاح! 🎉\nسنتواصل معك خلال 48 ساعة لتأكيد مشاركتك");

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
            UPLINK 6.0 Beta Programs
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            كن من الرواد
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            انضم إلى البرامج التجريبية لميزات UPLINK 6.0 واحصل على وصول مبكر، تدريب مخصص، وخصومات حصرية
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
                <h4 className="font-semibold mb-3 text-sm">الميزات الرئيسية:</h4>
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
                <h4 className="font-semibold mb-3 text-sm">فوائد المشاركين:</h4>
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
                  <div className="text-sm text-muted-foreground">المدة</div>
                  <div className="font-semibold">{program.duration}</div>
                </div>
                <Badge variant="secondary">{program.slots}</Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">نموذج التسجيل</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
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
                <label className="block text-sm font-medium mb-2">الشركة/المؤسسة</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="اسم الشركة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المسمى الوظيفي</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="مدير الابتكار"
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
                  <SelectValue placeholder="اختر البرنامج" />
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
                placeholder="أخبرنا عن اهتمامك وكيف ستستفيد من البرنامج..."
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
          <h2 className="text-3xl font-bold mb-8 text-center">أسئلة شائعة</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-2">ما هي متطلبات الانضمام؟</h3>
              <p className="text-muted-foreground">
                نبحث عن مبتكرين وشركات ومؤسسات جادة في استكشاف ميزات UPLINK 6.0 وتقديم تغذية راجعة بناءة.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">هل البرنامج التجريبي مجاني؟</h3>
              <p className="text-muted-foreground">
                نعم، المشاركة في البرنامج التجريبي مجانية بالكامل، بالإضافة إلى الحصول على خصومات حصرية عند الإطلاق الرسمي.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">متى يبدأ البرنامج؟</h3>
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
