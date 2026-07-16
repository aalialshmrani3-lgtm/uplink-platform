import { useState } from 'react';
import { Link } from 'wouter';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Award,
  Activity, Target, Zap, Globe, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Calendar, Filter, Download, RefreshCw, Lightbulb, Rocket,
  Building2, FileCheck, Shield, ChevronLeft
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

// Monthly Funding Data (raw data with English-friendly keys)
const rawFundingData = [
  { month: 'يناير', funding: 2400000, projects: 12, investors: 8 },
  { month: 'فبراير', funding: 3100000, projects: 15, investors: 12 },
  { month: 'مارس', funding: 2800000, projects: 18, investors: 10 },
  { month: 'أبريل', funding: 4200000, projects: 22, investors: 15 },
  { month: 'مايو', 	funding: 3800000, projects: 20, investors: 14 },
  { month: 'يونيو', funding: 5100000, projects: 28, investors: 18 },
  { month: 'يوليو', funding: 4700000, projects: 25, investors: 16 },
  { month: 'أغسطس', funding: 5800000, projects: 32, investors: 22 },
  { month: 'سبتمبر', funding: 6200000, projects: 35, investors: 25 },
  { month: 'أكتوبر', funding: 7100000, projects: 40, investors: 28 },
  { month: 'نوفمبر', funding: 6800000, projects: 38, investors: 26 },
  { month: 'ديسمبر', funding: 8500000, projects: 45, investors: 32 },
];

const monthTranslations: { [key: string]: string } = {
  'يناير': 'Jan', 'فبراير': 'Feb', 'مارس': 'Mar', 'أبريل': 'Apr',
  'مايو': 'May', 'يونيو': 'Jun', 'يوليو': 'Jul', 'أغسطس': 'Aug',
  'سبتمبر': 'Sep', 'أكتوبر': 'Oct', 'نوفمبر': 'Nov', 'ديسمبر': 'Dec'
};

// Sector Distribution Data
const rawSectorData = [
  { name: 'الرعاية الصحية', value: 28, color: '#00d4aa' },
  { name: 'التقنية المالية', value: 22, color: '#0ea5e9' },
  { name: 'التعليم', value: 18, color: '#8b5cf6' },
  { name: 'الطاقة', value: 15, color: '#f59e0b' },
  { name: 'اللوجستيات', value: 12, color: '#ef4444' },
  { name: 'أخرى', value: 5, color: '#6b7280' },
];

const sectorNameTranslations: { [key: string]: string } = {
  'الرعاية الصحية': 'Healthcare',
  'التقنية المالية': 'Fintech',
  'التعليم': 'Education',
  'الطاقة': 'Energy',
  'اللوجستيات': 'Logistics',
  'أخرى': 'Other'
};

// Project Stages Data
const rawStageData = [
  { stage: 'فكرة', count: 45, percentage: 25 },
  { stage: 'نموذج أولي', count: 38, percentage: 21 },
  { stage: 'MVP', count: 52, percentage: 29 },
  { stage: 'نمو', count: 35, percentage: 19 },
  { stage: 'توسع', count: 10, percentage: 6 },
];

const stageTranslations: { [key: string]: string } = {
  'فكرة': 'Idea',
  'نموذج أولي': 'Prototype',
  'MVP': 'MVP',
  'نمو': 'Growth',
  'توسع': 'Expansion'
};

// Performance Data
const rawPerformanceData = [
  { metric: 'الابتكار', score: 85 },
  { metric: 'الجدوى', score: 78 },
  { metric: 'السوق', score: 72 },
  { metric: 'الفريق', score: 88 },
  { metric: 'التقنية', score: 82 },
  { metric: 'التمويل', score: 65 },
];

const metricTranslations: { [key: string]: string } = {
  'الابتكار': 'Innovation',
  'الجدوى': 'Feasibility',
  'السوق': 'Market',
  'الفريق': 'Team',
  'التقنية': 'Technology',
  'التمويل': 'Funding'
};

// Yearly Comparison Data (keys are already English-friendly)
const yearlyComparison = [
  { year: '2023', ip: 120, contracts: 85, funding: 45 },
  { year: '2024', ip: 180, contracts: 142, funding: 78 },
  { year: '2025', ip: 250, contracts: 198, funding: 125 },
];

// Weekly Activity Data
const rawWeeklyActivity = [
  { day: 'السبت', registrations: 12, visits: 450, interactions: 89 },
  { day: 'الأحد', registrations: 18, visits: 620, interactions: 124 },
  { day: 'الإثنين', registrations: 25, visits: 780, interactions: 156 },
  { day: 'الثلاثاء', registrations: 22, visits: 710, interactions: 142 },
  { day: 'الأربعاء', registrations: 28, visits: 850, interactions: 178 },
  { day: 'الخميس', registrations: 20, visits: 680, interactions: 135 },
  { day: 'الجمعة', registrations: 8, visits: 320, interactions: 65 },
];

const dayTranslations: { [key: string]: string } = {
  'السبت': 'Sat', 'الأحد': 'Sun', 'الإثنين': 'Mon', 'الثلاثاء': 'Tue',
  'الأربعاء': 'Wed', 'الخميس': 'Thu', 'الجمعة': 'Fri'
};

// StatCard component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  gradient
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: any;
  description: string;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm card-hover">
      <div className={`absolute inset-0 opacity-10 ${gradient}`} />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center gap-2">
              {changeType === 'up' ? (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                  {change}
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-0">
                  <ArrowDownRight className="w-3 h-3 ml-1" />
                  {change}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [timeRange, setTimeRange] = useState('year');
  const [selectedSector, setSelectedSector] = useState('all');

  const COLORS = ['#00d4aa', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

  // Conditional data transformations based on isAr
  const fundingData = rawFundingData.map(data => ({
    ...data,
    month: isAr ? data.month : monthTranslations[data.month] || data.month,
  }));

  const sectorData = rawSectorData.map(data => ({
    ...data,
    name: isAr ? data.name : sectorNameTranslations[data.name] || data.name,
  }));

  const stageData = rawStageData.map(data => ({
    ...data,
    stage: isAr ? data.stage : stageTranslations[data.stage] || data.stage,
  }));

  const performanceData = rawPerformanceData.map(data => ({
    ...data,
    metric: isAr ? data.metric : metricTranslations[data.metric] || data.metric,
  }));

  const weeklyActivity = rawWeeklyActivity.map(data => ({
    ...data,
    day: isAr ? data.day : dayTranslations[data.day] || data.day,
  }));

  const quickStats = [
    { label: 'معدل النجاح', value: '78%', icon: Target, color: 'text-emerald-400', enLabel: 'Success Rate' },
    { label: 'متوسط التمويل', value: '1.2M', icon: DollarSign, color: 'text-cyan-400', enLabel: 'Average Funding' },
    { label: 'وقت الإغلاق', value: '45 يوم', icon: Calendar, color: 'text-purple-400', enLabel: 'Closing Time', enValue: '45 days' },
    { label: 'رضا المستخدمين', value: '4.8/5', icon: Award, color: 'text-amber-400', enLabel: 'User Satisfaction' },
    { label: 'المشاريع الجديدة', value: '+12', icon: Lightbulb, color: 'text-pink-400', enLabel: 'New Projects' },
    { label: 'العقود النشطة', value: '89', icon: FileCheck, color: 'text-blue-400', enLabel: 'Active Contracts' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{isAr ? "لوحة التحليلات" : "Analytics Dashboard"}</h1>
                <p className="text-xs text-muted-foreground">{isAr ? "مؤشرات الأداء الرئيسية" : "Key Performance Indicators"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-secondary/50">
                <Calendar className="w-4 h-4 ml-2" />
                <SelectValue placeholder={isAr ? "اختر نطاق زمني" : "Select Time Range"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{isAr ? "أسبوع" : "Week"}</SelectItem>
                <SelectItem value="month">{isAr ? "شهر" : "Month"}</SelectItem>
                <SelectItem value="quarter">{isAr ? "ربع سنة" : "Quarter"}</SelectItem>
                <SelectItem value="year">{isAr ? "سنة" : "Year"}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="bg-secondary/50" aria-label={isAr ? "تحديث البيانات" : "Refresh Data"}>
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              onClick={() => {
                // Create report content
                const reportContent = `
                  NAQLA 5.0 - ${isAr ? "تقرير التحليلات" : "Analytics Report"}
                  ============================

                  ${isAr ? "إجمالي المشاريع" : "Total Projects"}: 380 (+24%)
                  ${isAr ? "إجمالي التمويل" : "Total Funding"}: 60.6M ${isAr ? "دولار" : "USD"} (+18%)
                  ${isAr ? "المستثمرين النشطين" : "Active Investors"}: 226 (+32%)
                  ${isAr ? "براءات الاختراع" : "Patents"}: 145 (+15%)

                  ${isAr ? "تاريخ التقرير" : "Report Date"}: ${new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                `;
                const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `NAQLA_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 ml-2" />
              {isAr ? "تصدير التقرير" : "Export Report"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={isAr ? "إجمالي المشاريع" : "Total Projects"}
            value="380"
            change="+24%"
            changeType="up"
            icon={Briefcase}
            description={isAr ? "مقارنة بالشهر الماضي" : "Compared to Last Month"}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <StatCard
            title={isAr ? "إجمالي التمويل" : "Total Funding"}
            value="60.6M"
            change="+18%"
            changeType="up"
            icon={DollarSign}
            description={isAr ? "دولار أمريكي" : "USD"}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title={isAr ? "المستثمرين النشطين" : "Active Investors"}
            value="226"
            change="+32%"
            changeType="up"
            icon={Users}
            description={isAr ? "مستثمر جديد" : "New Investor"}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <StatCard
            title={isAr ? "براءات الاختراع" : "Patents"}
            value="145"
            change="+15%"
            changeType="up"
            icon={Award}
            description={isAr ? "براءة مسجلة" : "Patent Registered"}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funding Trend Chart */}
          <Card className="lg:col-span-2 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    {isAr ? "اتجاهات التمويل" : "Funding Trends"}
                  </CardTitle>
                  <CardDescription>{isAr ? "التمويل الشهري وعدد المشاريع" : "Monthly Funding & Projects"}</CardDescription>
                </div>
                <Tabs defaultValue="area" className="w-auto">
                  <TabsList className="bg-secondary/50">
                    <TabsTrigger value="area" className="text-xs" aria-label={isAr ? "عرض مخطط المساحة" : "View Area Chart"}>
                      <BarChart3 className="w-3 h-3" />
                    </TabsTrigger>
                    <TabsTrigger value="line" className="text-xs" aria-label={isAr ? "عرض مخطط الخط" : "View Line Chart"}>
                      <LineChartIcon className="w-3 h-3" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={fundingData}>
                  <defs>
                    <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#888" fontSize={12} tickFormatter={(v) => `${v/1000000}M`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      direction: isAr ? 'rtl' : 'ltr'
                    }}
                    formatter={(value: any, name: string) => {
                      const translatedName = isAr ? {
                        'funding': 'تمويل',
                        'projects': 'مشاريع',
                        'investors': 'مستثمرين'
                      }[name] || name : name;
                      if (name === 'funding') return [`${(value/1000000).toFixed(1)}M ${isAr ? 'ريال' : 'SAR'}`, translatedName];
                      return [value, translatedName];
                    }}
                  />
                  <Legend formatter={(value: string) => isAr ? {
                    'funding': 'تمويل',
                    'projects': 'مشاريع',
                    'investors': 'مستثمرين'
                  }[value] || value : value} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="funding"
                    stroke="#00d4aa"
                    strokeWidth={2}
                    fill="url(#colorFunding)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="projects"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  />
                  <Bar yAxisId="right" dataKey="investors" fill="#0ea5e9" opacity={0.5} radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Distribution */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
                {isAr ? "توزيع القطاعات" : "Sector Distribution"}
              </CardTitle>
              <CardDescription>{isAr ? "المشاريع حسب القطاع" : "Projects by Sector"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      direction: isAr ? 'rtl' : 'ltr'
                    }}
                    formatter={(value: any) => [`${value}%`, isAr ? 'النسبة' : 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {sectorData.map((sector, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    <span className="text-muted-foreground">{sector.name}</span>
                    <span className="font-medium mr-auto">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Stages */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                {isAr ? "مراحل المشاريع" : "Project Stages"}
              </CardTitle>
              <CardDescription>{isAr ? "توزيع المشاريع حسب المرحلة" : "Projects by Stage"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#888" fontSize={12} />
                  <YAxis dataKey="stage" type="category" stroke="#888" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      direction: isAr ? 'rtl' : 'ltr'
                    }}
                    formatter={(value: any, name: string) => {
                      const translatedName = isAr ? {
                        'count': 'عدد',
                        'percentage': 'نسبة'
                      }[name] || name : name;
                      return [value, translatedName];
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Radar */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                {isAr ? "مؤشرات الأداء" : "Performance Indicators"}
              </CardTitle>
              <CardDescription>{isAr ? "متوسط تقييم المشاريع" : "Avg. Project Rating"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" stroke="#888" fontSize={12} />
                  <PolarRadiusAxis stroke="#888" fontSize={10} />
                  <Radar
                    name={isAr ? "الأداء" : "Performance"}
                    dataKey="score"
                    stroke="#00d4aa"
                    fill="#00d4aa"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      direction: isAr ? 'rtl' : 'ltr'
                    }}
                    formatter={(value: any, name: string) => {
                      const translatedName = isAr ? {
                        'score': 'النتيجة'
                      }[name] || name : name;
                      return [value, translatedName];
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Comparison & Weekly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yearly Comparison */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                {isAr ? "المقارنة السنوية" : "Annual Comparison"}
              </CardTitle>
              <CardDescription>{isAr ? "نمو المنصة خلال السنوات" : "Platform Growth Over Years"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      direction: isAr ? 'rtl' : 'ltr'
                    }}
                    formatter={(value: any, name: string) => {
                      const translatedName = isAr ? {
                        'ip': 'ملكية فكرية',
                        'contracts': 'عقود',
                        'funding': 'تمويل'
                      }[name] || name : name;
                      return [value, translatedName];
                    }}
                  />
                  <Legend formatter={(value: string) => isAr ? {
                    'ip': 'ملكية فكرية',
                    'contracts': 'عقود',
                    'funding': 'صفقات تمويل'
                  }[value] || value : value} />
                  <Bar dataKey="ip" name={isAr ? "ملكية فكرية" : "Intellectual Property"} fill="#00d4aa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="contracts" name={isAr ? "عقود" : "Contracts"} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="funding" name={isAr ? "صفقات تمويل" : "Funding Deals"} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                {isAr ? "النشاط الأسبوعي" : "Weekly Activity"}
              </CardTitle>
              <CardDescription>{isAr ? "تفاعل المستخدمين خلال الأسبوع" : "User Engagement This Week"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      direction: isAr ? 'rtl' : 'ltr'
                    }}
                    formatter={(value: any, name: string) => {
                      const translatedName = isAr ? {
                        'visits': 'زيارات',
                        'interactions': 'تفاعلات',
                        'registrations': 'تسجيلات'
                      }[name] || name : name;
                      return [value, translatedName];
                    }}
                  />
                  <Legend formatter={(value: string) => isAr ? {
                    'visits': 'زيارات',
                    'interactions': 'تفاعلات',
                    'registrations': 'تسجيلات'
                  }[value] || value : value} />
                  <Line type="monotone" dataKey="visits" stroke="#00d4aa" strokeWidth={2} dot={{ fill: '#00d4aa' }} />
                  <Line type="monotone" dataKey="interactions" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                  <Line type="monotone" dataKey="registrations" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{isAr ? stat.value : (stat.enValue || stat.value)}</p>
                <p className="text-xs text-muted-foreground">{isAr ? stat.label : stat.enLabel}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}