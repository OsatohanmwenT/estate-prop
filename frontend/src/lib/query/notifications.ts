/**
 * Notification React Query Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationService,
  SendReminderData,
  SendOverdueReminderData,
} from "~/services/notificationService";
import { toast } from "sonner";

export const notificationKeys = {
  all: ["notifications"] as const,
  history: () => [...notificationKeys.all, "history"] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

/**
 * Send a rent reminder
 */
export function useSendReminder() {
  return useMutation({
    mutationFn: (data: SendReminderData) =>
      notificationService.sendReminder(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Reminder sent successfully!");
      } else {
        toast.error(result.message || "Failed to send reminder");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reminder: ${error.message}`);
    },
  });
}

/**
 * Send an overdue reminder
 */
export function useSendOverdueReminder() {
  return useMutation({
    mutationFn: (data: SendOverdueReminderData) =>
      notificationService.sendOverdueReminder(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Overdue notice sent!");
      } else {
        toast.error(result.message || "Failed to send notice");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to send notice: ${error.message}`);
    },
  });
}

/**
 * Send bulk overdue reminders
 */
export function useSendBulkOverdueReminders() {
  return useMutation({
    mutationFn: () => notificationService.sendBulkOverdueReminders(),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(
          `Sent ${result.sent} reminders (${result.failed} failed)`
        );
      } else {
        toast.error(result.message || "Failed to send reminders");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reminders: ${error.message}`);
    },
  });
}

/**
 * Retry a failed notification
 */
export function useRetryNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.retry(notificationId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Notification resent!");
        queryClient.invalidateQueries({ queryKey: notificationKeys.history() });
      } else {
        toast.error(result.message || "Failed to retry");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to retry: ${error.message}`);
    },
  });
}

/**
 * Get notification history
 */
export function useNotificationHistory(limit = 50) {
  return useQuery({
    queryKey: notificationKeys.history(),
    queryFn: () => notificationService.getHistory(limit),
    staleTime: 30 * 1000,
  });
}

/**
 * Get unread notification count
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 10 * 1000, // Refresh every 10 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.history() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      toast.success("All notifications marked as read");
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark as read: ${error.message}`);
    },
  });
}

/**
 * Mark a single notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.history() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark as read: ${error.message}`);
    },
  });
}
