import { Building2, GraduationCap, Globe, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function InnovationHubsSection() {
  const hubs = [
    {
      icon: GraduationCap,
      title: "الجامعات ومراكز البحث",
      description: "أفكار من الجامعات والمؤسسات البحثية",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
      count: "50+"
    },
    {
      icon: Building2,
      title: "الشركات والمؤسسات",
      description: "حلول من القطاع الخاص والشركات",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      count: "80+"
    },
    {
      icon: Globe,
      title: "الجهات الحكومية",
      description: "مبادرات من الوزارات والهيئات",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      count: "30+"
    },
    {
      icon: Users,
      title: "المبتكرون الأفراد",
      description: "أفكار من المبدعين والمخترعين",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      count: "200+"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            مراكز الابتكار
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نجمع الأفكار من 4 مصادر رئيسية لبناء منظومة ابتكار شاملة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubs.map((hub, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105"
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-xl ${hub.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <hub.icon className={`w-8 h-8 bg-gradient-to-br ${hub.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                </div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {hub.count}
                </div>
                <h3 className="text-xl font-bold mb-2">{hub.title}</h3>
                <p className="text-sm text-muted-foreground">{hub.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
