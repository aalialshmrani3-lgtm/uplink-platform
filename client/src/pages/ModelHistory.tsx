/**
 * Model History Page
 * View and manage different versions of trained ML models
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { History, CheckCircle, Trash2, GitCompare, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ModelHistory() {
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Fetch model versions
  const { data: versions, refetch } = trpc.modelVersioning.list.useQuery();

  // Fetch comparison data
  const { data: comparison } = trpc.modelVersioning.compare.useQuery(
    {
      versionId1: selectedVersions[0],
      versionId2: selectedVersions[1],
    },
    {
      enabled: selectedVersions.length === 2 && compareDialogOpen,
    }
  );

  // Activate version mutation
  const activateMutation = trpc.modelVersioning.activate.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('تم تفعيل النموذج بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في تفعيل النموذج: ${error.message}`);
    },
  });

  // Delete version mutation
  const deleteMutation = trpc.modelVersioning.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('تم حذف النموذج بنجاح');
    },
    onError: (error) => {
      toast.error(`خطأ في حذف النموذج: ${error.message}`);
    },
  });

  const handleActivateVersion = (versionId: string) => {
    if (confirm('هل أنت متأكد من تفعيل هذا النموذج؟ سيتم إعادة تشغيل خدمة التنبؤ.')) {
      activateMutation.mutate({ versionId });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا النموذج؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteMutation.mutate({ versionId });
    }
  };

  const handleCompare = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const openCompareDialog = () => {
    if (selectedVersions.length === 2) {
      setCompareDialogOpen(true);
    } else {
      toast.error('الرجاء اختيار نموذجين للمقارنة');
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">سجل النماذج المدربة</h1>
          <p className="text-muted-foreground">
            عرض ومقارنة إصدارات النماذج المختلفة
          </p>
        </div>
        {selectedVersions.length === 2 && (
          <Button onClick={openCompareDialog}>
            <GitCompare className="w-4 h-4 mr-2" />
            مقارنة النماذج المحددة
          </Button>
        )}
      </div>

      {/* Models List */}
      <Card>
        <CardHeader>
          <CardTitle>الإصدارات المتاحة</CardTitle>
          <CardDescription>
            {versions?.length || 0} إصدار محفوظ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!versions || versions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                لا توجد إصدارات محفوظة بعد
              </p>
              <p className="text-sm text-muted-foreground">
                سيتم حفظ النماذج تلقائيًا عند إعادة التدريب
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version: any) => (
                <Card
                  key={version.version_id}
                  className={`border ${
                    version.is_active ? 'border-green-500 bg-green-50/50' : ''
                  } ${
                    selectedVersions.includes(version.version_id)
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {version.model_type} - {version.version_id}
                          </h3>
                          {version.is_active && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              النموذج النشط
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-muted-foreground">الدقة</div>
                            <div className="font-semibold text-lg">
                              {formatPercentage(version.accuracy)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Precision</div>
                            <div className="font-semibold text-lg">
                              {formatPercentage(version.precision)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Recall</div>
                            <div className="font-semibold text-lg">
                              {formatPercentage(version.recall)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">F1 Score</div>
                            <div className="font-semibold text-lg">
                              {formatPercentage(version.f1_score)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            عينات التدريب: {version.training_samples.toLocaleString()}
                          </span>
                          <span>
                            التاريخ: {formatDate(version.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={selectedVersions.includes(version.version_id) ? 'default' : 'outline'}
                          onClick={() => handleCompare(version.version_id)}
                        >
                          <GitCompare className="w-4 h-4" />
                        </Button>
                        {!version.is_active && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleActivateVersion(version.version_id)}
                              disabled={activateMutation.isPending}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteVersion(version.version_id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
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

      {/* Comparison Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>مقارنة النماذج</DialogTitle>
            <DialogDescription>
              مقارنة تفصيلية بين نموذجين
            </DialogDescription>
          </DialogHeader>
          
          {comparison && (
            <div className="space-y-6">
              {/* Version Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">النموذج 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {comparison.version_1.id}</div>
                      <div><strong>النوع:</strong> {comparison.version_1.model_type}</div>
                      <div><strong>التاريخ:</strong> {formatDate(comparison.version_1.timestamp)}</div>
                      <div><strong>العينات:</strong> {comparison.version_1.training_samples.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">النموذج 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {comparison.version_2.id}</div>
                      <div><strong>النوع:</strong> {comparison.version_2.model_type}</div>
                      <div><strong>التاريخ:</strong> {formatDate(comparison.version_2.timestamp)}</div>
                      <div><strong>العينات:</strong> {comparison.version_2.training_samples.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Metrics Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مقارنة المقاييس</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['accuracy', 'precision', 'recall', 'f1_score'].map((metric) => {
                      const v1Value = comparison.version_1[metric];
                      const v2Value = comparison.version_2[metric];
                      const diff = comparison.differences[`${metric}_diff`];
                      const isPositive = diff > 0;
                      
                      return (
                        <div key={metric} className="grid grid-cols-3 gap-4 items-center">
                          <div className="font-medium capitalize">{metric}</div>
                          <div className="text-center">
                            {formatPercentage(v1Value)} → {formatPercentage(v2Value)}
                          </div>
                          <div className={`text-right font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{formatPercentage(diff)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => {
              setCompareDialogOpen(false);
              setSelectedVersions([]);
            }}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
