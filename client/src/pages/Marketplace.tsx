import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { 
  Rocket, Globe, Search, Filter, Lightbulb, 
  TrendingUp, Shield, Eye, Heart, MessageSquare,
  X, SlidersHorizontal, ArrowUpDown, Grid3X3, List,
  Sparkles, Target, DollarSign, Star, ChevronDown,
  Building2, Users, MapPin, Calendar
} from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  
  // Advanced Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedScore, setSelectedScore] = useState("all");
  const [fundingRange, setFundingRange] = useState([0, 10000000]);
  const [hasIP, setHasIP] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { data: projects, isLoading } = trpc.project.getAll.useQuery();

  // Demo projects for marketplace
  const demoProjects = [
    {
      id: 1,
      title: "نظام ذكاء اصطناعي للتشخيص الطبي",
      description: "منصة AI متقدمة لتحليل الصور الطبية وتقديم تشخيصات دقيقة باستخدام أحدث تقنيات التعلم العميق",
      category: "healthcare",
      stage: "mvp",
      fundingNeeded: "2000000",
      views: 1250,
      likes: 89,
      score: 85,
      hasIP: true,
      verified: true,
      location: "الرياض",
      teamSize: 8,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      title: "منصة إدارة الطاقة الذكية",
      description: "حل متكامل لمراقبة وتحسين استهلاك الطاقة في المباني التجارية والسكنية",
      category: "energy",
      stage: "prototype",
      fundingNeeded: "1500000",
      views: 890,
      likes: 67,
      score: 78,
      hasIP: true,
      verified: true,
      location: "جدة",
      teamSize: 5,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      title: "تطبيق التعليم التفاعلي",
      description: "منصة تعليمية تستخدم الواقع المعزز والذكاء الاصطناعي لتحسين تجربة التعلم",
      category: "education",
      stage: "growth",
      fundingNeeded: "3000000",
      views: 2100,
      likes: 156,
      score: 92,
      hasIP: false,
      verified: true,
      location: "الرياض",
      teamSize: 12,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      title: "نظام اللوجستيات الذكي",
      description: "حل لتحسين سلاسل التوريد باستخدام الذكاء الاصطناعي والتحليلات التنبؤية",
      category: "logistics",
      stage: "mvp",
      fundingNeeded: "2500000",
      views: 780,
      likes: 45,
      score: 74,
      hasIP: true,
      verified: false,
      location: "الدمام",
      teamSize: 6,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: 5,
      title: "محفظة رقمية للعملات المشفرة",
      description: "محفظة آمنة ومتوافقة مع الأنظمة السعودية لإدارة الأصول الرقمية",
      category: "fintech",
      stage: "idea",
      fundingNeeded: "1000000",
      views: 1500,
      likes: 98,
      score: 68,
      hasIP: false,
      verified: false,
      location: "الرياض",
      teamSize: 3,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: 6,
      title: "روبوت الزراعة الذكية",
      description: "روبوت آلي لمراقبة المحاصيل والري الذكي باستخدام تقنيات IoT",
      category: "agriculture",
      stage: "prototype",
      fundingNeeded: "4000000",
      views: 650,
      likes: 34,
      score: 81,
      hasIP: true,
      verified: true,
      location: "القصيم",
      teamSize: 7,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      id: 7,
      title: "منصة التجارة الإلكترونية B2B",
      description: "سوق إلكتروني متخصص لربط الموردين بالشركات في قطاع التجزئة",
      category: "ecommerce",
      stage: "growth",
      fundingNeeded: "5000000",
      views: 1800,
      likes: 120,
      score: 88,
      hasIP: false,
      verified: true,
      location: "جدة",
      teamSize: 15,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 8,
      title: "تطبيق الصحة النفسية",
      description: "منصة رقمية لتقديم خدمات الدعم النفسي والاستشارات عن بُعد",
      category: "healthcare",
      stage: "mvp",
      fundingNeeded: "1200000",
      views: 950,
      likes: 78,
      score: 76,
      hasIP: false,
      verified: true,
      location: "الرياض",
      teamSize: 4,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
  ];

  const displayProjects = projects && projects.length > 0 ? projects : demoProjects;

  // Categories
  const categories = [
    { value: "all", label: "جميع الفئات", icon: Grid3X3 },
    { value: "healthcare", label: "الرعاية الصحية", icon: Heart },
    { value: "energy", label: "الطاقة", icon: Sparkles },
    { value: "education", label: "التعليم", icon: Target },
    { value: "logistics", label: "اللوجستيات", icon: Building2 },
    { value: "fintech", label: "التقنية المالية", icon: DollarSign },
    { value: "agriculture", label: "الزراعة", icon: Globe },
    { value: "ecommerce", label: "التجارة الإلكترونية", icon: TrendingUp },
    { value: "technology", label: "التقنية", icon: Lightbulb },
  ];

  const stages = [
    { value: "all", label: "جميع المراحل" },
    { value: "idea", label: "فكرة" },
    { value: "prototype", label: "نموذج أولي" },
    { value: "mvp", label: "MVP" },
    { value: "growth", label: "نمو" },
    { value: "scale", label: "توسع" },
  ];

  const scoreFilters = [
    { value: "all", label: "جميع التقييمات" },
    { value: "high", label: "ابتكار (80%+)" },
    { value: "medium", label: "تجاري (60-79%)" },
    { value: "low", label: "إرشاد (<60%)" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "popular", label: "الأكثر مشاهدة" },
    { value: "score", label: "أعلى تقييم" },
    { value: "funding", label: "أعلى تمويل" },
  ];

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = displayProjects.filter((project: any) => {
      // Search
      const matchesSearch = searchQuery === "" || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category
      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
      
      // Stage
      const matchesStage = selectedStage === "all" || project.stage === selectedStage;
      
      // Score
      let matchesScore = true;
      if (selectedScore === "high") matchesScore = (project.score || 0) >= 80;
      else if (selectedScore === "medium") matchesScore = (project.score || 0) >= 60 && (project.score || 0) < 80;
      else if (selectedScore === "low") matchesScore = (project.score || 0) < 60;
      
      // Funding Range
      const funding = Number(project.fundingNeeded) || 0;
      const matchesFunding = funding >= fundingRange[0] && funding <= fundingRange[1];
      
      // IP
      const matchesIP = !hasIP || project.hasIP;
      
      // Verified
      const matchesVerified = !verifiedOnly || project.verified;

      return matchesSearch && matchesCategory && matchesStage && matchesScore && matchesFunding && matchesIP && matchesVerified;
    });

    // Sort
    result.sort((a: any, b: any) => {
      switch (sortBy) {
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "score":
          return (b.score || 0) - (a.score || 0);
        case "funding":
          return Number(b.fundingNeeded || 0) - Number(a.fundingNeeded || 0);
        case "newest":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return result;
  }, [displayProjects, searchQuery, selectedCategory, selectedStage, selectedScore, fundingRange, hasIP, verifiedOnly, sortBy]);

  const getCategoryText = (category: string | null) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || category || "عام";
  };

  const getStageText = (stage: string | null) => {
    const stg = stages.find(s => s.value === stage);
    return stg?.label || stage || "فكرة";
  };

  const getStageColor = (stage: string | null) => {
    switch (stage) {
      case "idea": return "bg-slate-500/20 text-slate-400";
      case "prototype": return "bg-amber-500/20 text-amber-400";
      case "mvp": return "bg-blue-500/20 text-blue-400";
      case "growth": return "bg-emerald-500/20 text-emerald-400";
      case "scale": return "bg-purple-500/20 text-purple-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStage("all");
    setSelectedScore("all");
    setFundingRange([0, 10000000]);
    setHasIP(false);
    setVerifiedOnly(false);
    setSearchQuery("");
  };

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedStage !== "all",
    selectedScore !== "all",
    fundingRange[0] > 0 || fundingRange[1] < 10000000,
    hasIP,
    verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
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
        {/* Hero Section - Enhanced */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-3xl p-10 border border-purple-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm">NAQLA3 - السوق والتبادل</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">سوق الابتكارات</h1>
                <p className="text-slate-300 text-lg max-w-xl">
                  اكتشف أفضل الابتكارات السعودية واستثمر في المستقبل مع نظام حماية متكامل
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-3xl font-bold text-white">{displayProjects.length}</div>
                  <div className="text-slate-400 text-sm">مشروع</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-3xl font-bold text-white">
                    {(displayProjects.reduce((sum: number, p: any) => sum + Number(p.fundingNeeded || 0), 0) / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-slate-400 text-sm">تمويل مطلوب</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-3xl font-bold text-white">
                    {displayProjects.filter((p: any) => p.verified).length}
                  </div>
                  <div className="text-slate-400 text-sm">موثق</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن ابتكار بالاسم أو الوصف..."
                className="bg-slate-800/50 border-slate-700 text-white pr-12 h-12 text-base"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 h-12 min-w-[140px]"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 h-12 min-w-[140px]"
              >
                {stages.map((stg) => (
                  <option key={stg.value} value={stg.value}>{stg.label}</option>
                ))}
              </select>

              <Button 
                variant="outline" 
                className={`border-slate-700 h-12 ${showFilters ? "bg-purple-500/20 border-purple-500" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 ml-2" />
                فلاتر متقدمة
                {activeFiltersCount > 0 && (
                  <span className="mr-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 h-12 min-w-[130px]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-purple-500 text-white" : "bg-slate-800/50 text-slate-400"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-purple-500 text-white" : "bg-slate-800/50 text-slate-400"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">فلاتر متقدمة</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4 ml-1" />
                  مسح الكل
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Score Filter */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">تصنيف التقييم</label>
                  <select
                    value={selectedScore}
                    onChange={(e) => setSelectedScore(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5"
                  >
                    {scoreFilters.map((sf) => (
                      <option key={sf.value} value={sf.value}>{sf.label}</option>
                    ))}
                  </select>
                </div>

                {/* Funding Range */}
                <div className="lg:col-span-2">
                  <label className="text-slate-300 text-sm mb-2 block">
                    نطاق التمويل: {(fundingRange[0] / 1000000).toFixed(1)}M - {(fundingRange[1] / 1000000).toFixed(1)}M ريال
                  </label>
                  <Slider
                    value={fundingRange}
                    onValueChange={setFundingRange}
                    min={0}
                    max={10000000}
                    step={100000}
                    className="mt-4"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasIP}
                      onChange={(e) => setHasIP(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-slate-300">لديه ملكية فكرية</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-slate-300">موثق فقط</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              عرض {filteredProjects.length} مشروع من أصل {displayProjects.length}
            </span>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-purple-400 hover:text-purple-300">
                مسح الفلاتر ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-purple-500 text-white"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-slate-400 mb-4">جرب تغيير معايير البحث أو الفلاتر</p>
            <Button variant="outline" onClick={clearFilters} className="border-slate-700 text-slate-300">
              مسح جميع الفلاتر
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <Card 
                key={project.id} 
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all group overflow-hidden"
              >
                {/* Card Header with gradient */}
                <div className="h-32 bg-gradient-to-br from-purple-900/50 to-slate-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {project.verified && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        موثق
                      </span>
                    )}
                    {project.hasIP && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                        IP
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-12 bg-purple-500/30 backdrop-blur rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-purple-300" />
                    </div>
                  </div>
                  {project.score && (
                    <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-sm font-bold ${
                      project.score >= 80 ? "bg-emerald-500/30 text-emerald-300" :
                      project.score >= 60 ? "bg-blue-500/30 text-blue-300" :
                      "bg-amber-500/30 text-amber-300"
                    }`}>
                      {project.score}%
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      {getCategoryText(project.category)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStageColor(project.stage)}`}>
                      {getStageText(project.stage)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Location & Team */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    {project.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.teamSize && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{project.teamSize} أعضاء</span>
                      </div>
                    )}
                  </div>

                  {/* Funding */}
                  {project.fundingNeeded && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-purple-900/30 to-slate-800/50 rounded-lg border border-purple-500/20">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-white font-bold">
                          {Number(project.fundingNeeded).toLocaleString()} ريال
                        </div>
                        <div className="text-slate-400 text-xs">التمويل المطلوب</div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{(project.views || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString("ar-SA") : "-"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        عرض التفاصيل
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/50">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredProjects.map((project: any) => (
              <Card key={project.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <Lightbulb className="w-8 h-8 text-purple-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                              {getCategoryText(project.category)}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs ${getStageColor(project.stage)}`}>
                              {getStageText(project.stage)}
                            </span>
                            {project.verified && (
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                موثق
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location || "-"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{project.teamSize || 0} أعضاء</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{(project.views || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{project.likes || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          {project.score && (
                            <div className={`px-4 py-2 rounded-lg text-lg font-bold mb-3 ${
                              project.score >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                              project.score >= 60 ? "bg-blue-500/20 text-blue-400" :
                              "bg-amber-500/20 text-amber-400"
                            }`}>
                              {project.score}%
                            </div>
                          )}
                          <div className="text-white font-bold text-lg">
                            {Number(project.fundingNeeded || 0).toLocaleString()}
                          </div>
                          <div className="text-slate-400 text-xs">ريال</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link href={`/projects/${project.id}`}>
                        <Button className="bg-purple-500 hover:bg-purple-600">
                          عرض التفاصيل
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-slate-700 text-slate-300">
                        <Heart className="w-4 h-4 ml-2" />
                        حفظ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA for Investors & Innovators */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900 border-purple-800/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
            <CardContent className="p-8 relative">
              <Shield className="w-14 h-14 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">للمستثمرين</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                اكتشف فرص استثمارية مميزة في أفضل الابتكارات السعودية مع حماية كاملة عبر نظام الضمان الذكي
              </p>
              <Button className="bg-purple-500 hover:bg-purple-600">
                سجّل كمستثمر
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-950/50 to-slate-900 border-cyan-800/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <CardContent className="p-8 relative">
              <Lightbulb className="w-14 h-14 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">للمبتكرين</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                اعرض ابتكارك أمام آلاف المستثمرين والشركات واحصل على التمويل والدعم الذي تحتاجه
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
