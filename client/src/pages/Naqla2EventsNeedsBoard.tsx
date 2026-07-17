import { useState, useMemo, useCallback } from 'react';
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
  Megaphone, Handshake, Lightbulb, Trophy, Filter, X,
  LayoutGrid, List, SlidersHorizontal, DollarSign, ChevronDown,
  Tag, Award, RefreshCw
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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterPrize, setFilterPrize] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'prize' | 'fill'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [registerRole, setRegisterRole] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState<Array<{
    id: string;
    name: string;
    filters: {
      type: string; sector: string; status: string;
      city: string; prize: string; date: string;
      search: string; sortBy: string;
    };
    createdAt: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem('uplink_saved_event_filters');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [showSavedFiltersPanel, setShowSavedFiltersPanel] = useState(false);

  const persistSavedFilters = useCallback((filters: typeof savedFilters) => {
    setSavedFilters(filters);
    localStorage.setItem('uplink_saved_event_filters', JSON.stringify(filters));
  }, []);

  const handleSaveCurrentFilter = () => {
    if (!newFilterName.trim()) {
      toast.error(isAr ? 'أدخل اسماً للفلتر' : 'Please enter a filter name');
      return;
    }
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName.trim(),
      filters: {
        type: filterType, sector: filterSector, status: filterStatus,
        city: filterCity, prize: filterPrize, date: filterDate,
        search: searchQuery, sortBy,
      },
      createdAt: new Date().toISOString(),
    };
    persistSavedFilters([...savedFilters, newFilter]);
    setNewFilterName('');
    setShowSaveFilterModal(false);
    toast.success(isAr ? `تم حفظ الفلتر "‏${newFilter.name}‏" بنجاح` : `Filter "${newFilter.name}" saved successfully`);
  };

  const handleApplySavedFilter = (saved: typeof savedFilters[0]) => {
    setFilterType(saved.filters.type);
    setFilterSector(saved.filters.sector);
    setFilterStatus(saved.filters.status);
    setFilterCity(saved.filters.city);
    setFilterPrize(saved.filters.prize);
    setFilterDate(saved.filters.date);
    setSearchQuery(saved.filters.search);
    setSortBy(saved.filters.sortBy as 'date' | 'prize' | 'fill');
    setShowSavedFiltersPanel(false);
    toast.success(isAr ? `تم تطبيق الفلتر "‏${saved.name}‏"` : `Filter "${saved.name}" applied`);
  };

  const handleDeleteSavedFilter = (id: string) => {
    persistSavedFilters(savedFilters.filter(f => f.id !== id));
    toast.success(isAr ? 'تم حذف الفلتر' : 'Filter deleted');
  };

  // Derived filter options
  const cities = useMemo(() => {
    const citySet = new Set(MOCK_EVENTS.map(e => isAr ? e.location : e.locationEn));
    return Array.from(citySet);
  }, [isAr]);

  const activeFiltersCount = [filterType, filterSector, filterStatus, filterCity, filterPrize, filterDate]
    .filter(f => f !== 'all').length + (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setFilterType('all');
    setFilterSector('all');
    setFilterStatus('all');
    setFilterCity('all');
    setFilterPrize('all');
    setFilterDate('all');
    setSearchQuery('');
    setSortBy('date');
  };

  const filteredEvents = useMemo(() => {
    let events = MOCK_EVENTS.filter(ev => {
      const matchesType = filterType === 'all' || ev.type === filterType;
      const matchesSector = filterSector === 'all' || ev.sector === filterSector;
      const matchesStatus = filterStatus === 'all' || ev.status === filterStatus;
      const matchesCity = filterCity === 'all' || (isAr ? ev.location : ev.locationEn) === filterCity;
      const matchesPrize = filterPrize === 'all' ||
        (filterPrize === 'high' && parseInt(ev.prize.replace(/[^0-9]/g, '')) >= 300000) ||
        (filterPrize === 'medium' && parseInt(ev.prize.replace(/[^0-9]/g, '')) >= 100000 && parseInt(ev.prize.replace(/[^0-9]/g, '')) < 300000) ||
        (filterPrize === 'low' && parseInt(ev.prize.replace(/[^0-9]/g, '')) < 100000);
      const matchesDate = filterDate === 'all' ||
        (filterDate === 'this_month' && new Date(ev.date).getMonth() === new Date().getMonth()) ||
        (filterDate === 'next_3months' && new Date(ev.date) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) ||
        (filterDate === 'this_year' && new Date(ev.date).getFullYear() === new Date().getFullYear());
      const matchesSearch = searchQuery === '' ||
        (isAr ? ev.title : ev.titleEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isAr ? ev.organizer : ev.organizerEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSector && matchesStatus && matchesCity && matchesPrize && matchesDate && matchesSearch;
    });
    // Sort
    events = [...events].sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'prize') return parseInt(b.prize.replace(/[^0-9]/g, '')) - parseInt(a.prize.replace(/[^0-9]/g, ''));
      if (sortBy === 'fill') {
        const fillA = Object.values(a.needs).reduce((s, n) => s + n.registered, 0) / Object.values(a.needs).reduce((s, n) => s + n.needed, 0);
        const fillB = Object.values(b.needs).reduce((s, n) => s + n.registered, 0) / Object.values(b.needs).reduce((s, n) => s + n.needed, 0);
        return fillB - fillA;
      }
      return 0;
    });
    return events;
  }, [filterType, filterSector, filterStatus, filterCity, filterPrize, filterDate, searchQuery, sortBy, isAr]);

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

      {/* Advanced Filters */}
      <div className="relative px-6 pb-6">
        <div className="container max-w-7xl mx-auto">
          {/* Primary Filter Row */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isAr ? 'ابحث بالاسم، المنظم، أو الوسوم...' : 'Search by name, organizer, or tags...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/30 border-border/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Sector Quick Filter - Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
              {[{ id: 'all', ar: 'الكل', en: 'All', icon: Globe }, ...Object.entries(SECTOR_LABELS).map(([id, label]) => ({ id, ar: label.ar, en: label.en, icon: SECTOR_ICONS[id] || Globe }))].map(sector => {
                const SIcon = sector.icon;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setFilterSector(sector.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                      filterSector === sector.id
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : 'bg-secondary/30 text-muted-foreground border-border/30 hover:border-border'
                    }`}
                  >
                    <SIcon className="w-3.5 h-3.5" />
                    {isAr ? sector.ar : sector.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Controls Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-secondary/30 border-border/50 h-9 text-sm">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder={isAr ? 'النوع' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isAr ? 'كل الأنواع' : 'All Types'}</SelectItem>
                {EVENT_TYPES.map(t => (
                  <SelectItem key={t.id} value={t.id}>{isAr ? t.label.ar : t.label.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-secondary/30 border-border/50 h-9 text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder={isAr ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</SelectItem>
                <SelectItem value="open">{isAr ? 'مفتوح' : 'Open'}</SelectItem>
                <SelectItem value="filling">{isAr ? 'يمتلئ بسرعة' : 'Filling Fast'}</SelectItem>
                <SelectItem value="closed">{isAr ? 'مغلق' : 'Closed'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all h-9 ${
                showAdvancedFilters || [filterCity, filterPrize, filterDate].some(f => f !== 'all')
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                  : 'bg-secondary/30 text-muted-foreground border-border/30 hover:border-border'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {isAr ? 'فلاتر متقدمة' : 'Advanced Filters'}
              {[filterCity, filterPrize, filterDate].filter(f => f !== 'all').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                  {[filterCity, filterPrize, filterDate].filter(f => f !== 'all').length}
                </span>
              )}
            </button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-44 bg-secondary/30 border-border/50 h-9 text-sm">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder={isAr ? 'ترتيب حسب' : 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{isAr ? 'التاريخ (الأقرب)' : 'Date (Nearest)'}</SelectItem>
                <SelectItem value="prize">{isAr ? 'الجائزة (الأعلى)' : 'Prize (Highest)'}</SelectItem>
                <SelectItem value="fill">{isAr ? 'نسبة الامتلاء' : 'Fill Rate'}</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border border-border/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 h-9 transition-all ${
                  viewMode === 'grid' ? 'bg-orange-500/20 text-orange-400' : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 h-9 transition-all ${
                  viewMode === 'list' ? 'bg-orange-500/20 text-orange-400' : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Save Current Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => setShowSaveFilterModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-sm hover:bg-blue-500/20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {isAr ? 'حفظ الفلاتر' : 'Save Filters'}
              </button>
            )}

            {/* Saved Filters Button */}
            <div className="relative">
              <button
                onClick={() => setShowSavedFiltersPanel(!showSavedFiltersPanel)}
                className={`flex items-center gap-1.5 px-3 py-2 h-9 rounded-lg border text-sm transition-all ${
                  showSavedFiltersPanel
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-card/50 text-muted-foreground border-border/50 hover:text-foreground hover:bg-card/80'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                {isAr ? 'الفلاتر المحفوظة' : 'Saved Filters'}
                {savedFilters.length > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                    {savedFilters.length}
                  </span>
                )}
              </button>

              {/* Saved Filters Dropdown */}
              {showSavedFiltersPanel && (
                <div className="absolute top-full mt-2 z-50 w-72 rounded-xl bg-card border border-border/60 shadow-xl backdrop-blur-sm" dir={isAr ? 'rtl' : 'ltr'}>
                  <div className="p-3 border-b border-border/40">
                    <p className="text-sm font-semibold text-foreground">
                      {isAr ? 'الفلاتر المحفوظة' : 'Saved Filters'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAr ? 'انقر لتطبيق أي فلتر محفوظ' : 'Click to apply any saved filter'}
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {savedFilters.length === 0 ? (
                      <div className="p-4 text-center">
                        <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {isAr ? 'لا توجد فلاتر محفوظة بعد' : 'No saved filters yet'}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {isAr ? 'قم بضبط الفلاتر ثم اضغط "حفظ الفلاتر"' : 'Set filters then click "Save Filters"'}
                        </p>
                      </div>
                    ) : (
                      savedFilters.map(saved => (
                        <div key={saved.id} className="flex items-center gap-2 p-3 hover:bg-secondary/30 transition-colors border-b border-border/20 last:border-0">
                          <button
                            onClick={() => handleApplySavedFilter(saved)}
                            className="flex-1 text-left min-w-0"
                          >
                            <p className="text-sm font-medium text-foreground truncate">{saved.name}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">
                              {new Date(saved.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                            </p>
                          </button>
                          <button
                            onClick={() => handleDeleteSavedFilter(saved.id)}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters Count + Reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 h-9 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-sm hover:bg-red-500/20 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                {isAr ? `مسح الفلاتر (${activeFiltersCount})` : `Clear Filters (${activeFiltersCount})`}
              </button>
            )}

            {/* Results Count */}
            <span className="text-sm text-muted-foreground ml-auto">
              {isAr ? `${filteredEvents.length} فعالية` : `${filteredEvents.length} events`}
            </span>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City Filter */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {isAr ? 'المدينة' : 'City'}
                  </label>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="bg-secondary/30 border-border/50">
                      <SelectValue placeholder={isAr ? 'كل المدن' : 'All Cities'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isAr ? 'كل المدن' : 'All Cities'}</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prize Range */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {isAr ? 'قيمة الجائزة' : 'Prize Range'}
                  </label>
                  <Select value={filterPrize} onValueChange={setFilterPrize}>
                    <SelectTrigger className="bg-secondary/30 border-border/50">
                      <SelectValue placeholder={isAr ? 'أي جائزة' : 'Any Prize'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isAr ? 'أي جائزة' : 'Any Prize'}</SelectItem>
                      <SelectItem value="high">{isAr ? '+300,000 SAR' : '+300,000 SAR'}</SelectItem>
                      <SelectItem value="medium">{isAr ? '100,000 - 300,000 SAR' : '100,000 - 300,000 SAR'}</SelectItem>
                      <SelectItem value="low">{isAr ? 'أقل من 100,000 SAR' : 'Less than 100,000 SAR'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {isAr ? 'الفترة الزمنية' : 'Time Period'}
                  </label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger className="bg-secondary/30 border-border/50">
                      <SelectValue placeholder={isAr ? 'أي وقت' : 'Any Time'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isAr ? 'أي وقت' : 'Any Time'}</SelectItem>
                      <SelectItem value="this_month">{isAr ? 'هذا الشهر' : 'This Month'}</SelectItem>
                      <SelectItem value="next_3months">{isAr ? 'خلال 3 أشهر' : 'Next 3 Months'}</SelectItem>
                      <SelectItem value="this_year">{isAr ? 'هذا العام' : 'This Year'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filter Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">{isAr ? 'الفلاتر النشطة:' : 'Active filters:'}</span>
                  {filterType !== 'all' && (
                    <button onClick={() => setFilterType('all')} className="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs border border-orange-500/30 hover:bg-orange-500/20">
                      <Tag className="w-3 h-3" />
                      {isAr ? EVENT_TYPES.find(t => t.id === filterType)?.label.ar : EVENT_TYPES.find(t => t.id === filterType)?.label.en}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {filterSector !== 'all' && (
                    <button onClick={() => setFilterSector('all')} className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs border border-blue-500/30 hover:bg-blue-500/20">
                      <Tag className="w-3 h-3" />
                      {isAr ? SECTOR_LABELS[filterSector]?.ar : SECTOR_LABELS[filterSector]?.en}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {filterCity !== 'all' && (
                    <button onClick={() => setFilterCity('all')} className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs border border-green-500/30 hover:bg-green-500/20">
                      <MapPin className="w-3 h-3" />
                      {filterCity}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {filterPrize !== 'all' && (
                    <button onClick={() => setFilterPrize('all')} className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs border border-yellow-500/30 hover:bg-yellow-500/20">
                      <Award className="w-3 h-3" />
                      {filterPrize === 'high' ? '+300K' : filterPrize === 'medium' ? '100K-300K' : '<100K'}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Events Grid/List */}
      <div className="relative px-6 pb-24">
        <div className="container max-w-7xl mx-auto">
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-xl font-semibold text-foreground mb-2">{isAr ? 'لا توجد فعاليات مطابقة' : 'No matching events'}</p>
              <p className="text-muted-foreground mb-4">{isAr ? 'جرّب تعديل الفلاتر أو البحث بكلمات مختلفة' : 'Try adjusting filters or searching with different keywords'}</p>
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
              </Button>
            </div>
          )}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-4'}>
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
                  className={`bg-card/50 border-border/50 backdrop-blur-sm hover:border-orange-500/30 transition-all ${viewMode === 'list' ? 'flex flex-row' : ''} ${
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

      {/* ===== SAVE FILTER MODAL ===== */}
      {showSaveFilterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSaveFilterModal(false); }}
        >
          <div className="w-full max-w-sm mx-4 rounded-2xl bg-card border border-border/60 shadow-2xl p-6" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {isAr ? 'حفظ إعدادات الفلتر' : 'Save Filter Settings'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAr ? 'سيتم حفظ الفلاتر الحالية للاستخدام لاحقاً' : 'Current filters will be saved for future use'}
                </p>
              </div>
            </div>

            {/* Active Filters Summary */}
            <div className="mb-4 p-3 rounded-xl bg-secondary/30 border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                {isAr ? 'الفلاتر الحالية:' : 'Current filters:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {filterType !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">{isAr ? EVENT_TYPES.find(t => t.id === filterType)?.label.ar : EVENT_TYPES.find(t => t.id === filterType)?.label.en}</span>}
                {filterSector !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{isAr ? SECTOR_LABELS[filterSector]?.ar : SECTOR_LABELS[filterSector]?.en}</span>}
                {filterStatus !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{filterStatus}</span>}
                {filterCity !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{filterCity}</span>}
                {filterPrize !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{filterPrize === 'high' ? '+300K SAR' : filterPrize === 'medium' ? '100K-300K SAR' : '<100K SAR'}</span>}
                {filterDate !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">{filterDate}</span>}
                {searchQuery && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">"‏{searchQuery}‏"</span>}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-5">
              <label className="text-sm font-medium text-foreground mb-2 block">
                {isAr ? 'اسم الفلتر' : 'Filter Name'}
              </label>
              <input
                type="text"
                value={newFilterName}
                onChange={e => setNewFilterName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveCurrentFilter(); }}
                placeholder={isAr ? 'مثال: فعاليات الطاقة في الرياض' : 'e.g., Energy events in Riyadh'}
                className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground/50 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSaveCurrentFilter}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {isAr ? 'حفظ' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => { setShowSaveFilterModal(false); setNewFilterName(''); }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
