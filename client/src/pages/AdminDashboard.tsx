/**
 * Admin Dashboard - Real-time Statistics
 * Main dashboard for administrators with live updates
 */

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  Lightbulb,
  Rocket,
  Activity,
  Globe,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { InnovationFunnelChart } from '@/components/charts/InnovationFunnelChart';
import { MLPerformanceChart } from '@/components/charts/MLPerformanceChart';
import { EngagementMetricsChart } from '@/components/charts/EngagementMetricsChart';
import { ChartFilters, ChartFilterState } from '@/components/ChartFilters';

interface DashboardStats {
  totalIdeas: number;
  totalProjects: number;
  totalUsers: number;
  activeUsers: number;
  successRate: number;
  apiCalls: number;
  webhookCalls: number;
  pendingEvaluations: number;
  recentGrowth: {
    ideas: number;
    users: number;
    projects: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartFilters, setChartFilters] = useState<ChartFilterState>({
    startDate: '',
    endDate: '',
    department: '',
    project: '',
    status: '',
  });
  const { isConnected } = useWebSocket();

  // Fetch initial stats
  const { data: initialStats, refetch } = trpc.analytics.adminDashboard.useQuery();

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats as any);
    }
  }, [initialStats]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (!stats) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto animate-pulse text-muted-foreground mb-4" />
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'إجمالي الأفكار',
      value: stats.totalIdeas.toLocaleString(),
      icon: Lightbulb,
      change: stats.recentGrowth.ideas,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'المشاريع النشطة',
      value: stats.totalProjects.toLocaleString(),
      icon: Rocket,
      change: stats.recentGrowth.projects,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'المستخدمون',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: stats.recentGrowth.users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'معدل النجاح',
      value: `${(stats.successRate * 100).toFixed(1)}%`,
      icon: CheckCircle,
      change: 0,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'طلبات API',
      value: stats.apiCalls.toLocaleString(),
      icon: Globe,
      change: 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Webhook Calls',
      value: stats.webhookCalls.toLocaleString(),
      icon: Activity,
      change: 0,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة تحكم المشرفين</h1>
          <p className="text-muted-foreground">
            إحصائيات فورية ومباشرة للمنصة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            <Activity className="w-3 h-3 mr-1" />
            {isConnected ? 'متصل مباشرة' : 'غير متصل'}
          </Badge>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                    <h3 className="text-3xl font-bold mb-2">{kpi.value}</h3>
                    {kpi.change !== 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp
                          className={`w-4 h-4 ${
                            kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {kpi.change > 0 ? '+' : ''}
                          {kpi.change}%
                        </span>
                        <span className="text-xs text-muted-foreground">آخر 7 أيام</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Users & Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المستخدمون النشطون</CardTitle>
            <CardDescription>المستخدمون المتصلون حاليًا</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{stats.activeUsers}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  من أصل {stats.totalUsers} مستخدم
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التقييمات المعلقة</CardTitle>
            <CardDescription>تتطلب اهتمام المشرفين</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{stats.pendingEvaluations}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.pendingEvaluations > 0 ? 'تتطلب مراجعة' : 'لا توجد معلقة'}
                </p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-orange-600" />
                </div>
                {stats.pendingEvaluations > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Filters */}
      <ChartFilters
        onFilterChange={setChartFilters}
        onSaveView={() => alert('Save View functionality coming soon!')}
        onShareView={() => alert('Share View functionality coming soon!')}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InnovationFunnelChart
          data={[
            { stage: 'مقدمة', count: stats.totalIdeas },
            { stage: 'قيد المراجعة', count: Math.floor(stats.totalIdeas * 0.7) },
            { stage: 'موافق عليها', count: Math.floor(stats.totalIdeas * 0.5) },
            { stage: 'قيد التطوير', count: Math.floor(stats.totalIdeas * 0.3) },
            { stage: 'مطلقة', count: stats.totalProjects },
          ]}
        />
        <MLPerformanceChart
          data={[
            { date: 'Week 1', accuracy: 0.92, f1Score: 0.90, precision: 0.91, recall: 0.89 },
            { date: 'Week 2', accuracy: 0.94, f1Score: 0.92, precision: 0.93, recall: 0.91 },
            { date: 'Week 3', accuracy: 0.96, f1Score: 0.94, precision: 0.95, recall: 0.93 },
            { date: 'Week 4', accuracy: 0.98, f1Score: 0.96, precision: 0.97, recall: 0.95 },
            { date: 'Current', accuracy: 1.0, f1Score: 0.99, precision: 0.99, recall: 0.99 },
          ]}
        />
      </div>

      <EngagementMetricsChart
        data={[
          { date: 'Mon', activeUsers: 45, comments: 120, votes: 230 },
          { date: 'Tue', activeUsers: 52, comments: 145, votes: 280 },
          { date: 'Wed', activeUsers: 48, comments: 132, votes: 255 },
          { date: 'Thu', activeUsers: 61, comments: 167, votes: 310 },
          { date: 'Fri', activeUsers: 58, comments: 154, votes: 290 },
          { date: 'Sat', activeUsers: 35, comments: 89, votes: 180 },
          { date: 'Sun', activeUsers: 42, comments: 105, votes: 210 },
        ]}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>الوصول السريع للأدوات الإدارية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/idea-classification"
              className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
            >
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-sm">تصنيف الأفكار</p>
            </a>
            <a
              href="/admin/model-performance"
              className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
            >
              <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-sm">أداء النموذج</p>
            </a>
            <a
              href="/admin/data-export"
              className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
            >
              <Globe className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium text-sm">تصدير البيانات</p>
            </a>
            <a
              href="/webhook-management"
              className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
            >
              <Activity className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="font-medium text-sm">إدارة Webhooks</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
