"use client";

import { useState } from "react";
import { Bell, Check, Mail, AlertTriangle, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  useNotificationHistory,
  useMarkAllAsRead,
  useMarkAsRead,
} from "~/lib/query/notifications";
import { cn } from "~/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NotificationItem {
  id: string;
  subject?: string;
  message: string;
  channel: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export function NotificationBell() {
  const { data: notifications = [], isLoading } = useNotificationHistory(20);
  const [open, setOpen] = useState(false);
  const markAllAsRead = useMarkAllAsRead();
  const markAsRead = useMarkAsRead();

  // Count unread notifications
  const unreadCount = notifications.filter(
    (n: NotificationItem) => !n.isRead
  ).length;

  const getNotificationIcon = (channel: string, status: string) => {
    if (status === "failed") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 hover:bg-slate-100"
        >
          <Bell className="h-4 w-4 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between py-3">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead.mutate();
              }}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? "Marking..." : "Mark all read"}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-[320px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto" />
              <p className="text-xs text-slate-500 mt-2">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You'll see activity here
              </p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification: NotificationItem) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer focus:bg-slate-50",
                  !notification.isRead && "bg-blue-50/50"
                )}
              >
                <div className="shrink-0 mt-0.5">
                  {getNotificationIcon(
                    notification.channel,
                    notification.status
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {notification.subject || "Notification"}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {notification.message.replace(/<[^>]*>/g, "").slice(0, 80)}
                    {notification.message.length > 80 && "..."}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-slate-600"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
