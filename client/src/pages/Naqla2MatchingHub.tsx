import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Bell, BellRing, Building2, Zap, GraduationCap, Users, Lightbulb,
  Search, Filter, Star, ArrowRight, CheckCircle2, Clock, Target,
  Briefcase, Globe, TrendingUp, MessageSquare, Eye, Handshake,
  AlertCircle, Cpu, Heart, Leaf, Factory, Wifi, Shield
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const SECTORS = [
  { id: 'energy', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'health', icon: Heart, color: 'from-red-500 to-pink-500' },
  { id: 'ai', icon: Cpu, color: 'from-blue-500 to-cyan-500' },
  { id: 'sustainability', icon: Leaf, color: 'from-green-500 to-emerald-500' },
  { id: 'industry', icon: Factory, color: 'from-gray-500 to-slate-600' },
  { id: 'iot', icon: Wifi, color: 'from-purple-500 to-violet-500' },
  { id: 'fintech', icon: TrendingUp, color: 'from-indigo-500 to-blue-600' },
  { id: 'security', icon: Shield, color: 'from-orange-500 to-red-500' },
];

const ENTITY_TYPES = [
  { id: 'incubator', icon: Building2, color: 'from-blue-500 to-cyan-600' },
  { id: 'accelerator', icon: Zap, color: 'from-purple-500 to-pink-600' },
  { id: 'company', icon: Briefcase, color: 'from-green-500 to-emerald-600' },
  { id: 'event_organizer', icon: Globe, color: 'from-orange-500 to-red-600' },
  { id: 'investor', icon: TrendingUp, color: 'from-yellow-500 to-orange-600' },
  { id: 'volunteer', icon: Users, color: 'from-pink-500 to-rose-600' },
];

// Mock data for demonstration - in production this comes from DB
const MOCK_INNOVATIONS = [
  {
    id: 1,
    title: 'نظام ذكاء اصطناعي لتحسين كفاءة الطاقة الشمسية',
    titleEn: 'AI System for Solar Energy Efficiency Optimization',
    sector: 'energy',
    trl: 3,
    score: 92,
    innovatorName: 'أحمد المطيري',
    innovatorNameEn: 'Ahmed Al-Mutairi',
    description: 'نظام يستخدم خوارزميات التعلم الآلي لتحسين توجيه الألواح الشمسية وزيادة الكفاءة بنسبة 35%',
    descriptionEn: 'A system using ML algorithms to optimize solar panel orientation and increase efficiency by 35%',
    matchScore: 95,
    tags: ['ai', 'energy', 'sustainability'],
    routedAt: '2025-01-15',
    status: 'available',
  },
  {
    id: 2,
    title: 'منصة تشخيص طبي عن بعد بالذكاء الاصطناعي',
    titleEn: 'AI-Powered Remote Medical Diagnosis Platform',
    sector: 'health',
    trl: 4,
    score: 88,
    innovatorName: 'سارة الزهراني',
    innovatorNameEn: 'Sara Al-Zahrani',
    description: 'منصة تمكن الأطباء من تشخيص الأمراض عن بعد باستخدام صور طبية محللة بالذكاء الاصطناعي',
    descriptionEn: 'Platform enabling remote disease diagnosis using AI-analyzed medical images',
    matchScore: 87,
    tags: ['health', 'ai', 'telemedicine'],
    routedAt: '2025-01-18',
    status: 'available',
  },
  {
    id: 3,
    title: 'حل إنترنت الأشياء لمراقبة سلاسل التوريد',
    titleEn: 'IoT Solution for Supply Chain Monitoring',
    sector: 'iot',
    trl: 5,
    score: 85,
    innovatorName: 'محمد الغامدي',
    innovatorNameEn: 'Mohammed Al-Ghamdi',
    description: 'نظام IoT متكامل لتتبع ومراقبة سلاسل التوريد في الوقت الفعلي مع تنبيهات ذكية',
    descriptionEn: 'Integrated IoT system for real-time supply chain tracking with smart alerts',
    matchScore: 82,
    tags: ['iot', 'industry', 'logistics'],
    routedAt: '2025-01-20',
    status: 'negotiating',
  },
  {
    id: 4,
    title: 'تقنية تحلية مياه منخفضة الطاقة',
    titleEn: 'Low-Energy Water Desalination Technology',
    sector: 'sustainability',
    trl: 3,
    score: 90,
    innovatorName: 'نورة العتيبي',
    innovatorNameEn: 'Noura Al-Otaibi',
    description: 'تقنية جديدة لتحلية المياه تستهلك 60% أقل من الطاقة مقارنة بالأنظمة التقليدية',
    descriptionEn: 'New desalination technology consuming 60% less energy than traditional systems',
    matchScore: 91,
    tags: ['sustainability', 'energy', 'water'],
    routedAt: '2025-01-22',
    status: 'available',
  },
];

const MOCK_ENTITIES = [
  {
    id: 1,
    name: 'حاضنة أرامكو للابتكار',
    nameEn: 'Aramco Innovation Incubator',
    type: 'incubator',
    sectors: ['energy', 'sustainability', 'iot'],
    description: 'حاضنة متخصصة في تقنيات الطاقة والاستدامة',
    descriptionEn: 'Specialized incubator in energy and sustainability technologies',
    openPositions: 5,
    matchedInnovations: 12,
    alertsActive: true,
  },
  {
    id: 2,
    name: 'مسرّع STC للتقنية',
    nameEn: 'STC Tech Accelerator',
    type: 'accelerator',
    sectors: ['ai', 'iot', 'fintech'],
    description: 'مسرّع يدعم الشركات الناشئة في مجال التقنية والاتصالات',
    descriptionEn: 'Accelerator supporting tech and telecom startups',
    openPositions: 8,
    matchedInnovations: 24,
    alertsActive: true,
  },
  {
    id: 3,
    name: 'مستشفى الملك فيصل التخصصي',
    nameEn: 'King Faisal Specialist Hospital',
    type: 'company',
    sectors: ['health', 'ai'],
    description: 'يبحث عن حلول تقنية لتحسين جودة الرعاية الصحية',
    descriptionEn: 'Seeking tech solutions to improve healthcare quality',
    openPositions: 3,
    matchedInnovations: 7,
    alertsActive: false,
  },
  {
    id: 4,
    name: 'هاكاثون الطاقة الوطني 2025',
    nameEn: 'National Energy Hackathon 2025',
    type: 'event_organizer',
    sectors: ['energy', 'sustainability'],
    description: 'يبحث عن مبتكرين ورعاة ومتطوعين في مجال الطاقة',
    descriptionEn: 'Seeking innovators, sponsors, and volunteers in energy sector',
    openPositions: 50,
    matchedInnovations: 0,
    alertsActive: true,
    eventDate: '2025-03-15',
    needsVolunteers: true,
    needsSponsors: true,
  },
];

export default function Naqla2MatchingHub() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'innovations' | 'entities' | 'alerts'>('innovations');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertSectors, setAlertSectors] = useState<string[]>([]);
  const [showAlertSetup, setShowAlertSetup] = useState(false);

  const sectorLabels: Record<string, { ar: string; en: string }> = {
    energy: { ar: 'الطاقة', en: 'Energy' },
    health: { ar: 'الصحة', en: 'Health' },
    ai: { ar: 'الذكاء الاصطناعي', en: 'AI & Deep Tech' },
    sustainability: { ar: 'الاستدامة', en: 'Sustainability' },
    industry: { ar: 'الصناعة', en: 'Industry' },
    iot: { ar: 'إنترنت الأشياء', en: 'IoT' },
    fintech: { ar: 'التقنية المالية', en: 'FinTech' },
    security: { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
  };

  const entityTypeLabels: Record<string, { ar: string; en: string }> = {
    incubator: { ar: 'حاضنة', en: 'Incubator' },
    accelerator: { ar: 'مسرّع', en: 'Accelerator' },
    company: { ar: 'شركة', en: 'Company' },
    event_organizer: { ar: 'منظم فعالية', en: 'Event Organizer' },
    investor: { ar: 'مستثمر', en: 'Investor' },
    volunteer: { ar: 'متطوع', en: 'Volunteer' },
  };

  const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
    available: { ar: 'متاح', en: 'Available', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    negotiating: { ar: 'قيد التفاوض', en: 'Negotiating', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    matched: { ar: 'تم التطابق', en: 'Matched', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  };

  const filteredInnovations = MOCK_INNOVATIONS.filter(inn => {
    const matchesSector = selectedSector === 'all' || inn.sector === selectedSector;
    const matchesSearch = searchQuery === '' ||
      (isAr ? inn.title : inn.titleEn).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const filteredEntities = MOCK_ENTITIES.filter(ent => {
    const matchesType = selectedType === 'all' || ent.type === selectedType;
    const matchesSector = selectedSector === 'all' || ent.sectors.includes(selectedSector);
    return matchesType && matchesSector;
  });

  const toggleAlertSector = (sector: string) => {
    setAlertSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const saveAlerts = () => {
    toast.success(isAr
      ? `تم تفعيل التنبيهات لـ ${alertSectors.length} مجال`
      : `Alerts activated for ${alertSectors.length} sectors`
    );
    setShowAlertSetup(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isAr ? 'مركز التطابق الذكي - NAQLA 2' : 'Smart Matching Hub - NAQLA 2'}
        description={isAr
          ? 'ربط الابتكارات بالحاضنات والمسرّعات والشركات والفعاليات'
          : 'Connect innovations with incubators, accelerators, companies and events'
        }
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative pt-24 pb-12 px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  NAQLA 2
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {isAr ? 'مركز التطابق الذكي' : 'Smart Matching Hub'}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                {isAr ? 'ربط الابتكارات بالفرص' : 'Connect Innovations to Opportunities'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {isAr
                  ? 'كل ابتكار اجتاز NAQLA 1 يظهر هنا. الحاضنات والمسرّعات والشركات تتلقى تنبيهات فورية بما يناسب مجالها.'
                  : 'Every innovation that passed NAQLA 1 appears here. Incubators, accelerators and companies receive instant alerts matching their sector.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAlertSetup(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <BellRing className="w-4 h-4 mr-2" />
                {isAr ? 'إعداد التنبيهات' : 'Setup Alerts'}
              </Button>
              <Link href="/naqla2/deal-room">
                <Button variant="outline">
                  <Handshake className="w-4 h-4 mr-2" />
                  {isAr ? 'غرفة التفاوض' : 'Deal Room'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { value: MOCK_INNOVATIONS.length, label: isAr ? 'ابتكار متاح' : 'Available Innovations', icon: Lightbulb, color: 'text-yellow-400' },
              { value: MOCK_ENTITIES.length, label: isAr ? 'جهة مهتمة' : 'Interested Entities', icon: Building2, color: 'text-blue-400' },
              { value: '87%', label: isAr ? 'دقة التطابق' : 'Match Accuracy', icon: Target, color: 'text-green-400' },
              { value: '24h', label: isAr ? 'متوسط وقت الاستجابة' : 'Avg Response Time', icon: Clock, color: 'text-purple-400' },
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

      {/* Alert Setup Modal */}
      {showAlertSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-blue-400" />
                {isAr ? 'إعداد التنبيهات الذكية' : 'Setup Smart Alerts'}
              </CardTitle>
              <CardDescription>
                {isAr
                  ? 'اختر المجالات التي تهتم بها وسنرسل لك تنبيهاً فور وصول ابتكار مناسب'
                  : 'Select your sectors of interest and we\'ll alert you instantly when a matching innovation arrives'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {SECTORS.map(sector => {
                  const SectorIcon = sector.icon;
                  const isSelected = alertSectors.includes(sector.id);
                  return (
                    <button
                      key={sector.id}
                      onClick={() => toggleAlertSector(sector.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-border/50 bg-secondary/30 hover:border-border'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sector.color} flex items-center justify-center`}>
                        <SectorIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {isAr ? sectorLabels[sector.id].ar : sectorLabels[sector.id].en}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 mr-auto" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={saveAlerts}
                  disabled={alertSectors.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {isAr ? `تفعيل التنبيهات (${alertSectors.length})` : `Activate Alerts (${alertSectors.length})`}
                </Button>
                <Button variant="outline" onClick={() => setShowAlertSetup(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="relative px-6 pb-24">
        <div className="container max-w-7xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border/50">
            {[
              { id: 'innovations', label: isAr ? 'الابتكارات المتاحة' : 'Available Innovations', icon: Lightbulb },
              { id: 'entities', label: isAr ? 'الجهات المهتمة' : 'Interested Entities', icon: Building2 },
              { id: 'alerts', label: isAr ? 'التنبيهات النشطة' : 'Active Alerts', icon: Bell },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isAr ? 'ابحث عن ابتكار أو جهة...' : 'Search innovations or entities...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/30 border-border/50"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full md:w-48 bg-secondary/30 border-border/50">
                <SelectValue placeholder={isAr ? 'كل المجالات' : 'All Sectors'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isAr ? 'كل المجالات' : 'All Sectors'}</SelectItem>
                {SECTORS.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {isAr ? sectorLabels[s.id].ar : sectorLabels[s.id].en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeTab === 'entities' && (
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48 bg-secondary/30 border-border/50">
                  <SelectValue placeholder={isAr ? 'كل الأنواع' : 'All Types'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAr ? 'كل الأنواع' : 'All Types'}</SelectItem>
                  {ENTITY_TYPES.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {isAr ? entityTypeLabels[t.id].ar : entityTypeLabels[t.id].en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Innovations Tab */}
          {activeTab === 'innovations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInnovations.map(inn => {
                const sectorData = SECTORS.find(s => s.id === inn.sector);
                const SectorIcon = sectorData?.icon || Lightbulb;
                const statusData = statusLabels[inn.status] || statusLabels.available;
                return (
                  <Card key={inn.id} className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-blue-500/30 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sectorData?.color || 'from-gray-500 to-slate-600'} flex items-center justify-center`}>
                            <SectorIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <Badge className={statusData.color + ' text-xs'}>
                              {isAr ? statusData.ar : statusData.en}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              TRL {inn.trl} • {isAr ? sectorLabels[inn.sector]?.ar : sectorLabels[inn.sector]?.en}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{inn.matchScore}%</div>
                          <div className="text-xs text-muted-foreground">{isAr ? 'تطابق AI' : 'AI Match'}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-bold text-foreground text-lg mb-2 leading-tight">
                        {isAr ? inn.title : inn.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {isAr ? inn.description : inn.descriptionEn}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {(isAr ? inn.innovatorName : inn.innovatorNameEn).charAt(0)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {isAr ? inn.innovatorName : inn.innovatorNameEn}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">
                            <Eye className="w-3 h-3 mr-1" />
                            {isAr ? 'عرض' : 'View'}
                          </Button>
                          {inn.status === 'available' && (
                            <Link href={`/naqla2/deal-room?innovationId=${inn.id}`}>
                              <Button size="sm" className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {isAr ? 'تفاوض' : 'Negotiate'}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Entities Tab */}
          {activeTab === 'entities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEntities.map(entity => {
                const typeData = ENTITY_TYPES.find(t => t.id === entity.type);
                const TypeIcon = typeData?.icon || Building2;
                return (
                  <Card key={entity.id} className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-purple-500/30 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeData?.color || 'from-gray-500 to-slate-600'} flex items-center justify-center`}>
                            <TypeIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <Badge className="bg-secondary/50 text-foreground border-border/50 text-xs">
                              {isAr ? entityTypeLabels[entity.type]?.ar : entityTypeLabels[entity.type]?.en}
                            </Badge>
                            {entity.alertsActive && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs text-green-400">{isAr ? 'تنبيهات نشطة' : 'Alerts Active'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-400">{entity.openPositions}</div>
                          <div className="text-xs text-muted-foreground">{isAr ? 'فرصة متاحة' : 'Open Slots'}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-bold text-foreground text-lg mb-2">
                        {isAr ? entity.name : entity.nameEn}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isAr ? entity.description : entity.descriptionEn}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {entity.sectors.map(s => (
                          <Badge key={s} className="bg-secondary/50 text-muted-foreground border-border/50 text-xs">
                            {isAr ? sectorLabels[s]?.ar : sectorLabels[s]?.en}
                          </Badge>
                        ))}
                      </div>
                      {entity.type === 'event_organizer' && (
                        <div className="flex gap-2 mb-3">
                          {(entity as any).needsVolunteers && (
                            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {isAr ? 'يحتاج متطوعين' : 'Needs Volunteers'}
                            </Badge>
                          )}
                          {(entity as any).needsSponsors && (
                            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {isAr ? 'يحتاج رعاة' : 'Needs Sponsors'}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {entity.matchedInnovations} {isAr ? 'ابتكار مطابق' : 'matched innovations'}
                        </span>
                        <Button size="sm" className="h-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          {isAr ? 'تواصل' : 'Connect'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5 text-blue-400" />
                    {isAr ? 'تنبيهاتك النشطة' : 'Your Active Alerts'}
                  </CardTitle>
                  <CardDescription>
                    {isAr
                      ? 'ستتلقى إشعاراً فورياً عند وصول ابتكار جديد في مجالاتك المفضلة'
                      : 'You\'ll receive instant notifications when a new innovation arrives in your preferred sectors'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {alertSectors.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {isAr ? 'لا توجد تنبيهات نشطة بعد' : 'No active alerts yet'}
                      </p>
                      <Button
                        onClick={() => setShowAlertSetup(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      >
                        <BellRing className="w-4 h-4 mr-2" />
                        {isAr ? 'إعداد التنبيهات الآن' : 'Setup Alerts Now'}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {alertSectors.map(sectorId => {
                        const sectorData = SECTORS.find(s => s.id === sectorId);
                        const SectorIcon = sectorData?.icon || Lightbulb;
                        return (
                          <div key={sectorId} className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${sectorData?.color || 'from-gray-500 to-slate-600'} bg-opacity-10`}>
                            <SectorIcon className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">
                              {isAr ? sectorLabels[sectorId]?.ar : sectorLabels[sectorId]?.en}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Alert Notifications */}
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{isAr ? 'آخر التنبيهات' : 'Recent Notifications'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        title: isAr ? 'ابتكار جديد في الطاقة' : 'New Energy Innovation',
                        desc: isAr ? 'نظام ذكاء اصطناعي لتحسين كفاءة الطاقة الشمسية - TRL 3' : 'AI system for solar energy efficiency - TRL 3',
                        time: isAr ? 'منذ ساعتين' : '2 hours ago',
                        color: 'bg-yellow-500/10 border-yellow-500/30',
                        icon: Zap,
                        iconColor: 'text-yellow-400',
                      },
                      {
                        title: isAr ? 'فعالية جديدة تبحث عن مبتكرين' : 'New Event Seeking Innovators',
                        desc: isAr ? 'هاكاثون الطاقة الوطني 2025 - يبحث عن مبتكرين ورعاة' : 'National Energy Hackathon 2025 - seeking innovators & sponsors',
                        time: isAr ? 'منذ 5 ساعات' : '5 hours ago',
                        color: 'bg-blue-500/10 border-blue-500/30',
                        icon: Globe,
                        iconColor: 'text-blue-400',
                      },
                      {
                        title: isAr ? 'حاضنة تبحث عن ابتكارات في الاستدامة' : 'Incubator Seeking Sustainability Innovations',
                        desc: isAr ? 'حاضنة أرامكو للابتكار - 5 مقاعد متاحة' : 'Aramco Innovation Incubator - 5 slots available',
                        time: isAr ? 'منذ يوم' : '1 day ago',
                        color: 'bg-green-500/10 border-green-500/30',
                        icon: Building2,
                        iconColor: 'text-green-400',
                      },
                    ].map((notif, i) => {
                      const NotifIcon = notif.icon;
                      return (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${notif.color}`}>
                          <NotifIcon className={`w-5 h-5 ${notif.iconColor} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm">{notif.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">{notif.desc}</div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
