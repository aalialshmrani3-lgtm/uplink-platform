import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Calendar, MapPin, Users, Search, Filter, Sparkles, Clock } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BrowseAllEvents() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: events, isLoading } = trpc.naqla2.events.getAll.useQuery({
    type: typeFilter as any,
    status: statusFilter as any,
  });

  const eventTypes = [
    { value: "all", label: "All Types", icon: "🌐" },
    { value: "hackathon", label: "Hackathon", icon: "💻" },
    { value: "workshop", label: "Workshop", icon: "🛠️" },
    { value: "conference", label: "Conference", icon: "🎤" },
    { value: "seminar", label: "Seminar", icon: "📢" },
    { value: "webinar", label: "Webinar", icon: "🌐" },
    { value: "networking", label: "Scientific Meeting", icon: "🤝" },
    { value: "exhibition", label: "Exhibition", icon: "🏛️" },
    { value: "competition", label: "Competition", icon: "🏆" },
    { value: "training", label: "Training", icon: "📚" },
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses", color: "bg-gray-500" },
    { value: "draft", label: "Draft", color: "bg-gray-500" },
    { value: "published", label: "Published", color: "bg-green-500" },
    { value: "ongoing", label: "Ongoing", color: "bg-blue-500" },
    { value: "completed", label: "Completed", color: "bg-purple-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  ];

  const filteredEvents = events?.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getEventTypeLabel = (type: string) => {
    return eventTypes.find((t) => t.value === type)?.label || type;
  };

  const getEventTypeIcon = (type: string) => {
    return eventTypes.find((t) => t.value === type)?.icon || "📅";
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? isAr ? "نقلة 2 - جميع الفعاليات" : "NAQLA 2 - All Events" : "NAQLA 2 - All Events"}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            استعرض الفعاليات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف الفعاليات القادمة وسجل مشاركتك الآن
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              البحث والفلترة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={isAr ? "ابحث عن فعالية..." : "Search for an event..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Type Filter */}
              <Select
                value={typeFilter || "all"}
                onValueChange={(value) => setTypeFilter(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isAr ? "نوع الفعالية" : "Event Type"} />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isAr ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                        <span>{status.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{isAr ? isAr ? "جارٍ تحميل الفعاليات..." : "Loading events..." : "Downloading events..."}</p>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden"
              >
                <div className={`h-2 ${getStatusColor(event.status || "draft")}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{getEventTypeIcon(event.eventType)}</div>
                    <Badge className={`${getStatusColor(event.status || "draft")} text-white`}>
                      {getStatusLabel(event.status || "draft")}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Event Type */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{getEventTypeLabel(event.eventType)}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}

                  {/* Delivery Mode */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>
                      {event.deliveryMode === "online"
                        ? isAr ? "أونلاين" : "Online"
                        : event.deliveryMode === "in_person"
                        ? isAr ? "حضوري" : "In-person"
                        : "Hybrid"}
                    </span>
                  </div>

                  {/* Capacity */}
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>السعة: {event.capacity} مشارك</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/naqla2/events/${event.id}`}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      عرض التفاصيل
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد فعاليات
            </h3>
            <p className="text-gray-600 mb-6">
              لم نجد أي فعاليات تطابق معايير البحث
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter(undefined);
                setStatusFilter(undefined);
              }}
              variant="outline"
            >
              إعادة تعيين الفلاتر
            </Button>
          </Card>
        )}

        {/* Stats */}
        {filteredEvents && filteredEvents.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              عرض <span className="font-bold text-blue-600">{filteredEvents.length}</span> فعالية
              {events && events.length !== filteredEvents.length && (
                <span>{isAr ? isAr ? " من أصل " : " of " : "[of]"}< span className="font-bold">{events.length}</span></span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
