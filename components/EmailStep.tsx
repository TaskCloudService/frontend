"use client";

import { FormEvent, useState } from "react";
import styles from "./EmailStep.module.css";
import { validateEmail } from "../lib/Validation";

interface Props {
  onNext: (userId: string, email: string) => void;
}

export function EmailStep({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    setEmailError(emailErr);
    if (emailErr) return;
    setError(null);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");
      onNext(data.userId, email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formHeader}>Sign in to buy your tickets</h2>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={styles.input}
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            setEmailError(validateEmail(value));
          }}
          required
        />
        {emailError && <p className={styles.error}>{emailError}</p>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
}
