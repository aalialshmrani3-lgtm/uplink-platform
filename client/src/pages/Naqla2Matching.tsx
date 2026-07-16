// Added for Flowchart Match - NAQLA2 Matching Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from "@/contexts/LanguageContext";
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
import TagFilter from '@/components/TagFilter';

export default function Naqla2Matching() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: matches, isLoading } = trpc.naqla2.matching.getMyMatches.useQuery(undefined, {
    enabled: !!user
  });

  const requestMutation = trpc.naqla2.matching.request.useMutation({
    onSuccess: (data) => {
      toast.success(isAr ? `تم العثور على ${data.matchesFound} مطابقة` : `Found ${data.matchesFound} matches`);
      setShowRequestForm(false);
    },
    onError: (error) => {
      toast.error(isAr ? 'فشل طلب المطابقة: ' + error.message : 'Matching request failed: ' + error.message);
    }
  });

  const acceptMutation = trpc.naqla2.matching.accept.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم قبول المطابقة' : 'Match accepted');
    },
    onError: (error) => {
      toast.error(isAr ? 'فشل قبول المطابقة: ' + error.message : 'Failed to accept match: ' + error.message);
    }
  });

  const rejectMutation = trpc.naqla2.matching.reject.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم رفض المطابقة' : 'Match rejected');
    },
    onError: (error) => {
      toast.error(isAr ? 'فشل رفض المطابقة: ' + error.message : 'Failed to reject match: ' + error.message);
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
    if (score >= 80) return isAr ? 'توافق ممتاز' : 'Excellent match';
    if (score >= 50) return isAr ? 'توافق جيد' : 'Good match';
    return isAr ? 'توافق ضعيف' : 'Weak match';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">{isAr ? "يجب تسجيل الدخول" : "Login Required"}</CardTitle>
            <CardDescription className="text-slate-400">
              {isAr ? "الرجاء تسجيل الدخول للوصول إلى نظام المطابقة الذكية" : "Please log in to access the Smart Matching system."}
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
                {isAr ? "المطابقة الذكية" : "Smart Matching"}
              </h1>
              <p className="text-slate-400 text-lg">
                {isAr ? "اعثر على الشركاء والمستثمرين المناسبين باستخدام الذكاء الاصطناعي" : "Find the right partners and investors using AI."}
              </p>
            </div>
            <Button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {isAr ? "طلب مطابقة جديد" : "New Match Request"}
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">{isAr ? "كيف يعمل؟" : "How it Works?"}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>{isAr ? "1. أدخل متطلباتك وتفضيلاتك" : "1. Enter your requirements & preferences"}</p>
              <p>{isAr ? "2. الذكاء الاصطناعي يحلل ويبحث" : "2. AI analyzes & searches"}</p>
              <p>{isAr ? "3. احصل على أفضل 10 مطابقات" : "3. Get top 10 matches"}</p>
              <p>{isAr ? "4. تواصل مع المطابقات المقبولة" : "4. Connect with accepted matches"}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">{isAr ? "معايير المطابقة" : "Matching Criteria"}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>{isAr ? "• تشابه علامات الذكاء الاصطناعي (40%)" : "• AI Tag Similarity (40%)"}</p>
              <p>{isAr ? "• توافق الصناعة (30%)" : "• Industry Compatibility (30%)"}</p>
              <p>{isAr ? "• توافق مستوى الابتكار (15%)" : "• Innovation Level Fit (15%)"}</p>
              <p>{isAr ? "• توافق الجدوى (15%)" : "• Feasibility Alignment (15%)"}</p>
              <p className="text-cyan-400 mt-2 text-xs">{isAr ? "✨ محسّن بالذكاء الاصطناعي" : "✨ AI-Enhanced"}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">ValidMatch</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p className="text-green-400 font-bold">{isAr ? "✓ نسبة ≥50%: مطابقة صالحة" : "✓ Score ≥50%: Valid Match"}</p>
              <p className="text-red-400 font-bold">{isAr ? "✗ نسبة <50%: مطابقة مرفوضة" : "✗ Score <50%: Rejected Match"}</p>
              <p className="mt-2">{isAr ? "يتم عرض المطابقات الصالحة فقط" : "Only valid matches are displayed."}</p>
            </CardContent>
          </Card>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">{isAr ? "طلب مطابقة جديد" : "New Match Request"}</CardTitle>
              <CardDescription className="text-slate-400">
                {isAr ? "املأ النموذج للحصول على أفضل المطابقات" : "Fill the form to get the best matches."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seekingType" className="text-white">{isAr ? "نوع الباحث عنه" : "Seeking Type"}</Label>
                    <Select name="seekingType" required>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder={isAr ? "اختر النوع" : "Select Type"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="investor">{isAr ? "مستثمر" : "Investor"}</SelectItem>
                        <SelectItem value="innovator">{isAr ? "مبتكر" : "Innovator"}</SelectItem>
                        <SelectItem value="partner">{isAr ? "شريك" : "Partner"}</SelectItem>
                        <SelectItem value="mentor">{isAr ? "مرشد" : "Mentor"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">{isAr ? "الصناعة" : "Industry"}</Label>
                    <Input
                      id="industry"
                      name="industry"
                      placeholder={isAr ? "مثال: التقنية، الصحة، التعليم" : "Ex: Tech, Health, Education"}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage" className="text-white">{isAr ? "المرحلة" : "Stage"}</Label>
                    <Input
                      id="stage"
                      name="stage"
                      placeholder={isAr ? "مثال: فكرة، نموذج أولي، نمو" : "Ex: Idea, Prototype, Growth"}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-white">{isAr ? "الميزانية (ريال)" : "Budget (SAR)"}</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="100000"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">{isAr ? "الموقع" : "Location"}</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder={isAr ? "مثال: الرياض، جدة" : "e.g., Riyadh, Jeddah"}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-white">{isAr ? "المتطلبات *" : "Requirements *"}</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    required
                    rows={4}
                    placeholder={isAr ? "اشرح متطلباتك بالتفصيل..." : "Describe your requirements in detail..."}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences" className="text-white">{isAr ? "التفضيلات (اختياري)" : "Preferences (optional)"}</Label>
                  <Textarea
                    id="preferences"
                    name="preferences"
                    rows={3}
                    placeholder={isAr ? "أي تفضيلات إضافية..." : "Any additional preferences..."}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={requestMutation.isPending}>
                    {requestMutation.isPending ? (isAr ? 'جاري البحث...' : 'Searching...') : (isAr ? 'ابحث عن مطابقات' : 'Search for matches')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Matches List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{isAr ? "مطابقاتي" : "My Matches"}</h2>
          </div>
          
          {/* Tag Filter */}
          <TagFilter
            availableTags={isAr ? [
              'تقنية', 'صحة', 'تعليم', 'طاقة', 'بيئة',
              'نقل', 'زراعة', 'تجزئة', 'تجارة', 'تصنيع',
              'AI', 'IoT', 'Blockchain', 'ذكاء اصطناعي', 'ابتكار'
            ] : [
              'Technology', 'Health', 'Education', 'Energy', 'Environment',
              'Transportation', 'Agriculture', 'Retail', 'Commerce', 'Manufacturing',
              'AI', 'IoT', 'Blockchain', 'Artificial Intelligence', 'Innovation'
            ]}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
          
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">{isAr ? "جاري التحميل..." : "Loading..."}</div>
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
                <p className="text-slate-400 mb-4">{isAr ? "لا توجد مطابقات حالياً" : "No matches found yet"}</p>
                <Button onClick={() => setShowRequestForm(true)}>
                  {isAr ? "ابدأ طلب مطابقة جديد" : "Start New Match Request"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}