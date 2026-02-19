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

export default function IdeaJourney() {
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
            <CardTitle>الفكرة غير موجودة</CardTitle>
            <CardDescription>لم يتم العثور على الفكرة المطلوبة</CardDescription>
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
            <CardTitle className="text-sm font-medium">الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {idea.status === "approved" && "مقبولة"}
              {idea.status === "pending" && "قيد المراجعة"}
              {idea.status === "revision_needed" && "بحاجة لتطوير"}
              {idea.status === "rejected" && "مرفوضة"}
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">الدرجة الإجمالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.overallScore}%</div>
              <p className="text-sm text-muted-foreground">
                {classification?.classificationPath === "innovation" && "مسار الابتكار"}
                {classification?.classificationPath === "commercial" && "مسار تجاري"}
                {classification?.classificationPath === "guidance" && "مسار التوجيه"}
              </p>
            </CardContent>
          </Card>
        )}

        {classification && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">الشريك الاستراتيجي</CardTitle>
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
          <CardDescription>تتبع مسار فكرتك عبر منصة NAQLA</CardDescription>
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
                          <div><strong>العنوان:</strong> {step.data.title}</div>
                        )}
                        {step.data.category && (
                          <div><strong>الفئة:</strong> {step.data.category}</div>
                        )}
                        {step.data.overallScore && (
                          <div><strong>الدرجة:</strong> {step.data.overallScore}%</div>
                        )}
                        {step.data.classification && (
                          <div><strong>التصنيف:</strong> {step.data.classification}</div>
                        )}
                        {step.data.suggestedPartner && (
                          <div><strong>الشريك المقترح:</strong> {step.data.suggestedPartner}</div>
                        )}
                        {step.data.choice && (
                          <div><strong>الاختيار:</strong> {step.data.choice === 'naqla2' ? 'NAQLA 2' : 'NAQLA 3'}</div>
                        )}
                        {step.data.projectId && (
                          <div><strong>رقم المشروع:</strong> {step.data.projectId}</div>
                        )}
                        {step.data.assetId && (
                          <div><strong>رقم الأصل:</strong> {step.data.assetId}</div>
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
          <CardTitle>تفاصيل الفكرة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">الوصف</h3>
            <p className="text-sm text-muted-foreground">{idea.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">المشكلة</h3>
            <p className="text-sm text-muted-foreground">{idea.problem}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">الحل</h3>
            <p className="text-sm text-muted-foreground">{idea.solution}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">السوق المستهدف</h3>
            <p className="text-sm text-muted-foreground">{idea.targetMarket}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
