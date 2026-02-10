// Added for Flowchart Match - Admin Panel
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Shield, Users, FileText, BarChart3, Ban, Trash2, CheckCircle } from 'lucide-react';
import { Redirect } from 'wouter';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: users } = trpc.admin.getUsers.useQuery();
  const { data: projects } = trpc.admin.getProjects.useQuery();

  const banUserMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      toast.success('تم حظر المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حظر المستخدم: ' + error.message);
    }
  });

  const deleteProjectMutation = trpc.admin.deleteProject.useMutation({
    onSuccess: () => {
      toast.success('تم حذف المشروع بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف المشروع: ' + error.message);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            لوحة تحكم المسؤول
          </h1>
          <p className="text-slate-400 text-lg">
            إدارة المستخدمين والمحتوى والإحصائيات
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                إجمالي المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{stats?.totalUsers || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                إجمالي الأفكار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">{stats?.totalProjects || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                المطابقات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{stats?.activeMatches || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                العقود النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-cyan-400">{stats?.activeContracts || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-slate-800">
            <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">إدارة المستخدمين</CardTitle>
                <CardDescription className="text-slate-400">
                  عرض وإدارة جميع المستخدمين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="بحث عن مستخدم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-4">
                  {users?.map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700"
                    >
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                        <p className="text-slate-500 text-xs">
                          {user.role} • انضم {new Date(user.createdAt).toLocaleDateString('ar')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!user.banned && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => banUserMutation.mutate({ userId: user.id })}
                            disabled={banUserMutation.isPending}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            حظر
                          </Button>
                        )}
                        {user.banned && (
                          <span className="text-red-400 text-sm">محظور</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">إدارة المحتوى</CardTitle>
                <CardDescription className="text-slate-400">
                  مراجعة وحذف المحتوى المخالف
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects?.map((project: any) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700"
                    >
                      <div>
                        <p className="text-white font-medium">{project.title}</p>
                        <p className="text-slate-400 text-sm">{project.description?.substring(0, 100)}...</p>
                        <p className="text-slate-500 text-xs">
                          {project.category} • {new Date(project.createdAt).toLocaleDateString('ar')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProjectMutation.mutate({ projectId: project.id })}
                          disabled={deleteProjectMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">التقارير والإحصائيات</CardTitle>
                <CardDescription className="text-slate-400">
                  عرض الإحصائيات التفصيلية للمنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">المستخدمون النشطون (آخر 30 يوم)</p>
                    <p className="text-3xl font-bold text-white">{stats?.activeUsers || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">الأفكار المقدمة (آخر 30 يوم)</p>
                    <p className="text-3xl font-bold text-white">{stats?.recentProjects || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">المطابقات الناجحة</p>
                    <p className="text-3xl font-bold text-white">{stats?.successfulMatches || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">العقود المكتملة</p>
                    <p className="text-3xl font-bold text-white">{stats?.completedContracts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
