import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Building2, TrendingUp, Lightbulb, Briefcase, BarChart3, Rocket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  ar: {
    title: "لوحة تحكم الجهات",
    subtitle: "إحصائيات تفصيلية حول مساهمات الجهات المشاركة",
    allOrganizations: "جميع الجهات",
    filterByType: "تصفية حسب النوع",
    filterByScope: "تصفية حسب النطاق",
    government: "حكومية",
    academic: "أكاديمية",
    private: "قطاع خاص",
    supporting: "داعمة",
    local: "محلية",
    global: "عالمية",
    totalIdeas: "إجمالي الأفكار",
    totalProjects: "إجمالي المشاريع",
    activeOrganizations: "جهات نشطة",
    avgIdeasPerOrg: "متوسط الأفكار لكل جهة",
    organizationName: "اسم الجهة",
    ideasCount: "عدد الأفكار",
    projectsCount: "عدد المشاريع",
    type: "النوع",
    scope: "النطاق",
    topContributors: "أكثر الجهات مساهمة",
    distributionByType: "التوزيع حسب النوع",
    contributionChart: "مخطط المساهمات",
    backToDashboard: "العودة إلى لوحة التحكم",
  },
  en: {
    title: "Organizations Dashboard",
    subtitle: "Detailed statistics on participating organizations' contributions",
    allOrganizations: "All Organizations",
    filterByType: "Filter by Type",
    filterByScope: "Filter by Scope",
    government: "Government",
    academic: "Academic",
    private: "Private",
    supporting: "Supporting",
    local: "Local",
    global: "Global",
    totalIdeas: "Total Ideas",
    totalProjects: "Total Projects",
    activeOrganizations: "Active Organizations",
    avgIdeasPerOrg: "Avg Ideas per Org",
    organizationName: "Organization Name",
    ideasCount: "Ideas Count",
    projectsCount: "Projects Count",
    type: "Type",
    scope: "Scope",
    topContributors: "Top Contributors",
    distributionByType: "Distribution by Type",
    contributionChart: "Contribution Chart",
    backToDashboard: "Back to Dashboard",
  },
};

const COLORS = {
  government: '#3b82f6',
  academic: '#a855f7',
  private: '#10b981',
  supporting: '#f97316',
};

export default function OrganizationsDashboard() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ar;

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');

  // Fetch organizations with stats
  const { data: organizations = [], isLoading } = trpc.organizations.getAllWithStats.useQuery();

  // Filter organizations
  const filteredOrgs = organizations.filter(org => {
    if (typeFilter !== 'all' && org.type !== typeFilter) return false;
    if (scopeFilter !== 'all' && org.scope !== scopeFilter) return false;
    return true;
  });

  // Calculate summary stats
  const totalIdeas = filteredOrgs.reduce((sum, org) => sum + (org.ideasCount || 0), 0);
  const totalProjects = filteredOrgs.reduce((sum, org) => sum + (org.projectsCount || 0), 0);
  const activeOrgs = filteredOrgs.filter(org => org.isActive).length;
  const avgIdeas = activeOrgs > 0 ? (totalIdeas / activeOrgs).toFixed(1) : '0';

  // Prepare chart data
  const topContributors = [...filteredOrgs]
    .sort((a, b) => ((b.ideasCount || 0) + (b.projectsCount || 0)) - ((a.ideasCount || 0) + (a.projectsCount || 0)))
    .slice(0, 10)
    .map(org => ({
      name: language === 'ar' ? org.nameAr : org.nameEn,
      ideas: org.ideasCount || 0,
      projects: org.projectsCount || 0,
    }));

  // Distribution by type
  const typeDistribution = [
    { name: t.government, value: filteredOrgs.filter(o => o.type === 'government').length, color: COLORS.government },
    { name: t.academic, value: filteredOrgs.filter(o => o.type === 'academic').length, color: COLORS.academic },
    { name: t.private, value: filteredOrgs.filter(o => o.type === 'private').length, color: COLORS.supporting },
    { name: t.supporting, value: filteredOrgs.filter(o => o.type === 'supporting').length, color: COLORS.supporting },
  ].filter(item => item.value > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
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
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              {t.backToDashboard}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder={t.filterByType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allOrganizations}</SelectItem>
              <SelectItem value="government">{t.government}</SelectItem>
              <SelectItem value="academic">{t.academic}</SelectItem>
              <SelectItem value="private">{t.private}</SelectItem>
              <SelectItem value="supporting">{t.supporting}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={scopeFilter} onValueChange={setScopeFilter}>
            <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder={t.filterByScope} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allOrganizations}</SelectItem>
              <SelectItem value="local">{t.local}</SelectItem>
              <SelectItem value="global">{t.global}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">{t.totalIdeas}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">{totalIdeas}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">{t.totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{totalProjects}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">{t.activeOrganizations}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{activeOrgs}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">{t.avgIdeasPerOrg}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{avgIdeas}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Contributors Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t.topContributors}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t.contributionChart}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topContributors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="ideas" fill="#06b6d4" name={t.ideasCount} />
                  <Bar dataKey="projects" fill="#10b981" name={t.projectsCount} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribution Pie Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t.distributionByType}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t.type}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.allOrganizations}</CardTitle>
            <CardDescription className="text-slate-400">
              {filteredOrgs.length} {t.activeOrganizations}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">{t.organizationName}</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">{t.type}</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">{t.scope}</th>
                    <th className="text-center py-3 px-4 text-slate-400 font-medium">{t.ideasCount}</th>
                    <th className="text-center py-3 px-4 text-slate-400 font-medium">{t.projectsCount}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white font-medium">{language === 'ar' ? org.nameAr : org.nameEn}</div>
                          <div className="text-slate-400 text-sm">{language === 'ar' ? org.nameEn : org.nameAr}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          org.type === 'government' ? 'bg-blue-500/20 text-blue-400' :
                          org.type === 'academic' ? 'bg-purple-500/20 text-purple-400' :
                          org.type === 'private' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {t[org.type as keyof typeof t] || org.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 text-sm">
                          {t[org.scope as keyof typeof t] || org.scope}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-white font-medium">{org.ideasCount || 0}</td>
                      <td className="py-3 px-4 text-center text-white font-medium">{org.projectsCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
