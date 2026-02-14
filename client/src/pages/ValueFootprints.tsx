/**
 * Value Footprints Dashboard
 * لوحة معلومات قياس الأثر
 */

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Building2, Users, DollarSign, Target } from "lucide-react";

export default function ValueFootprints() {
  // جلب آخر قياس
  const { data: latestFootprint, isLoading: isLoadingLatest } = trpc.valueFootprints.getLatest.useQuery();

  // جلب جميع القياسات
  const { data: footprints, isLoading: isLoadingAll } = trpc.valueFootprints.getAll.useQuery({
    periodType: 'monthly',
    limit: 12,
  });

  const isLoading = isLoadingLatest || isLoadingAll;

  const stats = latestFootprint
    ? [
        {
          title: "إجمالي الأفكار",
          value: latestFootprint.totalIdeas?.toString() || "0",
          icon: Target,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "الشركات الناشئة",
          value: latestFootprint.totalStartups?.toString() || "0",
          icon: Building2,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "الوظائف المُنشأة",
          value: latestFootprint.totalJobs?.toString() || "0",
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "الإيرادات (ريال)",
          value: latestFootprint.totalRevenue
            ? new Intl.NumberFormat('ar-SA').format(Number(latestFootprint.totalRevenue))
            : "0",
          icon: DollarSign,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
      ]
    : [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">قياس الأثر</h1>
        <p className="text-muted-foreground">
          تتبع الأثر الاقتصادي والاجتماعي لمنصة UPLINK
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Latest Stats */}
          {latestFootprint && (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold">الإحصائيات الحالية</h2>
                  <Badge>{latestFootprint.period}</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Classification Breakdown */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>توزيع الأفكار حسب المسار</CardTitle>
                  <CardDescription>
                    تصنيف الأفكار إلى المسارات الثلاثة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">مسار الابتكار</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {latestFootprint.innovationPathCount || 0}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        الأفكار عالية الابتكار (≥70%)
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">مسار التجاري</span>
                        <Building2 className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {latestFootprint.commercialPathCount || 0}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        الأفكار التجارية (60-70%)
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">مسار التوجيه</span>
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {latestFootprint.guidancePathCount || 0}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        الأفكار قيد التطوير (&lt;60%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Historical Data */}
          {footprints && footprints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>البيانات التاريخية</CardTitle>
                <CardDescription>
                  تتبع الأداء عبر الأشهر السابقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {footprints.map((footprint, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{footprint.period}</div>
                        <div className="text-sm text-muted-foreground">
                          {footprint.totalIdeas} أفكار • {footprint.totalStartups} شركات • {footprint.totalJobs} وظائف
                        </div>
                      </div>
                      <Badge variant="outline">{footprint.periodType}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!latestFootprint && !footprints?.length && (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  لا توجد بيانات قياس أثر حالياً
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
