// Added for Flowchart Match - NAQLA3 Smart Contracts Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FileText, Plus, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

export default function Naqla3Contracts() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [milestones, setMilestones] = useState([{ title: '', amount: '', dueDate: '' }]);

  const { data: contracts, isLoading } = trpc.naqla3.contracts.getMyContracts.useQuery(undefined, {
    enabled: !!user
  });

  const createMutation = trpc.naqla3.contracts.create.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء العقد بنجاح');
      setShowCreateForm(false);
      setMilestones([{ title: '', amount: '', dueDate: '' }]);
    },
    onError: (error) => {
      toast.error('فشل إنشاء العقد: ' + error.message);
    }
  });

  const signMutation = trpc.naqla3.contracts.sign.useMutation({
    onSuccess: () => {
      toast.success('تم توقيع العقد بنجاح');
    },
    onError: (error) => {
      toast.error('فشل توقيع العقد: ' + error.message);
    }
  });

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: '', amount: '', dueDate: '' }]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleCreateContract = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      partyB: parseInt(formData.get('partyB') as string),
      totalAmount: formData.get('totalAmount') as string,
      currency: 'SAR',
      milestones: milestones.filter(m => m.title && m.amount).map(m => ({
        ...m,
        status: 'pending' as const,
      })),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      terms: formData.get('terms') as string,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'draft': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5" />;
      case 'draft': return <Clock className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">يجب تسجيل الدخول</CardTitle>
            <CardDescription className="text-slate-400">
              الرجاء تسجيل الدخول للوصول إلى العقود الذكية
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FileText className="w-10 h-10 text-purple-400" />
                العقود الذكية
              </h1>
              <p className="text-slate-400 text-lg">
                إدارة العقود والمعاملات بشكل آمن وشفاف
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              إنشاء عقد جديد
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">ما هي العقود الذكية؟</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>عقود رقمية آمنة تُنفذ تلقائياً عند استيفاء الشروط</p>
              <p>• شفافية كاملة</p>
              <p>• أمان عالي</p>
              <p>• تنفيذ تلقائي</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">المراحل (Milestones)</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>قسّم العقد إلى مراحل قابلة للتتبع</p>
              <p>• دفعات مجزأة</p>
              <p>• تتبع التقدم</p>
              <p>• حماية الطرفين</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">نظام Escrow</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>حماية الأموال حتى إتمام العمل</p>
              <p>• أمان الدفع</p>
              <p>• ضمان التنفيذ</p>
              <p>• تحرير تلقائي</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">إنشاء عقد ذكي جديد</CardTitle>
              <CardDescription className="text-slate-400">
                املأ التفاصيل لإنشاء عقد آمن
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateContract} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">عنوان العقد *</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partyB" className="text-white">الطرف الثاني (User ID) *</Label>
                    <Input
                      id="partyB"
                      name="partyB"
                      type="number"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">الوصف *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount" className="text-white">المبلغ الإجمالي (ريال) *</Label>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-white">تاريخ البداية</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-white">تاريخ النهاية</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-lg">المراحل (Milestones)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddMilestone}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة مرحلة
                    </Button>
                  </div>

                  {milestones.map((milestone, index) => (
                    <Card key={index} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">عنوان المرحلة</Label>
                            <Input
                              value={milestone.title}
                              onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                              className="bg-slate-800/50 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm">المبلغ (ريال)</Label>
                            <Input
                              type="number"
                              value={milestone.amount}
                              onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                              className="bg-slate-800/50 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm">تاريخ الاستحقاق</Label>
                            <div className="flex gap-2">
                              <Input
                                type="date"
                                value={milestone.dueDate}
                                onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                                className="bg-slate-800/50 border-slate-700 text-white"
                              />
                              {milestones.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveMilestone(index)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms" className="text-white">الشروط والأحكام</Label>
                  <Textarea
                    id="terms"
                    name="terms"
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    إنشاء العقد
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contracts List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">عقودي</h2>
          
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">جاري التحميل...</div>
          ) : contracts && contracts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {contracts.map((contract: any) => (
                <Card key={contract.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-purple-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{contract.title}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {contract.description}
                        </CardDescription>
                      </div>
                      <div className={`flex items-center gap-2 ${getStatusColor(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        <span className="text-sm font-medium">{contract.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">المبلغ الإجمالي</p>
                        <p className="text-white font-bold flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {contract.totalAmount} {contract.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">تاريخ البداية</p>
                        <p className="text-white">{contract.startDate || 'غير محدد'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">تاريخ النهاية</p>
                        <p className="text-white">{contract.endDate || 'غير محدد'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">المراحل</p>
                        <p className="text-white">
                          {contract.milestones ? JSON.parse(contract.milestones).length : 0} مرحلة
                        </p>
                      </div>
                    </div>

                    {contract.status === 'draft' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => {
                            signMutation.mutate({
                              contractId: contract.id,
                              signature: user.name || 'Signature',
                            });
                          }}
                          disabled={signMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          توقيع العقد
                        </Button>
                        <Button variant="outline">
                          عرض التفاصيل
                        </Button>
                      </div>
                    )}

                    {contract.status === 'active' && (
                      <div className="flex gap-2 pt-2">
                        <Button>
                          إدارة المراحل
                        </Button>
                        <Button variant="outline">
                          عرض Escrow
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 mb-4">لا توجد عقود حالياً</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  إنشاء عقد جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
