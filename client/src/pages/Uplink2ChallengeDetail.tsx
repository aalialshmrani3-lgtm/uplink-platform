import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, DollarSign, Users, Target, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Uplink2ChallengeDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const challengeId = parseInt(params.id || "0");

  // Fetch challenge details
  const { data: challenge, isLoading: challengeLoading } = trpc.uplink2.challenges.getById.useQuery({ id: challengeId });

  // Fetch related ideas
  const { data: relatedIdeas, isLoading: ideasLoading } = trpc.uplink1.ideas.browse.useQuery({
    challengeId: challengeId,
  });

  if (challengeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">جاري تحميل تفاصيل التحدي...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">التحدي غير موجود</h2>
          <p className="text-gray-400 mb-6">عذراً، التحدي المطلوب غير موجود أو تم حذفه</p>
          <Button onClick={() => setLocation("/uplink2/challenges")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للتحديات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => setLocation("/uplink2/challenges")} 
            variant="ghost" 
            className="text-white hover:text-blue-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للتحديات
          </Button>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <Badge className="mb-3 bg-blue-600 text-white">{challenge.category}</Badge>
              <h1 className="text-4xl font-bold text-white mb-4">{challenge.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{challenge.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-gray-400 text-sm">قيمة الجائزة</p>
                  <p className="text-white text-xl font-bold">{challenge.prize ? Number(challenge.prize).toLocaleString() : '0'} ريال</p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">تاريخ الانتهاء</p>
                  <p className="text-white text-lg font-semibold">
                    {challenge.endDate ? new Date(challenge.endDate).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-gray-400 text-sm">عدد المشاركين</p>
                  <p className="text-white text-xl font-bold">{relatedIdeas?.length || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-cyan-500" />
                <div>
                  <p className="text-gray-400 text-sm">الحالة</p>
                  <Badge className={challenge.status === 'open' ? 'bg-green-600' : 'bg-gray-600'}>
                    {challenge.status === 'open' ? 'نشط' : 'منتهي'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Challenge Details */}
        <Card className="bg-slate-900/50 border-slate-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            تفاصيل التحدي
          </h2>
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </div>
          </div>
        </Card>

        {/* Related Ideas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            الأفكار المرتبطة بهذا التحدي ({relatedIdeas?.length || 0})
          </h2>

          {ideasLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-400">جاري تحميل الأفكار...</p>
            </div>
          ) : relatedIdeas && relatedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedIdeas.map((idea: any) => (
                <Card 
                  key={idea.id} 
                  className="bg-slate-900/50 border-slate-700 p-6 hover:border-blue-500 transition-all cursor-pointer"
                  onClick={() => setLocation(`/uplink1/ideas/${idea.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={
                      idea.status === 'approved' ? 'bg-green-600' :
                      idea.status === 'revision_needed' ? 'bg-yellow-600' :
                      'bg-gray-600'
                    }>
                      {idea.status === 'approved' ? 'موافق عليها' :
                       idea.status === 'revision_needed' ? 'تحتاج تحسين' :
                       'قيد المراجعة'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{idea.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">{idea.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {new Date(idea.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                      عرض التفاصيل
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700 p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">لا توجد أفكار مرتبطة بهذا التحدي بعد</h3>
              <p className="text-gray-400 mb-6">كن أول من يقدم حلاً مبتكراً لهذا التحدي!</p>
              <Button onClick={() => setLocation("/uplink1/submit")} className="bg-blue-600 hover:bg-blue-700">
                قدّم فكرتك الآن
              </Button>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">هل لديك حل مبتكر لهذا التحدي؟</h2>
          <p className="text-blue-100 mb-6">قدّم فكرتك الآن واحصل على فرصة للفوز بالجائزة!</p>
          <Button 
            onClick={() => setLocation("/uplink1/submit")} 
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3"
          >
            قدّم حلك الآن
          </Button>
        </Card>
      </div>
    </div>
  );
}
