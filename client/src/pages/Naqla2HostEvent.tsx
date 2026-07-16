// NAQLA2 - Host Event Dashboard (Hackathon/Workshop/Conference)
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Building2, DollarSign, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Naqla2HostEvent() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    type: 'hackathon' as 'hackathon' | 'workshop' | 'conference',
    date: '',
    location: '',
    capacity: '',
    budget: '',
    needSponsors: true,
    needInnovators: true
  });

  const hostEventMutation = trpc.naqla2.events.host.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إنشاء الفعالية بنجاح!' : 'Event created successfully!');
      setEventData({
        title: '',
        description: '',
        type: 'hackathon',
        date: '',
        location: '',
        capacity: '',
        budget: '',
        needSponsors: true,
        needInnovators: true
      });
    },
    onError: (error) => {
      toast.error((isAr ? 'فشل إنشاء الفعالية: ' : 'Failed to create event: ') + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(isAr ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    hostEventMutation.mutate(eventData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 max-w-md">
          <CardContent className="p-8">
            <p className="text-white text-center">{isAr ? "يرجى تسجيل الدخول لإقامة فعالية" : "Please log in to host an event"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="w-10 h-10 text-purple-400" />
            {isAr ? "أقم فعالية" : "Host an Event"}
          </h1>
          <p className="text-slate-400 text-lg">
            {isAr ? "هاكاثون، ورشة عمل، أو مؤتمر - نساعدك في إيجاد الرعاة والمبتكرين" : "Hackathon, workshop, or conference - we help you find sponsors and innovators"}
          </p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-slate-800">
            <TabsTrigger value="create">{isAr ? "إنشاء فعالية" : "Create Event"}</TabsTrigger>
            <TabsTrigger value="attendees">{isAr ? "الحضور" : "Attendees"}</TabsTrigger>
            <TabsTrigger value="sponsors">{isAr ? "الرعاة" : "Sponsors"}</TabsTrigger>
            <TabsTrigger value="innovators">{isAr ? "المبتكرين" : "Innovators"}</TabsTrigger>
          </TabsList>

          {/* Create Event Tab */}
          <TabsContent value="create">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">{isAr ? "تفاصيل الفعالية" : "Event Details"}</CardTitle>
                <CardDescription className="text-slate-400">
                  {isAr ? "املأ التفاصيل التالية لإنشاء فعاليتك" : "Fill in the following details to create your event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Type */}
                  <div>
                    <Label htmlFor="type" className="text-white">{isAr ? "نوع الفعالية *" : "Event Type *"}</Label>
                    <Select
                      value={eventData.type}
                      onValueChange={(value: 'hackathon' | 'workshop' | 'conference') => 
                        setEventData({ ...eventData, type: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hackathon">{isAr ? "هاكاثون" : "Hackathon"}</SelectItem>
                        <SelectItem value="workshop">{isAr ? "ورشة عمل" : "Workshop"}</SelectItem>
                        <SelectItem value="conference">{isAr ? "مؤتمر" : "Conference"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-white">{isAr ? "عنوان الفعالية *" : "Event Title *"}</Label>
                    <Input
                      id="title"
                      placeholder={isAr ? "مثال: هاكاثون الذكاء الاصطناعي 2024" : "Example: AI Hackathon 2024"}
                      value={eventData.title}
                      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-white">{isAr ? "وصف الفعالية *" : "Event Description *"}</Label>
                    <Textarea
                      id="description"
                      placeholder={isAr ? "اشرح الهدف والأنشطة..." : "Explain the goal and activities..."}
                      value={eventData.description}
                      onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                      required
                      rows={5}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div>
                      <Label htmlFor="date" className="text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {isAr ? "التاريخ *" : "Date *"}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventData.date}
                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                        required
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location" className="text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-400" />
                        {isAr ? "الموقع *" : "Location *"}
                      </Label>
                      <Input
                        id="location"
                        placeholder={isAr ? "الرياض، السعودية" : "Riyadh, Saudi Arabia"}
                        value={eventData.location}
                        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                        required
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>

                    {/* Capacity */}
                    <div>
                      <Label htmlFor="capacity" className="text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        {isAr ? "السعة *" : "Capacity *"}
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="100"
                        value={eventData.capacity}
                        onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })}
                        required
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <Label htmlFor="budget" className="text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        {isAr ? "الميزانية المطلوبة *" : "Required Budget *"}
                      </Label>
                      <Input
                        id="budget"
                        placeholder={isAr ? "50,000 ريال" : "50,000 SAR"}
                        value={eventData.budget}
                        onChange={(e) => setEventData({ ...eventData, budget: e.target.value })}
                        required
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="needSponsors"
                        checked={eventData.needSponsors}
                        onChange={(e) => setEventData({ ...eventData, needSponsors: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="needSponsors" className="text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        {isAr ? "أبحث عن رعاة" : "Looking for Sponsors"}
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="needInnovators"
                        checked={eventData.needInnovators}
                        onChange={(e) => setEventData({ ...eventData, needInnovators: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="needInnovators" className="text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        {isAr ? "أبحث عن مبتكرين" : "Looking for Innovators"}
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={hostEventMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  >
                    {hostEventMutation.isPending ? (isAr ? 'جاري الإنشاء...' : 'Creating...') : (isAr ? 'إنشاء الفعالية' : 'Create Event')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">{isAr ? "إدارة الحضور" : "Manage Attendees"}</CardTitle>
                <CardDescription className="text-slate-400">
                  {isAr ? "قائمة المسجلين في الفعالية" : "Event Registrants List"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-12">
                  {isAr ? "سيتم عرض قائمة الحضور هنا بعد إنشاء الفعالية" : "Attendee list will be displayed here after event creation"}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">{isAr ? "البحث عن رعاة" : "Find Sponsors"}</CardTitle>
                <CardDescription className="text-slate-400">
                  {isAr ? "الرعاة المحتملين لفعاليتك" : "Potential Sponsors for Your Event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-12">
                  {isAr ? "سنساعدك في إيجاد رعاة مناسبين لفعاليتك" : "We'll help you find suitable sponsors for your event."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Innovators Tab */}
          <TabsContent value="innovators">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">{isAr ? "البحث عن مبتكرين" : "Find Innovators"}</CardTitle>
                <CardDescription className="text-slate-400">
                  {isAr ? "المبتكرين المهتمين بمجال فعاليتك" : "Innovators interested in your event's field"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-12">
                  {isAr ? "سنساعدك في إيجاد مبتكرين مناسبين لفعاليتك" : "We'll help you find suitable innovators for your event."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}