import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, MapPin, Calendar, Users, DollarSign,
  Search, Filter, Zap, Globe, Building
} from 'lucide-react';

export default function Naqla2BrowseHackathons() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'open' | 'closed' | 'judging' | 'completed' | 'cancelled' | undefined>();
  const [virtualFilter, setVirtualFilter] = useState<boolean | undefined>();

  const { data: hackathons, isLoading } = trpc.naqla2.hackathons.getAll.useQuery({
    status: statusFilter,
  });

  const filteredHackathons = hackathons?.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            الهاكاثونات
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            اكتشف أفضل الهاكاثونات وشارك في تحديات الابتكار
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن هاكاثون..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
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
            onClick={() => navigate('/naqla2/hackathons/create')}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            <Zap className="w-4 h-4 ml-2" />
            إنشاء هاكاثون
          </Button>
        </div>

        {/* Hackathons Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredHackathons && filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <Card 
                key={hackathon.id}
                className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer group"
                onClick={() => navigate(`/naqla2/hackathons/${hackathon.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={`${getStatusBadge(hackathon.status || 'draft')} text-white border-0`}>
                      {hackathon.status === 'open' ? 'مفتوح' : 
                       hackathon.status === 'closed' ? 'مغلق' :
                       hackathon.status === 'judging' ? 'قيد التقييم' :
                       hackathon.status === 'completed' ? 'مكتمل' : 'مسودة'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl mb-2 line-clamp-2">
                    {hackathon.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 line-clamp-3">
                    {hackathon.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>
                        {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString('ar-SA') : 'غير محدد'} - {hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </span>
                    </div>
                    {/* TODO: Add isVirtual, location, capacity, registrations, budget to events schema */}
                    {/* <div className="flex items-center gap-2 text-sm text-slate-400">
                      {hackathon.isVirtual ? (
                        <>
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span>افتراضي</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>{hackathon.location || 'غير محدد'}</span>
                        </>
                      )}
                    </div>
                    {hackathon.capacity && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{hackathon.registrations || 0} / {hackathon.capacity} مشارك</span>
                      </div>
                    )}
                    {hackathon.budget && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        <span>{hackathon.budget} ريال</span>
                      </div>
                    )} */}
                  </div>
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/naqla2/hackathons/${hackathon.id}`);
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
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">لا توجد هاكاثونات حالياً</p>
              <Button 
                onClick={() => navigate('/naqla2/hackathons/create')}
                className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Zap className="w-4 h-4 ml-2" />
                إنشاء أول هاكاثون
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
