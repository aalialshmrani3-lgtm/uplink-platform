import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  ArrowRight,
  Target, 
  Lightbulb, 
  Rocket, 
  FlaskConical,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Plus,
  ChevronRight,
  Sparkles,
  Brain,
  Layers,
  GitBranch,
  Beaker,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Play,
  Filter,
  Activity,
  Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type IdeaStatus = "active" | "parked" | "killed" | "clustered" | "testing";
type HypothesisResult = "pending" | "supports" | "rejects" | "refine";

interface StrategicInitiative {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed" | "paused";
  progress: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  initiativeId: string;
  status: "open" | "in_progress" | "refined" | "closed";
  ideasCount: number;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  challengeId: string;
  status: IdeaStatus;
  clusterId?: string;
  score: number;
  votes: { up: number; down: number };
  author: string;
  createdAt: string;
}

interface Cluster {
  id: string;
  name: string;
  description: string;
  ideas: string[];
  status: "active" | "testing" | "parked" | "killed";
}

interface Hypothesis {
  id: string;
  clusterId: string;
  statement: string;
  assumptions: string[];
  riskLevel: "high" | "medium" | "low";
  result: HypothesisResult;
}

interface Experiment {
  id: string;
  hypothesisId: string;
  title: string;
  description: string;
  metrics: string[];
  status: "planned" | "running" | "completed";
  result?: "success" | "failure" | "inconclusive";
  learnings: string;
}

const sampleInitiatives: StrategicInitiative[] = [
  { id: "si-1", title: "التحول الرقمي للخدمات", description: "تحويل جميع الخدمات التقليدية إلى خدمات رقمية متكاملة", priority: "high", status: "active", progress: 45 },
  { id: "si-2", title: "الاستدامة البيئية", description: "تطوير حلول مبتكرة للحفاظ على البيئة وتقليل البصمة الكربونية", priority: "high", status: "active", progress: 30 },
  { id: "si-3", title: "تجربة العميل المتميزة", description: "إعادة تصميم رحلة العميل لتحقيق أعلى مستويات الرضا", priority: "medium", status: "active", progress: 60 }
];

const sampleChallenges: Challenge[] = [
  { id: "ch-1", title: "كيف نجعل التسجيل أسرع بنسبة 80%؟", description: "تحدي تقليل وقت التسجيل من 15 دقيقة إلى 3 دقائق", initiativeId: "si-1", status: "in_progress", ideasCount: 12 },
  { id: "ch-2", title: "كيف نقلل استهلاك الطاقة في مراكز البيانات؟", description: "تحدي خفض استهلاك الطاقة بنسبة 40%", initiativeId: "si-2", status: "open", ideasCount: 8 },
  { id: "ch-3", title: "كيف نحسن معدل الاحتفاظ بالعملاء؟", description: "زيادة معدل الاحتفاظ من 70% إلى 90%", initiativeId: "si-3", status: "refined", ideasCount: 15 }
];

const sampleIdeas: Idea[] = [
  { id: "idea-1", title: "التسجيل عبر البصمة الرقمية", description: "استخدام بصمة الوجه أو الإصبع للتسجيل الفوري", challengeId: "ch-1", status: "clustered", clusterId: "cluster-1", score: 85, votes: { up: 24, down: 3 }, author: "أحمد محمد", createdAt: "2024-01-15" },
  { id: "idea-2", title: "الربط مع الهوية الوطنية", description: "سحب البيانات تلقائياً من قاعدة بيانات الهوية", challengeId: "ch-1", status: "clustered", clusterId: "cluster-1", score: 92, votes: { up: 31, down: 2 }, author: "سارة علي", createdAt: "2024-01-16" },
  { id: "idea-3", title: "التبريد بالذكاء الاصطناعي", description: "نظام تبريد ذكي يتكيف مع الحمل الفعلي", challengeId: "ch-2", status: "testing", score: 78, votes: { up: 18, down: 5 }, author: "محمد خالد", createdAt: "2024-01-17" },
  { id: "idea-4", title: "برنامج ولاء متدرج", description: "نظام نقاط ومكافآت حسب مستوى الاستخدام", challengeId: "ch-3", status: "active", score: 70, votes: { up: 15, down: 8 }, author: "فاطمة أحمد", createdAt: "2024-01-18" },
  { id: "idea-5", title: "التواصل الاستباقي", description: "التواصل مع العملاء قبل انتهاء اشتراكهم", challengeId: "ch-3", status: "parked", score: 55, votes: { up: 10, down: 12 }, author: "عمر حسن", createdAt: "2024-01-19" }
];

const sampleClusters: Cluster[] = [
  { id: "cluster-1", name: "حلول الهوية الرقمية", description: "مجموعة أفكار تعتمد على التحقق الرقمي من الهوية", ideas: ["idea-1", "idea-2"], status: "testing" },
  { id: "cluster-2", name: "حلول الاحتفاظ بالعملاء", description: "أفكار لتحسين ولاء العملاء", ideas: ["idea-4"], status: "active" }
];

const sampleHypotheses: Hypothesis[] = [
  { id: "hyp-1", clusterId: "cluster-1", statement: "إذا استخدمنا التحقق البيومتري، سينخفض وقت التسجيل بنسبة 80%", assumptions: ["المستخدمون يملكون أجهزة تدعم البصمة", "البنية التحتية جاهزة للتكامل", "المستخدمون يثقون بالتحقق البيومتري"], riskLevel: "medium", result: "pending" }
];

const sampleExperiments: Experiment[] = [
  { id: "exp-1", hypothesisId: "hyp-1", title: "اختبار A/B للتسجيل البيومتري", description: "مقارنة التسجيل التقليدي مع التسجيل بالبصمة", metrics: ["وقت التسجيل", "معدل الإكمال", "رضا المستخدم"], status: "running", learnings: "" }
];

function PipelineFlow() {
  const stages = [
    { id: "business", label: "استراتيجية الأعمال", icon: Target, color: "bg-blue-500" },
    { id: "innovation", label: "استراتيجية الابتكار", icon: Lightbulb, color: "bg-purple-500" },
    { id: "initiative", label: "المبادرات", icon: Rocket, color: "bg-indigo-500" },
    { id: "ideation", label: "توليد الأفكار", icon: Brain, color: "bg-cyan-500" },
    { id: "challenge", label: "التحديات", icon: Target, color: "bg-orange-500" },
    { id: "ideas", label: "الأفكار", icon: Sparkles, color: "bg-yellow-500" },
    { id: "cluster", label: "التجميع", icon: Layers, color: "bg-green-500" },
    { id: "hypothesis", label: "الفرضيات", icon: GitBranch, color: "bg-teal-500" },
    { id: "experiment", label: "التجارب", icon: Beaker, color: "bg-pink-500" },
    { id: "decision", label: "القرار", icon: CheckCircle2, color: "bg-emerald-500" }
  ];

  return (
    <div className="relative overflow-x-auto pb-4">
      <div className="flex items-center gap-2 min-w-max px-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`${stage.color} p-3 rounded-xl shadow-lg`}>
                <stage.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs mt-2 text-center max-w-[80px] text-muted-foreground">{stage.label}</span>
            </div>
            {index < stages.length - 1 && <ChevronRight className="w-5 h-5 text-muted-foreground mx-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function InitiativeCard({ initiative, onSelect }: { initiative: StrategicInitiative; onSelect: () => void }) {
  const priorityColors = { high: "bg-red-500/10 text-red-500", medium: "bg-yellow-500/10 text-yellow-500", low: "bg-green-500/10 text-green-500" };
  const priorityLabels = { high: "عالية", medium: "متوسطة", low: "منخفضة" };

  return (
    <Card className="hover:border-cyan-500/50 transition-all cursor-pointer group" onClick={onSelect}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors">{initiative.title}</CardTitle>
            <CardDescription className="mt-1">{initiative.description}</CardDescription>
          </div>
          <Badge className={priorityColors[initiative.priority]}>{priorityLabels[initiative.priority]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">التقدم</span>
            <span className="font-medium">{initiative.progress}%</span>
          </div>
          <Progress value={initiative.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeCard({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const statusColors = { open: "bg-blue-500/10 text-blue-500", in_progress: "bg-yellow-500/10 text-yellow-500", refined: "bg-green-500/10 text-green-500", closed: "bg-gray-500/10 text-gray-500" };
  const statusLabels = { open: "مفتوح", in_progress: "قيد التنفيذ", refined: "محسّن", closed: "مغلق" };

  return (
    <Card className="hover:border-orange-500/50 transition-all cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{challenge.title}</CardTitle>
          <Badge className={statusColors[challenge.status]}>{statusLabels[challenge.status]}</Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /><span>{challenge.ideasCount} فكرة</span></div>
        </div>
      </CardContent>
    </Card>
  );
}

function IdeaCard({ idea, onVote, onStatusChange }: { idea: Idea; onVote: (type: "up" | "down") => void; onStatusChange: (status: IdeaStatus) => void }) {
  const statusColors = { active: "bg-blue-500/10 text-blue-500", parked: "bg-yellow-500/10 text-yellow-500", killed: "bg-red-500/10 text-red-500", clustered: "bg-purple-500/10 text-purple-500", testing: "bg-green-500/10 text-green-500" };
  const statusLabels = { active: "نشط", parked: "متوقف", killed: "ملغي", clustered: "مجمّع", testing: "قيد الاختبار" };

  return (
    <Card className="hover:border-cyan-500/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{idea.title}</CardTitle>
            <CardDescription className="mt-1">{idea.description}</CardDescription>
          </div>
          <Badge className={statusColors[idea.status]}>{statusLabels[idea.status]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-green-500/10 hover:text-green-500" onClick={(e) => { e.stopPropagation(); onVote("up"); }}>
                <ThumbsUp className="w-4 h-4 ml-1" />{idea.votes.up}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-red-500/10 hover:text-red-500" onClick={(e) => { e.stopPropagation(); onVote("down"); }}>
                <ThumbsDown className="w-4 h-4 ml-1" />{idea.votes.down}
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-yellow-500" /><span>{idea.score}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {idea.status !== "parked" && idea.status !== "killed" && (
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-yellow-500/10 hover:text-yellow-500" onClick={(e) => { e.stopPropagation(); onStatusChange("parked"); }}>
                <PauseCircle className="w-4 h-4" />
              </Button>
            )}
            {idea.status === "parked" && (
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-500/10 hover:text-green-500" onClick={(e) => { e.stopPropagation(); onStatusChange("active"); }}>
                <Play className="w-4 h-4" />
              </Button>
            )}
            {idea.status !== "killed" && (
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500" onClick={(e) => { e.stopPropagation(); onStatusChange("killed"); }}>
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>{idea.author}</span><span>{idea.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ClusterCard({ cluster, ideas, onTest }: { cluster: Cluster; ideas: Idea[]; onTest: () => void }) {
  const clusterIdeas = ideas.filter(i => cluster.ideas.includes(i.id));
  const avgScore = clusterIdeas.length > 0 ? Math.round(clusterIdeas.reduce((sum, i) => sum + i.score, 0) / clusterIdeas.length) : 0;

  return (
    <Card className="hover:border-green-500/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><Layers className="w-5 h-5 text-green-500" />{cluster.name}</CardTitle>
            <CardDescription className="mt-1">{cluster.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{cluster.ideas.length} أفكار</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">متوسط التقييم</span>
            <div className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-yellow-500" /><span className="font-medium">{avgScore}</span></div>
          </div>
          <div className="flex flex-wrap gap-1">
            {clusterIdeas.map(idea => <Badge key={idea.id} variant="secondary" className="text-xs">{idea.title}</Badge>)}
          </div>
          <Button className="w-full mt-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600" onClick={onTest}>
            <Beaker className="w-4 h-4 ml-2" />بدء اختبار الفرضيات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HypothesisCard({ hypothesis, onRunExperiment }: { hypothesis: Hypothesis; onRunExperiment: () => void }) {
  const riskColors = { high: "bg-red-500/10 text-red-500", medium: "bg-yellow-500/10 text-yellow-500", low: "bg-green-500/10 text-green-500" };
  const resultColors = { pending: "bg-gray-500/10 text-gray-500", supports: "bg-green-500/10 text-green-500", rejects: "bg-red-500/10 text-red-500", refine: "bg-yellow-500/10 text-yellow-500" };
  const resultLabels = { pending: "قيد الانتظار", supports: "يدعم الفرضية", rejects: "يرفض الفرضية", refine: "يحتاج تحسين" };

  return (
    <Card className="hover:border-teal-500/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2"><GitBranch className="w-5 h-5 text-teal-500" />فرضية</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={riskColors[hypothesis.riskLevel]}>مخاطر {hypothesis.riskLevel === "high" ? "عالية" : hypothesis.riskLevel === "medium" ? "متوسطة" : "منخفضة"}</Badge>
            <Badge className={resultColors[hypothesis.result]}>{resultLabels[hypothesis.result]}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 p-3 bg-muted/50 rounded-lg border-r-4 border-teal-500">{hypothesis.statement}</p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" />الافتراضات الأكثر خطورة (RATs)</h4>
          <ul className="space-y-1">
            {hypothesis.assumptions.map((assumption, index) => <li key={index} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-yellow-500 mt-1">•</span>{assumption}</li>)}
          </ul>
        </div>
        <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" onClick={onRunExperiment}>
          <FlaskConical className="w-4 h-4 ml-2" />تشغيل تجربة
        </Button>
      </CardContent>
    </Card>
  );
}

function ExperimentCard({ experiment, onComplete }: { experiment: Experiment; onComplete: (result: "success" | "failure" | "inconclusive") => void }) {
  const statusColors = { planned: "bg-gray-500/10 text-gray-500", running: "bg-blue-500/10 text-blue-500", completed: "bg-green-500/10 text-green-500" };
  const statusLabels = { planned: "مخطط", running: "قيد التنفيذ", completed: "مكتمل" };

  return (
    <Card className="hover:border-pink-500/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Beaker className="w-5 h-5 text-pink-500" />{experiment.title}</CardTitle>
          <Badge className={statusColors[experiment.status]}>{statusLabels[experiment.status]}</Badge>
        </div>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">المقاييس</h4>
            <div className="flex flex-wrap gap-1">{experiment.metrics.map((metric, index) => <Badge key={index} variant="outline" className="text-xs">{metric}</Badge>)}</div>
          </div>
          {experiment.status === "running" && (
            <div className="flex gap-2 mt-4">
              <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={() => onComplete("success")}><CheckCircle2 className="w-4 h-4 ml-2" />نجاح</Button>
              <Button variant="destructive" className="flex-1" onClick={() => onComplete("failure")}><XCircle className="w-4 h-4 ml-2" />فشل</Button>
              <Button variant="outline" className="flex-1" onClick={() => onComplete("inconclusive")}><RotateCcw className="w-4 h-4 ml-2" />غير حاسم</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ title, value, icon: Icon, trend, color }: { title: string; value: string | number; icon: React.ElementType; trend?: { value: number; positive: boolean }; color: string }) {
  return (
    <Card className="hover:border-cyan-500/30 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && <p className={`text-xs mt-1 ${trend.positive ? "text-green-500" : "text-red-500"}`}>{trend.positive ? "+" : "-"}{trend.value}% من الشهر الماضي</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6 text-white" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InnovationPipeline() {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [initiatives] = useState(sampleInitiatives);
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [clusters] = useState(sampleClusters);
  const [hypotheses, setHypotheses] = useState(sampleHypotheses);
  const [experiments, setExperiments] = useState(sampleExperiments);
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showNewIdeaDialog, setShowNewIdeaDialog] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });

  const handleVote = (ideaId: string, type: "up" | "down") => {
    setIdeas(prev => prev.map(idea => idea.id === ideaId ? { ...idea, votes: { ...idea.votes, [type]: idea.votes[type] + 1 }, score: type === "up" ? idea.score + 2 : idea.score - 1 } : idea));
    toast.success(type === "up" ? "تم التصويت بالإيجاب" : "تم التصويت بالسلب");
  };

  const handleStatusChange = (ideaId: string, status: IdeaStatus) => {
    setIdeas(prev => prev.map(idea => idea.id === ideaId ? { ...idea, status } : idea));
    const statusMessages = { active: "تم تفعيل الفكرة", parked: "تم إيقاف الفكرة مؤقتاً", killed: "تم إلغاء الفكرة", clustered: "تم تجميع الفكرة", testing: "تم نقل الفكرة للاختبار" };
    toast.success(statusMessages[status]);
  };

  const handleAddIdea = () => {
    if (!newIdea.title || !newIdea.description || !selectedChallenge) { toast.error("يرجى ملء جميع الحقول"); return; }
    const idea: Idea = { id: `idea-${Date.now()}`, title: newIdea.title, description: newIdea.description, challengeId: selectedChallenge, status: "active", score: 50, votes: { up: 0, down: 0 }, author: "أنت", createdAt: new Date().toISOString().split("T")[0] };
    setIdeas(prev => [...prev, idea]);
    setChallenges(prev => prev.map(ch => ch.id === selectedChallenge ? { ...ch, ideasCount: ch.ideasCount + 1 } : ch));
    setNewIdea({ title: "", description: "" });
    setShowNewIdeaDialog(false);
    toast.success("تم إضافة الفكرة بنجاح");
  };

  const handleExperimentComplete = (expId: string, result: "success" | "failure" | "inconclusive") => {
    setExperiments(prev => prev.map(exp => exp.id === expId ? { ...exp, status: "completed" as const, result } : exp));
    const exp = experiments.find(e => e.id === expId);
    if (exp) {
      setHypotheses(prev => prev.map(hyp => hyp.id === exp.hypothesisId ? { ...hyp, result: result === "success" ? "supports" : result === "failure" ? "rejects" : "refine" } : hyp));
    }
    const resultMessages = { success: "التجربة ناجحة! الفرضية مدعومة", failure: "التجربة فشلت. الفرضية مرفوضة", inconclusive: "نتائج غير حاسمة. يحتاج إلى مزيد من الاختبار" };
    toast.success(resultMessages[result]);
  };

  const totalIdeas = ideas.length;
  const activeIdeas = ideas.filter(i => i.status === "active" || i.status === "testing").length;
  const parkedIdeas = ideas.filter(i => i.status === "parked").length;
  const killedIdeas = ideas.filter(i => i.status === "killed").length;
  const avgScore = Math.round(ideas.reduce((sum, i) => sum + i.score, 0) / ideas.length);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard"><Button variant="ghost" size="icon"><ArrowRight className="w-5 h-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Innovation Pipeline</h1>
                <p className="text-sm text-muted-foreground">نظام إدارة الابتكار المتكامل - أفضل من Innovation 360</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 ml-2" />تصفية</Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"><Plus className="w-4 h-4 ml-2" />مبادرة جديدة</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-500" />مسار الابتكار</CardTitle>
            <CardDescription>تدفق الأفكار من الاستراتيجية إلى التنفيذ</CardDescription>
          </CardHeader>
          <CardContent><PipelineFlow /></CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard title="إجمالي الأفكار" value={totalIdeas} icon={Lightbulb} trend={{ value: 12, positive: true }} color="bg-gradient-to-br from-cyan-500 to-blue-500" />
          <StatsCard title="أفكار نشطة" value={activeIdeas} icon={Zap} trend={{ value: 8, positive: true }} color="bg-gradient-to-br from-green-500 to-emerald-500" />
          <StatsCard title="أفكار متوقفة" value={parkedIdeas} icon={PauseCircle} color="bg-gradient-to-br from-yellow-500 to-orange-500" />
          <StatsCard title="أفكار ملغاة" value={killedIdeas} icon={XCircle} color="bg-gradient-to-br from-red-500 to-rose-500" />
          <StatsCard title="متوسط التقييم" value={avgScore} icon={Sparkles} trend={{ value: 5, positive: true }} color="bg-gradient-to-br from-purple-500 to-pink-500" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="initiatives">المبادرات</TabsTrigger>
            <TabsTrigger value="challenges">التحديات</TabsTrigger>
            <TabsTrigger value="ideas">الأفكار</TabsTrigger>
            <TabsTrigger value="clusters">التجميع</TabsTrigger>
            <TabsTrigger value="experiments">التجارب</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5 text-indigo-500" />المبادرات الاستراتيجية</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {initiatives.slice(0, 3).map(initiative => <InitiativeCard key={initiative.id} initiative={initiative} onSelect={() => { setSelectedInitiative(initiative.id); setActiveTab("challenges"); }} />)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-orange-500" />التحديات النشطة</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {challenges.filter(c => c.status !== "closed").slice(0, 3).map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => { setSelectedChallenge(challenge.id); setActiveTab("ideas"); }} />)}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" />أفضل الأفكار</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ideas.sort((a, b) => b.score - a.score).slice(0, 6).map(idea => <IdeaCard key={idea.id} idea={idea} onVote={(type) => handleVote(idea.id, type)} onStatusChange={(status) => handleStatusChange(idea.id, status)} />)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="initiatives" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initiatives.map(initiative => <InitiativeCard key={initiative.id} initiative={initiative} onSelect={() => { setSelectedInitiative(initiative.id); setActiveTab("challenges"); }} />)}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            {selectedInitiative && (
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedInitiative(null)}><ArrowRight className="w-4 h-4 ml-1" />كل المبادرات</Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{initiatives.find(i => i.id === selectedInitiative)?.title}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.filter(c => !selectedInitiative || c.initiativeId === selectedInitiative).map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => { setSelectedChallenge(challenge.id); setActiveTab("ideas"); }} />)}
            </div>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedChallenge && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedChallenge(null)}><ArrowRight className="w-4 h-4 ml-1" />كل التحديات</Button>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium">{challenges.find(c => c.id === selectedChallenge)?.title}</span>
                  </>
                )}
              </div>
              <Dialog open={showNewIdeaDialog} onOpenChange={setShowNewIdeaDialog}>
                <DialogTrigger asChild><Button className="bg-gradient-to-r from-cyan-500 to-blue-500"><Plus className="w-4 h-4 ml-2" />فكرة جديدة</Button></DialogTrigger>
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
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewIdeaDialog(false)}>إلغاء</Button>
                    <Button onClick={handleAddIdea}>إضافة الفكرة</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.filter(i => !selectedChallenge || i.challengeId === selectedChallenge).map(idea => <IdeaCard key={idea.id} idea={idea} onVote={(type) => handleVote(idea.id, type)} onStatusChange={(status) => handleStatusChange(idea.id, status)} />)}
            </div>
          </TabsContent>

          <TabsContent value="clusters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clusters.map(cluster => <ClusterCard key={cluster.id} cluster={cluster} ideas={ideas} onTest={() => { toast.success("تم بدء اختبار الفرضيات للمجموعة"); setActiveTab("experiments"); }} />)}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-teal-500" />الفرضيات</CardTitle>
                <CardDescription>اختبر افتراضاتك الأكثر خطورة (RATs)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hypotheses.map(hypothesis => <HypothesisCard key={hypothesis.id} hypothesis={hypothesis} onRunExperiment={() => { toast.success("تم إنشاء تجربة جديدة"); setActiveTab("experiments"); }} />)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiments.map(experiment => <ExperimentCard key={experiment.id} experiment={experiment} onComplete={(result) => handleExperimentComplete(experiment.id, result)} />)}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" />مصفوفة القرارات</CardTitle>
                <CardDescription>قرر مصير الأفكار بناءً على نتائج التجارب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-green-500"><CheckCircle2 className="w-5 h-5" />للتطوير</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">الأفكار التي أثبتت جدواها وجاهزة للتطوير الكامل</p>
                      <div className="mt-4 space-y-2">{ideas.filter(i => i.status === "testing" && i.score >= 80).map(idea => <Badge key={idea.id} variant="outline" className="mr-1 bg-green-500/10">{idea.title}</Badge>)}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-yellow-500"><PauseCircle className="w-5 h-5" />للإيقاف المؤقت</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">أفكار واعدة تحتاج مزيداً من الوقت أو الموارد</p>
                      <div className="mt-4 space-y-2">{ideas.filter(i => i.status === "parked").map(idea => <Badge key={idea.id} variant="outline" className="mr-1 bg-yellow-500/10">{idea.title}</Badge>)}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-500/30 bg-red-500/5">
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-red-500"><XCircle className="w-5 h-5" />للإلغاء</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">أفكار لم تثبت جدواها أو لا تتوافق مع الاستراتيجية</p>
                      <div className="mt-4 space-y-2">{ideas.filter(i => i.status === "killed").map(idea => <Badge key={idea.id} variant="outline" className="mr-1 bg-red-500/10">{idea.title}</Badge>)}</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
