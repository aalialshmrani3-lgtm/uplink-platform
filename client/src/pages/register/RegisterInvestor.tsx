import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function RegisterInvestor() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firmName: "",
    bio: "",
    budget: "",
    interests: "",
    investmentType: "",
    investmentRange: ""
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("تم التسجيل بنجاح!");
      setLocation("/login");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      role: "investor",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organizationName: formData.firmName || "",
      bio: formData.bio
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">تسجيل كمستثمر</h1>
          <p className="text-green-200">استثمر في الأفكار الواعدة</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">الاسم الكامل *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white/5 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">البريد الإلكتروني *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-white/5 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">رقم الجوال *</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="bg-white/5 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor="budget" className="text-white">الميزانية الاستثمارية *</Label>
              <Input id="budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required className="bg-white/5 border-white/20 text-white" placeholder="مثال: 100,000 ريال" />
            </div>
            <div>
              <Label htmlFor="interests" className="text-white">المجالات المفضلة *</Label>
              <Input id="interests" value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} required className="bg-white/5 border-white/20 text-white" placeholder="تقنية, صحة, تعليم" />
            </div>
            <div>
              <Label htmlFor="investmentType" className="text-white">نوع الاستثمار *</Label>
              <Input id="investmentType" value={formData.investmentType} onChange={(e) => setFormData({ ...formData, investmentType: e.target.value })} required className="bg-white/5 border-white/20 text-white" placeholder="ملكية, قرض, شراكة" />
            </div>
            <Button type="submit" disabled={registerMutation.isPending} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-6 text-lg">
              {registerMutation.isPending ? "جاري التسجيل..." : "إنشاء الحساب"}
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </form>
        </Card>
        <div className="text-center mt-6">
          <button onClick={() => setLocation("/register")} className="text-green-200 hover:text-white">← العودة</button>
        </div>
      </div>
    </div>
  );
}
