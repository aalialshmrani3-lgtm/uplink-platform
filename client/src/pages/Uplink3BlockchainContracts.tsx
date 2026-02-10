import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockchainConnect } from '@/components/BlockchainConnect';
import { toast } from 'sonner';
import { FileText, Plus, CheckCircle, XCircle, Clock, DollarSign, Shield, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';

export default function Uplink3BlockchainContracts() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    investorAddress: '',
    totalAmount: '',
  });
  
  const [milestones, setMilestones] = useState([
    { description: '', amount: '', deadline: '' }
  ]);

  const { data: contracts, isLoading } = trpc.uplink3.contracts.getMyContracts.useQuery(undefined, {
    enabled: !!user
  });

  const createBlockchainContract = trpc.uplink3.contracts.createBlockchainContract.useMutation({
    onSuccess: (data: any) => {
      toast.success(`تم إنشاء العقد الذكي بنجاح! Contract ID: ${data.contractId}`);
      setShowCreateForm(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('فشل إنشاء العقد الذكي: ' + error.message);
    }
  });

  const depositFunds = trpc.uplink3.contracts.depositFunds.useMutation({
    onSuccess: (data: any) => {
      toast.success(`تم إيداع الأموال بنجاح! Transaction: ${data.transactionHash}`);
    },
    onError: (error) => {
      toast.error('فشل إيداع الأموال: ' + error.message);
    }
  });

  const handleWalletConnect = (address: string, browserProvider: ethers.BrowserProvider) => {
    setIsConnected(true);
    setWalletAddress(address);
    setProvider(browserProvider);
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, { description: '', amount: '', deadline: '' }]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const resetForm = () => {
    setFormData({
      projectTitle: '',
      projectDescription: '',
      investorAddress: '',
      totalAmount: '',
    });
    setMilestones([{ description: '', amount: '', deadline: '' }]);
  };

  const handleCreateContract = async () => {
    if (!isConnected || !walletAddress) {
      toast.error('يرجى ربط محفظتك أولاً');
      return;
    }

    if (!formData.projectTitle || !formData.investorAddress || !formData.totalAmount) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (milestones.some(m => !m.description || !m.amount || !m.deadline)) {
      toast.error('يرجى ملء جميع تفاصيل المراحل');
      return;
    }

    try {
      await createBlockchainContract.mutateAsync({
        innovatorAddress: walletAddress,
        investorAddress: formData.investorAddress,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        totalAmount: formData.totalAmount,
        milestones: milestones.map(m => ({
          description: m.description,
          amount: m.amount,
          deadline: new Date(m.deadline).getTime() / 1000, // Convert to Unix timestamp
        })),
      });
    } catch (error: any) {
      console.error('Create contract error:', error);
    }
  };

  const handleDepositFunds = async (contractId: number, amount: string) => {
    if (!isConnected || !walletAddress) {
      toast.error('يرجى ربط محفظتك أولاً');
      return;
    }

    try {
      await depositFunds.mutateAsync({
        contractId,
        amount,
      });
    } catch (error: any) {
      console.error('Deposit funds error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />مسودة</Badge>;
      case 'ACTIVE':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 ml-1" />نشط</Badge>;
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 ml-1" />مكتمل</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />ملغي</Badge>;
      case 'DISPUTED':
        return <Badge variant="destructive"><Shield className="w-3 h-3 ml-1" />متنازع عليه</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">يرجى تسجيل الدخول لعرض العقود الذكية</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">UPLINK3: العقود الذكية</h1>
          <p className="text-muted-foreground mt-2">
            إدارة العقود الذكية على Blockchain مع نظام الضمان (Escrow)
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="ml-2 h-4 w-4" />
          إنشاء عقد ذكي جديد
        </Button>
      </div>

      {/* Blockchain Connection */}
      <BlockchainConnect onConnect={handleWalletConnect} />

      {/* Create Contract Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>إنشاء عقد ذكي جديد</CardTitle>
            <CardDescription>
              سيتم نشر هذا العقد على Polygon Mumbai Testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">عنوان المشروع *</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  placeholder="مثال: تطبيق ذكي للتعليم"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investorAddress">عنوان محفظة المستثمر *</Label>
                <Input
                  id="investorAddress"
                  value={formData.investorAddress}
                  onChange={(e) => setFormData({ ...formData, investorAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">وصف المشروع</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                placeholder="وصف تفصيلي للمشروع..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">المبلغ الإجمالي (MATIC) *</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                placeholder="10.0"
              />
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>المراحل (Milestones)</Label>
                <Button variant="outline" size="sm" onClick={handleAddMilestone}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مرحلة
                </Button>
              </div>

              {milestones.map((milestone, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>الوصف</Label>
                      <Input
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        placeholder="مثال: تصميم الواجهة"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>المبلغ (MATIC)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={milestone.amount}
                        onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                        placeholder="2.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>الموعد النهائي</Label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={milestone.deadline}
                          onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                        />
                        {milestones.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMilestone(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateContract}
                disabled={!isConnected || createBlockchainContract.isPending}
              >
                {createBlockchainContract.isPending ? 'جاري الإنشاء...' : 'إنشاء العقد الذكي'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>العقود الذكية الخاصة بي</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">جاري التحميل...</p>
          ) : contracts && contracts.length > 0 ? (
            <div className="space-y-4">
              {contracts.map((contract: any) => (
                <Card key={contract.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{contract.projectTitle}</h3>
                      <p className="text-sm text-muted-foreground">{contract.projectDescription}</p>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">المبلغ الإجمالي</p>
                      <p className="font-semibold">{contract.totalAmount} MATIC</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Blockchain Contract ID</p>
                      <p className="font-mono">{contract.blockchainContractId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transaction Hash</p>
                      {contract.transactionHash ? (
                        <a
                          href={`https://mumbai.polygonscan.com/tx/${contract.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          عرض <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p>N/A</p>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground">تاريخ الإنشاء</p>
                      <p>{new Date(contract.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>

                  {contract.status === 'ACTIVE' && contract.role === 'investor' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDepositFunds(contract.id, contract.totalAmount)}
                        disabled={depositFunds.isPending}
                      >
                        <DollarSign className="ml-2 h-4 w-4" />
                        {depositFunds.isPending ? 'جاري الإيداع...' : 'إيداع الأموال'}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">لا توجد عقود ذكية حتى الآن</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
