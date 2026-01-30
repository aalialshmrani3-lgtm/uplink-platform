/**
 * Webhook Management Page
 * Create and manage webhooks for event notifications
 */

import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Webhook, Trash2, Play, Pause, TestTube, Eye } from 'lucide-react';
import { toast } from 'sonner';

const AVAILABLE_EVENTS = [
  { id: 'idea.created', label: 'فكرة جديدة' },
  { id: 'idea.status_changed', label: 'تغيير حالة فكرة' },
  { id: 'project.created', label: 'مشروع جديد' },
  { id: 'project.status_changed', label: 'تغيير حالة مشروع' },
  { id: 'project.gate_decision', label: 'قرار بوابة' },
  { id: 'rat.alert', label: 'تنبيه RAT' },
  { id: 'evaluation.completed', label: 'تقييم مكتمل' },
  { id: 'ai.risk_detected', label: 'خطر مكتشف بواسطة AI' },
  { id: '*', label: 'جميع الأحداث' },
];

export default function WebhookManagement() {
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [selectedWebhookId, setSelectedWebhookId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
  });

  // Fetch webhooks
  const { data: webhooks, refetch } = trpc.webhooks.list.useQuery();

  // Fetch logs for selected webhook
  const { data: logs } = trpc.webhooks.logs.useQuery(
    { webhookId: selectedWebhookId!, limit: 20 },
    { enabled: !!selectedWebhookId && logsDialogOpen }
  );

  // Create webhook mutation
  const createMutation = trpc.webhooks.create.useMutation({
    onSuccess: () => {
      setCreateDialogOpen(false);
      resetForm();
      refetch();
      toast.success('تم إنشاء Webhook بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في إنشاء Webhook: ${error.message}`);
    },
  });

  // Update webhook mutation
  const updateMutation = trpc.webhooks.update.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('تم تحديث Webhook بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في تحديث Webhook: ${error.message}`);
    },
  });

  // Delete webhook mutation
  const deleteMutation = trpc.webhooks.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('تم حذف Webhook بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في حذف Webhook: ${error.message}`);
    },
  });

  // Test webhook mutation
  const testMutation = trpc.webhooks.test.useMutation({
    onSuccess: () => {
      toast.success('تم إرسال حدث اختبار بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في اختبار Webhook: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      events: [],
      secret: '',
    });
  };

  const handleCreateWebhook = () => {
    if (!formData.name.trim() || !formData.url.trim() || formData.events.length === 0) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      url: formData.url,
      events: formData.events,
      secret: formData.secret || undefined,
    });
  };

  const handleToggleActive = (webhookId: number, currentStatus: boolean) => {
    updateMutation.mutate({
      webhookId,
      isActive: !currentStatus,
    });
  };

  const handleDeleteWebhook = (webhookId: number, name: string) => {
    if (confirm(`هل أنت متأكد من حذف Webhook "${name}"؟`)) {
      deleteMutation.mutate({ webhookId });
    }
  };

  const handleTestWebhook = (webhookId: number) => {
    testMutation.mutate({ webhookId });
  };

  const handleViewLogs = (webhookId: number) => {
    setSelectedWebhookId(webhookId);
    setLogsDialogOpen(true);
  };

  const toggleEvent = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة Webhooks</h1>
          <p className="text-muted-foreground">
            استقبل إشعارات فورية عند حدوث أحداث مهمة في المنصة
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Webhook className="w-4 h-4 mr-2" />
          إنشاء Webhook جديد
        </Button>
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks الخاصة بك</CardTitle>
          <CardDescription>
            {webhooks?.length || 0} webhook نشط
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!webhooks || webhooks.length === 0 ? (
            <div className="text-center py-12">
              <Webhook className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                لم تقم بإنشاء أي Webhooks بعد
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                إنشاء أول Webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook: any) => (
                <Card key={webhook.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{webhook.name}</h3>
                          <Badge
                            variant={webhook.isActive ? 'default' : 'secondary'}
                          >
                            {webhook.isActive ? 'نشط' : 'متوقف'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                            {webhook.url}
                          </code>
                          <div className="flex flex-wrap gap-1">
                            {(webhook.events as string[])?.map((event: string) => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {AVAILABLE_EVENTS.find(e => e.id === event)?.label || event}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              إجمالي: {webhook.totalCalls || 0}
                            </span>
                            <span className="text-green-600">
                              ناجح: {webhook.successfulCalls || 0}
                            </span>
                            <span className="text-red-600">
                              فاشل: {webhook.failedCalls || 0}
                            </span>
                            {webhook.lastTriggeredAt && (
                              <span>
                                آخر تشغيل: {new Date(webhook.lastTriggeredAt).toLocaleString('ar-SA')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewLogs(webhook.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <TestTube className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(webhook.id, webhook.isActive)}
                        >
                          {webhook.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteWebhook(webhook.id, webhook.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Webhook Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إنشاء Webhook جديد</DialogTitle>
            <DialogDescription>
              أنشئ webhook لاستقبال إشعارات عند حدوث أحداث معينة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="webhookName">الاسم *</Label>
              <Input
                id="webhookName"
                placeholder="مثال: Slack Notifications"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="webhookUrl">URL *</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-domain.com/webhooks/uplink"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="webhookSecret">Secret (اختياري)</Label>
              <Input
                id="webhookSecret"
                placeholder="سيتم توليد secret تلقائيًا إذا تركته فارغًا"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                يستخدم للتحقق من صحة الطلبات عبر HMAC signature
              </p>
            </div>

            <div>
              <Label>الأحداث *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {AVAILABLE_EVENTS.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={formData.events.includes(event.id)}
                      onCheckedChange={() => toggleEvent(event.id)}
                    />
                    <label
                      htmlFor={`event-${event.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {event.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateWebhook}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>سجل Webhook</DialogTitle>
            <DialogDescription>
              آخر 20 محاولة لتشغيل هذا Webhook
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {!logs || logs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد سجلات بعد
              </p>
            ) : (
              logs.map((log: any) => (
                <Card key={log.id} className={log.success ? 'border-green-200' : 'border-red-200'}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={log.success ? 'default' : 'destructive'}>
                            {log.success ? 'نجح' : 'فشل'}
                          </Badge>
                          <span className="text-sm font-medium">{log.event}</span>
                          {log.statusCode && (
                            <Badge variant="outline">{log.statusCode}</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            الوقت: {new Date(log.createdAt).toLocaleString('ar-SA')}
                          </div>
                          <div>
                            زمن الاستجابة: {log.responseTime}ms
                          </div>
                          {log.retryCount > 0 && (
                            <div>
                              محاولات إعادة: {log.retryCount}
                            </div>
                          )}
                          {log.errorMessage && (
                            <div className="text-red-600">
                              خطأ: {log.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
