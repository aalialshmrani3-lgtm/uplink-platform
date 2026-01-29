import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { 
  Rocket, Globe, Search, Filter, Lightbulb, 
  TrendingUp, Shield, Eye, Heart, MessageSquare
} from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();

  // Demo projects for marketplace
  const demoProjects = [
    {
      id: 1,
      title: "نظام ذكاء اصطناعي للتشخيص الطبي",
      description: "منصة AI متقدمة لتحليل الصور الطبية وتقديم تشخيصات دقيقة",
      category: "healthcare",
      stage: "mvp",
      fundingNeeded: "2000000",
      views: 1250,
      likes: 89,
      score: 85,
    },
    {
      id: 2,
      title: "منصة إدارة الطاقة الذكية",
      description: "حل متكامل لمراقبة وتحسين استهلاك الطاقة في المباني",
      category: "energy",
      stage: "prototype",
      fundingNeeded: "1500000",
      views: 890,
      likes: 67,
      score: 78,
    },
    {
      id: 3,
      title: "تطبيق التعليم التفاعلي",
      description: "منصة تعليمية تستخدم الواقع المعزز لتحسين تجربة التعلم",
      category: "education",
      stage: "growth",
      fundingNeeded: "3000000",
      views: 2100,
      likes: 156,
      score: 92,
    },
    {
      id: 4,
      title: "نظام اللوجستيات الذكي",
      description: "حل لتحسين سلاسل التوريد باستخدام الذكاء الاصطناعي",
      category: "logistics",
      stage: "mvp",
      fundingNeeded: "2500000",
      views: 780,
      likes: 45,
      score: 74,
    },
    {
      id: 5,
      title: "محفظة رقمية للعملات المشفرة",
      description: "محفظة آمنة ومتوافقة مع الأنظمة السعودية",
      category: "fintech",
      stage: "idea",
      fundingNeeded: "1000000",
      views: 1500,
      likes: 98,
      score: 68,
    },
    {
      id: 6,
      title: "روبوت الزراعة الذكية",
      description: "روبوت آلي لمراقبة المحاصيل والري الذكي",
      category: "agriculture",
      stage: "prototype",
      fundingNeeded: "4000000",
      views: 650,
      likes: 34,
      score: 81,
    },
  ];

  const displayProjects = projects && projects.length > 0 ? projects : demoProjects;

  const getCategoryText = (category: string | null) => {
    switch (category) {
      case "healthcare": return "الرعاية الصحية";
      case "energy": return "الطاقة";
      case "education": return "التعليم";
      case "logistics": return "اللوجستيات";
      case "fintech": return "التقنية المالية";
      case "agriculture": return "الزراعة";
      case "technology": return "التقنية";
      default: return category || "عام";
    }
  };

  const getStageText = (stage: string | null) => {
    switch (stage) {
      case "idea": return "فكرة";
      case "prototype": return "نموذج أولي";
      case "mvp": return "MVP";
      case "growth": return "نمو";
      case "scale": return "توسع";
      default: return stage || "فكرة";
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">UPLINK3 - السوق والتبادل</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">سوق الابتكارات</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            اكتشف أفضل الابتكارات السعودية واستثمر في المستقبل
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن ابتكار..."
              className="bg-slate-800 border-slate-700 text-white pr-10"
            />
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project: any) => (
              <Card 
                key={project.id} 
                className="bg-slate-800/50 border-slate-700 hover:border-purple-600/50 transition-all group"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Lightbulb className="w-7 h-7 text-purple-400" />
                    </div>
                    {project.score && (
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        project.score >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                        project.score >= 60 ? "bg-blue-500/20 text-blue-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {project.score}%
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                      {getCategoryText(project.category)}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                      {getStageText(project.stage)}
                    </span>
                  </div>

                  {/* Funding */}
                  {project.fundingNeeded && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-slate-900/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-white font-bold">
                          {Number(project.fundingNeeded).toLocaleString()} ريال
                        </div>
                        <div className="text-slate-400 text-xs">التمويل المطلوب</div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>0</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" className="border-slate-700 text-slate-300">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA for Investors */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900 border-purple-800/50">
            <CardContent className="p-8">
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">للمستثمرين</h3>
              <p className="text-slate-300 mb-6">
                اكتشف فرص استثمارية مميزة في أفضل الابتكارات السعودية مع حماية كاملة عبر نظام الضمان
              </p>
              <Button className="bg-purple-500 hover:bg-purple-600">
                سجّل كمستثمر
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-950/50 to-slate-900 border-cyan-800/50">
            <CardContent className="p-8">
              <Lightbulb className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">للمبتكرين</h3>
              <p className="text-slate-300 mb-6">
                اعرض ابتكارك أمام آلاف المستثمرين والشركات واحصل على التمويل الذي تحتاجه
              </p>
              <Link href="/projects/new">
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  سجّل ابتكارك
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
