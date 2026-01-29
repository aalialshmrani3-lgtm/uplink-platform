/**
 * Model Performance Analytics Page (Admin Only)
 * Displays ML model metrics, predictions vs actual outcomes, and feature importance
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Target, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ModelPerformance() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [modelMetrics, setModelMetrics] = useState<any>(null);

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  // Fetch data
  const { data: stats } = trpc.ideaOutcomes.getStats.useQuery();
  const { data: trainingData } = trpc.ideaOutcomes.getTrainingData.useQuery();

  // Load model metrics from file (in production, this would be an API endpoint)
  useEffect(() => {
    // Mock metrics for demonstration
    setModelMetrics({
      version_id: 'v150_20260129',
      timestamp: '20260129_160000',
      training_samples: 150,
      metrics: {
        accuracy: 1.0,
        precision: 1.0,
        recall: 1.0,
        f1_score: 1.0,
        cv_mean: 0.98,
        cv_std: 0.02,
        confusion_matrix: [[75, 0], [0, 75]],
      },
      feature_names: [
        'budget', 'team_size', 'timeline_months', 'market_demand',
        'technical_feasibility', 'competitive_advantage', 'user_engagement',
        'tags_count', 'hypothesis_validation_rate', 'rat_completion_rate',
        'title_length', 'description_length'
      ]
    });
  }, []);

  // Calculate prediction accuracy (comparing predictions vs actual outcomes)
  const calculatePredictionAccuracy = () => {
    if (!trainingData || trainingData.length === 0) return null;

    let correct = 0;
    let total = 0;

    trainingData.forEach((sample: any) => {
      // Assume prediction is correct if success rate > 0.5 and actual is success
      // or success rate < 0.5 and actual is failure
      const predicted = sample.success_rate > 0.5 ? 1 : 0;
      const actual = sample.success;
      
      if (predicted === actual) correct++;
      total++;
    });

    return total > 0 ? (correct / total) * 100 : 0;
  };

  const predictionAccuracy = calculatePredictionAccuracy();

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">تحليلات أداء النموذج</h1>
        <p className="text-muted-foreground">
          مقاييس الدقة، مقارنة التنبؤات بالنتائج الفعلية، وأهمية الميزات
        </p>
      </div>

      {/* Model Info Card */}
      {modelMetrics && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">النموذج الحالي</CardTitle>
                <CardDescription>XGBoost Classifier</CardDescription>
              </div>
              <Badge variant="default" className="bg-blue-600">
                {modelMetrics.version_id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">عدد العينات:</span>
                <p className="font-semibold text-lg">{modelMetrics.training_samples}</p>
              </div>
              <div>
                <span className="text-muted-foreground">عدد الميزات:</span>
                <p className="font-semibold text-lg">{modelMetrics.feature_names.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">تاريخ التدريب:</span>
                <p className="font-medium">
                  {new Date(modelMetrics.timestamp.slice(0, 8)).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">الخوارزمية:</span>
                <p className="font-medium">XGBoost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {modelMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(modelMetrics.metrics.accuracy * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                دقة التصنيف الإجمالية
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precision</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(modelMetrics.metrics.precision * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                دقة التنبؤات الإيجابية
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recall</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {(modelMetrics.metrics.recall * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                نسبة اكتشاف الحالات الإيجابية
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {(modelMetrics.metrics.f1_score * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                المتوسط التوافقي
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cross-Validation Results */}
      {modelMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج التحقق المتقاطع (Cross-Validation)</CardTitle>
            <CardDescription>
              تقييم أداء النموذج على مجموعات بيانات مختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">متوسط الدقة</span>
                  <span className="text-2xl font-bold text-green-600">
                    {(modelMetrics.metrics.cv_mean * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${modelMetrics.metrics.cv_mean * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">الانحراف المعياري</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ±{(modelMetrics.metrics.cv_std * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  انحراف منخفض يعني استقرار عالي للنموذج
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confusion Matrix */}
      {modelMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>
              مصفوفة الارتباك - مقارنة التنبؤات بالنتائج الفعلية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">
                  {modelMetrics.metrics.confusion_matrix[1][1]}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  True Positive
                  <br />
                  <span className="text-xs">(تنبؤ صحيح بالنجاح)</span>
                </div>
              </div>

              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">
                  {modelMetrics.metrics.confusion_matrix[0][1]}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  False Positive
                  <br />
                  <span className="text-xs">(تنبؤ خاطئ بالنجاح)</span>
                </div>
              </div>

              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">
                  {modelMetrics.metrics.confusion_matrix[1][0]}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  False Negative
                  <br />
                  <span className="text-xs">(تنبؤ خاطئ بالفشل)</span>
                </div>
              </div>

              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">
                  {modelMetrics.metrics.confusion_matrix[0][0]}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  True Negative
                  <br />
                  <span className="text-xs">(تنبؤ صحيح بالفشل)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>توزيع البيانات</CardTitle>
            <CardDescription>
              إحصائيات الأفكار المصنفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    أفكار ناجحة
                  </span>
                  <span className="font-bold">{stats.success}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.success / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    أفكار فاشلة
                  </span>
                  <span className="font-bold">{stats.failure}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.failure / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                    قيد المراجعة
                  </span>
                  <span className="font-bold">{stats.pending}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-600 h-3 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">إجمالي الأفكار</span>
                <span className="text-2xl font-bold text-blue-600">{stats.total}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.success + stats.failure >= 100 
                  ? '✅ لديك بيانات كافية لإعادة تدريب النموذج'
                  : `⚠️ تحتاج ${100 - (stats.success + stats.failure)} فكرة إضافية للوصول إلى 100 عينة`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Importance (Mock) */}
      {modelMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>أهمية الميزات (Feature Importance)</CardTitle>
            <CardDescription>
              الميزات الأكثر تأثيراً في التنبؤ بنجاح الأفكار
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'market_demand', importance: 0.25, label: 'الطلب في السوق' },
                { name: 'technical_feasibility', importance: 0.20, label: 'الجدوى التقنية' },
                { name: 'competitive_advantage', importance: 0.15, label: 'الميزة التنافسية' },
                { name: 'budget', importance: 0.12, label: 'الميزانية' },
                { name: 'team_size', importance: 0.10, label: 'حجم الفريق' },
                { name: 'user_engagement', importance: 0.08, label: 'تفاعل المستخدمين' },
                { name: 'rat_completion_rate', importance: 0.05, label: 'معدل إكمال RAT' },
                { name: 'timeline_months', importance: 0.05, label: 'المدة الزمنية' },
              ].map((feature, index) => (
                <div key={feature.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{feature.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {(feature.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        index === 0 ? 'bg-green-600' :
                        index === 1 ? 'bg-blue-600' :
                        index === 2 ? 'bg-purple-600' :
                        'bg-gray-600'
                      }`}
                      style={{ width: `${feature.importance * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
