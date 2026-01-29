/**
 * Notification Center Component
 * Displays real-time notifications from WebSocket
 */

import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWebSocket, Notification } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export function NotificationCenter() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const { isConnected, notifications, clearNotifications } = useWebSocket({
    onNotification: (notification) => {
      // Show toast for important notifications
      if (notification.type !== 'connection' && notification.priority && ['high', 'urgent'].includes(notification.priority)) {
        toast(notification.title || 'إشعار جديد', {
          description: notification.message,
          duration: 5000,
        });
      }

      // Increment unread count
      setUnreadCount(prev => prev + 1);
    },
    autoConnect: true
  });

  // Reset unread count when opening notifications
  useEffect(() => {
    if (showNotifications) {
      setUnreadCount(0);
    }
  }, [showNotifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'idea_high_risk':
      case 'rat_alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'ai_suggestion':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'project_update':
      case 'gate_decision':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  // Filter out connection messages
  const displayNotifications = notifications.filter(n => n.type !== 'connection');

  return (
    <Popover open={showNotifications} onOpenChange={setShowNotifications}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          {!isConnected && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">الإشعارات</h3>
            {displayNotifications.length > 0 && (
              <Badge variant="secondary">{displayNotifications.length}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isConnected && (
              <Badge variant="destructive" className="text-xs">
                غير متصل
              </Badge>
            )}
            {displayNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearNotifications();
                  setUnreadCount(0);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          {displayNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">لا توجد إشعارات جديدة</p>
            </div>
          ) : (
            <div className="divide-y">
              {displayNotifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-4 hover:bg-gray-50 transition-colors ${getPriorityColor(notification.priority)} border-r-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {notification.title && (
                        <h4 className="font-semibold text-sm mb-1">
                          {notification.title}
                        </h4>
                      )}
                      <p className="text-sm text-gray-700 break-words">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.priority && (
                          <Badge variant="outline" className="text-xs">
                            {notification.priority === 'urgent' ? 'عاجل' :
                             notification.priority === 'high' ? 'مهم' :
                             notification.priority === 'medium' ? 'متوسط' : 'عادي'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {displayNotifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                clearNotifications();
                setUnreadCount(0);
                setShowNotifications(false);
              }}
            >
              مسح جميع الإشعارات
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
