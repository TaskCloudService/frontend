"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ScheduleCard.module.css";

type ScheduleItem = {
  id: number;
  location: string;
  start: string;
  end: string;
  description: string;
};

export default function ScheduleCard({ location }: { location: string }) {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Not logged in");
      return;
    }

    axios
      .get(`/api/schedule/${encodeURIComponent(location)}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("Failed to load schedule:", err.response || err);
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              (err.response.data as any)?.error || err.response.statusText
            }`
          );
        } else {
          setError(err.message);
        }
      });
  }, [location, accessToken]);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Event Schedule</h2>
      {error ? (
        <div className={styles.error}>⚠️ {error}</div>
      ) : items.length === 0 ? (
        <p className={styles.message}>No events found for “{location}.”</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.time}><strong>{item.start}</strong> – <strong>{item.end}</strong></span><span> - </span>{item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
