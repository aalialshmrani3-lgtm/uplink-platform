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
import { useLanguage } from "@/contexts/LanguageContext";

export default function EventsDashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("all");

  // Fetch user's events
  const { data: events, isLoading, refetch } = trpc.naqla2.events.getMyEvents.useQuery(undefined, {
    enabled: !!user,
  });

  // Update event status mutation
  const updateStatusMutation = trpc.naqla2.events.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Delete event mutation
  const deleteEventMutation = trpc.naqla2.events.delete.useMutation({
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
    deleteEventMutation.mutate({ eventId });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "Draft", variant: "secondary" as const },
      published: { label: "Published", variant: "default" as const },
      ongoing: { label: "Ongoing", variant: "default" as const },
      completed: { label: "Completed", variant: "secondary" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getEventTypeBadge = (type: string) => {
    const typeMap = {
      conference: "Conference",
      workshop: "Workshop",
      hackathon: "Hackathon",
      seminar: "Seminar",
      webinar: "Webinar",
      networking: "Scientific Meeting",
      exhibition: "Exhibition",
      competition: "Competition",
      training: "Training",
    };
    return <Badge variant="outline">{typeMap[type as keyof typeof typeMap] || type}</Badge>;
  };

  const filteredEvents = events?.filter((event: any) => {
    if (selectedTab === "all") return true;
    return event.status === selectedTab;
  });

  const stats = {
    total: events?.length || 0,
    published: events?.filter((e: any) => e.status === "published").length || 0,
    ongoing: events?.filter((e: any) => e.status === "ongoing").length || 0,
    completed: events?.filter((e: any) => e.status === "completed").length || 0,
  };

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{isAr ? isAr ? "يرجى تسجيل الدخول" : "Please log in" : "Please log in"}</h1>
        <p className="text-muted-foreground">{isAr ? isAr ? "يجب تسجيل الدخول لعرض لوحة تحكم الفعاليات" : "You must log in to view the events dashboard" : "You must log in to view the events dashboard"}</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={isAr ? "لوحة تحكم الفعاليات - نقلة" : "Events Dashboard - Naqla"}
        description={isAr ? "إدارة فعالياتك ومتابعة التسجيلات والإحصائيات" : "Manage your events, registrations, and statistics"}
      />

      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{isAr ? isAr ? "لوحة تحكم الفعاليات" : "Events Dashboard" : "Events Dashboard"}</h1>
            <p className="text-muted-foreground">{isAr ? isAr ? "إدارة ومتابعة جميع فعالياتك" : "Manage and track all your events" : "Manage and track all your events"}</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">{isAr ? isAr ? "منشورة" : "Published" : "Published"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{isAr ? isAr ? "جارية" : "Ongoing" : "[Ongoing]"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.ongoing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{isAr ? isAr ? "مكتملة" : "Completed" : "Completed"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>{isAr ? isAr ? "فعالياتي" : "My Events" : "My Events"}</CardTitle>
            <CardDescription>{isAr ? isAr ? "إدارة ومتابعة جميع الفعاليات التي أنشأتها" : "Manage and track all events you created" : "Manage & Track Your Events"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
                <TabsTrigger value="published">منشورة ({stats.published})</TabsTrigger>
                <TabsTrigger value="ongoing">جارية ({stats.ongoing})</TabsTrigger>
                <TabsTrigger value="completed">مكتملة ({stats.completed})</TabsTrigger>
                <TabsTrigger value="draft">{isAr ? isAr ? "مسودات" : "Drafts" : "[Drafts]"}</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">{isAr ? isAr ? "جارٍ التحميل..." : "Loading..." : "Downloading..."}</p>
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
                    <h3 className="text-lg font-semibold mb-2">{isAr ? isAr ? "لا توجد فعاليات" : "No Events" : "No Events"}</h3>
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
