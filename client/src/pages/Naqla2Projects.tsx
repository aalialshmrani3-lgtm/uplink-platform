import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Naqla2Projects() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: project, isLoading } = trpc.naqla2.getProjectById.useQuery(
    { projectId },
    { enabled: !!projectId }
  );

  const promoteToNaqla3Mutation = trpc.naqla2.promoteToNaqla3.useMutation({
    onSuccess: (data) => {
      toast({
        title: "تم بنجاح!",
        description: "تم نقل مشروعك إلى NAQLA 3 للبيع",
      });
      setLocation(`/naqla3/assets/${data.assetId}`);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-12">
        <Card className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">المشروع غير موجود</h2>
          <Button onClick={() => setLocation("/")}>العودة للرئيسية</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Project Header */}
        <Card className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
              <p className="text-gray-400">{project.description}</p>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 rounded-lg">
              <span className="text-blue-400 font-semibold">{project.status}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-400">الفئة</p>
              <p className="text-white font-semibold">{project.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">تاريخ الإنشاء</p>
              <p className="text-white font-semibold">
                {new Date(project.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          </div>
        </Card>

        {/* Opportunities Section */}
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">الفرص المتاحة</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">مطابقة ذكية</h3>
              </div>
              <p className="text-gray-300 text-sm">
                تم العثور على فرص مناسبة لمشروعك. يمكنك الآن التواصل مع الشركاء المحتملين.
              </p>
            </div>
          </div>
        </Card>

        {/* Promote to NAQLA 3 */}
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">الانتقال إلى NAQLA 3</h2>
          <p className="text-gray-300 mb-6">
            بعد نجاح المطابقة والاتفاق مع الشركاء، يمكنك الانتقال إلى NAQLA 3 للبيع أو
            الاستحواذ.
          </p>
          <Button
            onClick={() => promoteToNaqla3Mutation.mutate({ projectId })}
            disabled={promoteToNaqla3Mutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {promoteToNaqla3Mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري النقل...
              </>
            ) : (
              <>
                الانتقال إلى NAQLA 3
                <ArrowRight className="w-4 h-4 mr-2" />
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
