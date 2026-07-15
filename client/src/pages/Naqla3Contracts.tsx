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
import { useLanguage } from "@/contexts/LanguageContext"; // Rule 1: Added import

export default function Naqla3Contracts() {
  const { language } = useLanguage(); // Rule 2: Added language context
  const isAr = language === 'ar'; // Rule 2: Added isAr flag

  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [milestones, setMilestones] = useState([{ title: '', amount: '', dueDate: '' }]);

  const { data: contracts, isLoading } = trpc.naqla3.contracts.getMyContracts.useQuery(undefined, {
    enabled: !!user
  });

  const createMutation = trpc.naqla3.contracts.create.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم إنشاء العقد بنجاح' : 'Contract created successfully'); // Rule 3: Translated
      setShowCreateForm(false);
      setMilestones([{ title: '', amount: '', dueDate: '' }]);
    },
    onError: (error) => {
      toast.error((isAr ? 'فشل إنشاء العقد: ' : 'Failed to create contract: ') + error.message); // Rule 3: Translated
    }
  });

  const signMutation = trpc.naqla3.contracts.sign.useMutation({
    onSuccess: () => {
      toast.success(isAr ? 'تم توقيع العقد بنجاح' : 'Contract signed successfully'); // Rule 3: Translated
    },
    onError: (error) => {
      toast.error((isAr ? 'فشل توقيع العقد: ' : 'Failed to sign contract: ') + error.message); // Rule 3: Translated
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

  // Rule 5: Helper for status translation
  const translateStatus = (status: string) => {
    if (isAr) {
      switch (status) {
        case 'active': return 'نشط';
        case 'draft': return 'مسودة';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغى';
        case 'pending': return 'معلق';
        default: return status;
      }
    } else {
      switch (status) {
        case 'active': return 'Active';
        case 'draft': return 'Draft';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        case 'pending': return 'Pending';
        default: return status;
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">{isAr ? 'يجب تسجيل الدخول' : 'Login Required'}</CardTitle> {/* Rule 3: Translated */}
            <CardDescription className="text-slate-400">
              {isAr ? 'الرجاء تسجيل الدخول للوصول إلى العقود الذكية' : 'Please log in to access smart contracts'} {/* Rule 3: Translated */}
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
                {isAr ? 'العقود الذكية' : 'Smart Contracts'} {/* Rule 3: Translated */}
              </h1>
              <p className="text-slate-400 text-lg">
                {isAr ? 'إدارة العقود والمعاملات بشكل آمن وشفاف' : 'Manage contracts and transactions securely and transparently'} {/* Rule 3: Translated */}
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAr ? 'إنشاء عقد جديد' : 'Create New Contract'} {/* Rule 3: Translated */}
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">{isAr ? 'ما هي العقود الذكية؟' : 'What are Smart Contracts?'}</CardTitle> {/* Rule 3: Translated */}
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>{isAr ? 'عقود رقمية آمنة تُنفذ تلقائياً عند استيفاء الشروط' : 'Secure digital contracts that execute automatically upon meeting conditions'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• شفافية كاملة' : '• Full transparency'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• أمان عالي' : '• High security'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• تنفيذ تلقائي' : '• Automatic execution'}</p> {/* Rule 3: Translated */}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">{isAr ? 'المراحل (Milestones)' : 'Milestones'}</CardTitle> {/* Rule 3: Translated */}
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>{isAr ? 'قسّم العقد إلى مراحل قابلة للتتبع' : 'Divide the contract into trackable stages'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• دفعات مجزأة' : '• Partial payments'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• تتبع التقدم' : '• Progress tracking'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• حماية الطرفين' : '• Party protection'}</p> {/* Rule 3: Translated */}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">{isAr ? 'نظام Escrow' : 'Escrow System'}</CardTitle> {/* Rule 3: Translated */}
            </CardHeader>
            <CardContent className="text-slate-400 text-sm space-y-2">
              <p>{isAr ? 'حماية الأموال حتى إتمام العمل' : 'Protect funds until work completion'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• أمان الدفع' : '• Payment security'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• ضمان التنفيذ' : '• Execution guarantee'}</p> {/* Rule 3: Translated */}
              <p>{isAr ? '• تحرير تلقائي' : '• Automatic release'}</p> {/* Rule 3: Translated */}
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">{isAr ? 'إنشاء عقد ذكي جديد' : 'Create New Smart Contract'}</CardTitle> {/* Rule 3: Translated */}
              <CardDescription className="text-slate-400">
                {isAr ? 'املأ التفاصيل لإنشاء عقد آمن' : 'Fill in the details to create a secure contract'} {/* Rule 3: Translated */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateContract} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">{isAr ? 'عنوان العقد *' : 'Contract Title *'}</Label> {/* Rule 3: Translated */}
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partyB" className="text-white">{isAr ? 'الطرف الثاني (User ID) *' : 'Second Party (User ID) *'}</Label> {/* Rule 3: Translated */}
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
                  <Label htmlFor="description" className="text-white">{isAr ? 'الوصف *' : 'Description *'}</Label> {/* Rule 3: Translated */}
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
                    <Label htmlFor="totalAmount" className="text-white">{isAr ? 'المبلغ الإجمالي (ريال) *' : 'Total Amount (SAR) *'}</Label> {/* Rule 3: Translated */}
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-white">{isAr ? 'تاريخ البداية' : 'Start Date'}</Label> {/* Rule 3: Translated */}
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-white">{isAr ? 'تاريخ النهاية' : 'End Date'}</Label> {/* Rule 3: Translated */}
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
                    <Label className="text-white text-lg">{isAr ? 'المراحل (Milestones)' : 'Milestones'}</Label> {/* Rule 3: Translated */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddMilestone}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isAr ? 'إضافة مرحلة' : 'Add Milestone'} {/* Rule 3: Translated */}
                    </Button>
                  </div>

                  {milestones.map((milestone, index) => (
                    <Card key={index} className="bg-slate-800/30 border-slate-700">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">{isAr ? 'عنوان المرحلة' : 'Milestone Title'}</Label> {/* Rule 3: Translated */}
                            <Input
                              value={milestone.title}
                              onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                              className="bg-slate-800/50 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm">{isAr ? 'المبلغ (ريال)' : 'Amount (SAR)'}</Label> {/* Rule 3: Translated */}
                            <Input
                              type="number"
                              value={milestone.amount}
                              onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                              className="bg-slate-800/50 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm">{isAr ? 'تاريخ الاستحقاق' : 'Due Date'}</Label> {/* Rule 3: Translated */}
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
                  <Label htmlFor="terms" className="text-white">{isAr ? 'الشروط والأحكام' : 'Terms and Conditions'}</Label> {/* Rule 3: Translated */}
                  <Textarea
                    id="terms"
                    name="terms"
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {isAr ? 'إنشاء العقد' : 'Create Contract'} {/* Rule 3: Translated */}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'} {/* Rule 3: Translated */}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contracts List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">{isAr ? 'عقودي' : 'My Contracts'}</h2> {/* Rule 3: Translated */}
          
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div> // Rule 3: Translated
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
                        <span className="text-sm font-medium">{translateStatus(contract.status)}</span> {/* Rule 5: Used helper */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">{isAr ? 'المبلغ الإجمالي' : 'Total Amount'}</p> {/* Rule 3: Translated */}
                        <p className="text-white font-bold flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {contract.totalAmount} {contract.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">{isAr ? 'تاريخ البداية' : 'Start Date'}</p> {/* Rule 3: Translated */}
                        <p className="text-white">{contract.startDate || (isAr ? 'غير محدد' : 'Not specified')}</p> {/* Rule 3: Translated */}
                      </div>
                      <div>
                        <p className="text-slate-500">{isAr ? 'تاريخ النهاية' : 'End Date'}</p> {/* Rule 3: Translated */}
                        <p className="text-white">{contract.endDate || (isAr ? 'غير محدد' : 'Not specified')}</p> {/* Rule 3: Translated */}
                      </div>
                      <div>
                        <p className="text-slate-500">{isAr ? 'المراحل' : 'Milestones'}</p> {/* Rule 3: Translated */}
                        <p className="text-white">
                          {contract.milestones ? `${JSON.parse(contract.milestones).length} ${isAr ? 'مرحلة' : 'milestone(s)'}` : `0 ${isAr ? 'مرحلة' : 'milestone(s)'}`} {/* Rule 3: Translated */}
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
                          {isAr ? 'توقيع العقد' : 'Sign Contract'} {/* Rule 3: Translated */}
                        </Button>
                        <Button variant="outline">
                          {isAr ? 'عرض التفاصيل' : 'View Details'} {/* Rule 3: Translated */}
                        </Button>
                      </div>
                    )}

                    {contract.status === 'active' && (
                      <div className="flex gap-2 pt-2">
                        <Button>
                          {isAr ? 'إدارة المراحل' : 'Manage Milestones'} {/* Rule 3: Translated */}
                        </Button>
                        <Button variant="outline">
                          {isAr ? 'عرض Escrow' : 'View Escrow'} {/* Rule 3: Translated */}
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
                <p className="text-slate-400 mb-4">{isAr ? 'لا توجد عقود حالياً' : 'No contracts currently'}</p> {/* Rule 3: Translated */}
                <Button onClick={() => setShowCreateForm(true)}>
                  {isAr ? 'إنشاء عقد جديد' : 'Create New Contract'} {/* Rule 3: Translated */}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}