import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Shield, ArrowLeft, Users, FolderKanban, CheckSquare, BarChart3,
  Search, MoreHorizontal, UserCheck, UserX, Eye, Trash2,
  CheckCircle2, XCircle, Clock, TrendingUp, DollarSign, Lightbulb,
  AlertTriangle, Activity, Globe, Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

// بيانات تجريبية للمستخدمين
const usersData = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'innovator', status: 'active', projects: 3, joined: '2024-01-15' },
  { id: 2, name: 'سارة علي', email: 'sara@example.com', role: 'investor', status: 'active', projects: 0, joined: '2024-02-20' },
  { id: 3, name: 'محمد خالد', email: 'mohammed@example.com', role: 'innovator', status: 'pending', projects: 1, joined: '2024-03-10' },
  { id: 4, name: 'نورة أحمد', email: 'noura@example.com', role: 'company', status: 'active', projects: 5, joined: '2024-01-05' },
  { id: 5, name: 'خالد عبدالله', email: 'khalid@example.com', role: 'innovator', status: 'inactive', projects: 2, joined: '2024-02-28' },
];

// بيانات تجريبية للمشاريع
const projectsData = [
  { id: 1, name: 'منصة التعليم الذكي', owner: 'أحمد محمد', sector: 'education', status: 'pending', score: 85, funding: 500000 },
  { id: 2, name: 'تطبيق الصحة الرقمية', owner: 'نورة أحمد', sector: 'healthcare', status: 'approved', score: 92, funding: 1200000 },
  { id: 3, name: 'حلول الطاقة المتجددة', owner: 'محمد خالد', sector: 'energy', status: 'pending', score: 78, funding: 800000 },
  { id: 4, name: 'منصة التجارة الإلكترونية', owner: 'أحمد محمد', sector: 'fintech', status: 'rejected', score: 45, funding: 300000 },
  { id: 5, name: 'نظام اللوجستيات الذكي', owner: 'نورة أحمد', sector: 'logistics', status: 'approved', score: 88, funding: 2000000 },
];

// بيانات تجريبية للموافقات
const approvalsData = [
  { id: 1, type: 'project', title: 'منصة التعليم الذكي', requester: 'أحمد محمد', date: '2024-03-15', priority: 'high' },
  { id: 2, type: 'ip', title: 'براءة اختراع - نظام AI', requester: 'نورة أحمد', date: '2024-03-14', priority: 'medium' },
  { id: 3, type: 'contract', title: 'عقد استثمار - مشروع الطاقة', requester: 'محمد خالد', date: '2024-03-13', priority: 'high' },
  { id: 4, type: 'user', title: 'طلب ترقية حساب', requester: 'سارة علي', date: '2024-03-12', priority: 'low' },
];

const roleLabels: Record<string, { ar: string; en: string; color: string }> = {
  innovator: { ar: 'مبتكر', en: 'Innovator', color: 'bg-cyan-500/20 text-cyan-400' },
  investor: { ar: 'مستثمر', en: 'Investor', color: 'bg-emerald-500/20 text-emerald-400' },
  company: { ar: 'شركة', en: 'Company', color: 'bg-purple-500/20 text-purple-400' },
  government: { ar: 'جهة حكومية', en: 'Government', color: 'bg-amber-500/20 text-amber-400' },
};

const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
  active: { ar: 'نشط', en: 'Active', color: 'bg-emerald-500/20 text-emerald-400' },
  inactive: { ar: 'غير نشط', en: 'Inactive', color: 'bg-gray-500/20 text-gray-400' },
  pending: { ar: 'قيد الانتظار', en: 'Pending', color: 'bg-amber-500/20 text-amber-400' },
  approved: { ar: 'موافق', en: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
  rejected: { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-500/20 text-red-400' },
};

const sectorLabels: Record<string, { ar: string; en: string }> = {
  healthcare: { ar: 'الرعاية الصحية', en: 'Healthcare' },
  fintech: { ar: 'التقنية المالية', en: 'FinTech' },
  education: { ar: 'التعليم', en: 'Education' },
  energy: { ar: 'الطاقة', en: 'Energy' },
  logistics: { ar: 'اللوجستيات', en: 'Logistics' },
};

export default function Admin() {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalUsers: 1250,
    activeProjects: 380,
    pendingApprovals: 24,
    totalFunding: 60600000,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'إدارة المنصة والمستخدمين' : 'Platform & User Management'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
              <Shield className="w-3 h-3 ml-1" />
              {language === 'ar' ? 'مشرف' : 'Admin'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المستخدمين' : 'Users'}
                  </p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المشاريع' : 'Projects'}
                  </p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <FolderKanban className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'بانتظار الموافقة' : 'Pending'}
                  </p>
                  <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إجمالي التمويل' : 'Total Funding'}
                  </p>
                  <p className="text-2xl font-bold">${(stats.totalFunding / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/50 mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              {language === 'ar' ? 'المستخدمين' : 'Users'}
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="w-4 h-4" />
              {language === 'ar' ? 'المشاريع' : 'Projects'}
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-2">
              <CheckSquare className="w-4 h-4" />
              {language === 'ar' ? 'الموافقات' : 'Approvals'}
              {stats.pendingApprovals > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: UserCheck, text: language === 'ar' ? 'مستخدم جديد: أحمد محمد' : 'New user: Ahmed Mohammed', time: '5 min' },
                      { icon: Lightbulb, text: language === 'ar' ? 'مشروع جديد: منصة التعليم' : 'New project: Education Platform', time: '15 min' },
                      { icon: CheckCircle2, text: language === 'ar' ? 'موافقة على براءة اختراع' : 'Patent approved', time: '1 hr' },
                      { icon: DollarSign, text: language === 'ar' ? 'عقد استثمار جديد' : 'New investment contract', time: '2 hr' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30">
                        <div className="p-2 rounded-lg bg-secondary/50">
                          <item.icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{item.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    {language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: language === 'ar' ? 'مستخدمين جدد اليوم' : 'New users today', value: 12, change: '+8%' },
                      { label: language === 'ar' ? 'مشاريع جديدة هذا الأسبوع' : 'New projects this week', value: 28, change: '+15%' },
                      { label: language === 'ar' ? 'معدل الموافقة' : 'Approval rate', value: '78%', change: '+3%' },
                      { label: language === 'ar' ? 'متوسط وقت المراجعة' : 'Avg review time', value: '2.5 days', change: '-12%' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{stat.value}</span>
                          <Badge className={stat.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                            {stat.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المشاريع' : 'Projects'}</TableHead>
                      <TableHead>{language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</TableHead>
                      <TableHead>{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleLabels[user.role]?.color}>
                            {language === 'ar' ? roleLabels[user.role]?.ar : roleLabels[user.role]?.en}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusLabels[user.status]?.color}>
                            {language === 'ar' ? statusLabels[user.status]?.ar : statusLabels[user.status]?.en}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.projects}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                {language === 'ar' ? 'عرض' : 'View'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {user.status === 'active' ? (
                                  <>
                                    <UserX className="w-4 h-4 ml-2" />
                                    {language === 'ar' ? 'إيقاف' : 'Deactivate'}
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 ml-2" />
                                    {language === 'ar' ? 'تفعيل' : 'Activate'}
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="w-4 h-4 ml-2" />
                                {language === 'ar' ? 'حذف' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{language === 'ar' ? 'إدارة المشاريع' : 'Project Management'}</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                      className="pr-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'المشروع' : 'Project'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المالك' : 'Owner'}</TableHead>
                      <TableHead>{language === 'ar' ? 'القطاع' : 'Sector'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{language === 'ar' ? 'التقييم' : 'Score'}</TableHead>
                      <TableHead>{language === 'ar' ? 'التمويل' : 'Funding'}</TableHead>
                      <TableHead>{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsData.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.owner}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {language === 'ar' ? sectorLabels[project.sector]?.ar : sectorLabels[project.sector]?.en}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusLabels[project.status]?.color}>
                            {language === 'ar' ? statusLabels[project.status]?.ar : statusLabels[project.status]?.en}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={project.score >= 70 ? 'text-emerald-400' : project.score >= 50 ? 'text-amber-400' : 'text-red-400'}>
                            {project.score}%
                          </span>
                        </TableCell>
                        <TableCell>${(project.funding / 1000).toFixed(0)}K</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {project.status === 'pending' && (
                              <>
                                <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  {language === 'ar' ? 'قائمة الموافقات المعلقة' : 'Pending Approvals Queue'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? `${approvalsData.length} طلبات بانتظار المراجعة`
                    : `${approvalsData.length} requests awaiting review`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvalsData.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          approval.priority === 'high' ? 'bg-red-500/20' :
                          approval.priority === 'medium' ? 'bg-amber-500/20' : 'bg-gray-500/20'
                        }`}>
                          {approval.type === 'project' && <Lightbulb className="w-5 h-5" />}
                          {approval.type === 'ip' && <Shield className="w-5 h-5" />}
                          {approval.type === 'contract' && <DollarSign className="w-5 h-5" />}
                          {approval.type === 'user' && <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{approval.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'من:' : 'By:'} {approval.requester} • {approval.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          approval.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          approval.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                        }>
                          {approval.priority === 'high' ? (language === 'ar' ? 'عاجل' : 'Urgent') :
                           approval.priority === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                           (language === 'ar' ? 'منخفض' : 'Low')}
                        </Badge>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                          <CheckCircle2 className="w-4 h-4 ml-1" />
                          {language === 'ar' ? 'موافقة' : 'Approve'}
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400 border-red-400/30">
                          <XCircle className="w-4 h-4 ml-1" />
                          {language === 'ar' ? 'رفض' : 'Reject'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
