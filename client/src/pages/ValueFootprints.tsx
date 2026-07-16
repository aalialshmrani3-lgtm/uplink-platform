/**
 * Value Footprints Dashboard - Professional Impact Analytics
 * لوحة معلومات قياس الأثر - نسخة احترافية مع بيانات توضيحية
 */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Building2, Users, DollarSign, Target, Globe,
  Award, Zap, Leaf, BarChart3, ArrowUpRight,
  Lightbulb, Handshake, Star, Shield, ChevronRight
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const impactStats = [
  { title: "Total Ideas Submitted", value: "2,847", change: "+18.3%", icon: Lightbulb, color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20" },
  { title: "Spinoff Startups", value: "312", change: "+24.1%", icon: Building2, color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" },
  { title: "Jobs Created", value: "8,640", change: "+31.7%", icon: Users, color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
  { title: "Investment Volume (SAR)", value: "1.2B", change: "+42.5%", icon: DollarSign, color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/20" },
  { title: "Patents Registered", value: "487", change: "+15.2%", icon: Shield, color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  { title: "Strategic Partnerships", value: "94", change: "+8.9%", icon: Handshake, color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/20" },
];

const monthlyData = [
  { month: "January", ideas: 180 },
  { month: "February", ideas: 210 },
  { month: "March", ideas: 245 },
  { month: "April", ideas: 290 },
  { month: "May", ideas: 320 },
  { month: "June", ideas: 380 },
];

const sdgImpact = [
  { goal: "SDG 8", title: "Decent Work & Economic Growth", progress: 78, color: "bg-amber-500", icon: "💼" },
  { goal: "SDG 9", title: "Industry, Innovation & Infrastructure", progress: 85, color: "bg-orange-500", icon: "🏭" },
  { goal: "SDG 13", title: "Climate Action", progress: 62, color: "bg-green-500", icon: "🌱" },
  { goal: "SDG 17", title: "Partnerships for Goals", progress: 71, color: "bg-blue-500", icon: "🤝" },
];

const sectorBreakdown = [
  { sector: "Renewable Energy", count: 423, percentage: 28, color: "from-green-500 to-emerald-600" },
  { sector: "Tech & AI", count: 387, percentage: 26, color: "from-blue-500 to-indigo-600" },
  { sector: "Health & Biotech", count: 298, percentage: 20, color: "from-pink-500 to-rose-600" },
  { sector: "Smart Agriculture", count: 195, percentage: 13, color: "from-yellow-500 to-amber-600" },
  { sector: "Smart Cities", count: 195, percentage: 13, color: "from-purple-500 to-violet-600" },
];

const topInnovations = [
  { name: "Solar-Powered Battery Cooling System", sector: "Renewable Energy", impact: "40% Reduction in Operating Costs", stage: "Naqla 3", rating: 4.9 },
  { name: "AI Platform for Medical Diagnosis", sector: "Health", impact: "94.7% Diagnostic Accuracy", stage: "Naqla 2", rating: 4.8 },
  { name: "Autonomous Solar Panel Cleaning Robot", sector: "Renewable Energy", impact: "23% Efficiency Increase", stage: "Naqla 3", rating: 4.7 },
  { name: "Smart Sensor-Based Irrigation System", sector: "Smart Agriculture", impact: "60% Water Saving", stage: "Naqla 2", rating: 4.6 },
];

const maxIdeas = Math.max(...monthlyData.map(d => d.ideas));

export default function ValueFootprints() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<"overview" | "sectors" | "sdg" | "top">("overview");

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEOHead
        title={isAr ? "قياس الأثر - منصة نقلة" : "Impact Measurement - Naqla Platform"}
        description={isAr ? "تتبع الأثر الاقتصادي والاجتماعي لمنصة نقلة 5.0" : "Tracking Naqla 5.0's Socio-Economic Impact"}
      />

      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">{isAr ? "قياس الأثر" : "Impact Measurement"}</h1>
              </div>
              <p className="text-muted-foreground max-w-xl">
                تتبع الأثر الاقتصادي والاجتماعي لمنصة نقلة 5.0 على مستوى المملكة والعالم
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 ml-1 animate-pulse" />
                مباشر
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">{isAr ? isAr ? "آخر تحديث: اليوم" : "Last updated: Today" : "Last updated: Today"}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`border ${stat.borderColor} ${stat.bgColor} hover:scale-105 transition-transform duration-200`}>
                <CardContent className="p-4">
                  <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border/50">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "sectors", label: "Sectors", icon: Building2 },
            { id: "sdg", label: "Development Goals", icon: Globe },
            { id: "top", label: "Key Innovations", icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  الأفكار المقدمة شهرياً
                </CardTitle>
                <CardDescription>{isAr ? isAr ? "النمو التراكمي خلال النصف الأول من 2025" : "Cumulative Growth H1 2025" : "Cumulative Growth H1 2025"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyData.map((month, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 text-xs text-muted-foreground">{month.month}</div>
                      <div className="flex-1 bg-secondary/30 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(month.ideas / maxIdeas) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">{month.ideas}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  توزيع الأفكار حسب المسار
                </CardTitle>
                <CardDescription>{isAr ? isAr ? "تصنيف الأفكار عبر المحركات الثلاثة" : "Idea Classification by Three Engines" : "Idea Classification by Three Engines"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Innovation Path (Naqla 1 → 2 → 3)", value: 68, count: "1,936", color: "from-emerald-500 to-teal-600", icon: "🚀" },
                  { label: "Commercial Path (Naqla 1 → 3)", value: 22, count: "626", color: "from-blue-500 to-indigo-600", icon: "💼" },
                  { label: "In Development (Return to Innovator)", value: 10, count: "285", color: "from-yellow-500 to-amber-600", icon: "🔄" },
                ].map((path, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{path.icon} {path.label}</span>
                      <span className="text-muted-foreground">{path.count} ({path.value}%)</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${path.color} rounded-full`} style={{ width: `${path.value}%` }} />
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-foreground">{isAr ? isAr ? "معدل التحويل الإجمالي" : "Total Conversion Rate" : "Total Conversion Rate"}</span>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">90%</div>
                  <div className="text-xs text-muted-foreground mt-1">{isAr ? isAr ? "من الأفكار المقدمة تنتقل إلى مرحلة التطوير" : "of submitted ideas move to development phase" : "of submitted ideas move to development phase"}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  الأثر الجغرافي
                </CardTitle>
                <CardDescription>{isAr ? isAr ? "توزيع المبتكرين والشركاء حول العالم" : "Distribution of Innovators & Partners Worldwide" : "Distribution of Innovators & Partners Worldwide"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { region: "Saudi Arabia", count: "1,842", flag: "🇸🇦", percentage: 65 },
                    { region: "GCC Countries", count: "512", flag: "🌍", percentage: 18 },
                    { region: "Arab World", count: "312", flag: "🌐", percentage: 11 },
                    { region: "International", count: "181", flag: "🌏", percentage: 6 },
                  ].map((region, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/50 text-center">
                      <div className="text-3xl mb-2">{region.flag}</div>
                      <div className="text-xl font-bold text-foreground">{region.count}</div>
                      <div className="text-xs text-muted-foreground mt-1">{region.region}</div>
                      <div className="mt-2 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${region.percentage}%` }} />
                      </div>
                      <div className="text-xs text-cyan-400 mt-1">{region.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sectors Tab */}
        {activeTab === "sectors" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>{isAr ? isAr ? "توزيع الأفكار حسب القطاع" : "Idea Distribution by Sector" : "[Idea Distribution by Sector]"}</CardTitle>
                <CardDescription>{isAr ? isAr ? "أبرز القطاعات الاستراتيجية في المنصة" : "Key Strategic Sectors on the Platform" : "Key Strategic Sectors on the Platform"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectorBreakdown.map((sector, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{sector.sector}</span>
                      <span className="text-muted-foreground">{sector.count} فكرة ({sector.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${sector.color} rounded-full`} style={{ width: `${sector.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>{isAr ? isAr ? "الأثر الاقتصادي بالقطاع" : "Economic Impact by Sector" : "Economic Impact by Sector"}</CardTitle>
                <CardDescription>{isAr ? isAr ? "حجم الاستثمارات المُستقطبة لكل قطاع" : "Attracted Investments per Sector" : "Attracted Investments per Sector"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { sector: "Renewable Energy", investment: "450M", jobs: "2,840", color: "text-green-400" },
                    { sector: "Tech & AI", investment: "380M", jobs: "2,210", color: "text-blue-400" },
                    { sector: "Health & Biotech", investment: "210M", jobs: "1,650", color: "text-pink-400" },
                    { sector: "Smart Agriculture", investment: "95M", jobs: "980", color: "text-yellow-400" },
                    { sector: "Smart Cities", investment: "65M", jobs: "960", color: "text-purple-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/30">
                      <span className="text-sm font-medium text-foreground">{item.sector}</span>
                      <div className="flex gap-4 text-xs">
                        <span className={`font-bold ${item.color}`}>{item.investment} ريال</span>
                        <span className="text-muted-foreground">{item.jobs} وظيفة</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SDG Tab */}
        {activeTab === "sdg" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {sdgImpact.map((sdg, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{sdg.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{sdg.goal}</Badge>
                          <span className="text-sm font-medium text-foreground">{sdg.title}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{isAr ? isAr ? "مستوى التأثير" : "Impact Level" : "Impact Level"}</span>
                            <span className="font-bold text-foreground">{sdg.progress}%</span>
                          </div>
                          <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                            <div className={`h-full ${sdg.color} rounded-full`} style={{ width: `${sdg.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-bold text-foreground">{isAr ? isAr ? "الأثر البيئي والمناخي" : "Environmental & Climate Impact" : "Environmental & Climate Impact"}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "Reduced CO₂ Emissions", value: "124,000 Tons", icon: "🌿" },
                    { label: "Added Renewable Energy", value: "850 MW", icon: "☀️" },
                    { label: "Water Saved", value: "2.4M m³", icon: "💧" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="text-xl font-bold text-emerald-400">{item.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Innovations Tab */}
        {activeTab === "top" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">{isAr ? isAr ? "أبرز الابتكارات المؤثرة" : "Key Impactful Innovations" : "Key Impactful Innovations"}</h3>
              <Button variant="outline" size="sm">
                عرض الكل
                <ChevronRight className="w-4 h-4 mr-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {topInnovations.map((innovation, i) => (
                <Card key={i} className="border-border/50 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-lg">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏅"}
                        </div>
                        <Badge variant="outline" className="text-xs">{innovation.sector}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{innovation.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-cyan-400 transition-colors">
                      {innovation.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <Award className="w-4 h-4" />
                        <span>{innovation.impact}</span>
                      </div>
                      <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                        {innovation.stage}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5 mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🇸🇦</div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{isAr ? isAr ? "التوافق مع رؤية 2030" : "Alignment with Vision 2030" : "Alignment with Vision 2030"}</h3>
                    <p className="text-sm text-muted-foreground">{isAr ? isAr ? "مساهمة منصة نقلة في تحقيق أهداف رؤية المملكة" : "Naqla Platform's Contribution to Kingdom's Vision Goals" : "Naqla Platform's Contribution to Kingdom's Vision Goals"}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: "Increase Private Sector Share", target: "65%", current: "58%", color: "text-blue-400" },
                    { label: "Digital Economy", target: "19.9%", current: "16.4%", color: "text-purple-400" },
                    { label: "Patents", target: "10,000", current: "7,240", color: "text-cyan-400" },
                    { label: "R&D Spending", target: "2.5%", current: "1.8%", color: "text-emerald-400" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl border border-border/50 bg-card/30 text-center">
                      <div className={`text-lg font-bold ${item.color}`}>{item.current}</div>
                      <div className="text-xs text-muted-foreground">من {item.target}</div>
                      <div className="text-xs text-foreground mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Innovation Impact Section */}
        <div className="mt-8 p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-violet-500/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{isAr ? isAr ? "مؤشرات الأثر والابتكار" : "Impact & Innovation Indicators" : "Impact & Innovation Indicators"}</h3>
              <p className="text-sm text-muted-foreground">{isAr ? isAr ? "منصة نقلة — أهداف الابتكار الوطنية والدولية" : "Naqla Platform — National & International Innovation Goals" : "Naqla Platform — National & International Innovation Goals"}</p>
            </div>
            <a href="/admin"
              className="mr-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              <span>{isAr ? isAr ? "برامج دولية" : "International Programs" : "[International Programs]"}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Market-Ready TRL 7-9 Innovations", value: "127", target: "200", progress: 63, color: "bg-violet-500", icon: "🚀" },
              { label: "Partnerships with International Institutions", value: "18", target: "30", progress: 60, color: "bg-blue-500", icon: "🌐" },
              { label: "Biotech Projects", value: "43", target: "80", progress: 54, color: "bg-pink-500", icon: "🧬" },
              { label: "Advanced Materials Projects", value: "31", target: "60", progress: 52, color: "bg-amber-500", icon: "⚗️" },
            ].map((kpi, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/30">
                <div className="text-2xl mb-2">{kpi.icon}</div>
                <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
                <div className="text-xs text-muted-foreground mb-3">{kpi.label}</div>
                <div className="w-full bg-border/30 rounded-full h-2">
                  <div className={`h-2 ${kpi.color} rounded-full transition-all duration-700`} style={{ width: `${kpi.progress}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{kpi.progress}% من الهدف ({kpi.target})</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Clean Tech", count: "89 Projects", growth: "+34%", icon: "🌿", link: "/challenges" },
              { title: "Biotech", count: "43 Projects", growth: "+28%", icon: "🧬", link: "/challenges" },
              { title: "Advanced Materials", count: "31 Projects", growth: "+19%", icon: "⚗️", link: "/challenges" },
            ].map((sector, i) => (
              <a key={i} href={sector.link}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/30 hover:border-blue-500/40 transition-colors group">
                <div className="text-3xl">{sector.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground group-hover:text-blue-400 transition-colors">{sector.title}</div>
                  <div className="text-xs text-muted-foreground">{sector.count}</div>
                </div>
                <div className="text-xs font-bold text-emerald-400">{sector.growth}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground py-4 border-t border-border/30">
          * البيانات المعروضة تمثل مؤشرات توضيحية لأهداف المنصة. سيتم تحديثها بالبيانات الفعلية عند توفرها.
        </div>
      </div>
    </div>
  );
}
