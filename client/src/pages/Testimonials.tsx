import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "د. أحمد المالكي",
      role: "مدير الابتكار - شركة تقنية رائدة",
      company: "TechCorp",
      image: "👨‍💼",
      rating: 5,
      text: "UPLINK 5.0 غيّرت طريقة إدارتنا للابتكار بالكامل. نظام التقييم بالذكاء الاصطناعي وفّر علينا أسابيع من العمل اليدوي، والعقود الذكية جعلت التعاملات أكثر أماناً وشفافية.",
      results: "زيادة 300% في الأفكار المقدمة، وتقليل 70% في وقت التقييم",
    },
    {
      id: 2,
      name: "سارة الحربي",
      role: "مؤسسة ناشئة",
      company: "InnovateLab",
      image: "👩‍💻",
      rating: 5,
      text: "كمبتكرة شابة، كانت حماية أفكاري أكبر همومي. نظام توثيق الملكية الفكرية بتقنية Blockchain أعطاني راحة البال الكاملة. الآن أستطيع التركيز على تطوير أفكاري دون قلق.",
      results: "حصلت على تمويل بقيمة $500K خلال 3 أشهر",
    },
    {
      id: 3,
      name: "م. خالد العتيبي",
      role: "مدير المشاريع",
      company: "Innovation Hub",
      image: "👨‍🔬",
      rating: 5,
      text: "نظام Pipeline المتكامل في UPLINK يفوق كل المنصات العالمية التي جربناها. القدرة على تتبع الأفكار من البداية حتى التنفيذ، مع تحليلات AI الذكية، جعلت عملنا أكثر كفاءة بكثير.",
      results: "نجحنا في إطلاق 15 مشروع ابتكاري في سنة واحدة",
    },
    {
      id: 4,
      name: "د. فاطمة القحطاني",
      role: "مستثمرة ملاك",
      company: "Angel Investors Network",
      image: "👩‍💼",
      rating: 5,
      text: "نظام التوصيات الذكية في UPLINK ساعدني في اكتشاف فرص استثمارية ممتازة. التقييمات الدقيقة والتحليلات الشاملة جعلت قراراتي الاستثمارية أكثر ثقة ونجاحاً.",
      results: "عائد استثمار بنسبة 250% في السنة الأولى",
    },
    {
      id: 5,
      name: "يوسف الشمري",
      role: "رائد أعمال",
      company: "StartupX",
      image: "👨‍💼",
      rating: 5,
      text: "الأكاديمية ونادي النخبة في UPLINK فتحا لي أبواباً لم أكن أحلم بها. التدريب المتخصص والشبكة العالمية من المبتكرين ساعدتني في تطوير مشروعي بشكل احترافي.",
      results: "توسعت إلى 5 دول في أقل من سنة",
    },
    {
      id: 6,
      name: "د. منى العمري",
      role: "مديرة البحث والتطوير",
      company: "Research Institute",
      image: "👩‍🔬",
      rating: 5,
      text: "واجهة API المتقدمة سمحت لنا بدمج UPLINK مع أنظمتنا الداخلية بسلاسة. الآن لدينا نظام متكامل لإدارة الابتكار يربط جميع أقسامنا.",
      results: "تحسين التعاون بين الأقسام بنسبة 400%",
    },
  ];

  const stats = [
    { label: "عميل راضٍ", value: "10,000+", icon: "😊" },
    { label: "تقييم متوسط", value: "4.9/5", icon: "⭐" },
    { label: "مشروع ناجح", value: "50,000+", icon: "🚀" },
    { label: "معدل النجاح", value: "95%", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ماذا يقول عملاؤنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            آلاف المبتكرين والمستثمرين حول العالم يثقون في UPLINK لإدارة ابتكاراتهم
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-8 hover:shadow-xl transition-shadow relative">
              {/* Quote Icon */}
              <Quote className="absolute top-4 left-4 text-blue-500/20" size={48} />
              
              {/* Header */}
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="text-5xl">{testimonial.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{testimonial.role}</p>
                  <p className="text-sm font-semibold text-blue-600">{testimonial.company}</p>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Results */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                <p className="text-sm font-semibold text-blue-600 mb-1">النتائج:</p>
                <p className="text-sm">{testimonial.results}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">انضم إلى آلاف المبتكرين الناجحين</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ابدأ رحلتك في الابتكار اليوم واكتشف لماذا يثق الآلاف في UPLINK
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              ابدأ الآن مجاناً
            </button>
            <button className="px-8 py-4 bg-background border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              تحدث مع فريقنا
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
