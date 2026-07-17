import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Handshake, MessageSquare, CheckCircle2, Clock, AlertCircle,
  ArrowRight, Send, FileText, TrendingUp, Building2, Lightbulb,
  Star, Shield, ChevronRight, Users, Zap, Lock, Eye, X,
  ThumbsUp, ThumbsDown, BarChart3, FileSignature, Download,
  Copy, Loader2, ScrollText, FileCheck, AlertTriangle, Sparkles
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const MOCK_DEALS = [
  {
    id: 1,
    innovationTitle: 'نظام ذكاء اصطناعي لتحسين كفاءة الطاقة الشمسية',
    innovationTitleEn: 'AI System for Solar Energy Efficiency',
    innovationDescription: 'نظام متكامل يستخدم الذكاء الاصطناعي لتحسين توجيه الألواح الشمسية وزيادة كفاءة توليد الطاقة بنسبة 35%',
    innovationDescriptionEn: 'Integrated system using AI to optimize solar panel orientation and increase energy generation efficiency by 35%',
    entityName: 'حاضنة أرامكو للابتكار',
    entityNameEn: 'Aramco Innovation Incubator',
    entityType: 'incubator',
    status: 'negotiating',
    matchScore: 95,
    lastMessage: 'نحن مهتمون جداً بهذا الابتكار، هل يمكننا ترتيب اجتماع؟',
    lastMessageEn: 'We are very interested in this innovation, can we arrange a meeting?',
    lastMessageTime: '2025-01-22 14:30',
    messages: [
      {
        id: 1,
        sender: 'entity',
        senderName: 'حاضنة أرامكو',
        senderNameEn: 'Aramco Incubator',
        text: 'مرحباً، رأينا ابتكارك في نظام الطاقة الشمسية وهو يتوافق تماماً مع برنامجنا للطاقة المستدامة.',
        textEn: 'Hello, we saw your solar energy innovation and it perfectly aligns with our sustainable energy program.',
        time: '2025-01-22 10:00',
      },
      {
        id: 2,
        sender: 'innovator',
        senderName: 'أحمد المطيري',
        senderNameEn: 'Ahmed Al-Mutairi',
        text: 'شكراً جزيلاً! سعيد باهتمامكم. النظام حقق نتائج ممتازة في الاختبارات الأولية.',
        textEn: 'Thank you so much! Happy for your interest. The system achieved excellent results in initial tests.',
        time: '2025-01-22 11:30',
      },
      {
        id: 3,
        sender: 'entity',
        senderName: 'حاضنة أرامكو',
        senderNameEn: 'Aramco Incubator',
        text: 'نحن مهتمون جداً بهذا الابتكار، هل يمكننا ترتيب اجتماع؟',
        textEn: 'We are very interested in this innovation, can we arrange a meeting?',
        time: '2025-01-22 14:30',
      },
    ],
    terms: {
      equity: '10%',
      funding: '500,000 SAR',
      duration: '12 months',
      support: ['Mentorship', 'Office Space', 'Network Access'],
    },
  },
  {
    id: 2,
    innovationTitle: 'منصة تشخيص طبي عن بعد بالذكاء الاصطناعي',
    innovationTitleEn: 'AI-Powered Remote Medical Diagnosis Platform',
    innovationDescription: 'منصة تجمع بين الذكاء الاصطناعي وتقنيات التصوير الطبي لتقديم تشخيص دقيق عن بعد',
    innovationDescriptionEn: 'Platform combining AI and medical imaging technologies for accurate remote diagnosis',
    entityName: 'مستشفى الملك فيصل التخصصي',
    entityNameEn: 'King Faisal Specialist Hospital',
    entityType: 'company',
    status: 'pending',
    matchScore: 87,
    lastMessage: 'تم إرسال طلب التواصل، في انتظار الرد',
    lastMessageEn: 'Connection request sent, awaiting response',
    lastMessageTime: '2025-01-21 09:00',
    messages: [
      {
        id: 1,
        sender: 'entity',
        senderName: 'مستشفى الملك فيصل',
        senderNameEn: 'King Faisal Hospital',
        text: 'تم إرسال طلب التواصل، في انتظار الرد من المبتكر.',
        textEn: 'Connection request sent, awaiting response from innovator.',
        time: '2025-01-21 09:00',
      },
    ],
    terms: null,
  },
  {
    id: 3,
    innovationTitle: 'تقنية تحلية مياه منخفضة الطاقة',
    innovationTitleEn: 'Low-Energy Water Desalination Technology',
    innovationDescription: 'تقنية مبتكرة تخفض استهلاك الطاقة في تحلية المياه بنسبة 60% مقارنة بالطرق التقليدية',
    innovationDescriptionEn: 'Innovative technology reducing energy consumption in water desalination by 60% compared to traditional methods',
    entityName: 'مسرّع STC للتقنية',
    entityNameEn: 'STC Tech Accelerator',
    entityType: 'accelerator',
    status: 'agreed',
    matchScore: 91,
    lastMessage: 'تم الاتفاق! يتم الآن إعداد العقد للانتقال إلى NAQLA 3',
    lastMessageEn: 'Deal agreed! Contract is being prepared for NAQLA 3 transition',
    lastMessageTime: '2025-01-20 16:00',
    messages: [],
    terms: {
      equity: '15%',
      funding: '1,200,000 SAR',
      duration: '18 months',
      support: ['Mentorship', 'Legal Support', 'Market Access', 'Funding'],
    },
  },
];

const statusConfig: Record<string, { ar: string; en: string; color: string; icon: any }> = {
  pending: { ar: 'في الانتظار', en: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock },
  negotiating: { ar: 'قيد التفاوض', en: 'Negotiating', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: MessageSquare },
  agreed: { ar: 'تم الاتفاق', en: 'Agreed', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
  rejected: { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: X },
};

const contractTypes = [
  {
    key: 'nda' as const,
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
    labelAr: 'اتفاقية عدم الإفصاح',
    labelEn: 'Non-Disclosure Agreement',
    descAr: 'لحماية المعلومات السرية قبل التفاوض',
    descEn: 'To protect confidential information before negotiation',
    badge: 'NDA',
  },
  {
    key: 'collaboration' as const,
    icon: Handshake,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    labelAr: 'عقد تعاون وشراكة',
    labelEn: 'Collaboration Agreement',
    descAr: 'لتنظيم شراكة الابتكار والتطوير المشترك',
    descEn: 'To organize innovation partnership and joint development',
    badge: null,
  },
  {
    key: 'licensing' as const,
    icon: FileCheck,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    labelAr: 'عقد ترخيص الملكية الفكرية',
    labelEn: 'IP Licensing Agreement',
    descAr: 'لمنح حقوق استخدام الملكية الفكرية',
    descEn: 'To grant intellectual property usage rights',
    badge: 'IP',
  },
  {
    key: 'acquisition' as const,
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10 border-green-500/30',
    labelAr: 'عقد استحواذ',
    labelEn: 'Acquisition Agreement',
    descAr: 'لنقل ملكية الابتكار أو الاستحواذ الكامل',
    descEn: 'For innovation ownership transfer or full acquisition',
    badge: null,
  },
];

export default function Naqla2DealRoom() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();

  const [selectedDeal, setSelectedDeal] = useState<typeof MOCK_DEALS[0] | null>(MOCK_DEALS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [activeSection, setActiveSection] = useState<'chat' | 'terms' | 'timeline' | 'contracts'>('chat');

  // Contract generation state
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState<'collaboration' | 'nda' | 'licensing' | 'acquisition'>('nda');
  const [generatedContract, setGeneratedContract] = useState<{
    contractTypeLabel: string;
    contractText: string;
    generatedAt: string;
  } | null>(null);
  const [contractCopied, setContractCopied] = useState(false);

  const generateContractMutation = trpc.naqla2.generateContract.useMutation({
    onSuccess: (data) => {
      setGeneratedContract(data);
      toast.success(isAr ? 'تم توليد المسودة بنجاح!' : 'Draft generated successfully!');
    },
    onError: (err) => {
      toast.error(isAr ? `خطأ في التوليد: ${err.message}` : `Generation error: ${err.message}`);
    },
  });

  const handleGenerateContract = () => {
    if (!selectedDeal) return;
    setGeneratedContract(null);
    generateContractMutation.mutate({
      contractType: selectedContractType,
      partyA: isAr ? 'المبتكر - منصة UPLINK' : 'Innovator - UPLINK Platform',
      partyB: isAr ? selectedDeal.entityName : selectedDeal.entityNameEn,
      innovationTitle: isAr ? selectedDeal.innovationTitle : selectedDeal.innovationTitleEn,
      innovationDescription: isAr ? selectedDeal.innovationDescription : selectedDeal.innovationDescriptionEn,
      terms: selectedDeal.terms ? {
        equity: selectedDeal.terms.equity,
        funding: selectedDeal.terms.funding,
        duration: selectedDeal.terms.duration,
        support: selectedDeal.terms.support,
      } : undefined,
      language: isAr ? 'ar' : 'en',
    });
  };

  const handleCopyContract = () => {
    if (!generatedContract) return;
    navigator.clipboard.writeText(generatedContract.contractText);
    setContractCopied(true);
    setTimeout(() => setContractCopied(false), 2000);
    toast.success(isAr ? 'تم نسخ العقد!' : 'Contract copied!');
  };

  const handleDownloadContract = () => {
    if (!generatedContract) return;
    const blob = new Blob([generatedContract.contractText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContract.contractTypeLabel}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isAr ? 'تم تحميل المسودة!' : 'Draft downloaded!');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success(isAr ? 'تم إرسال الرسالة' : 'Message sent');
    setNewMessage('');
  };

  const promoteToNaqla3 = () => {
    toast.success(isAr
      ? 'يتم الآن إعداد العقد للانتقال إلى NAQLA 3 للتصريح والبيع'
      : 'Contract being prepared for NAQLA 3 transition for licensing & sale'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isAr ? 'غرفة التفاوض - NAQLA 2' : 'Deal Room - NAQLA 2'}
        description={isAr ? 'تفاوض واتفق مع الحاضنات والمسرّعات والشركات' : 'Negotiate and agree with incubators, accelerators and companies'}
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative pt-24 pb-8 px-6 border-b border-border/50">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/naqla2/matching-hub">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                    {isAr ? 'مركز التطابق' : 'Matching Hub'}
                  </Button>
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{isAr ? 'غرفة التفاوض' : 'Deal Room'}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Handshake className="w-8 h-8 text-green-400" />
                {isAr ? 'غرفة التفاوض والاتفاقيات' : 'Negotiation & Deal Room'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAr
                  ? 'تفاوض بشكل آمن مع الجهات المهتمة وأبرم الاتفاقيات قبل الانتقال إلى NAQLA 3'
                  : 'Negotiate securely with interested parties and finalize agreements before moving to NAQLA 3'}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                {isAr ? 'توليد العقود بالذكاء الاصطناعي' : 'AI Contract Generation'}
              </Badge>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1">
                <Lock className="w-3 h-3 mr-1" />
                {isAr ? 'محادثات مشفرة' : 'Encrypted Chats'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="relative px-6 py-8">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Deals List */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {isAr ? 'صفقاتك النشطة' : 'Your Active Deals'} ({MOCK_DEALS.length})
              </h2>
              {MOCK_DEALS.map(deal => {
                const status = statusConfig[deal.status];
                const StatusIcon = status.icon;
                const isSelected = selectedDeal?.id === deal.id;
                return (
                  <button
                    key={deal.id}
                    onClick={() => { setSelectedDeal(deal); setGeneratedContract(null); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-500/50 bg-blue-500/5'
                        : 'border-border/50 bg-card/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={status.color + ' text-xs'}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {isAr ? status.ar : status.en}
                      </Badge>
                      <span className="text-xs text-green-400 font-bold">{deal.matchScore}%</span>
                    </div>
                    <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
                      {isAr ? deal.innovationTitle : deal.innovationTitleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {isAr ? deal.entityName : deal.entityNameEn}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {isAr ? deal.lastMessage : deal.lastMessageEn}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{deal.lastMessageTime}</p>
                  </button>
                );
              })}

              {/* Stats */}
              <div className="mt-6 p-4 rounded-xl bg-card/50 border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {isAr ? 'إحصائيات الصفقات' : 'Deal Statistics'}
                </h3>
                <div className="space-y-2">
                  {[
                    { label: isAr ? 'قيد التفاوض' : 'Negotiating', value: 1, color: 'bg-blue-400' },
                    { label: isAr ? 'في الانتظار' : 'Pending', value: 1, color: 'bg-yellow-400' },
                    { label: isAr ? 'تم الاتفاق' : 'Agreed', value: 1, color: 'bg-green-400' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="text-xs font-bold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deal Detail */}
            {selectedDeal ? (
              <div className="lg:col-span-2 space-y-4">
                {/* Deal Header */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {isAr ? selectedDeal.innovationTitle : selectedDeal.innovationTitleEn}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {isAr ? selectedDeal.entityName : selectedDeal.entityNameEn}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-green-400 font-bold">{selectedDeal.matchScore}% {isAr ? 'تطابق' : 'match'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedDeal.status === 'agreed' && (
                          <Button
                            onClick={promoteToNaqla3}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {isAr ? 'انتقل إلى NAQLA 3' : 'Move to NAQLA 3'}
                          </Button>
                        )}
                        {selectedDeal.status === 'negotiating' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              onClick={() => toast.success(isAr ? 'تم قبول الصفقة!' : 'Deal accepted!')}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {isAr ? 'قبول' : 'Accept'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              onClick={() => toast.error(isAr ? 'تم رفض الصفقة' : 'Deal rejected')}
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              {isAr ? 'رفض' : 'Reject'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Section Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'chat', icon: MessageSquare, labelAr: 'المحادثة', labelEn: 'Chat' },
                    { key: 'contracts', icon: FileSignature, labelAr: 'العقود والوثائق', labelEn: 'Contracts & Docs' },
                    { key: 'terms', icon: FileText, labelAr: 'شروط الاتفاق', labelEn: 'Deal Terms' },
                    { key: 'timeline', icon: BarChart3, labelAr: 'مراحل الرحلة', labelEn: 'Journey Stages' },
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveSection(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeSection === tab.key
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-card/50 text-muted-foreground border border-border/50 hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {isAr ? tab.labelAr : tab.labelEn}
                        {tab.key === 'contracts' && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-1.5 py-0">
                            AI
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Chat Section */}
                {activeSection === 'chat' && (
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-400" />
                        {isAr ? 'محادثة مشفرة وآمنة' : 'Encrypted & Secure Chat'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4 max-h-80 overflow-y-auto mb-4 pr-2">
                        {selectedDeal.messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.sender === 'innovator' ? 'flex-row-reverse' : ''}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              msg.sender === 'entity' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {msg.sender === 'entity' ? <Building2 className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                            </div>
                            <div className={`flex-1 ${msg.sender === 'innovator' ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className={`px-4 py-2 rounded-xl max-w-sm ${
                                msg.sender === 'entity'
                                  ? 'bg-blue-500/10 border border-blue-500/20 text-foreground'
                                  : 'bg-green-500/10 border border-green-500/20 text-foreground'
                              }`}>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  {isAr ? msg.senderName : msg.senderNameEn}
                                </p>
                                <p className="text-sm">{isAr ? msg.text : msg.textEn}</p>
                              </div>
                              <span className="text-xs text-muted-foreground/60 mt-1">{msg.time}</span>
                            </div>
                          </div>
                        ))}
                        {selectedDeal.messages.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">{isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          placeholder={isAr ? 'اكتب رسالتك...' : 'Type your message...'}
                          onKeyDown={e => e.key === 'Enter' && sendMessage()}
                          className="flex-1 bg-background/50 border-border/50"
                        />
                        <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contracts & Docs Section - AI Generation */}
                {activeSection === 'contracts' && (
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        {isAr ? 'توليد العقود والوثائق القانونية بالذكاء الاصطناعي' : 'AI-Powered Legal Document Generation'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isAr
                          ? 'اختر نوع الوثيقة وسيقوم الذكاء الاصطناعي بصياغة مسودة قانونية احترافية فورياً'
                          : 'Choose document type and AI will draft a professional legal document instantly'}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {/* Warning */}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300">
                          {isAr
                            ? 'هذه مسودة أولية للمراجعة فقط. يُنصح بمراجعة محامٍ متخصص قبل توقيع أي وثيقة قانونية.'
                            : 'This is a preliminary draft for review only. Consulting a specialized attorney before signing any legal document is recommended.'}
                        </p>
                      </div>

                      {/* Contract Type Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {contractTypes.map(ct => {
                          const Icon = ct.icon;
                          const isSelected = selectedContractType === ct.key;
                          return (
                            <button
                              key={ct.key}
                              onClick={() => { setSelectedContractType(ct.key); setGeneratedContract(null); }}
                              className={`p-4 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? `${ct.bgColor} border-opacity-60`
                                  : 'border-border/50 bg-card/30 hover:border-border'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ct.color} flex items-center justify-center`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-foreground">
                                      {isAr ? ct.labelAr : ct.labelEn}
                                    </span>
                                    {ct.badge && (
                                      <Badge className="text-xs px-1.5 py-0 bg-secondary/50 text-muted-foreground">
                                        {ct.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {isAr ? ct.descAr : ct.descEn}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Generate Button */}
                      <Button
                        onClick={handleGenerateContract}
                        disabled={generateContractMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-3"
                      >
                        {generateContractMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {isAr ? 'جاري الصياغة بالذكاء الاصطناعي...' : 'AI is drafting...'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            {isAr
                              ? `توليد ${contractTypes.find(c => c.key === selectedContractType)?.[isAr ? 'labelAr' : 'labelEn']}`
                              : `Generate ${contractTypes.find(c => c.key === selectedContractType)?.[isAr ? 'labelAr' : 'labelEn']}`}
                          </>
                        )}
                      </Button>

                      {/* Generated Contract Display */}
                      {generatedContract && (
                        <div className="mt-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                              <span className="font-semibold text-foreground">
                                {isAr ? 'المسودة جاهزة' : 'Draft Ready'}: {generatedContract.contractTypeLabel}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCopyContract}
                                className="border-border/50 text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                {contractCopied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleDownloadContract}
                                className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                {isAr ? 'تحميل' : 'Download'}
                              </Button>
                            </div>
                          </div>
                          <div className="bg-background/80 border border-border/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed" dir={isAr ? 'rtl' : 'ltr'}>
                              {generatedContract.contractText}
                            </pre>
                          </div>
                          <p className="text-xs text-muted-foreground/60 mt-2 text-right">
                            {isAr ? 'تم التوليد في:' : 'Generated at:'} {new Date(generatedContract.generatedAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Terms Section */}
                {activeSection === 'terms' && (
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        {isAr ? 'شروط الاتفاق المقترحة' : 'Proposed Deal Terms'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedDeal.terms ? (
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: isAr ? 'نسبة الحصة' : 'Equity Share', value: selectedDeal.terms.equity, icon: TrendingUp, color: 'text-green-400' },
                            { label: isAr ? 'التمويل' : 'Funding', value: selectedDeal.terms.funding, icon: Zap, color: 'text-yellow-400' },
                            { label: isAr ? 'مدة العقد' : 'Duration', value: selectedDeal.terms.duration, icon: Clock, color: 'text-blue-400' },
                          ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                              <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon className={`w-4 h-4 ${item.color}`} />
                                  <span className="text-xs text-muted-foreground">{item.label}</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">{item.value}</p>
                              </div>
                            );
                          })}
                          <div className="p-4 rounded-xl bg-background/50 border border-border/50 col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-muted-foreground">{isAr ? 'أشكال الدعم' : 'Support Types'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedDeal.terms.support.map((s, i) => (
                                <Badge key={i} className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">{isAr ? 'لم يتم تحديد شروط بعد' : 'No terms defined yet'}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Timeline Section */}
                {activeSection === 'timeline' && (
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        {isAr ? 'مراحل رحلة الابتكار' : 'Innovation Journey Stages'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            stage: 'NAQLA 1',
                            title: isAr ? 'تقييم الفكرة بالذكاء الاصطناعي' : 'AI Idea Evaluation',
                            desc: isAr ? 'تم تقييم الفكرة وحصلت على درجة 92/100' : 'Idea evaluated and scored 92/100',
                            status: 'completed',
                            date: '2025-01-15',
                          },
                          {
                            stage: 'NAQLA 2',
                            title: isAr ? 'التطابق والتفاوض' : 'Matching & Negotiation',
                            desc: isAr ? 'تم التطابق مع حاضنة أرامكو - قيد التفاوض' : 'Matched with Aramco Incubator - Negotiating',
                            status: 'active',
                            date: '2025-01-22',
                          },
                          {
                            stage: 'NAQLA 3',
                            title: isAr ? 'التصريح والبيع والاستحواذ' : 'Licensing, Sale & Acquisition',
                            desc: isAr ? 'في انتظار إتمام الاتفاق للانتقال' : 'Awaiting deal completion to proceed',
                            status: 'pending',
                            date: null,
                          },
                        ].map((step, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                step.status === 'completed' ? 'bg-green-500 text-white' :
                                step.status === 'active' ? 'bg-blue-500 text-white' :
                                'bg-secondary/50 text-muted-foreground border border-border/50'
                              }`}>
                                {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                              </div>
                              {i < 2 && <div className={`w-0.5 h-12 mt-2 ${step.status === 'completed' ? 'bg-green-500/50' : 'bg-border/50'}`} />}
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`text-xs ${
                                  step.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                  step.status === 'active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                  'bg-secondary/50 text-muted-foreground border-border/50'
                                }`}>
                                  {step.stage}
                                </Badge>
                                {step.date && <span className="text-xs text-muted-foreground">{step.date}</span>}
                              </div>
                              <h4 className="font-semibold text-foreground">{step.title}</h4>
                              <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="lg:col-span-2 flex items-center justify-center">
                <div className="text-center">
                  <Handshake className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{isAr ? 'اختر صفقة لعرض التفاصيل' : 'Select a deal to view details'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
