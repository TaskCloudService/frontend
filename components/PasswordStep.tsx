"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./PasswordStep.module.css";
import { validatePassword } from "../lib/Validation";

interface Props {
  email: string;
  onNext: () => void;
  onVerificationNeeded: (userId: string) => void;
}

export function PasswordStep({ email, onNext, onVerificationNeeded }: Props) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login(email, password);
      
      if (result.requiresVerification && result.userId) {
        console.log("Unverified, going to CodeStep");
        onVerificationNeeded(result.userId);
      }
      else {
        console.log("Verified, closing modal");
        onNext(); 
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formHeader}>Enter your password</h2>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Log In
      </button>
    </form>
  );
}
