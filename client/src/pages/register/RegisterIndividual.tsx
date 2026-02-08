import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, User } from "lucide-react";
import { Link } from "wouter";

export default function RegisterIndividual() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    interests: "",
    bio: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Individual registration:", formData);
    alert("تم التسجيل بنجاح! سيتم مراجعة طلبك.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <div className="max-w-3xl mx-auto py-12">
        <Card className="p-8 bg-slate-900/50 border-blue-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">تسجيل كفرد</h1>
              <p className="text-slate-400">انضم كمواطن مهتم بالابتكار</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">الاسم الكامل *</Label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <Label className="text-white">البريد الإلكتروني *</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <Label className="text-white">رقم الجوال *</Label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="+966 5XX XXX XXX"
                />
              </div>

              <div>
                <Label className="text-white">رقم الهوية الوطنية *</Label>
                <Input
                  required
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="1XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">المجالات المهتم بها *</Label>
              <Input
                required
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="مثال: تقنية، صحة، تعليم"
              />
            </div>

            <div>
              <Label className="text-white">نبذة عنك</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white min-h-[120px]"
                placeholder="أخبرنا عن اهتماماتك وأهدافك..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                إرسال الطلب
                <ArrowRight className="mr-2 w-4 h-4" />
              </Button>
              <Link href="/register">
                <Button type="button" variant="outline" className="border-slate-700">
                  رجوع
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
