import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { 
  Rocket, User, Mail, Phone, Building, MapPin,
  Globe, Linkedin, Twitter, Save, Shield, Award,
  Lightbulb, TrendingUp
} from "lucide-react";

export default function Profile() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { data: profile, refetch } = trpc.user.getProfile.useQuery(undefined, { enabled: !!user });
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    organization: "",
    position: "",
    city: "",
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        phone: profile.phone || "",
        organization: profile.organizationName || "",
        position: "",
        city: profile.city || "",
        bio: profile.bio || "",
        website: profile.website || "",
        linkedin: profile.linkedIn || "",
        twitter: "",
      });
    }
  }, [profile]);

  const updateMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الملف الشخصي بنجاح");
      refetch();
    },
    onError: (error) => {
      toast.error("حدث خطأ", { description: error.message });
    },
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // Demo stats
  const stats = {
    projects: 5,
    ips: 2,
    score: 78,
    tier: "silver",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                UPLINK 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name || "مستخدم"}</h1>
            <p className="text-slate-400">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                {stats.tier === "platinum" ? "بلاتيني" :
                 stats.tier === "gold" ? "ذهبي" :
                 stats.tier === "silver" ? "فضي" : "عضو"}
              </span>
              <span className="text-slate-400 text-sm">
                انضم في {new Date(user.createdAt).toLocaleDateString("ar-SA")}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Lightbulb className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.projects}</div>
              <div className="text-slate-400 text-sm">مشاريع</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.ips}</div>
              <div className="text-slate-400 text-sm">ملكيات فكرية</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.score}%</div>
              <div className="text-slate-400 text-sm">متوسط التقييم</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-slate-400 text-sm">إنجازات</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">الاسم الكامل</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="الاسم الكامل"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">رقم الجوال</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 5x xxx xxxx"
                    className="bg-slate-900 border-slate-700 text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">الجهة / الشركة</Label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="اسم الجهة أو الشركة"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">المسمى الوظيفي</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="المسمى الوظيفي"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">المدينة</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="المدينة"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">نبذة شخصية</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="اكتب نبذة مختصرة عنك..."
                  className="bg-slate-900 border-slate-700 text-white min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                الروابط الاجتماعية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">الموقع الإلكتروني</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-slate-900 border-slate-700 text-white"
                  dir="ltr"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">LinkedIn</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-slate-900 border-slate-700 text-white"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Twitter / X</Label>
                  <Input
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="@username"
                    className="bg-slate-900 border-slate-700 text-white"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
