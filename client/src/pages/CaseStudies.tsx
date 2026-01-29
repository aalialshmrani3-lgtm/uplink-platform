import { ArrowRight, TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 1,
      title: "تحويل الابتكار في شركة تقنية عالمية",
      company: "TechGlobal Corp",
      industry: "تقنية المعلومات",
      logo: "💻",
      challenge: "كانت الشركة تواجه صعوبة في إدارة أكثر من 500 فكرة ابتكارية سنوياً من 2000 موظف، مما أدى إلى ضياع فرص قيمة وإحباط الموظفين.",
      solution: "تم تطبيق UPLINK 5.0 مع نظام التقييم بالذكاء الاصطناعي، Pipeline المتكامل، ونظام Gamification لتحفيز المشاركة.",
      results: [
        { metric: "زيادة الأفكار المقدمة", value: "+350%", icon: <TrendingUp className="text-green-600" /> },
        { metric: "تقليل وقت التقييم", value: "-75%", icon: <Clock className="text-blue-600" /> },
        { metric: "معدل تحويل الأفكار لمشاريع", value: "45%", icon: <Users className="text-purple-600" /> },
        { metric: "عائد على الاستثمار", value: "$2.5M", icon: <DollarSign className="text-green-600" /> },
      ],
      testimonial: "UPLINK غيّرت ثقافة الابتكار لدينا بالكامل. الآن كل موظف يشعر أن صوته مسموع وأفكاره مقدّرة.",
      author: "د. أحمد المالكي، مدير الابتكار",
      image: "🏢",
    },
    {
      id: 2,
      title: "تسريع نمو ناشئة في مجال الذكاء الاصطناعي",
      company: "AI Innovations Ltd",
      industry: "الذكاء الاصطناعي",
      logo: "🤖",
      challenge: "ناشئة واعدة تحتاج إلى حماية ملكيتها الفكرية، جذب مستثمرين، وبناء فريق عالمي - كل ذلك بموارد محدودة.",
      solution: "استخدمت الناشئة نظام توثيق Blockchain، سوق المستثمرين، والشبكة العالمية في UPLINK للوصول إلى الموارد المطلوبة.",
      results: [
        { metric: "تمويل مضمون", value: "$1.2M", icon: <DollarSign className="text-green-600" /> },
        { metric: "براءات اختراع مسجلة", value: "5", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "شركاء عالميين", value: "12", icon: <Users className="text-purple-600" /> },
        { metric: "وقت التسويق", value: "-60%", icon: <Clock className="text-blue-600" /> },
      ],
      testimonial: "بدون UPLINK، كنا سنحتاج سنوات لتحقيق ما أنجزناه في 6 أشهر. المنصة كانت المفتاح لنجاحنا.",
      author: "سارة الحربي، المؤسسة والرئيسة التنفيذية",
      image: "🚀",
    },
    {
      id: 3,
      title: "تحديث الابتكار في مؤسسة صناعية عريقة",
      company: "Industrial Leaders Inc",
      industry: "الصناعة والتصنيع",
      logo: "🏭",
      challenge: "مؤسسة عمرها 50 عاماً تحتاج إلى تجديد عمليات الابتكار لمواكبة التحول الرقمي والمنافسة الشرسة.",
      solution: "تم تطبيق UPLINK مع التركيز على الابتكار المفتوح، التعاون مع الموردين، ونظام التحديات لإشراك جميع أصحاب المصلحة.",
      results: [
        { metric: "تخفيض التكاليف", value: "$5M", icon: <DollarSign className="text-green-600" /> },
        { metric: "منتجات جديدة", value: "18", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "شراكات استراتيجية", value: "25", icon: <Users className="text-purple-600" /> },
        { metric: "تحسين الكفاءة", value: "+40%", icon: <Clock className="text-blue-600" /> },
      ],
      testimonial: "UPLINK ساعدتنا في تحويل مؤسسة تقليدية إلى رائدة في الابتكار الصناعي. النتائج فاقت كل التوقعات.",
      author: "م. خالد العتيبي، نائب الرئيس للتطوير",
      image: "⚙️",
    },
    {
      id: 4,
      title: "بناء نظام ابتكار وطني متكامل",
      company: "National Innovation Agency",
      industry: "القطاع الحكومي",
      logo: "🏛️",
      challenge: "وكالة حكومية تسعى لبناء نظام وطني للابتكار يربط الجامعات، الشركات، والمبتكرين الأفراد.",
      solution: "تم نشر UPLINK كمنصة وطنية مع تخصيص كامل، تكامل مع الأنظمة الحكومية، ونظام حوافز شامل.",
      results: [
        { metric: "مبتكرون مسجلون", value: "50,000+", icon: <Users className="text-purple-600" /> },
        { metric: "مشاريع ممولة", value: "1,200", icon: <DollarSign className="text-green-600" /> },
        { metric: "براءات اختراع", value: "300+", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "وظائف مستحدثة", value: "15,000", icon: <Users className="text-purple-600" /> },
      ],
      testimonial: "UPLINK مكّنتنا من بناء نظام ابتكار وطني يضاهي أفضل الأنظمة العالمية. الأثر على الاقتصاد كان هائلاً.",
      author: "د. فاطمة القحطاني، المديرة التنفيذية",
      image: "🌍",
    },
    {
      id: 5,
      title: "تمكين الابتكار في قطاع الرعاية الصحية",
      company: "HealthTech Solutions",
      industry: "الرعاية الصحية",
      logo: "🏥",
      challenge: "مؤسسة صحية تحتاج إلى ابتكارات سريعة لتحسين رعاية المرضى مع الامتثال للمعايير التنظيمية الصارمة.",
      solution: "استخدمت UPLINK مع التركيز على الامتثال، حماية البيانات، والتعاون بين الأطباء والباحثين والمطورين.",
      results: [
        { metric: "تحسين نتائج المرضى", value: "+35%", icon: <TrendingUp className="text-green-600" /> },
        { metric: "حلول مبتكرة", value: "42", icon: <TrendingUp className="text-blue-600" /> },
        { metric: "توفير في التكاليف", value: "$8M", icon: <DollarSign className="text-green-600" /> },
        { metric: "رضا المرضى", value: "95%", icon: <Users className="text-purple-600" /> },
      ],
      testimonial: "UPLINK ساعدتنا في تسريع الابتكار دون المساس بالأمان أو الامتثال. نموذج مثالي للرعاية الصحية.",
      author: "د. منى العمري، مديرة البحث والتطوير",
      image: "⚕️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            دراسات الحالة
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            قصص نجاح حقيقية من مؤسسات حول العالم حققت نتائج استثنائية مع UPLINK
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <Card key={study.id} className="overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 border-b">
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{study.image}</div>
                  <div className="flex-1">
                    <Badge className="mb-3">{study.industry}</Badge>
                    <h2 className="text-3xl font-bold mb-2">{study.title}</h2>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-2xl">{study.logo}</span>
                      <span className="text-lg font-semibold">{study.company}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Challenge */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      التحدي
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      الحل
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    النتائج
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {study.results.map((result, i) => (
                      <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="flex justify-center mb-3">{result.icon}</div>
                        <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {result.value}
                        </div>
                        <div className="text-sm text-muted-foreground">{result.metric}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-2 border-blue-500/10">
                  <p className="text-lg italic mb-4 leading-relaxed">
                    "{study.testimonial}"
                  </p>
                  <p className="font-semibold text-blue-600">
                    - {study.author}
                  </p>
                </Card>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-16 p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">هل أنت مستعد لتكون قصة النجاح القادمة؟</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المؤسسات الناجحة حول العالم
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center gap-2">
              ابدأ تجربتك المجانية
              <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              تحدث مع خبير
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
