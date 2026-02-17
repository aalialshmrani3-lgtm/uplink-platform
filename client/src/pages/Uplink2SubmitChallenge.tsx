// UPLINK2 - Submit Your Challenge
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Award, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Uplink2SubmitChallenge() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    requirements: '',
    prize: '',
    deadline: '',
    targetAudience: ''
  });

  const submitChallengeMutation = trpc.uplink2.challenges.submit.useMutation({
    onSuccess: () => {
      toast.success('تم إرسال التحدي بنجاح! سيتم مراجعته قريباً');
      setFormData({
        title: '',
        description: '',
        category: '',
        requirements: '',
        prize: '',
        deadline: '',
        targetAudience: ''
      });
    },
    onError: (error: any) => {
      toast.error('فشل إرسال التحدي: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    submitChallengeMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 max-w-md">
          <CardContent className="p-8">
            <p className="text-white text-center">يرجى تسجيل الدخول لإرسال تحدي</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-10 h-10 text-purple-400" />
            قدّم تحديك
          </h1>
          <p className="text-slate-400 text-lg">
            هل لديك مشكلة تحتاج حل مبتكر؟ أطلق تحديك وابحث عن المبتكرين
          </p>
        </div>

        {/* Form */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">تفاصيل التحدي</CardTitle>
            <CardDescription className="text-slate-400">
              املأ التفاصيل التالية لإطلاق تحديك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-white">عنوان التحدي *</Label>
                <Input
                  id="title"
                  placeholder="مثال: تطوير نظام ذكاء اصطناعي للتشخيص الطبي"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-white">وصف التحدي *</Label>
                <Textarea
                  id="description"
                  placeholder="اشرح المشكلة والهدف من التحدي..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-white">الفئة *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">الذكاء الاصطناعي</SelectItem>
                    <SelectItem value="health">الصحة</SelectItem>
                    <SelectItem value="education">التعليم</SelectItem>
                    <SelectItem value="environment">البيئة</SelectItem>
                    <SelectItem value="fintech">التقنية المالية</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements" className="text-white">المتطلبات *</Label>
                <Textarea
                  id="requirements"
                  placeholder="ما هي المتطلبات والمعايير للحل؟"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  required
                  rows={4}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Prize */}
              <div>
                <Label htmlFor="prize" className="text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  الجوائز *
                </Label>
                <Input
                  id="prize"
                  placeholder="مثال: 100,000 ريال + تمويل للمشروع"
                  value={formData.prize}
                  onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Deadline */}
              <div>
                <Label htmlFor="deadline" className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  الموعد النهائي *
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Target Audience */}
              <div>
                <Label htmlFor="targetAudience" className="text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  الجمهور المستهدف *
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="مثال: مطورين، طلاب، شركات ناشئة"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitChallengeMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              >
                {submitChallengeMutation.isPending ? 'جاري الإرسال...' : 'إرسال التحدي'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
