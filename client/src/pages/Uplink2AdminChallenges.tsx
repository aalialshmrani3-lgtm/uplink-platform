import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, FileText, Award, Eye, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Uplink2AdminChallenges() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: challenges, isLoading } = trpc.uplink2.challenges.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">غير مصرح</CardTitle>
            <CardDescription>ليس لديك صلاحية الوصول إلى هذه الصفحة</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/uplink2/challenges">
              <Button variant="outline" className="w-full">العودة إلى التحديات</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/uplink2/challenges">
            <Button variant="ghost" className="mb-4">
              ← العودة إلى التحديات
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">لوحة تحكم المنظمين</h1>
          <p className="text-gray-400">إدارة التحديات ومراجعة الحلول المقدمة</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">إجمالي التحديات</CardTitle>
              <Trophy className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{challenges?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">التحديات النشطة</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {challenges?.filter(c => c.status === "open").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">إجمالي المشاركين</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {challenges?.reduce((sum, c) => sum + (c.participantsCount || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">الحلول المقدمة</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-800/50">
            <TabsTrigger value="all">جميع التحديات</TabsTrigger>
            <TabsTrigger value="open">النشطة</TabsTrigger>
            <TabsTrigger value="closed">المنتهية</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6">
              {challenges?.map((challenge) => (
                <Card key={challenge.id} className="bg-gray-800/50 border-gray-700 hover:border-amber-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{challenge.title}</CardTitle>
                          <Badge 
                            variant={challenge.status === "open" ? "default" : "secondary"}
                            className={challenge.status === "open" ? "bg-green-500" : "bg-gray-500"}
                          >
                            {challenge.status === "open" ? "نشط" : "منتهي"}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-400 line-clamp-2">
                          {challenge.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participantsCount || 0} مشارك</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>0 حل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span>{challenge.prize}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/challenges/${challenge.id}/submissions`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            مراجعة الحلول
                          </Button>
                        </Link>
                        <Link href={`/uplink2/challenges/${challenge.id}`}>
                          <Button size="sm" variant="ghost">
                            عرض التفاصيل
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="open" className="mt-6">
            <div className="grid gap-6">
              {challenges?.filter(c => c.status === "open").map((challenge) => (
                <Card key={challenge.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{challenge.participantsCount || 0} مشارك</span>
                        <span>0 حل</span>
                      </div>
                      <Link href={`/admin/challenges/${challenge.id}/submissions`}>
                        <Button size="sm">مراجعة الحلول</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-6">
            <div className="grid gap-6">
              {challenges?.filter(c => c.status === "closed").map((challenge) => (
                <Card key={challenge.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>{challenge.participantsCount || 0} مشارك</span>
                        <span>0 حل</span>
                      </div>
                      <Link href={`/admin/challenges/${challenge.id}/submissions`}>
                        <Button size="sm" variant="outline">عرض الحلول</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
