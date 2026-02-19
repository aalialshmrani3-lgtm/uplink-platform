import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Lightbulb, Search, Filter, TrendingUp, 
  CheckCircle, Clock, XCircle, Eye, Star
} from 'lucide-react';
import { Link } from 'wouter';

export default function Naqla1BrowseIdeas() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [challengeFilter, setChallengeFilter] = useState<string>('all');
  
  // Fetch active challenges for filter
  const { data: challenges } = trpc.challenge.getActiveChallenges.useQuery();

  const { data: ideas, isLoading } = trpc.naqla1.ideas.browse.useQuery({
    search: searchQuery,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    challengeId: challengeFilter !== 'all' ? parseInt(challengeFilter) : undefined,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'needs_improvement':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-950/30 border-green-500/30';
      case 'pending':
        return 'text-yellow-500 bg-yellow-950/30 border-yellow-500/30';
      case 'needs_improvement':
        return 'text-red-500 bg-red-950/30 border-red-500/30';
      default:
        return 'text-gray-500 bg-gray-950/30 border-gray-500/30';
    }
  };

  const getInnovationLevelBadge = (score: number) => {
    if (score >= 80) return { label: 'عالي جداً', color: 'bg-purple-500' };
    if (score >= 60) return { label: 'عالي', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'متوسط', color: 'bg-yellow-500' };
    return { label: 'منخفض', color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">استعراض الأفكار</h1>
              <p className="text-slate-400">اكتشف الأفكار الابتكارية المقدمة في NAQLA 1</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              البحث والفلترة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="ابحث عن فكرة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="technology">تقنية</SelectItem>
                  <SelectItem value="health">صحة</SelectItem>
                  <SelectItem value="education">تعليم</SelectItem>
                  <SelectItem value="environment">بيئة</SelectItem>
                  <SelectItem value="finance">مالية</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="approved">موافق عليها</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="needs_improvement">تحتاج تحسين</SelectItem>
                </SelectContent>
              </Select>

              {/* Challenge Filter */}
              <Select value={challengeFilter} onValueChange={setChallengeFilter}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="التحدي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التحديات</SelectItem>
                  {challenges?.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id.toString()}>
                      {challenge.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ideas Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="text-slate-400 mt-4">جاري التحميل...</p>
          </div>
        ) : ideas && ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea: any) => {
              const innovationLevel = getInnovationLevelBadge(parseFloat(idea.innovationScore || '0'));
              return (
                <Link key={idea.id} href={`/naqla1/ideas/${idea.id}`}>
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${getStatusColor(idea.status)} border`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(idea.status)}
                            {idea.status === 'approved' ? 'موافق عليها' : 
                             idea.status === 'pending' ? 'قيد المراجعة' : 
                             'تحتاج تحسين'}
                          </span>
                        </Badge>
                        <Badge className={`${innovationLevel.color} text-white border-0`}>
                          <Star className="w-3 h-3 ml-1" />
                          {innovationLevel.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-xl group-hover:text-emerald-400 transition-colors">
                        {idea.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-2">
                        {idea.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Scores */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-lg bg-slate-800/50">
                            <p className="text-xs text-slate-400 mb-1">الابتكار</p>
                            <p className="text-lg font-bold text-emerald-400">
                              {parseFloat(idea.innovationScore || '0').toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-slate-800/50">
                            <p className="text-xs text-slate-400 mb-1">السوق</p>
                            <p className="text-lg font-bold text-blue-400">
                              {parseFloat(idea.marketScore || '0').toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-slate-800/50">
                            <p className="text-xs text-slate-400 mb-1">الجدوى</p>
                            <p className="text-lg font-bold text-purple-400">
                              {parseFloat(idea.feasibilityScore || '0').toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        {idea.tags && Array.isArray(idea.tags) && idea.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {idea.tags.slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs border-slate-700 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Eye className="w-4 h-4" />
                            <span>{idea.views || 0} مشاهدة</span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardContent className="py-12 text-center">
              <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">لا توجد أفكار مطابقة للفلاتر المحددة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
