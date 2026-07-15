import { Globe, Users, Shield, Award, TrendingUp, Zap, ArrowRight, Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GlobalInnovationNetworks() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const networkStats = [
    { label: "خبراء مستقلين", value: "25,000+", icon: <Users className="text-blue-600" /> },
    { label: "دولة", value: "120+", icon: <Globe className="text-green-600" /> },
    { label: "تخصص", value: "500+", icon: <Award className="text-purple-600" /> },
    { label: "مشروع تعاوني", value: "8,500+", icon: <TrendingUp className="text-orange-600" /> },
  ];

  const expertCategories = [
    {
      title: "خبراء تقنيون",
      count: "8,500+",
      icon: "💻",
      specialties: ["AI/ML", "Blockchain", "IoT", "Cloud Computing", "Cybersecurity"],
      avgRating: 4.8,
    },
    {
      title: "باحثون أكاديميون",
      count: "6,200+",
      icon: "🎓",
      specialties: ["الفيزياء", "الكيمياء", "الأحياء", "الهندسة", "الرياضيات"],
      avgRating: 4.9,
    },
    {
      title: "مستشارون استراتيجيون",
      count: "4,800+",
      icon: "📊",
      specialties: ["استراتيجية الأعمال", "التسويق", "المالية", "العمليات", "التحول الرقمي"],
      avgRating: 4.7,
    },
    {
      title: "مصممون ومبدعون",
      count: "3,500+",
      icon: "🎨",
      specialties: ["UX/UI", "التصميم الصناعي", "العلامة التجارية", "الوسائط المتعددة"],
      avgRating: 4.8,
    },
    {
      title: "خبراء قانونيون",
      count: "2,000+",
      icon: "⚖️",
      specialties: ["الملكية الفكرية", "العقود", "الامتثال", "براءات الاختراع"],
      avgRating: 4.9,
    },
  ];

  const successStories = [
    {
      id: 1,
      title: "تطوير تطبيق صحي عالمي",
      company: "HealthTech Startup",
      challenge: "ناشئة صحية تحتاج فريق متعدد التخصصات لتطوير تطبيق عالمي",
      solution: "تم تشكيل فريق من 12 خبير من 8 دول (مطورين، أطباء، مصممين، مستشارين)",
      result: "إطلاق التطبيق في 6 أشهر، 500K+ مستخدم في السنة الأولى",
      savings: "$800K",
      time: "6 أشهر",
    },
    {
      id: 2,
      title: "حل صناعي مبتكر",
      company: "Manufacturing Corp",
      challenge: "شركة صناعية تبحث عن حل لتحسين كفاءة الإنتاج بنسبة 40%",
      solution: "تعاون مع 5 خبراء في IoT، أتمتة، وتحليلات البيانات من 4 قارات",
      result: "تحسين الكفاءة بنسبة 52%، توفير $2.5M سنوياً",
      savings: "$2.5M",
      time: "4 أشهر",
    },
  ];

  const features = [
    {
      icon: <Shield className="text-blue-600" size={32} />,
      title: "حماية الملكية الفكرية",
      description: "نظام متقدم لإدارة وحماية الملكية الفكرية في التعاون المفتوح مع عقود ذكية وتوثيق Blockchain",
    },
    {
      icon: <Star className="text-yellow-600" size={32} />,
      title: "نظام تقييم وسمعة",
      description: "تقييمات شفافة وموثوقة للخبراء بناءً على المشاريع السابقة والنتائج المحققة",
    },
    {
      icon: <Zap className="text-purple-600" size={32} />,
      title: "مطابقة ذكية",
      description: "خوارزمية AI متقدمة لمطابقة المشاريع مع الخبراء المناسبين بناءً على المهارات والخبرة",
    },
    {
      icon: <Globe className="text-green-600" size={32} />,
      title: "تعاون عالمي سلس",
      description: "أدوات تعاون متكاملة تدعم 20+ لغة مع إدارة المناطق الزمنية والعملات",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            NAQLA 6.0 Preview
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            شبكات الابتكار المفتوح العالمية
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اتصل بأفضل العقول في العالم - شبكة منظمة من 25,000+ خبير ومبتكر مستقل من 120+ دولة
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {networkStats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-all">
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Expert Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "فئات الخبراء" : "[فئات الخبراء]"}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <Badge variant="secondary" className="mb-4">{category.count}</Badge>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="font-semibold">{category.avgRating}/5.0</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.specialties.map((specialty, i) => (
                    <Badge key={i} variant="outline" className="mr-2 mb-2">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "ميزات الشبكة" : "Features الشبكة"}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "قصص نجاح التعاون" : "قصص Success التعاون"}</h2>
          <div className="space-y-6">
            {successStories.map((story) => (
              <Card key={story.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                    <Badge className="mb-3">{story.company}</Badge>
                  </div>
                  <div className="flex gap-4 ml-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{story.savings}</div>
                      <div className="text-xs text-muted-foreground">{isAr ? "توفير" : "[توفير]"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{story.time}</div>
                      <div className="text-xs text-muted-foreground">{isAr ? "مدة" : "[مدة]"}</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">{isAr ? "التحدي" : "التBorderي"}</h4>
                    <p className="text-sm text-muted-foreground">{story.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">{isAr ? "الحل" : "Solution"}</h4>
                    <p className="text-sm text-muted-foreground">{story.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">{isAr ? "النتيجة" : "[النتيجة]"}</h4>
                    <p className="text-sm text-muted-foreground">{story.result}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="text-5xl mb-6">🌍</div>
          <h2 className="text-3xl font-bold mb-4">{isAr ? "انضم إلى الشبكة العالمية" : "انضم إلى Network العالمية"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            سواء كنت تبحث عن خبراء أو ترغب في الانضمام كخبير، شبكتنا العالمية تفتح لك أبواب الفرص
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center gap-2">
                ابحث عن خبراء
                <ArrowRight size={20} />
              </button>
            </Link>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              انضم كخبير
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
