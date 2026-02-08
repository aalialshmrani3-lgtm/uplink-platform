// Added for Flowchart Match - User Settings Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings, Globe, Lock, Bell, Eye, EyeOff } from 'lucide-react';

export default function UserSettings() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    language: 'ar',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const updateSettingsMutation = trpc.user.updateSettings.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث الإعدادات بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث الإعدادات: ' + error.message);
    }
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handlePasswordChange = () => {
    if (settings.security.newPassword !== settings.security.confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (settings.security.newPassword.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    updateSettingsMutation.mutate({ password: settings.security });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>يجب تسجيل الدخول</CardTitle>
            <CardDescription>الرجاء تسجيل الدخول لعرض الإعدادات</CardDescription>
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
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-400" />
              <div>
                <CardTitle className="text-2xl text-white">الإعدادات</CardTitle>
                <CardDescription className="text-slate-400">إدارة تفضيلاتك وإعدادات الحساب</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="language" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="language">اللغة</TabsTrigger>
                <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
                <TabsTrigger value="privacy">الخصوصية</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
              </TabsList>

              {/* Language Settings */}
              <TabsContent value="language" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <Label htmlFor="language" className="text-white text-lg">اللغة المفضلة</Label>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-400">
                    اختر اللغة التي تريد استخدامها في المنصة
                  </p>
                </div>
                <Button onClick={handleSaveSettings} className="w-full" disabled={updateSettingsMutation.isPending}>
                  حفظ التغييرات
                </Button>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <Label className="text-white text-lg">إعدادات الإشعارات</Label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">إشعارات البريد الإلكتروني</p>
                      <p className="text-sm text-slate-400">تلقي التحديثات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">الإشعارات الفورية</p>
                      <p className="text-sm text-slate-400">تلقي إشعارات فورية في المتصفح</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">رسائل SMS</p>
                      <p className="text-sm text-slate-400">تلقي تنبيهات عبر الرسائل النصية</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, sms: checked }
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} className="w-full" disabled={updateSettingsMutation.isPending}>
                  حفظ التغييرات
                </Button>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <Label className="text-white text-lg">إعدادات الخصوصية</Label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">الملف الشخصي مرئي</p>
                      <p className="text-sm text-slate-400">السماح للآخرين بمشاهدة ملفك الشخصي</p>
                    </div>
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, profileVisible: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">إظهار البريد الإلكتروني</p>
                      <p className="text-sm text-slate-400">عرض بريدك الإلكتروني في الملف العام</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showEmail: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">إظهار رقم الهاتف</p>
                      <p className="text-sm text-slate-400">عرض رقم هاتفك في الملف العام</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showPhone}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showPhone: checked }
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} className="w-full" disabled={updateSettingsMutation.isPending}>
                  حفظ التغييرات
                </Button>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <Label className="text-white text-lg">تغيير كلمة المرور</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">كلمة المرور الحالية</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={settings.security.currentPassword}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            security: { ...settings.security, currentPassword: e.target.value }
                          })
                        }
                        className="bg-slate-800/50 border-slate-700 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={settings.security.newPassword}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, newPassword: e.target.value }
                        })
                      }
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={settings.security.confirmPassword}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, confirmPassword: e.target.value }
                        })
                      }
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>

                  <p className="text-sm text-slate-400">
                    كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل
                  </p>
                </div>
                <Button onClick={handlePasswordChange} className="w-full" disabled={updateSettingsMutation.isPending}>
                  تحديث كلمة المرور
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
