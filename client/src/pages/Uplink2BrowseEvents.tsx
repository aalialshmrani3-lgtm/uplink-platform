import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, MapPin, Users, DollarSign, Search, Filter, 
  Zap, Globe, Building, Presentation, GraduationCap
} from 'lucide-react';

export default function Uplink2BrowseEvents() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'hackathon' | 'workshop' | 'conference' | undefined>();
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | undefined>();
  const [virtualFilter, setVirtualFilter] = useState<boolean | undefined>();

  const { data: events, isLoading } = trpc.uplink2.events.getAll.useQuery({
    type: typeFilter,
    status: statusFilter,
    isVirtual: virtualFilter,
  });

  const filteredEvents = events?.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      published: 'bg-blue-500',
      ongoing: 'bg-green-500',
      completed: 'bg-purple-500',
      cancelled: 'bg-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop':
        return <GraduationCap className="w-6 h-6 text-white" />;
      case 'conference':
        return <Presentation className="w-6 h-6 text-white" />;
      default:
        return <Building className="w-6 h-6 text-white" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'from-green-500 to-emerald-600';
      case 'conference':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            الفعاليات والمؤتمرات
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            اكتشف أفضل الفعاليات والمؤتمرات وورش العمل
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن فعالية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-800 text-white">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="workshop">ورشة عمل</SelectItem>
              <SelectItem value="conference">مؤتمر</SelectItem>
              <SelectItem value="hackathon">هاكاثون</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-800 text-white">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
              <SelectItem value="ongoing">جاري</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
            </SelectContent>
          </Select>
          <Select value={virtualFilter?.toString()} onValueChange={(v) => setVirtualFilter(v === 'true' ? true : v === 'false' ? false : undefined)}>
            <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-800 text-white">
              <Globe className="w-4 h-4 ml-2" />
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="true">افتراضي</SelectItem>
              <SelectItem value="false">حضوري</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => navigate('/uplink2/events/create')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Zap className="w-4 h-4 ml-2" />
            إنشاء فعالية
          </Button>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id}
                className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
                onClick={() => navigate(`/uplink2/events/${event.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTypeColor(event.type)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <Badge className={`${getStatusBadge(event.status || 'draft')} text-white border-0`}>
                      {event.status === 'published' ? 'منشور' : 
                       event.status === 'ongoing' ? 'جاري' :
                       event.status === 'completed' ? 'مكتمل' : 'مسودة'}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {event.type === 'workshop' ? 'ورشة عمل' : 
                       event.type === 'conference' ? 'مؤتمر' : 'هاكاثون'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl mb-2 line-clamp-2">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('ar-SA')} - {new Date(event.endDate).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      {event.isVirtual ? (
                        <>
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span>افتراضي</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>{event.location || 'غير محدد'}</span>
                        </>
                      )}
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{event.registrations || 0} / {event.capacity} مشارك</span>
                      </div>
                    )}
                    {event.budget && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        <span>{event.budget} ريال</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/uplink2/events/${event.id}`);
                    }}
                  >
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardContent className="py-20 text-center">
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">لا توجد فعاليات حالياً</p>
              <Button 
                onClick={() => navigate('/uplink2/events/create')}
                className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Zap className="w-4 h-4 ml-2" />
                إنشاء أول فعالية
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
