// Added for Flowchart Match - User Settings Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { language } = useLanguage();
  const isAr = language === 'ar';
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
      toast.success(isAr ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');
    },
    onError: (error) => {
      toast.error((isAr ? 'فشل تحديث الإعدادات: ' : 'Failed to update settings: ') + error.message);
    }
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handlePasswordChange = () => {
    if (settings.security.newPassword !== settings.security.confirmPassword) {
      toast.error(isAr ? 'كلمة المرور الجديدة غير متطابقة' : 'New password does not match');
      return;
    }
    if (settings.security.newPassword.length < 8) {
      toast.error(isAr ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }
    updateSettingsMutation.mutate({ password: settings.security });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isAr ? "يجب تسجيل الدخول" : "Login Required"}</CardTitle>
            <CardDescription>{isAr ? "الرجاء تسجيل الدخول لعرض الإعدادات" : "Please log in to view settings"}</CardDescription>
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
                <CardTitle className="text-2xl text-white">{isAr ? "الإعدادات" : "Settings"}</CardTitle>
                <CardDescription className="text-slate-400">{isAr ? "إدارة تفضيلاتك وإعدادات الحساب" : "Manage your preferences and account settings"}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="language" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="language">{isAr ? "اللغة" : "Language"}</TabsTrigger>
                <TabsTrigger value="notifications">{isAr ? "الإشعارات" : "Notifications"}</TabsTrigger>
                <TabsTrigger value="privacy">{isAr ? "الخصوصية" : "Privacy"}</TabsTrigger>
                <TabsTrigger value="security">{isAr ? "الأمان" : "Security"}</TabsTrigger>
              </TabsList>

              {/* Language Settings */}
              <TabsContent value="language" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <Label htmlFor="language" className="text-white text-lg">{isAr ? "اللغة المفضلة" : "Preferred Language"}</Label>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="ar">{isAr ? "العربية" : "Arabic"}</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-400">
                    {isAr ? "اختر اللغة التي تريد استخدامها في المنصة" : "Choose the language for the platform"}
                  </p>
                </div>
                <Button onClick={handleSaveSettings} className="w-full" disabled={updateSettingsMutation.isPending}>
                  {isAr ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <Label className="text-white text-lg">{isAr ? "إعدادات الإشعارات" : "Notification Settings"}</Label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">{isAr ? "إشعارات البريد الإلكتروني" : "Email Notifications"}</p>
                      <p className="text-sm text-slate-400">{isAr ? "تلقي التحديثات عبر البريد الإلكتروني" : "Receive updates via email"}</p>
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
                      <p className="text-white font-medium">{isAr ? "الإشعارات الفورية" : "Push Notifications"}</p>
                      <p className="text-sm text-slate-400">{isAr ? "تلقي إشعارات فورية في المتصفح" : "Receive instant browser notifications"}</p>
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
                      <p className="text-white font-medium">{isAr ? "رسائل SMS" : "SMS Messages"}</p>
                      <p className="text-sm text-slate-400">{isAr ? "تلقي تنبيهات عبر الرسائل النصية" : "Receive alerts via text messages"}</p>
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
                  {isAr ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <Label className="text-white text-lg">{isAr ? "إعدادات الخصوصية" : "Privacy Settings"}</Label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div>
                      <p className="text-white font-medium">{isAr ? "الملف الشخصي مرئي" : "Profile Visible"}</p>
                      <p className="text-sm text-slate-400">{isAr ? "السماح للآخرين بمشاهدة ملفك الشخصي" : "Allow others to view your profile"}</p>
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
                      <p className="text-white font-medium">{isAr ? "إظهار البريد الإلكتروني" : "Show Email"}</p>
                      <p className="text-sm text-slate-400">{isAr ? "عرض بريدك الإلكتروني في الملف العام" : "Display your email in public profile"}</p>
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
                      <p className="text-white font-medium">{isAr ? "إظهار رقم الهاتف" : "Show Phone Number"}</p>
                      <p className="text-sm text-slate-400">{isAr ? "عرض رقم هاتفك في الملف العام" : "Display your phone number in public profile"}</p>
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
                  {isAr ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <Label className="text-white text-lg">{isAr ? "تغيير كلمة المرور" : "Change Password"}</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">{isAr ? "كلمة المرور الحالية" : "Current Password"}</Label>
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
                    <Label htmlFor="newPassword" className="text-white">{isAr ? "كلمة المرور الجديدة" : "New Password"}</Label>
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
                    <Label htmlFor="confirmPassword" className="text-white">{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
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
                    {isAr ? "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" : "Password must be at least 8 characters"}
                  </p>
                </div>
                <Button onClick={handlePasswordChange} className="w-full" disabled={updateSettingsMutation.isPending}>
                  {isAr ? "تحديث كلمة المرور" : "Update Password"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}