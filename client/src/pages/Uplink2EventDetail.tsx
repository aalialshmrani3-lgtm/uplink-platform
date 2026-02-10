import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, ArrowLeft, MapPin, Users, DollarSign,
  Globe, CheckCircle, Clock, Award, Presentation, GraduationCap, Building
} from 'lucide-react';

export default function Uplink2EventDetail() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id || '0');
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: event, isLoading } = trpc.uplink2.events.getById.useQuery({ id: eventId });
  
  const registerMutation = trpc.uplink2.events.register.useMutation({
    onSuccess: () => {
      console.log('تم التسجيل بنجاح');
      window.location.reload();
    },
    onError: (error) => {
      console.error('خطأ:', error.message);
    },
  });

  const handleRegister = () => {
    if (!user) {
      console.error('يجب تسجيل الدخول أولاً');
      return;
    }

    registerMutation.mutate({
      eventId: eventId,
      attendeeType: 'innovator',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 text-lg">الفعالية غير موجودة</p>
            <Button onClick={() => navigate('/uplink2/events')} className="mt-4">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        return <GraduationCap className="w-7 h-7 text-white" />;
      case 'conference':
        return <Presentation className="w-7 h-7 text-white" />;
      default:
        return <Building className="w-7 h-7 text-white" />;
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

  const isRegistered = event.registrations?.some(r => r.userId === user?.id);
  const isFull = event.capacity && event.registrationsCount >= event.capacity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="container max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/uplink2/events')}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة إلى الفعاليات
        </Button>

        <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(event.type)} flex items-center justify-center`}>
                  {getTypeIcon(event.type)}
                </div>
                <div>
                  <div className="mb-2">
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {event.type === 'workshop' ? 'ورشة عمل' : 
                       event.type === 'conference' ? 'مؤتمر' : 'هاكاثون'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-3xl mb-2">{event.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <Badge className={`${getStatusBadge(event.status || 'draft')} text-white border-0`}>
                      {event.status === 'published' ? 'منشور' : 
                       event.status === 'ongoing' ? 'جاري' :
                       event.status === 'completed' ? 'مكتمل' : 'مسودة'}
                    </Badge>
                    {event.isVirtual && (
                      <Badge className="bg-blue-500 text-white border-0">
                        <Globe className="w-3 h-3 ml-1" />
                        افتراضي
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300 text-lg leading-relaxed">
              {event.description}
            </CardDescription>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                التواريخ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">تاريخ البداية</p>
                <p className="text-white">{new Date(event.startDate).toLocaleString('ar-SA')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">تاريخ النهاية</p>
                <p className="text-white">{new Date(event.endDate).toLocaleString('ar-SA')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent>
              {event.isVirtual ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <Globe className="w-5 h-5" />
                  <span>فعالية افتراضية (عبر الإنترنت)</span>
                </div>
              ) : (
                <p className="text-white">{event.location || 'غير محدد'}</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                المشاركون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-2xl font-bold">
                {event.registrationsCount || 0}
                {event.capacity && ` / ${event.capacity}`}
              </p>
              <p className="text-sm text-slate-400 mt-1">مشارك مسجل</p>
            </CardContent>
          </Card>

          {event.budget && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  الميزانية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-2xl font-bold">{event.budget} ريال</p>
                <p className="text-sm text-slate-400 mt-1">إجمالي الميزانية</p>
              </CardContent>
            </Card>
          )}
        </div>

        {event.status === 'published' && (
          <Card className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 backdrop-blur-xl border-blue-500/30">
            <CardContent className="py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {isRegistered ? 'أنت مسجل في هذه الفعالية' : 'سجل الآن في الفعالية'}
                  </h3>
                  <p className="text-slate-300">
                    {isRegistered 
                      ? 'تم تسجيلك بنجاح، سنرسل لك تفاصيل المشاركة قريباً'
                      : isFull 
                        ? 'عذراً، الفعالية ممتلئة'
                        : 'لا تفوت فرصة المشاركة في هذه الفعالية المميزة'}
                  </p>
                </div>
                {isRegistered ? (
                  <Button disabled className="bg-green-600">
                    <CheckCircle className="w-5 h-5 ml-2" />
                    مسجل
                  </Button>
                ) : isFull ? (
                  <Button disabled className="bg-gray-600">
                    <Clock className="w-5 h-5 ml-2" />
                    ممتلئ
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {registerMutation.isPending ? 'جاري التسجيل...' : 'سجل الآن'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
