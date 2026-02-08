import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MilestoneCard } from '@/components/MilestoneCard';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  DollarSign, 
  Calendar,
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function Uplink3ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const contractId = parseInt(id || '0');
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Mock blockchain contract ID (in production, get from database)
  const blockchainContractId = 1;

  const { data: milestones, isLoading, refetch } = trpc.uplink3.milestones.getContractMilestones.useQuery(
    { contractId, blockchainContractId },
    { enabled: !!user && contractId > 0 }
  );

  const startMutation = trpc.uplink3.milestones.start.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      toast.info(`Transaction: ${data.transactionHash.slice(0, 10)}...`);
      refetch();
    },
    onError: (error) => {
      toast.error('فشل بدء المرحلة: ' + error.message);
    }
  });

  const completeMutation = trpc.uplink3.milestones.complete.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      toast.info(`Transaction: ${data.transactionHash.slice(0, 10)}...`);
      refetch();
    },
    onError: (error) => {
      toast.error('فشل إكمال المرحلة: ' + error.message);
    }
  });

  const approveMutation = trpc.uplink3.milestones.approve.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      toast.info(`Transaction: ${data.transactionHash.slice(0, 10)}...`);
      refetch();
    },
    onError: (error) => {
      toast.error('فشل الموافقة على المرحلة: ' + error.message);
    }
  });

  const rejectMutation = trpc.uplink3.milestones.reject.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      toast.info(`Transaction: ${data.transactionHash.slice(0, 10)}...`);
      refetch();
    },
    onError: (error) => {
      toast.error('فشل رفض المرحلة: ' + error.message);
    }
  });

  const handleStart = async (milestoneIndex: number) => {
    startMutation.mutate({ contractId, blockchainContractId, milestoneIndex });
  };

  const handleComplete = async (milestoneIndex: number) => {
    completeMutation.mutate({ contractId, blockchainContractId, milestoneIndex });
  };

  const handleApprove = async (milestoneIndex: number) => {
    approveMutation.mutate({ contractId, blockchainContractId, milestoneIndex });
  };

  const handleReject = async (milestoneIndex: number) => {
    rejectMutation.mutate({ contractId, blockchainContractId, milestoneIndex });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">تسجيل الدخول مطلوب</CardTitle>
            <CardDescription className="text-center">
              يرجى تسجيل الدخول لعرض تفاصيل العقد
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/uplink3/contracts')}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى العقود
          </Button>
        </div>

        {/* Contract Info Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  عقد ذكي #{contractId}
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  عقد استثماري مع نظام Escrow على Blockchain
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-green-600">
                نشط
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-slate-400">الأطراف</p>
                  <p className="font-semibold text-white">مبتكر + مستثمر</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-slate-400">المبلغ الإجمالي</p>
                  <p className="font-semibold text-white">10,000 MATIC</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-slate-400">تاريخ الإنشاء</p>
                  <p className="font-semibold text-white">
                    {new Date().toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <a
                href={`https://mumbai.polygonscan.com/address/${blockchainContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                عرض العقد على Polygonscan
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Milestones Section */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              مراحل المشروع (Milestones)
            </CardTitle>
            <CardDescription className="text-slate-400">
              إدارة المراحل والموافقة على إطلاق الأموال
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : milestones && milestones.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {milestones.map((milestone) => (
                  <MilestoneCard
                    key={milestone.index}
                    milestone={milestone}
                    contractId={contractId}
                    blockchainContractId={blockchainContractId}
                    userRole="innovator" // TODO: Determine from user type
                    onStart={handleStart}
                    onComplete={handleComplete}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد مراحل لهذا العقد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
