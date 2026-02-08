// Added for Flowchart Match - User Profile Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Mail, Building, Globe, Phone, MapPin, Edit, Save, X } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    location: '',
    website: '',
    bio: ''
  });

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('فشل تحديث الملف الشخصي: ' + error.message);
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      company: '',
      location: '',
      website: '',
      bio: ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>يجب تسجيل الدخول</CardTitle>
            <CardDescription>الرجاء تسجيل الدخول لعرض ملفك الشخصي</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{user.name}</CardTitle>
                  <CardDescription className="text-slate-400">{user.email}</CardDescription>
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  تعديل
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2" disabled={updateProfileMutation.isPending}>
                    <Save className="w-4 h-4" />
                    حفظ
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="info">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="activity">النشاط</TabsTrigger>
                <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white flex items-center gap-2">
                      <User className="w-4 h-4" />
                      الاسم الكامل
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      الشركة / المؤسسة
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      الموقع
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      الموقع الإلكتروني
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">نبذة تعريفية</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full rounded-md bg-slate-800/50 border-slate-700 text-white p-3"
                  />
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="text-center py-12 text-slate-400">
                  <p>لا توجد أنشطة حالياً</p>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">الأفكار المقدمة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-blue-400">0</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">التحديات المشاركة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-cyan-400">0</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">العقود النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-green-400">0</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
