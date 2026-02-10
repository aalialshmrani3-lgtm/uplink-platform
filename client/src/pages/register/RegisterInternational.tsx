import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "wouter";

export default function RegisterInternational() {
  const [formData, setFormData] = useState({
    entityName: "",
    entityType: "",
    licenseNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("International organization registration:", formData);
    alert("تم التسجيل بنجاح! سيتم مراجعة طلبك.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <div className="max-w-3xl mx-auto py-12">
        <Card className="p-8 bg-slate-900/50 border-blue-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">تسجيل منظمة دولية</h1>
              <p className="text-slate-400">انضم كمنظمة دولية داعمة للابتكار</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">اسم الجهة *</Label>
                <Input
                  required
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="مثال: وزارة الاتصالات"
                />
              </div>

              <div>
                <Label className="text-white">نوع الجهة *</Label>
                <Input
                  required
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="مثال: وزارة، هيئة، مركز"
                />
              </div>

              <div>
                <Label className="text-white">رقم الترخيص *</Label>
                <Input
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="رقم الترخيص الرسمي"
                />
              </div>

              <div>
                <Label className="text-white">الشخص المسؤول *</Label>
                <Input
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="اسم المسؤول"
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
                  placeholder="contact@entity.gov.sa"
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
            </div>

            <div>
              <Label className="text-white">الموقع الإلكتروني</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="https://www.entity.gov.sa"
              />
            </div>

            <div>
              <Label className="text-white">نبذة عن الجهة *</Label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white min-h-[120px]"
                placeholder="أهداف الجهة ومجالات الدعم..."
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
