import { useState } from "react";
import { useLocation } from "wouter";
import { Target, Search, Filter, TrendingUp, Users, Clock, Award, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Uplink2Challenges() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [filters, setFilters] = useState({
    category: "",
    status: "open",
    search: "",
  });

  const { data: challenges, isLoading } = trpc.uplink2.getChallenges.useQuery(filters);

  const categories = [
    { value: "", label: "جميع التصنيفات" },
    { value: "technology", label: "تقنية" },
    { value: "health", label: "صحة" },
    { value: "education", label: "تعليم" },
    { value: "environment", label: "بيئة" },
    { value: "energy", label: "طاقة" },
    { value: "transportation", label: "نقل" },
    { value: "finance", label: "مالية" },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      health: "bg-green-500/20 text-green-400 border-green-500/30",
      education: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      environment: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      energy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      transportation: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      finance: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const formatPrize = (prize: number) => {
    if (prize >= 1000000) {
      return `${(prize / 1000000).toFixed(1)}م ريال`;
    } else if (prize >= 1000) {
      return `${(prize / 1000).toFixed(0)}ك ريال`;
    }
    return `${prize} ريال`;
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "انتهى";
    if (days === 0) return "ينتهي اليوم";
    if (days === 1) return "ينتهي غداً";
    return `${days} يوم متبقي`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            التحديات النشطة
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            تحديات حقيقية من شركات ومؤسسات رائدة تبحث عن حلول مبتكرة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {challenges?.length || 0}
              </div>
              <div className="text-sm text-gray-400">تحدٍ نشط</div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">50M+</div>
              <div className="text-sm text-gray-400">ريال جوائز</div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">1000+</div>
              <div className="text-sm text-gray-400">مبتكر مشارك</div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">85%</div>
              <div className="text-sm text-gray-400">معدل النجاح</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="ابحث عن تحدٍ..."
                className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full pr-10 bg-white/10 border border-white/20 text-white rounded-md px-4 py-3 h-12"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-white/10 border border-white/20 text-white rounded-md px-4 py-3 h-12"
            >
              <option value="open">مفتوح للتقديم</option>
              <option value="evaluation">قيد التقييم</option>
              <option value="completed">مكتمل</option>
              <option value="all">جميع الحالات</option>
            </select>
          </div>
        </Card>

        {/* Challenges List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        ) : challenges && challenges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge: any) => (
              <Card
                key={challenge.id}
                className="group p-6 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
                onClick={() => setLocation(`/uplink2/challenges/${challenge.id}`)}
              >
                {/* Challenge Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge className={`${getCategoryColor(challenge.category)} border`}>
                    {categories.find(c => c.value === challenge.category)?.label || challenge.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-bold">{formatPrize(challenge.prize)}</span>
                  </div>
                </div>

                {/* Challenge Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {challenge.title}
                </h3>

                {/* Challenge Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {challenge.description}
                </p>

                {/* Challenge Organization */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {challenge.organizationName?.charAt(0) || "?"}
                  </div>
                  <span className="text-white text-sm font-medium">
                    {challenge.organizationName || "منظمة"}
                  </span>
                </div>

                {/* Challenge Stats */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participantsCount || 0} مشارك</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{getDaysRemaining(challenge.deadline)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      window.location.href = getLoginUrl();
                    } else {
                      setLocation(`/uplink2/challenges/${challenge.id}`);
                    }
                  }}
                >
                  عرض التفاصيل
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-white/5 backdrop-blur-xl border-white/10 text-center">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد تحديات</h3>
            <p className="text-gray-400">
              لم يتم العثور على تحديات تطابق معايير البحث
            </p>
          </Card>
        )}

        {/* CTA Section */}
        {user && (
          <Card className="mt-12 p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-blue-500/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                هل لديك تحدٍ تريد طرحه؟
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                إذا كنت تمثل شركة أو مؤسسة وتبحث عن حلول مبتكرة لمشاكل حقيقية، يمكنك طرح تحديك الآن
              </p>
              <Button
                onClick={() => setLocation("/uplink2/challenges/create")}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
              >
                طرح تحدٍ جديد
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
