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

// بيانات التمويل الشهري
const fundingData = [
  { month: 'يناير', تمويل: 2400000, مشاريع: 12, مستثمرين: 8 },
  { month: 'فبراير', تمويل: 3100000, مشاريع: 15, مستثمرين: 12 },
  { month: 'مارس', تمويل: 2800000, مشاريع: 18, مستثمرين: 10 },
  { month: 'أبريل', تمويل: 4200000, مشاريع: 22, مستثمرين: 15 },
  { month: 'مايو', تمويل: 3800000, مشاريع: 20, مستثمرين: 14 },
  { month: 'يونيو', تمويل: 5100000, مشاريع: 28, مستثمرين: 18 },
  { month: 'يوليو', تمويل: 4700000, مشاريع: 25, مستثمرين: 16 },
  { month: 'أغسطس', تمويل: 5800000, مشاريع: 32, مستثمرين: 22 },
  { month: 'سبتمبر', تمويل: 6200000, مشاريع: 35, مستثمرين: 25 },
  { month: 'أكتوبر', تمويل: 7100000, مشاريع: 40, مستثمرين: 28 },
  { month: 'نوفمبر', تمويل: 6800000, مشاريع: 38, مستثمرين: 26 },
  { month: 'ديسمبر', تمويل: 8500000, مشاريع: 45, مستثمرين: 32 },
];

// بيانات توزيع القطاعات
const sectorData = [
  { name: 'الرعاية الصحية', value: 28, color: '#00d4aa' },
  { name: 'التقنية المالية', value: 22, color: '#0ea5e9' },
  { name: 'التعليم', value: 18, color: '#8b5cf6' },
  { name: 'الطاقة', value: 15, color: '#f59e0b' },
  { name: 'اللوجستيات', value: 12, color: '#ef4444' },
  { name: 'أخرى', value: 5, color: '#6b7280' },
];

// بيانات مراحل المشاريع
const stageData = [
  { stage: 'فكرة', عدد: 45, نسبة: 25 },
  { stage: 'نموذج أولي', عدد: 38, نسبة: 21 },
  { stage: 'MVP', عدد: 52, نسبة: 29 },
  { stage: 'نمو', عدد: 35, نسبة: 19 },
  { stage: 'توسع', عدد: 10, نسبة: 6 },
];

// بيانات الأداء
const performanceData = [
  { metric: 'الابتكار', score: 85 },
  { metric: 'الجدوى', score: 78 },
  { metric: 'السوق', score: 72 },
  { metric: 'الفريق', score: 88 },
  { metric: 'التقنية', score: 82 },
  { metric: 'التمويل', score: 65 },
];

// بيانات المقارنة السنوية
const yearlyComparison = [
  { year: '2023', ملكية_فكرية: 120, عقود: 85, تمويل: 45 },
  { year: '2024', ملكية_فكرية: 180, عقود: 142, تمويل: 78 },
  { year: '2025', ملكية_فكرية: 250, عقود: 198, تمويل: 125 },
];

// بيانات النشاط الأسبوعي
const weeklyActivity = [
  { day: 'السبت', تسجيلات: 12, زيارات: 450, تفاعلات: 89 },
  { day: 'الأحد', تسجيلات: 18, زيارات: 620, تفاعلات: 124 },
  { day: 'الإثنين', تسجيلات: 25, زيارات: 780, تفاعلات: 156 },
  { day: 'الثلاثاء', تسجيلات: 22, زيارات: 710, تفاعلات: 142 },
  { day: 'الأربعاء', تسجيلات: 28, زيارات: 850, تفاعلات: 178 },
  { day: 'الخميس', تسجيلات: 20, زيارات: 680, تفاعلات: 135 },
  { day: 'الجمعة', تسجيلات: 8, زيارات: 320, تفاعلات: 65 },
];

// مكون البطاقة الإحصائية
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
  const [timeRange, setTimeRange] = useState('year');
  const [selectedSector, setSelectedSector] = useState('all');

  const COLORS = ['#00d4aa', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

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
                <h1 className="text-lg font-bold">لوحة التحليلات</h1>
                <p className="text-xs text-muted-foreground">مؤشرات الأداء الرئيسية</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-secondary/50">
                <Calendar className="w-4 h-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">أسبوع</SelectItem>
                <SelectItem value="month">شهر</SelectItem>
                <SelectItem value="quarter">ربع سنة</SelectItem>
                <SelectItem value="year">سنة</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" className="bg-secondary/50">
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              onClick={() => {
                // إنشاء محتوى التقرير
                const reportContent = `
                  NAQLA 5.0 - تقرير التحليلات
                  ============================
                  
                  إجمالي المشاريع: 380 (+24%)
                  إجمالي التمويل: 60.6M دولار (+18%)
                  المستثمرين النشطين: 226 (+32%)
                  براءات الاختراع: 145 (+15%)
                  
                  تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
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
              تصدير التقرير
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي المشاريع"
            value="380"
            change="+24%"
            changeType="up"
            icon={Briefcase}
            description="مقارنة بالشهر الماضي"
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <StatCard
            title="إجمالي التمويل"
            value="60.6M"
            change="+18%"
            changeType="up"
            icon={DollarSign}
            description="دولار أمريكي"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="المستثمرين النشطين"
            value="226"
            change="+32%"
            changeType="up"
            icon={Users}
            description="مستثمر جديد"
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <StatCard
            title="براءات الاختراع"
            value="145"
            change="+15%"
            changeType="up"
            icon={Award}
            description="براءة مسجلة"
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
                    اتجاهات التمويل
                  </CardTitle>
                  <CardDescription>التمويل الشهري وعدد المشاريع</CardDescription>
                </div>
                <Tabs defaultValue="area" className="w-auto">
                  <TabsList className="bg-secondary/50">
                    <TabsTrigger value="area" className="text-xs">
                      <BarChart3 className="w-3 h-3" />
                    </TabsTrigger>
                    <TabsTrigger value="line" className="text-xs">
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
                      direction: 'rtl'
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'تمويل') return [`${(value/1000000).toFixed(1)}M ريال`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="تمويل"
                    stroke="#00d4aa"
                    strokeWidth={2}
                    fill="url(#colorFunding)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="مشاريع"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  />
                  <Bar yAxisId="right" dataKey="مستثمرين" fill="#0ea5e9" opacity={0.5} radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Distribution */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
                توزيع القطاعات
              </CardTitle>
              <CardDescription>المشاريع حسب القطاع</CardDescription>
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
                      borderRadius: '12px'
                    }}
                    formatter={(value: any) => [`${value}%`, 'النسبة']}
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
                مراحل المشاريع
              </CardTitle>
              <CardDescription>توزيع المشاريع حسب المرحلة</CardDescription>
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
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="عدد" radius={[0, 8, 8, 0]}>
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
                مؤشرات الأداء
              </CardTitle>
              <CardDescription>متوسط تقييم المشاريع</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" stroke="#888" fontSize={12} />
                  <PolarRadiusAxis stroke="#888" fontSize={10} />
                  <Radar
                    name="الأداء"
                    dataKey="score"
                    stroke="#00d4aa"
                    fill="#00d4aa"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
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
                المقارنة السنوية
              </CardTitle>
              <CardDescription>نمو المنصة خلال السنوات</CardDescription>
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
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ملكية_فكرية" name="ملكية فكرية" fill="#00d4aa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="عقود" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="تمويل" name="صفقات تمويل" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                النشاط الأسبوعي
              </CardTitle>
              <CardDescription>تفاعل المستخدمين خلال الأسبوع</CardDescription>
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
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="زيارات" stroke="#00d4aa" strokeWidth={2} dot={{ fill: '#00d4aa' }} />
                  <Line type="monotone" dataKey="تفاعلات" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                  <Line type="monotone" dataKey="تسجيلات" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'معدل النجاح', value: '78%', icon: Target, color: 'text-emerald-400' },
            { label: 'متوسط التمويل', value: '1.2M', icon: DollarSign, color: 'text-cyan-400' },
            { label: 'وقت الإغلاق', value: '45 يوم', icon: Calendar, color: 'text-purple-400' },
            { label: 'رضا المستخدمين', value: '4.8/5', icon: Award, color: 'text-amber-400' },
            { label: 'المشاريع الجديدة', value: '+12', icon: Lightbulb, color: 'text-pink-400' },
            { label: 'العقود النشطة', value: '89', icon: FileCheck, color: 'text-blue-400' },
          ].map((stat, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
