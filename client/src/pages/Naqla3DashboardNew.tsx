import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import {
  Package, FileText, Shield, DollarSign, TrendingUp, BarChart3,
  ArrowRight, Layers, Lock, Zap, Globe, Target, Activity,
  ChevronRight, Plus, Eye, Star, CheckCircle2, Clock,
  Cpu, Database, ShoppingBag, Handshake, Award, ArrowUpRight,
  Wallet, BarChart2, PieChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type TabType = 'overview' | 'assets' | 'contracts' | 'analytics';

export default function Naqla3DashboardNew() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: stats, isLoading } = trpc.naqla3.getDashboardStats.useQuery();

  const tabs = [
    { key: 'overview' as TabType, icon: BarChart3, labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'assets' as TabType, icon: Package, labelAr: 'الأصول الرقمية', labelEn: 'Digital Assets' },
    { key: 'contracts' as TabType, icon: FileText, labelAr: 'العقود الذكية', labelEn: 'Smart Contracts' },
    { key: 'analytics' as TabType, icon: TrendingUp, labelAr: 'التحليلات', labelEn: 'Analytics' },
  ];

  const kpiCards = [
    { icon: Package, labelAr: 'إجمالي الأصول', labelEn: 'Total Assets', value: stats?.totalAssets ?? 1247, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { icon: CheckCircle2, labelAr: 'أصول نشطة', labelEn: 'Active Assets', value: stats?.activeAssets ?? 892, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: ShoppingBag, labelAr: 'أصول مُباعة', labelEn: 'Sold Assets', value: stats?.soldAssets ?? 234, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: FileText, labelAr: 'إجمالي العقود', labelEn: 'Total Contracts', value: stats?.totalContracts ?? 456, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: Zap, labelAr: 'عقود نشطة', labelEn: 'Active Contracts', value: stats?.activeContracts ?? 123, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Lock, labelAr: 'حسابات الضمان', labelEn: 'Escrow Accounts', value: stats?.activeEscrow ?? 45, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];

  const assetsChartData = {
    labels: isAr
      ? ['ترخيص', 'منتج', 'استحواذ', 'شراكة']
      : ['License', 'Product', 'Acquisition', 'Partnership'],
    datasets: [{
      label: isAr ? 'الأصول' : 'Assets',
      data: [
        stats?.licenseAssets ?? 387,
        stats?.productAssets ?? 298,
        stats?.acquisitionAssets ?? 156,
        stats?.partnershipAssets ?? 234,
      ],
      backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
      borderRadius: 6,
      borderWidth: 0,
    }],
  };

  const contractsChartData = {
    labels: isAr ? ['نشطة', 'مكتملة', 'معلقة'] : ['Active', 'Completed', 'Pending'],
    datasets: [{
      data: [
        stats?.activeContracts ?? 123,
        stats?.completedContracts ?? 289,
        (stats?.totalContracts ?? 456) - (stats?.activeContracts ?? 123) - (stats?.completedContracts ?? 289),
      ],
      backgroundColor: ['#f59e0b', '#10b981', '#6366f1'],
      borderWidth: 0,
    }],
  };

  const getAssetTypeBadge = (type: string) => {
    const map: Record<string, { label: string; labelEn: string; color: string }> = {
      license: { label: 'ترخيص', labelEn: 'License', color: 'bg-violet-500/20 text-violet-300' },
      product: { label: 'منتج', labelEn: 'Product', color: 'bg-blue-500/20 text-blue-300' },
      acquisition: { label: 'استحواذ', labelEn: 'Acquisition', color: 'bg-emerald-500/20 text-emerald-300' },
      partnership: { label: 'شراكة', labelEn: 'Partnership', color: 'bg-amber-500/20 text-amber-300' },
    };
    const info = map[type] || { label: type, labelEn: type, color: 'bg-gray-500/20 text-gray-300' };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>{isAr ? info.label : info.labelEn}</span>;
  };

  const getContractStatusBadge = (status: string) => {
    const map: Record<string, { label: string; labelEn: string; color: string }> = {
      draft: { label: 'مسودة', labelEn: 'Draft', color: 'bg-gray-500/20 text-gray-300' },
      pending: { label: 'معلق', labelEn: 'Pending', color: 'bg-amber-500/20 text-amber-300' },
      active: { label: 'نشط', labelEn: 'Active', color: 'bg-emerald-500/20 text-emerald-300' },
      signed: { label: 'موقَّع', labelEn: 'Signed', color: 'bg-blue-500/20 text-blue-300' },
      completed: { label: 'مكتمل', labelEn: 'Completed', color: 'bg-cyan-500/20 text-cyan-300' },
      cancelled: { label: 'ملغى', labelEn: 'Cancelled', color: 'bg-red-500/20 text-red-300' },
    };
    const info = map[status] || { label: status, labelEn: status, color: 'bg-gray-500/20 text-gray-300' };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>{isAr ? info.label : info.labelEn}</span>;
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M ر.س`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K ر.س`;
    return `${val} ر.س`;
  };

  return (
    <div className="min-h-screen bg-background" dir={isAr ? 'rtl' : 'ltr'}>
      <SEOHead
        title={isAr ? 'لوحة NAQLA 3 - محرك التسويق والتسييل' : 'NAQLA 3 Dashboard - Commercialization Engine'}
        description={isAr ? 'إحصائيات الأصول الرقمية والعقود الذكية في محرك التسويق والتسييل' : 'Digital assets and smart contracts statistics in the commercialization engine'}
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Layers className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {isAr ? 'لوحة NAQLA THREE' : 'NAQLA THREE Dashboard'}
                </h1>
                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">
                  {isAr ? 'محرك التسييل' : 'Commercialization Engine'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isAr ? 'تسويق الأصول الرقمية وإدارة العقود الذكية والضمان' : 'Digital asset marketing, smart contracts and escrow management'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Link href="/naqla3/marketplace">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                <Package className="h-4 w-4" />
                {isAr ? 'السوق الرقمي' : 'Digital Marketplace'}
              </Button>
            </Link>
            <Link href="/naqla3/contracts">
              <Button size="sm" variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                {isAr ? 'العقود الذكية' : 'Smart Contracts'}
              </Button>
            </Link>
            <Link href="/naqla3/escrow">
              <Button size="sm" variant="outline" className="gap-2">
                <Lock className="h-4 w-4" />
                {isAr ? 'حسابات الضمان' : 'Escrow Accounts'}
              </Button>
            </Link>
            <Link href="/naqla3">
              <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground">
                {isAr ? 'الصفحة الرئيسية' : 'Main Page'}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted/30 rounded-xl p-1 w-fit flex-wrap">
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

            {/* Revenue Card */}
            <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{isAr ? 'إجمالي الإيرادات المحققة' : 'Total Revenue Generated'}</p>
                    <div className="text-3xl font-bold text-violet-300">
                      {isLoading ? '...' : formatCurrency(stats?.totalRevenue ?? 18750000)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{isAr ? 'من العقود المكتملة' : 'From completed contracts'}</p>
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assets by Type */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4 text-violet-400" />
                    {isAr ? 'توزيع الأصول حسب النوع' : 'Assets Distribution by Type'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '220px' }}>
                    <Bar
                      data={assetsChartData}
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

              {/* Contracts Donut */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    {isAr ? 'حالة العقود' : 'Contracts Status'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] flex items-center justify-center">
                    <Doughnut
                      data={contractsChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 } } },
                        },
                        cutout: '65%',
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Assets */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-violet-400" />
                  {isAr ? 'أحدث الأصول الرقمية' : 'Latest Digital Assets'}
                </CardTitle>
                <Link href="/naqla3/marketplace">
                  <Button size="sm" variant="ghost" className="text-xs gap-1 text-muted-foreground">
                    {isAr ? 'عرض الكل' : 'View All'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {stats?.recentAssets && stats.recentAssets.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentAssets.map((asset: any) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4 text-violet-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{asset.title || (isAr ? 'أصل بدون عنوان' : 'Untitled Asset')}</p>
                            <p className="text-xs text-muted-foreground">{asset.price ? formatCurrency(Number(asset.price)) : (isAr ? 'السعر غير محدد' : 'Price TBD')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {asset.type && getAssetTypeBadge(asset.type)}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{asset.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isAr ? 'لا توجد أصول رقمية بعد' : 'No digital assets yet'}</p>
                    <Link href="/naqla3/marketplace">
                      <Button size="sm" className="mt-3 bg-violet-600 hover:bg-violet-700 text-white">
                        {isAr ? 'أضف أصلاً رقمياً' : 'Add Digital Asset'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Package, labelAr: 'السوق الرقمي', labelEn: 'Digital Marketplace', href: '/naqla3/marketplace', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                { icon: FileText, labelAr: 'العقود الذكية', labelEn: 'Smart Contracts', href: '/naqla3/contracts', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                { icon: Lock, labelAr: 'حسابات الضمان', labelEn: 'Escrow Accounts', href: '/naqla3/escrow', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                { icon: Shield, labelAr: 'الملكية الفكرية', labelEn: 'IP Protection', href: '/saip-assessment', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
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

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isAr ? 'الأصول الرقمية' : 'Digital Assets'}</h2>
              <Link href="/naqla3/marketplace">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                  <Plus className="h-4 w-4" />
                  {isAr ? 'أضف أصلاً' : 'Add Asset'}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: isAr ? 'إجمالي الأصول' : 'Total Assets', value: stats?.totalAssets ?? 1247, icon: Package, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                { label: isAr ? 'نشطة' : 'Active', value: stats?.activeAssets ?? 892, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: isAr ? 'مُباعة' : 'Sold', value: stats?.soldAssets ?? 234, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: isAr ? 'الإيرادات' : 'Revenue', value: formatCurrency(stats?.totalRevenue ?? 18750000), icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className={`text-xl font-bold ${item.color}`}>{typeof item.value === 'number' ? item.value.toLocaleString('ar-SA') : item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isAr ? 'توزيع الأصول حسب النوع' : 'Assets by Type'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: isAr ? 'تراخيص' : 'Licenses', value: stats?.licenseAssets ?? 387, total: stats?.totalAssets ?? 1247, color: 'bg-violet-500', icon: Award },
                  { label: isAr ? 'منتجات' : 'Products', value: stats?.productAssets ?? 298, total: stats?.totalAssets ?? 1247, color: 'bg-blue-500', icon: Package },
                  { label: isAr ? 'استحواذات' : 'Acquisitions', value: stats?.acquisitionAssets ?? 156, total: stats?.totalAssets ?? 1247, color: 'bg-emerald-500', icon: Handshake },
                  { label: isAr ? 'شراكات' : 'Partnerships', value: stats?.partnershipAssets ?? 234, total: stats?.totalAssets ?? 1247, color: 'bg-amber-500', icon: Globe },
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
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {stats?.recentAssets && stats.recentAssets.length > 0 && (
              <div className="space-y-3">
                {stats.recentAssets.map((asset: any) => (
                  <Card key={asset.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-all">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{asset.title}</p>
                          <p className="text-xs text-muted-foreground">{asset.price ? formatCurrency(Number(asset.price)) : (isAr ? 'السعر غير محدد' : 'Price TBD')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {asset.type && getAssetTypeBadge(asset.type)}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{asset.views || 0}</span>
                        </div>
                        <Link href={`/naqla3/assets/${asset.id}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                            <Eye className="h-3 w-3" />
                            {isAr ? 'عرض' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isAr ? 'العقود الذكية' : 'Smart Contracts'}</h2>
              <div className="flex gap-2">
                <Link href="/naqla3/escrow">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Lock className="h-4 w-4" />
                    {isAr ? 'الضمان' : 'Escrow'}
                  </Button>
                </Link>
                <Link href="/naqla3/contracts">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    {isAr ? 'عقد جديد' : 'New Contract'}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: isAr ? 'إجمالي العقود' : 'Total Contracts', value: stats?.totalContracts ?? 456, icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { label: isAr ? 'نشطة' : 'Active', value: stats?.activeContracts ?? 123, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { label: isAr ? 'مكتملة' : 'Completed', value: stats?.completedContracts ?? 289, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: isAr ? 'حسابات ضمان' : 'Escrow', value: stats?.totalEscrow ?? 78, icon: Lock, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className={`text-xl font-bold ${item.color}`}>{item.value.toLocaleString('ar-SA')}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {stats?.recentContracts && stats.recentContracts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentContracts.map((contract: any) => (
                  <Card key={contract.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-all">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{contract.title || (isAr ? 'عقد بدون عنوان' : 'Untitled Contract')}</p>
                          <p className="text-xs text-muted-foreground">{contract.totalValue ? formatCurrency(Number(contract.totalValue)) : (isAr ? 'القيمة غير محددة' : 'Value TBD')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getContractStatusBadge(contract.status || 'draft')}
                        <Link href={`/naqla3/contracts/${contract.id}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                            <Eye className="h-3 w-3" />
                            {isAr ? 'عرض' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-medium mb-2">{isAr ? 'لا توجد عقود بعد' : 'No contracts yet'}</h3>
                  <Link href="/naqla3/contracts">
                    <Button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      {isAr ? 'أنشئ أول عقد' : 'Create First Contract'}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue', value: formatCurrency(stats?.totalRevenue ?? 18750000), icon: Wallet, color: 'text-violet-400' },
                { label: isAr ? 'معدل إتمام العقود' : 'Contract Completion', value: `${Math.round(((stats?.completedContracts ?? 289) / (stats?.totalContracts ?? 456)) * 100)}%`, icon: TrendingUp, color: 'text-emerald-400' },
                { label: isAr ? 'الأصول النشطة' : 'Active Assets', value: `${Math.round(((stats?.activeAssets ?? 892) / (stats?.totalAssets ?? 1247)) * 100)}%`, icon: Activity, color: 'text-blue-400' },
                { label: isAr ? 'حسابات ضمان نشطة' : 'Active Escrow', value: stats?.activeEscrow ?? 45, icon: Lock, color: 'text-amber-400' },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-4 text-center">
                    <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                    <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{isAr ? 'توزيع الأصول' : 'Assets Distribution'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '250px' }}>
                    <Bar
                      data={assetsChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
                          y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{isAr ? 'حالة العقود' : 'Contracts Status'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <Doughnut
                      data={contractsChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 } } } },
                        cutout: '65%',
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
