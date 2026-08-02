import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import {
  Lightbulb, Brain, TrendingUp, Users, ArrowRight, Zap,
  BarChart3, Target, CheckCircle2, Clock, AlertCircle,
  Sparkles, FlaskConical, ShoppingCart, ChevronRight,
  Plus, Eye, Star, Activity, ArrowUpRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type TabType = 'overview' | 'ideas' | 'analytics';

export default function Naqla1Dashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: stats, isLoading } = trpc.naqla1.getDashboardStats.useQuery();
  const { data: myIdeas } = trpc.naqla1.myIdeas.useQuery();

  const tabs = [
    { key: 'overview' as TabType, icon: BarChart3, labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'ideas' as TabType, icon: Lightbulb, labelAr: 'أفكاري', labelEn: 'My Ideas' },
    { key: 'analytics' as TabType, icon: TrendingUp, labelAr: 'التحليلات', labelEn: 'Analytics' },
  ];

  const kpiCards = [
    {
      icon: Lightbulb,
      labelAr: 'إجمالي الأفكار',
      labelEn: 'Total Ideas',
      value: stats?.totalIdeas ?? '—',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: Brain,
      labelAr: 'تم تحليلها',
      labelEn: 'Analyzed',
      value: stats?.analyzedIdeas ?? '—',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: ArrowUpRight,
      labelAr: 'وُجِّهت لنقلة 2',
      labelEn: 'Routed to N2',
      value: stats?.routedToNaqla2 ?? '—',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: Star,
      labelAr: 'وُجِّهت لنقلة 3',
      labelEn: 'Routed to N3',
      value: stats?.routedToNaqla3 ?? '—',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: Users,
      labelAr: 'المبتكرون',
      labelEn: 'Innovators',
      value: stats?.innovatorCount ?? '—',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      icon: Clock,
      labelAr: 'قيد الانتظار',
      labelEn: 'Pending',
      value: stats?.pendingIdeas ?? '—',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
  ];

  const classificationData = {
    labels: isAr
      ? ['ابتكاري', 'تجاري', 'يحتاج تطوير']
      : ['Innovation', 'Commercial', 'Needs Dev'],
    datasets: [{
      data: [
        stats?.innovationIdeas ?? 198,
        stats?.commercialIdeas ?? 287,
        stats?.weakIdeas ?? 138,
      ],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }],
  };

  const routingData = {
    labels: isAr
      ? ['قيد الانتظار', 'نقلة 2', 'نقلة 3']
      : ['Pending', 'Naqla 2', 'Naqla 3'],
    datasets: [{
      label: isAr ? 'الأفكار' : 'Ideas',
      data: [
        stats?.pendingIdeas ?? 124,
        stats?.routedToNaqla2 ?? 312,
        stats?.routedToNaqla3 ?? 89,
      ],
      backgroundColor: ['#f59e0b', '#6366f1', '#10b981'],
      borderRadius: 6,
      borderWidth: 0,
    }],
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; labelEn: string; color: string }> = {
      submitted: { label: 'مُقدَّمة', labelEn: 'Submitted', color: 'bg-blue-500/20 text-blue-300' },
      analyzing: { label: 'قيد التحليل', labelEn: 'Analyzing', color: 'bg-purple-500/20 text-purple-300' },
      analyzed: { label: 'تم التحليل', labelEn: 'Analyzed', color: 'bg-emerald-500/20 text-emerald-300' },
      routed: { label: 'مُوجَّهة', labelEn: 'Routed', color: 'bg-amber-500/20 text-amber-300' },
      rejected: { label: 'مرفوضة', labelEn: 'Rejected', color: 'bg-red-500/20 text-red-300' },
    };
    const info = map[status] || { label: status, labelEn: status, color: 'bg-gray-500/20 text-gray-300' };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>{isAr ? info.label : info.labelEn}</span>;
  };

  return (
    <div className="min-h-screen bg-background" dir={isAr ? 'rtl' : 'ltr'}>
      <SEOHead
        title={isAr ? 'لوحة NAQLA 1 - محرك تحليل الأفكار' : 'NAQLA 1 Dashboard - AI Idea Analysis Engine'}
        description={isAr ? 'إحصائيات ومتابعة أفكار الابتكار في محرك التحليل بالذكاء الاصطناعي' : 'Track and analyze innovation ideas in the AI analysis engine'}
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {isAr ? 'لوحة NAQLA ONE' : 'NAQLA ONE Dashboard'}
                </h1>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                  {isAr ? 'محرك الذكاء الاصطناعي' : 'AI Engine'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isAr ? 'تحليل الأفكار وتصنيفها وتوجيهها بالذكاء الاصطناعي' : 'AI-powered idea analysis, classification and routing'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Link href="/naqla1/submit">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="h-4 w-4" />
                {isAr ? 'تقديم فكرة جديدة' : 'Submit New Idea'}
              </Button>
            </Link>
            <Link href="/naqla1/browse">
              <Button size="sm" variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                {isAr ? 'استعراض الأفكار' : 'Browse Ideas'}
              </Button>
            </Link>
            <Link href="/naqla1">
              <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground">
                {isAr ? 'الصفحة الرئيسية' : 'Main Page'}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted/30 rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpiCards.map((card, i) => (
                <Card key={i} className={`border ${card.border} bg-card/50 backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${card.color} mb-1`}>
                      {isLoading ? '...' : (typeof card.value === 'number' ? card.value.toLocaleString('ar-SA') : card.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isAr ? card.labelAr : card.labelEn}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Classification Donut */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    {isAr ? 'توزيع تصنيف الأفكار' : 'Idea Classification Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] flex items-center justify-center">
                    <Doughnut
                      data={classificationData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 } } },
                          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } }
                        },
                        cutout: '65%',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                      { label: isAr ? 'ابتكاري' : 'Innovation', value: stats?.innovationIdeas ?? 198, color: 'text-indigo-400' },
                      { label: isAr ? 'تجاري' : 'Commercial', value: stats?.commercialIdeas ?? 287, color: 'text-emerald-400' },
                      { label: isAr ? 'يحتاج تطوير' : 'Needs Dev', value: stats?.weakIdeas ?? 138, color: 'text-amber-400' },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className={`text-lg font-bold ${item.color}`}>{item.value.toLocaleString('ar-SA')}</div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Routing Bar Chart */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    {isAr ? 'توجيه الأفكار' : 'Idea Routing'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '220px' }}>
                    <Bar
                      data={routingData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
                          y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af', font: { size: 11 } } },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Ideas */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  {isAr ? 'أحدث الأفكار المُقدَّمة' : 'Latest Submitted Ideas'}
                </CardTitle>
                <Link href="/naqla1/browse">
                  <Button size="sm" variant="ghost" className="text-xs gap-1 text-muted-foreground">
                    {isAr ? 'عرض الكل' : 'View All'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {stats?.recentIdeas && stats.recentIdeas.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentIdeas.map((idea: any) => (
                      <div key={idea.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Lightbulb className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{idea.title || (isAr ? 'فكرة بدون عنوان' : 'Untitled Idea')}</p>
                            <p className="text-xs text-muted-foreground">{idea.category || (isAr ? 'غير محدد' : 'Uncategorized')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getStatusBadge(idea.status || 'submitted')}
                          <Link href={`/naqla1/ideas/${idea.id}`}>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isAr ? 'لا توجد أفكار حديثة' : 'No recent ideas'}</p>
                    <Link href="/naqla1/submit">
                      <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        {isAr ? 'قدِّم أول فكرة' : 'Submit First Idea'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Plus, labelAr: 'تقديم فكرة جديدة', labelEn: 'Submit New Idea', href: '/naqla1/submit', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { icon: FlaskConical, labelAr: 'تحليل فكرة موجودة', labelEn: 'Analyze Existing Idea', href: '/my-ideas', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { icon: Eye, labelAr: 'استعراض جميع الأفكار', labelEn: 'Browse All Ideas', href: '/naqla1/browse', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <Card className={`border ${action.border} bg-card/50 hover:bg-card/80 transition-all cursor-pointer group`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <span className="text-sm font-medium">{isAr ? action.labelAr : action.labelEn}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ms-auto group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isAr ? 'أفكاري المُقدَّمة' : 'My Submitted Ideas'}</h2>
              <Link href="/naqla1/submit">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Plus className="h-4 w-4" />
                  {isAr ? 'فكرة جديدة' : 'New Idea'}
                </Button>
              </Link>
            </div>
            {myIdeas && myIdeas.length > 0 ? (
              <div className="grid gap-3">
                {myIdeas.map((idea: any) => (
                  <Card key={idea.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Lightbulb className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-sm truncate">{idea.title || (isAr ? 'فكرة بدون عنوان' : 'Untitled')}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{idea.description || ''}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {getStatusBadge(idea.status || 'submitted')}
                              {idea.category && (
                                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{idea.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link href={`/naqla1/ideas/${idea.id}`}>
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                              <Eye className="h-3 w-3" />
                              {isAr ? 'عرض' : 'View'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-medium mb-2">{isAr ? 'لم تُقدِّم أي أفكار بعد' : 'No ideas submitted yet'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{isAr ? 'ابدأ رحلتك الابتكارية بتقديم أول فكرة' : 'Start your innovation journey by submitting your first idea'}</p>
                  <Link href="/naqla1/submit">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      {isAr ? 'قدِّم فكرتك الأولى' : 'Submit Your First Idea'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Classification Stats */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{isAr ? 'إحصائيات التصنيف' : 'Classification Stats'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: isAr ? 'أفكار ابتكارية' : 'Innovation Ideas', value: stats?.innovationIdeas ?? 198, total: (stats?.analyzedIdeas ?? 623), color: 'bg-indigo-500', icon: Sparkles },
                    { label: isAr ? 'أفكار تجارية' : 'Commercial Ideas', value: stats?.commercialIdeas ?? 287, total: (stats?.analyzedIdeas ?? 623), color: 'bg-emerald-500', icon: ShoppingCart },
                    { label: isAr ? 'تحتاج تطوير' : 'Needs Development', value: stats?.weakIdeas ?? 138, total: (stats?.analyzedIdeas ?? 623), color: 'bg-amber-500', icon: AlertCircle },
                  ].map((item, i) => {
                    const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value.toLocaleString('ar-SA')} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Routing Stats */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{isAr ? 'إحصائيات التوجيه' : 'Routing Stats'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: isAr ? 'وُجِّهت لنقلة 2' : 'Routed to Naqla 2', value: stats?.routedToNaqla2 ?? 312, total: (stats?.totalIdeas ?? 847), color: 'bg-blue-500', icon: ArrowUpRight },
                    { label: isAr ? 'وُجِّهت لنقلة 3' : 'Routed to Naqla 3', value: stats?.routedToNaqla3 ?? 89, total: (stats?.totalIdeas ?? 847), color: 'bg-purple-500', icon: Star },
                    { label: isAr ? 'قيد الانتظار' : 'Pending', value: stats?.pendingIdeas ?? 124, total: (stats?.totalIdeas ?? 847), color: 'bg-orange-500', icon: Clock },
                  ].map((item, i) => {
                    const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <span className="text-sm font-medium">{item.value.toLocaleString('ar-SA')} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Platform Overview */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isAr ? 'نظرة عامة على المنصة' : 'Platform Overview'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: isAr ? 'إجمالي المستخدمين' : 'Total Users', value: stats?.totalUsers ?? 1245, icon: Users, color: 'text-blue-400' },
                    { label: isAr ? 'المبتكرون' : 'Innovators', value: stats?.innovatorCount ?? 876, icon: Lightbulb, color: 'text-purple-400' },
                    { label: isAr ? 'معدل التحليل' : 'Analysis Rate', value: `${Math.round(((stats?.analyzedIdeas ?? 623) / (stats?.totalIdeas ?? 847)) * 100)}%`, icon: Brain, color: 'text-emerald-400' },
                    { label: isAr ? 'معدل التوجيه' : 'Routing Rate', value: `${Math.round((((stats?.routedToNaqla2 ?? 312) + (stats?.routedToNaqla3 ?? 89)) / (stats?.totalIdeas ?? 847)) * 100)}%`, icon: TrendingUp, color: 'text-amber-400' },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 rounded-xl bg-muted/30">
                      <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                      <div className={`text-xl font-bold ${item.color}`}>{typeof item.value === 'number' ? item.value.toLocaleString('ar-SA') : item.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
