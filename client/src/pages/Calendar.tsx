import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock,
  Video, MapPin, Users, Bell, Trash2, Edit, Check, X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'in-person' | 'phone';
  attendees: { name: string; avatar: string; role: string }[];
  description: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const meetingsData: Meeting[] = [
  {
    id: 1,
    title: 'اجتماع مع مستثمر - أحمد الراشد',
    date: '2026-01-30',
    time: '10:00',
    duration: '1 ساعة',
    type: 'video',
    attendees: [
      { name: 'أحمد الراشد', avatar: 'أ', role: 'مستثمر' },
    ],
    description: 'مناقشة فرصة الاستثمار في مشروع الذكاء الاصطناعي',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'عرض المشروع للجنة التقييم',
    date: '2026-01-31',
    time: '14:00',
    duration: '2 ساعة',
    type: 'in-person',
    attendees: [
      { name: 'لجنة التقييم', avatar: 'ل', role: 'خبراء' },
    ],
    description: 'تقديم العرض التقديمي للمشروع أمام لجنة التقييم',
    status: 'upcoming'
  },
  {
    id: 3,
    title: 'متابعة مع سارة المنصور',
    date: '2026-02-01',
    time: '11:00',
    duration: '30 دقيقة',
    type: 'phone',
    attendees: [
      { name: 'سارة المنصور', avatar: 'س', role: 'مستثمر' },
    ],
    description: 'متابعة تفاصيل العقد والاتفاقية',
    status: 'upcoming'
  }
];

const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetings, setMeetings] = useState(meetingsData);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '1 ساعة',
    type: 'video' as 'video' | 'in-person' | 'phone',
    description: '',
    attendee: ''
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMeetingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.filter(m => m.date === dateStr);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-cyan-400" />;
      case 'in-person': return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'phone': return <Bell className="w-4 h-4 text-purple-400" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'video': return <Badge className="bg-cyan-500/20 text-cyan-400 border-0">فيديو</Badge>;
      case 'in-person': return <Badge className="bg-emerald-500/20 text-emerald-400 border-0">حضوري</Badge>;
      case 'phone': return <Badge className="bg-purple-500/20 text-purple-400 border-0">هاتفي</Badge>;
      default: return null;
    }
  };

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) return;
    
    const meeting: Meeting = {
      id: meetings.length + 1,
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      duration: newMeeting.duration,
      type: newMeeting.type,
      attendees: [{ name: newMeeting.attendee || 'ضيف', avatar: newMeeting.attendee?.[0] || 'ض', role: 'مدعو' }],
      description: newMeeting.description,
      status: 'upcoming'
    };
    
    setMeetings([...meetings, meeting]);
    setShowNewMeeting(false);
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: '1 ساعة',
      type: 'video',
      description: '',
      attendee: ''
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold">التقويم والاجتماعات</h1>
                <p className="text-xs text-muted-foreground">جدولة وإدارة اجتماعاتك</p>
              </div>
            </div>
          </div>
          
          <Dialog open={showNewMeeting} onOpenChange={setShowNewMeeting}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <Plus className="w-4 h-4 ml-2" />
                اجتماع جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>جدولة اجتماع جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">عنوان الاجتماع</label>
                  <Input 
                    placeholder="مثال: اجتماع مع مستثمر"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">التاريخ</label>
                    <Input 
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">الوقت</label>
                    <Input 
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">المدة</label>
                    <Select value={newMeeting.duration} onValueChange={(v) => setNewMeeting({...newMeeting, duration: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 دقيقة">30 دقيقة</SelectItem>
                        <SelectItem value="1 ساعة">1 ساعة</SelectItem>
                        <SelectItem value="2 ساعة">2 ساعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">النوع</label>
                    <Select value={newMeeting.type} onValueChange={(v) => setNewMeeting({...newMeeting, type: v as 'video' | 'in-person' | 'phone'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">فيديو</SelectItem>
                        <SelectItem value="in-person">حضوري</SelectItem>
                        <SelectItem value="phone">هاتفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">المدعو</label>
                  <Input 
                    placeholder="اسم المدعو"
                    value={newMeeting.attendee}
                    onChange={(e) => setNewMeeting({...newMeeting, attendee: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الوصف</label>
                  <Textarea 
                    placeholder="تفاصيل الاجتماع..."
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  onClick={handleCreateMeeting}
                >
                  إنشاء الاجتماع
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayMeetings = day ? getMeetingsForDate(day) : [];
                    return (
                      <div 
                        key={index}
                        className={`
                          min-h-[80px] p-2 rounded-lg border border-transparent
                          ${day ? 'hover:bg-secondary/30 cursor-pointer' : ''}
                          ${isToday(day || 0) ? 'bg-cyan-500/10 border-cyan-500/30' : ''}
                          ${selectedDate?.getDate() === day ? 'bg-secondary/50' : ''}
                        `}
                        onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      >
                        {day && (
                          <>
                            <span className={`
                              text-sm font-medium
                              ${isToday(day) ? 'text-cyan-400' : ''}
                            `}>
                              {day}
                            </span>
                            {dayMeetings.length > 0 && (
                              <div className="mt-1 space-y-1">
                                {dayMeetings.slice(0, 2).map(meeting => (
                                  <div 
                                    key={meeting.id}
                                    className="text-xs p-1 rounded bg-cyan-500/20 text-cyan-400 truncate"
                                  >
                                    {meeting.time} - {meeting.title.slice(0, 15)}...
                                  </div>
                                ))}
                                {dayMeetings.length > 2 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{dayMeetings.length - 2} المزيد
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetings */}
          <div className="space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  الاجتماعات القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map(meeting => (
                    <div 
                      key={meeting.id}
                      className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{meeting.title}</h4>
                        {getTypeBadge(meeting.type)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {meeting.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.attendees.map((attendee, i) => (
                          <div 
                            key={i}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs text-white"
                          >
                            {attendee.avatar}
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground">
                          {meeting.attendees.map(a => a.name).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {meeting.type === 'video' && (
                          <Button size="sm" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                            <Video className="w-3 h-3 ml-1" />
                            انضمام
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-muted-foreground">
                          <Edit className="w-3 h-3 ml-1" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">لا توجد اجتماعات قادمة</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/messages">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 ml-2" />
                    جدولة من الرسائل
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="w-4 h-4 ml-2" />
                  اجتماع فوري
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
