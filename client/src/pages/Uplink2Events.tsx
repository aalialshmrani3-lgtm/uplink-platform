// Added for Flowchart Match - UPLINK2 Events Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, MapPin, Users, Globe, Plus, Search, Building } from 'lucide-react';

export default function Uplink2Events() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const { data: events, isLoading } = trpc.uplink2.events.getAll.useQuery({});

  const createMutation = trpc.uplink2.events.create.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء الفعالية بنجاح');
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error('فشل إنشاء الفعالية: ' + error.message);
    }
  });

  const registerMutation = trpc.uplink2.events.register.useMutation({
    onSuccess: () => {
      toast.success('تم التسجيل بنجاح');
    },
    onError: (error) => {
      toast.error('فشل التسجيل: ' + error.message);
    }
  });

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      eventType: formData.get('eventType') as any,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      isOnline: formData.get('isOnline') === 'on',
      maxAttendees: parseInt(formData.get('maxAttendees') as string) || undefined,
    });
  };

  const handleRegister = (eventId: number, attendeeType: string) => {
    registerMutation.mutate({
      eventId,
      attendeeType: attendeeType as any,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="w-10 h-10 text-blue-400" />
                الفعاليات
              </h1>
              <p className="text-slate-400 text-lg">
                اكتشف وشارك في فعاليات الابتكار والتواصل
              </p>
            </div>
            {user && (
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                إنشاء فعالية
              </Button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">إنشاء فعالية جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">عنوان الفعالية</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType" className="text-white">نوع الفعالية</Label>
                    <Select name="eventType" required>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="conference">مؤتمر</SelectItem>
                        <SelectItem value="workshop">ورشة عمل</SelectItem>
                        <SelectItem value="networking">تواصل</SelectItem>
                        <SelectItem value="demo_day">يوم العروض</SelectItem>
                        <SelectItem value="pitch_event">عروض تقديمية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">الوصف</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-white">تاريخ البداية</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-white">تاريخ النهاية</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">الموقع</Label>
                    <Input
                      id="location"
                      name="location"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees" className="text-white">الحد الأقصى للحضور</Label>
                    <Input
                      id="maxAttendees"
                      name="maxAttendees"
                      type="number"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    name="isOnline"
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isOnline" className="text-white">فعالية أونلاين</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    إنشاء الفعالية
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sponsor Form */}
        {showSponsorForm && selectedEvent && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">طلب رعاية</CardTitle>
              <CardDescription className="text-slate-400">
                قدم طلب لرعاية هذه الفعالية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">اسم الشركة</Label>
                    <Input
                      id="companyName"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-white">الشخص المسؤول</Label>
                    <Input
                      id="contactPerson"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">رسالة (اختياري)</Label>
                  <Textarea
                    id="message"
                    rows={3}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      toast.success('تم إرسال طلب الرعاية');
                      setShowSponsorForm(false);
                    }}
                  >
                    إرسال الطلب
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSponsorForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="search"
              placeholder="ابحث عن فعالية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="upcoming">قادمة</TabsTrigger>
            <TabsTrigger value="ongoing">جارية</TabsTrigger>
            <TabsTrigger value="sponsors">للرعاة</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">جاري التحميل...</div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                  <Card key={event.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-blue-500/50 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">{event.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{event.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        {event.isOnline ? (
                          <>
                            <Globe className="w-4 h-4" />
                            <span className="text-sm">أونلاين</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{event.location}</span>
                          </>
                        )}
                      </div>
                      {event.maxAttendees && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">حتى {event.maxAttendees} حاضر</span>
                        </div>
                      )}
                      {user && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1"
                            onClick={() => handleRegister(event.id, 'attendee')}
                          >
                            سجل الآن
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event.id);
                              setShowSponsorForm(true);
                            }}
                          >
                            <Building className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                لا توجد فعاليات حالياً
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="text-center py-12 text-slate-400">
              لا توجد فعاليات قادمة
            </div>
          </TabsContent>

          <TabsContent value="ongoing">
            <div className="text-center py-12 text-slate-400">
              لا توجد فعاليات جارية
            </div>
          </TabsContent>

          <TabsContent value="sponsors">
            <div className="text-center py-12 text-slate-400">
              <Building className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="mb-4">هل تبحث عن فرص رعاية؟</p>
              <p className="text-sm">تواصل مع منظمي الفعاليات للحصول على فرص رعاية مميزة</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
