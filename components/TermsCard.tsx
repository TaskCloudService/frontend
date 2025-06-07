"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import styles from "./TermsCard.module.css";

type TermItem = {
  id: number;
  location: string;
  text: string;
};

export default function TermsCard({ location }: { location: string }) {
  const { accessToken } = useAuth();
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Please sign in to view terms.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`/api/terms/${encodeURIComponent(location)}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setTerms(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load terms:", err.response || err);
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              (err.response.data as any)?.error || err.response.statusText
            }`
          );
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [location, accessToken]);

  if (loading) return <div className={styles.card}>Loading terms…</div>;
  if (error) return <div className={styles.card}>⚠️ {error}</div>;
  if (terms.length === 0)
    return <div className={styles.card}>No terms found for “{location}.”</div>;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Terms &amp; Conditions ({location})</h3>
      <ol className={styles.list}>
        {terms.map((t) => (
          <li key={t.id} className={styles.item}>
            {t.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
