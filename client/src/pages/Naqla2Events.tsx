// Added for Flowchart Match - NAQLA2 Events Page
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
import { useLanguage } from "@/contexts/LanguageContext";

export default function Naqla2Events() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const { data: events, isLoading } = trpc.naqla2.events.getAll.useQuery({});

  const createMutation = trpc.naqla2.events.create.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إنشاء الفعالية بنجاح' : 'Event created successfully');
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error((isAr ? 'فشل إنشاء الفعالية: ' : 'Failed to create event: ') + error.message);
    }
  });

  const registerMutation = trpc.naqla2.events.register.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم التسجيل بنجاح' : 'Registration successful');
    },
    onError: (error) => {
      toast.error((isAr ? 'فشل التسجيل: ' : 'Registration failed: ') + error.message);
    }
  });

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('eventType') as any,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      isVirtual: formData.get('isOnline') === 'on',
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
                {isAr ? 'الفعاليات' : 'Events'}
              </h1>
              <p className="text-slate-400 text-lg">
                {isAr ? 'اكتشف وشارك في فعاليات الابتكار والتواصل' : 'Discover and participate in innovation and networking events'}
              </p>
            </div>
            {user && (
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAr ? 'إنشاء فعالية' : 'Create Event'}
              </Button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">{isAr ? 'إنشاء فعالية جديدة' : 'Create New Event'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">{isAr ? 'عنوان الفعالية' : 'Event Title'}</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType" className="text-white">{isAr ? 'نوع الفعالية' : 'Event Type'}</Label>
                    <Select name="eventType" required>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder={isAr ? "اختر النوع" : "Select Type"} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="conference">{isAr ? 'مؤتمر' : 'Conference'}</SelectItem>
                        <SelectItem value="workshop">{isAr ? 'ورشة عمل' : 'Workshop'}</SelectItem>
                        <SelectItem value="networking">{isAr ? 'تواصل' : 'Networking'}</SelectItem>
                        <SelectItem value="demo_day">{isAr ? 'يوم العروض' : 'Demo Day'}</SelectItem>
                        <SelectItem value="pitch_event">{isAr ? 'عروض تقديمية' : 'Pitch Event'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">{isAr ? 'الوصف' : 'Description'}</Label>
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
                    <Label htmlFor="startDate" className="text-white">{isAr ? 'تاريخ البداية' : 'Start Date'}</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-white">{isAr ? 'تاريخ النهاية' : 'End Date'}</Label>
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
                    <Label htmlFor="location" className="text-white">{isAr ? 'الموقع' : 'Location'}</Label>
                    <Input
                      id="location"
                      name="location"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees" className="text-white">{isAr ? 'الحد الأقصى للحضور' : 'Max Attendees'}</Label>
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
                  <Label htmlFor="isOnline" className="text-white">{isAr ? 'فعالية أونلاين' : 'Online Event'}</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {isAr ? 'إنشاء الفعالية' : 'Create Event'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
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
              <CardTitle className="text-white">{isAr ? 'طلب رعاية' : 'Sponsorship Request'}</CardTitle>
              <CardDescription className="text-slate-400">
                {isAr ? 'قدم طلب لرعاية هذه الفعالية' : 'Submit a request to sponsor this event'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">{isAr ? 'اسم الشركة' : 'Company Name'}</Label>
                    <Input
                      id="companyName"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-white">{isAr ? 'الشخص المسؤول' : 'Contact Person'}</Label>
                    <Input
                      id="contactPerson"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">{isAr ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">{isAr ? 'رقم الهاتف' : 'Phone Number'}</Label>
                    <Input
                      id="phone"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">{isAr ? 'رسالة (اختياري)' : 'Message (optional)'}</Label>
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
                      toast.success(isAr ? 'تم إرسال طلب الرعاية' : 'Sponsorship request sent');
                      setShowSponsorForm(false);
                    }}
                  >
                    {isAr ? 'إرسال الطلب' : 'Submit Request'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSponsorForm(false)}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
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
              placeholder={isAr ? "ابحث عن فعالية..." : "Search for an event..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="all">{isAr ? 'الكل' : 'All'}</TabsTrigger>
            <TabsTrigger value="upcoming">{isAr ? 'قادمة' : 'Upcoming'}</TabsTrigger>
            <TabsTrigger value="ongoing">{isAr ? 'جارية' : 'Ongoing'}</TabsTrigger>
            <TabsTrigger value="sponsors">{isAr ? 'للرعاة' : 'For Sponsors'}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
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
                            <span className="text-sm">{isAr ? 'أونلاين' : 'Online'}</span>
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
                          <span className="text-sm">{isAr ? `حتى ${event.maxAttendees} حاضر` : `Up to ${event.maxAttendees} attendees`}</span>
                        </div>
                      )}
                      {user && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1"
                            onClick={() => handleRegister(event.id, 'attendee')}
                          >
                            {isAr ? 'سجل الآن' : 'Register Now'}
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
                {isAr ? 'لا توجد فعاليات حالياً' : 'No events available currently'}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="text-center py-12 text-slate-400">
              {isAr ? 'لا توجد فعاليات قادمة' : 'No upcoming events'}
            </div>
          </TabsContent>

          <TabsContent value="ongoing">
            <div className="text-center py-12 text-slate-400">
              {isAr ? 'لا توجد فعاليات جارية' : 'No ongoing events'}
            </div>
          </TabsContent>

          <TabsContent value="sponsors">
            <div className="text-center py-12 text-slate-400">
              <Building className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="mb-4">{isAr ? 'هل تبحث عن فرص رعاية؟' : 'Looking for sponsorship opportunities?'}</p>
              <p className="text-sm">{isAr ? 'تواصل مع منظمي الفعاليات للحصول على فرص رعاية مميزة' : 'Contact event organizers for unique sponsorship opportunities'}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}