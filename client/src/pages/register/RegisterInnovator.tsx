import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Lightbulb, ArrowRight } from "lucide-react";

export default function RegisterInnovator() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    skills: "",
    interests: "",
    portfolio: "",
    experience: ""
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول");
      setLocation("/login");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء التسجيل");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    registerMutation.mutate({
      userType: "innovator",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      profile: {
        bio: formData.bio,
        skills: formData.skills.split(",").map(s => s.trim()),
        interests: formData.interests.split(",").map(i => i.trim()),
        portfolio: formData.portfolio,
        experience: formData.experience
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            تسجيل كمبتكر
          </h1>
          <p className="text-blue-200">
            انضم إلى منظومة UPLINK وابدأ رحلتك في تحويل أفكارك لواقع
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-white">الاسم الكامل *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-white">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="example@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-white">رقم الجوال *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="+966xxxxxxxxx"
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="text-white">نبذة عنك *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
                rows={4}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك..."
              />
            </div>

            {/* Skills */}
            <div>
              <Label htmlFor="skills" className="text-white">المهارات *</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="مثال: برمجة, تصميم, إدارة مشاريع (افصل بفاصلة)"
              />
              <p className="text-xs text-blue-200 mt-1">افصل المهارات بفاصلة</p>
            </div>

            {/* Interests */}
            <div>
              <Label htmlFor="interests" className="text-white">المجالات المهتم بها *</Label>
              <Input
                id="interests"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="مثال: تقنية, صحة, تعليم (افصل بفاصلة)"
              />
              <p className="text-xs text-blue-200 mt-1">افصل المجالات بفاصلة</p>
            </div>

            {/* Portfolio */}
            <div>
              <Label htmlFor="portfolio" className="text-white">رابط معرض الأعمال (اختياري)</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="https://portfolio.example.com"
              />
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experience" className="text-white">الخبرة السابقة (اختياري)</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                rows={3}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                placeholder="اذكر خبراتك السابقة في مجال الابتكار..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-6 text-lg"
            >
              {registerMutation.isPending ? "جاري التسجيل..." : "إنشاء الحساب"}
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </form>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => setLocation("/register")}
            className="text-blue-200 hover:text-white transition-colors"
          >
            ← العودة لاختيار نوع الحساب
          </button>
        </div>
      </div>
    </div>
  );
}
