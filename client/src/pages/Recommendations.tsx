import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, ArrowLeft, Building2, TrendingUp, Target, 
  MessageSquare, Eye, Star, MapPin, Briefcase, DollarSign,
  Users, CheckCircle2, Zap, Brain, Filter, RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// بيانات المستثمرين التجريبية
const investorsData = [
  {
    id: 1,
    name: 'أحمد الراشد',
    nameEn: 'Ahmed Al-Rashid',
    company: 'Venture Capital Partners',
    avatar: 'أ',
    location: 'دبي، الإمارات',
    locationEn: 'Dubai, UAE',
    sectors: ['healthcare', 'fintech'],
    stages: ['mvp', 'growth'],
    fundingRange: { min: 500000, max: 5000000 },
    matchScore: 95,
    investments: 24,
    successRate: 78,
    verified: true,
    bio: 'مستثمر متخصص في التقنية الصحية والمالية مع خبرة 15 عاماً',
    bioEn: 'Investor specializing in HealthTech and FinTech with 15 years of experience',
    matchReasons: ['قطاع متطابق', 'مرحلة مناسبة', 'نطاق تمويل متوافق'],
    matchReasonsEn: ['Matching sector', 'Suitable stage', 'Compatible funding range'],
  },
  {
    id: 2,
    name: 'سارة المنصور',
    nameEn: 'Sara Al-Mansour',
    company: 'Innovation Fund',
    avatar: 'س',
    location: 'الرياض، السعودية',
    locationEn: 'Riyadh, Saudi Arabia',
    sectors: ['education', 'healthcare'],
    stages: ['idea', 'prototype', 'mvp'],
    fundingRange: { min: 100000, max: 2000000 },
    matchScore: 88,
    investments: 18,
    successRate: 82,
    verified: true,
    bio: 'مستثمرة ملائكية تركز على الشركات الناشئة في مراحلها المبكرة',
    bioEn: 'Angel investor focusing on early-stage startups',
    matchReasons: ['اهتمام بالقطاع', 'دعم المراحل المبكرة'],
    matchReasonsEn: ['Sector interest', 'Early stage support'],
  },
  {
    id: 3,
    name: 'محمد العتيبي',
    nameEn: 'Mohammed Al-Otaibi',
    company: 'Tech Ventures',
    avatar: 'م',
    location: 'لندن، المملكة المتحدة',
    locationEn: 'London, UK',
    sectors: ['fintech', 'logistics'],
    stages: ['growth', 'expansion'],
    fundingRange: { min: 2000000, max: 20000000 },
    matchScore: 82,
    investments: 35,
    successRate: 71,
    verified: true,
    bio: 'صندوق استثماري متخصص في التقنية المالية والتوسع الدولي',
    bioEn: 'Investment fund specializing in FinTech and international expansion',
    matchReasons: ['خبرة في القطاع', 'شبكة عالمية'],
    matchReasonsEn: ['Sector expertise', 'Global network'],
  },
  {
    id: 4,
    name: 'نورة الدوسري',
    nameEn: 'Noura Al-Dosari',
    company: 'Impact Investors',
    avatar: 'ن',
    location: 'جدة، السعودية',
    locationEn: 'Jeddah, Saudi Arabia',
    sectors: ['energy', 'education'],
    stages: ['prototype', 'mvp'],
    fundingRange: { min: 250000, max: 3000000 },
    matchScore: 76,
    investments: 12,
    successRate: 85,
    verified: false,
    bio: 'مستثمرة في الاستدامة والتأثير الاجتماعي',
    bioEn: 'Investor in sustainability and social impact',
    matchReasons: ['اهتمام بالاستدامة', 'تمويل مناسب'],
    matchReasonsEn: ['Sustainability interest', 'Suitable funding'],
  },
  {
    id: 5,
    name: 'خالد السبيعي',
    nameEn: 'Khalid Al-Subaie',
    company: 'Global Tech Fund',
    avatar: 'خ',
    location: 'سنغافورة',
    locationEn: 'Singapore',
    sectors: ['healthcare', 'logistics', 'fintech'],
    stages: ['mvp', 'growth', 'expansion'],
    fundingRange: { min: 1000000, max: 15000000 },
    matchScore: 71,
    investments: 42,
    successRate: 68,
    verified: true,
    bio: 'صندوق استثماري عالمي مع تركيز على آسيا والشرق الأوسط',
    bioEn: 'Global investment fund focusing on Asia and Middle East',
    matchReasons: ['تنوع القطاعات', 'وصول عالمي'],
    matchReasonsEn: ['Sector diversity', 'Global reach'],
  },
];

const sectorLabels: Record<string, { ar: string; en: string }> = {
  healthcare: { ar: 'الرعاية الصحية', en: 'Healthcare' },
  fintech: { ar: 'التقنية المالية', en: 'FinTech' },
  education: { ar: 'التعليم', en: 'Education' },
  energy: { ar: 'الطاقة', en: 'Energy' },
  logistics: { ar: 'اللوجستيات', en: 'Logistics' },
};

const stageLabels: Record<string, { ar: string; en: string }> = {
  idea: { ar: 'فكرة', en: 'Idea' },
  prototype: { ar: 'نموذج أولي', en: 'Prototype' },
  mvp: { ar: 'MVP', en: 'MVP' },
  growth: { ar: 'نمو', en: 'Growth' },
  expansion: { ar: 'توسع', en: 'Expansion' },
};

export default function Recommendations() {
  const { language, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-cyan-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getMatchBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20';
    if (score >= 75) return 'bg-cyan-500/20';
    if (score >= 60) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  };

  const filteredInvestors = investorsData.filter(inv => {
    if (activeTab === 'all') return true;
    if (activeTab === 'high') return inv.matchScore >= 85;
    if (activeTab === 'verified') return inv.verified;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  {language === 'ar' ? 'التوصيات الذكية' : 'Smart Recommendations'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مستثمرون مناسبون لمشروعك' : 'Suitable investors for your project'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {language === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              {language === 'ar' ? 'فلترة' : 'Filter'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* AI Matching Info */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  {language === 'ar' ? 'نظام المطابقة الذكي' : 'Smart Matching System'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'يحلل نظامنا الذكي بيانات مشروعك (القطاع، المرحلة، التمويل المطلوب) ويطابقها مع تفضيلات المستثمرين للحصول على أفضل التوصيات.'
                    : 'Our AI system analyzes your project data (sector, stage, required funding) and matches it with investor preferences for the best recommendations.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">
              {language === 'ar' ? 'الكل' : 'All'} ({investorsData.length})
            </TabsTrigger>
            <TabsTrigger value="high">
              {language === 'ar' ? 'تطابق عالي' : 'High Match'} ({investorsData.filter(i => i.matchScore >= 85).length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              {language === 'ar' ? 'موثقين' : 'Verified'} ({investorsData.filter(i => i.verified).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Investors Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredInvestors.map((investor) => (
            <Card key={investor.id} className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden card-hover">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg">
                        {investor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {language === 'ar' ? investor.name : investor.nameEn}
                        </h3>
                        {investor.verified && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{investor.company}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {language === 'ar' ? investor.location : investor.locationEn}
                      </p>
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  <div className={`text-center p-3 rounded-xl ${getMatchBg(investor.matchScore)}`}>
                    <div className={`text-2xl font-bold ${getMatchColor(investor.matchScore)}`}>
                      {investor.matchScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'تطابق' : 'Match'}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'ar' ? investor.bio : investor.bioEn}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <Briefcase className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <div className="text-lg font-semibold">{investor.investments}</div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'استثمار' : 'Investments'}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <div className="text-lg font-semibold">{investor.successRate}%</div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'نجاح' : 'Success'}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <DollarSign className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <div className="text-lg font-semibold">
                      {(investor.fundingRange.max / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'حد أقصى' : 'Max'}
                    </div>
                  </div>
                </div>

                {/* Sectors & Stages */}
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {investor.sectors.map((sector) => (
                      <Badge key={sector} variant="outline" className="text-xs">
                        {language === 'ar' ? sectorLabels[sector]?.ar : sectorLabels[sector]?.en}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {investor.stages.map((stage) => (
                      <Badge key={stage} className="text-xs bg-secondary/50 text-muted-foreground border-0">
                        {language === 'ar' ? stageLabels[stage]?.ar : stageLabels[stage]?.en}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="p-3 rounded-lg bg-secondary/30 mb-4">
                  <div className="text-xs font-medium mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {language === 'ar' ? 'أسباب التطابق:' : 'Match Reasons:'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(language === 'ar' ? investor.matchReasons : investor.matchReasonsEn).map((reason, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        • {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <MessageSquare className="w-4 h-4 ml-2" />
                    {language === 'ar' ? 'تواصل' : 'Contact'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 ml-2" />
                    {language === 'ar' ? 'الملف' : 'Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInvestors.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ar' ? 'لا توجد توصيات' : 'No Recommendations'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'أكمل بيانات مشروعك للحصول على توصيات مخصصة'
                : 'Complete your project data to get personalized recommendations'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
