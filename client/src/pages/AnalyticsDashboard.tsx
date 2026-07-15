import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const analyticsQuery = trpc.ai.getAnalytics.useQuery();
  
  const analytics = analyticsQuery.data;
  const isLoading = analyticsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">{isAr ? "جارٍ تحميل التحليلات..." : "Loading analytics..."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8" dir={isAr ? "rtl" : "ltr"}>
        <div className="text-center">
          <p className="text-muted-foreground">{isAr ? "لا توجد بيانات متاحة" : "No data available"}</p>
        </div>
      </div>
    );
  }

  // Prepare feedback trends data
  const feedbackTrendsData = Object.entries(analytics.feedbackStats.byType).map(([type, count]) => ({
    name: isAr ? (
          type === 'ceo_insight' ? 'رؤى تنفيذية' : 
          type === 'roadmap' ? 'خارطة الطريق' :
          type === 'investment' ? 'تحليل استثماري' :
          type === 'whatif' ? 'محاكاة ماذا لو' : 'عام'
        ) : (
          type === 'ceo_insight' ? 'Executive Insights' : 
          type === 'roadmap' ? 'Roadmap' :
          type === 'investment' ? 'Investment Analysis' :
          type === 'whatif' ? 'What-If Simulation' : 'General'
        ),
    count
  }));

  // Prepare feedback ratings data
  const feedbackRatingsData = Object.entries(analytics.feedbackStats.byRating).map(([rating, count]) => ({
    name: isAr ? (
          rating === 'helpful' ? 'مفيد' :
          rating === 'not_helpful' ? 'غير مفيد' :
          rating === 'actionable' ? 'قابل للتنفيذ' :
          rating === 'not_actionable' ? 'غير قابل للتنفيذ' : rating
        ) : (
          rating === 'helpful' ? 'Helpful' :
          rating === 'not_helpful' ? 'Not Helpful' :
          rating === 'actionable' ? 'Actionable' :
          rating === 'not_actionable' ? 'Not Actionable' : rating
        ),
    value: count
  }));

  // Calculate success rate
  const totalFeedback = analytics.feedbackStats.total;
  const positiveFeedback = (analytics.feedbackStats.byRating['helpful'] || 0) + 
                           (analytics.feedbackStats.byRating['actionable'] || 0);
  const successRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback * 100).toFixed(1) : 0;

  return (
    <div className="container mx-auto py-8" dir={isAr ? "rtl" : "ltr"}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{isAr ? "لوحة تحكم التحليلات" : "Analytics Dashboard"}</h1>
        <p className="text-muted-foreground">
          {isAr ? "تتبع أداء النظام وملاحظات المستخدمين ودقة التنبؤات" : "Track system performance, user feedback, and prediction accuracy"}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "إجمالي التحليلات" : "Total Analyses"}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.analysisStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {isAr ? "متوسط ICI:" : "Avg ICI:"} {analytics.analysisStats.avgIci.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "إجمالي الملاحظات" : "Total Feedback"}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.feedbackStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {isAr ? `من ${analytics.analysisStats.total} تحليل` : `from ${analytics.analysisStats.total} analyses`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "معدل النجاح" : "Success Rate"}</CardTitle>
            {parseFloat(successRate as string) >= 70 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {isAr ? "ملاحظات إيجابية" : "Positive Feedback"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isAr ? "دقة التنبؤات" : "Prediction Accuracy"}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.predictionAccuracy.accuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {isAr ? `${analytics.predictionAccuracy.correct} من ${analytics.predictionAccuracy.total}` : `${analytics.predictionAccuracy.correct} out of ${analytics.predictionAccuracy.total}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">{isAr ? "اتجاهات الملاحظات" : "Feedback Trends"}</TabsTrigger>
          <TabsTrigger value="analysis">{isAr ? "إحصائيات التحليلات" : "Analysis Statistics"}</TabsTrigger>
          <TabsTrigger value="predictions">{isAr ? "دقة التنبؤات" : "Prediction Accuracy"}</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "الملاحظات حسب النوع" : "Feedback by Type"}</CardTitle>
                <CardDescription>{isAr ? "توزيع الملاحظات على الميزات المختلفة" : "Distribution of feedback across different features"}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={feedbackTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name={isAr ? "عدد الملاحظات" : "Number of Feedback"} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "التقييمات" : "Ratings"}</CardTitle>
                <CardDescription>{isAr ? "توزيع تقييمات المستخدمين" : "Distribution of user ratings"}</CardDescription>
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
              <CardTitle>{isAr ? "ملخص الملاحظات" : "Feedback Summary"}</CardTitle>
              <CardDescription>{isAr ? "نظرة عامة على أداء النظام" : "Overview of system performance"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>{isAr ? "ملاحظات إيجابية" : "Positive Feedback"}</span>
                  </div>
                  <span className="font-bold">{positiveFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>{isAr ? "ملاحظات سلبية" : "Negative Feedback"}</span>
                  </div>
                  <span className="font-bold">{totalFeedback - positiveFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>{isAr ? "معدل الاستجابة" : "Response Rate"}</span>
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
                <CardTitle>{isAr ? "متوسط ICI Score" : "Avg ICI Score"}</CardTitle>
                <CardDescription>Innovation Confidence Index</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  {analytics.analysisStats.avgIci.toFixed(1)}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {isAr ? "من 100" : "out of 100"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "متوسط IRL Score" : "Avg IRL Score"}</CardTitle>
                <CardDescription>Investor Readiness Level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  {analytics.analysisStats.avgIrl.toFixed(1)}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {isAr ? "من 100" : "out of 100"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "متوسط احتمالية النجاح" : "Avg Success Probability"}</CardTitle>
                <CardDescription>Success Probability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center">
                  {(analytics.analysisStats.avgSuccessProbability * 100).toFixed(1)}%
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {isAr ? "احتمالية النجاح" : "Success Probability"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isAr ? "توزيع التحليلات" : "Analysis Distribution"}</CardTitle>
              <CardDescription>{isAr ? "إحصائيات تفصيلية للتحليلات الاستراتيجية" : "Detailed statistics for strategic analyses"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{isAr ? "إجمالي التحليلات" : "Total Analyses"}</span>
                  <span className="font-bold">{analytics.analysisStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isAr ? "متوسط ICI Score" : "Avg ICI Score"}</span>
                  <span className="font-bold">{analytics.analysisStats.avgIci.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isAr ? "متوسط IRL Score" : "Avg IRL Score"}</span>
                  <span className="font-bold">{analytics.analysisStats.avgIrl.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isAr ? "متوسط احتمالية النجاح" : "Avg Success Probability"}</span>
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
              <CardTitle>{isAr ? "دقة التنبؤات" : "Prediction Accuracy"}</CardTitle>
              <CardDescription>{isAr ? "مدى دقة تنبؤات النظام" : "How accurate the system's predictions are"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">
                    {(analytics.predictionAccuracy.accuracy * 100).toFixed(1)}%
                  </div>
                  <p className="text-muted-foreground">{isAr ? "دقة إجمالية" : "Overall Accuracy"}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{analytics.predictionAccuracy.correct}</div>
                    <p className="text-sm text-muted-foreground">{isAr ? "تنبؤات صحيحة" : "Correct Predictions"}</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{analytics.predictionAccuracy.total}</div>
                    <p className="text-sm text-muted-foreground">{isAr ? "إجمالي التنبؤات" : "Total Predictions"}</p>
                  </div>
                </div>

                {analytics.predictionAccuracy.total === 0 && (
                  <div className="text-center text-muted-foreground">
                    <p>{isAr ? "لا توجد بيانات تنبؤات متاحة حتى الآن" : "No prediction data available yet"}</p>
                    <p className="text-sm mt-2">
                      {isAr ? "سيتم تحديث هذا القسم عندما يتم تتبع النتائج الفعلية للمشاريع" : "This section will be updated when actual project outcomes are tracked"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}