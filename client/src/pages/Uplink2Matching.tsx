// Added for Flowchart Match - UPLINK2 Matching Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, TrendingUp, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import MatchCard from '@/components/MatchCard';

export default function Uplink2Matching() {
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { data: matches, isLoading } = trpc.uplink2.matching.getMyMatches.useQuery(undefined, {
    enabled: !!user
  });

  const requestMutation = trpc.uplink2.matching.request.useMutation({
    onSuccess: (data) => {
      toast.success(`تم العثور على ${data.matchesFound} مطابقة`);
      setShowRequestForm(false);
    },
    onError: (error) => {
      toast.error('فشل طلب المطابقة: ' + error.message);
    }
  });

  const acceptMutation = trpc.uplink2.matching.accept.useMutation({
    onSuccess: () => {
      toast.success('تم قبول المطابقة');
    },
    onError: (error) => {
      toast.error('فشل قبول المطابقة: ' + error.message);
    }
  });

  const rejectMutation = trpc.uplink2.matching.reject.useMutation({
    onSuccess: () => {
      toast.success('تم رفض المطابقة');
    },
    onError: (error) => {
      toast.error('فشل رفض المطابقة: ' + error.message);
    }
  });

  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    requestMutation.mutate({
      seekingType: formData.get('seekingType') as any,
      industry: formData.get('industry') as string,
      stage: formData.get('stage') as string,
      budget: parseFloat(formData.get('budget') as string) || undefined,
      location: formData.get('location') as string,
      requirements: formData.get('requirements') as string,
      preferences: formData.get('preferences') as string,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'توافق ممتاز';
    if (score >= 50) return 'توافق جيد';
    return 'توافق ضعيف';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">يجب تسجيل الدخول</CardTitle>
            <CardDescription className="text-slate-400">
              الرجاء تسجيل الدخول للوصول إلى نظام المطابقة الذكية
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-cyan-400" />
                المطابقة الذكية
              </h1>
              <p className="text-slate-400 text-lg">
                اعثر على الشركاء والمستثمرين المناسبين باستخدام الذكاء الاصطناعي
              </p>
            </div>
            <Button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              طلب مطابقة جديد
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">كيف يعمل؟</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>1. أدخل متطلباتك وتفضيلاتك</p>
              <p>2. الذكاء الاصطناعي يحلل ويبحث</p>
              <p>3. احصل على أفضل 10 مطابقات</p>
              <p>4. تواصل مع المطابقات المقبولة</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">معايير المطابقة</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>• تشابه علامات الذكاء الاصطناعي (40%)</p>
              <p>• توافق الصناعة (30%)</p>
              <p>• توافق مستوى الابتكار (15%)</p>
              <p>• توافق الجدوى (15%)</p>
              <p className="text-cyan-400 mt-2 text-xs">✨ محسّن بالذكاء الاصطناعي</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">ValidMatch</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p className="text-green-400 font-bold">✓ نسبة ≥50%: مطابقة صالحة</p>
              <p className="text-red-400 font-bold">✗ نسبة &lt;50%: مطابقة مرفوضة</p>
              <p className="mt-2">يتم عرض المطابقات الصالحة فقط</p>
            </CardContent>
          </Card>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">طلب مطابقة جديد</CardTitle>
              <CardDescription className="text-slate-400">
                املأ النموذج للحصول على أفضل المطابقات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seekingType" className="text-white">نوع الباحث عنه</Label>
                    <Select name="seekingType" required>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="investor">مستثمر</SelectItem>
                        <SelectItem value="innovator">مبتكر</SelectItem>
                        <SelectItem value="partner">شريك</SelectItem>
                        <SelectItem value="mentor">مرشد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">الصناعة</Label>
                    <Input
                      id="industry"
                      name="industry"
                      placeholder="مثال: التقنية، الصحة، التعليم"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage" className="text-white">المرحلة</Label>
                    <Input
                      id="stage"
                      name="stage"
                      placeholder="مثال: فكرة، نموذج أولي، نمو"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-white">الميزانية (ريال)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="100000"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">الموقع</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="مثال: الرياض، جدة"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-white">المتطلبات *</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    required
                    rows={4}
                    placeholder="اشرح متطلباتك بالتفصيل..."
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences" className="text-white">التفضيلات (اختياري)</Label>
                  <Textarea
                    id="preferences"
                    name="preferences"
                    rows={3}
                    placeholder="أي تفضيلات إضافية..."
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={requestMutation.isPending}>
                    {requestMutation.isPending ? 'جاري البحث...' : 'ابحث عن مطابقات'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Matches List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">مطابقاتي</h2>
          
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">جاري التحميل...</div>
          ) : matches && matches.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {matches.flatMap((request: any) => 
                request.matches?.map((match: any) => (
                  <MatchCard
                    key={match.matchId}
                    match={{
                      matchId: match.matchId,
                      userId: match.userId,
                      userName: match.userName,
                      score: match.score,
                      reasons: match.reasons || [],
                      aiTags: match.aiTags || [],
                      status: match.status || 'pending',
                    }}
                    onAccept={(matchId) => acceptMutation.mutate({ matchId })}
                    onReject={(matchId) => rejectMutation.mutate({ matchId })}
                  />
                )) || []
              )}
            </div>
          ) : (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardContent className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 mb-4">لا توجد مطابقات حالياً</p>
                <Button onClick={() => setShowRequestForm(true)}>
                  ابدأ طلب مطابقة جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
