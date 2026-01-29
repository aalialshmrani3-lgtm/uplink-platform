import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, Brain, Trophy, Calendar, Users, 
  DollarSign, Clock, ArrowLeft, Zap
} from "lucide-react";

export default function Challenges() {
  const { data: challenges, isLoading } = trpc.challenge.getAll.useQuery();

  // Demo challenges for display
  const demoChallenges = [
    {
      id: 1,
      title: "تحدي الذكاء الاصطناعي للرعاية الصحية",
      description: "تطوير حلول AI مبتكرة لتحسين التشخيص الطبي وتجربة المريض",
      type: "hackathon",
      category: "healthcare",
      prize: "500000",
      status: "open",
      participants: 156,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      title: "مسابقة الطاقة المتجددة",
      description: "ابتكارات في مجال الطاقة الشمسية والهيدروجين الأخضر",
      type: "competition",
      category: "energy",
      prize: "1000000",
      status: "open",
      participants: 89,
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      title: "تحدي المدن الذكية",
      description: "حلول تقنية لتحسين جودة الحياة في المدن السعودية",
      type: "challenge",
      category: "technology",
      prize: "750000",
      status: "open",
      participants: 234,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      title: "هاكاثون التقنية المالية",
      description: "ابتكارات في مجال الدفع الرقمي والخدمات المصرفية",
      type: "hackathon",
      category: "fintech",
      prize: "300000",
      status: "closed",
      participants: 312,
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  const displayChallenges = challenges && challenges.length > 0 ? challenges : demoChallenges;

  const getTypeText = (type: string) => {
    switch (type) {
      case "hackathon": return "هاكاثون";
      case "competition": return "مسابقة";
      case "challenge": return "تحدي";
      case "open_problem": return "مشكلة مفتوحة";
      case "conference": return "مؤتمر";
      default: return type;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "healthcare": return "الرعاية الصحية";
      case "energy": return "الطاقة";
      case "technology": return "التقنية";
      case "fintech": return "التقنية المالية";
      case "education": return "التعليم";
      default: return category;
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
                UPLINK 5.0
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">UPLINK2 - التحديات والمطابقة</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">التحديات والمسابقات</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            شارك في تحديات الابتكار وتنافس على جوائز قيمة مع أفضل المبتكرين
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "تحدي نشط", value: "12", icon: Zap },
            { label: "مشارك", value: "2,500+", icon: Users },
            { label: "إجمالي الجوائز", value: "5M+", icon: DollarSign },
            { label: "فائز", value: "150+", icon: Trophy },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Challenges Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayChallenges.map((challenge: any) => (
              <Card 
                key={challenge.id} 
                className={`bg-slate-800/50 border-slate-700 hover:border-blue-600/50 transition-all ${
                  challenge.status === "closed" ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        challenge.status === "open" ? "bg-blue-500/20" : "bg-slate-700"
                      }`}>
                        <Trophy className={`w-6 h-6 ${challenge.status === "open" ? "text-blue-400" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          challenge.status === "open" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"
                        }`}>
                          {challenge.status === "open" ? "مفتوح" : "مغلق"}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 mr-2">
                          {getTypeText(challenge.type)}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-white">
                        {Number(challenge.prize).toLocaleString()}
                      </div>
                      <div className="text-slate-400 text-xs">ريال جائزة</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{challenge.description}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants} مشارك</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {challenge.status === "open" 
                          ? `ينتهي ${new Date(challenge.endDate).toLocaleDateString("ar-SA")}`
                          : "انتهى"
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                      {getCategoryText(challenge.category)}
                    </span>
                    <Button 
                      disabled={challenge.status === "closed"}
                      className={challenge.status === "open" 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-slate-700 cursor-not-allowed"
                      }
                    >
                      {challenge.status === "open" ? "شارك الآن" : "انتهى التحدي"}
                      {challenge.status === "open" && <ArrowLeft className="w-4 h-4 mr-2" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 text-center border border-blue-800/50">
          <h2 className="text-2xl font-bold text-white mb-4">هل لديك تحدي لطرحه؟</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            إذا كنت شركة أو جهة حكومية وتريد طرح تحدي للمبتكرين، تواصل معنا
          </p>
          <Button className="bg-white text-slate-900 hover:bg-slate-100">
            تواصل معنا
          </Button>
        </div>
      </div>
    </div>
  );
}
