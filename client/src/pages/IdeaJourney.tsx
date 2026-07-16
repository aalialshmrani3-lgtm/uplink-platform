import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Lightbulb, 
  Brain, 
  GitBranch, 
  Users, 
  ShoppingCart,
  Download,
  ArrowLeft
} from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IdeaJourney() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const params = useParams<{ id: string }>();
  const ideaId = parseInt(params.id || "0");
  const [, navigate] = useLocation();

  const { data, isLoading } = trpc.naqla1.getIdeaJourney.useQuery({ ideaId });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{isAr ? isAr ? "الفكرة غير موجودة" : "Idea not found" : "Idea not found"}</CardTitle>
            <CardDescription>{isAr ? isAr ? "لم يتم العثور على الفكرة المطلوبة" : "Requested idea not found" : "Requested idea not found"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { idea, analysis, classification } = data;
  const timeline = data.timeline || data;

  // Icons mapping
  const stageIcons: Record<string, any> = {
    naqla1: Lightbulb,
    naqla2: Users,
    naqla3: ShoppingCart,
  };

  const statusIcons: Record<string, any> = {
    completed: CheckCircle2,
    current: Clock,
    pending: Circle,
  };

  const statusColors: Record<string, string> = {
    completed: "text-green-500",
    current: "text-blue-500",
    pending: "text-gray-400",
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/naqla1/my-ideas")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى أفكاري
          </Button>
          <h1 className="text-3xl font-bold">{idea.title}</h1>
          <p className="text-muted-foreground">{idea.category}</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 ml-2" />
          تحميل PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{isAr ? "الحالة" : "Status"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {idea.status === "approved" && isAr ? "مقبولة" : "Accepted"}
              {idea.status === "pending" && isAr ? "قيد المراجعة" : "Under Review"}
              {idea.status === "revision_needed" && isAr ? "بحاجة لتطوير" : "Needs Development"}
              {idea.status === "rejected" && isAr ? "مرفوضة" : "Rejected"}
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{isAr ? isAr ? "الدرجة الإجمالية" : "Total Score" : "Total Score"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.overallScore}%</div>
              <p className="text-sm text-muted-foreground">
                {classification?.classificationPath === "innovation" && isAr ? "مسار الابتكار" : "Innovation Track"}
                {classification?.classificationPath === "commercial" && isAr ? "مسار تجاري" : "Commercial Track"}
                {classification?.classificationPath === "guidance" && isAr ? "مسار التوجيه" : "Mentorship Track"}
              </p>
            </CardContent>
          </Card>
        )}

        {classification && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{isAr ? isAr ? "الشريك الاستراتيجي" : "Strategic Partner" : "Strategic Partner"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classification.assignedPartnerId === 1 && "KAUST"}
                {classification.assignedPartnerId === 2 && "Monsha'at"}
                {classification.assignedPartnerId === 3 && "RDIA"}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            رحلة الفكرة
          </CardTitle>
          <CardDescription>{isAr ? isAr ? "تتبع مسار فكرتك عبر منصة NAQLA" : "Track your idea on NAQLA platform" : "Track your idea on NAQLA platform"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8">
            {/* Vertical line */}
            <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-border" />

            {timeline.map((step: any, index: number) => {
              const StageIcon = stageIcons[step.stage];
              const StatusIcon = statusIcons[step.status];
              const statusColor = statusColors[step.status];

              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background ${statusColor}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      {step.timestamp && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(step.timestamp).toLocaleDateString('ar-SA')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                    {/* Additional data */}
                    {step.data && (
                      <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                        {step.data.title && (
                          <div><strong>{isAr ? "العنوان:" : "Title:"}</strong> {step.data.title}</div>
                        )}
                        {step.data.category && (
                          <div><strong>{isAr ? "الفئة:" : "Category:"}</strong> {step.data.category}</div>
                        )}
                        {step.data.overallScore && (
                          <div><strong>{isAr ? isAr ? "الدرجة:" : "Score:" : "Score:"}</strong> {step.data.overallScore}%</div>
                        )}
                        {step.data.classification && (
                          <div><strong>{isAr ? isAr ? "التصنيف:" : "Classification:" : "Classification:"}</strong> {step.data.classification}</div>
                        )}
                        {step.data.suggestedPartner && (
                          <div><strong>{isAr ? isAr ? "الشريك المقترح:" : "Proposed Partner:" : "Proposed Partner:"}</strong> {step.data.suggestedPartner}</div>
                        )}
                        {step.data.choice && (
                          <div><strong>{isAr ? isAr ? "الاختيار:" : "Selection:" : "Selection:"}</strong> {step.data.choice === 'naqla2' ? 'NAQLA 2' : 'NAQLA 3'}</div>
                        )}
                        {step.data.projectId && (
                          <div><strong>{isAr ? isAr ? "رقم المشروع:" : "Project No.:" : "Project No.:"}</strong> {step.data.projectId}</div>
                        )}
                        {step.data.assetId && (
                          <div><strong>{isAr ? isAr ? "رقم الأصل:" : "Asset ID:" : "[Asset ID:]"}</strong> {step.data.assetId}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Idea Details */}
      <Card>
        <CardHeader>
          <CardTitle>{isAr ? "تفاصيل الفكرة" : "Idea Details"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">{isAr ? "الوصف" : "Description"}</h3>
            <p className="text-sm text-muted-foreground">{idea.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">{isAr ? isAr ? "المشكلة" : "Problem" : "[Problem]"}</h3>
            <p className="text-sm text-muted-foreground">{idea.problem}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">{isAr ? "الحل" : "Solution"}</h3>
            <p className="text-sm text-muted-foreground">{idea.solution}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">{isAr ? isAr ? "السوق المستهدف" : "Target Market" : "Target Market"}</h3>
            <p className="text-sm text-muted-foreground">{idea.targetMarket}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
