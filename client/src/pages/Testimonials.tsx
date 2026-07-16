import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Testimonials() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const testimonials = [
    {
      id: 1,
      name: "Dr. Ahmed Al-Malki",
      role: "Innovation Manager - Leading Tech Company",
      company: "TechCorp",
      image: "👨‍💼",
      rating: 5,
      text: "NAQLA 5.0 completely transformed our innovation management. The AI-powered evaluation system saved us weeks of manual work, and smart contracts made transactions more secure and transparent.",
      results: "300% increase in submitted ideas, 70% reduction in evaluation time",
    },
    {
      id: 2,
      name: "Sara Al-Harbi",
      role: "Startup Founder",
      company: "InnovateLab",
      image: "👩‍💻",
      rating: 5,
      text: "As a young innovator, protecting my ideas was my biggest concern. NAQLA's blockchain IP documentation system gave me complete peace of mind. Now I can focus on developing my ideas without worry.",
      results: "Secured $500K in funding within 3 months",
    },
    {
      id: 3,
      name: "Eng. Khalid Al-Otaibi",
      role: "Project Manager",
      company: "Innovation Hub",
      image: "👨‍🔬",
      rating: 5,
      text: "NAQLA's integrated Pipeline system surpasses all global platforms we've tried. The ability to track ideas from inception to execution, with smart AI analytics, made our work significantly more efficient.",
      results: "Successfully launched 15 innovation projects in one year",
    },
    {
      id: 4,
      name: "Dr. Fatima Al-Qahtani",
      role: "Angel Investor",
      company: "Angel Investors Network",
      image: "👩‍💼",
      rating: 5,
      text: "NAQLA's smart recommendation system helped me discover excellent investment opportunities. Accurate evaluations and comprehensive analytics made my investment decisions more confident and successful.",
      results: "250% ROI in the first year",
    },
    {
      id: 5,
      name: "Yousef Al-Shammari",
      role: "Entrepreneur",
      company: "StartupX",
      image: "👨‍💼",
      rating: 5,
      text: "NAQLA's Academy and Elite Club opened doors I never dreamed of. Specialized training and a global network of innovators helped me develop my project professionally.",
      results: "Expanded to 5 countries in less than a year",
    },
    {
      id: 6,
      name: "Dr. Mona Al-Omari",
      role: "R&D Manager",
      company: "Research Institute",
      image: "👩‍🔬",
      rating: 5,
      text: "The advanced API allowed us to seamlessly integrate NAQLA with our internal systems. Now we have a comprehensive innovation management system connecting all our departments.",
      results: "400% improvement in inter-departmental collaboration",
    },
  ];

  const stats = [
    { label: "Satisfied Customer", value: "10,000+", icon: "😊" },
    { label: "Average Rating", value: "4.9/5", icon: "⭐" },
    { label: "Successful Project", value: "50,000+", icon: "🚀" },
    { label: "Success Rate", value: "95%", icon: "📈" },
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
            آلاف المبتكرين والمستثمرين حول العالم يثقون في NAQLA لإدارة ابتكاراتهم
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
                <p className="text-sm font-semibold text-blue-600 mb-1">{isAr ? isAr ? "النتائج:" : "Results:" : "Results:"}</p>
                <p className="text-sm">{testimonial.results}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">{isAr ? isAr ? "انضم إلى آلاف المبتكرين الناجحين" : "Join thousands of successful innovators" : "Join thousands of successful innovators"}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ابدأ رحلتك في الابتكار اليوم واكتشف لماذا يثق الآلاف في NAQLA
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
