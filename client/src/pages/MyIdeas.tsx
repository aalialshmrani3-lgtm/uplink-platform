import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';

export default function MyIdeas() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // TODO: Replace with real tRPC query
  const { data: ideas, isLoading } = trpc.uplink1.getMyIdeas.useQuery(undefined, {
    enabled: !!user,
  });

  const filteredIdeas = ideas?.filter((idea: any) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && idea.status === 'pending';
    if (activeTab === 'approved') return matchesSearch && idea.status === 'approved';
    if (activeTab === 'rejected') return matchesSearch && idea.status === 'rejected';
    if (activeTab === 'uplink2') return matchesSearch && idea.status === 'in_uplink2';
    if (activeTab === 'uplink3') return matchesSearch && idea.status === 'in_uplink3';
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          قيد المراجعة
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          مقبولة
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          مرفوضة
        </Badge>;
      case 'in_uplink2':
        return <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
          <Target className="w-3 h-3 mr-1" />
          في UPLINK2
        </Badge>;
      case 'in_uplink3':
        return <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300">
          <Rocket className="w-3 h-3 mr-1" />
          في UPLINK3
        </Badge>;
      default:
        return null;
    }
  };

  const getInnovationScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
        <Sparkles className="w-3 h-3 mr-1" />
        ممتاز ({score}%)
      </Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <TrendingUp className="w-3 h-3 mr-1" />
        جيد جداً ({score}%)
      </Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
        جيد ({score}%)
      </Badge>;
    } else {
      return <Badge variant="outline" className="bg-slate-700/50 border-slate-600">
        يحتاج تطوير ({score}%)
      </Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">أفكاري</h1>
              <p className="text-slate-400">تتبع جميع الأفكار المرسلة ونتائج التحليل</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="ابحث في أفكارك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              الكل ({ideas?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">
              قيد المراجعة
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">
              مقبولة
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
              مرفوضة
            </TabsTrigger>
            <TabsTrigger value="uplink2" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              UPLINK2
            </TabsTrigger>
            <TabsTrigger value="uplink3" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              UPLINK3
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">جاري التحميل...</div>
            ) : filteredIdeas && filteredIdeas.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredIdeas.map((idea: any) => (
                  <Card key={idea.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-white text-xl mb-2">{idea.title}</CardTitle>
                          <CardDescription className="text-slate-400 line-clamp-2">
                            {idea.description}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(idea.status)}
                          {idea.aiAnalysis && getInnovationScoreBadge(idea.aiAnalysis.innovationScore)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* AI Analysis Results */}
                      {idea.aiAnalysis && (
                        <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                          <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            نتائج التحليل بالذكاء الاصطناعي
                          </h4>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-slate-400 mb-1">الابتكار</div>
                              <div className="text-lg font-bold text-white">{idea.aiAnalysis.innovationScore}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 mb-1">الجدوى</div>
                              <div className="text-lg font-bold text-white">{idea.aiAnalysis.feasibilityScore}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 mb-1">السوق</div>
                              <div className="text-lg font-bold text-white">{idea.aiAnalysis.marketPotential}%</div>
                            </div>
                          </div>

                          {/* Tags */}
                          {idea.aiAnalysis.tags && idea.aiAnalysis.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {idea.aiAnalysis.tags.map((tag: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Recommendations */}
                          {idea.aiAnalysis.recommendations && (
                            <div className="text-sm text-slate-300">
                              <div className="font-semibold text-cyan-300 mb-1">التوصيات:</div>
                              <p className="text-slate-400">{idea.aiAnalysis.recommendations}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700"
                          onClick={() => toast.info('عرض التفاصيل - قريباً')}
                        >
                          عرض التفاصيل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700"
                          onClick={() => toast.info('تعديل - قريباً')}
                        >
                          تعديل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">لا توجد أفكار في هذا القسم</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
