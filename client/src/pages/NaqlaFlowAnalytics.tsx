import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Lightbulb, 
  Target, 
  Store, 
  ArrowRight,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3
} from "lucide-react";

export default function NaqlaFlowAnalytics() {
  const { data: stats, isLoading } = trpc.analytics.getNaqlaFlowStats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  const totalIdeas = (stats?.innovation || 0) + (stats?.commercial || 0) + (stats?.guidance || 0);
  const successRate = totalIdeas > 0 ? (((stats?.innovation || 0) + (stats?.commercial || 0)) / totalIdeas * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">
              تحليلات مسار NAQLA
            </h1>
          </div>
          <p className="text-slate-400">
            إحصائيات شاملة لرحلة الأفكار عبر NAQLA 1 → 2 → 3
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-cyan-400" />
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                الإجمالي
              </Badge>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{totalIdeas}</div>
            <div className="text-sm text-slate-400">إجمالي الأفكار</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <Lightbulb className="w-8 h-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                ابتكار
              </Badge>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats?.innovation || 0}</div>
            <div className="text-sm text-slate-400">أفكار ابتكارية (≥70%)</div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <Store className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                تجاري
              </Badge>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats?.commercial || 0}</div>
            <div className="text-sm text-slate-400">حلول تجارية (50-70%)</div>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                ضعيف
              </Badge>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats?.guidance || 0}</div>
            <div className="text-sm text-slate-400">تحتاج تطوير (&lt;50%)</div>
          </Card>
        </div>

        {/* Success Rate */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">معدل النجاح</h2>
              <p className="text-slate-400">نسبة الأفكار المقبولة (ابتكار + تجاري)</p>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-6xl font-bold text-green-400">{successRate}%</div>
            <div className="text-slate-400 mb-2">
              من إجمالي {totalIdeas} فكرة
            </div>
          </div>
          <div className="mt-6 h-4 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </Card>

        {/* Distribution Chart */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            توزيع الأفكار حسب التصنيف
          </h2>
          <div className="space-y-6">
            {/* Innovation Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">ابتكار حقيقي</span>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  {stats?.innovation || 0} ({totalIdeas > 0 ? ((stats?.innovation || 0) / totalIdeas * 100).toFixed(0) : 0}%)
                </Badge>
              </div>
              <div className="h-8 bg-slate-800 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-end px-3 transition-all duration-500"
                  style={{ width: `${totalIdeas > 0 ? (stats?.innovation || 0) / totalIdeas * 100 : 0}%` }}
                >
                  <span className="text-white text-sm font-semibold">
                    {stats?.innovation || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Commercial Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">حل تجاري</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {stats?.commercial || 0} ({totalIdeas > 0 ? ((stats?.commercial || 0) / totalIdeas * 100).toFixed(0) : 0}%)
                </Badge>
              </div>
              <div className="h-8 bg-slate-800 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-end px-3 transition-all duration-500"
                  style={{ width: `${totalIdeas > 0 ? (stats?.commercial || 0) / totalIdeas * 100 : 0}%` }}
                >
                  <span className="text-white text-sm font-semibold">
                    {stats?.commercial || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Guidance Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">تحتاج تطوير</span>
                </div>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  {stats?.guidance || 0} ({totalIdeas > 0 ? ((stats?.guidance || 0) / totalIdeas * 100).toFixed(0) : 0}%)
                </Badge>
              </div>
              <div className="h-8 bg-slate-800 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-end px-3 transition-all duration-500"
                  style={{ width: `${totalIdeas > 0 ? (stats?.guidance || 0) / totalIdeas * 100 : 0}%` }}
                >
                  <span className="text-white text-sm font-semibold">
                    {stats?.guidance || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Flow Visualization */}
        <Card className="bg-slate-900/50 border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">مسار رحلة الأفكار</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* NAQLA 1 */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-cyan-500/20 p-2 rounded-lg">
                    <Lightbulb className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">NAQLA 1</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{totalIdeas}</div>
                <div className="text-sm text-slate-400">إجمالي الأفكار المقدمة</div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded p-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">{stats?.innovation || 0} ابتكار</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded p-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300">{stats?.commercial || 0} تجاري</span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded p-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-300">{stats?.guidance || 0} ضعيف</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="w-12 h-12 text-slate-600" />
            </div>

            {/* NAQLA 2 & 3 */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">NAQLA 2</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {(stats?.innovation || 0) + (stats?.commercial || 0)}
                </div>
                <div className="text-sm text-slate-400">أفكار مقبولة للمطابقة</div>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Store className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">NAQLA 3</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {(stats?.innovation || 0) + (stats?.commercial || 0)}
                </div>
                <div className="text-sm text-slate-400">أفكار في السوق</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
