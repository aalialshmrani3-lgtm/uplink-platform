import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, BellRing, ChevronLeft, Settings, Check, CheckCheck,
  Lightbulb, Shield, MessageSquare, Calendar, FileText,
  TrendingUp, Award, Users, Trash2, Archive, Filter,
  Clock, AlertCircle, Info, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

// أنواع الإشعارات
type NotificationType = 'project' | 'message' | 'contract' | 'ip' | 'challenge' | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

// بيانات الإشعارات التجريبية
const notificationsData: Notification[] = [
  {
    id: 1,
    type: 'project',
    title: 'تحديث حالة المشروع',
    message: 'تم قبول مشروعك "نظام الذكاء الاصطناعي" للتقييم',
    time: 'منذ 5 دقائق',
    read: false,
    priority: 'high',
    link: '/projects/1'
  },
  {
    id: 2,
    type: 'message',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من أحمد الراشد (مستثمر)',
    time: 'منذ 15 دقيقة',
    read: false,
    priority: 'high',
    link: '/messages'
  },
  {
    id: 3,
    type: 'contract',
    title: 'عقد جديد',
    message: 'تم إنشاء عقد جديد بقيمة 500,000 ريال',
    time: 'منذ ساعة',
    read: false,
    priority: 'medium',
    link: '/contracts'
  },
  {
    id: 4,
    type: 'ip',
    title: 'تحديث الملكية الفكرية',
    message: 'تم اعتماد براءة الاختراع الخاصة بك',
    time: 'منذ 3 ساعات',
    read: true,
    priority: 'high',
    link: '/ip/list'
  },
  {
    id: 5,
    type: 'challenge',
    title: 'تحدي جديد',
    message: 'تحدي الابتكار الصحي مفتوح للمشاركة الآن',
    time: 'منذ 5 ساعات',
    read: true,
    priority: 'medium',
    link: '/challenges'
  },
  {
    id: 6,
    type: 'system',
    title: 'تحديث النظام',
    message: 'تم إضافة ميزات جديدة للوحة التحليلات',
    time: 'أمس',
    read: true,
    priority: 'low'
  },
  {
    id: 7,
    type: 'project',
    title: 'تقييم جديد',
    message: 'حصل مشروعك على تقييم 85% في الابتكار',
    time: 'أمس',
    read: true,
    priority: 'medium',
    link: '/projects/1'
  },
  {
    id: 8,
    type: 'message',
    title: 'رسالة جديدة',
    message: 'سارة المنصور أرسلت لك ملفاً',
    time: 'منذ يومين',
    read: true,
    priority: 'low',
    link: '/messages'
  }
];

// إعدادات الإشعارات
const notificationSettings = [
  { id: 'project_updates', label: 'تحديثات المشاريع', description: 'إشعارات عند تغيير حالة المشروع', enabled: true },
  { id: 'new_messages', label: 'الرسائل الجديدة', description: 'إشعارات عند استلام رسالة جديدة', enabled: true },
  { id: 'contract_updates', label: 'تحديثات العقود', description: 'إشعارات عند تحديث حالة العقد', enabled: true },
  { id: 'ip_updates', label: 'تحديثات الملكية الفكرية', description: 'إشعارات عند تحديث حالة IP', enabled: true },
  { id: 'challenges', label: 'التحديات والمسابقات', description: 'إشعارات عن التحديات الجديدة', enabled: false },
  { id: 'system', label: 'تحديثات النظام', description: 'إشعارات عن تحديثات المنصة', enabled: false },
];

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(notificationsData);
  const [settings, setSettings] = useState(notificationSettings);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'project': return Lightbulb;
      case 'message': return MessageSquare;
      case 'contract': return FileText;
      case 'ip': return Shield;
      case 'challenge': return Award;
      case 'system': return Info;
      default: return Bell;
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case 'project': return 'text-cyan-400 bg-cyan-500/20';
      case 'message': return 'text-purple-400 bg-purple-500/20';
      case 'contract': return 'text-amber-400 bg-amber-500/20';
      case 'ip': return 'text-emerald-400 bg-emerald-500/20';
      case 'challenge': return 'text-pink-400 bg-pink-500/20';
      case 'system': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-500/20 text-red-400 border-0">عاجل</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-400 border-0">متوسط</Badge>;
      default: return null;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                <BellRing className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold">الإشعارات</h1>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'لا توجد إشعارات جديدة'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 ml-2" />
                تعيين الكل كمقروء
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-xs px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                الكل
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('unread')}
              >
                غير المقروءة
              </Button>
            </div>

            {/* Notifications List */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {filteredNotifications.length > 0 ? (
                    <div className="divide-y divide-border/50">
                      {filteredNotifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        return (
                          <div 
                            key={notification.id}
                            className={`p-4 hover:bg-secondary/30 transition-colors ${
                              !notification.read ? 'bg-secondary/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${getIconColor(notification.type)}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                  )}
                                  {getPriorityBadge(notification.priority)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-4">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {notification.time}
                                  </span>
                                  {notification.link && (
                                    <Link href={notification.link}>
                                      <Button variant="ghost" size="sm" className="h-6 text-xs text-cyan-400">
                                        عرض التفاصيل
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-red-400"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">لا توجد إشعارات</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{setting.label}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch 
                      checked={setting.enabled}
                      onCheckedChange={() => toggleSetting(setting.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-purple-400" />
                  إشعارات الدفع (Push)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <h4 className="font-medium">تفعيل إشعارات الدفع</h4>
                    <p className="text-sm text-muted-foreground">
                      استلام إشعارات فورية على جهازك
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    تفعيل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
