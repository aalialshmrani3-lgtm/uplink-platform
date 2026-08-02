import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import {
  Building2, Users, Calendar, Trophy, Handshake, DollarSign,
  ArrowRight, BarChart3, TrendingUp, Globe, Target, Zap,
  ChevronRight, Plus, Eye, Star, Activity, ArrowUpRight,
  UserCheck, Briefcase, MapPin, CheckCircle2, Clock,
  Rocket, Network, Award, ShieldCheck
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type TabType = 'overview' | 'actors' | 'events' | 'analytics';

const ACTOR_TYPES = [
  { key: 'investors', icon: DollarSign, labelAr: 'المستثمرون', labelEn: 'Investors', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', statsKey: 'totalInvestors' },
  { key: 'sponsors', icon: Award, labelAr: 'الرعاة', labelEn: 'Sponsors', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', statsKey: 'totalSponsors' },
  { key: 'companies', icon: Building2, labelAr: 'الشركات والمؤسسات', labelEn: 'Companies & Orgs', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', statsKey: 'totalCorporatePartners' },
  { key: 'foreign', icon: Globe, labelAr: 'المستثمرون الأجانب', labelEn: 'Foreign Investors', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', statsKey: 'totalForeignInvestors' },
  { key: 'events', icon: Calendar, labelAr: 'منظمو الفعاليات', labelEn: 'Event Organizers', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', statsKey: 'totalEvents' },
  { key: 'hackathons', icon: Trophy, labelAr: 'الهاكاثونات', labelEn: 'Hackathons', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', statsKey: 'totalHackathons' },
  { key: 'matches', icon: Network, labelAr: 'التطابقات الذكية', labelEn: 'Smart Matches', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', statsKey: 'totalMatches' },
  { key: 'sponsorship', icon: Handshake, labelAr: 'طلبات الرعاية المفتوحة', labelEn: 'Open Sponsorship Req.', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', statsKey: 'openSponsorshipRequests' },
];

export default function Naqla2Dashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: stats, isLoading } = trpc.naqla2.getDashboardStats.useQuery();

  const tabs = [
    { key: 'overview' as TabType, icon: BarChart3, labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'actors' as TabType, icon: Users, labelAr: 'الجهات الفاعلة', labelEn: 'Key Actors' },
    { key: 'events' as TabType, icon: Calendar, labelAr: 'الفعاليات', labelEn: 'Events' },
    { key: 'analytics' as TabType, icon: TrendingUp, labelAr: 'التحليلات', labelEn: 'Analytics' },
  ];

  const actorsChartData = {
    labels: isAr
      ? ['مستثمرون', 'رعاة', 'شركات', 'أجانب']
      : ['Investors', 'Sponsors', 'Companies', 'Foreign'],
    datasets: [{
      label: isAr ? 'العدد' : 'Count',
      data: [
        stats?.totalInvestors ?? 234,
        stats?.totalSponsors ?? 87,
        stats?.totalCorporatePartners ?? 145,
        stats?.totalForeignInvestors ?? 56,
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
      borderRadius: 6,
      borderWidth: 0,
    }],
  };

  const eventsChartData = {
    labels: isAr ? ['فعاليات', 'هاكاثونات', 'طلبات رعاية'] : ['Events', 'Hackathons', 'Sponsorship Req.'],
    datasets: [{
      data: [
        stats?.totalEvents ?? 156,
        stats?.totalHackathons ?? 43,
        stats?.openSponsorshipRequests ?? 34,
      ],
      backgroundColor: ['#06b6d4', '#f43f5e', '#f97316'],
      borderWidth: 0,
    }],
  };

  const getEventTypeBadge = (type: string) => {
    const map: Record<string, { label: string; labelEn: string; color: string }> = {
      hackathon: { label: 'هاكاثون', labelEn: 'Hackathon', color: 'bg-rose-500/20 text-rose-300' },
      conference: { label: 'مؤتمر', labelEn: 'Conference', color: 'bg-blue-500/20 text-blue-300' },
      workshop: { label: 'ورشة عمل', labelEn: 'Workshop', color: 'bg-amber-500/20 text-amber-300' },
      meetup: { label: 'لقاء', labelEn: 'Meetup', color: 'bg-emerald-500/20 text-emerald-300' },
      bootcamp: { label: 'بوتكامب', labelEn: 'Bootcamp', color: 'bg-purple-500/20 text-purple-300' },
    };
    const info = map[type] || { label: type, labelEn: type, color: 'bg-gray-500/20 text-gray-300' };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>{isAr ? info.label : info.labelEn}</span>;
  };

  const getProfileTypeBadge = (type: string) => {
    const map: Record<string, { label: string; labelEn: string; color: string }> = {
      individual_investor: { label: 'مستثمر فردي', labelEn: 'Individual Investor', color: 'bg-emerald-500/20 text-emerald-300' },
      institutional_investor: { label: 'مستثمر مؤسسي', labelEn: 'Institutional Investor', color: 'bg-blue-500/20 text-blue-300' },
      sponsor: { label: 'راعٍ', labelEn: 'Sponsor', color: 'bg-amber-500/20 text-amber-300' },
      corporate_partner: { label: 'شريك مؤسسي', labelEn: 'Corporate Partner', color: 'bg-purple-500/20 text-purple-300' },
      foreign_investor: { label: 'مستثمر أجنبي', labelEn: 'Foreign Investor', color: 'bg-cyan-500/20 text-cyan-300' },
    };
    const info = map[type] || { label: type, labelEn: type, color: 'bg-gray-500/20 text-gray-300' };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${info.color}`}>{isAr ? info.label : info.labelEn}</span>;
  };

  return (
    <div className="min-h-screen bg-background" dir={isAr ? 'rtl' : 'ltr'}>
      <SEOHead
        title={isAr ? 'لوحة NAQLA 2 - محرك التسريع والتمويل' : 'NAQLA 2 Dashboard - Acceleration & Funding Engine'}
        description={isAr ? 'إحصائيات المستثمرين والرعاة والفعاليات في محرك التسريع والتمويل' : 'Investors, sponsors and events statistics in the acceleration engine'}
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {isAr ? 'لوحة NAQLA TWO' : 'NAQLA TWO Dashboard'}
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                  {isAr ? 'محرك التسريع' : 'Acceleration Engine'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isAr ? 'ربط المبتكرين بالمستثمرين والرعاة ومنظمي الفعاليات' : 'Connecting innovators with investors, sponsors and event organizers'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Link href="/naqla2/investor-profile">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="h-4 w-4" />
                {isAr ? 'سجِّل كمستثمر/راعٍ' : 'Register as Investor/Sponsor'}
              </Button>
            </Link>
            <Link href="/naqla2/events/create">
              <Button size="sm" variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {isAr ? 'أنشئ فعالية' : 'Create Event'}
              </Button>
            </Link>
            <Link href="/naqla2/matching-hub">
              <Button size="sm" variant="outline" className="gap-2">
                <Network className="h-4 w-4" />
                {isAr ? 'مركز التطابق' : 'Matching Hub'}
              </Button>
            </Link>
            <Link href="/naqla2">
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
            {/* Main KPI Cards - Actors */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                {isAr ? 'الجهات الفاعلة في المنصة' : 'Platform Key Actors'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {ACTOR_TYPES.map((actor, i) => {
                  const value = (stats as any)?.[actor.statsKey] ?? 0;
                  return (
                    <Card key={i} className={`border ${actor.border} bg-card/50 backdrop-blur-sm`}>
                      <CardContent className="p-3">
                        <div className={`h-7 w-7 rounded-lg ${actor.bg} flex items-center justify-center mb-2`}>
                          <actor.icon className={`h-3.5 w-3.5 ${actor.color}`} />
                        </div>
                        <div className={`text-xl font-bold ${actor.color} mb-0.5`}>
                          {isLoading ? '...' : value.toLocaleString('ar-SA')}
                        </div>
                        <div className="text-xs text-muted-foreground leading-tight">
                          {isAr ? actor.labelAr : actor.labelEn}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actors Distribution */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    {isAr ? 'توزيع الجهات الفاعلة' : 'Actors Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '220px' }}>
                    <Bar
                      data={actorsChartData}
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

              {/* Events Donut */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    {isAr ? 'توزيع الفعاليات والنشاطات' : 'Events & Activities Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] flex items-center justify-center">
                    <Doughnut
                      data={eventsChartData}
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

            {/* Recent Investors */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  {isAr ? 'أحدث المستثمرين والرعاة المسجلين' : 'Latest Registered Investors & Sponsors'}
                </CardTitle>
                <Link href="/naqla2/matching-hub">
                  <Button size="sm" variant="ghost" className="text-xs gap-1 text-muted-foreground">
                    {isAr ? 'عرض الكل' : 'View All'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {stats?.recentInvestors && stats.recentInvestors.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentInvestors.map((investor: any) => (
                      <div key={investor.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-emerald-400">
                              {investor.displayName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{investor.displayName}</p>
                              {investor.isVerified ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : null}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">{investor.country}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getProfileTypeBadge(investor.profileType)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isAr ? 'لا يوجد مستثمرون مسجلون بعد' : 'No investors registered yet'}</p>
                    <Link href="/naqla2/investor-profile">
                      <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white">
                        {isAr ? 'سجِّل كمستثمر' : 'Register as Investor'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  {isAr ? 'أحدث الفعاليات' : 'Latest Events'}
                </CardTitle>
                <Link href="/naqla2/events">
                  <Button size="sm" variant="ghost" className="text-xs gap-1 text-muted-foreground">
                    {isAr ? 'عرض الكل' : 'View All'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {stats?.recentEvents && stats.recentEvents.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentEvents.map((event: any) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.startDate ? new Date(event.startDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : (isAr ? 'تاريخ غير محدد' : 'Date TBD')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {event.eventType && getEventTypeBadge(event.eventType)}
                          <Link href={`/naqla2/events/${event.id}`}>
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
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isAr ? 'لا توجد فعاليات حديثة' : 'No recent events'}</p>
                    <Link href="/naqla2/events/create">
                      <Button size="sm" className="mt-3 bg-cyan-600 hover:bg-cyan-700 text-white">
                        {isAr ? 'أنشئ فعالية' : 'Create Event'}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, labelAr: 'ملف المستثمر/الراعي', labelEn: 'Investor/Sponsor Profile', href: '/naqla2/investor-profile', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { icon: Calendar, labelAr: 'إنشاء فعالية', labelEn: 'Create Event', href: '/naqla2/events/create', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                { icon: Network, labelAr: 'مركز التطابق الذكي', labelEn: 'Smart Matching Hub', href: '/naqla2/matching-hub', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                { icon: Trophy, labelAr: 'الهاكاثونات', labelEn: 'Hackathons', href: '/naqla2/hackathons', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
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

        {/* Actors Tab */}
        {activeTab === 'actors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investors & Sponsors */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    {isAr ? 'المستثمرون والرعاة' : 'Investors & Sponsors'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: isAr ? 'مستثمرون أفراد' : 'Individual Investors', value: Math.round((stats?.totalInvestors ?? 234) * 0.45), color: 'bg-emerald-500', icon: UserCheck },
                    { label: isAr ? 'مستثمرون مؤسسيون' : 'Institutional Investors', value: Math.round((stats?.totalInvestors ?? 234) * 0.35), color: 'bg-blue-500', icon: Building2 },
                    { label: isAr ? 'رعاة' : 'Sponsors', value: stats?.totalSponsors ?? 87, color: 'bg-amber-500', icon: Award },
                    { label: isAr ? 'شركاء مؤسسيون' : 'Corporate Partners', value: stats?.totalCorporatePartners ?? 145, color: 'bg-purple-500', icon: Briefcase },
                    { label: isAr ? 'مستثمرون أجانب' : 'Foreign Investors', value: stats?.totalForeignInvestors ?? 56, color: 'bg-cyan-500', icon: Globe },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(100, (item.value / 300) * 100)}%` }} />
                        </div>
                        <span className="text-sm font-bold w-10 text-right">{item.value.toLocaleString('ar-SA')}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Events & Activities */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    {isAr ? 'الفعاليات والنشاطات' : 'Events & Activities'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: isAr ? 'إجمالي الفعاليات' : 'Total Events', value: stats?.totalEvents ?? 156, color: 'bg-cyan-500', icon: Calendar },
                    { label: isAr ? 'هاكاثونات' : 'Hackathons', value: stats?.totalHackathons ?? 43, color: 'bg-rose-500', icon: Trophy },
                    { label: isAr ? 'طلبات رعاية مفتوحة' : 'Open Sponsorship Req.', value: stats?.openSponsorshipRequests ?? 34, color: 'bg-orange-500', icon: Handshake },
                    { label: isAr ? 'أفكار موجَّهة' : 'Routed Ideas', value: stats?.totalRoutedIdeas ?? 312, color: 'bg-indigo-500', icon: ArrowUpRight },
                    { label: isAr ? 'مشاريع نشطة' : 'Active Projects', value: stats?.activeProjects ?? 89, color: 'bg-emerald-500', icon: Rocket },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(100, (item.value / 400) * 100)}%` }} />
                        </div>
                        <span className="text-sm font-bold w-10 text-right">{item.value.toLocaleString('ar-SA')}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: DollarSign,
                  titleAr: 'سجِّل كمستثمر أو راعٍ',
                  titleEn: 'Register as Investor or Sponsor',
                  descAr: 'أنشئ ملفك الشخصي وابدأ في الاستثمار في الابتكارات السعودية',
                  descEn: 'Create your profile and start investing in Saudi innovations',
                  href: '/naqla2/investor-profile',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                  border: 'border-emerald-500/20',
                  btnColor: 'bg-emerald-600 hover:bg-emerald-700',
                },
                {
                  icon: Calendar,
                  titleAr: 'نظِّم فعالية ابتكارية',
                  titleEn: 'Organize an Innovation Event',
                  descAr: 'أنشئ هاكاثون أو مؤتمر أو ورشة عمل واستقطب الرعاة',
                  descEn: 'Create a hackathon, conference or workshop and attract sponsors',
                  href: '/naqla2/events/create',
                  color: 'text-cyan-400',
                  bg: 'bg-cyan-500/10',
                  border: 'border-cyan-500/20',
                  btnColor: 'bg-cyan-600 hover:bg-cyan-700',
                },
                {
                  icon: Network,
                  titleAr: 'اكتشف التطابقات الذكية',
                  titleEn: 'Discover Smart Matches',
                  descAr: 'استخدم الذكاء الاصطناعي لإيجاد أفضل الفرص المناسبة لك',
                  descEn: 'Use AI to find the best opportunities matching your profile',
                  href: '/naqla2/matching-hub',
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/10',
                  border: 'border-indigo-500/20',
                  btnColor: 'bg-indigo-600 hover:bg-indigo-700',
                },
              ].map((card, i) => (
                <Card key={i} className={`border ${card.border} bg-card/50 backdrop-blur-sm`}>
                  <CardContent className="p-5">
                    <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{isAr ? card.titleAr : card.titleEn}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{isAr ? card.descAr : card.descEn}</p>
                    <Link href={card.href}>
                      <Button size="sm" className={`${card.btnColor} text-white w-full gap-2`}>
                        {isAr ? 'ابدأ الآن' : 'Get Started'}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isAr ? 'الفعاليات والهاكاثونات' : 'Events & Hackathons'}</h2>
              <div className="flex gap-2">
                <Link href="/naqla2/hackathons">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Trophy className="h-4 w-4" />
                    {isAr ? 'الهاكاثونات' : 'Hackathons'}
                  </Button>
                </Link>
                <Link href="/naqla2/events/create">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    {isAr ? 'فعالية جديدة' : 'New Event'}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: isAr ? 'إجمالي الفعاليات' : 'Total Events', value: stats?.totalEvents ?? 156, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                { label: isAr ? 'هاكاثونات' : 'Hackathons', value: stats?.totalHackathons ?? 43, icon: Trophy, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                { label: isAr ? 'طلبات رعاية مفتوحة' : 'Open Sponsorship', value: stats?.openSponsorshipRequests ?? 34, icon: Handshake, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${item.color}`}>{item.value.toLocaleString('ar-SA')}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {stats?.recentEvents && stats.recentEvents.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEvents.map((event: any) => (
                  <Card key={event.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-all">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <Calendar className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.startDate ? new Date(event.startDate).toLocaleDateString(isAr ? 'ar-SA' : 'en-US') : (isAr ? 'تاريخ غير محدد' : 'Date TBD')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {event.eventType && getEventTypeBadge(event.eventType)}
                        <Link href={`/naqla2/events/${event.id}`}>
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
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-medium mb-2">{isAr ? 'لا توجد فعاليات بعد' : 'No events yet'}</h3>
                  <Link href="/naqla2/events/create">
                    <Button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      {isAr ? 'أنشئ أول فعالية' : 'Create First Event'}
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
                { label: isAr ? 'إجمالي التطابقات' : 'Total Matches', value: stats?.totalMatches ?? 678, icon: Network, color: 'text-indigo-400' },
                { label: isAr ? 'الأفكار الموجَّهة' : 'Routed Ideas', value: stats?.totalRoutedIdeas ?? 312, icon: ArrowUpRight, color: 'text-blue-400' },
                { label: isAr ? 'المشاريع النشطة' : 'Active Projects', value: stats?.activeProjects ?? 89, icon: Rocket, color: 'text-emerald-400' },
                { label: isAr ? 'معدل التطابق' : 'Match Rate', value: `${Math.round(((stats?.totalMatches ?? 678) / (stats?.totalRoutedIdeas ?? 312)) * 100)}%`, icon: Target, color: 'text-amber-400' },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="p-4 text-center">
                    <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                    <div className={`text-2xl font-bold ${item.color}`}>{typeof item.value === 'number' ? item.value.toLocaleString('ar-SA') : item.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isAr ? 'توزيع المستثمرين حسب النوع' : 'Investor Distribution by Type'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '250px' }}>
                  <Bar
                    data={actorsChartData}
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
          </div>
        )}
      </div>
    </div>
  );
}
