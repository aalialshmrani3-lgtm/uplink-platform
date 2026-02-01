import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, CheckCircle2, XCircle } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const analyticsQuery = trpc.ai.getAnalytics.useQuery();
  const advancedAnalyticsQuery = trpc.ai.getAdvancedAnalytics.useQuery({
    cohortPeriod: 'monthly',
    forecastPeriods: 3
  });
  
  const analytics = analyticsQuery.data;
  const isLoading = analyticsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جارٍ تحميل التحليلات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

  // Prepare feedback trends data
  const feedbackTrendsData = Object.entries(analytics.feedbackStats.byType).map(([type, count]) => ({
    name: type === 'ceo_insight' ? 'رؤى تنفيذية' : 
          type === 'roadmap' ? 'خارطة الطريق' :
          type === 'investment' ? 'تحليل استثماري' :
          type === 'whatif' ? 'محاكاة ماذا لو' : 'عام',
    count
  }));

  // Prepare feedback ratings data
  const feedbackRatingsData = Object.entries(analytics.feedbackStats.byRating).map(([rating, count]) => ({
    name: rating === 'helpful' ? 'مفيد' :
          rating === 'not_helpful' ? 'غير مفيد' :
          rating === 'actionable' ? 'قابل للتنفيذ' :
          rating === 'not_actionable' ? 'غير قابل للتنفيذ' : rating,
    value: count
  }));

  // Calculate success rate
  const totalFeedback = analytics.feedbackStats.total;
  const positiveFeedback = (analytics.feedbackStats.byRating['helpful'] || 0) + 
                           (analytics.feedbackStats.byRating['actionable'] || 0);
  const successRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback * 100).toFixed(1) : 0;

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">لوحة تحكم التحليلات</h1>
        <p className="text-muted-foreground">
          تتبع أداء النظام وملاحظات المستخدمين ودقة التنبؤات
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التحليلات</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.analysisStats.total}</div>
            <p className="text-xs text-muted-foreground">
              متوسط ICI: {analytics.analysisStats.avgIci.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الملاحظات</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.feedbackStats.total}</div>
            <p className="text-xs text-muted-foreground">
              من {analytics.analysisStats.total} تحليل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            {parseFloat(successRate as string) >= 70 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              ملاحظات إيجابية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">دقة التنبؤات</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.predictionAccuracy.accuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.predictionAccuracy.correct} من {analytics.predictionAccuracy.total}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">الملاحظات</TabsTrigger>
          <TabsTrigger value="analysis">التحليلات</TabsTrigger>
          <TabsTrigger value="predictions">التنبؤات</TabsTrigger>
          <TabsTrigger value="advanced">تحليلات متقدمة</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>الملاحظات حسب النوع</CardTitle>
                <CardDescription>توزيع الملاحظات على الميزات المختلفة</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={feedbackTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="عدد الملاحظات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التقييمات</CardTitle>
                <CardDescription>توزيع تقييمات المستخدمين</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feedbackRatingsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {feedbackRatingsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ملخص الملاحظات</CardTitle>
              <CardDescription>نظرة عامة على أداء النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>ملاحظات إيجابية</span>
                  </div>
                  <span className="font-bold">{positiveFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>ملاحظات سلبية</span>
                  </div>
                  <span className="font-bold">{totalFeedback - positiveFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>معدل الاستجابة</span>
                  </div>
                  <span className="font-bold">
                    {analytics.analysisStats.total > 0 
                      ? ((totalFeedback / analytics.analysisStats.total) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>متوسط ICI Score</CardTitle>
                <CardDescription>Innovation Confidence Index</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  {analytics.analysisStats.avgIci.toFixed(1)}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  من 100
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>متوسط IRL Score</CardTitle>
                <CardDescription>Investor Readiness Level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  {analytics.analysisStats.avgIrl.toFixed(1)}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  من 100
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>متوسط احتمالية النجاح</CardTitle>
                <CardDescription>Success Probability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  {(analytics.analysisStats.avgSuccessProbability * 100).toFixed(1)}%
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  احتمالية النجاح
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>توزيع التحليلات</CardTitle>
              <CardDescription>إحصائيات تفصيلية للتحليلات الاستراتيجية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>إجمالي التحليلات</span>
                  <span className="font-bold">{analytics.analysisStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>متوسط ICI Score</span>
                  <span className="font-bold">{analytics.analysisStats.avgIci.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>متوسط IRL Score</span>
                  <span className="font-bold">{analytics.analysisStats.avgIrl.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>متوسط احتمالية النجاح</span>
                  <span className="font-bold">
                    {(analytics.analysisStats.avgSuccessProbability * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>دقة التنبؤات</CardTitle>
              <CardDescription>مدى دقة تنبؤات النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">
                    {(analytics.predictionAccuracy.accuracy * 100).toFixed(1)}%
                  </div>
                  <p className="text-muted-foreground">دقة إجمالية</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{analytics.predictionAccuracy.correct}</div>
                    <p className="text-sm text-muted-foreground">تنبؤات صحيحة</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{analytics.predictionAccuracy.total}</div>
                    <p className="text-sm text-muted-foreground">إجمالي التنبؤات</p>
                  </div>
                </div>

                {analytics.predictionAccuracy.total === 0 && (
                  <div className="text-center text-muted-foreground">
                    <p>لا توجد بيانات تنبؤات متاحة حتى الآن</p>
                    <p className="text-sm mt-2">
                      سيتم تحديث هذا القسم عندما يتم تتبع النتائج الفعلية للمشاريع
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {advancedAnalyticsQuery.isLoading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Activity className="h-8 w-8 animate-spin text-primary" />
                  <span className="mr-2">جارٍ تحميل التحليلات المتقدمة...</span>
                </div>
              </CardContent>
            </Card>
          ) : advancedAnalyticsQuery.data ? (
            <>
              {/* Cohort Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>تحليل المجموعات (Cohort Analysis)</CardTitle>
                  <CardDescription>تتبع مجموعات المشاريع عبر الزمن</CardDescription>
                </CardHeader>
                <CardContent>
                  {advancedAnalyticsQuery.data.cohort_analysis?.cohorts?.length > 0 ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-3xl font-bold">
                            {advancedAnalyticsQuery.data.cohort_analysis.summary.overall_success_rate?.toFixed(1)}%
                          </div>
                          <p className="text-sm text-muted-foreground">معدل النجاح الإجمالي</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-3xl font-bold">
                            {advancedAnalyticsQuery.data.cohort_analysis.summary.avg_ici_score?.toFixed(1)}
                          </div>
                          <p className="text-sm text-muted-foreground">متوسط ICI</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-3xl font-bold flex items-center justify-center">
                            {advancedAnalyticsQuery.data.cohort_analysis.summary.trend_ar}
                            {advancedAnalyticsQuery.data.cohort_analysis.summary.trend === 'improving' && (
                              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                            )}
                            {advancedAnalyticsQuery.data.cohort_analysis.summary.trend === 'declining' && (
                              <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">الاتجاه العام</p>
                        </div>
                      </div>

                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={advancedAnalyticsQuery.data.cohort_analysis.cohorts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="cohort" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="success_rate" stroke="#8884d8" name="معدل النجاح %" />
                          <Line type="monotone" dataKey="avg_ici_score" stroke="#82ca9d" name="متوسط ICI" />
                        </LineChart>
                      </ResponsiveContainer>

                      {advancedAnalyticsQuery.data.cohort_analysis.recommendations?.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <h4 className="font-semibold">التوصيات:</h4>
                          {advancedAnalyticsQuery.data.cohort_analysis.recommendations.map((rec: any, idx: number) => (
                            <div key={idx} className="p-3 border-r-4 border-blue-500 bg-blue-50 rounded">
                              <p className="font-medium">{rec.title_ar}</p>
                              <p className="text-sm text-muted-foreground">{rec.description_ar}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground">لا توجد بيانات كافية لتحليل المجموعات</p>
                  )}
                </CardContent>
              </Card>

              {/* Funnel Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>تحليل القمع (Funnel Analysis)</CardTitle>
                  <CardDescription>تصور مراحل نجاح/فشل المشاريع</CardDescription>
                </CardHeader>
                <CardContent>
                  {advancedAnalyticsQuery.data.funnel_analysis?.funnel_stages?.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={advancedAnalyticsQuery.data.funnel_analysis.funnel_stages}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="stage_name_ar" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="عدد المشاريع" />
                          <Bar dataKey="conversion_rate" fill="#82ca9d" name="معدل التحويل %" />
                        </BarChart>
                      </ResponsiveContainer>

                      {advancedAnalyticsQuery.data.funnel_analysis.max_drop_off && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
                          <h4 className="font-semibold text-red-800">أكبر نقطة تسرب:</h4>
                          <p className="text-sm">
                            من {advancedAnalyticsQuery.data.funnel_analysis.max_drop_off.from_stage} إلى {advancedAnalyticsQuery.data.funnel_analysis.max_drop_off.to_stage}
                          </p>
                          <p className="text-sm font-bold">
                            نسبة التسرب: {advancedAnalyticsQuery.data.funnel_analysis.max_drop_off.drop_off_rate}%
                          </p>
                        </div>
                      )}

                      {advancedAnalyticsQuery.data.funnel_analysis.recommendations?.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <h4 className="font-semibold">التوصيات:</h4>
                          {advancedAnalyticsQuery.data.funnel_analysis.recommendations.map((rec: any, idx: number) => (
                            <div key={idx} className="p-3 border-r-4 border-orange-500 bg-orange-50 rounded">
                              <p className="font-medium">{rec.title_ar}</p>
                              <p className="text-sm text-muted-foreground">{rec.description_ar}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground">لا توجد بيانات كافية لتحليل القمع</p>
                  )}
                </CardContent>
              </Card>

              {/* Trend Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle>توقعات الاتجاهات (Trend Predictions)</CardTitle>
                  <CardDescription>توقع اتجاهات النجاح المستقبلية</CardDescription>
                </CardHeader>
                <CardContent>
                  {advancedAnalyticsQuery.data.trend_predictions?.historical?.length > 0 ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 text-2xl font-bold">
                          {advancedAnalyticsQuery.data.trend_predictions.trend_ar}
                          {advancedAnalyticsQuery.data.trend_predictions.trend === 'increasing' && (
                            <TrendingUp className="h-8 w-8 text-green-600" />
                          )}
                          {advancedAnalyticsQuery.data.trend_predictions.trend === 'decreasing' && (
                            <TrendingDown className="h-8 w-8 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          معدل التغير: {advancedAnalyticsQuery.data.trend_predictions.slope?.toFixed(2)}% شهرياً
                        </p>
                      </div>

                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                          ...advancedAnalyticsQuery.data.trend_predictions.historical.map((h: any) => ({
                            period: h.period,
                            actual: h.avg_success_probability,
                            type: 'historical'
                          })),
                          ...advancedAnalyticsQuery.data.trend_predictions.forecast.map((f: any) => ({
                            period: f.period,
                            predicted: f.predicted_success_probability,
                            lower: f.confidence_lower,
                            upper: f.confidence_upper,
                            type: 'forecast'
                          }))
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="actual" stroke="#8884d8" name="فعلي" />
                          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeDasharray="5 5" name="متوقع" />
                        </LineChart>
                      </ResponsiveContainer>

                      {advancedAnalyticsQuery.data.trend_predictions.recommendations?.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <h4 className="font-semibold">التوصيات:</h4>
                          {advancedAnalyticsQuery.data.trend_predictions.recommendations.map((rec: any, idx: number) => (
                            <div key={idx} className="p-3 border-r-4 border-purple-500 bg-purple-50 rounded">
                              <p className="font-medium">{rec.title_ar}</p>
                              <p className="text-sm text-muted-foreground">{rec.description_ar}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground">لا توجد بيانات كافية لتوقع الاتجاهات</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">لا توجد بيانات متاحة</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
