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
import { trpc } from "@/lib/trpc";

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
const getSampleTrends = (isAr: boolean): Trend[] => [
  { id: "tr-1", title: "Generative AI", description: "AI for new content creation", category: "technology", impact: "high", maturity: 70, relevance: 95, sources: ["Gartner", "McKinsey"] },
  { id: "tr-2", title: "Digital Sustainability", description: "Reducing tech's carbon footprint", category: "market", impact: "high", maturity: 45, relevance: 85, sources: ["WEF", "Deloitte"] },
  { id: "tr-3", title: "Web3 & Blockchain", description: "Decentralization & Smart Contracts", category: "technology", impact: "medium", maturity: 55, relevance: 60, sources: ["Coinbase", "a16z"] },
  { id: "tr-4", title: "Hyper Customer Experience", description: "Hyper-personalization & Smart Interaction", category: "consumer", impact: "high", maturity: 65, relevance: 90, sources: ["Forrester", "Salesforce"] },
  { id: "tr-5", title: "Quantum Computing", description: "Unprecedented data processing speeds", category: "technology", impact: "high", maturity: 25, relevance: 40, sources: ["IBM", "Google"] }
];

const getSampleInitiatives = (isAr: boolean): StrategicInitiative[] => [
  { id: "si-1", title: "Digital Service Transformation", description: "Integrating traditional services digitally", priority: "high", status: "active", progress: 45, budget: 5000000, budgetSpent: 2250000, owner: "Ahmed Mohammed", startDate: "2024-01-01", endDate: "2024-12-31", kpis: [{ name: "Customer Satisfaction", target: 90, current: 78 }, { name: "Service Time", target: 5, current: 8 }] },
  { id: "si-2", title: "Environmental Sustainability", description: "Innovative solutions for environmental preservation & carbon reduction", priority: "high", status: "active", progress: 30, budget: 3000000, budgetSpent: 900000, owner: "Sara Ali", startDate: "2024-02-01", endDate: "2025-01-31", kpis: [{ name: "Emissions Reduction", target: 40, current: 15 }] },
  { id: "si-3", title: "Exceptional Customer Experience", description: "Redesigning customer journey for peak satisfaction", priority: "medium", status: "active", progress: 60, budget: 2000000, budgetSpent: 1200000, owner: "Mohammed Khaled", startDate: "2024-01-15", endDate: "2024-09-30", kpis: [{ name: "NPS", target: 70, current: 55 }, { name: "Retention Rate", target: 90, current: 75 }] }
];

const getSampleChallenges = (isAr: boolean): Challenge[] => [
  { id: "ch-1", title: "How to make registration 80% faster?", description: "Challenge: Reduce registration from 15 to 3 minutes", initiativeId: "si-1", status: "in_progress", ideasCount: 12, deadline: "2024-03-31", reward: "10,000 SAR", isOpen: true },
  { id: "ch-2", title: "How to reduce data center energy consumption?", description: "Challenge: 40% energy consumption reduction", initiativeId: "si-2", status: "open", ideasCount: 8, deadline: "2024-04-30", isOpen: true },
  { id: "ch-3", title: "How to improve customer retention?", description: "Increase retention from 70% to 90%", initiativeId: "si-3", status: "refined", ideasCount: 15, deadline: "2024-05-15", isOpen: false }
];

const getSampleIdeas = (isAr: boolean): Idea[] => [
  { id: "idea-1", title: "Biometric Registration", description: "Use face or fingerprint for instant registration", challengeId: "ch-1", status: "clustered", clusterId: "cluster-1", score: 85, aiScore: 88, votes: { up: 24, down: 3 }, author: "Ahmed Mohammed", createdAt: "2024-01-15", tags: [isAr ? "تقنية" : "Technology", isAr ? "أمان" : "Security", "UX"], comments: 15, views: 234, bookmarks: 12, potentialROI: 250, implementationCost: 500000, timeToMarket: "6 months" },
  { id: "idea-2", title: "National ID Integration", description: "Automatically retrieve data from ID database", challengeId: "ch-1", status: "clustered", clusterId: "cluster-1", score: 92, aiScore: 94, votes: { up: 31, down: 2 }, author: "Sara Ali", createdAt: "2024-01-16", tags: [isAr ? "تكامل" : "Integration", isAr ? "حكومي" : "Governmental"], comments: 22, views: 456, bookmarks: 28, potentialROI: 400, implementationCost: 300000, timeToMarket: "4 months" },
  { id: "idea-3", title: "AI Cooling", description: "Smart cooling system adapts to actual load", challengeId: "ch-2", status: "testing", score: 78, aiScore: 82, votes: { up: 18, down: 5 }, author: "Mohammed Khaled", createdAt: "2024-01-17", tags: ["AI", isAr ? "استدامة" : "Sustainability"], comments: 8, views: 156, bookmarks: 6, potentialROI: 180, implementationCost: 800000, timeToMarket: "12 months" },
  { id: "idea-4", title: "Tiered Loyalty Program", description: "Points & rewards system based on usage level", challengeId: "ch-3", status: "active", score: 70, aiScore: 72, votes: { up: 15, down: 8 }, author: "Fatima Ahmed", createdAt: "2024-01-18", tags: [isAr ? "ولاء" : "Loyalty", isAr ? "تسويق" : "Marketing"], comments: 12, views: 189, bookmarks: 9, potentialROI: 150, implementationCost: 200000, timeToMarket: "3 months" },
  { id: "idea-5", title: "Proactive Communication", description: "Communicate with customers before subscription expiry", challengeId: "ch-3", status: "parked", score: 55, aiScore: 58, votes: { up: 10, down: 12 }, author: "Omar Hassan", createdAt: "2024-01-19", tags: ["CRM", isAr ? "تواصل" : "Communication"], comments: 5, views: 87, bookmarks: 2, potentialROI: 80, implementationCost: 100000, timeToMarket: "2 months" }
];

const getSampleClusters = (isAr: boolean): Cluster[] => [
  { id: "cluster-1", name: "Digital Identity Solutions", description: "Ideas based on digital identity verification", ideas: ["idea-1", "idea-2"], status: "testing", aiSimilarity: 87 },
  { id: "cluster-2", name: "Customer Retention Solutions", description: "Ideas to improve customer loyalty", ideas: ["idea-4"], status: "active", aiSimilarity: 72 }
];

const getSampleHypotheses = (isAr: boolean): Hypothesis[] => [
  { id: "hyp-1", clusterId: "cluster-1", statement: "Using biometric verification will reduce registration time by 80%", assumptions: [{ text: "Users have fingerprint-enabled devices", risk: "medium", validated: true }, { text: "Infrastructure ready for integration", risk: "high", validated: false }, { text: "Users trust biometric verification", risk: "low", validated: true }], riskLevel: "medium", result: "pending", confidence: 65 }
];

const getSampleExperiments = (isAr: boolean): Experiment[] => [
  { id: "exp-1", hypothesisId: "hyp-1", title: "A/B test biometric enrollment", description: "Compare traditional vs. fingerprint enrollment", metrics: [{ name: "Enrollment time", target: 3, actual: 4.2 }, { name: "Completion rate", target: 95, actual: 88 }, { name: "User satisfaction", target: 4.5, actual: 4.1 }], status: "running", learnings: "", startDate: "2024-02-01", cost: 50000 }
];

const getSampleLeaderboard = (isAr: boolean): UserStats[] => [
  { id: "u-1", name: "Sara Ali", points: 2850, level: 8, badges: [isAr ? "مبتكر" : "Innovator", isAr ? "قائد" : "Leader", isAr ? "خبير" : "Expert"], ideasSubmitted: 24, ideasApproved: 18, experimentsRun: 5, rank: 1 },
  { id: "u-2", name: "Ahmed Mohammed", points: 2340, level: 7, badges: [isAr ? "مبتكر" : "Innovator", isAr ? "متعاون" : "Collaborator"], ideasSubmitted: 19, ideasApproved: 12, experimentsRun: 3, rank: 2 },
  { id: "u-3", name: "Mohammed Khaled", points: 1890, level: 6, badges: [isAr ? "باحث" : "Researcher", isAr ? "محلل" : "Analyst"], ideasSubmitted: 15, ideasApproved: 9, experimentsRun: 4, rank: 3 },
  { id: "u-4", name: "Fatima Ahmed", points: 1560, level: 5, badges: [isAr ? "مبتكر" : "Innovator"], ideasSubmitted: 12, ideasApproved: 7, experimentsRun: 2, rank: 4 },
  { id: "u-5", name: "Omar Hassan", points: 1230, level: 4, badges: [isAr ? "متعاون" : "Collaborator"], ideasSubmitted: 10, ideasApproved: 5, experimentsRun: 1, rank: 5 }
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const categoryColors: Record<TrendCategory, string> = {
    technology: "bg-blue-500/10 text-blue-500",
    market: "bg-green-500/10 text-green-500",
    consumer: "bg-purple-500/10 text-purple-500",
    regulatory: "bg-orange-500/10 text-orange-500",
    competitive: "bg-red-500/10 text-red-500"
  };
  const categoryLabels: Record<TrendCategory, string> = {
    technology: "Technology",
    market: "Market",
    consumer: "Consumer",
    regulatory: "Regulatory",
    competitive: "Competitive"
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
            <span className="text-muted-foreground">{isAr ? "النضج" : "Maturity"}</span>
            <span>{trend.maturity}%</span>
          </div>
          <Progress value={trend.maturity} className="h-1.5" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{isAr ? "الصلة" : "Relevance"}</span>
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-500" />
          {isAr ? "مصفوفة محفظة الابتكار" : "Innovation Portfolio Matrix"}
        </CardTitle>
        <CardDescription>{isAr ? "توزيع المبادرات حسب المخاطر والعائد المتوقع" : "Initiative distribution by risk & expected return"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 h-64">
          <div className="border-l-2 border-b-2 border-border relative">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">{isAr ? "عائد منخفض" : "Low return"}</div>
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">{isAr ? "مخاطر عالية" : "High risk"}</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <p className="text-xs text-red-500 font-medium">{isAr ? "تجنب" : "Avoid"}</p>
                <p className="text-lg font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="border-b-2 border-border relative">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">{isAr ? "عائد عالي" : "High return"}</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-xs text-yellow-500 font-medium">{isAr ? "استثمار حذر" : "Cautious investment"}</p>
                <p className="text-lg font-bold">{initiatives.filter(i => i.priority === "high").length}</p>
              </div>
            </div>
          </div>
          <div className="border-l-2 border-border relative">
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">{isAr ? "مخاطر منخفضة" : "Low risk"}</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <p className="text-xs text-blue-500 font-medium">{isAr ? "تحسين" : "Optimize"}</p>
                <p className="text-lg font-bold">{initiatives.filter(i => i.priority === "low").length}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-xs text-green-500 font-medium">{isAr ? "استثمار قوي" : "Strong investment"}</p>
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const rankIcons = [Crown, Medal, Award];
  const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {isAr ? "قادة الابتكار" : "Innovation Leaders"}
        </CardTitle>
        <CardDescription>{isAr ? "أكثر المبتكرين نشاطاً وتأثيراً" : "Most Active & Influential Innovators"}</CardDescription>
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
                  <span>{isAr ? "المستوى" : "Level"} {user.level}</span>
                  <span>•</span>
                  <span>{user.ideasSubmitted} {isAr ? "فكرة" : "Idea"}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-cyan-500">{user.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{isAr ? "نقطة" : "Point"}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AIInsightsCard({ ideas }: { ideas: Idea[] }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const topIdeas = ideas.filter(i => (i.aiScore || 0) >= 80).slice(0, 3);
  const duplicates = 2; // Simulated
  const gaps = useMemo(() => isAr ? [isAr ? "تجربة المستخدم على الموبايل" : "Mobile UX", isAr ? "التكامل مع الأنظمة القديمة" : "Legacy System Integration"] : ["Mobile User Experience", "Legacy System Integration"], [isAr]);

  return (
    <Card className="border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          {isAr ? "رؤى الذكاء الاصطناعي" : "AI Insights"}
        </CardTitle>
        <CardDescription>{isAr ? "تحليلات وتوصيات مدعومة بالـ AI" : "AI-Powered Analytics & Recommendations"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            {isAr ? "أفكار واعدة" : "Promising Ideas"}
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
            {isAr ? "أفكار مكررة محتملة" : "Potential Duplicate Ideas"}
          </p>
          <p className="text-sm text-muted-foreground">{isAr ? `تم اكتشاف ${duplicates} أفكار متشابهة يمكن دمجها` : `Discovered ${duplicates} similar ideas that can be merged`}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            {isAr ? "فجوات مكتشفة" : "Identified Gaps"}
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const totalBudget = initiatives.reduce((sum, i) => sum + i.budget, 0);
  const totalSpent = initiatives.reduce((sum, i) => sum + i.budgetSpent, 0);
  const percentSpent = Math.round((totalSpent / totalBudget) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          {isAr ? "تتبع الميزانية" : "Budget Tracking"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{(totalSpent / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-muted-foreground">{isAr ? `من ${(totalBudget / 1000000).toFixed(1)}M ريال` : `of ${(totalBudget / 1000000).toFixed(1)}M SAR`}</p>
        </div>
        <Progress value={percentSpent} className="h-3" />
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-green-500">{100 - percentSpent}%</p>
            <p className="text-xs text-muted-foreground">{isAr ? "متبقي" : "Remaining"}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-cyan-500">{initiatives.length}</p>
            <p className="text-xs text-muted-foreground">{isAr ? "مبادرة نشطة" : "Active Initiative"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineFlow() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const stages = useMemo(() => [
    { id: "trends", label: "Trends", icon: Radar, color: "bg-violet-500", count: 5 },
    { id: "strategy", label: "Strategy", icon: Target, color: "bg-blue-500", count: 3 },
    { id: "initiative", label: "Initiatives", icon: Rocket, color: "bg-indigo-500", count: 3 },
    { id: "challenge", label: "Challenges", icon: Crosshair, color: "bg-orange-500", count: 3 },
    { id: "ideation", label: "Ideas", icon: Lightbulb, color: "bg-yellow-500", count: 5 },
    { id: "cluster", label: "Collection", icon: Layers, color: "bg-green-500", count: 2 },
    { id: "hypothesis", label: "Hypotheses", icon: GitBranch, color: "bg-teal-500", count: 1 },
    { id: "experiment", label: "Experiments", icon: Beaker, color: "bg-pink-500", count: 1 },
    { id: "decision", label: "Decision", icon: CheckCircle2, color: "bg-emerald-500", count: 0 }
  ], [isAr]);

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
                      <p>{stage.count} {isAr ? "عنصر في" : "Item in"} {stage.label}</p>
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const priorityColors: Record<RiskLevel, string> = { high: "bg-red-500/10 text-red-500", medium: "bg-yellow-500/10 text-yellow-500", low: "bg-green-500/10 text-green-500" };
  const priorityLabels: Record<RiskLevel, string> = { high: "High", medium: "Medium", low: "Low" };
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
            <span className="text-muted-foreground">{isAr ? "التقدم" : "Progress"}</span>
            <span className="font-medium">{initiative.progress}%</span>
          </div>
          <Progress value={initiative.progress} className="h-2" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{isAr ? "الميزانية" : "Budget"}</span>
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const statusColors = { open: "bg-blue-500/10 text-blue-500", in_progress: "bg-yellow-500/10 text-yellow-500", refined: "bg-green-500/10 text-green-500", closed: "bg-gray-500/10 text-gray-500" };
  const statusLabels = { open: "Open", in_progress: "In Progress", refined: "Optimized", closed: "Closed" };

  return (
    <Card className="hover:border-orange-500/50 transition-all cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base group-hover:text-orange-400 transition-colors">{challenge.title}</CardTitle>
          <div className="flex items-center gap-1">
            {challenge.isOpen && <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500">{isAr ? "مفتوح للجميع" : "Public"}</Badge>}
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const statusColors: Record<IdeaStatus, string> = { active: "bg-blue-500/10 text-blue-500", parked: "bg-yellow-500/10 text-yellow-500", killed: "bg-red-500/10 text-red-500", clustered: "bg-purple-500/10 text-purple-500", testing: "bg-green-500/10 text-green-500", approved: "bg-emerald-500/10 text-emerald-500", implemented: "bg-cyan-500/10 text-cyan-500" };
  const statusLabels: Record<IdeaStatus, string> = { active: "Active", parked: "Paused", killed: "Canceled", clustered: "Clustered", testing: "In Testing", approved: "Approved", implemented: "Implemented" };

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
                <TooltipContent>{isAr ? "تقييم الذكاء الاصطناعي" : "AI Score"}</TooltipContent>
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
              <p className="text-muted-foreground">{isAr ? "التكلفة" : "Cost"}</p>
              <p className="font-medium">{(idea.implementationCost! / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-muted-foreground">{isAr ? "الوقت" : "Time"}</p>
              <p className="font-medium">{idea.timeToMarket}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClusterCard({ cluster, ideas, onTest }: { cluster: Cluster; ideas: Idea[]; onTest: () => void }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

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
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500">{cluster.aiSimilarity}% {isAr ? "تشابه" : "Similarity"}</Badge>
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
            <span className="text-muted-foreground">{isAr ? "متوسط التقييم: " : "Avg. Score: "}</span>
            <span className="font-medium text-cyan-500">{avgScore}%</span>
          </div>
          <Button size="sm" onClick={onTest} className="bg-gradient-to-r from-teal-500 to-green-500">
            <Beaker className="w-3 h-3 mr-1" />{isAr ? "اختبار" : "Test"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HypothesisCard({ hypothesis, onRunExperiment }: { hypothesis: Hypothesis; onRunExperiment: () => void }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const riskColors: Record<RiskLevel, string> = { high: "text-red-500", medium: "text-yellow-500", low: "text-green-500" };
  const resultColors: Record<HypothesisResult, string> = { pending: "bg-gray-500/10 text-gray-500", supports: "bg-green-500/10 text-green-500", rejects: "bg-red-500/10 text-red-500", refine: "bg-yellow-500/10 text-yellow-500" };
  const resultLabels: Record<HypothesisResult, string> = { pending: "Pending", supports: "Supported", rejects: "Rejected", refine: "Needs Improvement" };

  return (
    <Card className="border-teal-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-teal-500" />
            {isAr ? "فرضية" : "Hypothesis"}
          </CardTitle>
          <Badge className={resultColors[hypothesis.result]}>{resultLabels[hypothesis.result]}</Badge>
        </div>
        <CardDescription className="mt-2 font-medium text-foreground">{hypothesis.statement}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">{isAr ? "الافتراضات (RATs):" : "Assumptions (RATs):"}</p>
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
            <span className="text-xs text-muted-foreground">{isAr ? "الثقة:" : "Confidence:"}</span>
            <Progress value={hypothesis.confidence} className="w-20 h-2" />
            <span className="text-xs font-medium">{hypothesis.confidence}%</span>
          </div>
          <Button size="sm" onClick={onRunExperiment} className="bg-gradient-to-r from-pink-500 to-purple-500">
            <Play className="w-3 h-3 mr-1" />{isAr ? "تجربة" : "Experiment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExperimentCard({ experiment, onComplete }: { experiment: Experiment; onComplete: (result: "success" | "failure" | "inconclusive") => void }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const statusColors = { planned: "bg-gray-500/10 text-gray-500", running: "bg-blue-500/10 text-blue-500", completed: "bg-green-500/10 text-green-500" };
  const statusLabels = { planned: "Planned", running: "Ongoing", completed: "Completed" };

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
          <p className="text-xs text-muted-foreground mb-2">{isAr ? "المقاييس:" : "Metrics:"}</p>
          <div className="space-y-2">
            {experiment.metrics.map((metric, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{metric.name}</span>
                  <span>{metric.actual !== undefined ? `${metric.actual} / ${metric.target}` : `${isAr ? "هدف" : "Goal"}: ${metric.target}`}</span>
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
            <span>{(experiment.cost / 1000).toFixed(0)}K {isAr ? "ريال" : "SAR"}</span>
          </div>
        </div>
        {experiment.status === "running" && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1 text-green-500 border-green-500/30" onClick={() => onComplete("success")}>
              <CheckCircle2 className="w-3 h-3 mr-1" />{isAr ? "نجاح" : "Success"}
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-500/30" onClick={() => onComplete("failure")}>
              <XCircle className="w-3 h-3 mr-1" />{isAr ? "فشل" : "Failure"}
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-yellow-500 border-yellow-500/30" onClick={() => onComplete("inconclusive")}>
              <RotateCcw className="w-3 h-3 mr-1" />{isAr ? "غير حاسم" : "Undecided"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== MAIN COMPONENT ====================
export default function InnovationPipeline() {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState("dashboard");
  const [initiatives, setInitiatives] = useState(getSampleInitiatives(isAr));
  const [challenges, setChallenges] = useState(getSampleChallenges(isAr));
  const [ideas, setIdeas] = useState(getSampleIdeas(isAr));
  const [clusters, setClusters] = useState(getSampleClusters(isAr));
  const [hypotheses, setHypotheses] = useState(getSampleHypotheses(isAr));
  const [experiments, setExperiments] = useState(getSampleExperiments(isAr));
  const [trends] = useState(getSampleTrends(isAr));
  const [leaderboard] = useState(getSampleLeaderboard(isAr));
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showNewIdeaDialog, setShowNewIdeaDialog] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", tags: "" });

  // API Integration
  const { data: pipelineStats } = trpc.pipeline.getStats.useQuery();
  const createIdeaMutation = trpc.pipeline.createIdea.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم إضافة الفكرة بنجاح! +10 نقاط" : "Idea added successfully! +10 points");
      setShowNewIdeaDialog(false);
      setNewIdea({ title: "", description: "", tags: "" });
    },
    onError: () => {
      toast.error(isAr ? "فشل في إضافة الفكرة" : "Failed to add idea");
    }
  });

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
    toast.success(type === "up" ? (isAr ? "تم التصويت بالموافقة" : "Upvoted") : (isAr ? "تم التصويت بالرفض" : "Downvoted"));
  };

  const handleStatusChange = (ideaId: string, status: IdeaStatus) => {
    setIdeas(prev => prev.map(idea => idea.id === ideaId ? { ...idea, status } : idea));
    const statusLabels: Record<IdeaStatus, string> = { active: "Active", parked: "Paused", killed: "Canceled", clustered: "Clustered", testing: "In Testing", approved: "Approved", implemented: "Implemented" };
    toast.success(isAr ? `تم تغيير الحالة إلى ${statusLabels[status]}` : `Status changed to ${statusLabels[status]}`);
  };

  const handleAddIdea = () => {
    if (!newIdea.title || !selectedChallenge) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    // Use API to create idea
    createIdeaMutation.mutate({
      title: newIdea.title,
      description: newIdea.description,
      challengeId: parseInt(selectedChallenge),
      tags: newIdea.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    });
  };

  const handleExperimentComplete = (expId: string, result: "success" | "failure" | "inconclusive") => {
    setExperiments(prev => prev.map(exp => exp.id === expId ? { ...exp, status: "completed" as const, result } : exp));
    const resultText = result === "success" ? (isAr ? "نجاح" : "Success") : result === "failure" ? (isAr ? "فشل" : "Failure") : (isAr ? "غير حاسم" : "Undecided");
    toast.success(isAr ? `تم إكمال التجربة: ${resultText}` : `Experiment completed: ${resultText}`);
  };

  const handleExportPDF = () => {
    // Generate PDF report content
    const reportData = {
      title: "Innovation Pipeline Report",
      date: new Date().toLocaleDateString(isAr ? "ar-SA" : "en-US"),
      stats: {
        totalIdeas,
        activeIdeas,
        approvedIdeas,
        avgScore,
        totalInitiatives: initiatives.length,
        totalChallenges: challenges.length,
        totalExperiments: experiments.length
      },
      initiatives: initiatives.map(i => ({
        title: i.title,
        status: i.status,
        progress: i.progress,
        budget: i.budget,
        budgetSpent: i.budgetSpent
      })),
      topIdeas: ideas.slice(0, 5).map(i => ({
        title: i.title,
        score: i.score,
        status: i.status,
        votes: i.votes
      }))
    };

    // Create printable HTML
    const printContent = `
      <!DOCTYPE html>
      <html dir="${isAr ? "rtl" : "ltr"}" lang="${isAr ? "ar" : "en"}">
      <head>
        <meta charset="UTF-8">
        <title>${reportData.title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; direction: ${isAr ? "rtl" : "ltr"}; }
          h1 { color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #0891b2; }
          .stat-label { color: #6b7280; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: ${isAr ? "right" : "left"}; }
          th { background: #f9fafb; font-weight: 600; }
          .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>🚀 ${reportData.title}</h1>
        <p>${isAr ? "تاريخ التقرير" : "Report Date"}: ${reportData.date}</p>

        <h2>📊 ${isAr ? "الإحصائيات العامة" : "General Statistics"}</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${reportData.stats.totalIdeas}</div>
            <div class="stat-label">${isAr ? "إجمالي الأفكار" : "Total Ideas"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${reportData.stats.activeIdeas}</div>
            <div class="stat-label">${isAr ? "أفكار نشطة" : "Active Ideas"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${reportData.stats.approvedIdeas}</div>
            <div class="stat-label">${isAr ? "أفكار معتمدة" : "Approved Ideas"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${reportData.stats.avgScore}%</div>
            <div class="stat-label">${isAr ? "متوسط التقييم" : "Average Rating"}</div>
          </div>
        </div>

        <h2>🎯 ${isAr ? "المبادرات الاستراتيجية" : "Strategic Initiatives"}</h2>
        <table>
          <thead>
            <tr>
              <th>${isAr ? "العنوان" : "Title"}</th>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "التقدم" : "Progress"}</th>
              <th>${isAr ? "الميزانية" : "Budget"}</th>
              <th>${isAr ? "المصروف" : "Spent"}</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.initiatives.map(i => `
              <tr>
                <td>${i.title}</td>
                <td>${i.status === 'active' ? (isAr ? 'نشط' : 'Active') : i.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'متوقف' : 'Paused')}</td>
                <td>${i.progress}%</td>
                <td>${(i.budget / 1000000).toFixed(1)}M</td>
                <td>${(i.budgetSpent / 1000000).toFixed(1)}M</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>💡 ${isAr ? "أفضل الأفكار" : "Top Ideas"}</h2>
        <table>
          <thead>
            <tr>
              <th>${isAr ? "العنوان" : "Title"}</th>
              <th>${isAr ? "التقييم" : "Rating"}</th>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "التصويتات" : "Votes"}</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.topIdeas.map(i => `
              <tr>
                <td>${i.title}</td>
                <td>${i.score}%</td>
                <td>${i.status}</td>
                <td>✅ ${i.votes.up} | ❌ ${i.votes.down}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>${isAr ? "تم إنشاء هذا التقرير بواسطة NAQLA 5.0 - Innovation Pipeline" : "This report was generated by NAQLA 5.0 - Innovation Pipeline"}</p>
          <p>© ${new Date().getFullYear()} ${isAr ? "منصة الابتكار الوطنية" : "National Innovation Platform"}</p>
        </div>
      </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
      toast.success(isAr ? "تم فتح نافذة الطباعة - يمكنك حفظه ك PDF" : "Print window opened - you can save as PDF");
    } else {
      toast.error(isAr ? "فشل في فتح نافذة الطباعة" : "Failed to open print window");
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                {isAr ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {isAr ? "العودة" : "Back"}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Innovation Pipeline</h1>
                <p className="text-xs text-muted-foreground">{isAr ? "نظام إدارة الابتكار المتكامل" : "Integrated Innovation Management System"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExportPDF()}>
              <Download className="w-4 h-4 mr-1" />
              {isAr ? "تصدير PDF" : "Export PDF"}
            </Button>
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
            <TabsTrigger value="dashboard">{isAr ? "لوحة التحكم" : "Dashboard"}</TabsTrigger>
            <TabsTrigger value="trends">{isAr ? "الاتجاهات" : "Trends"}</TabsTrigger>
            <TabsTrigger value="initiatives">{isAr ? "المبادرات" : "Initiatives"}</TabsTrigger>
            <TabsTrigger value="challenges">{isAr ? "التحديات" : "Challenges"}</TabsTrigger>
            <TabsTrigger value="ideas">{isAr ? "الأفكار" : "Ideas"}</TabsTrigger>
            <TabsTrigger value="experiments">{isAr ? "التجارب" : "Experiments"}</TabsTrigger>
            <TabsTrigger value="leaderboard">{isAr ? "المتصدرين" : "Leaderboard"}</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title={isAr ? "إجمالي الأفكار" : "Total Ideas"} value={totalIdeas} change={12} icon={Lightbulb} color="bg-yellow-500" />
              <MetricCard title={isAr ? "أفكار نشطة" : "Active Ideas"} value={activeIdeas} change={8} icon={Activity} color="bg-blue-500" />
              <MetricCard title={isAr ? "أفكار معتمدة" : "Approved Ideas"} value={approvedIdeas} change={25} icon={CheckCircle2} color="bg-green-500" />
              <MetricCard title={isAr ? "متوسط التقييم" : "Average Rating"} value={`${avgScore}%`} change={5} icon={BarChart3} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PortfolioMatrix initiatives={initiatives} />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      {isAr ? "أفضل الأفكار" : "Top Ideas"}
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
                <h2 className="text-xl font-bold">{isAr ? "استكشاف الاتجاهات" : "Explore Trends"}</h2>
                <p className="text-muted-foreground">{isAr ? "تتبع التقنيات والاتجاهات الناشئة" : "Track Emerging Tech & Trends"}</p>
              </div>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-500">
                <Plus className="w-4 h-4 ml-2" />
                {isAr ? "إضافة اتجاه" : "Add Trend"}
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
                  {isAr ? <ArrowRight className="w-4 h-4 ml-1" /> : <ArrowLeft className="w-4 h-4 mr-1" />}
                  {isAr ? "كل المبادرات" : "All Initiatives"}
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
                      {isAr ? <ArrowRight className="w-4 h-4 ml-1" /> : <ArrowLeft className="w-4 h-4 mr-1" />}
                      {isAr ? "كل التحديات" : "All Challenges"}
                    </Button>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium">{challenges.find(c => c.id === selectedChallenge)?.title}</span>
                  </>
                )}
              </div>
              <Dialog open={showNewIdeaDialog} onOpenChange={setShowNewIdeaDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                    <Plus className="w-4 h-4 ml-2" />{isAr ? "فكرة جديدة" : "New Idea"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isAr ? "إضافة فكرة جديدة" : "Add New Idea"}</DialogTitle>
                    <DialogDescription>{isAr ? "شارك فكرتك المبتكرة لحل التحدي" : "Share your innovative idea to solve the challenge"}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>{isAr ? "التحدي" : "Challenge"}</Label>
                      <Select value={selectedChallenge || ""} onValueChange={setSelectedChallenge}>
                        <SelectTrigger><SelectValue placeholder={isAr ? "اختر التحدي" : "Select Challenge"} /></SelectTrigger>
                        <SelectContent>{challenges.map(ch => <SelectItem key={ch.id} value={ch.id}>{ch.title}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{isAr ? "عنوان الفكرة" : "Idea Title"}</Label>
                      <Input value={newIdea.title} onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))} placeholder={isAr ? "عنوان موجز ومعبر" : "Concise and descriptive title"} />
                    </div>
                    <div className="space-y-2">
                      <Label>{isAr ? "وصف الفكرة" : "Idea Description"}</Label>
                      <Textarea value={newIdea.description} onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))} placeholder={isAr ? "اشرح فكرتك بالتفصيل..." : "Explain your idea in detail..."} rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>{isAr ? "الوسوم (مفصولة بفاصلة)" : "Tags (comma-separated)"}</Label>
                      <Input value={newIdea.tags} onChange={(e) => setNewIdea(prev => ({ ...prev, tags: e.target.value }))} placeholder={isAr ? "تقنية, ابتكار, UX" : "Tech, Innovation, UX"} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewIdeaDialog(false)}>{isAr ? "إلغاء" : "Cancel"}</Button>
                    <Button onClick={handleAddIdea}>{isAr ? "إضافة الفكرة" : "Add Idea"}</Button>
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
                  {isAr ? "المجموعات" : "Groups"}
                </h3>
                {clusters.map(cluster => (
                  <ClusterCard key={cluster.id} cluster={cluster} ideas={ideas} onTest={() => { toast.success(isAr ? "تم بدء اختبار الفرضيات" : "Hypothesis testing started"); }} />
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-teal-500" />
                  {isAr ? "الفرضيات" : "Hypotheses"}
                </h3>
                {hypotheses.map(hypothesis => (
                  <HypothesisCard key={hypothesis.id} hypothesis={hypothesis} onRunExperiment={() => { toast.success(isAr ? "تم إنشاء تجربة جديدة" : "New experiment created"); }} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Beaker className="w-5 h-5 text-pink-500" />
                {isAr ? "التجارب الجارية" : "Ongoing Experiments"}
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
                  {isAr ? "مصفوفة القرارات" : "Decision Matrix"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />{isAr ? "للتطوير" : "For Development"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{isAr ? "الأفكار التي أثبتت جدواها" : "Validated Ideas"}</p>
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
                        <PauseCircle className="w-5 h-5" />{isAr ? "للإيقاف المؤقت" : "For Pause"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{isAr ? "أفكار تحتاج مزيداً من الوقت" : "Ideas Needing More Time"}</p>
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
                        <XCircle className="w-5 h-5" />{isAr ? "للإلغاء" : "Cancel"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{isAr ? "أفكار لم تثبت جدواها" : "Unproven Ideas"}</p>
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
                      {isAr ? "الشارات المتاحة" : "Available Badges"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Innovator", desc: "Submitted 10 Ideas", icon: Lightbulb, color: "text-yellow-500" },
                      { name: "Leader", desc: "3 Approved Ideas", icon: Crown, color: "text-purple-500" },
                      { name: "Expert", desc: "Conducted 5 Experiments", icon: Beaker, color: "text-pink-500" },
                      { name: "Collaborator", desc: "50 Votes", icon: Users, color: "text-blue-500" },
                      { name: "Researcher", desc: "Discovered 3 Trends", icon: Radar, color: "text-green-500" }
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
                      {isAr ? "نقاطك" : "Your Points"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-4xl font-bold text-cyan-500">0</p>
                    <p className="text-sm text-muted-foreground mt-1">{isAr ? "ابدأ بإضافة أفكار لكسب النقاط!" : "Start adding ideas to earn points!"}</p>
                    <Button className="mt-4 w-full" onClick={() => setActiveTab("ideas")}>
                      <Plus className="w-4 h-4 ml-2" />{isAr ? "أضف فكرة الآن" : "Add Idea Now"}
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