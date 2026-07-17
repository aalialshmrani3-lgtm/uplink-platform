import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Award, TrendingUp, ShoppingCart, Building2, CheckCircle2, Clock,
  AlertCircle, ArrowRight, FileText, Shield, Zap, Star, Lock,
  ChevronRight, Users, BarChart3, DollarSign, Globe, Gavel,
  FileCheck, ScrollText, Handshake, Eye, Download, Plus,
  CircleDollarSign, Layers, Target, Briefcase, ArrowUpRight,
  CheckSquare, XCircle, Timer, Sparkles, TrendingDown, Activity
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

// ===================== MOCK DATA =====================

const MOCK_PATENTS = [
  {
    id: 1,
    title: 'نظام ذكاء اصطناعي لتحسين كفاءة الطاقة الشمسية',
    titleEn: 'AI System for Solar Energy Efficiency Optimization',
    type: 'utility',
    status: 'granted',
    filingDate: '2024-06-15',
    grantDate: '2025-01-10',
    expiryDate: '2044-06-15',
    registrationNo: 'SA-2024-001234',
    jurisdiction: 'Saudi Arabia',
    jurisdictionAr: 'المملكة العربية السعودية',
    estimatedValue: '2,500,000 SAR',
    category: 'energy',
    description: 'نظام متكامل يستخدم خوارزميات التعلم الآلي لتحسين توجيه الألواح الشمسية',
    descriptionEn: 'Integrated system using machine learning algorithms to optimize solar panel orientation',
    renewalDue: '2026-06-15',
    renewalFee: '15,000 SAR',
  },
  {
    id: 2,
    title: 'منصة تشخيص طبي عن بعد بالذكاء الاصطناعي',
    titleEn: 'AI-Powered Remote Medical Diagnosis Platform',
    type: 'software',
    status: 'pending',
    filingDate: '2024-11-20',
    grantDate: null,
    expiryDate: null,
    registrationNo: 'SA-2024-005678',
    jurisdiction: 'Saudi Arabia + GCC',
    jurisdictionAr: 'المملكة العربية السعودية + دول الخليج',
    estimatedValue: '4,200,000 SAR',
    category: 'health',
    description: 'منصة تجمع بين الذكاء الاصطناعي وتقنيات التصوير الطبي للتشخيص عن بعد',
    descriptionEn: 'Platform combining AI and medical imaging technologies for remote diagnosis',
    renewalDue: null,
    renewalFee: null,
  },
  {
    id: 3,
    title: 'تقنية تحلية مياه منخفضة الطاقة',
    titleEn: 'Low-Energy Water Desalination Technology',
    type: 'utility',
    status: 'licensed',
    filingDate: '2023-08-01',
    grantDate: '2024-03-15',
    expiryDate: '2043-08-01',
    registrationNo: 'SA-2023-009012',
    jurisdiction: 'Saudi Arabia + International',
    jurisdictionAr: 'المملكة العربية السعودية + دولي',
    estimatedValue: '8,000,000 SAR',
    category: 'water',
    description: 'تقنية مبتكرة تخفض استهلاك الطاقة في تحلية المياه بنسبة 60%',
    descriptionEn: 'Innovative technology reducing energy consumption in water desalination by 60%',
    renewalDue: '2025-08-01',
    renewalFee: '25,000 SAR',
  },
];

const MOCK_SALES = [
  {
    id: 1,
    assetTitle: 'نظام ذكاء اصطناعي لتحسين كفاءة الطاقة الشمسية',
    assetTitleEn: 'AI System for Solar Energy Efficiency',
    saleType: 'licensing',
    buyer: 'أرامكو السعودية',
    buyerEn: 'Saudi Aramco',
    askingPrice: '1,500,000 SAR',
    offeredPrice: '1,200,000 SAR',
    finalPrice: null,
    status: 'negotiating',
    startDate: '2025-01-15',
    category: 'energy',
    progress: 65,
    milestones: [
      { name: 'تقديم العرض', nameEn: 'Offer Submitted', done: true },
      { name: 'مراجعة قانونية', nameEn: 'Legal Review', done: true },
      { name: 'التفاوض على السعر', nameEn: 'Price Negotiation', done: false },
      { name: 'توقيع العقد', nameEn: 'Contract Signing', done: false },
    ],
  },
  {
    id: 2,
    assetTitle: 'تقنية تحلية مياه منخفضة الطاقة',
    assetTitleEn: 'Low-Energy Water Desalination Technology',
    saleType: 'full_sale',
    buyer: 'مجموعة ACWA Power',
    buyerEn: 'ACWA Power Group',
    askingPrice: '12,000,000 SAR',
    offeredPrice: '10,500,000 SAR',
    finalPrice: '11,000,000 SAR',
    status: 'completed',
    startDate: '2024-10-01',
    category: 'water',
    progress: 100,
    milestones: [
      { name: 'تقديم العرض', nameEn: 'Offer Submitted', done: true },
      { name: 'مراجعة قانونية', nameEn: 'Legal Review', done: true },
      { name: 'التفاوض على السعر', nameEn: 'Price Negotiation', done: true },
      { name: 'توقيع العقد', nameEn: 'Contract Signing', done: true },
    ],
  },
  {
    id: 3,
    assetTitle: 'منصة تشخيص طبي عن بعد',
    assetTitleEn: 'Remote Medical Diagnosis Platform',
    saleType: 'acquisition',
    buyer: 'مجموعة الصحة الوطنية',
    buyerEn: 'National Health Group',
    askingPrice: '25,000,000 SAR',
    offeredPrice: null,
    finalPrice: null,
    status: 'listing',
    startDate: '2025-01-22',
    category: 'health',
    progress: 20,
    milestones: [
      { name: 'نشر الإعلان', nameEn: 'Listing Published', done: true },
      { name: 'مراجعة قانونية', nameEn: 'Legal Review', done: false },
      { name: 'التفاوض على السعر', nameEn: 'Price Negotiation', done: false },
      { name: 'توقيع العقد', nameEn: 'Contract Signing', done: false },
    ],
  },
];

const MOCK_ACQUISITIONS = [
  {
    id: 1,
    targetName: 'شركة تقنيات الطاقة المتجددة',
    targetNameEn: 'Renewable Energy Technologies Co.',
    acquirer: 'صندوق الاستثمارات العامة',
    acquirerEn: 'Public Investment Fund',
    dealValue: '45,000,000 SAR',
    status: 'due_diligence',
    stage: 3,
    totalStages: 6,
    startDate: '2024-12-01',
    expectedClose: '2025-06-30',
    category: 'energy',
    description: 'استحواذ كامل على شركة متخصصة في تقنيات الطاقة الشمسية وتخزين الطاقة',
    descriptionEn: 'Full acquisition of a company specializing in solar energy and energy storage technologies',
    stages: [
      { name: 'LOI', nameAr: 'خطاب النية', done: true },
      { name: 'NDA', nameAr: 'اتفاقية عدم الإفصاح', done: true },
      { name: 'Due Diligence', nameAr: 'الفحص القانوني والمالي', done: false, active: true },
      { name: 'Valuation', nameAr: 'التقييم النهائي', done: false },
      { name: 'Negotiation', nameAr: 'التفاوض النهائي', done: false },
      { name: 'Closing', nameAr: 'إتمام الصفقة', done: false },
    ],
  },
];

// ===================== STATUS CONFIGS =====================

const patentStatusConfig: Record<string, { ar: string; en: string; color: string; icon: any }> = {
  granted: { ar: 'ممنوح', en: 'Granted', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
  pending: { ar: 'قيد المراجعة', en: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock },
  licensed: { ar: 'مرخّص', en: 'Licensed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: FileCheck },
  expired: { ar: 'منتهي', en: 'Expired', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
};

const saleStatusConfig: Record<string, { ar: string; en: string; color: string; icon: any }> = {
  listing: { ar: 'معروض للبيع', en: 'Listed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Eye },
  negotiating: { ar: 'قيد التفاوض', en: 'Negotiating', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Handshake },
  completed: { ar: 'مكتمل', en: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
  cancelled: { ar: 'ملغى', en: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
};

const saleTypeConfig: Record<string, { ar: string; en: string; color: string }> = {
  licensing: { ar: 'ترخيص', en: 'Licensing', color: 'text-purple-400' },
  full_sale: { ar: 'بيع كامل', en: 'Full Sale', color: 'text-green-400' },
  acquisition: { ar: 'استحواذ', en: 'Acquisition', color: 'text-blue-400' },
};

const acqStatusConfig: Record<string, { ar: string; en: string; color: string }> = {
  due_diligence: { ar: 'الفحص القانوني', en: 'Due Diligence', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  completed: { ar: 'مكتمل', en: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  negotiating: { ar: 'قيد التفاوض', en: 'Negotiating', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
};

// ===================== MAIN COMPONENT =====================

type TabType = 'overview' | 'patents' | 'sales' | 'acquisitions';

export default function Naqla3Dashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedPatent, setSelectedPatent] = useState<typeof MOCK_PATENTS[0] | null>(null);
  const [selectedSale, setSelectedSale] = useState<typeof MOCK_SALES[0] | null>(null);

  const totalPatentValue = 14700000;
  const totalSalesValue = 11000000;
  const pendingDeals = 2;

  const tabs: { key: TabType; icon: any; labelAr: string; labelEn: string; count?: number }[] = [
    { key: 'overview', icon: BarChart3, labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'patents', icon: Award, labelAr: 'التصاريح والملكية الفكرية', labelEn: 'Patents & IP', count: MOCK_PATENTS.length },
    { key: 'sales', icon: ShoppingCart, labelAr: 'عمليات البيع', labelEn: 'Sales Operations', count: MOCK_SALES.length },
    { key: 'acquisitions', icon: Building2, labelAr: 'الاستحواذ', labelEn: 'Acquisitions', count: MOCK_ACQUISITIONS.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isAr ? 'لوحة NAQLA 3 - التصاريح والبيع والاستحواذ' : 'NAQLA 3 Dashboard - Patents, Sales & Acquisitions'}
        description={isAr ? 'إدارة التصاريح والملكية الفكرية وعمليات البيع والاستحواذ' : 'Manage patents, intellectual property, sales and acquisitions'}
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <div className="relative pt-24 pb-8 px-6 border-b border-border/50">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link href="/naqla2/deal-room">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                    {isAr ? 'غرفة التفاوض' : 'Deal Room'}
                  </Button>
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">NAQLA 3</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {isAr ? 'لوحة NAQLA 3' : 'NAQLA 3 Dashboard'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {isAr ? 'التصاريح والملكية الفكرية • البيع والترخيص • الاستحواذ النهائي' : 'Patents & IP • Sales & Licensing • Final Acquisition'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                {isAr ? 'محمي قانونياً' : 'Legally Protected'}
              </Badge>
              <Button
                onClick={() => toast.success(isAr ? 'جاري فتح نموذج التسجيل...' : 'Opening registration form...')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAr ? 'تسجيل ملكية فكرية جديدة' : 'Register New IP'}
              </Button>
            </div>
          </div>

          {/* Journey Progress */}
          <div className="mt-6 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-0 flex-wrap">
              {[
                { stage: 'NAQLA 1', desc: isAr ? 'الفكرة والتقييم' : 'Idea & Evaluation', done: true },
                { stage: 'NAQLA 2', desc: isAr ? 'التطابق والتفاوض' : 'Matching & Negotiation', done: true },
                { stage: 'NAQLA 3', desc: isAr ? 'التصريح والبيع' : 'Licensing & Sale', done: false, active: true },
              ].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    step.active ? 'bg-amber-500/20 border border-amber-500/40' :
                    step.done ? 'bg-green-500/10' : 'bg-secondary/30'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.done ? 'bg-green-500 text-white' :
                      step.active ? 'bg-amber-500 text-white' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{step.stage}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                  {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex gap-1 overflow-x-auto py-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {isAr ? tab.labelAr : tab.labelEn}
                  {tab.count !== undefined && (
                    <Badge className="bg-secondary/50 text-muted-foreground border-0 text-xs px-1.5 py-0 ml-1">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-6 py-8">
        <div className="container max-w-7xl mx-auto">

          {/* ========== OVERVIEW TAB ========== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Award,
                    color: 'from-amber-500 to-orange-600',
                    bg: 'bg-amber-500/10',
                    value: MOCK_PATENTS.length,
                    labelAr: 'تصاريح مسجلة',
                    labelEn: 'Registered Patents',
                    subAr: `${MOCK_PATENTS.filter(p => p.status === 'granted').length} ممنوح`,
                    subEn: `${MOCK_PATENTS.filter(p => p.status === 'granted').length} granted`,
                  },
                  {
                    icon: CircleDollarSign,
                    color: 'from-green-500 to-emerald-600',
                    bg: 'bg-green-500/10',
                    value: '14.7M SAR',
                    labelAr: 'إجمالي قيمة الملكية الفكرية',
                    labelEn: 'Total IP Value',
                    subAr: 'تقدير السوق',
                    subEn: 'Market Estimate',
                  },
                  {
                    icon: ShoppingCart,
                    color: 'from-blue-500 to-cyan-600',
                    bg: 'bg-blue-500/10',
                    value: MOCK_SALES.length,
                    labelAr: 'عمليات بيع',
                    labelEn: 'Sales Operations',
                    subAr: `${MOCK_SALES.filter(s => s.status === 'completed').length} مكتمل`,
                    subEn: `${MOCK_SALES.filter(s => s.status === 'completed').length} completed`,
                  },
                  {
                    icon: Target,
                    color: 'from-purple-500 to-violet-600',
                    bg: 'bg-purple-500/10',
                    value: pendingDeals,
                    labelAr: 'صفقات معلقة',
                    labelEn: 'Pending Deals',
                    subAr: 'تحتاج متابعة',
                    subEn: 'Need attention',
                  },
                ].map((kpi, i) => {
                  const Icon = kpi.icon;
                  return (
                    <Card key={i} className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{isAr ? kpi.labelAr : kpi.labelEn}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{isAr ? kpi.subAr : kpi.subEn}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity + Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Patents */}
                <div className="lg:col-span-2">
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        {isAr ? 'آخر النشاطات' : 'Recent Activity'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {[
                          { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', textAr: 'تم منح براءة اختراع نظام الطاقة الشمسية', textEn: 'Solar energy system patent granted', time: 'منذ يومين' },
                          { icon: Handshake, color: 'text-blue-400', bg: 'bg-blue-500/10', textAr: 'بدأ التفاوض على بيع نظام الطاقة لأرامكو', textEn: 'Negotiation started for solar system sale to Aramco', time: 'منذ 5 أيام' },
                          { icon: FileCheck, color: 'text-purple-400', bg: 'bg-purple-500/10', textAr: 'تم تقديم طلب تسجيل المنصة الطبية', textEn: 'Medical platform registration application submitted', time: 'منذ أسبوع' },
                          { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', textAr: 'اكتملت صفقة بيع تقنية تحلية المياه بـ 11M SAR', textEn: 'Water desalination technology sale completed at 11M SAR', time: 'منذ شهر' },
                        ].map((activity, i) => {
                          const Icon = activity.icon;
                          return (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/80 transition-colors">
                              <div className={`w-8 h-8 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${activity.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">{isAr ? activity.textAr : activity.textEn}</p>
                              </div>
                              <span className="text-xs text-muted-foreground/60 whitespace-nowrap">{activity.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { icon: Award, labelAr: 'تسجيل براءة اختراع', labelEn: 'Register Patent', color: 'text-amber-400', bg: 'hover:bg-amber-500/10' },
                        { icon: ShoppingCart, labelAr: 'إضافة عرض بيع', labelEn: 'Add Sale Listing', color: 'text-blue-400', bg: 'hover:bg-blue-500/10' },
                        { icon: Building2, labelAr: 'بدء عملية استحواذ', labelEn: 'Start Acquisition', color: 'text-purple-400', bg: 'hover:bg-purple-500/10' },
                        { icon: FileText, labelAr: 'توليد تقرير الملكية', labelEn: 'Generate IP Report', color: 'text-green-400', bg: 'hover:bg-green-500/10' },
                        { icon: Globe, labelAr: 'تسجيل دولي', labelEn: 'International Filing', color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10' },
                      ].map((action, i) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => toast.info(isAr ? 'قريباً...' : 'Coming soon...')}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border border-border/30 ${action.bg} transition-all text-left`}
                          >
                            <Icon className={`w-4 h-4 ${action.color}`} />
                            <span className="text-sm text-foreground">{isAr ? action.labelAr : action.labelEn}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Renewal Alerts */}
                  <Card className="bg-amber-500/5 border-amber-500/20 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        {isAr ? 'تنبيهات التجديد' : 'Renewal Alerts'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {MOCK_PATENTS.filter(p => p.renewalDue).map(patent => (
                        <div key={patent.id} className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs font-medium text-amber-300 line-clamp-1">
                            {isAr ? patent.title : patent.titleEn}
                          </p>
                          <p className="text-xs text-amber-400/70 mt-0.5">
                            {isAr ? 'تجديد:' : 'Renewal:'} {patent.renewalDue} • {patent.renewalFee}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ========== PATENTS TAB ========== */}
          {activeTab === 'patents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  {isAr ? 'التصاريح والملكية الفكرية' : 'Patents & Intellectual Property'}
                </h2>
                <Button
                  onClick={() => toast.success(isAr ? 'جاري فتح نموذج التسجيل...' : 'Opening registration form...')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'تسجيل جديد' : 'New Registration'}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Patent List */}
                <div className="space-y-3">
                  {MOCK_PATENTS.map(patent => {
                    const status = patentStatusConfig[patent.status];
                    const StatusIcon = status.icon;
                    const isSelected = selectedPatent?.id === patent.id;
                    return (
                      <button
                        key={patent.id}
                        onClick={() => setSelectedPatent(patent)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-amber-500/50 bg-amber-500/5'
                            : 'border-border/50 bg-card/50 hover:border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={status.color + ' text-xs'}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {isAr ? status.ar : status.en}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{patent.type}</span>
                        </div>
                        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                          {isAr ? patent.title : patent.titleEn}
                        </h3>
                        <p className="text-xs text-amber-400 font-semibold">{patent.estimatedValue}</p>
                        <p className="text-xs text-muted-foreground mt-1">{patent.registrationNo}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Patent Detail */}
                {selectedPatent ? (
                  <div className="lg:col-span-2">
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <CardHeader className="border-b border-border/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className={patentStatusConfig[selectedPatent.status].color + ' mb-2'}>
                              {isAr ? patentStatusConfig[selectedPatent.status].ar : patentStatusConfig[selectedPatent.status].en}
                            </Badge>
                            <h3 className="text-lg font-bold text-foreground">
                              {isAr ? selectedPatent.title : selectedPatent.titleEn}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-400">{selectedPatent.estimatedValue}</p>
                            <p className="text-xs text-muted-foreground">{isAr ? 'القيمة التقديرية' : 'Estimated Value'}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {[
                            { labelAr: 'رقم التسجيل', labelEn: 'Registration No.', value: selectedPatent.registrationNo },
                            { labelAr: 'النطاق الجغرافي', labelEn: 'Jurisdiction', value: isAr ? selectedPatent.jurisdictionAr : selectedPatent.jurisdiction },
                            { labelAr: 'تاريخ التقديم', labelEn: 'Filing Date', value: selectedPatent.filingDate },
                            { labelAr: 'تاريخ الانتهاء', labelEn: 'Expiry Date', value: selectedPatent.expiryDate || (isAr ? 'قيد المراجعة' : 'Under Review') },
                          ].map((item, i) => (
                            <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/30">
                              <p className="text-xs text-muted-foreground mb-1">{isAr ? item.labelAr : item.labelEn}</p>
                              <p className="text-sm font-medium text-foreground">{item.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border/30 mb-4">
                          <p className="text-xs text-muted-foreground mb-1">{isAr ? 'الوصف' : 'Description'}</p>
                          <p className="text-sm text-foreground">{isAr ? selectedPatent.description : selectedPatent.descriptionEn}</p>
                        </div>
                        {selectedPatent.renewalDue && (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-400" />
                              <p className="text-sm text-amber-300">
                                {isAr ? `موعد التجديد: ${selectedPatent.renewalDue} • الرسوم: ${selectedPatent.renewalFee}` : `Renewal due: ${selectedPatent.renewalDue} • Fee: ${selectedPatent.renewalFee}`}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            onClick={() => toast.success(isAr ? 'جاري فتح تفاصيل التصريح...' : 'Opening patent details...')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {isAr ? 'عرض الوثيقة الكاملة' : 'View Full Document'}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-border/50"
                            onClick={() => toast.success(isAr ? 'جاري التحميل...' : 'Downloading...')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            onClick={() => { setActiveTab('sales'); toast.info(isAr ? 'انتقل إلى تبويب البيع لإضافة عرض' : 'Go to Sales tab to add a listing'); }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            {isAr ? 'عرض للبيع' : 'List for Sale'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="lg:col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                      <p className="text-muted-foreground">{isAr ? 'اختر تصريحاً لعرض التفاصيل' : 'Select a patent to view details'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== SALES TAB ========== */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  {isAr ? 'عمليات البيع والترخيص' : 'Sales & Licensing Operations'}
                </h2>
                <Button
                  onClick={() => toast.success(isAr ? 'جاري فتح نموذج إضافة عرض...' : 'Opening add listing form...')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'إضافة عرض جديد' : 'Add New Listing'}
                </Button>
              </div>

              {/* Sales Summary */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: MOCK_SALES.filter(s => s.status === 'listing').length, labelAr: 'معروض للبيع', labelEn: 'Listed', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { value: MOCK_SALES.filter(s => s.status === 'negotiating').length, labelAr: 'قيد التفاوض', labelEn: 'Negotiating', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { value: MOCK_SALES.filter(s => s.status === 'completed').length, labelAr: 'مكتملة', labelEn: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10' },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl ${stat.bg} border border-border/30 text-center`}>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{isAr ? stat.labelAr : stat.labelEn}</p>
                  </div>
                ))}
              </div>

              {/* Sales Cards */}
              <div className="space-y-4">
                {MOCK_SALES.map(sale => {
                  const status = saleStatusConfig[sale.status];
                  const saleType = saleTypeConfig[sale.saleType];
                  const StatusIcon = status.icon;
                  return (
                    <Card key={sale.id} className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge className={status.color + ' text-xs'}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {isAr ? status.ar : status.en}
                              </Badge>
                              <span className={`text-xs font-semibold ${saleType.color}`}>
                                {isAr ? saleType.ar : saleType.en}
                              </span>
                            </div>
                            <h3 className="font-bold text-foreground">
                              {isAr ? sale.assetTitle : sale.assetTitleEn}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {isAr ? sale.buyer : sale.buyerEn}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-400">{sale.finalPrice || sale.offeredPrice || sale.askingPrice}</p>
                            <p className="text-xs text-muted-foreground">
                              {sale.finalPrice ? (isAr ? 'السعر النهائي' : 'Final Price') :
                               sale.offeredPrice ? (isAr ? 'العرض المقدم' : 'Offered Price') :
                               (isAr ? 'السعر المطلوب' : 'Asking Price')}
                            </p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">{isAr ? 'تقدم الصفقة' : 'Deal Progress'}</span>
                            <span className="text-xs font-bold text-foreground">{sale.progress}%</span>
                          </div>
                          <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                sale.progress === 100 ? 'bg-green-500' :
                                sale.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${sale.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Milestones */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {sale.milestones.map((m, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              {m.done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-border/50" />
                              )}
                              <span className={`text-xs ${m.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {isAr ? m.name : m.nameEn}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border/50"
                            onClick={() => toast.info(isAr ? 'عرض التفاصيل...' : 'Viewing details...')}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            {isAr ? 'التفاصيل' : 'Details'}
                          </Button>
                          {sale.status === 'negotiating' && (
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                              onClick={() => toast.success(isAr ? 'جاري فتح غرفة التفاوض...' : 'Opening deal room...')}
                            >
                              <Handshake className="w-3.5 h-3.5 mr-1" />
                              {isAr ? 'متابعة التفاوض' : 'Continue Negotiation'}
                            </Button>
                          )}
                          {sale.status === 'listing' && (
                            <Button
                              size="sm"
                              className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                              onClick={() => toast.info(isAr ? 'تعديل الإعلان...' : 'Editing listing...')}
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              {isAr ? 'تعديل الإعلان' : 'Edit Listing'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========== ACQUISITIONS TAB ========== */}
          {activeTab === 'acquisitions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  {isAr ? 'عمليات الاستحواذ' : 'Acquisition Operations'}
                </h2>
                <Button
                  onClick={() => toast.success(isAr ? 'جاري فتح نموذج الاستحواذ...' : 'Opening acquisition form...')}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'بدء عملية استحواذ' : 'Start Acquisition'}
                </Button>
              </div>

              {MOCK_ACQUISITIONS.map(acq => {
                const status = acqStatusConfig[acq.status];
                return (
                  <Card key={acq.id} className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div>
                          <Badge className={status.color + ' mb-2 text-xs'}>
                            {isAr ? status.ar : status.en}
                          </Badge>
                          <h3 className="text-lg font-bold text-foreground">
                            {isAr ? acq.targetName : acq.targetNameEn}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {isAr ? `المستحوذ: ${acq.acquirer}` : `Acquirer: ${acq.acquirerEn}`}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-400">{acq.dealValue}</p>
                          <p className="text-xs text-muted-foreground">{isAr ? 'قيمة الصفقة' : 'Deal Value'}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {isAr ? `إغلاق متوقع: ${acq.expectedClose}` : `Expected close: ${acq.expectedClose}`}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <p className="text-sm text-muted-foreground mb-5">
                        {isAr ? acq.description : acq.descriptionEn}
                      </p>

                      {/* Acquisition Stages */}
                      <div className="mb-5">
                        <p className="text-sm font-semibold text-foreground mb-3">
                          {isAr ? 'مراحل الاستحواذ' : 'Acquisition Stages'}
                        </p>
                        <div className="flex items-center gap-0 flex-wrap">
                          {acq.stages.map((stage, i) => (
                            <div key={i} className="flex items-center">
                              <div className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                                stage.done ? 'bg-green-500/10 border border-green-500/30' :
                                (stage as any).active ? 'bg-amber-500/20 border border-amber-500/40' :
                                'bg-secondary/30 border border-border/30'
                              }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
                                  stage.done ? 'bg-green-500 text-white' :
                                  (stage as any).active ? 'bg-amber-500 text-white' :
                                  'bg-secondary text-muted-foreground'
                                }`}>
                                  {stage.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <p className="text-xs font-medium text-foreground whitespace-nowrap">{stage.name}</p>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">{stage.nameAr}</p>
                              </div>
                              {i < acq.stages.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{isAr ? 'التقدم الكلي' : 'Overall Progress'}</span>
                          <span className="text-xs font-bold text-foreground">
                            {isAr ? `المرحلة ${acq.stage} من ${acq.totalStages}` : `Stage ${acq.stage} of ${acq.totalStages}`}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full"
                            style={{ width: `${(acq.stage / acq.totalStages) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <Button
                          className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                          onClick={() => toast.info(isAr ? 'عرض تفاصيل الاستحواذ...' : 'Viewing acquisition details...')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {isAr ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-border/50"
                          onClick={() => toast.info(isAr ? 'تحميل تقرير Due Diligence...' : 'Downloading Due Diligence report...')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {isAr ? 'تقرير الفحص القانوني' : 'Due Diligence Report'}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => toast.info(isAr ? 'تحديث المرحلة...' : 'Updating stage...')}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          {isAr ? 'الانتقال للمرحلة التالية' : 'Move to Next Stage'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Empty State for more acquisitions */}
              <div className="p-8 rounded-xl border-2 border-dashed border-border/30 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground mb-3">
                  {isAr ? 'هل تريد الاستحواذ على شركة أو تقنية جديدة؟' : 'Want to acquire a new company or technology?'}
                </p>
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => toast.info(isAr ? 'قريباً...' : 'Coming soon...')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'بدء عملية استحواذ جديدة' : 'Start New Acquisition'}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
