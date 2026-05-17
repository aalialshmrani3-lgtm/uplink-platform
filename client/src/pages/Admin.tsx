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
            <TabsTrigger value="qstp" className="gap-2">
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'ترشيح QSTP' : 'QSTP Nominations'}
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

          {/* QSTP Nominations Tab */}
          <TabsContent value="qstp">
            <div className="space-y-6">
              {/* QSTP Header Banner */}
              <Card className="border border-violet-500/30 bg-gradient-to-r from-violet-900/40 to-blue-900/40">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-violet-600/20 rounded-xl flex items-center justify-center text-3xl shrink-0">🌐</div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-1">
                        {language === 'ar' ? 'الترشيح المؤسسي لبرامج QSTP' : 'Institutional Nominations for QSTP Programs'}
                      </h2>
                      <p className="text-slate-300 text-sm mb-4">
                        {language === 'ar'
                          ? 'رشّح الابتكارات والمشاريع المتميزة لبرامج واحة قطر للعلوم والتكنولوجيا. المشاريع في TRL 4+ مؤهلة للتقدم لصندوق الـ 30 مليون دولار وبرنامج The 300 وحاضنة الأعمال.'
                          : 'Nominate outstanding innovations for Qatar Science & Technology Park programs. Projects at TRL 4+ are eligible for the $30M fund, The 300 program, and the incubator.'
                        }
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <a href="https://qstp.qa/ar/programs/incubate/" target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1.5">
                            🏢 {language === 'ar' ? 'حاضنة QSTP' : 'QSTP Incubator'}
                          </Button>
                        </a>
                        <a href="https://qstp.qa/ar/programs/the-300/" target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
                            🏆 {language === 'ar' ? 'برنامج The 300' : 'The 300 Program'}
                          </Button>
                        </a>
                        <a href="https://qstp.qa/ar/global-innovation-link/" target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="border-violet-500/40 text-violet-300 hover:bg-violet-900/30 text-xs gap-1.5">
                            🔗 {language === 'ar' ? 'رابط الابتكار العالمي' : 'Global Innovation Link'}
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: language === 'ar' ? 'مرشحون نشطون' : 'Active Nominations', value: '12', color: 'text-violet-400', icon: '📋' },
                  { label: language === 'ar' ? 'قيد المراجعة' : 'Under Review', value: '5', color: 'text-amber-400', icon: '⏳' },
                  { label: language === 'ar' ? 'تم القبول' : 'Accepted', value: '3', color: 'text-green-400', icon: '✅' },
                  { label: language === 'ar' ? 'إجمالي التمويل المطلوب' : 'Total Funding Requested', value: '$2.4M', color: 'text-blue-400', icon: '💰' },
                ].map((stat, i) => (
                  <Card key={i} className="border-0 bg-card/50">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Nominations List */}
              <Card className="border-0 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">📋</span>
                      {language === 'ar' ? 'قائمة الترشيحات' : 'Nominations List'}
                    </CardTitle>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1">
                      <span>+</span> {language === 'ar' ? 'إضافة ترشيح' : 'Add Nomination'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: language === 'ar' ? 'روبوت تنظيف الألواح الشمسية' : 'Solar Panel Cleaning Robot', org: 'KACST', trl: 6, program: 'The 300', status: 'review', funding: '$500K' },
                      { name: language === 'ar' ? 'نظام تبريد البطاريات بالذكاء الاصطناعي' : 'AI Battery Cooling System', org: 'KFUPM', trl: 5, program: 'Incubator', status: 'pending', funding: '$300K' },
                      { name: language === 'ar' ? 'منصة الهيدروجين الأخضر' : 'Green Hydrogen Platform', org: 'Saudi Aramco', trl: 7, program: 'Global Innovation Link', status: 'accepted', funding: '$1.2M' },
                      { name: language === 'ar' ? 'تطبيق الذكاء الاصطناعي للطاقة' : 'AI Energy Optimization App', org: 'STC', trl: 4, program: 'Incubator', status: 'pending', funding: '$200K' },
                      { name: language === 'ar' ? 'نظام احتجاز الكربون النانوي' : 'Nano Carbon Capture System', org: 'SABIC', trl: 5, program: 'The 300', status: 'review', funding: '$800K' },
                    ].map((nom, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center text-lg">
                            {nom.trl >= 7 ? '🚀' : nom.trl >= 5 ? '⚗️' : '🔬'}
                          </div>
                          <div>
                            <p className="font-medium text-white">{nom.name}</p>
                            <p className="text-xs text-muted-foreground">{nom.org} • TRL {nom.trl} • {nom.program}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`text-xs border ${
                            nom.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            nom.status === 'review' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }`}>
                            {nom.status === 'accepted' ? '✅ ' + (language === 'ar' ? 'مقبول' : 'Accepted') :
                             nom.status === 'review' ? '⏳ ' + (language === 'ar' ? 'قيد المراجعة' : 'Under Review') :
                             '📋 ' + (language === 'ar' ? 'معلق' : 'Pending')}
                          </Badge>
                          <span className="text-blue-400 text-sm font-bold">{nom.funding}</span>
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs">
                            {language === 'ar' ? 'عرض' : 'View'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* QSTP Programs Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: '🏢', title: language === 'ar' ? 'حاضنة الأعمال' : 'Business Incubator', desc: language === 'ar' ? 'دعم شامل للشركات الناشئة في TRL 4-6 مع مساحة عمل ومرشدين متخصصين' : 'Comprehensive support for tech startups at TRL 4-6 with workspace and mentors', link: 'https://qstp.qa/ar/programs/incubate/', color: 'border-blue-500/30 bg-blue-900/20' },
                  { icon: '🏆', title: language === 'ar' ? 'برنامج The 300' : 'The 300 Program', desc: language === 'ar' ? 'برنامج تسريع للشركات الأكثر تأثيراً في التكنولوجيا النظيفة والذكاء الاصطناعي والتكنولوجيا الحيوية' : 'Acceleration for most impactful startups in clean tech, AI, and biotech', link: 'https://qstp.qa/ar/programs/the-300/', color: 'border-amber-500/30 bg-amber-900/20' },
                  { icon: '🔗', title: language === 'ar' ? 'رابط الابتكار العالمي' : 'Global Innovation Link', desc: language === 'ar' ? 'ربط المبتكرين بالشبكات الدولية والشركاء الاستراتيجيين والأسواق العالمية' : 'Connecting innovators with international networks and global markets', link: 'https://qstp.qa/ar/global-innovation-link/', color: 'border-violet-500/30 bg-violet-900/20' },
                ].map((prog, i) => (
                  <Card key={i} className={`border ${prog.color}`}>
                    <CardContent className="p-5">
                      <div className="text-3xl mb-3">{prog.icon}</div>
                      <h3 className="text-white font-bold mb-2">{prog.title}</h3>
                      <p className="text-slate-300 text-xs leading-relaxed mb-4">{prog.desc}</p>
                      <a href={prog.link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full text-xs border-slate-600 text-slate-300 hover:bg-slate-700">
                          {language === 'ar' ? 'اعرف أكثر' : 'Learn More'} →
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
