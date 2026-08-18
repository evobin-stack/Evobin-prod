import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Real-time update types
export type UpdateType =
  | "new_recycling"
  | "points_earned"
  | "achievement_unlocked"
  | "new_event"
  | "new_comment"
  | "new_follower"
  | "admin_announcement"
  | "center_status"
  | "leaderboard_change"
  | "reward_redeemed";

export interface RealtimeUpdate {
  id: string;
  type: UpdateType;
  userId: string;
  userName: string;
  userRole: "user" | "admin" | "worker" | "organization";
  message: string;
  data?: any;
  timestamp: Date;
  isRead: boolean;
}

interface RealtimeContextType {
  updates: RealtimeUpdate[];
  unreadCount: number;
  addUpdate: (
    update: Omit<RealtimeUpdate, "id" | "timestamp" | "isRead">,
  ) => void;
  markAsRead: (updateId: string) => void;
  markAllAsRead: () => void;
  clearUpdates: () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<
  RealtimeContextType | undefined
>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error(
      "useRealtime must be used within a RealtimeProvider",
    );
  }
  return context;
};

export const RealtimeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Calculate unread count
  const unreadCount = updates.filter(
    (update) => !update.isRead,
  ).length;

  // Add a new update
  const addUpdate = useCallback(
    (
      update: Omit<
        RealtimeUpdate,
        "id" | "timestamp" | "isRead"
      >,
    ) => {
      const newUpdate: RealtimeUpdate = {
        ...update,
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        isRead: false,
      };
      setUpdates((prev) => [newUpdate, ...prev]);
    },
    [],
  );

  // Mark single update as read
  const markAsRead = useCallback((updateId: string) => {
    setUpdates((prev) =>
      prev.map((update) =>
        update.id === updateId
          ? { ...update, isRead: true }
          : update,
      ),
    );
  }, []);

  // Mark all updates as read
  const markAllAsRead = useCallback(() => {
    setUpdates((prev) =>
      prev.map((update) => ({ ...update, isRead: true })),
    );
  }, []);

  // Clear all updates
  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  // Simulate WebSocket connection and real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsConnected(false);
      return;
    }

    // Simulate connection
    setIsConnected(true);

    // Simulate receiving real-time updates from other users
    const simulateRealtimeUpdates = () => {
      const updateTypes: Array<{
        type: UpdateType;
        getMessage: (userName: string, role: string) => string;
      }> = [
        {
          type: "new_recycling",
          getMessage: (userName, role) =>
            `${userName} (${role}) just recycled 5kg of e-waste!`,
        },
        {
          type: "points_earned",
          getMessage: (userName, role) =>
            `${userName} (${role}) earned 500 points`,
        },
        {
          type: "achievement_unlocked",
          getMessage: (userName, role) =>
            `${userName} (${role}) unlocked the "Eco Warrior" achievement`,
        },
        {
          type: "new_event",
          getMessage: (userName, role) =>
            `New event created by ${userName} (${role}): E-Waste Collection Drive`,
        },
        {
          type: "new_comment",
          getMessage: (userName, role) =>
            `${userName} (${role}) commented on your post`,
        },
        {
          type: "leaderboard_change",
          getMessage: (userName, role) =>
            `${userName} (${role}) moved up to #5 on the leaderboard!`,
        },
        {
          type: "center_status",
          getMessage: (userName, role) =>
            `Collection Center updated by ${userName} (${role}): Now accepting mobile devices`,
        },
        {
          type: "admin_announcement",
          getMessage: (userName, _role) =>
            `Admin ${userName}: New recycling guidelines are now available`,
        },
      ];

      // Simulate other users
      const simulatedUsers = [
        { name: "Rajesh Kumar", role: "user" as const },
        { name: "Priya Sharma", role: "user" as const },
        { name: "Admin Team", role: "admin" as const },
        { name: "Worker Mohan", role: "worker" as const },
        {
          name: "GreenTech Org",
          role: "organization" as const,
        },
        { name: "Anjali Reddy", role: "user" as const },
      ];

      // Generate a random update
      const randomUpdateType =
        updateTypes[
          Math.floor(Math.random() * updateTypes.length)
        ];
      const randomUser =
        simulatedUsers[
          Math.floor(Math.random() * simulatedUsers.length)
        ];

      // Don't create updates from the current user
      if (randomUser.name === user.name) {
        return;
      }

      addUpdate({
        type: randomUpdateType.type,
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        userName: randomUser.name,
        userRole: randomUser.role,
        message: randomUpdateType.getMessage(
          randomUser.name,
          randomUser.role,
        ),
        data: {
          points: Math.floor(Math.random() * 1000),
          recycledAmount: Math.floor(Math.random() * 20),
        },
      });
    };

    // Simulate real-time updates every 15-30 seconds
    const interval = setInterval(
      () => {
        if (Math.random() > 0.3) {
          // 70% chance of update
          simulateRealtimeUpdates();
        }
      },
      Math.random() * 15000 + 15000,
    ); // Random between 15-30 seconds

    // Initial updates for demo
    setTimeout(() => {
      addUpdate({
        type: "new_recycling",
        userId: "user_demo1",
        userName: "Rajesh Kumar",
        userRole: "user",
        message:
          "Rajesh Kumar (user) just recycled 8kg of e-waste!",
        data: { recycledAmount: 8 },
      });
    }, 2000);

    setTimeout(() => {
      addUpdate({
        type: "admin_announcement",
        userId: "admin_demo",
        userName: "Admin Team",
        userRole: "admin",
        message:
          "Admin Team: Welcome to the real-time update system! Stay connected with the community.",
        data: {},
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [isAuthenticated, user, addUpdate]);

  /*
  const _broadcastActivity = useCallback(
    (type: UpdateType, message: string, data?: any) => {
      if (!isAuthenticated || !user) return;
      addUpdate({
        type,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        message: `You ${message}`,
        data,
      });
    },
    [isAuthenticated, user, addUpdate],
  );
  */

  // Save updates to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(
        "realtimeUpdates",
        JSON.stringify(updates.slice(0, 50)),
      ); // Keep last 50
    }
  }, [updates, isAuthenticated]);

  // Load updates from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem("realtimeUpdates");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUpdates(
            parsed.map((u: any) => ({
              ...u,
              timestamp: new Date(u.timestamp),
            })),
          );
        } catch (e) {
          console.error("Failed to load saved updates:", e);
        }
      }
    }
  }, [isAuthenticated]);

  const value: RealtimeContextType = {
    updates,
    unreadCount,
    addUpdate,
    markAsRead,
    markAllAsRead,
    clearUpdates,
    isConnected,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

// Helper hook to broadcast user activities
export const useBroadcastActivity = () => {
  const { user } = useAuth();
  const { addUpdate } = useRealtime();

  return useCallback(
    (type: UpdateType, action: string, data?: any) => {
      if (!user) return;

      const messages: Record<
        UpdateType,
        (name: string) => string
      > = {
        new_recycling: (name) =>
          `${name} (${user.role}) just recycled ${data?.amount || 0}kg of e-waste!`,
        points_earned: (name) =>
          `${name} (${user.role}) earned ${data?.points || 0} points`,
        achievement_unlocked: (name) =>
          `${name} (${user.role}) unlocked "${data?.achievement || "an achievement"}"`,
        new_event: (name) =>
          `${name} (${user.role}) created a new event: ${data?.eventName || "Event"}`,
        new_comment: (name) =>
          `${name} (${user.role}) ${action}`,
        new_follower: (name) =>
          `${name} (${user.role}) ${action}`,
        admin_announcement: (name) =>
          `Admin ${name}: ${action}`,
        center_status: (name) =>
          `Collection Center updated by ${name} (${user.role}): ${action}`,
        leaderboard_change: (name) =>
          `${name} (${user.role}) ${action}`,
        reward_redeemed: (name) =>
          `${name} (${user.role}) redeemed ${data?.reward || "a reward"}`,
      };

      addUpdate({
        type,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        message: messages[type](user.name),
        data,
      });
    },
    [user, addUpdate],
  );
};