// Added for Flowchart Match - NAQLA3 Escrow Management Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, DollarSign } from 'lucide-react';

export default function Naqla3Escrow() {
  const { user } = useAuth();

  const { data: stats } = trpc.naqla3.escrow.getStats.useQuery(undefined, {
    enabled: !!user
  });

  const depositMutation = trpc.naqla3.escrow.deposit.useMutation({
    onSuccess: () => {
      toast.success('تم الإيداع بنجاح');
    },
    onError: (error) => {
      toast.error('فشل الإيداع: ' + error.message);
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">يجب تسجيل الدخول</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            إدارة Escrow
          </h1>
          <p className="text-slate-400 text-lg">
            حماية الأموال وضمان التنفيذ
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">إجمالي Escrow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{stats?.totalEscrow || '0'} ريال</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">المبالغ المحررة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{stats?.totalReleased || '0'} ريال</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Escrow نشط</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">{stats?.activeEscrows || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Escrow مكتمل</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-cyan-400">{stats?.completedEscrows || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">إيداع في Escrow</CardTitle>
            <CardDescription className="text-slate-400">
              قم بإيداع الأموال لبدء العقد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractId" className="text-white">رقم العقد</Label>
                  <Input
                    id="contractId"
                    type="number"
                    required
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">المبلغ (ريال)</Label>
                  <Input
                    id="amount"
                    type="number"
                    required
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-white">طريقة الدفع</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="اختر الطريقة" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                    <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                    <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={depositMutation.isPending}>
                إيداع الآن
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
