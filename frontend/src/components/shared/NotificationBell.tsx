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

import { NotificationHistoryItem } from "~/services/notificationService";

export function NotificationBell() {
  const { data: notifications = [], isLoading } = useNotificationHistory(20);
  const { data: unreadData } = useUnreadCount();
  const [open, setOpen] = useState(false);
  const markAllAsRead = useMarkAllAsRead();
  const markAsRead = useMarkAsRead();

  // Use server-side unread count
  const unreadCount = unreadData?.count || 0;

  const getNotificationIcon = (
    channel: string,
    status: string,
    type?: string
  ) => {
    if (status === "failed") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }

    // Check metadata type first
    if (type) {
      switch (type) {
        case "payment_received":
          return <Check className="h-4 w-4 text-green-500" />;
        case "invoice_overdue":
          return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case "invoice_created":
          return <Mail className="h-4 w-4 text-blue-500" />;
        default:
          break;
      }
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
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 border-slate-200 shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center justify-between py-3 px-4">
          <span className="font-semibold text-slate-900">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead.mutate();
              }}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? "Marking..." : "Mark all read"}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100" />

        <div className="max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto" />
              <p className="text-xs text-slate-500 mt-2">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center px-6">
              <div className="bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-5 w-5 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No notifications
              </p>
              <p className="text-xs text-slate-500 mt-1">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            notifications
              .slice(0, 10)
              .map((notification: NotificationHistoryItem) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer focus:bg-slate-50 border-b border-slate-50 last:border-0",
                    !notification.isRead ? "bg-blue-50/40" : "bg-white"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!notification.isRead) {
                      markAsRead.mutate(notification.id);
                    }
                  }}
                >
                  <div className="shrink-0 mt-1">
                    {getNotificationIcon(
                      notification.channel,
                      notification.status,
                      notification.metadata?.type as string
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p
                        className={cn(
                          "text-xs font-medium truncate",
                          !notification.isRead
                            ? "text-slate-900"
                            : "text-slate-700"
                        )}
                      >
                        {notification.subject || "Notification"}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {notification.message
                        .replace(/<[^>]*>/g, "")
                        .slice(0, 80)}
                      {notification.message.length > 80 && "..."}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="shrink-0 self-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full ring-2 ring-blue-100" />
                    </div>
                  )}
                </DropdownMenuItem>
              ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-slate-100" />
            <div className="p-2 bg-slate-50/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-white shadow-sm"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
