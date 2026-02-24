import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Battery, 
  Building2, 
  BrainCircuit,
  Wind,
  Droplets,
  Leaf,
  Target
} from "lucide-react";
import { Link } from "wouter";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "متقدم" | "متوسط" | "مبتدئ";
  reward: string;
  deadline: string;
  icon: React.ReactNode;
  tags: string[];
  details: string[];
}

const challenges: Challenge[] = [
  {
    id: "solar-cleaning-robots",
    title: "روبوتات تنظيف الألواح الشمسية الذكية",
    description: "تطوير روبوتات محلية الصنع لتنظيف الألواح الشمسية في البيئة الصحراوية مع مقاومة الغبار والحرارة العالية",
    category: "الطاقة المتجددة",
    difficulty: "متقدم",
    reward: "500,000 ريال",
    deadline: "6 أشهر",
    icon: <Zap className="w-8 h-8" />,
    tags: ["روبوتات", "طاقة شمسية", "أتمتة"],
    details: [
      "تصميم روبوت يعمل بالطاقة الشمسية",
      "مقاومة درجات الحرارة حتى 55 درجة مئوية",
      "تنظيف فعال بدون استهلاك مياه كبير",
      "نظام ملاحة ذكي لتغطية المساحات الكبيرة",
      "صيانة سهلة وقطع غيار محلية"
    ]
  },
  {
    id: "battery-cooling",
    title: "أنظمة تبريد البطاريات المتقدمة",
    description: "ابتكار حلول تبريد للبطاريات تعمل بكفاءة في درجات الحرارة العالية لضمان الأداء الأمثل وإطالة العمر الافتراضي",
    category: "تخزين الطاقة",
    difficulty: "متقدم",
    reward: "400,000 ريال",
    deadline: "8 أشهر",
    icon: <Battery className="w-8 h-8" />,
    tags: ["بطاريات", "تبريد", "كفاءة طاقة"],
    details: [
      "فهم السلوك الكيميائي للبطاريات في الحرارة العالية",
      "تصميم نظام تبريد سلبي أو نشط",
      "تقليل استهلاك الطاقة للتبريد",
      "مواد عازلة محلية ومستدامة",
      "اختبارات ميدانية في البيئة السعودية"
    ]
  },
  {
    id: "bipv-integration",
    title: "دمج الطاقة الشمسية في واجهات المباني (BIPV)",
    description: "تطوير حلول جمالية ومعمارية لدمج الألواح الشمسية في واجهات المباني دون التأثير على المظهر الحضري",
    category: "العمارة المستدامة",
    difficulty: "متوسط",
    reward: "300,000 ريال",
    deadline: "5 أشهر",
    icon: <Building2 className="w-8 h-8" />,
    tags: ["عمارة", "طاقة شمسية", "تصميم"],
    details: [
      "تصاميم تتماشى مع الطراز المعماري السعودي",
      "ألواح شمسية شفافة أو ملونة",
      "سهولة التركيب والصيانة",
      "كفاءة طاقة عالية رغم التكامل المعماري",
      "تطبيقات عملية في مشاريع كبرى (الدرعية، نيوم)"
    ]
  },
  {
    id: "ai-energy-optimization",
    title: "الذكاء الاصطناعي لتحسين منظومة الطاقة",
    description: "تطبيقات الذكاء الاصطناعي الفيزيائي (Physics-based AI) لفهم وتحسين أداء أنظمة الطاقة المتجددة",
    category: "الذكاء الاصطناعي",
    difficulty: "متقدم",
    reward: "600,000 ريال",
    deadline: "10 أشهر",
    icon: <BrainCircuit className="w-8 h-8" />,
    tags: ["ذكاء اصطناعي", "تحليل بيانات", "تحسين"],
    details: [
      "نماذج AI لفهم التفاعلات المعقدة في البطاريات",
      "تحليل ثلاثي الأبعاد للمدن لتحديد أفضل مواقع الألواح الشمسية",
      "لوحات تحكم تفاعلية مع Gamification",
      "محاكاة تأثير مشاريع الطاقة المتجددة",
      "تنبؤ بالأعطال والصيانة الاستباقية"
    ]
  },
  {
    id: "green-hydrogen",
    title: "تقنيات إنتاج الهيدروجين الأخضر",
    description: "تطوير حلول مبتكرة لإنتاج وتخزين الهيدروجين الأخضر بكفاءة عالية مع دمج طاقة الرياح والشمس",
    category: "الطاقة المتجددة",
    difficulty: "متقدم",
    reward: "700,000 ريال",
    deadline: "12 شهر",
    icon: <Wind className="w-8 h-8" />,
    tags: ["هيدروجين أخضر", "تخزين طاقة", "طاقة متجددة"],
    details: [
      "تحليل كهربائي فعال للماء",
      "تكامل طاقة الرياح والشمس",
      "حلول تخزين آمنة ومستدامة",
      "تطبيقات في النقل والصناعة",
      "خفض تكلفة الإنتاج"
    ]
  },
  {
    id: "water-energy-nexus",
    title: "ترابط المياه والطاقة في البيئة الصحراوية",
    description: "ابتكار حلول متكاملة لإدارة المياه والطاقة في المناطق الصحراوية مع التركيز على الاستدامة",
    category: "الاستدامة",
    difficulty: "متوسط",
    reward: "350,000 ريال",
    deadline: "7 أشهر",
    icon: <Droplets className="w-8 h-8" />,
    tags: ["مياه", "طاقة", "استدامة"],
    details: [
      "تحلية مياه بالطاقة الشمسية",
      "إعادة استخدام المياه الرمادية",
      "ري ذكي يعتمد على AI",
      "تقليل الهدر في الشبكات",
      "حلول منخفضة التكلفة"
    ]
  },
  {
    id: "carbon-capture",
    title: "تقنيات احتجاز الكربون المبتكرة",
    description: "تطوير حلول محلية لاحتجاز وتخزين الكربون من المصادر الصناعية والوقود التقليدي",
    category: "الاستدامة",
    difficulty: "متقدم",
    reward: "550,000 ريال",
    deadline: "12 شهر",
    icon: <Leaf className="w-8 h-8" />,
    tags: ["احتجاز كربون", "بيئة", "صناعة"],
    details: [
      "تقنيات احتجاز فعالة من حيث التكلفة",
      "تخزين آمن طويل الأمد",
      "إعادة استخدام الكربون المحتجز",
      "تطبيقات صناعية في أرامكو وسابك",
      "قياس وتوثيق الانبعاثات المخفضة"
    ]
  },
  {
    id: "smart-grid",
    title: "الشبكات الذكية للطاقة المتجددة",
    description: "تصميم شبكات ذكية تدمج مصادر الطاقة المتجددة المتعددة مع التخزين والتوزيع الفعال",
    category: "البنية التحتية",
    difficulty: "متقدم",
    reward: "800,000 ريال",
    deadline: "15 شهر",
    icon: <Target className="w-8 h-8" />,
    tags: ["شبكات ذكية", "توزيع طاقة", "IoT"],
    details: [
      "دمج مصادر طاقة متعددة (شمسية، رياح، هيدروجين)",
      "نظام تخزين موزع",
      "توزيع ذكي حسب الطلب",
      "مرونة عالية وموثوقية",
      "تكامل مع المدن الذكية"
    ]
  }
];

export default function NationalChallenges() {
  const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
    switch (difficulty) {
      case "متقدم":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "متوسط":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "مبتدئ":
        return "bg-green-500/10 text-green-600 border-green-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              التحديات الوطنية للطاقة والاستدامة
            </h1>
            <p className="text-xl text-emerald-50 mb-8">
              تحديات استراتيجية تدعم رؤية المملكة 2030 في الطاقة المتجددة والاستدامة البيئية
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                8 تحديات نشطة
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                3.5 مليون ريال جوائز
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                مفتوحة للجميع
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-500">
              <div className="flex items-start gap-6 mb-6">
                <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-600">
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {challenge.title}
                    </h3>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="mb-4">
                    {challenge.category}
                  </Badge>
                </div>
              </div>

              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                {challenge.description}
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">الجائزة</span>
                  <span className="text-2xl font-bold text-emerald-600">{challenge.reward}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">المدة المتوقعة</span>
                  <span className="text-lg font-semibold text-slate-900">{challenge.deadline}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">المتطلبات الأساسية:</h4>
                <ul className="space-y-2">
                  {challenge.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-600">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-100">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  شارك في التحدي
                </Button>
                <Button variant="outline" className="flex-1">
                  تفاصيل أكثر
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            هل لديك فكرة مبتكرة لتحدٍ جديد؟
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            نرحب باقتراحاتكم لتحديات وطنية جديدة تدعم رؤية المملكة في الطاقة والاستدامة
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/naqla1">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                قدّم فكرتك الآن
              </Button>
            </Link>
            <Link href="/naqla2">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                عودة إلى نقلة 2
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
