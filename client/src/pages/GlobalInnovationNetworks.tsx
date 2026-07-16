import { Globe, Users, Shield, Award, TrendingUp, Zap, ArrowRight, Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GlobalInnovationNetworks() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const networkStats = [
    { label: "Freelance Experts", value: "25,000+", icon: <Users className="text-blue-600" /> },
    { label: "Country", value: "120+", icon: <Globe className="text-green-600" /> },
    { label: "Specialization", value: "500+", icon: <Award className="text-purple-600" /> },
    { label: "Collaborative Project", value: "8,500+", icon: <TrendingUp className="text-orange-600" /> },
  ];

  const expertCategories = [
    {
      title: "Tech Experts",
      count: "8,500+",
      icon: "💻",
      specialties: ["AI/ML", "Blockchain", "IoT", "Cloud Computing", "Cybersecurity"],
      avgRating: 4.8,
    },
    {
      title: "Academic Researchers",
      count: "6,200+",
      icon: "🎓",
      specialties: [isAr ? "الفيزياء" : "Physics", isAr ? "الكيمياء" : "Chemistry", isAr ? "الأحياء" : "Biology", isAr ? "الهندسة" : "Engineering", isAr ? "الرياضيات" : "Mathematics"],
      avgRating: 4.9,
    },
    {
      title: "Strategic Consultants",
      count: "4,800+",
      icon: "📊",
      specialties: [isAr ? "استراتيجية الأعمال" : "Business Strategy", isAr ? "التسويق" : "Marketing", isAr ? "المالية" : "Finance", isAr ? "العمليات" : "Operations", isAr ? "التحول الرقمي" : "Digital Transformation"],
      avgRating: 4.7,
    },
    {
      title: "Designers & Creatives",
      count: "3,500+",
      icon: "🎨",
      specialties: ["UX/UI", isAr ? "التصميم الصناعي" : "Industrial Design", isAr ? "العلامة التجارية" : "Branding", isAr ? "الوسائط المتعددة" : "Multimedia"],
      avgRating: 4.8,
    },
    {
      title: "Legal Experts",
      count: "2,000+",
      icon: "⚖️",
      specialties: [isAr ? "الملكية الفكرية" : "Intellectual Property", isAr ? "العقود" : "Contracts", isAr ? "الامتثال" : "Compliance", isAr ? "براءات الاختراع" : "Patents"],
      avgRating: 4.9,
    },
  ];

  const successStories = [
    {
      id: 1,
      title: "Develop Global Health App",
      company: "HealthTech Startup",
      challenge: "Health startup needs multidisciplinary team to develop global app.",
      solution: "Team of 12 experts from 8 countries formed (developers, doctors, designers, consultants).",
      result: "App launched in 6 months, 500K+ users in first year.",
      savings: "$800K",
      time: "6 Months",
    },
    {
      id: 2,
      title: "Innovative Industrial Solution",
      company: "Manufacturing Corp",
      challenge: "Industrial company seeks solution to improve production efficiency by 40%",
      solution: "Collaboration with 5 experts in IoT, automation, and data analytics from 4 continents",
      result: "52% efficiency improvement, $2.5M annual savings",
      savings: "$2.5M",
      time: "4 Months",
    },
  ];

  const features = [
    {
      icon: <Shield className="text-blue-600" size={32} />,
      title: "IP Protection",
      description: "Advanced IP management and protection system for open collaboration with smart contracts and Blockchain documentation",
    },
    {
      icon: <Star className="text-yellow-600" size={32} />,
      title: "Rating & Reputation System",
      description: "Transparent, reliable expert ratings based on past projects and achieved results",
    },
    {
      icon: <Zap className="text-purple-600" size={32} />,
      title: "Smart Matching",
      description: "Advanced AI algorithm matches projects with suitable experts based on skills and experience",
    },
    {
      icon: <Globe className="text-green-600" size={32} />,
      title: "Seamless Global Collaboration",
      description: "Integrated collaboration tools supporting 20+ languages with timezone and currency management",
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "فئات الخبراء" : "Expert Categories" : "[Expert Categories]"}</h2>
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "ميزات الشبكة" : "Network Features" : "Network Features"}</h2>
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
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? isAr ? "قصص نجاح التعاون" : "Collaboration Success Stories" : "Collaboration Success Stories"}</h2>
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
                      <div className="text-xs text-muted-foreground">{isAr ? isAr ? "توفير" : "Savings" : "[Savings]"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{story.time}</div>
                      <div className="text-xs text-muted-foreground">{isAr ? isAr ? "مدة" : "Duration" : "[Duration]"}</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">{isAr ? isAr ? "التحدي" : "Challenge" : "Challenge"}</h4>
                    <p className="text-sm text-muted-foreground">{story.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">{isAr ? "الحل" : "Solution"}</h4>
                    <p className="text-sm text-muted-foreground">{story.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">{isAr ? isAr ? "النتيجة" : "Result" : "[Result]"}</h4>
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
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "انضم إلى الشبكة العالمية" : "Join the Global Network" : "Join Global Network"}</h2>
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
