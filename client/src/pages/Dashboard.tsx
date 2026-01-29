import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, Shield, Brain, FileText, Users, BarChart3, 
  Plus, ChevronRight, Bell, Settings, LogOut,
  Lightbulb, Briefcase, GraduationCap, Crown
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  const { data: myProjects } = trpc.project.getMyProjects.useQuery(undefined, { enabled: !!user });
  const { data: myIP } = trpc.ip.getMyRegistrations.useQuery(undefined, { enabled: !!user });
  const { data: notifications } = trpc.notification.getUnread.useQuery(undefined, { enabled: !!user });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                UPLINK 5.0
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
              {notifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => logout()}>
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{user.name || "مستخدم"}</div>
                <div className="text-slate-400 text-sm">{user.role === "admin" ? "مدير" : "مبتكر"}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">مرحباً، {user.name || "مبتكر"}!</h1>
          <p className="text-slate-400">إليك نظرة عامة على نشاطك في منصة UPLINK</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "مشاريعي", value: myProjects?.length || 0, icon: Lightbulb, color: "cyan" },
            { label: "ملكياتي الفكرية", value: myIP?.length || 0, icon: Shield, color: "emerald" },
            { label: "إجمالي المشاريع", value: stats?.totalProjects || 0, icon: FileText, color: "blue" },
            { label: "إجمالي المستخدمين", value: stats?.totalUsers || 0, icon: Users, color: "purple" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/projects/new">
            <Card className="bg-gradient-to-br from-cyan-950/50 to-slate-900 border-cyan-800/50 hover:border-cyan-600/50 transition-all cursor-pointer group">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">مشروع جديد</h3>
                <p className="text-slate-400 text-sm">سجّل ابتكارك الجديد</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ip/register">
            <Card className="bg-gradient-to-br from-emerald-950/50 to-slate-900 border-emerald-800/50 hover:border-emerald-600/50 transition-all cursor-pointer group">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">تسجيل IP</h3>
                <p className="text-slate-400 text-sm">حماية ملكيتك الفكرية</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/challenges">
            <Card className="bg-gradient-to-br from-blue-950/50 to-slate-900 border-blue-800/50 hover:border-blue-600/50 transition-all cursor-pointer group">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">التحديات</h3>
                <p className="text-slate-400 text-sm">شارك في المسابقات</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/academy">
            <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900 border-purple-800/50 hover:border-purple-600/50 transition-all cursor-pointer group">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">الأكاديمية</h3>
                <p className="text-slate-400 text-sm">تعلّم وطوّر مهاراتك</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* My Projects */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">مشاريعي</CardTitle>
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
                <div className="space-y-4">
                  {myProjects.slice(0, 3).map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{project.title}</h4>
                          <p className="text-slate-400 text-sm">
                            {project.status === "draft" && "مسودة"}
                            {project.status === "submitted" && "مُقدّم"}
                            {project.status === "evaluating" && "قيد التقييم"}
                            {project.status === "approved" && "مُعتمد"}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          project.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                          project.status === "evaluating" ? "bg-blue-500/20 text-blue-400" :
                          "bg-slate-500/20 text-slate-400"
                        }`}>
                          {project.engine?.toUpperCase() || "UPLINK1"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">لم تسجل أي مشاريع بعد</p>
                  <Link href="/projects/new">
                    <Button className="bg-cyan-500 hover:bg-cyan-600">
                      <Plus className="w-4 h-4 ml-2" />
                      سجّل مشروعك الأول
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My IP Registrations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">ملكياتي الفكرية</CardTitle>
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
                <div className="space-y-4">
                  {myIP.slice(0, 3).map((ip) => (
                    <div key={ip.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{ip.title}</h4>
                        <p className="text-slate-400 text-sm">
                          {ip.type === "patent" && "براءة اختراع"}
                          {ip.type === "trademark" && "علامة تجارية"}
                          {ip.type === "copyright" && "حقوق نشر"}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        ip.status === "registered" ? "bg-emerald-500/20 text-emerald-400" :
                        ip.status === "submitted" ? "bg-blue-500/20 text-blue-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {ip.status === "draft" && "مسودة"}
                        {ip.status === "submitted" && "مُقدّم"}
                        {ip.status === "registered" && "مسجّل"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">لم تسجل أي ملكية فكرية بعد</p>
                  <Link href="/ip/register">
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      <Plus className="w-4 h-4 ml-2" />
                      سجّل ملكيتك الأولى
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link href="/marketplace">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-600/50 transition-all cursor-pointer">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">السوق</h3>
                  <p className="text-slate-400 text-sm">تصفح الابتكارات المتاحة</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/elite">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-600/50 transition-all cursor-pointer">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">نادي النخبة</h3>
                  <p className="text-slate-400 text-sm">مزايا حصرية للأعضاء</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/developers">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-rose-600/50 transition-all cursor-pointer">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">بوابة المطورين</h3>
                  <p className="text-slate-400 text-sm">API وتكاملات</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
