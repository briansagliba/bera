import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "emergency" | "system" | "message";
  read: boolean;
  created_at: string;
  emergency_id?: string;
  user_id?: string;
}

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // For now, we'll use mock data since the notifications table might not exist yet
        // In a real implementation, this would query from the notifications table
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "New Emergency",
            message: "Medical emergency reported at 123 Main St",
            type: "emergency",
            read: false,
            created_at: new Date().toISOString(),
            emergency_id: "e1",
          },
          {
            id: "2",
            title: "Status Update",
            message: "Fire emergency status changed to responding",
            type: "emergency",
            read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
            emergency_id: "e2",
          },
          {
            id: "3",
            title: "System Notification",
            message: "New responder added to the system",
            type: "system",
            read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          },
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Unknown error fetching notifications"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // In a real implementation, we would set up a subscription to the notifications table
    // const subscription = supabase
    //   .channel('notifications-changes')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    // Update local state immediately for better UX
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // In a real implementation, this would update the database
    // try {
    //   await supabase
    //     .from('notifications')
    //     .update({ read: true })
    //     .eq('id', notificationId);
    // } catch (err) {
    //   console.error('Error marking notification as read:', err);
    //   // Revert the local state change if the API call fails
    //   setNotifications(prev =>
    //     prev.map(notification =>
    //       notification.id === notificationId
    //         ? { ...notification, read: false }
    //         : notification
    //     )
    //   );
    //   setUnreadCount(prev => prev + 1);
    // }
  };

  const markAllAsRead = async () => {
    // Update local state immediately
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);

    // In a real implementation, this would update the database
    // try {
    //   await supabase
    //     .from('notifications')
    //     .update({ read: true })
    //     .eq('user_id', userId);
    // } catch (err) {
    //   console.error('Error marking all notifications as read:', err);
    //   // Revert the local state change if the API call fails
    //   fetchNotifications();
    // }
  };

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
