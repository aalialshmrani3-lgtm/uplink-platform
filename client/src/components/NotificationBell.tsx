import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { useNavigate } from "wouter";

export default function NotificationBell() {
  const [, navigate] = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Get unread count
  const { data: count } = trpc.notification.getUnreadCount.useQuery(undefined, {
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Get latest notifications
  const { data: notifications } = trpc.notification.getAll.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      // Refetch notifications
    },
  });

  useEffect(() => {
    if (count?.count !== undefined) {
      setUnreadCount(count.count);
    }
  }, [count]);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setUnreadCount((prev) => prev + 1);
        // Show toast notification
        // toast.success(data.title);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNotificationClick = (notificationId: number, link?: string) => {
    markAsReadMutation.mutate({ id: notificationId });
    if (link) {
      navigate(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="font-semibold mb-2">الإشعارات</h3>
          {notifications && notifications.length > 0 ? (
            <>
              {notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.link || undefined)}
                  className={`cursor-pointer p-3 ${
                    !notif.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString("ar-SA")}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => navigate("/notifications")}
                className="text-center text-blue-600 cursor-pointer"
              >
                عرض جميع الإشعارات
              </DropdownMenuItem>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              لا توجد إشعارات
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
