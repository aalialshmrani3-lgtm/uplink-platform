import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ArrowLeft, MapPin, Users, DollarSign, Globe } from 'lucide-react';

export default function Naqla2CreateEvent() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop' as 'hackathon' | 'workshop' | 'conference',
    startDate: '',
    endDate: '',
    location: '',
    isVirtual: false,
    capacity: '',
    budget: '',
    needSponsors: false,
    needInnovators: true,
  });

  const createMutation = trpc.naqla2.events.create.useMutation({
    onSuccess: () => {
      console.log('تم إنشاء الفعالية بنجاح');
      navigate('/naqla2/events');
    },
    onError: (error) => {
      console.error('خطأ:', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('يجب تسجيل الدخول أولاً');
      return;
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      isVirtual: formData.isVirtual,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      budget: formData.budget,
      needSponsors: formData.needSponsors,
      needInnovators: formData.needInnovators,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="container max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/naqla2/events')}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة إلى الفعاليات
        </Button>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            إنشاء فعالية جديدة
          </h1>
          <p className="text-slate-400">
            قم بإنشاء فعالية واجذب المشاركين
          </p>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">معلومات الفعالية</CardTitle>
            <CardDescription className="text-slate-400">
              املأ التفاصيل الأساسية للفعالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">نوع الفعالية *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                  <SelectTrigger className="bg-slate-950/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">ورشة عمل</SelectItem>
                    <SelectItem value="conference">مؤتمر</SelectItem>
                    <SelectItem value="hackathon">هاكاثون</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">عنوان الفعالية *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: ورشة عمل الابتكار الرقمي"
                  required
                  className="bg-slate-950/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">الوصف *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف تفصيلي للفعالية..."
                  required
                  rows={6}
                  className="bg-slate-950/50 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    تاريخ البداية *
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="bg-slate-950/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    تاريخ النهاية *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    className="bg-slate-950/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-700">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <Label htmlFor="isVirtual" className="text-white">فعالية افتراضية</Label>
                    <p className="text-sm text-slate-400">سيتم عقدها عبر الإنترنت</p>
                  </div>
                </div>
                <Switch
                  id="isVirtual"
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked })}
                />
              </div>

              {!formData.isVirtual && (
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    الموقع
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="مثال: الرياض، السعودية"
                    className="bg-slate-950/50 border-slate-700 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    عدد المشاركين
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="100"
                    className="bg-slate-950/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    الميزانية (ريال)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="50000"
                    className="bg-slate-950/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/naqla2/events')}
                  className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {createMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء الفعالية'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
