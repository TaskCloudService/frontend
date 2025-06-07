"use client";

import { FormEvent, useState } from "react";
import styles from "./CodeStep.module.css";

interface Props {
  userId: string;
  onDone: () => void;
}

export function CodeStep({ userId, onDone }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code");
      onDone();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formHeader}>Enter the code you recieved in your email</h2>
      <div className={styles.field}>
      <label htmlFor="code" className={styles.label}>Verification Code</label>
      <input
        id="code"
        type="text"
        placeholder="Enter the code you received"
        className={styles.input}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
    </div>

      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Verify Email
      </button>
    </form>
  );
}
