import { Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function StrategicPartnersSection() {
  const partners = [
    {
      name: "KAUST",
      fullName: "جامعة الملك عبدالله للعلوم والتقنية",
      description: "دعم البحث العلمي والابتكار التقني",
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "SAIP",
      fullName: "الهيئة السعودية للملكية الفكرية",
      description: "تسجيل وحماية براءات الاختراع",
      color: "from-emerald-500 to-teal-600"
    },
    {
      name: "RDIA",
      fullName: "هيئة تطوير البحث والتطوير والابتكار",
      description: "تمويل ودعم مشاريع البحث والابتكار",
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "MCIT",
      fullName: "وزارة الاتصالات وتقنية المعلومات",
      description: "دعم التحول الرقمي والابتكار التقني",
      color: "from-orange-500 to-red-600"
    },
    {
      name: "SDAIA",
      fullName: "الهيئة السعودية للبيانات والذكاء الاصطناعي",
      description: "دعم مشاريع الذكاء الاصطناعي والبيانات",
      color: "from-indigo-500 to-blue-600"
    },
    {
      name: "Monsha'at",
      fullName: "الهيئة العامة للمنشآت الصغيرة والمتوسطة",
      description: "دعم الشركات الناشئة والمنشآت الصغيرة",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            الشركاء الاستراتيجيون
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            شراكات استراتيجية مع أبرز الجهات السعودية لدعم المبتكرين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {partners.map((partner, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-1 bg-gradient-to-r ${partner.color} bg-clip-text text-transparent`}>
                      {partner.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {partner.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/strategic-partners">
            <Button size="lg" className="gap-2">
              استكشف الشركاء
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
