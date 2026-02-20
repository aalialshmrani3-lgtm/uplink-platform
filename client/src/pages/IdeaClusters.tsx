/**
 * صفحة مجموعات الأفكار - AI Clustering (Innovation 360 Feature)
 * 
 * تعرض جميع المجموعات المُنشأة بواسطة AI
 * تتيح للمستخدم:
 * - تجميع الأفكار تلقائياً باستخدام AI
 * - عرض المجموعات مع قوتها
 * - عرض تفاصيل كل مجموعة
 * - دمج أفكار يدوياً
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Users, TrendingUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function IdeaClusters() {
  const { toast } = useToast();
  const [isClustering, setIsClustering] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  // جلب جميع المجموعات
  const { data: clusters, isLoading, refetch } = trpc.clustering.getClusters.useQuery();

  // جلب تفاصيل المجموعة المختارة
  const { data: clusterDetails } = trpc.clustering.getClusterDetails.useQuery(
    { clusterId: selectedCluster! },
    { enabled: !!selectedCluster }
  );

  // تجميع الأفكار تلقائياً
  const clusterMutation = trpc.clustering.clusterIdeas.useMutation({
    onSuccess: (data) => {
      toast({
        title: "✅ تم التجميع بنجاح!",
        description: `تم إنشاء ${data.clusters.length} مجموعة قوية`,
      });
      refetch();
      setIsClustering(false);
    },
    onError: (error) => {
      toast({
        title: "❌ فشل التجميع",
        description: error.message,
        variant: "destructive",
      });
      setIsClustering(false);
    },
  });

  const handleAutoCluster = () => {
    setIsClustering(true);
    clusterMutation.mutate({});
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return "قوية جداً";
    if (strength >= 60) return "قوية";
    return "متوسطة";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">مجموعات الأفكار</h1>
          <p className="text-muted-foreground">
            تجميع ذكي للأفكار المتشابهة باستخدام AI - مستوحى من Innovation 360
          </p>
        </div>
        <Button
          onClick={handleAutoCluster}
          disabled={isClustering}
          size="lg"
          className="gap-2"
        >
          {isClustering ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري التجميع...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              تجميع تلقائي بالـ AI
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      {clusters && clusters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">إجمالي المجموعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clusters.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">إجمالي الأفكار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clusters.reduce((sum, c) => sum + (c.memberCount || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">متوسط القوة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  clusters.reduce((sum, c) => sum + (c.strength || 0), 0) / clusters.length
                )}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Clusters Grid */}
      {!clusters || clusters.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold mb-2">لا توجد مجموعات بعد</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ بتجميع الأفكار تلقائياً باستخدام AI للحصول على مجموعات قوية
              </p>
              <Button onClick={handleAutoCluster} disabled={isClustering}>
                <Sparkles className="h-4 w-4 mr-2" />
                تجميع تلقائي الآن
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.map((cluster) => (
            <Card
              key={cluster.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCluster(cluster.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{cluster.name}</CardTitle>
                    {cluster.nameEn && (
                      <p className="text-sm text-muted-foreground">{cluster.nameEn}</p>
                    )}
                  </div>
                  <Badge className={`${getStrengthColor(cluster.strength || 0)} text-white`}>
                    {cluster.strength}%
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {cluster.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{cluster.memberCount} أفكار</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>{getStrengthLabel(cluster.strength || 0)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCluster(cluster.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cluster Details Dialog */}
      <Dialog open={!!selectedCluster} onOpenChange={() => setSelectedCluster(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {clusterDetails?.name}
            </DialogTitle>
            <DialogDescription>
              {clusterDetails?.description}
            </DialogDescription>
          </DialogHeader>

          {clusterDetails && (
            <div className="space-y-6">
              {/* Cluster Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{clusterDetails.memberCount}</div>
                  <div className="text-sm text-muted-foreground">أفكار</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{clusterDetails.strength}%</div>
                  <div className="text-sm text-muted-foreground">القوة</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {clusterDetails.similarities && clusterDetails.similarities.length > 0
                      ? Math.round(
                          clusterDetails.similarities!.reduce((a: number | null, b: number | null) => ((a ?? 0) + (b ?? 0)), 0) /
                            clusterDetails.similarities.length
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">متوسط التشابه</div>
                </div>
              </div>

              {/* Ideas List */}
              <div>
                <h3 className="font-semibold mb-4">الأفكار في هذه المجموعة:</h3>
                <div className="space-y-3">
                  {clusterDetails.ideas?.map((idea: any, index: number) => (
                    <Card key={idea.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{idea.title}</CardTitle>
                          {clusterDetails.similarities && (
                            <Badge variant="secondary">
                              {clusterDetails.similarities[index]}% تشابه
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {idea.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
