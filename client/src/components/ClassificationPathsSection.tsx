import { Rocket, Briefcase, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ClassificationPathsSection() {
  const paths = [
    {
      icon: Rocket,
      title: "مسار الابتكار",
      subtitle: "Innovation Path",
      score: "≥70%",
      description: "أفكار ابتكارية عالية الجودة تحصل على تسريع فوري + blockchain + تسجيل IP",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      features: [
        "تسريع فوري في برامج الاحتضان",
        "تسجيل blockchain للملكية الفكرية",
        "دعم تسجيل براءات الاختراع"
      ]
    },
    {
      icon: Briefcase,
      title: "مسار التجاري",
      subtitle: "Commercial Path",
      score: "60-70%",
      description: "حلول تجارية قابلة للتطبيق تحصل على دعم من الحاضنات والشركاء التجاريين",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      features: [
        "دعم من الحاضنات والمسرعات",
        "ربط مع المستثمرين والشركات",
        "استشارات تجارية متخصصة"
      ]
    },
    {
      icon: Lightbulb,
      title: "مسار التوجيه",
      subtitle: "Guidance Path",
      score: "<60%",
      description: "أفكار تحتاج تطوير تحصل على توجيه واقتراحات لتحسينها وإعادة تقديمها",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      features: [
        "تحليل تفصيلي نقاط القوة والضعف",
        "اقتراحات محددة للتحسين",
        "إمكانية إعادة التقديم بعد التطوير"
      ]
    }
  ];

  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            مسارات التصنيف الذكي
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نظام تقييم ذكي يصنف الأفكار تلقائياً إلى 3 مسارات بناءً على الجودة والجدوى
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {paths.map((path, index) => (
            <Card 
              key={index}
              className={`group hover:shadow-2xl transition-all duration-300 border ${path.borderColor} bg-card/50 backdrop-blur-sm hover:scale-105`}
            >
              <CardContent className="p-8">
                <div className={`w-20 h-20 rounded-2xl ${path.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto`}>
                  <path.icon className="w-10 h-10 text-foreground" />
                </div>
                
                <div className="text-center mb-4">
                  <div className={`inline-block px-4 py-2 rounded-full ${path.bgColor} mb-3`}>
                    <span className={`text-lg font-bold bg-gradient-to-r ${path.color} bg-clip-text text-transparent`}>
                      {path.score}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                </div>

                <p className="text-muted-foreground mb-6 text-center">
                  {path.description}
                </p>

                <ul className="space-y-3">
                  {path.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 bg-gradient-to-r ${path.color} bg-clip-text text-transparent`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/classification-paths">
            <Button size="lg" className="gap-2">
              استكشف المسارات
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
