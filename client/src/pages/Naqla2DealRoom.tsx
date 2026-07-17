import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Handshake, MessageSquare, CheckCircle2, Clock, AlertCircle,
  ArrowRight, Send, FileText, TrendingUp, Building2, Lightbulb,
  Star, Shield, ChevronRight, Users, Zap, Lock, Eye, X,
  ThumbsUp, ThumbsDown, BarChart3
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const MOCK_DEALS = [
  {
    id: 1,
    innovationTitle: 'نظام ذكاء اصطناعي لتحسين كفاءة الطاقة الشمسية',
    innovationTitleEn: 'AI System for Solar Energy Efficiency',
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

export default function Naqla2DealRoom() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user } = useAuth();

  const [selectedDeal, setSelectedDeal] = useState<typeof MOCK_DEALS[0] | null>(MOCK_DEALS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [activeSection, setActiveSection] = useState<'chat' | 'terms' | 'timeline'>('chat');

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
          <div className="flex items-center justify-between">
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
            <div className="flex gap-3">
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
                    onClick={() => setSelectedDeal(deal)}
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
                    <div className="flex items-start justify-between">
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
                      <div className="flex gap-2">
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
                <div className="flex gap-2 border-b border-border/50">
                  {[
                    { id: 'chat', label: isAr ? 'المحادثة' : 'Chat', icon: MessageSquare },
                    { id: 'terms', label: isAr ? 'شروط الاتفاق' : 'Deal Terms', icon: FileText },
                    { id: 'timeline', label: isAr ? 'المراحل' : 'Timeline', icon: BarChart3 },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeSection === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Chat Section */}
                {activeSection === 'chat' && (
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                      {/* Messages */}
                      <div className="h-80 overflow-y-auto p-4 space-y-4">
                        {selectedDeal.messages.map(msg => {
                          const isOwn = msg.sender === 'innovator';
                          return (
                            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                <span className="text-xs text-muted-foreground px-1">
                                  {isAr ? msg.senderName : msg.senderNameEn}
                                </span>
                                <div className={`px-4 py-3 rounded-2xl text-sm ${
                                  isOwn
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-sm'
                                    : 'bg-secondary/50 text-foreground rounded-bl-sm border border-border/50'
                                }`}>
                                  {isAr ? msg.text : msg.textEn}
                                </div>
                                <span className="text-xs text-muted-foreground/60 px-1">{msg.time}</span>
                              </div>
                            </div>
                          );
                        })}
                        {selectedDeal.messages.length === 0 && (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            {isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}
                          </div>
                        )}
                      </div>
                      {/* Input */}
                      <div className="border-t border-border/50 p-4">
                        <div className="flex gap-3">
                          <Textarea
                            placeholder={isAr ? 'اكتب رسالتك...' : 'Type your message...'}
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className="flex-1 min-h-[60px] max-h-[120px] bg-secondary/30 border-border/50 resize-none"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white self-end"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {isAr ? 'جميع المحادثات مشفرة ومحفوظة بأمان' : 'All conversations are encrypted and securely stored'}
                        </p>
                      </div>
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
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: isAr ? 'حصة الملكية' : 'Equity Share', value: selectedDeal.terms.equity, icon: TrendingUp, color: 'text-purple-400' },
                              { label: isAr ? 'التمويل المقدم' : 'Funding Offered', value: selectedDeal.terms.funding, icon: Star, color: 'text-yellow-400' },
                              { label: isAr ? 'مدة البرنامج' : 'Program Duration', value: selectedDeal.terms.duration, icon: Clock, color: 'text-blue-400' },
                            ].map((term, i) => (
                              <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                                <term.icon className={`w-5 h-5 ${term.color} mb-2`} />
                                <div className="text-lg font-bold text-foreground">{term.value}</div>
                                <div className="text-xs text-muted-foreground">{term.label}</div>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-400" />
                              {isAr ? 'الدعم المقدم' : 'Support Provided'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedDeal.terms.support.map((s, i) => (
                                <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {selectedDeal.status === 'negotiating' && (
                            <div className="flex gap-3">
                              <Button
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                onClick={() => toast.success(isAr ? 'تم قبول الشروط!' : 'Terms accepted!')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {isAr ? 'قبول الشروط' : 'Accept Terms'}
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => toast.info(isAr ? 'يمكنك التفاوض عبر المحادثة' : 'You can negotiate via chat')}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                {isAr ? 'تفاوض على الشروط' : 'Negotiate Terms'}
                              </Button>
                            </div>
                          )}
                          {selectedDeal.status === 'agreed' && (
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                              <div className="flex items-center gap-2 text-green-400 font-semibold">
                                <CheckCircle2 className="w-5 h-5" />
                                {isAr ? 'تم الاتفاق على جميع الشروط!' : 'All terms agreed!'}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {isAr
                                  ? 'يمكنك الآن الانتقال إلى NAQLA 3 لإتمام العقد الرسمي'
                                  : 'You can now move to NAQLA 3 to complete the official contract'}
                              </p>
                              <Button
                                onClick={promoteToNaqla3}
                                className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white w-full"
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                {isAr ? 'انتقل إلى NAQLA 3 للتصريح والبيع' : 'Move to NAQLA 3 for Licensing & Sale'}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            {isAr ? 'لم يتم تقديم شروط بعد' : 'No terms proposed yet'}
                          </p>
                          <Button
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            onClick={() => setActiveSection('chat')}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {isAr ? 'ابدأ التفاوض عبر المحادثة' : 'Start Negotiating via Chat'}
                          </Button>
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
