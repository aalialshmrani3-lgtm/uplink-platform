import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { 
  ArrowRight, ArrowLeft, Target, Lightbulb, Rocket, FlaskConical, CheckCircle2, XCircle, PauseCircle,
  Plus, ChevronRight, ChevronDown, Sparkles, Brain, Layers, GitBranch, Beaker, AlertTriangle,
  ThumbsUp, ThumbsDown, RotateCcw, Play, Filter, Activity, Zap, TrendingUp, TrendingDown,
  BarChart3, PieChart, LineChart, Users, Globe, Award, Trophy, Star, Medal, Crown,
  Briefcase, DollarSign, Calendar, Clock, Eye, MessageSquare, Share2, Download, Upload,
  Settings, Search, Bell, Bookmark, Heart, Flag, Link2, ExternalLink, Copy, Trash2,
  Edit3, MoreHorizontal, ChevronUp, ArrowUpRight, Percent, Hash, AtSign, Cpu, Wand2,
  Compass, Map, Route, Milestone, Target as TargetIcon, Crosshair, Focus, Scan, Radar
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ==================== TYPES ====================
type IdeaStatus = "active" | "parked" | "killed" | "clustered" | "testing" | "approved" | "implemented";
type HypothesisResult = "pending" | "supports" | "rejects" | "refine";
type TrendCategory = "technology" | "market" | "consumer" | "regulatory" | "competitive";
type RiskLevel = "high" | "medium" | "low";

interface StrategicInitiative {
  id: string;
  title: string;
  description: string;
  priority: RiskLevel;
  status: "active" | "completed" | "paused";
  progress: number;
  budget: number;
  budgetSpent: number;
  owner: string;
  startDate: string;
  endDate: string;
  kpis: { name: string; target: number; current: number }[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  initiativeId: string;
  status: "open" | "in_progress" | "refined" | "closed";
  ideasCount: number;
  deadline: string;
  reward?: string;
  isOpen: boolean; // Open Innovation
}

interface Idea {
  id: string;
  title: string;
  description: string;
  challengeId: string;
  status: IdeaStatus;
  clusterId?: string;
  score: number;
  aiScore?: number;
  votes: { up: number; down: number };
  author: string;
  authorAvatar?: string;
  createdAt: string;
  tags: string[];
  comments: number;
  views: number;
  bookmarks: number;
  potentialROI?: number;
  implementationCost?: number;
  timeToMarket?: string;
}

interface Cluster {
  id: string;
  name: string;
  description: string;
  ideas: string[];
  status: "active" | "testing" | "parked" | "killed" | "approved";
  aiSimilarity: number;
}

interface Hypothesis {
  id: string;
  clusterId: string;
  statement: string;
  assumptions: { text: string; risk: RiskLevel; validated: boolean }[];
  riskLevel: RiskLevel;
  result: HypothesisResult;
  confidence: number;
}

interface Experiment {
  id: string;
  hypothesisId: string;
  title: string;
  description: string;
  metrics: { name: string; target: number; actual?: number }[];
  status: "planned" | "running" | "completed";
  result?: "success" | "failure" | "inconclusive";
  learnings: string;
  startDate: string;
  endDate?: string;
  cost: number;
}

interface Trend {
  id: string;
  title: string;
  description: string;
  category: TrendCategory;
  impact: RiskLevel;
  maturity: number;
  relevance: number;
  sources: string[];
}

interface UserStats {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  badges: string[];
  ideasSubmitted: number;
  ideasApproved: number;
  experimentsRun: number;
  rank: number;
}

// ==================== SAMPLE DATA ====================
const sampleTrends: Trend[] = [
  { id: "tr-1", title: "الذكاء الاصطناعي التوليدي", description: "تقنيات AI قادرة على إنشاء محتوى جديد", category: "technology", impact: "high", maturity: 70, relevance: 95, sources: ["Gartner", "McKinsey"] },
  { id: "tr-2", title: "الاستدامة الرقمية", description: "تقليل البصمة الكربونية للتقنيات", category: "market", impact: "high", maturity: 45, relevance: 85, sources: ["WEF", "Deloitte"] },
  { id: "tr-3", title: "Web3 والبلوكتشين", description: "اللامركزية والعقود الذكية", category: "technology", impact: "medium", maturity: 55, relevance: 60, sources: ["Coinbase", "a16z"] },
  { id: "tr-4", title: "تجربة العميل الفائقة", description: "التخصيص المفرط والتفاعل الذكي", category: "consumer", impact: "high", maturity: 65, relevance: 90, sources: ["Forrester", "Salesforce"] },
  { id: "tr-5", title: "الحوسبة الكمية", description: "معالجة البيانات بسرعات غير مسبوقة", category: "technology", impact: "high", maturity: 25, relevance: 40, sources: ["IBM", "Google"] }
];

const sampleInitiatives: StrategicInitiative[] = [
  { id: "si-1", title: "التحول الرقمي للخدمات", description: "تحويل جميع الخدمات التقليدية إلى خدمات رقمية متكاملة", priority: "high", status: "active", progress: 45, budget: 5000000, budgetSpent: 2250000, owner: "أحمد محمد", startDate: "2024-01-01", endDate: "2024-12-31", kpis: [{ name: "رضا العملاء", target: 90, current: 78 }, { name: "وقت الخدمة", target: 5, current: 8 }] },
  { id: "si-2", title: "الاستدامة البيئية", description: "تطوير حلول مبتكرة للحفاظ على البيئة وتقليل البصمة الكربونية", priority: "high", status: "active", progress: 30, budget: 3000000, budgetSpent: 900000, owner: "سارة علي", startDate: "2024-02-01", endDate: "2025-01-31", kpis: [{ name: "تقليل الانبعاثات", target: 40, current: 15 }] },
  { id: "si-3", title: "تجربة العميل المتميزة", description: "إعادة تصميم رحلة العميل لتحقيق أعلى مستويات الرضا", priority: "medium", status: "active", progress: 60, budget: 2000000, budgetSpent: 1200000, owner: "محمد خالد", startDate: "2024-01-15", endDate: "2024-09-30", kpis: [{ name: "NPS", target: 70, current: 55 }, { name: "معدل الاحتفاظ", target: 90, current: 75 }] }
];

const sampleChallenges: Challenge[] = [
  { id: "ch-1", title: "كيف نجعل التسجيل أسرع بنسبة 80%؟", description: "تحدي تقليل وقت التسجيل من 15 دقيقة إلى 3 دقائق", initiativeId: "si-1", status: "in_progress", ideasCount: 12, deadline: "2024-03-31", reward: "10,000 ريال", isOpen: true },
  { id: "ch-2", title: "كيف نقلل استهلاك الطاقة في مراكز البيانات؟", description: "تحدي خفض استهلاك الطاقة بنسبة 40%", initiativeId: "si-2", status: "open", ideasCount: 8, deadline: "2024-04-30", isOpen: true },
  { id: "ch-3", title: "كيف نحسن معدل الاحتفاظ بالعملاء؟", description: "زيادة معدل الاحتفاظ من 70% إلى 90%", initiativeId: "si-3", status: "refined", ideasCount: 15, deadline: "2024-05-15", isOpen: false }
];

const sampleIdeas: Idea[] = [
  { id: "idea-1", title: "التسجيل عبر البصمة الرقمية", description: "استخدام بصمة الوجه أو الإصبع للتسجيل الفوري", challengeId: "ch-1", status: "clustered", clusterId: "cluster-1", score: 85, aiScore: 88, votes: { up: 24, down: 3 }, author: "أحمد محمد", createdAt: "2024-01-15", tags: ["تقنية", "أمان", "UX"], comments: 15, views: 234, bookmarks: 12, potentialROI: 250, implementationCost: 500000, timeToMarket: "6 أشهر" },
  { id: "idea-2", title: "الربط مع الهوية الوطنية", description: "سحب البيانات تلقائياً من قاعدة بيانات الهوية", challengeId: "ch-1", status: "clustered", clusterId: "cluster-1", score: 92, aiScore: 94, votes: { up: 31, down: 2 }, author: "سارة علي", createdAt: "2024-01-16", tags: ["تكامل", "حكومي"], comments: 22, views: 456, bookmarks: 28, potentialROI: 400, implementationCost: 300000, timeToMarket: "4 أشهر" },
  { id: "idea-3", title: "التبريد بالذكاء الاصطناعي", description: "نظام تبريد ذكي يتكيف مع الحمل الفعلي", challengeId: "ch-2", status: "testing", score: 78, aiScore: 82, votes: { up: 18, down: 5 }, author: "محمد خالد", createdAt: "2024-01-17", tags: ["AI", "استدامة"], comments: 8, views: 156, bookmarks: 6, potentialROI: 180, implementationCost: 800000, timeToMarket: "12 شهر" },
  { id: "idea-4", title: "برنامج ولاء متدرج", description: "نظام نقاط ومكافآت حسب مستوى الاستخدام", challengeId: "ch-3", status: "active", score: 70, aiScore: 72, votes: { up: 15, down: 8 }, author: "فاطمة أحمد", createdAt: "2024-01-18", tags: ["ولاء", "تسويق"], comments: 12, views: 189, bookmarks: 9, potentialROI: 150, implementationCost: 200000, timeToMarket: "3 أشهر" },
  { id: "idea-5", title: "التواصل الاستباقي", description: "التواصل مع العملاء قبل انتهاء اشتراكهم", challengeId: "ch-3", status: "parked", score: 55, aiScore: 58, votes: { up: 10, down: 12 }, author: "عمر حسن", createdAt: "2024-01-19", tags: ["CRM", "تواصل"], comments: 5, views: 87, bookmarks: 2, potentialROI: 80, implementationCost: 100000, timeToMarket: "2 أشهر" }
];

const sampleClusters: Cluster[] = [
  { id: "cluster-1", name: "حلول الهوية الرقمية", description: "مجموعة أفكار تعتمد على التحقق الرقمي من الهوية", ideas: ["idea-1", "idea-2"], status: "testing", aiSimilarity: 87 },
  { id: "cluster-2", name: "حلول الاحتفاظ بالعملاء", description: "أفكار لتحسين ولاء العملاء", ideas: ["idea-4"], status: "active", aiSimilarity: 72 }
];

const sampleHypotheses: Hypothesis[] = [
  { id: "hyp-1", clusterId: "cluster-1", statement: "إذا استخدمنا التحقق البيومتري، سينخفض وقت التسجيل بنسبة 80%", assumptions: [{ text: "المستخدمون يملكون أجهزة تدعم البصمة", risk: "medium", validated: true }, { text: "البنية التحتية جاهزة للتكامل", risk: "high", validated: false }, { text: "المستخدمون يثقون بالتحقق البيومتري", risk: "low", validated: true }], riskLevel: "medium", result: "pending", confidence: 65 }
];

const sampleExperiments: Experiment[] = [
  { id: "exp-1", hypothesisId: "hyp-1", title: "اختبار A/B للتسجيل البيومتري", description: "مقارنة التسجيل التقليدي مع التسجيل بالبصمة", metrics: [{ name: "وقت التسجيل", target: 3, actual: 4.2 }, { name: "معدل الإكمال", target: 95, actual: 88 }, { name: "رضا المستخدم", target: 4.5, actual: 4.1 }], status: "running", learnings: "", startDate: "2024-02-01", cost: 50000 }
];

const sampleLeaderboard: UserStats[] = [
  { id: "u-1", name: "سارة علي", points: 2850, level: 8, badges: ["مبتكر", "قائد", "خبير"], ideasSubmitted: 24, ideasApproved: 18, experimentsRun: 5, rank: 1 },
  { id: "u-2", name: "أحمد محمد", points: 2340, level: 7, badges: ["مبتكر", "متعاون"], ideasSubmitted: 19, ideasApproved: 12, experimentsRun: 3, rank: 2 },
  { id: "u-3", name: "محمد خالد", points: 1890, level: 6, badges: ["باحث", "محلل"], ideasSubmitted: 15, ideasApproved: 9, experimentsRun: 4, rank: 3 },
  { id: "u-4", name: "فاطمة أحمد", points: 1560, level: 5, badges: ["مبتكر"], ideasSubmitted: 12, ideasApproved: 7, experimentsRun: 2, rank: 4 },
  { id: "u-5", name: "عمر حسن", points: 1230, level: 4, badges: ["متعاون"], ideasSubmitted: 10, ideasApproved: 5, experimentsRun: 1, rank: 5 }
];

// ==================== COMPONENTS ====================

function MetricCard({ title, value, change, icon: Icon, color }: { title: string; value: string | number; change?: number; icon: any; color: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-full -translate-y-8 translate-x-8`} />
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendCard({ trend }: { trend: Trend }) {
  const categoryColors: Record<TrendCategory, string> = {
    technology: "bg-blue-500/10 text-blue-500",
    market: "bg-green-500/10 text-green-500",
    consumer: "bg-purple-500/10 text-purple-500",
    regulatory: "bg-orange-500/10 text-orange-500",
    competitive: "bg-red-500/10 text-red-500"
  };
  const categoryLabels: Record<TrendCategory, string> = {
    technology: "تقنية",
    market: "سوق",
    consumer: "مستهلك",
    regulatory: "تنظيمي",
    competitive: "تنافسي"
  };
  const impactColors: Record<RiskLevel, string> = { high: "text-red-500", medium: "text-yellow-500", low: "text-green-500" };

  return (
    <Card className="hover:border-cyan-500/30 transition-all group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={categoryColors[trend.category]}>{categoryLabels[trend.category]}</Badge>
              <Radar className={`w-4 h-4 ${impactColors[trend.impact]}`} />
            </div>
            <CardTitle className="text-base group-hover:text-cyan-400 transition-colors">{trend.title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm">{trend.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">النضج</span>
            <span>{trend.maturity}%</span>
          </div>
          <Progress value={trend.maturity} className="h-1.5" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">الصلة</span>
            <span>{trend.relevance}%</span>
          </div>
          <Progress value={trend.relevance} className="h-1.5" />
        </div>
        <div className="flex flex-wrap gap-1">
          {trend.sources.map((source, i) => (
            <Badge key={i} variant="outline" className="text-xs">{source}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PortfolioMatrix({ initiatives }: { initiatives: StrategicInitiative[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-500" />
          مصفوفة محفظة الابتكار
        </CardTitle>
        <CardDescription>توزيع المبادرات حسب المخاطر والعائد المتوقع</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 h-64">
          <div className="border-l-2 border-b-2 border-border relative">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">عائد منخفض</div>
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">مخاطر عالية</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <p className="text-xs text-red-500 font-medium">تجنب</p>
                <p className="text-lg font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="border-b-2 border-border relative">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">عائد عالي</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-xs text-yellow-500 font-medium">استثمار حذر</p>
                <p className="text-lg font-bold">{initiatives.filter(i => i.priority === "high").length}</p>
              </div>
            </div>
          </div>
          <div className="border-l-2 border-border relative">
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">مخاطر منخفضة</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <p className="text-xs text-blue-500 font-medium">تحسين</p>
                <p className="text-lg font-bold">{initiatives.filter(i => i.priority === "low").length}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-xs text-green-500 font-medium">استثمار قوي</p>
                <p className="text-lg font-bold">{initiatives.filter(i => i.priority === "medium").length}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardCard({ users }: { users: UserStats[] }) {
  const rankIcons = [Crown, Medal, Award];
  const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          قادة الابتكار
        </CardTitle>
        <CardDescription>أكثر المبتكرين نشاطاً وتأثيراً</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.slice(0, 5).map((user, index) => {
          const RankIcon = rankIcons[index] || Star;
          const rankColor = rankColors[index] || "text-muted-foreground";
          return (
            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 flex items-center justify-center ${rankColor}`}>
                {index < 3 ? <RankIcon className="w-5 h-5" /> : <span className="font-bold">{user.rank}</span>}
              </div>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{user.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>المستوى {user.level}</span>
                  <span>•</span>
                  <span>{user.ideasSubmitted} فكرة</span>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-cyan-500">{user.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">نقطة</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AIInsightsCard({ ideas }: { ideas: Idea[] }) {
  const topIdeas = ideas.filter(i => (i.aiScore || 0) >= 80).slice(0, 3);
  const duplicates = 2; // Simulated
  const gaps = ["تجربة المستخدم على الموبايل", "التكامل مع الأنظمة القديمة"];

  return (
    <Card className="border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          رؤى الذكاء الاصطناعي
        </CardTitle>
        <CardDescription>تحليلات وتوصيات مدعومة بالـ AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            أفكار واعدة
          </p>
          <div className="space-y-1">
            {topIdeas.map(idea => (
              <div key={idea.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                <span>{idea.title}</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">{idea.aiScore}%</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Copy className="w-4 h-4 text-orange-500" />
            أفكار مكررة محتملة
          </p>
          <p className="text-sm text-muted-foreground">تم اكتشاف {duplicates} أفكار متشابهة يمكن دمجها</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            فجوات مكتشفة
          </p>
          <div className="flex flex-wrap gap-1">
            {gaps.map((gap, i) => (
              <Badge key={i} variant="outline" className="text-xs">{gap}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetTracker({ initiatives }: { initiatives: StrategicInitiative[] }) {
  const totalBudget = initiatives.reduce((sum, i) => sum + i.budget, 0);
  const totalSpent = initiatives.reduce((sum, i) => sum + i.budgetSpent, 0);
  const percentSpent = Math.round((totalSpent / totalBudget) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          تتبع الميزانية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{(totalSpent / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-muted-foreground">من {(totalBudget / 1000000).toFixed(1)}M ريال</p>
        </div>
        <Progress value={percentSpent} className="h-3" />
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-green-500">{100 - percentSpent}%</p>
            <p className="text-xs text-muted-foreground">متبقي</p>
          </div>
          <div>
            <p className="text-lg font-bold text-cyan-500">{initiatives.length}</p>
            <p className="text-xs text-muted-foreground">مبادرة نشطة</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineFlow() {
  const stages = [
    { id: "trends", label: "الاتجاهات", icon: Radar, color: "bg-violet-500", count: 5 },
    { id: "strategy", label: "الاستراتيجية", icon: Target, color: "bg-blue-500", count: 3 },
    { id: "initiative", label: "المبادرات", icon: Rocket, color: "bg-indigo-500", count: 3 },
    { id: "challenge", label: "التحديات", icon: Crosshair, color: "bg-orange-500", count: 3 },
    { id: "ideation", label: "الأفكار", icon: Lightbulb, color: "bg-yellow-500", count: 5 },
    { id: "cluster", label: "التجميع", icon: Layers, color: "bg-green-500", count: 2 },
    { id: "hypothesis", label: "الفرضيات", icon: GitBranch, color: "bg-teal-500", count: 1 },
    { id: "experiment", label: "التجارب", icon: Beaker, color: "bg-pink-500", count: 1 },
    { id: "decision", label: "القرار", icon: CheckCircle2, color: "bg-emerald-500", count: 0 }
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-max">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center cursor-pointer group">
                        <div className={`${stage.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform relative`}>
                          <stage.icon className="w-5 h-5 text-white" />
                          {stage.count > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-xs font-bold rounded-full flex items-center justify-center text-gray-800 shadow">
                              {stage.count}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] mt-1.5 text-center max-w-[60px] text-muted-foreground">{stage.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stage.count} عنصر في {stage.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {index < stages.length - 1 && (
                  <div className="flex items-center mx-1">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/20" />
                    <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InitiativeCard({ initiative, onSelect }: { initiative: StrategicInitiative; onSelect: () => void }) {
  const priorityColors: Record<RiskLevel, string> = { high: "bg-red-500/10 text-red-500", medium: "bg-yellow-500/10 text-yellow-500", low: "bg-green-500/10 text-green-500" };
  const priorityLabels: Record<RiskLevel, string> = { high: "عالية", medium: "متوسطة", low: "منخفضة" };
  const budgetPercent = Math.round((initiative.budgetSpent / initiative.budget) * 100);

  return (
    <Card className="hover:border-cyan-500/50 transition-all cursor-pointer group" onClick={onSelect}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors">{initiative.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{initiative.description}</CardDescription>
          </div>
          <Badge className={priorityColors[initiative.priority]}>{priorityLabels[initiative.priority]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">التقدم</span>
            <span className="font-medium">{initiative.progress}%</span>
          </div>
          <Progress value={initiative.progress} className="h-2" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">الميزانية</span>
            <span className="font-medium">{budgetPercent}%</span>
          </div>
          <Progress value={budgetPercent} className="h-2" />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{initiative.owner}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{initiative.endDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeCard({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const statusColors = { open: "bg-blue-500/10 text-blue-500", in_progress: "bg-yellow-500/10 text-yellow-500", refined: "bg-green-500/10 text-green-500", closed: "bg-gray-500/10 text-gray-500" };
  const statusLabels = { open: "مفتوح", in_progress: "قيد التنفيذ", refined: "محسّن", closed: "مغلق" };

  return (
    <Card className="hover:border-orange-500/50 transition-all cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base group-hover:text-orange-400 transition-colors">{challenge.title}</CardTitle>
          <div className="flex items-center gap-1">
            {challenge.isOpen && <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500">مفتوح للجميع</Badge>}
            <Badge className={statusColors[challenge.status]}>{statusLabels[challenge.status]}</Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /><span>{challenge.ideasCount}</span></div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{challenge.deadline}</span></div>
          </div>
          {challenge.reward && <Badge variant="outline" className="bg-green-500/10 text-green-500">{challenge.reward}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

function IdeaCard({ idea, onVote, onStatusChange }: { idea: Idea; onVote: (type: "up" | "down") => void; onStatusChange: (status: IdeaStatus) => void }) {
  const statusColors: Record<IdeaStatus, string> = { active: "bg-blue-500/10 text-blue-500", parked: "bg-yellow-500/10 text-yellow-500", killed: "bg-red-500/10 text-red-500", clustered: "bg-purple-500/10 text-purple-500", testing: "bg-green-500/10 text-green-500", approved: "bg-emerald-500/10 text-emerald-500", implemented: "bg-cyan-500/10 text-cyan-500" };
  const statusLabels: Record<IdeaStatus, string> = { active: "نشط", parked: "متوقف", killed: "ملغي", clustered: "مجمّع", testing: "قيد الاختبار", approved: "معتمد", implemented: "منفذ" };

  return (
    <Card className="hover:border-cyan-500/30 transition-all group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base group-hover:text-cyan-400 transition-colors">{idea.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{idea.description}</CardDescription>
          </div>
          <Badge className={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {idea.tags.map((tag, i) => <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>)}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Eye className="w-3 h-3" />{idea.views}</div>
            <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{idea.comments}</div>
            <div className="flex items-center gap-1"><Bookmark className="w-3 h-3" />{idea.bookmarks}</div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); onVote("up"); }}>
              <ThumbsUp className="w-3 h-3 mr-1" />{idea.votes.up}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); onVote("down"); }}>
              <ThumbsDown className="w-3 h-3 mr-1" />{idea.votes.down}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-gradient-to-br from-cyan-500 to-blue-500 text-white">{idea.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{idea.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-xs">
                    <Brain className="w-3 h-3 text-purple-500" />
                    <span className="font-medium">{idea.aiScore}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>تقييم الذكاء الاصطناعي</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-xs font-medium text-cyan-500">{idea.score}%</div>
          </div>
        </div>
        {idea.potentialROI && (
          <div className="grid grid-cols-3 gap-2 text-xs text-center pt-2 border-t">
            <div>
              <p className="text-muted-foreground">ROI</p>
              <p className="font-medium text-green-500">{idea.potentialROI}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">التكلفة</p>
              <p className="font-medium">{(idea.implementationCost! / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-muted-foreground">الوقت</p>
              <p className="font-medium">{idea.timeToMarket}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClusterCard({ cluster, ideas, onTest }: { cluster: Cluster; ideas: Idea[]; onTest: () => void }) {
  const clusterIdeas = ideas.filter(i => cluster.ideas.includes(i.id));
  const avgScore = Math.round(clusterIdeas.reduce((sum, i) => sum + i.score, 0) / clusterIdeas.length);
  const statusColors = { active: "border-blue-500/30", testing: "border-green-500/30", parked: "border-yellow-500/30", killed: "border-red-500/30", approved: "border-emerald-500/30" };

  return (
    <Card className={`${statusColors[cluster.status]} transition-all`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              {cluster.name}
            </CardTitle>
            <CardDescription className="mt-1">{cluster.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500">{cluster.aiSimilarity}% تشابه</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {clusterIdeas.map(idea => (
            <Badge key={idea.id} variant="outline" className="text-xs">{idea.title}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">متوسط التقييم: </span>
            <span className="font-medium text-cyan-500">{avgScore}%</span>
          </div>
          <Button size="sm" onClick={onTest} className="bg-gradient-to-r from-teal-500 to-green-500">
            <Beaker className="w-3 h-3 mr-1" />اختبار
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HypothesisCard({ hypothesis, onRunExperiment }: { hypothesis: Hypothesis; onRunExperiment: () => void }) {
  const riskColors: Record<RiskLevel, string> = { high: "text-red-500", medium: "text-yellow-500", low: "text-green-500" };
  const resultColors: Record<HypothesisResult, string> = { pending: "bg-gray-500/10 text-gray-500", supports: "bg-green-500/10 text-green-500", rejects: "bg-red-500/10 text-red-500", refine: "bg-yellow-500/10 text-yellow-500" };
  const resultLabels: Record<HypothesisResult, string> = { pending: "قيد الانتظار", supports: "مدعومة", rejects: "مرفوضة", refine: "تحتاج تحسين" };

  return (
    <Card className="border-teal-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-teal-500" />
            فرضية
          </CardTitle>
          <Badge className={resultColors[hypothesis.result]}>{resultLabels[hypothesis.result]}</Badge>
        </div>
        <CardDescription className="mt-2 font-medium text-foreground">{hypothesis.statement}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">الافتراضات (RATs):</p>
          <div className="space-y-1">
            {hypothesis.assumptions.map((assumption, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {assumption.validated ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <AlertTriangle className={`w-3 h-3 ${riskColors[assumption.risk]}`} />}
                <span className={assumption.validated ? "line-through text-muted-foreground" : ""}>{assumption.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">الثقة:</span>
            <Progress value={hypothesis.confidence} className="w-20 h-2" />
            <span className="text-xs font-medium">{hypothesis.confidence}%</span>
          </div>
          <Button size="sm" onClick={onRunExperiment} className="bg-gradient-to-r from-pink-500 to-purple-500">
            <Play className="w-3 h-3 mr-1" />تجربة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExperimentCard({ experiment, onComplete }: { experiment: Experiment; onComplete: (result: "success" | "failure" | "inconclusive") => void }) {
  const statusColors = { planned: "bg-gray-500/10 text-gray-500", running: "bg-blue-500/10 text-blue-500", completed: "bg-green-500/10 text-green-500" };
  const statusLabels = { planned: "مخطط", running: "جاري", completed: "مكتمل" };

  return (
    <Card className="border-pink-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Beaker className="w-4 h-4 text-pink-500" />
            {experiment.title}
          </CardTitle>
          <Badge className={statusColors[experiment.status]}>{statusLabels[experiment.status]}</Badge>
        </div>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">المقاييس:</p>
          <div className="space-y-2">
            {experiment.metrics.map((metric, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{metric.name}</span>
                  <span>{metric.actual !== undefined ? `${metric.actual} / ${metric.target}` : `هدف: ${metric.target}`}</span>
                </div>
                {metric.actual !== undefined && (
                  <Progress value={(metric.actual / metric.target) * 100} className="h-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{experiment.startDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{(experiment.cost / 1000).toFixed(0)}K ريال</span>
          </div>
        </div>
        {experiment.status === "running" && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1 text-green-500 border-green-500/30" onClick={() => onComplete("success")}>
              <CheckCircle2 className="w-3 h-3 mr-1" />نجاح
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-500/30" onClick={() => onComplete("failure")}>
              <XCircle className="w-3 h-3 mr-1" />فشل
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-yellow-500 border-yellow-500/30" onClick={() => onComplete("inconclusive")}>
              <RotateCcw className="w-3 h-3 mr-1" />غير حاسم
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== MAIN COMPONENT ====================
export default function InnovationPipeline() {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [initiatives, setInitiatives] = useState(sampleInitiatives);
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [clusters, setClusters] = useState(sampleClusters);
  const [hypotheses, setHypotheses] = useState(sampleHypotheses);
  const [experiments, setExperiments] = useState(sampleExperiments);
  const [trends] = useState(sampleTrends);
  const [leaderboard] = useState(sampleLeaderboard);
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showNewIdeaDialog, setShowNewIdeaDialog] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", tags: "" });

  // Stats
  const totalIdeas = ideas.length;
  const activeIdeas = ideas.filter(i => i.status === "active" || i.status === "testing").length;
  const approvedIdeas = ideas.filter(i => i.status === "approved" || i.status === "implemented").length;
  const avgScore = Math.round(ideas.reduce((sum, i) => sum + i.score, 0) / ideas.length);

  const handleVote = (ideaId: string, type: "up" | "down") => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, votes: { ...idea.votes, [type]: idea.votes[type] + 1 } };
      }
      return idea;
    }));
    toast.success(type === "up" ? "تم التصويت بالموافقة" : "تم التصويت بالرفض");
  };

  const handleStatusChange = (ideaId: string, status: IdeaStatus) => {
    setIdeas(prev => prev.map(idea => idea.id === ideaId ? { ...idea, status } : idea));
    toast.success(`تم تغيير الحالة إلى ${status}`);
  };

  const handleAddIdea = () => {
    if (!newIdea.title || !selectedChallenge) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    const idea: Idea = {
      id: `idea-${Date.now()}`,
      title: newIdea.title,
      description: newIdea.description,
      challengeId: selectedChallenge,
      status: "active",
      score: 50,
      aiScore: Math.floor(Math.random() * 30) + 50,
      votes: { up: 0, down: 0 },
      author: "أنت",
      createdAt: new Date().toISOString().split("T")[0],
      tags: newIdea.tags.split(",").map(t => t.trim()).filter(Boolean),
      comments: 0,
      views: 0,
      bookmarks: 0
    };
    setIdeas(prev => [idea, ...prev]);
    setNewIdea({ title: "", description: "", tags: "" });
    setShowNewIdeaDialog(false);
    toast.success("تم إضافة الفكرة بنجاح! +10 نقاط");
  };

  const handleExperimentComplete = (expId: string, result: "success" | "failure" | "inconclusive") => {
    setExperiments(prev => prev.map(exp => exp.id === expId ? { ...exp, status: "completed" as const, result } : exp));
    toast.success(`تم إكمال التجربة: ${result === "success" ? "نجاح" : result === "failure" ? "فشل" : "غير حاسم"}`);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Innovation Pipeline</h1>
                <p className="text-xs text-muted-foreground">نظام إدارة الابتكار المتكامل</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Pipeline Flow */}
        <PipelineFlow />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full max-w-4xl mx-auto">
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
            <TabsTrigger value="initiatives">المبادرات</TabsTrigger>
            <TabsTrigger value="challenges">التحديات</TabsTrigger>
            <TabsTrigger value="ideas">الأفكار</TabsTrigger>
            <TabsTrigger value="experiments">التجارب</TabsTrigger>
            <TabsTrigger value="leaderboard">المتصدرين</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="إجمالي الأفكار" value={totalIdeas} change={12} icon={Lightbulb} color="bg-yellow-500" />
              <MetricCard title="أفكار نشطة" value={activeIdeas} change={8} icon={Activity} color="bg-blue-500" />
              <MetricCard title="أفكار معتمدة" value={approvedIdeas} change={25} icon={CheckCircle2} color="bg-green-500" />
              <MetricCard title="متوسط التقييم" value={`${avgScore}%`} change={5} icon={BarChart3} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PortfolioMatrix initiatives={initiatives} />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      أفضل الأفكار
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ideas.sort((a, b) => b.score - a.score).slice(0, 4).map(idea => (
                        <IdeaCard key={idea.id} idea={idea} onVote={(type) => handleVote(idea.id, type)} onStatusChange={(status) => handleStatusChange(idea.id, status)} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <BudgetTracker initiatives={initiatives} />
                <AIInsightsCard ideas={ideas} />
              </div>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">استكشاف الاتجاهات</h2>
                <p className="text-muted-foreground">تتبع التقنيات والاتجاهات الناشئة</p>
              </div>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-500">
                <Plus className="w-4 h-4 ml-2" />
                إضافة اتجاه
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map(trend => <TrendCard key={trend.id} trend={trend} />)}
            </div>
          </TabsContent>

          {/* Initiatives Tab */}
          <TabsContent value="initiatives" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initiatives.map(initiative => (
                <InitiativeCard key={initiative.id} initiative={initiative} onSelect={() => { setSelectedInitiative(initiative.id); setActiveTab("challenges"); }} />
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            {selectedInitiative && (
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedInitiative(null)}>
                  <ArrowRight className="w-4 h-4 ml-1" />كل المبادرات
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{initiatives.find(i => i.id === selectedInitiative)?.title}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.filter(c => !selectedInitiative || c.initiativeId === selectedInitiative).map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => { setSelectedChallenge(challenge.id); setActiveTab("ideas"); }} />
              ))}
            </div>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedChallenge && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedChallenge(null)}>
                      <ArrowRight className="w-4 h-4 ml-1" />كل التحديات
                    </Button>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium">{challenges.find(c => c.id === selectedChallenge)?.title}</span>
                  </>
                )}
              </div>
              <Dialog open={showNewIdeaDialog} onOpenChange={setShowNewIdeaDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                    <Plus className="w-4 h-4 ml-2" />فكرة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة فكرة جديدة</DialogTitle>
                    <DialogDescription>شارك فكرتك المبتكرة لحل التحدي</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>التحدي</Label>
                      <Select value={selectedChallenge || ""} onValueChange={setSelectedChallenge}>
                        <SelectTrigger><SelectValue placeholder="اختر التحدي" /></SelectTrigger>
                        <SelectContent>{challenges.map(ch => <SelectItem key={ch.id} value={ch.id}>{ch.title}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان الفكرة</Label>
                      <Input value={newIdea.title} onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))} placeholder="عنوان موجز ومعبر" />
                    </div>
                    <div className="space-y-2">
                      <Label>وصف الفكرة</Label>
                      <Textarea value={newIdea.description} onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))} placeholder="اشرح فكرتك بالتفصيل..." rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>الوسوم (مفصولة بفاصلة)</Label>
                      <Input value={newIdea.tags} onChange={(e) => setNewIdea(prev => ({ ...prev, tags: e.target.value }))} placeholder="تقنية, ابتكار, UX" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewIdeaDialog(false)}>إلغاء</Button>
                    <Button onClick={handleAddIdea}>إضافة الفكرة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.filter(i => !selectedChallenge || i.challengeId === selectedChallenge).map(idea => (
                <IdeaCard key={idea.id} idea={idea} onVote={(type) => handleVote(idea.id, type)} onStatusChange={(status) => handleStatusChange(idea.id, status)} />
              ))}
            </div>
          </TabsContent>

          {/* Experiments Tab */}
          <TabsContent value="experiments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  المجموعات
                </h3>
                {clusters.map(cluster => (
                  <ClusterCard key={cluster.id} cluster={cluster} ideas={ideas} onTest={() => { toast.success("تم بدء اختبار الفرضيات"); }} />
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-teal-500" />
                  الفرضيات
                </h3>
                {hypotheses.map(hypothesis => (
                  <HypothesisCard key={hypothesis.id} hypothesis={hypothesis} onRunExperiment={() => { toast.success("تم إنشاء تجربة جديدة"); }} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Beaker className="w-5 h-5 text-pink-500" />
                التجارب الجارية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiments.map(experiment => (
                  <ExperimentCard key={experiment.id} experiment={experiment} onComplete={(result) => handleExperimentComplete(experiment.id, result)} />
                ))}
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  مصفوفة القرارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />للتطوير
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">الأفكار التي أثبتت جدواها</p>
                      <div className="mt-4 space-y-2">
                        {ideas.filter(i => i.status === "approved" || (i.status === "testing" && i.score >= 80)).map(idea => (
                          <Badge key={idea.id} variant="outline" className="mr-1 bg-green-500/10">{idea.title}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-yellow-500">
                        <PauseCircle className="w-5 h-5" />للإيقاف المؤقت
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">أفكار تحتاج مزيداً من الوقت</p>
                      <div className="mt-4 space-y-2">
                        {ideas.filter(i => i.status === "parked").map(idea => (
                          <Badge key={idea.id} variant="outline" className="mr-1 bg-yellow-500/10">{idea.title}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-500/30 bg-red-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-red-500">
                        <XCircle className="w-5 h-5" />للإلغاء
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">أفكار لم تثبت جدواها</p>
                      <div className="mt-4 space-y-2">
                        {ideas.filter(i => i.status === "killed").map(idea => (
                          <Badge key={idea.id} variant="outline" className="mr-1 bg-red-500/10">{idea.title}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LeaderboardCard users={leaderboard} />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      الشارات المتاحة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "مبتكر", desc: "قدم 10 أفكار", icon: Lightbulb, color: "text-yellow-500" },
                      { name: "قائد", desc: "3 أفكار معتمدة", icon: Crown, color: "text-purple-500" },
                      { name: "خبير", desc: "أجرى 5 تجارب", icon: Beaker, color: "text-pink-500" },
                      { name: "متعاون", desc: "50 تصويت", icon: Users, color: "text-blue-500" },
                      { name: "باحث", desc: "اكتشف 3 اتجاهات", icon: Radar, color: "text-green-500" }
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                        <div>
                          <p className="font-medium text-sm">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      نقاطك
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-4xl font-bold text-cyan-500">0</p>
                    <p className="text-sm text-muted-foreground mt-1">ابدأ بإضافة أفكار لكسب النقاط!</p>
                    <Button className="mt-4 w-full" onClick={() => setActiveTab("ideas")}>
                      <Plus className="w-4 h-4 ml-2" />أضف فكرة الآن
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
