import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Calendar, Users, Star, Zap, Globe, MapPin, Clock, Search,
  Plus, ArrowRight, CheckCircle2, Building2, Heart, Leaf,
  Cpu, Factory, Wifi, TrendingUp, Shield, ChevronRight,
  Megaphone, Handshake, Lightbulb, Trophy
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'هاكاثون الطاقة الوطني 2025',
    titleEn: 'National Energy Hackathon 2025',
    organizer: 'وزارة الطاقة',
    organizerEn: 'Ministry of Energy',
    type: 'hackathon',
    sector: 'energy',
    date: '2025-03-15',
    location: 'الرياض',
    locationEn: 'Riyadh',
    description: 'هاكاثون وطني يجمع أفضل المبتكرين والمطورين لإيجاد حلول ذكية لتحديات الطاقة',
    descriptionEn: 'National hackathon bringing together top innovators and developers to find smart solutions for energy challenges',
    needs: {
      innovators: { needed: 100, registered: 67 },
      volunteers: { needed: 30, registered: 12 },
      sponsors: { needed: 10, registered: 4 },
      mentors: { needed: 20, registered: 15 },
    },
    prize: '500,000 SAR',
    tags: ['energy', 'ai', 'sustainability'],
    status: 'open',
    featured: true,
  },
  {
    id: 2,
    title: 'معرض الابتكار الصحي 2025',
    titleEn: 'Health Innovation Expo 2025',
    organizer: 'مستشفى الملك فيصل التخصصي',
    organizerEn: 'King Faisal Specialist Hospital',
    type: 'expo',
    sector: 'health',
    date: '2025-04-20',
    location: 'جدة',
    locationEn: 'Jeddah',
    description: 'معرض يستعرض أحدث الابتكارات في مجال الرعاية الصحية والتقنيات الطبية',
    descriptionEn: 'Expo showcasing the latest innovations in healthcare and medical technologies',
    needs: {
      innovators: { needed: 50, registered: 38 },
      volunteers: { needed: 20, registered: 8 },
      sponsors: { needed: 5, registered: 3 },
      mentors: { needed: 10, registered: 7 },
    },
    prize: '200,000 SAR',
    tags: ['health', 'ai', 'medtech'],
    status: 'open',
    featured: false,
  },
  {
    id: 3,
    title: 'مؤتمر الذكاء الاصطناعي والصناعة',
    titleEn: 'AI & Industry Conference',
    organizer: 'هيئة الصناعة والتعدين',
    organizerEn: 'Ministry of Industry & Mining',
    type: 'conference',
    sector: 'ai',
    date: '2025-05-10',
    location: 'الدمام',
    locationEn: 'Dammam',
    description: 'مؤتمر يناقش تطبيقات الذكاء الاصطناعي في القطاع الصناعي وفرص الابتكار',
    descriptionEn: 'Conference discussing AI applications in the industrial sector and innovation opportunities',
    needs: {
      innovators: { needed: 30, registered: 22 },
      volunteers: { needed: 15, registered: 15 },
      sponsors: { needed: 8, registered: 6 },
      mentors: { needed: 12, registered: 10 },
    },
    prize: '150,000 SAR',
    tags: ['ai', 'industry', 'manufacturing'],
    status: 'filling',
    featured: false,
  },
  {
    id: 4,
    title: 'تحدي الاستدامة البيئية',
    titleEn: 'Environmental Sustainability Challenge',
    organizer: 'المركز الوطني للاستدامة',
    organizerEn: 'National Sustainability Center',
    type: 'challenge',
    sector: 'sustainability',
    date: '2025-06-01',
    location: 'أبوظبي',
    locationEn: 'Abu Dhabi',
    description: 'تحدي يبحث عن أفضل الحلول المبتكرة لمواجهة تحديات البيئة والاستدامة',
    descriptionEn: 'Challenge seeking the best innovative solutions to address environmental and sustainability challenges',
    needs: {
      innovators: { needed: 80, registered: 25 },
      volunteers: { needed: 25, registered: 5 },
      sponsors: { needed: 6, registered: 2 },
      mentors: { needed: 15, registered: 8 },
    },
    prize: '300,000 SAR',
    tags: ['sustainability', 'environment', 'cleantech'],
    status: 'open',
    featured: true,
  },
];

const EVENT_TYPES = [
  { id: 'hackathon', label: { ar: 'هاكاثون', en: 'Hackathon' }, icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'expo', label: { ar: 'معرض', en: 'Expo' }, icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { id: 'conference', label: { ar: 'مؤتمر', en: 'Conference' }, icon: Megaphone, color: 'from-purple-500 to-pink-500' },
  { id: 'challenge', label: { ar: 'تحدي', en: 'Challenge' }, icon: Trophy, color: 'from-green-500 to-emerald-500' },
];

const SECTOR_ICONS: Record<string, any> = {
  energy: Zap, health: Heart, ai: Cpu, sustainability: Leaf,
  industry: Factory, iot: Wifi, fintech: TrendingUp, security: Shield,
};

const SECTOR_LABELS: Record<string, { ar: string; en: string }> = {
  energy: { ar: 'الطاقة', en: 'Energy' },
  health: { ar: 'الصحة', en: 'Health' },
  ai: { ar: 'الذكاء الاصطناعي', en: 'AI' },
  sustainability: { ar: 'الاستدامة', en: 'Sustainability' },
  industry: { ar: 'الصناعة', en: 'Industry' },
  iot: { ar: 'إنترنت الأشياء', en: 'IoT' },
  fintech: { ar: 'التقنية المالية', en: 'FinTech' },
  security: { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
};

const STATUS_CONFIG: Record<string, { ar: string; en: string; color: string }> = {
  open: { ar: 'مفتوح للتسجيل', en: 'Open for Registration', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  filling: { ar: 'يمتلئ بسرعة', en: 'Filling Fast', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  closed: { ar: 'مغلق', en: 'Closed', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

export default function Naqla2EventsNeedsBoard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [registerRole, setRegisterRole] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredEvents = MOCK_EVENTS.filter(ev => {
    const matchesType = filterType === 'all' || ev.type === filterType;
    const matchesSector = filterSector === 'all' || ev.sector === filterSector;
    const matchesSearch = searchQuery === '' ||
      (isAr ? ev.title : ev.titleEn).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSector && matchesSearch;
  });

  const handleRegister = () => {
    if (!registerRole) {
      toast.error(isAr ? 'يرجى اختيار دورك' : 'Please select your role');
      return;
    }
    toast.success(isAr
      ? `تم تسجيلك كـ ${registerRole} بنجاح! ستتلقى تأكيداً على بريدك الإلكتروني`
      : `Successfully registered as ${registerRole}! You'll receive a confirmation email`
    );
    setShowRegisterModal(false);
    setRegisterRole('');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isAr ? 'لوحة الفعاليات والحاجات - NAQLA 2' : 'Events & Needs Board - NAQLA 2'}
        description={isAr ? 'اكتشف الفعاليات وسجل كمبتكر أو متطوع أو راعٍ' : 'Discover events and register as innovator, volunteer or sponsor'}
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative pt-24 pb-10 px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">NAQLA 2</Badge>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                  {isAr ? 'لوحة الفعاليات والحاجات' : 'Events & Needs Board'}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                {isAr ? 'فعاليات الابتكار' : 'Innovation Events'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {isAr
                  ? 'هاكاثونات، معارض، مؤتمرات، وتحديات. سجّل كمبتكر أو متطوع أو راعٍ أو مرشد.'
                  : 'Hackathons, expos, conferences, and challenges. Register as innovator, volunteer, sponsor, or mentor.'}
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAr ? 'نشر فعالية جديدة' : 'Post New Event'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { value: MOCK_EVENTS.length, label: isAr ? 'فعالية نشطة' : 'Active Events', icon: Calendar, color: 'text-orange-400' },
              { value: '255', label: isAr ? 'مبتكر مسجل' : 'Registered Innovators', icon: Lightbulb, color: 'text-blue-400' },
              { value: '40', label: isAr ? 'متطوع مسجل' : 'Registered Volunteers', icon: Users, color: 'text-green-400' },
              { value: '15', label: isAr ? 'راعٍ مشارك' : 'Participating Sponsors', icon: Star, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative px-6 pb-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isAr ? 'ابحث عن فعالية...' : 'Search events...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/30 border-border/50"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 bg-secondary/30 border-border/50">
                <SelectValue placeholder={isAr ? 'نوع الفعالية' : 'Event Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isAr ? 'كل الأنواع' : 'All Types'}</SelectItem>
                {EVENT_TYPES.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {isAr ? t.label.ar : t.label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger className="w-full md:w-48 bg-secondary/30 border-border/50">
                <SelectValue placeholder={isAr ? 'القطاع' : 'Sector'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isAr ? 'كل القطاعات' : 'All Sectors'}</SelectItem>
                {Object.entries(SECTOR_LABELS).map(([id, label]) => (
                  <SelectItem key={id} value={id}>
                    {isAr ? label.ar : label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="relative px-6 pb-24">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map(event => {
              const SectorIcon = SECTOR_ICONS[event.sector] || Globe;
              const eventType = EVENT_TYPES.find(t => t.id === event.type);
              const EventIcon = eventType?.icon || Calendar;
              const statusData = STATUS_CONFIG[event.status];
              const totalNeeded = Object.values(event.needs).reduce((a, b) => a + b.needed, 0);
              const totalRegistered = Object.values(event.needs).reduce((a, b) => a + b.registered, 0);
              const fillPercent = Math.round((totalRegistered / totalNeeded) * 100);

              return (
                <Card
                  key={event.id}
                  className={`bg-card/50 border-border/50 backdrop-blur-sm hover:border-orange-500/30 transition-all ${
                    event.featured ? 'ring-1 ring-orange-500/30' : ''
                  }`}
                >
                  {event.featured && (
                    <div className="px-6 pt-4">
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {isAr ? 'مميز' : 'Featured'}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={event.featured ? 'pt-2' : ''}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${eventType?.color || 'from-gray-500 to-slate-600'} flex items-center justify-center`}>
                          <EventIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Badge className={statusData.color + ' text-xs'}>
                            {isAr ? statusData.ar : statusData.en}
                          </Badge>
                          <div className="flex items-center gap-2 mt-1">
                            <SectorIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {isAr ? SECTOR_LABELS[event.sector]?.ar : SECTOR_LABELS[event.sector]?.en}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">{event.prize}</div>
                        <div className="text-xs text-muted-foreground">{isAr ? 'جائزة' : 'Prize'}</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground text-xl mt-3">
                      {isAr ? event.title : event.titleEn}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {isAr ? event.organizer : event.organizerEn}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {isAr ? event.location : event.locationEn}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {isAr ? event.description : event.descriptionEn}
                    </p>

                    {/* Needs Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { key: 'innovators', label: isAr ? 'مبتكرون' : 'Innovators', icon: Lightbulb, color: 'text-blue-400' },
                        { key: 'volunteers', label: isAr ? 'متطوعون' : 'Volunteers', icon: Users, color: 'text-green-400' },
                        { key: 'sponsors', label: isAr ? 'رعاة' : 'Sponsors', icon: Star, color: 'text-yellow-400' },
                        { key: 'mentors', label: isAr ? 'مرشدون' : 'Mentors', icon: Handshake, color: 'text-purple-400' },
                      ].map(need => {
                        const data = event.needs[need.key as keyof typeof event.needs];
                        const pct = Math.round((data.registered / data.needed) * 100);
                        const NeedIcon = need.icon;
                        return (
                          <div key={need.key} className="p-2 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <NeedIcon className={`w-3 h-3 ${need.color}`} />
                                <span className="text-xs text-muted-foreground">{need.label}</span>
                              </div>
                              <span className="text-xs font-medium text-foreground">{data.registered}/{data.needed}</span>
                            </div>
                            <div className="w-full h-1 bg-secondary rounded-full">
                              <div
                                className={`h-1 rounded-full ${pct >= 80 ? 'bg-red-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{isAr ? 'نسبة الامتلاء الكلية' : 'Overall Fill Rate'}</span>
                        <span className="font-medium text-foreground">{fillPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full">
                        <div
                          className={`h-2 rounded-full transition-all ${fillPercent >= 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : fillPercent >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        onClick={() => { setSelectedEvent(event); setShowRegisterModal(true); }}
                        disabled={event.status === 'closed'}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {isAr ? 'سجّل الآن' : 'Register Now'}
                      </Button>
                      <Button variant="outline" size="icon">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                {isAr ? 'التسجيل في الفعالية' : 'Event Registration'}
              </CardTitle>
              <CardDescription>
                {isAr ? selectedEvent.title : selectedEvent.titleEn}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {isAr ? 'سجّل كـ:' : 'Register as:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'innovator', label: isAr ? 'مبتكر' : 'Innovator', icon: Lightbulb, color: 'from-blue-500 to-cyan-600' },
                      { id: 'volunteer', label: isAr ? 'متطوع' : 'Volunteer', icon: Users, color: 'from-green-500 to-emerald-600' },
                      { id: 'sponsor', label: isAr ? 'راعٍ' : 'Sponsor', icon: Star, color: 'from-yellow-500 to-orange-600' },
                      { id: 'mentor', label: isAr ? 'مرشد' : 'Mentor', icon: Handshake, color: 'from-purple-500 to-pink-600' },
                    ].map(role => {
                      const RoleIcon = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setRegisterRole(role.label)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                            registerRole === role.label
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-border/50 bg-secondary/30 hover:border-border'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                            <RoleIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{role.label}</span>
                          {registerRole === role.label && <CheckCircle2 className="w-4 h-4 text-orange-400 mr-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRegister}
                    disabled={!registerRole}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isAr ? 'تأكيد التسجيل' : 'Confirm Registration'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowRegisterModal(false); setRegisterRole(''); }}>
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                {isAr ? 'نشر فعالية جديدة' : 'Post New Event'}
              </CardTitle>
              <CardDescription>
                {isAr ? 'أعلن عن فعاليتك وابحث عن مبتكرين ومتطوعين ورعاة' : 'Announce your event and find innovators, volunteers and sponsors'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{isAr ? 'عنوان الفعالية' : 'Event Title'}</label>
                <Input placeholder={isAr ? 'مثال: هاكاثون الطاقة 2025' : 'e.g. Energy Hackathon 2025'} className="bg-secondary/30 border-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{isAr ? 'نوع الفعالية' : 'Event Type'}</label>
                  <Select>
                    <SelectTrigger className="bg-secondary/30 border-border/50">
                      <SelectValue placeholder={isAr ? 'اختر النوع' : 'Select type'} />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(t => (
                        <SelectItem key={t.id} value={t.id}>{isAr ? t.label.ar : t.label.en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{isAr ? 'القطاع' : 'Sector'}</label>
                  <Select>
                    <SelectTrigger className="bg-secondary/30 border-border/50">
                      <SelectValue placeholder={isAr ? 'اختر القطاع' : 'Select sector'} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SECTOR_LABELS).map(([id, label]) => (
                        <SelectItem key={id} value={id}>{isAr ? label.ar : label.en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{isAr ? 'وصف الفعالية' : 'Event Description'}</label>
                <Textarea
                  placeholder={isAr ? 'صف فعاليتك وما تبحث عنه...' : 'Describe your event and what you\'re looking for...'}
                  className="bg-secondary/30 border-border/50 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{isAr ? 'التاريخ' : 'Date'}</label>
                  <Input type="date" className="bg-secondary/30 border-border/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{isAr ? 'الموقع' : 'Location'}</label>
                  <Input placeholder={isAr ? 'المدينة' : 'City'} className="bg-secondary/30 border-border/50" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  onClick={() => {
                    toast.success(isAr ? 'تم نشر الفعالية بنجاح! ستتلقى تنبيهات من المهتمين' : 'Event posted successfully! You\'ll receive alerts from interested parties');
                    setShowCreateModal(false);
                  }}
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  {isAr ? 'نشر الفعالية' : 'Post Event'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
