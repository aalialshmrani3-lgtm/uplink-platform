import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminMonitoring() {
  const { data: adminLogs, isLoading: logsLoading } = trpc.admin.getAdminLogs.useQuery({ limit: 50 });

  if (logsLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">مراقبة النظام</h1>
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <Skeleton className="h-96 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600 bg-green-50';
      case 'update':
        return 'text-blue-600 bg-blue-50';
      case 'delete':
        return 'text-red-600 bg-red-50';
      case 'view':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <CheckCircle className="h-4 w-4" />;
      case 'delete':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      create: 'إنشاء',
      update: 'تحديث',
      delete: 'حذف',
      activate: 'تفعيل',
      deactivate: 'تعطيل',
      export: 'تصدير',
      view: 'عرض'
    };
    return actionMap[action] || action;
  };

  const getTargetTypeText = (targetType: string) => {
    const typeMap: Record<string, string> = {
      user: 'مستخدم',
      project: 'مشروع',
      ip: 'ملكية فكرية',
      organization: 'منظمة',
      analysis: 'تحليل',
      system: 'نظام'
    };
    return typeMap[targetType] || targetType;
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">مراقبة النظام</h1>
        <p className="text-muted-foreground mt-2">
          سجل عمليات المشرفين وأنشطة النظام
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي العمليات</p>
              <p className="text-2xl font-bold">{adminLogs?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">عمليات ناجحة</p>
              <p className="text-2xl font-bold">{adminLogs?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">آخر نشاط</p>
              <p className="text-sm font-medium">
                {adminLogs && adminLogs.length > 0
                  ? new Date(adminLogs[0].createdAt).toLocaleString('ar-SA')
                  : 'لا يوجد'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">سجل عمليات المشرفين</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                <TableHead>المشرف</TableHead>
                <TableHead>العملية</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الهدف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminLogs && adminLogs.length > 0 ? (
                adminLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{log.adminName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {getActionIcon(log.action)}
                        {getActionText(log.action)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getTargetTypeText(log.targetType)}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.targetName || `#${log.targetId}`}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد عمليات مسجلة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
