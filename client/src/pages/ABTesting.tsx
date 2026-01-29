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

export default function ABTesting() {
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
      toast.success('تم إكمال A/B Testing بنجاح! تم اختيار النموذج الأفضل.');
      setIsRunning(false);
    },
    onError: (error) => {
      toast.error(`خطأ في A/B Testing: ${error.message}`);
      setIsRunning(false);
    },
  });

  const handleRunABTesting = () => {
    if (!stats || (stats.success + stats.failure) < 20) {
      toast.error('تحتاج إلى 20 فكرة مصنفة على الأقل لتشغيل A/B Testing');
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
        <h1 className="text-3xl font-bold mb-2">A/B Testing للنماذج</h1>
        <p className="text-muted-foreground">
          مقارنة أداء نماذج مختلفة واختيار الأفضل تلقائيًا
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          سيتم اختبار 3 نماذج مختلفة: <strong>XGBoost</strong>, <strong>Random Forest</strong>, و <strong>Neural Network</strong>.
          سيتم اختيار النموذج الأفضل بناءً على F1 Score وحفظه كنموذج رئيسي.
        </AlertDescription>
      </Alert>

      {/* Requirements Card */}
      <Card className={!canRunABTesting ? 'border-yellow-500' : 'border-green-500'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>متطلبات A/B Testing</CardTitle>
              <CardDescription>
                تحقق من توفر البيانات الكافية
              </CardDescription>
            </div>
            {canRunABTesting ? (
              <Badge variant="default" className="bg-green-600">
                ✅ جاهز
              </Badge>
            ) : (
              <Badge variant="default" className="bg-yellow-600">
                ⚠️ غير جاهز
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">الحد الأدنى: 20 فكرة مصنفة</span>
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
                ⚠️ تحتاج إلى {20 - (stats ? stats.success + stats.failure : 0)} فكرة إضافية لتشغيل A/B Testing
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
              <li>✓ دقة عالية</li>
              <li>✓ سريع في التدريب</li>
              <li>✓ يعمل جيدًا مع البيانات المحدودة</li>
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
              <li>✓ مقاوم للـ overfitting</li>
              <li>✓ يتعامل مع البيانات غير المتوازنة</li>
              <li>✓ Feature importance واضح</li>
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
              <li>✓ يتعلم علاقات معقدة</li>
              <li>✓ يتحسن مع البيانات الكبيرة</li>
              <li>✓ مرن وقابل للتخصيص</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Run A/B Testing */}
      <Card>
        <CardHeader>
          <CardTitle>تشغيل A/B Testing</CardTitle>
          <CardDescription>
            قد يستغرق الأمر عدة دقائق حسب حجم البيانات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">ماذا سيحدث؟</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>تدريب 3 نماذج مختلفة على نفس البيانات</li>
                <li>تقييم كل نموذج باستخدام Cross-Validation</li>
                <li>مقارنة الأداء (Accuracy, Precision, Recall, F1 Score)</li>
                <li>اختيار النموذج الأفضل تلقائيًا</li>
                <li>حفظ النموذج الفائز كنموذج رئيسي</li>
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
                ? 'جاري التشغيل... (قد يستغرق عدة دقائق)'
                : 'بدء A/B Testing'}
            </Button>

            {!canRunABTesting && (
              <p className="text-sm text-center text-muted-foreground">
                قم بتصنيف المزيد من الأفكار في{' '}
                <a href="/admin/idea-classification" className="text-primary underline">
                  صفحة التصنيف
                </a>{' '}
                لتفعيل A/B Testing
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <Card>
        <CardHeader>
          <CardTitle>عرض النتائج</CardTitle>
          <CardDescription>
            بعد إكمال A/B Testing، يمكنك مشاهدة النتائج التفصيلية
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
              عرض تحليلات الأداء
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              ستجد تقرير A/B Testing الكامل في ملف <code>training_report.md</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
