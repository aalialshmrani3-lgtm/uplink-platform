/**
 * Idea Classification Page (Admin Only)
 * For classifying submitted ideas as success/failure
 */

import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function IdeaClassification() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [classifyDialogOpen, setClassifyDialogOpen] = useState(false);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [classifyingAs, setClassifyingAs] = useState<'success' | 'failure'>('success');

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  // Fetch pending ideas
  const { data: pendingIdeas, isLoading, refetch } = trpc.ideaOutcomes.getPending.useQuery();
  const { data: stats } = trpc.ideaOutcomes.getStats.useQuery();

  // Retrain mutation
  const retrainMutation = trpc.ideaOutcomes.retrainModel.useMutation({
    onSuccess: () => {
      toast.success('تم بدء إعادة تدريب النموذج بنجاح');
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ في إعادة التدريب: ${error.message}`);
    },
  });

  // Classify mutation
  const classifyMutation = trpc.ideaOutcomes.classify.useMutation({
    onSuccess: () => {
      toast.success('تم تصنيف الفكرة بنجاح');
      setClassifyDialogOpen(false);
      setSelectedIdea(null);
      setOutcomeNotes('');
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const handleClassify = (idea: any, outcome: 'success' | 'failure') => {
    setSelectedIdea(idea);
    setClassifyingAs(outcome);
    setClassifyDialogOpen(true);
  };

  const confirmClassify = () => {
    if (!selectedIdea) return;

    classifyMutation.mutate({
      id: selectedIdea.id,
      outcome: classifyingAs,
      outcomeNotes: outcomeNotes || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">تصنيف الأفكار</h1>
        <p className="text-muted-foreground">
          قم بمراجعة وتصنيف الأفكار المقدمة لتحسين دقة نموذج التنبؤ
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأفكار</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أفكار ناجحة</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أفكار فاشلة</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failure}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.failure / stats.total) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Ideas List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">الأفكار المعلقة ({pendingIdeas?.length || 0})</h2>
          <div className="flex items-center gap-3">
            {stats && stats.pending >= 100 && (
              <Badge variant="default" className="bg-green-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                جاهز لإعادة التدريب
              </Badge>
            )}
            {stats && (stats.success + stats.failure) >= 10 && (
              <Button
                onClick={() => retrainMutation.mutate()}
                disabled={retrainMutation.isPending}
                variant="outline"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {retrainMutation.isPending ? 'جاري إعادة التدريب...' : 'إعادة تدريب النموذج'}
              </Button>
            )}
          </div>
        </div>

        {!pendingIdeas || pendingIdeas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد أفكار معلقة للمراجعة</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingIdeas.map((idea: any) => (
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{idea.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {idea.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {idea.category || 'غير مصنف'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    {idea.budget && (
                      <div>
                        <span className="text-muted-foreground">الميزانية:</span>
                        <p className="font-medium">${parseFloat(idea.budget).toLocaleString()}</p>
                      </div>
                    )}
                    {idea.teamSize && (
                      <div>
                        <span className="text-muted-foreground">حجم الفريق:</span>
                        <p className="font-medium">{idea.teamSize}</p>
                      </div>
                    )}
                    {idea.timelineMonths && (
                      <div>
                        <span className="text-muted-foreground">المدة:</span>
                        <p className="font-medium">{idea.timelineMonths} شهر</p>
                      </div>
                    )}
                    {idea.predictedSuccessRate && (
                      <div>
                        <span className="text-muted-foreground">التنبؤ:</span>
                        <p className="font-medium">
                          {(parseFloat(idea.predictedSuccessRate) * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleClassify(idea, 'success')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      تصنيف كنجاح
                    </Button>
                    <Button
                      onClick={() => handleClassify(idea, 'failure')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      تصنيف كفشل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Classification Dialog */}
      <Dialog open={classifyDialogOpen} onOpenChange={setClassifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {classifyingAs === 'success' ? 'تصنيف كنجاح' : 'تصنيف كفشل'}
            </DialogTitle>
            <DialogDescription>
              قم بتأكيد التصنيف وإضافة ملاحظات اختيارية
            </DialogDescription>
          </DialogHeader>

          {selectedIdea && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1">{selectedIdea.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedIdea.description}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  ملاحظات (اختياري)
                </label>
                <Textarea
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="أضف ملاحظات حول سبب النجاح أو الفشل..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClassifyDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmClassify}
              disabled={classifyMutation.isPending}
              className={classifyingAs === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={classifyingAs === 'failure' ? 'destructive' : 'default'}
            >
              {classifyMutation.isPending ? 'جاري التصنيف...' : 'تأكيد التصنيف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
