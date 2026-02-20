import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

export default function IdeaResult() {
  const [, setLocation] = useLocation();
  const [ideaData, setIdeaData] = useState<{
    title: string;
    score: number;
    classification: 'innovation' | 'commercial' | 'weak';
  } | null>(null);

  useEffect(() => {
    // محاكاة بيانات الفكرة (في الواقع ستأتي من الـ state أو الـ API)
    // يمكن استخدام query parameters أو state من React Router
    const mockData = {
      title: 'تطبيق ذكي لإدارة المشاريع',
      score: 75,
      classification: 'innovation' as const
    };
    setIdeaData(mockData);
  }, []);

  if (!ideaData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل النتيجة...</p>
        </div>
      </div>
    );
  }

  const getClassificationInfo = () => {
    if (ideaData.score >= 70) {
      return {
        icon: CheckCircle2,
        title: 'مبروك! فكرتك ابتكار',
        emoji: '🎉',
        color: 'from-purple-500 to-pink-600',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        iconColor: 'text-purple-400',
        message: `فكرتك حصلت على تقييم ${ideaData.score}% وتصنف كابتكار حقيقي`
      };
    } else if (ideaData.score >= 50) {
      return {
        icon: AlertCircle,
        title: 'مبروك! فكرتك حل تجاري',
        emoji: '💼',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        iconColor: 'text-blue-400',
        message: `فكرتك حصلت على تقييم ${ideaData.score}% وتصنف كحل تجاري قوي`
      };
    } else {
      return {
        icon: XCircle,
        title: 'فكرتك بحاجة إلى إعادة دراسة وتوجيه',
        emoji: '📝',
        color: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        iconColor: 'text-orange-400',
        message: `فكرتك حصلت على تقييم ${ideaData.score}% وتحتاج إلى تطوير`
      };
    }
  };

  const info = getClassificationInfo();
  const Icon = info.icon;

  return (
    <>
      <SEOHead 
        title="نتيجة الفكرة والتوجيه | NAQLA 5.0"
        description="نتيجة تحليل فكرتك والتوجيه للمسار المناسب"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
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

              {/* الخيارات */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  الخطوة التالية:
                </h3>

                {ideaData.score >= 50 ? (
                  // خيارات للابتكار والتجاري
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/naqla2">
                      <Button 
                        className="w-full h-auto py-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-6 h-6" />
                          <span className="text-xl font-bold">NAQLA 2</span>
                        </div>
                        <span className="text-sm text-white/80">
                          مطابقة مع التحديات والفعاليات
                        </span>
                      </Button>
                    </Link>

                    <Link href="/naqla3">
                      <Button 
                        className="w-full h-auto py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-6 h-6" />
                          <span className="text-xl font-bold">NAQLA 3</span>
                        </div>
                        <span className="text-sm text-white/80">
                          الذهاب مباشرة إلى سوق الابتكارات
                        </span>
                      </Button>
                    </Link>
                  </div>
                ) : (
                  // خيار للضعيفة
                  <div className="space-y-4">
                    <Link href="/naqla1/submit">
                      <Button 
                        className="w-full h-auto py-6 bg-gradient-to-r from-orange-500 to-red-600 text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                      >
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-6 h-6" />
                          <span className="text-xl font-bold">إعادة للمرسل</span>
                        </div>
                        <span className="text-sm text-white/80">
                          إعادة تقديم الفكرة بعد التحسين
                        </span>
                      </Button>
                    </Link>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        أو احصل على استشارة لتطوير فكرتك
                      </p>
                      <Link href="/contact">
                        <Button variant="outline" className="w-full md:w-auto">
                          تواصل مع الخبراء
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* رابط العودة */}
            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
