import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  Users,
  Lightbulb,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function StrategicPartnerDashboard() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");

  // جلب الأفكار المُوجّهة للشريك الاستراتيجي
  const { data: assignedIdeas, isLoading, refetch } = trpc.partners.getAssignedIdeas.useQuery();

  // قبول فكرة
  const acceptIdea = trpc.partners.acceptIdea.useMutation({
    onSuccess: () => {
      toast({
        title: "تم قبول الفكرة",
        description: "تم قبول الفكرة بنجاح وإرسال إشعار للمبتكر",
      });
      refetch();
    },
  });

  // رفض فكرة
  const rejectIdea = trpc.partners.rejectIdea.useMutation({
    onSuccess: () => {
      toast({
        title: "تم رفض الفكرة",
        description: "تم رفض الفكرة وإرسال feedback للمبتكر",
      });
      refetch();
    },
  });

  // إرسال feedback
  const sendFeedback = trpc.partners.sendFeedback.useMutation({
    onSuccess: () => {
      toast({
        title: "تم إرسال الملاحظات",
        description: "تم إرسال ملاحظاتك للمبتكر بنجاح",
      });
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const stats = {
    total: assignedIdeas?.length || 0,
    pending: assignedIdeas?.filter(i => i.partnerStatus === 'pending').length || 0,
    accepted: assignedIdeas?.filter(i => i.partnerStatus === 'accepted').length || 0,
    rejected: assignedIdeas?.filter(i => i.partnerStatus === 'rejected').length || 0,
  };

  const filteredIdeas = selectedTab === "all" 
    ? assignedIdeas 
    : assignedIdeas?.filter(i => i.partnerStatus === selectedTab);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">لوحة تحكم الشريك الاستراتيجي</h1>
        <p className="text-muted-foreground">إدارة الأفكار المُوجّهة إليك من UPLINK 1</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              إجمالي الأفكار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              قيد المراجعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              مقبولة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              مرفوضة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas Table */}
      <Card>
        <CardHeader>
          <CardTitle>الأفكار المُوجّهة</CardTitle>
          <CardDescription>قم بمراجعة الأفكار وإرسال feedback للمبتكرين</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">قيد المراجعة ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">مقبولة ({stats.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">مرفوضة ({stats.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              {filteredIdeas && filteredIdeas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>الدرجة</TableHead>
                      <TableHead>المسار</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIdeas.map((idea) => (
                      <TableRow key={idea.id}>
                        <TableCell className="font-medium">{idea.title}</TableCell>
                        <TableCell>{idea.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{idea.overallScore}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>
                            {idea.classificationPath === "innovation" && "ابتكار"}
                            {idea.classificationPath === "commercial" && "تجاري"}
                            {idea.classificationPath === "guidance" && "توجيه"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {idea.partnerStatus === "pending" && (
                            <Badge variant="outline" className="text-yellow-600">
                              <Clock className="w-3 h-3 ml-1" />
                              قيد المراجعة
                            </Badge>
                          )}
                          {idea.partnerStatus === "accepted" && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle2 className="w-3 h-3 ml-1" />
                              مقبولة
                            </Badge>
                          )}
                          {idea.partnerStatus === "rejected" && (
                            <Badge variant="outline" className="text-red-600">
                              <XCircle className="w-3 h-3 ml-1" />
                              مرفوضة
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {idea.partnerStatus === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => acceptIdea.mutate({ ideaId: idea.id })}
                                  disabled={acceptIdea.isPending}
                                >
                                  <CheckCircle2 className="w-4 h-4 ml-1" />
                                  قبول
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const feedback = prompt("أدخل ملاحظاتك:");
                                    if (feedback) {
                                      rejectIdea.mutate({ 
                                        ideaId: idea.id,
                                        feedback 
                                      });
                                    }
                                  }}
                                  disabled={rejectIdea.isPending}
                                >
                                  <XCircle className="w-4 h-4 ml-1" />
                                  رفض
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const feedback = prompt("أدخل ملاحظاتك:");
                                if (feedback) {
                                  sendFeedback.mutate({ 
                                    ideaId: idea.id,
                                    feedback 
                                  });
                                }
                              }}
                              disabled={sendFeedback.isPending}
                            >
                              <MessageSquare className="w-4 h-4 ml-1" />
                              إرسال feedback
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  لا توجد أفكار في هذه الفئة
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
