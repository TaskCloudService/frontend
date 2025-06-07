"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ProhibitedItemsCard.module.css";

type ProhibitedItem = {
  id: number;
  location: string;
  mapUrl: string;
  description: string;
};

export default function ProhibitedItemsCard({ location }: { location: string }) {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<ProhibitedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Please sign in to view prohibited items.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get<ProhibitedItem[]>(`/api/prohibited-items/${encodeURIComponent(location)}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setItems(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load prohibited items:", err.response || err);
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, [location, accessToken]);

  if (loading) return <div className={styles.card}>Loading prohibited items…</div>;
  if (error) return <div className={styles.card}>⚠️ {error}</div>;
  if (items.length === 0) return <div className={styles.card}>No prohibited items for “{location}.”</div>;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Prohibited Items ({location})</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={item.mapUrl} alt={`Prohibited item ${item.id}`} className={styles.image} />
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
