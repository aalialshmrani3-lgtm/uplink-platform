import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, Crown, Star, Trophy, Users, 
  TrendingUp, Award, Zap, Shield, Globe
} from "lucide-react";

export default function Elite() {
  // Demo elite innovators
  const eliteInnovators = [
    {
      id: 1,
      name: "د. أحمد الشمري",
      title: "مؤسس TechVision AI",
      avatar: null,
      tier: "platinum",
      score: 98,
      projects: 12,
      patents: 5,
      funding: "15M",
      achievements: ["أفضل مبتكر 2024", "براءة اختراع دولية"],
    },
    {
      id: 2,
      name: "م. سارة العتيبي",
      title: "CEO - GreenEnergy Solutions",
      avatar: null,
      tier: "gold",
      score: 94,
      projects: 8,
      patents: 3,
      funding: "8M",
      achievements: ["جائزة الطاقة المتجددة", "تصدير دولي"],
    },
    {
      id: 3,
      name: "أ. خالد القحطاني",
      title: "مؤسس FinTech Arabia",
      avatar: null,
      tier: "gold",
      score: 91,
      projects: 6,
      patents: 2,
      funding: "12M",
      achievements: ["أفضل شركة ناشئة", "شراكة بنكية"],
    },
    {
      id: 4,
      name: "د. نورة الدوسري",
      title: "رئيسة HealthAI Labs",
      avatar: null,
      tier: "silver",
      score: 87,
      projects: 5,
      patents: 4,
      funding: "6M",
      achievements: ["براءة اختراع طبية", "شراكة مع وزارة الصحة"],
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum": return "from-slate-300 to-slate-500";
      case "gold": return "from-amber-400 to-amber-600";
      case "silver": return "from-slate-400 to-slate-600";
      default: return "from-cyan-400 to-cyan-600";
    }
  };

  const getTierText = (tier: string) => {
    switch (tier) {
      case "platinum": return "بلاتيني";
      case "gold": return "ذهبي";
      case "silver": return "فضي";
      default: return tier;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NAQLA 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm">نخبة المبتكرين</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">NAQLA Elite</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            تعرّف على أفضل المبتكرين السعوديين الذين يقودون مسيرة الابتكار
          </p>
        </div>

        {/* Tier Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              tier: "platinum",
              title: "البلاتيني",
              benefits: ["أولوية في التمويل", "دعم مخصص 24/7", "شبكة حصرية", "تمثيل دولي"],
              icon: Crown,
            },
            {
              tier: "gold",
              title: "الذهبي",
              benefits: ["وصول مبكر للفرص", "إرشاد متقدم", "فعاليات VIP", "تسويق مجاني"],
              icon: Trophy,
            },
            {
              tier: "silver",
              title: "الفضي",
              benefits: ["تقييم سريع", "دورات مجانية", "شبكة مبتكرين", "دعم فني"],
              icon: Award,
            },
          ].map((item, i) => (
            <Card key={i} className={`bg-gradient-to-br ${getTierColor(item.tier)}/10 border-slate-700`}>
              <CardContent className="pt-6">
                <item.icon className={`w-12 h-12 mb-4 ${
                  item.tier === "platinum" ? "text-slate-300" :
                  item.tier === "gold" ? "text-amber-400" : "text-slate-400"
                }`} />
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300 text-sm">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Elite Innovators */}
        <h2 className="text-2xl font-bold text-white mb-6">قادة الابتكار</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {eliteInnovators.map((innovator) => (
            <Card key={innovator.id} className="bg-slate-800/50 border-slate-700 hover:border-amber-600/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getTierColor(innovator.tier)} flex items-center justify-center`}>
                    <span className="text-2xl font-bold text-white">
                      {innovator.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-white">{innovator.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs bg-gradient-to-r ${getTierColor(innovator.tier)} text-white`}>
                        {getTierText(innovator.tier)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{innovator.title}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{innovator.score}</div>
                        <div className="text-slate-500 text-xs">النقاط</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{innovator.projects}</div>
                        <div className="text-slate-500 text-xs">مشروع</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{innovator.patents}</div>
                        <div className="text-slate-500 text-xs">براءة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{innovator.funding}</div>
                        <div className="text-slate-500 text-xs">تمويل</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="flex flex-wrap gap-2">
                      {innovator.achievements.map((achievement, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Join */}
        <Card className="bg-gradient-to-r from-amber-950/50 to-slate-900 border-amber-800/50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">كيف تنضم إلى النخبة؟</h2>
              <p className="text-slate-300">حقق الإنجازات التالية للترقية في برنامج Elite</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: TrendingUp, title: "تقييم عالي", desc: "احصل على 80%+ في تقييم AI" },
                { icon: Shield, title: "ملكية فكرية", desc: "سجّل براءة اختراع واحدة على الأقل" },
                { icon: Users, title: "مشاركة فعّالة", desc: "شارك في 3 تحديات أو أكثر" },
                { icon: Globe, title: "تأثير مجتمعي", desc: "حقق إنجازاً ملموساً في مجالك" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/projects/new">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                  ابدأ رحلتك الآن
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
