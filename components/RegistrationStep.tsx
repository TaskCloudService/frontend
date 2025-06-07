// components/RegistrationStep.tsx
"use client";
import { FormEvent, useState } from "react";
import styles from "./RegistrationStep.module.css";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../lib/Validation";

interface Props {
  onNext: (userId: string) => void;
}

export function RegistrationStep({ onNext }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstNameError, setFirstNameError]   = useState<string | null>(null);
  const [lastNameError,  setLastNameError]    = useState<string | null>(null);
  const [emailError,     setEmailError]       = useState<string | null>(null);
  const [passwordError,  setPasswordError]    = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

   const validateName = (value: string) =>
    value.trim() ? null : "This field is required";

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const fnErr = validateName(firstName);
    const lnErr = validateName(lastName);
    const emErr = validateEmail(email);
    const pwErr = validatePassword(password);
    const cpErr = validateConfirmPassword(password, confirmPassword);

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setEmailError(emErr);
    setPasswordError(pwErr);
    setConfirmPasswordError(cpErr);

    if (fnErr || lnErr || emErr || pwErr || cpErr) return;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg =
          Array.isArray(data.errors)
            ? data.errors.join(", ")
            : data.message || "Registration failed";
        throw new Error(msg);
      }
      onNext(data.userId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="firstName" className={styles.label}>
          First name
        </label>
        <input
          id="firstName"
          placeholder="Enter your first name"
          className={styles.input}
          value={firstName}
          onChange={(e) => {
            const v = e.target.value;
            setFirstName(v);
            setFirstNameError(validateName(v));
          }}
          required
        />
        {firstNameError && <p className={styles.error}>{firstNameError}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="lastName" className={styles.label}>
          Last name
        </label>
        <input
          id="lastName"
          placeholder="Enter your last name"
          className={styles.input}
          value={lastName}
          onChange={(e) => {
            const v = e.target.value;
            setLastName(v);
            setLastNameError(validateName(v));
          }}
          required
        />
        {lastNameError && <p className={styles.error}>{lastNameError}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={styles.input}
          value={email}
          onChange={(e) => {
            const v = e.target.value;
            setEmail(v);
            setEmailError(validateEmail(v));
          }}
          required
        />
        {emailError && <p className={styles.error}>{emailError}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          className={styles.input}
          value={password}
          onChange={(e) => {
            const v = e.target.value;
            setPassword(v);
            setPasswordError(validatePassword(v));
          }}
          required
        />
        {passwordError && <p className={styles.error}>{passwordError}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => {
            const v = e.target.value;
            setConfirmPassword(v);
            setConfirmPasswordError(validateConfirmPassword(password, v));
          }}
          required
        />
        {confirmPasswordError && (
          <p className={styles.error}>{confirmPasswordError}</p>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button}>
        Register & Send Code
      </button>
    </form>
  );
}
