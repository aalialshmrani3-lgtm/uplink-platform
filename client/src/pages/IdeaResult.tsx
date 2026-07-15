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
import { useLanguage } from "@/contexts/LanguageContext";

export default function IdeaResult() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
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
        title: isAr ? "✅ ممتاز! تم توجيه فكرتك إلى نقلة 2" : "✅ Excellent! Your idea has been routed to Naqla 2",
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
        title: isAr ? "❌ فشل التوجيه" : "❌ Routing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const routeToNaqla3 = trpc.naqla1.routeToNaqla3.useMutation({
    onSuccess: (data) => {
      toast({
        title: isAr ? "✅ ممتاز! تم توجيه فكرتك إلى نقلة 3" : "✅ Excellent! Your idea has been routed to Naqla 3",
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
        title: isAr ? "❌ فشل التوجيه" : "❌ Routing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const returnToSender = trpc.naqla1.returnToSender.useMutation({
    onSuccess: (data) => {
      toast({
        title: isAr ? "✅ تم إعادة الفكرة" : "✅ Idea Returned",
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
        title: isAr ? "❌ فشلت العملية" : "❌ Operation Failed",
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
        title: isAr ? "منصة ذكية لإدارة الموارد البشرية بالذكاء الاصطناعي" : "Smart HR Management Platform with AI",
        score: 78,
        classification: 'innovation',
        routingStatus: null,
      });
    }
  }, [idea, analysis, ideaId, isAr]);

  if (isLoading || !ideaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

  const isRouted = ideaData.routingStatus !== null;
  let routingMessage = '';
  if (ideaData.routingStatus === 'naqla2') {
    routingMessage = isAr ? 'تم توجيه فكرتك إلى نقلة 2' : 'Your idea has been routed to Naqla 2';
  } else if (ideaData.routingStatus === 'naqla3') {
    routingMessage = isAr ? 'تم توجيه فكرتك إلى نقلة 3' : 'Your idea has been routed to Naqla 3';
  } else if (ideaData.routingStatus === 'returned') {
    routingMessage = isAr ? 'تم إعادة الفكرة إليك مع التوصيات' : 'The idea has been returned to you with recommendations';
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
      title: isAr ? "ابتكار حقيقي" : "True Innovation",
      message: isAr ? "فكرتك تمتلك إمكانيات ابتكارية عالية وتستحق التطوير والاستثمار!" : "Your idea has high innovative potential and deserves development and investment!",
      icon: CheckCircle2,
      color: "from-green-400 to-emerald-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      emoji: "🚀",
    };
  } else if (ideaData.classification === 'commercial') {
    info = {
      title: isAr ? "مشروع تجاري" : "Commercial Project",
      message: isAr ? "فكرتك لديها إمكانيات تجارية جيدة وتحتاج إلى تطوير استراتيجي." : "Your idea has good commercial potential and needs strategic development.",
      icon: AlertCircle,
      color: "from-blue-400 to-cyan-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      emoji: "💼",
    };
  } else {
    info = {
      title: isAr ? "تحتاج تطوير" : "Needs Development",
      message: isAr ? "فكرتك تحتاج إلى مزيد من التطوير والتحسين لتصبح قابلة للتنفيذ." : "Your idea needs more development and improvement to become viable.",
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
        title={isAr ? "نتيجة الفكرة والتوجيه - NAQLA 5.0" : "Idea Result and Routing - NAQLA 5.0"}
        description={isAr ? "تحليل شامل لفكرتك وتوجيه للمسار المناسب" : "Comprehensive analysis of your idea and routing to the appropriate path"}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="container mx-auto max-w-4xl">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {isAr ? "نتيجة الفكرة والتوجيه" : "Idea Result and Routing"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isAr ? "تحليل شامل لفكرتك وتوجيه للمسار المناسب" : "Comprehensive analysis of your idea and routing to the appropriate path"}
            </p>
          </div>

          {/* بطاقة النتيجة */}
          <Card className="p-8 mb-8">
            {/* عنوان الفكرة */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isAr ? "عنوان فكرتك:" : "Your Idea Title:"}
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
                  {isAr ? "نتيجة التحليل" : "Analysis Result"}
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
                {isAr ? "الخطوة التالية:" : "Next Step:"}
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
                          title: isAr ? "✅ ممتاز! تم توجيه فكرتك إلى نقلة 2" : "✅ Excellent! Your idea has been routed to Naqla 2",
                          description: isAr ? "استكشف الخيارات المتاحة لك" : "Explore the available options for you",
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
                        {routeToNaqla2.isPending ? (isAr ? 'جاري التوجيه...' : 'Routing...') : (isAr ? 'وجّه إلى نقلة 2' : 'Route to Naqla 2')}
                      </span>
                    </div>
                    <span className="text-sm text-white/80">
                      {isAr ? "مطابقة مع التحديات والفعاليات" : "Match with challenges and events"}
                    </span>
                  </Button>

                  <Button 
                    onClick={() => {
                      if (ideaId) {
                        routeToNaqla3.mutate({ ideaId });
                      } else {
                        // فتح dialog مباشرة للصفحة التجريبية
                        toast({
                          title: isAr ? "✅ ممتاز! تم توجيه فكرتك إلى نقلة 3" : "✅ Excellent! Your idea has been routed to Naqla 3",
                          description: isAr ? "استكشف الخيارات المتاحة لك" : "Explore the available options for you",
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
                        {routeToNaqla3.isPending ? (isAr ? 'جاري التوجيه...' : 'Routing...') : (isAr ? 'وجّه إلى نقلة 3' : 'Route to Naqla 3')}
                      </span>
                    </div>
                    <span className="text-sm text-white/80">
                      {isAr ? "عرض في البورصة والسوق" : "Display in the exchange and market"}
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
                        title: isAr ? "تنبيه" : "Notice",
                        description: isAr ? "هذه صفحة تجريبية. يرجى تقديم فكرة حقيقية." : "This is a demo page. Please submit a real idea.",
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
                      {returnToSender.isPending ? (isAr ? 'جاري الإعادة...' : 'Returning...') : (isAr ? 'إعادة للمرسل مع التوصيات' : 'Return to sender with recommendations')}
                    </span>
                  </div>
                  <span className="text-sm text-white/80">
                    {isAr ? "تحسين الفكرة وإعادة التقديم" : "Improve the idea and resubmit"}
                  </span>
                </Button>
              )}
            </div>
          </Card>

          {/* زر العودة */}
          <div className="text-center">
            <Link href="/naqla1">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                {isAr ? "العودة إلى نقلة 1" : "Back to Naqla 1"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dialog لخيارات نقلة 2 */}
      <Dialog open={showNaqla2Dialog} onOpenChange={setShowNaqla2Dialog}>
        <DialogContent className="sm:max-w-[600px]" dir={isAr ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              {isAr ? "🎉 ممتاز! تم توجيه فكرتك إلى نقلة 2" : "🎉 Excellent! Your idea has been routed to Naqla 2"}
            </DialogTitle>
            <DialogDescription className="text-center text-lg mb-6">
              {isAr ? "يوجد التحديات والهاكاثونات والفعاليات التالية. هل ترغب في مطابقة فكرتك معها؟" : "There are the following challenges, hackathons, and events. Would you like to match your idea with them?"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Link href="/naqla2/challenges">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla2Dialog(false)}
              >
                <Target className="w-8 h-8" />
                <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                  <div className="text-xl font-bold">{isAr ? "مطابقة مع التحديات" : "Match with Challenges"}</div>
                  <div className="text-sm text-white/80">{isAr ? "استعرض التحديات المتاحة وطابق فكرتك معها" : "Browse available challenges and match your idea with them"}</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla2/hackathons">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla2Dialog(false)}
              >
                <Trophy className="w-8 h-8" />
                <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                  <div className="text-xl font-bold">{isAr ? "استعرض الهاكاثونات" : "Browse Hackathons"}</div>
                  <div className="text-sm text-white/80">{isAr ? "شارك في الهاكاثونات ذات الصلة بفكرتك" : "Participate in hackathons relevant to your idea"}</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla2/events">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla2Dialog(false)}
              >
                <Calendar className="w-8 h-8" />
                <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                  <div className="text-xl font-bold">{isAr ? "تصفح الفعاليات" : "Browse Events"}</div>
                  <div className="text-sm text-white/80">{isAr ? "اكتشف الفعاليات القادمة المتعلقة بمجالك" : "Discover upcoming events related to your field"}</div>
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
              {isAr ? "إغلاق" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog لخيارات نقلة 3 */}
      <Dialog open={showNaqla3Dialog} onOpenChange={setShowNaqla3Dialog}>
        <DialogContent className="sm:max-w-[600px]" dir={isAr ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              {isAr ? "🎉 ممتاز! تم توجيه فكرتك إلى نقلة 3" : "🎉 Excellent! Your idea has been routed to Naqla 3"}
            </DialogTitle>
            <DialogDescription className="text-center text-lg mb-6">
              {isAr ? "هل ترغب في عرض فكرتك في البورصة وإعدادها لدخول السوق؟" : "Would you like to display your idea on the exchange and prepare it for market entry?"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Link href="/naqla3/marketplace">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla3Dialog(false)}
              >
                <ShoppingCart className="w-8 h-8" />
                <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                  <div className="text-xl font-bold">{isAr ? "عرض في البورصة" : "Display on Exchange"}</div>
                  <div className="text-sm text-white/80">{isAr ? "عرض فكرتك للبيع في بورصة الأصول" : "Display your idea for sale on the asset exchange"}</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla3/sell-asset">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla3Dialog(false)}
              >
                <TrendingUp className="w-8 h-8" />
                <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                  <div className="text-xl font-bold">{isAr ? "إعداد لدخول السوق" : "Prepare for Market Entry"}</div>
                  <div className="text-sm text-white/80">{isAr ? "جهز فكرتك للبيع والتسويق" : "Prepare your idea for sale and marketing"}</div>
                </div>
              </Button>
            </Link>

            <Link href="/naqla3/marketplace">
              <Button 
                className="w-full h-auto py-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center gap-4 hover:scale-105 transition-transform"
                onClick={() => setShowNaqla3Dialog(false)}
              >
                <Package className="w-8 h-8" />
                <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                  <div className="text-xl font-bold">{isAr ? "استعرض الأصول المشابهة" : "Browse Similar Assets"}</div>
                  <div className="text-sm text-white/80">{isAr ? "اكتشف الأصول المشابهة في السوق" : "Discover similar assets in the market"}</div>
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
              {isAr ? "إغلاق" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}