/**
 * API Management Page
 * Create and manage API keys for external access
 */

import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Key, Copy, Trash2, AlertCircle, CheckCircle2, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function APIManagement() {
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyData, setNewKeyData] = useState<any>(null);
  const [showNewKey, setShowNewKey] = useState(false);

  // Fetch API keys
  const { data: apiKeys, refetch } = trpc.apiKeys.list.useQuery();

  // Create API key mutation
  const createMutation = trpc.apiKeys.create.useMutation({
    onSuccess: (data) => {
      setNewKeyData(data);
      setShowNewKey(true);
      setCreateDialogOpen(false);
      setNewKeyName('');
      refetch();
      toast.success('تم إنشاء API Key بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في إنشاء API Key: ${error.message}`);
    },
  });

  // Revoke API key mutation
  const revokeMutation = trpc.apiKeys.revoke.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('تم إلغاء API Key بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في إلغاء API Key: ${error.message}`);
    },
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('الرجاء إدخال اسم للـ API Key');
      return;
    }

    createMutation.mutate({
      name: newKeyName,
      rateLimit: 1000, // Default: 1000 requests/hour
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ إلى الحافظة');
  };

  const handleRevokeKey = (keyId: number, keyName: string) => {
    if (confirm(`هل أنت متأكد من إلغاء API Key "${keyName}"؟ لن تتمكن من استخدامه بعد ذلك.`)) {
      revokeMutation.mutate({ keyId });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة API Keys</h1>
          <p className="text-muted-foreground">
            إنشاء وإدارة مفاتيح API للوصول البرمجي إلى خدمات UPLINK
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Key className="w-4 h-4 mr-2" />
          إنشاء API Key جديد
        </Button>
      </div>

      {/* New Key Display Dialog */}
      {showNewKey && newKeyData && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-semibold text-green-800">
                ⚠️ احفظ هذا المفتاح الآن! لن تتمكن من رؤيته مرة أخرى.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-white border rounded text-sm font-mono break-all">
                  {newKeyData.key}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newKeyData.key)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowNewKey(false);
                  setNewKeyData(null);
                }}
              >
                فهمت، أغلق هذه الرسالة
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <CardTitle>كيفية استخدام API</CardTitle>
          </div>
          <CardDescription>
            استخدم API Keys للوصول إلى نموذج التنبؤ بنجاح الأفكار
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. التنبؤ بنجاح فكرة</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`POST https://your-domain.com/api/public/v1/predict
Authorization: Bearer uplink_your_api_key
Content-Type: application/json

{
  "budget": 50000,
  "team_size": 5,
  "timeline_months": 12,
  "market_demand": 0.8,
  "technical_feasibility": 0.7,
  "competitive_advantage": 0.6,
  "user_engagement": 0.75
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. الاستجابة</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`{
  "success": true,
  "prediction": {
    "success_rate": 0.87,
    "confidence": 0.92,
    "model_version": "v150_20260129"
  },
  "timestamp": "2026-01-29T21:00:00.000Z"
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. فحص الاستخدام</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`GET https://your-domain.com/api/public/v1/usage
Authorization: Bearer uplink_your_api_key`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>مفاتيح API الخاصة بك</CardTitle>
          <CardDescription>
            {apiKeys?.length || 0} مفتاح API نشط
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!apiKeys || apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                لم تقم بإنشاء أي API Keys بعد
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                إنشاء أول API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key: any) => (
                <Card key={key.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{key.name}</h3>
                          <Badge
                            variant={key.status === 'active' ? 'default' : 'destructive'}
                          >
                            {key.status === 'active' ? 'نشط' : 'ملغي'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <code className="bg-muted px-2 py-1 rounded">
                            {key.keyPrefix}...
                          </code>
                          <span>الحد: {key.rateLimit} طلب/ساعة</span>
                          {key.lastUsedAt && (
                            <span>
                              آخر استخدام: {new Date(key.lastUsedAt).toLocaleDateString('ar-SA')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {key.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRevokeKey(key.id, key.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء API Key جديد</DialogTitle>
            <DialogDescription>
              أنشئ مفتاح API للوصول البرمجي إلى خدمات UPLINK
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="keyName">اسم المفتاح</Label>
              <Input
                id="keyName"
                placeholder="مثال: تطبيق الويب الرئيسي"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                اسم وصفي لتذكر الغرض من هذا المفتاح
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>الحد الافتراضي: 1000 طلب/ساعة</li>
                  <li>سيتم عرض المفتاح مرة واحدة فقط</li>
                  <li>احفظ المفتاح في مكان آمن</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setNewKeyName('');
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateKey}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
