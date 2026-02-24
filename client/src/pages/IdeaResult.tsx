import { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, RefreshCw, Target, Calendar, Trophy, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function IdeaResult() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams();
  const ideaId = params.ideaId ? parseInt(params.ideaId) : null;

  const [ideaData, setIdeaData] = useState<{
    id: number;
    title: string;
    score: number;
    classification: 'innovation' | 'commercial' | 'weak';
    routingStatus: 'naqla2' | 'naqla3' | 'returned' | null;
  } | null>(null);

  const [showNaqla2Dialog, setShowNaqla2Dialog] = useState(false);
  const [showNaqla3Dialog, setShowNaqla3Dialog] = useState(false);

  // جلب بيانات الفكرة من الخادم
  const { data: idea, isLoading } = trpc.naqla1.getIdeaById.useQuery(
    { ideaId: ideaId! },
    { enabled: !!ideaId }
  );

  const { data: analysis } = trpc.naqla1.getAnalysisResult.useQuery(
    { ideaId: ideaId! },
    { enabled: !!ideaId }
  );

  // Mutations للتوجيه
  const routeToNaqla2 = trpc.naqla1.routeToNaqla2.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ ممتاز! تم توجيه فكرتك إلى نقلة 2",
        description: data.message,
        variant: "default",
      });
      // تحديث الحالة المحلية
      if (ideaData) {
        setIdeaData({ ...ideaData, routingStatus: 'naqla2' });
      }
      // عرض dialog الخيارات
      setShowNaqla2Dialog(true);
    },
    onError: (error) => {
      toast({
        title: "❌ فشل التوجيه",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const routeToNaqla3 = trpc.naqla1.routeToNaqla3.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ ممتاز! تم توجيه فكرتك إلى نقلة 3",
        description: data.message,
        variant: "default",
      });
      // تحديث الحالة المحلية
      if (ideaData) {
        setIdeaData({ ...ideaData, routingStatus: 'naqla3' });
      }
      // عرض dialog الخيارات
      setShowNaqla3Dialog(true);
    },
    onError: (error) => {
      toast({
        title: "❌ فشل التوجيه",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const returnToSender = trpc.naqla1.returnToSender.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ تم إعادة الفكرة",
        description: data.message,
        variant: "default",
      });
      // تحديث الحالة المحلية
      if (ideaData) {
        setIdeaData({ ...ideaData, routingStatus: 'returned' });
      }
    },
    onError: (error) => {
      toast({
        title: "❌ فشلت العملية",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (idea && analysis) {
      // تحديد التصنيف بناءً على النتيجة
      let classification: 'innovation' | 'commercial' | 'weak' = 'weak';
      const score = Number(analysis.overallScore);
      if (score >= 70) {
        classification = 'innovation';
      } else if (score >= 50) {
        classification = 'commercial';
      }

      setIdeaData({
        id: idea.id,
        title: idea.title,
        score: Number(analysis.overallScore),
        classification,
        routingStatus: idea.routingStatus as 'naqla2' | 'naqla3' | 'returned' | null,
      });
    } else if (!ideaId) {
      // بيانات تجريبية إذا لم يكن هناك ideaId
      setIdeaData({
        id: 0,
        title: "منصة ذكية لإدارة الموارد البشرية بالذكاء الاصطناعي",
        score: 78,
        classification: 'innovation',
        routingStatus: null,
      });
    }
  }, [idea, analysis, ideaId]);

  if (isLoading || !ideaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  const isRouted = ideaData.routingStatus !== null;
  let routingMessage = '';
  if (ideaData.routingStatus === 'naqla2') {
    routingMessage = 'تم توجيه فكرتك إلى نقلة 2';
  } else if (ideaData.routingStatus === 'naqla3') {
    routingMessage = 'تم توجيه فكرتك إلى نقلة 3';
  } else if (ideaData.routingStatus === 'returned') {
    routingMessage = 'تم إعادة الفكرة إليك مع التوصيات';
  }

  // تحديد معلومات العرض بناءً على التصنيف
  let info: {
    title: string;
    message: string;
    icon: typeof CheckCircle2;
    color: string;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    emoji: string;
  };

  if (ideaData.classification === 'innovation') {
    info = {
      title: "ابتكار حقيقي",
      message: "فكرتك تمتلك إمكانيات ابتكارية عالية وتستحق التطوير والاستثمار!",
      icon: CheckCircle2,
      color: "from-green-400 to-emerald-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      emoji: "🚀",
    };
  } else if (ideaData.classification === 'commercial') {
    info = {
      title: "مشروع تجاري",
      message: "فكرتك لديها إمكانيات تجارية جيدة وتحتاج إلى تطوير استراتيجي.",
      icon: AlertCircle,
      color: "from-blue-400 to-cyan-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      emoji: "💼",
    };
  } else {
    info = {
      title: "تحتاج تطوير",
      message: "فكرتك تحتاج إلى مزيد من التطوير والتحسين لتصبح قابلة للتنفيذ.",
      icon: XCircle,
      color: "from-orange-400 to-red-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
      emoji: "⚠️",
    };
  }

  const Icon = info.icon;

  return (
    <>
      <SEOHead 
        title="نتيجة الفكرة والتوجيه - NAQLA 5.0"
        description="تحليل شامل لفكرتك وتوجيه للمسار المناسب"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4" dir="rtl">
        <div className="container mx-auto max-w-4xl">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              نتيجة الفكرة والتوجيه
            </h1>
            <p className="text-muted-foreground text-lg">
              تحليل شامل لفكرتك وتوجيه للمسار المناسب
            </p>
          </div>

          {/* بطاقة النتيجة */}
          <Card className="p-8 mb-8">
            {/* عنوان الفكرة */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                عنوان فكرتك:
              </h2>
              <p className="text-xl text-muted-foreground">
                {ideaData.title}
              </p>
            </div>

            {/* النسبة المئوية */}
            <div className="mb-8 text-center">
              <div className="inline-block">
                <div className={`text-7xl font-bold bg-gradient-to-r ${info.color} bg-clip-text text-transparent mb-2`}>
                  {ideaData.score}%
                </div>
                <p className="text-sm text-muted-foreground">
                  نتيجة التحليل
                </p>
              </div>
            </div>

            {/* التصنيف */}
            <div className={`${info.bgColor} border ${info.borderColor} rounded-lg p-6 mb-8`}>
              <div className="flex items-start gap-4">
                <Icon className={`w-8 h-8 ${info.iconColor} flex-shrink-0 mt-1`} />
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {info.title} {info.emoji}
                  </h3>
                  <p className="text-muted-foreground">
                    {info.message}
                  </p>
                </div>
              </div>
            </div>

            {/* رسالة التوجيه إذا تم التوجيه */}
            {isRouted && (
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-center font-semibold">
                  ✅ {routingMessage}
                </p>
              </div>
            )}

            {/* الخيارات */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                الخطوة التالية:
              </h3>

              {ideaData.score >= 50 ? (
                // خيارات للابتكار والتجاري
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => {
                      if (ideaId) {
                        routeToNaqla2.mutate({ ideaId });
                      } else {
                        // فتح dialog مباشرة للصفحة التجريبية
                        toast({
                          title: "✅ ممتاز! تم توجيه فكرتك إلى نقلة 2",
                          description: "استكشف الخيارات المتاحة لك",
                          variant: "default",
                        });
                        setShowNaqla2Dialog(true);
                      }
                    }}
                    disabled={isRouted || routeToNaqla2.isPending}
                    className="w-full h-auto py-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-6 h-6" />
                      <span className="text-xl font-bold">
                        {routeToNaqla2.isPending ? 'جاري التوجيه...' : 'وجّه إلى نقلة 2'}
                      </span>
                    </div>
                    <span className="text-sm text-white/80">
                      مطابقة مع التحديات والفعاليات
                    </span>
                  </Button>

                  <Button 
                    onClick={() => {
                      if (ideaId) {
                        routeToNaqla3.mutate({ ideaId });
                      } else {
                        // فتح dialog مباشرة للصفحة التجريبية
                        toast({
                          title: "✅ ممتاز! تم توجيه فكرتك إلى نقلة 3",
                          description: "استكشف الخيارات المتاحة لك",
                          variant: "default",
                        });
                        setShowNaqla3Dialog(true);
                      }
                    }}
                    disabled={isRouted || routeToNaqla3.isPending}
                    className="w-full h-auto py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-6 h-6" />
                      <span className="text-xl font-bold">
                        {routeToNaqla3.isPending ? 'جاري التوجيه...' : 'وجّه إلى نقلة 3'}
                      </span>
                    </div>
                    <span className="text-sm text-white/80">
                      عرض في البورصة والسوق
                    </span>
                  </Button>
                </div>
              ) : (
                // خيار للأفكار الضعيفة
                <Button 
                  onClick={() => {
                    if (ideaId) {
                      returnToSender.mutate({ ideaId });
                    } else {
                      toast({
                        title: "تنبيه",
                        description: "هذه صفحة تجريبية. يرجى تقديم فكرة حقيقية.",
                        variant: "default",
                      });
                    }
                  }}
                  disabled={isRouted || returnToSender.isPending}
                  className="w-full h-auto py-6 bg-gradient-to-r from-orange-500 to-red-600 text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-6 h-6" />
                    <span className="text-xl font-bold">
                      {returnToSender.isPending ? 'جاري الإعادة...' : 'إعادة للمرسل مع التوصيات'}
                    </span>
                  </div>
                  <span className="text-sm text-white/80">
                    تحسين الفكرة وإعادة التقديم
                  </span>
                </Button>
              )}
            </div>
          </Card>

          {/* زر العودة */}
          <div className="text-center">
            <Link href="/naqla1">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                العودة إلى نقلة 1
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dialog لخيارات نقلة 2 */}
      <Dialog open={showNaqla2Dialog} onOpenChange={setShowNaqla2Dialog}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              🎉 ممتاز! تم توجيه فكرتك إلى نقلة 2
            </DialogTitle>
            <DialogDescription className="text-center text-lg mb-6">
              يوجد التحديات والهاكاثونات والفعاليات التالية. هل ترغب في مطابقة فكرتك معها؟
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Link href="/naqla2/challenges">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla2Dialog(false)}
              >
                <Target className="w-8 h-8" />
                <div className="text-right flex-1">
                  <div className="text-xl font-bold">مطابقة مع التحديات</div>
                  <div className="text-sm text-white/80">استعرض التحديات المتاحة وطابق فكرتك معها</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla2/hackathons">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla2Dialog(false)}
              >
                <Trophy className="w-8 h-8" />
                <div className="text-right flex-1">
                  <div className="text-xl font-bold">استعرض الهاكاثونات</div>
                  <div className="text-sm text-white/80">شارك في الهاكاثونات ذات الصلة بفكرتك</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla2/events">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla2Dialog(false)}
              >
                <Calendar className="w-8 h-8" />
                <div className="text-right flex-1">
                  <div className="text-xl font-bold">تصفح الفعاليات</div>
                  <div className="text-sm text-white/80">اكتشف الفعاليات القادمة المتعلقة بمجالك</div>
                </div>
              </Button>
            </Link>
          </div>

          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowNaqla2Dialog(false)}
              className="w-full"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog لخيارات نقلة 3 */}
      <Dialog open={showNaqla3Dialog} onOpenChange={setShowNaqla3Dialog}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              🎉 ممتاز! تم توجيه فكرتك إلى نقلة 3
            </DialogTitle>
            <DialogDescription className="text-center text-lg mb-6">
              هل ترغب في عرض فكرتك في البورصة وإعدادها لدخول السوق؟
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Link href="/naqla3/marketplace">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla3Dialog(false)}
              >
                <ShoppingCart className="w-8 h-8" />
                <div className="text-right flex-1">
                  <div className="text-xl font-bold">عرض في البورصة</div>
                  <div className="text-sm text-white/80">عرض فكرتك للبيع في بورصة الأصول</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla3/sell-asset">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla3Dialog(false)}
              >
                <TrendingUp className="w-8 h-8" />
                <div className="text-right flex-1">
                  <div className="text-xl font-bold">إعداد لدخول السوق</div>
                  <div className="text-sm text-white/80">جهز فكرتك للبيع والتسويق</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla3/marketplace">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla3Dialog(false)}
              >
                <Package className="w-8 h-8" />
                <div className="text-right flex-1">
                  <div className="text-xl font-bold">استعرض الأصول المشابهة</div>
                  <div className="text-sm text-white/80">اكتشف الأصول المشابهة في السوق</div>
                </div>
              </Button>
            </Link>
          </div>

          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowNaqla3Dialog(false)}
              className="w-full"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
