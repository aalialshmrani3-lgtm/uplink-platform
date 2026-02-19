import { TrendingUp, Globe, Leaf, Users, Target, Zap, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function UnifiedDashboard() {
  // Mock data for charts
  const predictiveData = [
    { month: "يناير", opportunities: 45, accuracy: 89 },
    { month: "فبراير", opportunities: 52, accuracy: 91 },
    { month: "مارس", opportunities: 61, accuracy: 94 },
    { month: "أبريل", opportunities: 58, accuracy: 92 },
    { month: "مايو", opportunities: 73, accuracy: 95 },
    { month: "يونيو", opportunities: 82, accuracy: 96 },
  ];

  const networkData = [
    { category: "تقنيون", count: 8500 },
    { category: "أكاديميون", count: 6200 },
    { category: "استراتيجيون", count: 4800 },
    { category: "مصممون", count: 3500 },
    { category: "قانونيون", count: 2000 },
  ];

  const esgData = [
    { name: "بيئة", value: 35, color: "#10b981" },
    { name: "مجتمع", value: 30, color: "#3b82f6" },
    { name: "حوكمة", value: 35, color: "#a855f7" },
  ];

  const kpiCards = [
    {
      title: "فرص ابتكار متوقعة",
      value: "82",
      change: "+18%",
      trend: "up",
      icon: <TrendingUp className="text-blue-600" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "خبراء نشطون",
      value: "25,143",
      change: "+12%",
      trend: "up",
      icon: <Globe className="text-green-600" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "مشاريع مستدامة",
      value: "3,247",
      change: "+25%",
      trend: "up",
      icon: <Leaf className="text-purple-600" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "تعاونات عالمية",
      value: "8,592",
      change: "+31%",
      trend: "up",
      icon: <Users className="text-orange-600" />,
      color: "from-orange-500 to-red-600",
    },
  ];

  const recentActivities = [
    {
      type: "prediction",
      title: "فرصة جديدة في الطاقة المتجددة",
      description: "تزايد الطلب على حلول تخزين الطاقة الشمسية",
      confidence: 94,
      time: "منذ ساعتين",
    },
    {
      type: "network",
      title: "خبير جديد انضم للشبكة",
      description: "د. أحمد محمد - متخصص في الذكاء الاصطناعي",
      rating: 4.9,
      time: "منذ 4 ساعات",
    },
    {
      type: "sustainability",
      title: "مشروع حصل على شهادة استدامة",
      description: "مشروع \"الزراعة الذكية\" - ISO 14001",
      score: 87,
      time: "منذ يوم",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">لوحة التحكم الموحدة</h1>
          <p className="text-muted-foreground">نظرة شاملة على جميع ميزات NAQLA 6.0</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br opacity-20">{kpi.icon}</div>
                <Badge variant={kpi.trend === "up" ? "default" : "destructive"} className="flex items-center gap-1">
                  {kpi.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {kpi.change}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.title}</div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="predictive" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictive">الابتكار التنبؤي</TabsTrigger>
            <TabsTrigger value="network">الشبكات العالمية</TabsTrigger>
            <TabsTrigger value="sustainability">الاستدامة</TabsTrigger>
          </TabsList>

          {/* Predictive Innovation Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">اتجاه فرص الابتكار</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="opportunities" stroke="#3b82f6" strokeWidth={2} name="الفرص" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">دقة التنبؤات</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="الدقة %" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">أهم التوقعات الحالية</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div>
                    <div className="font-semibold">فرصة في الطاقة المتجددة</div>
                    <div className="text-sm text-muted-foreground">تخزين الطاقة بتقنية الجرافين</div>
                  </div>
                  <Badge className="bg-green-500">94% ثقة</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div>
                    <div className="font-semibold">ثورة في الرعاية الصحية الرقمية</div>
                    <div className="text-sm text-muted-foreground">تشخيص مبكر بالذكاء الاصطناعي</div>
                  </div>
                  <Badge className="bg-green-500">89% ثقة</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Global Networks Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">توزيع الخبراء حسب الفئة</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={networkData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="عدد الخبراء" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">إحصائيات الشبكة</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">معدل الاستجابة</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">معدل إتمام المشاريع</span>
                      <span className="font-bold">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">رضا العملاء</span>
                      <span className="font-bold">4.8/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">أحدث التعاونات</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div>
                    <div className="font-semibold">تطوير تطبيق صحي عالمي</div>
                    <div className="text-sm text-muted-foreground">12 خبير من 8 دول</div>
                  </div>
                  <Badge>نشط</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div>
                    <div className="font-semibold">حل صناعي مبتكر</div>
                    <div className="text-sm text-muted-foreground">5 خبراء من 4 قارات</div>
                  </div>
                  <Badge>نشط</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Sustainability Tab */}
          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">توزيع معايير ESG</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={esgData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {esgData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">مؤشرات الاستدامة</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">تقليل انبعاثات CO₂</span>
                      <span className="font-bold text-green-600">-45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">مشاريع مستدامة</span>
                      <span className="font-bold">3,247</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">امتثال أخلاقيات AI</span>
                      <span className="font-bold">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">الشهادات الحديثة</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="font-semibold">ISO 14001</div>
                  <div className="text-sm text-muted-foreground">245 مشروع</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="font-semibold">B Corp</div>
                  <div className="text-sm text-muted-foreground">189 مشروع</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="font-semibold">LEED</div>
                  <div className="text-sm text-muted-foreground">312 مشروع</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="font-semibold">AI Ethics</div>
                  <div className="text-sm text-muted-foreground">421 مشروع</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">النشاطات الأخيرة</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="p-2 rounded-lg bg-background">
                  {activity.type === "prediction" && <TrendingUp className="text-blue-600" />}
                  {activity.type === "network" && <Globe className="text-green-600" />}
                  {activity.type === "sustainability" && <Leaf className="text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{activity.title}</div>
                  <div className="text-sm text-muted-foreground mb-2">{activity.description}</div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{activity.time}</span>
                    {"confidence" in activity && <Badge variant="secondary">{activity.confidence}% ثقة</Badge>}
                    {"rating" in activity && <Badge variant="secondary">⭐ {activity.rating}</Badge>}
                    {"score" in activity && <Badge variant="secondary">{activity.score}/100</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
