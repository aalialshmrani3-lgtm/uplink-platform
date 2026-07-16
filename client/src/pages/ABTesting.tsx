/**
 * A/B Testing Page (Admin Only)
 * Compare multiple ML models and select the best one
 */

import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FlaskConical, TrendingUp, Trophy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { useLanguage } from "@/contexts/LanguageContext";

export default function ABTesting() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isRunning, setIsRunning] = useState(false);

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  // Fetch data
  const { data: stats } = trpc.ideaOutcomes.getStats.useQuery();

  // A/B Testing mutation
  const abTestingMutation = trpc.ideaOutcomes.runABTesting.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إكمال A/B Testing بنجاح! تم اختيار النموذج الأفضل.' : 'A/B Testing completed successfully! Best model selected.');
      setIsRunning(false);
    },
    onError: (error) => {
      toast.error(isAr ? `خطأ في A/B Testing: ${error.message}` : `A/B Testing error: ${error.message}`);
      setIsRunning(false);
    },
  });

  const handleRunABTesting = () => {
    if (!stats || (stats.success + stats.failure) < 20) {
      toast.error(isAr ? 'تحتاج إلى 20 فكرة مصنفة على الأقل لتشغيل A/B Testing' : 'You need at least 20 classified ideas to run A/B Testing');
      return;
    }

    setIsRunning(true);
    abTestingMutation.mutate();
  };

  const canRunABTesting = stats && (stats.success + stats.failure) >= 20;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{isAr ? "A/B Testing للنماذج" : "Model A/B Testing"}</h1>
        <p className="text-muted-foreground">
          {isAr ? "مقارنة أداء نماذج مختلفة واختيار الأفضل تلقائيًا" : "Compare different model performances and auto-select the best"}
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isAr ? (
            <>سيتم اختبار 3 نماذج مختلفة: <strong>XGBoost</strong>, <strong>Random Forest</strong>, و <strong>Neural Network</strong>.
            سيتم اختيار النموذج الأفضل بناءً على F1 Score وحفظه كنموذج رئيسي.</>
          ) : (
            <>3 different models will be tested: <strong>XGBoost</strong>, <strong>Random Forest</strong>, and <strong>Neural Network</strong>.
            The best model will be selected based on F1 Score and saved as the main model.</>
          )}
        </AlertDescription>
      </Alert>

      {/* Requirements Card */}
      <Card className={!canRunABTesting ? 'border-yellow-500' : 'border-green-500'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isAr ? "متطلبات A/B Testing" : "A/B Testing Requirements"}</CardTitle>
              <CardDescription>
                {isAr ? "تحقق من توفر البيانات الكافية" : "Check for sufficient data availability"}
              </CardDescription>
            </div>
            {canRunABTesting ? (
              <Badge variant="default" className="bg-green-600">
                {isAr ? "✅ جاهز" : "✅ Ready"}
              </Badge>
            ) : (
              <Badge variant="default" className="bg-yellow-600">
                {isAr ? "⚠️ غير جاهز" : "⚠️ Not Ready"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{isAr ? "الحد الأدنى: 20 فكرة مصنفة" : "Minimum: 20 classified ideas"}</span>
                <span className="text-sm font-bold">
                  {stats ? stats.success + stats.failure : 0} / 20
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    canRunABTesting ? 'bg-green-600' : 'bg-yellow-600'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      stats ? ((stats.success + stats.failure) / 20) * 100 : 0
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            {!canRunABTesting && (
              <p className="text-sm text-muted-foreground">
                {isAr 
                  ? `⚠️ تحتاج إلى ${20 - (stats ? stats.success + stats.failure : 0)} فكرة إضافية لتشغيل A/B Testing`
                  : `⚠️ You need ${20 - (stats ? stats.success + stats.failure : 0)} more ideas to run A/B Testing`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Models Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-lg">XGBoost</CardTitle>
                <CardDescription className="text-xs">Gradient Boosting</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>{isAr ? "✓ دقة عالية" : "✓ High Accuracy"}</li>
              <li>{isAr ? "✓ سريع في التدريب" : "✓ Fast Training"}</li>
              <li>{isAr ? "✓ يعمل جيدًا مع البيانات المحدودة" : "✓ Good with Limited Data"}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <CardTitle className="text-lg">Random Forest</CardTitle>
                <CardDescription className="text-xs">Ensemble Learning</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>{isAr ? "✓ مقاوم للـ overfitting" : "✓ Overfitting Resistant"}</li>
              <li>{isAr ? "✓ يتعامل مع البيانات غير المتوازنة" : "✓ Handles Imbalanced Data"}</li>
              <li>{isAr ? "✓ Feature importance واضح" : "✓ Clear Feature Importance"}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle className="text-lg">Neural Network</CardTitle>
                <CardDescription className="text-xs">Deep Learning</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>{isAr ? "✓ يتعلم علاقات معقدة" : "✓ Learns Complex Relationships"}</li>
              <li>{isAr ? "✓ يتحسن مع البيانات الكبيرة" : "✓ Improves with Large Data"}</li>
              <li>{isAr ? "✓ مرن وقابل للتخصيص" : "✓ Flexible & Customizable"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Run A/B Testing */}
      <Card>
        <CardHeader>
          <CardTitle>{isAr ? "تشغيل A/B Testing" : "Run A/B Testing"}</CardTitle>
          <CardDescription>
            {isAr ? "قد يستغرق الأمر عدة دقائق حسب حجم البيانات" : "May take several minutes depending on data size"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">{isAr ? "ماذا سيحدث؟" : "What will happen?"}</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>{isAr ? "تدريب 3 نماذج مختلفة على نفس البيانات" : "Train 3 different models on the same data"}</li>
                <li>{isAr ? "تقييم كل نموذج باستخدام Cross-Validation" : "Evaluate each model using Cross-Validation"}</li>
                <li>{isAr ? "مقارنة الأداء (Accuracy, Precision, Recall, F1 Score)" : "Compare performance (Accuracy, Precision, Recall, F1 Score)"}</li>
                <li>{isAr ? "اختيار النموذج الأفضل تلقائيًا" : "Automatically select the best model"}</li>
                <li>{isAr ? "حفظ النموذج الفائز كنموذج رئيسي" : "Save the winning model as primary"}</li>
              </ol>
            </div>

            <Button
              onClick={handleRunABTesting}
              disabled={!canRunABTesting || isRunning || abTestingMutation.isPending}
              className="w-full"
              size="lg"
            >
              <FlaskConical className="w-5 h-5 mr-2" />
              {isRunning || abTestingMutation.isPending
                ? (isAr ? 'جاري التشغيل... (قد يستغرق عدة دقائق)' : 'Running... (may take several minutes)')
                : (isAr ? 'بدء A/B Testing' : 'Start A/B Testing')}
            </Button>

            {!canRunABTesting && (
              <p className="text-sm text-center text-muted-foreground">
                {isAr ? (
                  <>قم بتصنيف المزيد من الأفكار في{' '}
                  <a href="/admin/idea-classification" className="text-primary underline">
                    صفحة التصنيف
                  </a>{' '}
                  لتفعيل A/B Testing</>
                ) : (
                  <>Classify more ideas on the{' '}
                  <a href="/admin/idea-classification" className="text-primary underline">
                    classification page
                  </a>{' '}
                  to enable A/B Testing</>
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <Card>
        <CardHeader>
          <CardTitle>{isAr ? "عرض النتائج" : "View Results"}</CardTitle>
          <CardDescription>
            {isAr ? "بعد إكمال A/B Testing، يمكنك مشاهدة النتائج التفصيلية" : "After A/B Testing completes, you can view detailed results"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/admin/model-performance')}
              variant="outline"
              className="w-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isAr ? "عرض تحليلات الأداء" : "View Performance Analytics"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {isAr 
                ? <>ستجد تقرير A/B Testing الكامل في ملف <code>training_report.md</code></>
                : <>You will find the complete A/B Testing report in the <code>training_report.md</code> file</>}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}