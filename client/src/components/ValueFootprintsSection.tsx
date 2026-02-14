import { TrendingUp, Building2, Users, DollarSign, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ValueFootprintsSection() {
  const metrics = [
    {
      icon: Building2,
      value: "1,000+",
      label: "شركة ناشئة",
      description: "مؤسسة من خلال المنصة",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Users,
      value: "10,000+",
      label: "وظيفة جديدة",
      description: "تم إيجادها في الشركات الناشئة",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: DollarSign,
      value: "10B+",
      label: "ريال إيرادات",
      description: "حققتها الشركات المدعومة",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Globe,
      value: "0.5%",
      label: "مساهمة في GDP",
      description: "من الاقتصاد الوطني",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10"
    }
  ];

  const goals = [
    {
      title: "رؤية 2030",
      description: "المساهمة في تحقيق أهداف رؤية المملكة 2030",
      icon: "🇸🇦"
    },
    {
      title: "النمو الاقتصادي",
      description: "دعم النمو الاقتصادي من خلال الابتكار",
      icon: "📈"
    },
    {
      title: "التنافسية العالمية",
      description: "الوصول إلى Top 20 في مؤشر الابتكار العالمي",
      icon: "🏆"
    }
  ];

  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            قياس الأثر
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقيس الأثر الحقيقي للابتكار على الاقتصاد الوطني
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  <metric.icon className="w-8 h-8 text-foreground" />
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
                <h3 className="text-lg font-bold mb-1">{metric.label}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {goals.map((goal, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{goal.icon}</div>
                <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/value-footprints">
            <Button size="lg" className="gap-2">
              استكشف التقارير
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
