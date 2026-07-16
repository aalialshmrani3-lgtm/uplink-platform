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
import { useLanguage } from "@/contexts/LanguageContext";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Advanced" | "Intermediate" | "Beginner";
  reward: string;
  deadline: string;
  icon: React.ReactNode;
  tags: string[];
  details: string[];
}
export default function NationalChallenges() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const challenges: Challenge[] = [
    {
      id: "solar-cleaning-robots",
      title: "Smart Solar Panel Cleaning Robots",
      description: "Develop local robots for solar panel cleaning in desert environments, resistant to dust and high temperatures.",
      category: "Renewable Energy",
      difficulty: "Advanced",
      reward: "500,000 SAR",
      deadline: "6 Months",
      icon: <Zap className="w-8 h-8" />,
      tags: [isAr ? "روبوتات" : "Robotics", isAr ? "طاقة شمسية" : "Solar Power", isAr ? "أتمتة" : "Automation"],
      details: [
        isAr ? "تصميم روبوت يعمل بالطاقة الشمسية" : "Solar-powered robot design",
        isAr ? "مقاومة درجات الحرارة حتى 55 درجة مئوية" : "Temperature resistance up to 55°C",
        isAr ? "تنظيف فعال بدون استهلاك مياه كبير" : "Efficient cleaning with minimal water consumption",
        isAr ? "نظام ملاحة ذكي لتغطية المساحات الكبيرة" : "Smart navigation for large areas",
        isAr ? "صيانة سهلة وقطع غيار محلية" : "Easy maintenance and local spare parts"
      ]
    },
    {
      id: "battery-cooling",
      title: "Advanced Battery Cooling Systems",
      description: "Innovate efficient battery cooling solutions for high temperatures to ensure optimal performance and extended lifespan.",
      category: "Energy Storage",
      difficulty: "Advanced",
      reward: "400,000 SAR",
      deadline: "8 Months",
      icon: <Battery className="w-8 h-8" />,
      tags: [isAr ? "بطاريات" : "Batteries", isAr ? "تبريد" : "Cooling", isAr ? "كفاءة طاقة" : "Energy Efficiency"],
      details: [
        isAr ? "فهم السلوك الكيميائي للبطاريات في الحرارة العالية" : "Understand battery chemical behavior in high heat",
        isAr ? "تصميم نظام تبريد سلبي أو نشط" : "Design passive or active cooling system",
        isAr ? "تقليل استهلاك الطاقة للتبريد" : "Reduce cooling energy consumption",
        isAr ? "مواد عازلة محلية ومستدامة" : "Local and sustainable insulating materials",
        isAr ? "اختبارات ميدانية في البيئة السعودية" : "Field tests in Saudi environment"
      ]
    },
    {
      id: "bipv-integration",
      title: "Building-Integrated Photovoltaics (BIPV)",
      description: "Develop aesthetic and architectural solutions for integrating solar panels into building facades without impacting urban appearance.",
      category: "Sustainable Architecture",
      difficulty: "Intermediate",
      reward: "300,000 SAR",
      deadline: "5 Months",
      icon: <Building2 className="w-8 h-8" />,
      tags: [isAr ? "عمارة" : "Architecture", isAr ? "طاقة شمسية" : "Solar Power", isAr ? "تصميم" : "Design"],
      details: [
        isAr ? "تصاميم تتماشى مع الطراز المعماري السعودي" : "Designs aligned with Saudi architectural style",
        isAr ? "ألواح شمسية شفافة أو ملونة" : "Transparent or colored solar panels",
        isAr ? "سهولة التركيب والصيانة" : "Easy installation and maintenance",
        isAr ? "كفاءة طاقة عالية رغم التكامل المعماري" : "High energy efficiency despite architectural integration",
        isAr ? "تطبيقات عملية في مشاريع كبرى (الدرعية، نيوم)" : "Practical applications in major projects (Diriyah, NEOM)"
      ]
    },
    {
      id: "ai-energy-optimization",
      title: "AI for Energy System Optimization",
      description: "Physics-based AI applications to understand and improve renewable energy system performance",
      category: "Artificial Intelligence",
      difficulty: "Advanced",
      reward: "600,000 SAR",
      deadline: "10 Months",
      icon: <BrainCircuit className="w-8 h-8" />,
      tags: [isAr ? "ذكاء اصطناعي" : "AI", isAr ? "تحليل بيانات" : "Data Analysis", isAr ? "تحسين" : "Optimization"],
      details: [
        isAr ? "نماذج AI لفهم التفاعلات المعقدة في البطاريات" : "AI models for understanding complex battery interactions",
        isAr ? "تحليل ثلاثي الأبعاد للمدن لتحديد أفضل مواقع الألواح الشمسية" : "3D city analysis to identify optimal solar panel locations",
        isAr ? "لوحات تحكم تفاعلية مع Gamification" : "Interactive dashboards with Gamification",
        isAr ? "محاكاة تأثير مشاريع الطاقة المتجددة" : "Simulating the impact of renewable energy projects",
        isAr ? "تنبؤ بالأعطال والصيانة الاستباقية" : "Fault prediction and proactive maintenance"
      ]
    },
    {
      id: "green-hydrogen",
      title: "Green Hydrogen Production Technologies",
      description: "Develop innovative solutions for high-efficiency green hydrogen production and storage, integrating wind and solar energy.",
      category: "Renewable Energy",
      difficulty: "Advanced",
      reward: "700,000 SAR",
      deadline: "12 Months",
      icon: <Wind className="w-8 h-8" />,
      tags: [isAr ? "هيدروجين أخضر" : "Green Hydrogen", isAr ? "تخزين طاقة" : "Energy Storage", isAr ? "طاقة متجددة" : "Renewable Energy"],
      details: [
        isAr ? "تحليل كهربائي فعال للماء" : "Efficient Water Electrolysis",
        isAr ? "تكامل طاقة الرياح والشمس" : "Wind & Solar Integration",
        isAr ? "حلول تخزين آمنة ومستدامة" : "Safe & Sustainable Storage Solutions",
        isAr ? "تطبيقات في النقل والصناعة" : "Applications in Transport & Industry",
        isAr ? "خفض تكلفة الإنتاج" : "Reduced Production Cost"
      ]
    },
    {
      id: "water-energy-nexus",
      title: "Water-Energy Nexus in Desert Environments",
      description: "Innovating integrated water and energy management solutions for desert regions with a focus on sustainability.",
      category: "Sustainability",
      difficulty: "Intermediate",
      reward: "350,000 SAR",
      deadline: "7 Months",
      icon: <Droplets className="w-8 h-8" />,
      tags: [isAr ? "مياه" : "Water", isAr ? "طاقة" : "Energy", isAr ? "استدامة" : "Sustainability"],
      details: [
        isAr ? "تحلية مياه بالطاقة الشمسية" : "Solar Desalination",
        isAr ? "إعادة استخدام المياه الرمادية" : "Greywater Reuse",
        isAr ? "ري ذكي يعتمد على AI" : "AI-Powered Smart Irrigation",
        isAr ? "تقليل الهدر في الشبكات" : "Network Loss Reduction",
        isAr ? "حلول منخفضة التكلفة" : "Low-Cost Solutions"
      ]
    },
    {
      id: "carbon-capture",
      title: "Innovative Carbon Capture Technologies",
      description: "Developing local solutions for carbon capture and storage from industrial sources and fossil fuels.",
      category: "Sustainability",
      difficulty: "Advanced",
      reward: "550,000 SAR",
      deadline: "12 Months",
      icon: <Leaf className="w-8 h-8" />,
      tags: [isAr ? "احتجاز كربون" : "Carbon Capture", isAr ? "بيئة" : "Environment", isAr ? "صناعة" : "Industry"],
      details: [
        isAr ? "تقنيات احتجاز فعالة من حيث التكلفة" : "Cost-Effective Capture Technologies",
        isAr ? "تخزين آمن طويل الأمد" : "Safe Long-Term Storage",
        isAr ? "إعادة استخدام الكربون المحتجز" : "Captured Carbon Reuse",
        isAr ? "تطبيقات صناعية في أرامكو وسابك" : "Industrial Applications in Aramco & SABIC",
        isAr ? "قياس وتوثيق الانبعاثات المخفضة" : "Measure & Document Reduced Emissions"
      ]
    },
    {
      id: "smart-grid",
      title: "Smart Grids for Renewable Energy",
      description: "Design smart grids integrating multiple renewable energy sources with efficient storage and distribution.",
      category: "Infrastructure",
      difficulty: "Advanced",
      reward: "800,000 SAR",
      deadline: "15 Months",
      icon: <Target className="w-8 h-8" />,
      tags: [isAr ? "شبكات ذكية" : "Smart Grids", isAr ? "توزيع طاقة" : "Energy Distribution", "IoT"],
      details: [
        isAr ? "دمج مصادر طاقة متعددة (شمسية، رياح، هيدروجين)" : "Integrate multiple energy sources (solar, wind, hydrogen)",
        isAr ? "نظام تخزين موزع" : "Distributed Storage System",
        isAr ? "توزيع ذكي حسب الطلب" : "Smart On-Demand Distribution",
        isAr ? "مرونة عالية وموثوقية" : "High Flexibility & Reliability",
        isAr ? "تكامل مع المدن الذكية" : "Smart City Integration"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
    switch (difficulty) {
      case isAr ? "متقدم" : "Advanced":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case isAr ? "متوسط" : "Intermediate":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case isAr ? "مبتدئ" : "Beginner":
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
                  <span className="text-slate-600 font-medium">{isAr ? isAr ? "الجائزة" : "Award" : "[Award]"}</span>
                  <span className="text-2xl font-bold text-emerald-600">{challenge.reward}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">{isAr ? isAr ? "المدة المتوقعة" : "Expected Duration" : "[Expected Duration]"}</span>
                  <span className="text-lg font-semibold text-slate-900">{challenge.deadline}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">{isAr ? isAr ? "المتطلبات الأساسية:" : "Prerequisites:" : "[Prerequisites:]"}</h4>
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
