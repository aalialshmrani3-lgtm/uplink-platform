import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, Shield, Brain, FileText, Users, BarChart3, 
  Plus, ChevronRight, Bell, Settings, LogOut,
  Lightbulb, Briefcase, GraduationCap, Crown, Globe,
  MessageSquare, PenTool, TrendingUp, Zap, Target,
  Calendar, ArrowUpRight, Activity, Sparkles
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  const { data: myProjects } = trpc.project.getMyProjects.useQuery(undefined, { enabled: !!user });
  const { data: myIP } = trpc.ip.getMyRegistrations.useQuery(undefined, { enabled: !!user });
  const { data: notifications } = trpc.notification.getUnread.useQuery(undefined, { enabled: !!user });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const quickActions = [
    { href: '/projects/new', icon: Plus, title: 'مشروع جديد', desc: 'سجّل ابتكارك', color: 'from-cyan-500 to-blue-600' },
    { href: '/ip/register', icon: Shield, title: 'تسجيل IP', desc: 'حماية ملكيتك', color: 'from-emerald-500 to-teal-600' },
    { href: '/challenges', icon: Brain, title: 'التحديات', desc: 'شارك وانافس', color: 'from-purple-500 to-pink-600' },
    { href: '/marketplace', icon: Globe, title: 'السوق', desc: 'استكشف الفرص', color: 'from-amber-500 to-orange-600' },
  ];

  const tools = [
    { href: '/analytics', icon: BarChart3, title: 'التحليلات', desc: 'مؤشرات الأداء', color: 'text-cyan-400' },
    { href: '/messages', icon: MessageSquare, title: 'الرسائل', desc: 'تواصل آمن', color: 'text-purple-400' },
    { href: '/whiteboard', icon: PenTool, title: 'لوحة الأفكار', desc: 'تعاون مرئي', color: 'text-pink-400' },
    { href: '/academy', icon: GraduationCap, title: 'الأكاديمية', desc: 'تعلّم وطوّر', color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-gradient-cyan">NAQLA 5.0</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  3
                </span>
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="w-5 h-5" />
              {notifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
            </Button>
            
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            
            <div className="w-px h-8 bg-border mx-2" />
            
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-cyan-500/30">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <div className="font-medium text-sm">{user.name || "مستخدم"}</div>
                <div className="text-xs text-muted-foreground">{user.role === "admin" ? "مدير" : "مبتكر"}</div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={() => logout()}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-muted-foreground">لوحة التحكم</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">مرحباً، {user.name || "مبتكر"}!</h1>
          <p className="text-muted-foreground">إليك نظرة عامة على نشاطك في منصة NAQLA</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "مشاريعي", value: myProjects?.length || 0, icon: Lightbulb, change: "+2", color: 'from-cyan-500 to-blue-600' },
            { label: "ملكياتي الفكرية", value: myIP?.length || 0, icon: Shield, change: "+1", color: 'from-emerald-500 to-teal-600' },
            { label: "إجمالي المشاريع", value: stats?.totalProjects || 0, icon: FileText, change: "+12%", color: 'from-purple-500 to-pink-600' },
            { label: "المستخدمين", value: stats?.totalUsers || 0, icon: Users, change: "+8%", color: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                      <TrendingUp className="w-3 h-3 ml-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <Card className="border-0 bg-card/50 backdrop-blur-sm cursor-pointer card-hover group h-full">
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            الأدوات
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <Link key={i} href={tool.href}>
                <Card className="border-0 bg-card/30 backdrop-blur-sm cursor-pointer hover:bg-card/50 transition-colors group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-secondary/50 ${tool.color}`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{tool.title}</h3>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* My Projects */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-cyan-400" />
                  مشاريعي
                </CardTitle>
                <CardDescription>آخر المشاريع المسجلة</CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-cyan-400">
                  عرض الكل
                  <ChevronRight className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {myProjects && myProjects.length > 0 ? (
                <div className="space-y-3">
                  {myProjects.slice(0, 4).map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{project.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {project.status === "draft" && "مسودة"}
                            {project.status === "submitted" && "مُقدّم"}
                            {project.status === "evaluating" && "قيد التقييم"}
                            {project.status === "approved" && "مُعتمد"}
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          project.status === "approved" ? "border-emerald-500/50 text-emerald-400" :
                          project.status === "evaluating" ? "border-blue-500/50 text-blue-400" :
                          "border-border"
                        }`}>
                          {project.engine?.toUpperCase() || "NAQLA1"}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">لم تسجل أي مشاريع بعد</p>
                  <Link href="/projects/new">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                      <Plus className="w-4 h-4 ml-2" />
                      سجّل مشروعك الأول
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My IP Registrations */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  ملكياتي الفكرية
                </CardTitle>
                <CardDescription>تسجيلات IP الخاصة بك</CardDescription>
              </div>
              <Link href="/ip/list">
                <Button variant="ghost" size="sm" className="text-emerald-400">
                  عرض الكل
                  <ChevronRight className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {myIP && myIP.length > 0 ? (
                <div className="space-y-3">
                  {myIP.slice(0, 4).map((ip) => (
                    <div key={ip.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{ip.title}</h4>
                        <p className="text-xs text-muted-foreground">{ip.type}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${
                        ip.status === "approved" ? "border-emerald-500/50 text-emerald-400" :
                        ip.status === "under_review" ? "border-amber-500/50 text-amber-400" :
                        "border-border"
                      }`}>
                        {ip.status === "approved" ? "مُعتمد" : ip.status === "under_review" ? "قيد المراجعة" : ip.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">لم تسجل أي ملكية فكرية بعد</p>
                  <Link href="/ip/register">
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                      <Plus className="w-4 h-4 ml-2" />
                      سجّل ملكيتك الأولى
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity & Upcoming */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'تم تقديم مشروع جديد', time: 'منذ ساعتين', icon: Lightbulb, color: 'text-cyan-400' },
                  { action: 'تم تسجيل براءة اختراع', time: 'منذ 5 ساعات', icon: Shield, color: 'text-emerald-400' },
                  { action: 'رسالة جديدة من مستثمر', time: 'أمس', icon: MessageSquare, color: 'text-purple-400' },
                  { action: 'تم قبول مشروعك في التحدي', time: 'منذ يومين', icon: Brain, color: 'text-amber-400' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-secondary/50 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                الأحداث القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'تحدي الابتكار الصحي', date: '15 فبراير', type: 'تحدي' },
                  { title: 'ورشة الملكية الفكرية', date: '20 فبراير', type: 'ورشة' },
                  { title: 'يوم المستثمرين', date: '1 مارس', type: 'حدث' },
                ].map((event, i) => (
                  <div key={i} className="p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
