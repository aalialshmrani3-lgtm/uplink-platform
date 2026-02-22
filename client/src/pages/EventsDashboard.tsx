import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";
import { useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";

export default function EventsDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("all");

  // Fetch user's events
  const { data: events, isLoading, refetch } = trpc.events.getMyEvents.useQuery(undefined, {
    enabled: !!user,
  });

  // Update event status mutation
  const updateStatusMutation = trpc.events.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Delete event mutation
  const deleteEventMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusChange = (eventId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      eventId,
      status: newStatus as "draft" | "published" | "ongoing" | "completed" | "cancelled",
    });
  };

  const handleDelete = (eventId: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الفعالية؟")) {
      deleteEventMutation.mutate({ eventId });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "مسودة", variant: "secondary" as const },
      published: { label: "منشورة", variant: "default" as const },
      ongoing: { label: "جارية", variant: "default" as const },
      completed: { label: "مكتملة", variant: "secondary" as const },
      cancelled: { label: "ملغاة", variant: "destructive" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getEventTypeBadge = (type: string) => {
    const typeMap = {
      conference: "مؤتمر",
      workshop: "ورشة عمل",
      hackathon: "هاكاثون",
      seminar: "ندوة",
      webinar: "ويبينار",
      networking: "لقاء علمي",
      exhibition: "معرض",
      competition: "مسابقة",
      training: "تدريب",
    };
    return <Badge variant="outline">{typeMap[type as keyof typeof typeMap] || type}</Badge>;
  };

  const filteredEvents = events?.filter((event) => {
    if (selectedTab === "all") return true;
    return event.status === selectedTab;
  });

  const stats = {
    total: events?.length || 0,
    published: events?.filter((e) => e.status === "published").length || 0,
    ongoing: events?.filter((e) => e.status === "ongoing").length || 0,
    completed: events?.filter((e) => e.status === "completed").length || 0,
  };

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h1>
        <p className="text-muted-foreground">يجب تسجيل الدخول لعرض لوحة تحكم الفعاليات</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="لوحة تحكم الفعاليات - نقلة"
        description="إدارة فعالياتك ومتابعة التسجيلات والإحصائيات"
      />

      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة تحكم الفعاليات</h1>
            <p className="text-muted-foreground">إدارة ومتابعة جميع فعالياتك</p>
          </div>
          <Button onClick={() => setLocation("/naqla2/add-event")}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة فعالية جديدة
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي الفعاليات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">منشورة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">جارية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.ongoing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">مكتملة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>فعالياتي</CardTitle>
            <CardDescription>إدارة ومتابعة جميع الفعاليات التي أنشأتها</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
                <TabsTrigger value="published">منشورة ({stats.published})</TabsTrigger>
                <TabsTrigger value="ongoing">جارية ({stats.ongoing})</TabsTrigger>
                <TabsTrigger value="completed">مكتملة ({stats.completed})</TabsTrigger>
                <TabsTrigger value="draft">مسودات</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">جارٍ التحميل...</p>
                  </div>
                ) : filteredEvents && filteredEvents.length > 0 ? (
                  filteredEvents.map((event: any) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{event.title}</h3>
                              {getEventTypeBadge(event.eventType)}
                              {getStatusBadge(event.status)}
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {new Date(event.startDate).toLocaleDateString("ar-SA")}
                                </span>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {event.registrationsCount || 0}{" "}
                                  {event.capacity ? `/ ${event.capacity}` : ""} مسجل
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mr-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLocation(`/naqla2/events/${event.id}`)}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              عرض
                            </Button>

                            {event.status === "draft" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(event.id, "published")}
                              >
                                <CheckCircle className="w-4 h-4 ml-2" />
                                نشر
                              </Button>
                            )}

                            {event.status === "published" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(event.id, "ongoing")}
                              >
                                <Clock className="w-4 h-4 ml-2" />
                                بدء
                              </Button>
                            )}

                            {event.status === "ongoing" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(event.id, "completed")}
                              >
                                <CheckCircle className="w-4 h-4 ml-2" />
                                إنهاء
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد فعاليات</h3>
                    <p className="text-muted-foreground mb-4">
                      لم تقم بإنشاء أي فعاليات بعد
                    </p>
                    <Button onClick={() => setLocation("/naqla2/add-event")}>
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة فعالية جديدة
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
