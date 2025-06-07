// Made by ChatGPT4o and slightly modified by me
// Custom hook to access the notification system from anywhere in the app
// Wraps your app/component tree to provide notification state and auto-fetches notifications on mount and refreshes every 60 seconds
// Taken from environment variable NEXT_PUBLIC_API_NOTE_URL
// Generic utility for making authenticated fetch requests which automatically handles JSON body, headers, and error handling
// The states that update markRead, deleteNotification and addNotification
// Requires AuthContext (useAuth) to provide accessToken for secure API calls

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";


const BASE_URL = (process.env.NEXT_PUBLIC_API_NOTE_URL ?? "").replace(
  /\/+$/,
  ""
);
const NOTIF_ENDPOINT = `${BASE_URL}/api/notifications`;

export interface Notification {
  id: number;
  title: string;
  message?: string;
  eventId: string;
  read: boolean;
  createdUtc: string;
}

interface NotificationContextShape {
  notifications: Notification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  addNotification: (n: Notification) => void;
}

const NotificationContext = createContext<NotificationContextShape | null>(
  null
);

async function api<T>(
  url: string,
  method: "GET" | "POST" | "DELETE",
  token: string,
  body?: any
): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status}`);
  }
  if (res.status === 204) {
    return null as any;
  }
  return res.json();
}

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    const data = await api<Notification[]>(
      `${NOTIF_ENDPOINT}?take=30`,
      "GET",
      accessToken
    );
    setNotifications(data);
  }, [accessToken]);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 60_000); 
    return () => clearInterval(iv);
  }, [refresh]);

  const markRead = async (id: number) => {
    if (!accessToken) return;
    await api<void>(
      `${NOTIF_ENDPOINT}/${id}/read`,
      "POST",
      accessToken
    );
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = async (id: number) => {
    if (!accessToken) return;
    await api<void>(
      `${NOTIF_ENDPOINT}/${id}`,
      "DELETE",
      accessToken
    );
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (n: Notification) =>
    setNotifications((prev) => [n, ...prev]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refresh,
        markRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return ctx;
};
