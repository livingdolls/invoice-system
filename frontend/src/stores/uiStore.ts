import { create } from "zustand";
import { devtools } from "zustand/middleware";

// UI state interface
interface UIState {
  // Theme
  theme: "light" | "dark" | "system";

  // Notifications
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
  }>;
}

interface UIActions {
  // Theme actions
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Notification actions
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

// Create UI store
export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      theme: "light",
      notifications: [],

      // Theme actions
      setTheme: (theme) =>
        set(
          () => ({
            theme,
          }),
          false,
          "ui/setTheme"
        ),

      // Notification actions
      addNotification: (notification) =>
        set(
          (state) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newNotification = { ...notification, id };

            // Auto-remove notification after duration
            if (notification.duration !== 0) {
              setTimeout(() => {
                get().removeNotification(id);
              }, notification.duration || 5000);
            }

            return {
              notifications: [...state.notifications, newNotification],
            };
          },
          false,
          "ui/addNotification"
        ),

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          "ui/removeNotification"
        ),

      clearNotifications: () =>
        set(
          () => ({
            notifications: [],
          }),
          false,
          "ui/clearNotifications"
        ),
    }),
    {
      name: "ui-store",
    }
  )
);
