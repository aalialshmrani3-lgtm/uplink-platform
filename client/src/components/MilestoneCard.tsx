import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  PlayCircle, 
  ExternalLink,
  AlertCircle 
} from "lucide-react";
import { useState } from "react";

interface Milestone {
  index: number;
  description: string;
  amount: string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  fundsReleased: boolean;
}

interface MilestoneCardProps {
  milestone: Milestone;
  contractId: number;
  blockchainContractId: number;
  userRole: 'innovator' | 'investor';
  onStart?: (milestoneIndex: number) => Promise<void>;
  onComplete?: (milestoneIndex: number) => Promise<void>;
  onApprove?: (milestoneIndex: number) => Promise<void>;
  onReject?: (milestoneIndex: number) => Promise<void>;
}

export function MilestoneCard({
  milestone,
  contractId,
  blockchainContractId,
  userRole,
  onStart,
  onComplete,
  onApprove,
  onReject,
}: MilestoneCardProps) {
  const [loading, setLoading] = useState(false);

  const getStatusIcon = () => {
    switch (milestone.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const statusMap = {
      pending: { label: 'قيد الانتظار', variant: 'secondary' as const },
      in_progress: { label: 'قيد التنفيذ', variant: 'default' as const },
      completed: { label: 'مكتمل', variant: 'default' as const },
      rejected: { label: 'مرفوض', variant: 'destructive' as const },
    };
    
    const status = statusMap[milestone.status];
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const handleAction = async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
    } catch (error: any) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const canStart = userRole === 'innovator' && milestone.status === 'pending';
  const canComplete = userRole === 'innovator' && milestone.status === 'in_progress';
  const canApprove = userRole === 'investor' && milestone.status === 'completed' && !milestone.fundsReleased;
  const canReject = userRole === 'investor' && milestone.status === 'completed' && !milestone.fundsReleased;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-lg">المرحلة {milestone.index + 1}</h3>
            {getStatusBadge()}
          </div>
        </div>
        <div className="text-left">
          <p className="text-2xl font-bold text-primary">{milestone.amount} MATIC</p>
          {milestone.fundsReleased && (
            <Badge variant="default" className="mt-1 bg-green-600">
              <CheckCircle2 className="w-3 h-3 ml-1" />
              تم الإفراج عن الأموال
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">الوصف:</p>
          <p className="text-sm">{milestone.description}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">الموعد النهائي:</p>
          <p className="text-sm font-medium">
            {new Date(milestone.deadline).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {canStart && onStart && (
          <Button
            onClick={() => handleAction(() => onStart(milestone.index))}
            disabled={loading}
            size="sm"
            className="flex-1"
          >
            <PlayCircle className="w-4 h-4 ml-2" />
            بدء المرحلة
          </Button>
        )}

        {canComplete && onComplete && (
          <Button
            onClick={() => handleAction(() => onComplete(milestone.index))}
            disabled={loading}
            size="sm"
            variant="default"
            className="flex-1"
          >
            <CheckCircle2 className="w-4 h-4 ml-2" />
            إكمال المرحلة
          </Button>
        )}

        {canApprove && onApprove && (
          <Button
            onClick={() => handleAction(() => onApprove(milestone.index))}
            disabled={loading}
            size="sm"
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-4 h-4 ml-2" />
            الموافقة وإطلاق الأموال
          </Button>
        )}

        {canReject && onReject && (
          <Button
            onClick={() => handleAction(() => onReject(milestone.index))}
            disabled={loading}
            size="sm"
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="w-4 h-4 ml-2" />
            رفض المرحلة
          </Button>
        )}
      </div>

      {/* Blockchain Link */}
      <div className="mt-4 pt-4 border-t">
        <a
          href={`https://mumbai.polygonscan.com/address/${blockchainContractId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          عرض على Polygonscan
        </a>
      </div>
    </Card>
  );
}
