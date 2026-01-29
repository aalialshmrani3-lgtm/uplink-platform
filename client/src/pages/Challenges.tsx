import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Rocket, Brain, Trophy, Calendar, Users, 
  DollarSign, Clock, ArrowLeft, Zap, Plus,
  Building2, Globe, Sparkles, Target, MapPin,
  Handshake, Star, TrendingUp, Filter, Search,
  ChevronRight, Play, Lightbulb, GraduationCap,
  Satellite, Leaf, Heart, Cpu, Briefcase, Mic,
  Video, Award, CheckCircle2, ArrowRight, Send,
  Gift, Banknote, BookOpen, Presentation, Beaker,
  UsersRound, Megaphone, PartyPopper
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// المجتمعات المتخصصة
const communities = [
  { id: 'space', name: 'مجتمع الفضاء', nameEn: 'Space Community', icon: Satellite, color: 'from-indigo-500 to-purple-600', members: 1250, projects: 45 },
  { id: 'energy', name: 'مجتمع الطاقة', nameEn: 'Energy Community', icon: Leaf, color: 'from-emerald-500 to-teal-600', members: 980, projects: 38 },
  { id: 'health', name: 'مجتمع الصحة', nameEn: 'Health Community', icon: Heart, color: 'from-red-500 to-pink-600', members: 1560, projects: 62 },
  { id: 'tech', name: 'مجتمع التقنية', nameEn: 'Tech Community', icon: Cpu, color: 'from-cyan-500 to-blue-600', members: 2340, projects: 89 },
  { id: 'fintech', name: 'مجتمع التقنية المالية', nameEn: 'FinTech Community', icon: DollarSign, color: 'from-amber-500 to-orange-600', members: 870, projects: 34 },
  { id: 'education', name: 'مجتمع التعليم', nameEn: 'Education Community', icon: GraduationCap, color: 'from-blue-500 to-indigo-600', members: 1120, projects: 41 },
];

// الفعاليات التجارية (Business)
const businessEvents = [
  {
    id: 1,
    title: "تحدي الذكاء الاصطناعي للرعاية الصحية",
    description: "تطوير حلول AI مبتكرة لتحسين التشخيص الطبي وتجربة المريض في المستشفيات والمراكز الصحية",
    type: "challenge",
    category: "health",
    pricing: "business",
    prize: 500000,
    currency: "USD",
    status: "open",
    participants: 156,
    sponsors: 3,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    organizer: "Global Health Initiative",
    location: "عالمي - أونلاين",
    image: "🏥",
  },
  {
    id: 2,
    title: "هاكاثون الطاقة المتجددة",
    description: "48 ساعة من الابتكار المكثف لتطوير حلول الطاقة النظيفة والمستدامة مع جوائز قيمة",
    type: "hackathon",
    category: "energy",
    pricing: "business",
    prize: 250000,
    currency: "USD",
    status: "open",
    participants: 320,
    sponsors: 5,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    organizer: "Green Energy Alliance",
    location: "لندن، المملكة المتحدة",
    image: "⚡",
  },
  {
    id: 3,
    title: "مسابقة التقنية المالية",
    description: "تنافس على تطوير أفضل حلول الدفع الرقمي والخدمات المصرفية المبتكرة",
    type: "competition",
    category: "fintech",
    pricing: "business",
    prize: 750000,
    currency: "USD",
    status: "open",
    participants: 189,
    sponsors: 6,
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    organizer: "FinTech Global",
    location: "سنغافورة",
    image: "💳",
  },
  {
    id: 4,
    title: "معرض تقنيات الفضاء",
    description: "معرض دولي لعرض أحدث تقنيات الفضاء والأقمار الصناعية وفرص الاستثمار",
    type: "exhibition",
    category: "space",
    pricing: "business",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 450,
    sponsors: 8,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    organizer: "Space Innovation Hub",
    location: "الرياض، السعودية",
    image: "🚀",
  },
];

// الفعاليات المجانية (Community)
const freeEvents = [
  {
    id: 101,
    title: "ورشة عمل: أساسيات الذكاء الاصطناعي",
    description: "تعلم أساسيات الذكاء الاصطناعي والتعلم الآلي من الصفر مع خبراء المجال",
    type: "workshop",
    category: "tech",
    pricing: "free",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 85,
    sponsors: 0,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    organizer: "AI Community",
    location: "أونلاين",
    image: "🤖",
  },
  {
    id: 102,
    title: "دورة تدريبية: ريادة الأعمال للمبتدئين",
    description: "دورة مجانية شاملة لتعلم أساسيات ريادة الأعمال وبناء المشاريع الناشئة",
    type: "training",
    category: "education",
    pricing: "free",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 234,
    sponsors: 0,
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    organizer: "Startup Academy",
    location: "أونلاين",
    image: "📚",
  },
  {
    id: 103,
    title: "تجمع علمي: مستقبل الطاقة النظيفة",
    description: "نقاش علمي مفتوح حول أحدث الأبحاث والتقنيات في مجال الطاقة المتجددة",
    type: "meetup",
    category: "energy",
    pricing: "free",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 67,
    sponsors: 0,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    organizer: "Energy Research Group",
    location: "جدة، السعودية",
    image: "🔬",
  },
  {
    id: 104,
    title: "محاضرة: الابتكار في القطاع الصحي",
    description: "محاضرة مجانية عن أحدث الابتكارات في مجال الرعاية الصحية والتقنيات الطبية",
    type: "lecture",
    category: "health",
    pricing: "free",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 120,
    sponsors: 0,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    organizer: "Health Innovation Lab",
    location: "أونلاين",
    image: "🎤",
  },
  {
    id: 105,
    title: "لقاء مجتمع الفضاء الشهري",
    description: "لقاء شهري لمجتمع الفضاء لمناقشة آخر المستجدات والمشاريع الجديدة",
    type: "meetup",
    category: "space",
    pricing: "free",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 45,
    sponsors: 0,
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    organizer: "Space Community",
    location: "الرياض، السعودية",
    image: "🛸",
  },
  {
    id: 106,
    title: "ورشة عمل: تصميم تجربة المستخدم UX",
    description: "تعلم أساسيات تصميم تجربة المستخدم وأفضل الممارسات في المجال",
    type: "workshop",
    category: "tech",
    pricing: "free",
    prize: 0,
    currency: "USD",
    status: "open",
    participants: 92,
    sponsors: 0,
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    organizer: "UX Design Community",
    location: "أونلاين",
    image: "🎨",
  },
];

// الرعاة المتاحون
const sponsorsData = [
  { id: 1, name: "TechVentures", logo: "🏢", type: "platinum", budget: "1M+", interests: ["tech", "fintech"] },
  { id: 2, name: "Green Future Fund", logo: "🌱", type: "gold", budget: "500K+", interests: ["energy", "space"] },
  { id: 3, name: "Health Innovation Partners", logo: "💊", type: "gold", budget: "750K+", interests: ["health"] },
  { id: 4, name: "Global Ventures", logo: "🌐", type: "silver", budget: "250K+", interests: ["tech", "education"] },
];

const typeLabels: Record<string, { ar: string; en: string; color: string; icon: any }> = {
  challenge: { ar: 'تحدي', en: 'Challenge', color: 'bg-blue-500/20 text-blue-400', icon: Target },
  hackathon: { ar: 'هاكاثون', en: 'Hackathon', color: 'bg-purple-500/20 text-purple-400', icon: Zap },
  competition: { ar: 'مسابقة', en: 'Competition', color: 'bg-amber-500/20 text-amber-400', icon: Trophy },
  conference: { ar: 'مؤتمر', en: 'Conference', color: 'bg-emerald-500/20 text-emerald-400', icon: Mic },
  exhibition: { ar: 'معرض', en: 'Exhibition', color: 'bg-cyan-500/20 text-cyan-400', icon: Building2 },
  workshop: { ar: 'ورشة عمل', en: 'Workshop', color: 'bg-pink-500/20 text-pink-400', icon: Presentation },
  training: { ar: 'دورة تدريبية', en: 'Training', color: 'bg-indigo-500/20 text-indigo-400', icon: BookOpen },
  meetup: { ar: 'تجمع علمي', en: 'Meetup', color: 'bg-teal-500/20 text-teal-400', icon: UsersRound },
  lecture: { ar: 'محاضرة', en: 'Lecture', color: 'bg-orange-500/20 text-orange-400', icon: Megaphone },
};

const categoryLabels: Record<string, { ar: string; en: string }> = {
  health: { ar: 'الرعاية الصحية', en: 'Healthcare' },
  energy: { ar: 'الطاقة', en: 'Energy' },
  tech: { ar: 'التقنية', en: 'Technology' },
  fintech: { ar: 'التقنية المالية', en: 'FinTech' },
  space: { ar: 'الفضاء', en: 'Space' },
  education: { ar: 'التعليم', en: 'Education' },
};

export default function Challenges() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("find");
  const [eventMode, setEventMode] = useState<"business" | "free">("business");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Form state for creating new event
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "workshop",
    category: "tech",
    pricing: "free" as "free" | "business",
    prize: "",
    location: "",
    endDate: "",
    targetCommunities: [] as string[],
    needSponsors: false,
  });

  const allEvents = [...businessEvents, ...freeEvents];
  
  const filteredEvents = allEvents.filter(event => {
    const matchesMode = eventMode === "business" ? event.pricing === "business" : event.pricing === "free";
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesSearch = event.title.includes(searchQuery) || event.description.includes(searchQuery);
    return matchesMode && matchesCategory && matchesType && matchesSearch;
  });

  const handleCreateSubmit = () => {
    if (newEvent.pricing === "business") {
      toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته وربطك بالمجتمعات والرعاة المناسبين.");
      setShowCreateDialog(false);
      // Redirect to UPLINK3 for contracts
      setTimeout(() => {
        toast.info("جاري توجيهك إلى UPLINK3 لإتمام العقود والاتفاقيات...");
        setTimeout(() => setLocation("/contracts"), 2000);
      }, 1500);
    } else {
      toast.success("تم إضافة فعاليتك المجانية بنجاح! سيتم نشرها للمجتمع.");
      setShowCreateDialog(false);
    }
  };

  const handleJoinEvent = (event: typeof allEvents[0]) => {
    if (event.pricing === "business") {
      toast.success("تم تسجيلك في الفعالية بنجاح!");
      setTimeout(() => {
        toast.info("جاري توجيهك إلى UPLINK3 لتوقيع اتفاقية المشاركة...");
        setTimeout(() => setLocation("/contracts"), 2000);
      }, 1500);
    } else {
      toast.success("تم تسجيلك في الفعالية المجانية بنجاح! 🎉");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-50" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    UPLINK2
                  </span>
                  <p className="text-xs text-muted-foreground">التحديات والمطابقة</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 ml-2" />
                لوحة التحكم
              </Button>
            </Link>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  أنشئ فعالية
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">إنشاء فعالية جديدة</DialogTitle>
                  <DialogDescription>
                    أنشئ فعاليتك وسنربطك بالمجتمعات والمهتمين المناسبين
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Pricing Type Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">نوع الفعالية</label>
                    <div className="grid grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${newEvent.pricing === 'free' ? 'border-emerald-500 bg-emerald-500/10' : 'hover:border-border'}`}
                        onClick={() => setNewEvent({...newEvent, pricing: 'free', needSponsors: false})}
                      >
                        <CardContent className="p-4 text-center">
                          <Gift className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                          <p className="font-medium">فعالية مجانية</p>
                          <p className="text-xs text-muted-foreground">ورشة عمل، دورة، تجمع علمي</p>
                          <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">مجاني للمجتمع</Badge>
                        </CardContent>
                      </Card>
                      <Card 
                        className={`cursor-pointer transition-all ${newEvent.pricing === 'business' ? 'border-amber-500 bg-amber-500/10' : 'hover:border-border'}`}
                        onClick={() => setNewEvent({...newEvent, pricing: 'business'})}
                      >
                        <CardContent className="p-4 text-center">
                          <Banknote className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                          <p className="font-medium">فعالية تجارية</p>
                          <p className="text-xs text-muted-foreground">هاكاثون، مسابقة، معرض</p>
                          <Badge className="mt-2 bg-amber-500/20 text-amber-400">مع رعاة وجوائز</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">عنوان الفعالية</label>
                      <Input 
                        placeholder={newEvent.pricing === 'free' ? "مثال: ورشة عمل أساسيات البرمجة" : "مثال: هاكاثون الذكاء الاصطناعي 2026"}
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">الوصف</label>
                      <Textarea 
                        placeholder="اشرح تفاصيل الفعالية وأهدافها..."
                        rows={4}
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">نوع النشاط</label>
                        <Select value={newEvent.type} onValueChange={(v) => setNewEvent({...newEvent, type: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {newEvent.pricing === 'free' ? (
                              <>
                                <SelectItem value="workshop">ورشة عمل</SelectItem>
                                <SelectItem value="training">دورة تدريبية</SelectItem>
                                <SelectItem value="meetup">تجمع علمي</SelectItem>
                                <SelectItem value="lecture">محاضرة</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="hackathon">هاكاثون</SelectItem>
                                <SelectItem value="challenge">تحدي</SelectItem>
                                <SelectItem value="competition">مسابقة</SelectItem>
                                <SelectItem value="conference">مؤتمر</SelectItem>
                                <SelectItem value="exhibition">معرض</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">القطاع</label>
                        <Select value={newEvent.category} onValueChange={(v) => setNewEvent({...newEvent, category: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">التقنية</SelectItem>
                            <SelectItem value="health">الرعاية الصحية</SelectItem>
                            <SelectItem value="energy">الطاقة</SelectItem>
                            <SelectItem value="fintech">التقنية المالية</SelectItem>
                            <SelectItem value="space">الفضاء</SelectItem>
                            <SelectItem value="education">التعليم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newEvent.pricing === 'business' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">قيمة الجائزة (USD)</label>
                          <Input 
                            type="number"
                            placeholder="مثال: 100000"
                            value={newEvent.prize}
                            onChange={(e) => setNewEvent({...newEvent, prize: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                          <Switch 
                            checked={newEvent.needSponsors}
                            onCheckedChange={(checked) => setNewEvent({...newEvent, needSponsors: checked})}
                          />
                          <Label>أحتاج رعاة للفعالية</Label>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">تاريخ الفعالية</label>
                        <Input 
                          type="date"
                          value={newEvent.endDate}
                          onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">الموقع</label>
                        <Input 
                          placeholder="مثال: أونلاين أو اسم المدينة"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Target Communities */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">المجتمعات المستهدفة</label>
                      <p className="text-xs text-muted-foreground mb-3">اختر المجتمعات التي تريد دعوتها</p>
                      <div className="grid grid-cols-3 gap-2">
                        {communities.map((community) => (
                          <div
                            key={community.id}
                            onClick={() => {
                              const isSelected = newEvent.targetCommunities.includes(community.id);
                              setNewEvent({
                                ...newEvent,
                                targetCommunities: isSelected 
                                  ? newEvent.targetCommunities.filter(c => c !== community.id)
                                  : [...newEvent.targetCommunities, community.id]
                              });
                            }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              newEvent.targetCommunities.includes(community.id)
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-border hover:border-border/80'
                            }`}
                          >
                            <community.icon className="w-5 h-5 mx-auto mb-1" />
                            <p className="text-xs text-center">{community.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className={`rounded-lg p-4 ${newEvent.pricing === 'free' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                    <div className="flex gap-3">
                      {newEvent.pricing === 'free' ? (
                        <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium mb-1 ${newEvent.pricing === 'free' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {newEvent.pricing === 'free' ? 'فعالية مجانية للمجتمع' : 'فعالية تجارية'}
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {newEvent.pricing === 'free' ? (
                            <>
                              <li>• سيتم نشر فعاليتك مباشرة للمجتمعات المختارة</li>
                              <li>• سنرسل دعوات للمهتمين في المجال</li>
                              <li>• لا حاجة لعقود أو اتفاقيات</li>
                            </>
                          ) : (
                            <>
                              <li>• سنربطك بالمجتمعات المتخصصة المناسبة</li>
                              <li>• سنجلب لك المهتمين والموهوبين في المجال</li>
                              {newEvent.needSponsors && <li>• سنوصلك بالرعاة المحتملين</li>}
                              <li>• سنوجهك إلى UPLINK3 لإتمام العقود</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCreateSubmit} className={`w-full ${newEvent.pricing === 'free' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'}`}>
                    <Send className="w-4 h-4 ml-2" />
                    {newEvent.pricing === 'free' ? 'نشر الفعالية المجانية' : 'إرسال وربط بالرعاة'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">
            <Brain className="w-3 h-3 ml-1" />
            UPLINK2 - التحديات والمطابقة
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">ابحث عن فعاليات أو أنشئ فعاليتك</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ونحن نجلب لك المجتمع
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            هاكاثون؟ ورشة عمل؟ دورة تدريبية؟ تجمع علمي؟ 
            ابحث عن الفعاليات التي تهمك أو أنشئ فعاليتك الخاصة
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'فعالية نشطة', value: '35+', icon: Calendar, color: 'text-blue-400' },
            { label: 'مشارك', value: '8,000+', icon: Users, color: 'text-emerald-400' },
            { label: 'فعالية مجانية', value: '20+', icon: Gift, color: 'text-pink-400' },
            { label: 'إجمالي الجوائز', value: '$15M+', icon: Trophy, color: 'text-amber-400' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 bg-card/50">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="find" className="gap-2">
              <Search className="w-4 h-4" />
              ابحث عن فعاليات
            </TabsTrigger>
            <TabsTrigger value="communities" className="gap-2">
              <Users className="w-4 h-4" />
              المجتمعات المتخصصة
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2">
              <Building2 className="w-4 h-4" />
              الرعاة
            </TabsTrigger>
          </TabsList>

          {/* Find Events Tab */}
          <TabsContent value="find" className="space-y-6">
            {/* Event Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-secondary/50 rounded-lg p-1">
                <Button
                  variant={eventMode === "business" ? "default" : "ghost"}
                  className={`gap-2 ${eventMode === "business" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                  onClick={() => setEventMode("business")}
                >
                  <Banknote className="w-4 h-4" />
                  فعاليات تجارية
                  <Badge className="bg-white/20">{businessEvents.length}</Badge>
                </Button>
                <Button
                  variant={eventMode === "free" ? "default" : "ghost"}
                  className={`gap-2 ${eventMode === "free" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                  onClick={() => setEventMode("free")}
                >
                  <Gift className="w-4 h-4" />
                  فعاليات مجانية
                  <Badge className="bg-white/20">{freeEvents.length}</Badge>
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="ابحث عن فعالية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {eventMode === "business" ? (
                    <>
                      <SelectItem value="hackathon">هاكاثون</SelectItem>
                      <SelectItem value="challenge">تحدي</SelectItem>
                      <SelectItem value="competition">مسابقة</SelectItem>
                      <SelectItem value="conference">مؤتمر</SelectItem>
                      <SelectItem value="exhibition">معرض</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="workshop">ورشة عمل</SelectItem>
                      <SelectItem value="training">دورة تدريبية</SelectItem>
                      <SelectItem value="meetup">تجمع علمي</SelectItem>
                      <SelectItem value="lecture">محاضرة</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="القطاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع القطاعات</SelectItem>
                  <SelectItem value="tech">التقنية</SelectItem>
                  <SelectItem value="health">الرعاية الصحية</SelectItem>
                  <SelectItem value="energy">الطاقة</SelectItem>
                  <SelectItem value="fintech">التقنية المالية</SelectItem>
                  <SelectItem value="space">الفضاء</SelectItem>
                  <SelectItem value="education">التعليم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => {
                const TypeIcon = typeLabels[event.type]?.icon || Target;
                return (
                  <Card key={event.id} className="border-0 bg-card/50 hover:bg-card/80 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{event.image}</div>
                          <div>
                            <div className="flex gap-2 mb-1">
                              <Badge className={typeLabels[event.type]?.color}>
                                <TypeIcon className="w-3 h-3 ml-1" />
                                {typeLabels[event.type]?.ar}
                              </Badge>
                              {event.pricing === 'free' ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400">
                                  <Gift className="w-3 h-3 ml-1" />
                                  مجاني
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/20 text-amber-400">
                                  <Banknote className="w-3 h-3 ml-1" />
                                  تجاري
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline">
                              {categoryLabels[event.category]?.ar}
                            </Badge>
                          </div>
                        </div>
                        {event.prize > 0 && (
                          <div className="text-left">
                            <div className="text-2xl font-bold text-amber-400">
                              ${event.prize.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">جائزة</div>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} مشارك</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(event.endDate).toLocaleDateString("ar-SA")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-secondary">
                              {event.organizer.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{event.organizer}</span>
                        </div>
                        <Button 
                          onClick={() => handleJoinEvent(event)}
                          className={event.pricing === 'free' 
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600" 
                            : "bg-gradient-to-r from-blue-500 to-indigo-600"
                          }
                        >
                          {event.pricing === 'free' ? 'سجل مجاناً' : 'شارك الآن'}
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">لا توجد فعاليات</h3>
                <p className="text-muted-foreground mb-4">جرب تغيير معايير البحث أو أنشئ فعاليتك الخاصة</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 ml-2" />
                  أنشئ فعالية جديدة
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">المجتمعات المتخصصة</h2>
              <p className="text-muted-foreground">
                انضم إلى مجتمعك المتخصص وتواصل مع المبتكرين والخبراء في مجالك
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} className="border-0 bg-card/50 hover:bg-card/80 transition-all group overflow-hidden">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${community.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <community.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-1">{community.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{community.nameEn}</p>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{community.members.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">عضو</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{community.projects}</div>
                        <div className="text-xs text-muted-foreground">مشروع</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      انضم للمجتمع
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">الرعاة والشركاء</h2>
              <p className="text-muted-foreground">
                تواصل مع الرعاة المهتمين بدعم الابتكار في مجالك
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {sponsorsData.map((sponsor) => (
                <Card key={sponsor.id} className="border-0 bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{sponsor.logo}</div>
                        <div>
                          <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                          <Badge className={
                            sponsor.type === 'platinum' ? 'bg-purple-500/20 text-purple-400' :
                            sponsor.type === 'gold' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-gray-500/20 text-gray-400'
                          }>
                            {sponsor.type === 'platinum' ? 'بلاتيني' : sponsor.type === 'gold' ? 'ذهبي' : 'فضي'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-emerald-400">{sponsor.budget}</div>
                        <div className="text-xs text-muted-foreground">ميزانية الرعاية</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {sponsor.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {categoryLabels[interest]?.ar || interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Handshake className="w-4 h-4 ml-2" />
                      طلب رعاية
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Become a Sponsor CTA */}
            <Card className="border-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-2xl font-bold mb-2">هل تريد أن تصبح راعياً؟</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  انضم إلى قائمة الرعاة وادعم الابتكار في المجالات التي تهمك
                </p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  سجل كراعي
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How it Works Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 border border-blue-500/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">كيف يعمل UPLINK2؟</h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'ابحث أو أنشئ فعالية', desc: 'ابحث عن فعاليات تهمك أو أنشئ فعاليتك (مجانية أو تجارية)' },
                  { step: 2, title: 'نربطك بالمجتمعات', desc: 'نجلب لك المهتمين والموهوبين من المجتمعات المتخصصة' },
                  { step: 3, title: 'للفعاليات التجارية', desc: 'نوصلك بالرعاة ونوجهك لـ UPLINK3 للعقود' },
                  { step: 4, title: 'للفعاليات المجانية', desc: 'تُنشر مباشرة للمجتمع بدون عقود' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6">
                <PartyPopper className="w-16 h-16 text-white" />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-5 h-5 ml-2" />
                أنشئ فعاليتك الآن
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
