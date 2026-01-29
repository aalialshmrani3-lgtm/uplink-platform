import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function WhyUplink() {
  const competitors = [
    {
      name: "UPLINK 5.0",
      logo: "🚀",
      features: {
        aiEvaluation: true,
        blockchain: true,
        smartContracts: true,
        globalNetwork: true,
        academy: true,
        eliteClub: true,
        apiAccess: true,
        innovationPipeline: true,
        gamification: true,
        multilingual: true,
        openMarket: true,
        ipManagement: true,
      },
      price: "مرن",
      support: "24/7",
    },
    {
      name: "ITONICS",
      logo: "🏢",
      features: {
        aiEvaluation: true,
        blockchain: false,
        smartContracts: false,
        globalNetwork: true,
        academy: false,
        eliteClub: false,
        apiAccess: true,
        innovationPipeline: true,
        gamification: false,
        multilingual: true,
        openMarket: false,
        ipManagement: false,
      },
      price: "مرتفع",
      support: "عمل",
    },
    {
      name: "Brightidea",
      logo: "💡",
      features: {
        aiEvaluation: false,
        blockchain: false,
        smartContracts: false,
        globalNetwork: true,
        academy: false,
        eliteClub: false,
        apiAccess: true,
        innovationPipeline: true,
        gamification: true,
        multilingual: false,
        openMarket: false,
        ipManagement: false,
      },
      price: "مرتفع",
      support: "عمل",
    },
    {
      name: "HYPE",
      logo: "⚡",
      features: {
        aiEvaluation: false,
        blockchain: false,
        smartContracts: false,
        globalNetwork: true,
        academy: false,
        eliteClub: false,
        apiAccess: false,
        innovationPipeline: true,
        gamification: false,
        multilingual: true,
        openMarket: false,
        ipManagement: false,
      },
      price: "مرتفع جداً",
      support: "عمل",
    },
  ];

  const featureLabels = {
    aiEvaluation: "تقييم AI متقدم",
    blockchain: "توثيق Blockchain",
    smartContracts: "عقود ذكية",
    globalNetwork: "شبكة عالمية",
    academy: "أكاديمية تدريب",
    eliteClub: "نادي النخبة",
    apiAccess: "واجهة برمجية API",
    innovationPipeline: "مسار الابتكار",
    gamification: "نظام التحفيز",
    multilingual: "متعدد اللغات",
    openMarket: "سوق مفتوح",
    ipManagement: "إدارة الملكية الفكرية",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            لماذا UPLINK 5.0؟
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            المنصة الوحيدة التي تجمع بين الذكاء الاصطناعي، البلوكتشين، والعقود الذكية في نظام متكامل لإدارة الابتكار
          </p>
        </div>

        {/* What Makes Us Different */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <h2 className="text-3xl font-bold mb-6 text-center">ما يميزنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">ذكاء اصطناعي متقدم</h3>
              <p className="text-muted-foreground">
                تقييم تلقائي للأفكار والمشاريع باستخدام أحدث تقنيات AI
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-semibold mb-2">توثيق Blockchain</h3>
              <p className="text-muted-foreground">
                حماية الملكية الفكرية بتقنية البلوكتشين الآمنة
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-xl font-semibold mb-2">عقود ذكية</h3>
              <p className="text-muted-foreground">
                إدارة التمويل والشراكات بعقود ذكية آمنة
              </p>
            </div>
          </div>
        </Card>

        {/* Comparison Table */}
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">مقارنة مع المنافسين</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-right p-4 font-semibold">الميزة</th>
                  {competitors.map((comp) => (
                    <th key={comp.name} className="text-center p-4">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">{comp.logo}</span>
                        <span className="font-semibold">{comp.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(featureLabels).map(([key, label]) => (
                  <tr key={key} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{label}</td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="text-center p-4">
                        {comp.features[key as keyof typeof comp.features] ? (
                          <Check className="inline-block text-green-500" size={24} />
                        ) : (
                          <X className="inline-block text-red-500" size={24} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">التسعير</td>
                  {competitors.map((comp) => (
                    <td key={comp.name} className="text-center p-4 font-semibold">
                      {comp.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">الدعم الفني</td>
                  {competitors.map((comp) => (
                    <td key={comp.name} className="text-center p-4 font-semibold">
                      {comp.support}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">جاهز للانضمام؟</h2>
          <p className="text-xl text-muted-foreground mb-8">
            ابدأ رحلتك في الابتكار مع المنصة الأكثر تقدماً في العالم
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
            ابدأ الآن مجاناً
          </button>
        </div>
      </div>
    </div>
  );
}
